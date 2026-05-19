"""
Service layer for content operations.

Handles business logic for content management including:
- Validation of content data
- Content creation with business rules
- Authorization checks
- Content retrieval with Redis caching
- Content updates and deletion
"""

import logging
from datetime import datetime
from sqlalchemy.exc import IntegrityError

from src.server.core.redis_client import (
    CacheManager,
    get_content_cache_key,
    get_space_contents_by_type_cache_key,
    get_space_contents_cache_key,
    get_space_stats_cache_key,
)
from src.server.dao.content_dao import ContentDAO
from src.server.dao.space_dao import SpaceDAO
from src.server.exceptions.content_exceptions import (
    ContentBodyTooLong,
    ContentCreationFailed,
    ContentNotFound,
    ContentTitleRequired,
    ContentTitleTooLong,
    InvalidContentType,
    InvalidUrlFormat,
    SpaceNotFound,
    UnauthorizedContentAccess,
)
from src.server.models.space_models import Content, ContentType

logger = logging.getLogger(__name__)

# Validation constants
MIN_CONTENT_TITLE_LENGTH = 1
MAX_CONTENT_TITLE_LENGTH = 255
MAX_CONTENT_BODY_LENGTH = 50000


class ContentService:
    """Service for managing content operations."""

    def __init__(self, dao: ContentDAO, space_dao: SpaceDAO):
        """
        Initialize ContentService with DAO dependencies.

        Args:
            dao: ContentDAO instance for content operations
            space_dao: SpaceDAO instance for space operations
        """
        self.dao = dao
        self.space_dao = space_dao
        self.cache = CacheManager(ttl=3600)  # 1 hour cache

    def _validate_content_title(self, title: str) -> None:
        """
        Validate content title according to business rules.

        Args:
            title: Content title to validate

        Raises:
            ContentTitleRequired: If title is empty
            ContentTitleTooLong: If title exceeds maximum length
        """
        if not title or not title.strip():
            raise ContentTitleRequired()

        trimmed_title = title.strip()

        if len(trimmed_title) > MAX_CONTENT_TITLE_LENGTH:
            raise ContentTitleTooLong(MAX_CONTENT_TITLE_LENGTH)

    def _validate_content_body(self, content: str) -> None:
        """
        Validate content body according to business rules.

        Args:
            content: Content body to validate

        Raises:
            ContentBodyTooLong: If content exceeds maximum length
        """
        if len(content) > MAX_CONTENT_BODY_LENGTH:
            raise ContentBodyTooLong(MAX_CONTENT_BODY_LENGTH)

    def _validate_content_type(self, content_type: str) -> ContentType:
        """
        Validate and convert content type.

        Args:
            content_type: Content type string

        Returns:
            ContentType: Validated content type enum

        Raises:
            InvalidContentType: If content type is invalid
        """
        try:
            # Convert to lowercase to handle case-insensitive input
            return ContentType(content_type.lower())
        except ValueError:
            valid_types = [ct.value for ct in ContentType]
            raise InvalidContentType(valid_types)

    def _validate_url(self, url: str | None) -> str | None:
        """
        Validate URL format if provided.

        Args:
            url: URL to validate

        Returns:
            str | None: Validated URL or None

        Raises:
            InvalidUrlFormat: If URL format is invalid
        """
        if not url:
            return None

        # Basic URL validation
        if not url.startswith(("http://", "https://")):
            raise InvalidUrlFormat()

        return url

    async def create_content(
        self,
        space_id: int,
        title: str,
        content_type: str,
        content: str,
        url: str | None = None,
        user_id: int | None = None,
    ) -> Content:
        """
        Create new content in a space.

        Args:
            space_id: ID of the space
            title: Title of the content
            content_type: Type of content (note, link, code)
            content: Content body/text
            url: Optional URL for link type content
            user_id: Optional user ID for authorization check

        Returns:
            Content: The created content object

        Raises:
            SpaceNotFound: If space doesn't exist
            UnauthorizedContentAccess: If user doesn't own the space
            ContentTitleRequired: If title is empty
            ContentTitleTooLong: If title is too long
            ContentBodyTooLong: If content is too long
            InvalidContentType: If content type is invalid
            InvalidUrlFormat: If URL format is invalid
            ContentCreationFailed: If database operation fails
        """
        # Verify space exists and user owns it
        space = await self.space_dao.get_space_by_id(space_id)
        if not space:
            raise SpaceNotFound(space_id)

        if user_id is not None and space.owner_id != user_id:
            raise UnauthorizedContentAccess()

        # Validate inputs
        self._validate_content_title(title)
        self._validate_content_body(content)
        validated_type = self._validate_content_type(content_type)
        validated_url = self._validate_url(url)
        content_type = content_type.lower()

        # Normalize inputs
        normalized_title = title.strip()

        try:
            # Create content
            new_content = await self.dao.create_content(
                space_id=space_id,
                title=normalized_title,
                content_type=validated_type.lower(),
                content=content,
                url=validated_url,
            )

            # Invalidate cache
            await self.cache.delete(get_space_contents_cache_key(space_id))
            await self.cache.delete(
                get_space_contents_by_type_cache_key(space_id, validated_type.value)
            )
            await self.cache.delete(get_space_stats_cache_key(space_id))

            logger.info(f"Content created: {new_content.id} in space {space_id}")
            return new_content

        except IntegrityError as e:
            raise ContentCreationFailed(reason="Database constraint violation")
        except Exception as e:
            raise ContentCreationFailed(reason=f"Unexpected error: {str(e)}")

    async def get_content(
        self,
        content_id: int,
        space_id: int | None = None,
        user_id: int | None = None,
    ) -> Content:
        """
        Retrieve content by ID with optional authorization check.

        Args:
            content_id: ID of the content
            space_id: Optional space ID for verification
            user_id: Optional user ID for authorization check

        Returns:
            Content: The content object

        Raises:
            ContentNotFound: If content doesn't exist
            UnauthorizedContentAccess: If user doesn't have permission
        """
        # Try cache first
        cache_key = get_content_cache_key(content_id)
        cached_content = await self.cache.get(cache_key)
        if cached_content is not None:
            logger.info(f"Content {content_id} retrieved from cache")
            # Reconstruct Content object from cached dictionary
            if isinstance(cached_content, dict):
                cached_content['type'] = ContentType(cached_content['type'])
                # Convert ISO format string back to datetime
                if isinstance(cached_content.get('created_at'), str):
                    cached_content['created_at'] = datetime.fromisoformat(cached_content['created_at'])
                return Content(**cached_content)

        # Get from database
        content = await self.dao.get_content_by_id(content_id)
        if not content:
            raise ContentNotFound(content_id)

        # Verify space if provided
        if space_id is not None and content.space_id != space_id:
            raise ContentNotFound(content_id)

        # Check authorization if user_id provided
        if user_id is not None:
            space = await self.space_dao.get_space_by_id(content.space_id)
            if not space or space.owner_id != user_id:
                raise UnauthorizedContentAccess(content_id)

        # Cache the content as a dictionary
        content_dict = {
            "id": content.id,
            "space_id": content.space_id,
            "title": content.title,
            "type": content.type.value,
            "content": content.content,
            "url": content.url,
            "created_at": content.created_at.isoformat(),
        }
        await self.cache.set(cache_key, content_dict)

        return content

    async def get_space_contents(
        self,
        space_id: int,
        user_id: int | None = None,
        use_cache: bool = True,
    ) -> list[Content]:
        """
        Retrieve all content in a space with caching.

        Args:
            space_id: ID of the space
            user_id: Optional user ID for authorization check
            use_cache: Whether to use cache (default: True)

        Returns:
            list[Content]: List of content in the space

        Raises:
            SpaceNotFound: If space doesn't exist
            UnauthorizedContentAccess: If user doesn't own the space
        """
        # Verify space exists and user owns it
        space = await self.space_dao.get_space_by_id(space_id)
        if not space:
            raise SpaceNotFound(space_id)

        if user_id is not None and space.owner_id != user_id:
            raise UnauthorizedContentAccess()

        # Try cache first
        if use_cache:
            cache_key = get_space_contents_cache_key(space_id)
            cached_contents = await self.cache.get(cache_key)
            if cached_contents is not None:
                logger.info(f"Space {space_id} contents retrieved from cache")
                # Reconstruct Content objects from cached dictionaries
                if isinstance(cached_contents, list):
                    contents = []
                    for item in cached_contents:
                        if isinstance(item, dict):
                            item['type'] = ContentType(item['type'])
                            # Convert ISO format string back to datetime
                            if isinstance(item.get('created_at'), str):
                                item['created_at'] = datetime.fromisoformat(item['created_at'])
                            contents.append(Content(**item))
                    return contents

        # Get from database
        contents = await self.dao.get_contents_by_space(space_id)

        # Cache the results as dictionaries
        if use_cache:
            contents_dicts = [
                {
                    "id": c.id,
                    "space_id": c.space_id,
                    "title": c.title,
                    "type": c.type.value,
                    "content": c.content,
                    "url": c.url,
                    "created_at": c.created_at.isoformat(),
                }
                for c in contents
            ]
            await self.cache.set(get_space_contents_cache_key(space_id), contents_dicts)

        return contents

    async def get_space_contents_by_type(
        self,
        space_id: int,
        content_type: str,
        user_id: int | None = None,
        use_cache: bool = True,
    ) -> list[Content]:
        """
        Retrieve content of a specific type in a space.

        Args:
            space_id: ID of the space
            content_type: Type of content to filter by
            user_id: Optional user ID for authorization check
            use_cache: Whether to use cache (default: True)

        Returns:
            list[Content]: List of content matching the type

        Raises:
            SpaceNotFound: If space doesn't exist
            UnauthorizedContentAccess: If user doesn't own the space
            InvalidContentType: If content type is invalid
        """
        # Verify space exists and user owns it
        space = await self.space_dao.get_space_by_id(space_id)
        if not space:
            raise SpaceNotFound(space_id)

        if user_id is not None and space.owner_id != user_id:
            raise UnauthorizedContentAccess()

        # Validate content type
        validated_type = self._validate_content_type(content_type)

        # Try cache first
        if use_cache:
            cache_key = get_space_contents_by_type_cache_key(space_id, validated_type.value)
            cached_contents = await self.cache.get(cache_key)
            if cached_contents is not None:
                logger.info(f"Space {space_id} contents by type retrieved from cache")
                # Reconstruct Content objects from cached dictionaries
                if isinstance(cached_contents, list):
                    contents = []
                    for item in cached_contents:
                        if isinstance(item, dict):
                            item['type'] = ContentType(item['type'])
                            # Convert ISO format string back to datetime
                            if isinstance(item.get('created_at'), str):
                                item['created_at'] = datetime.fromisoformat(item['created_at'])
                            contents.append(Content(**item))
                    return contents

        # Get from database
        contents = await self.dao.get_contents_by_type(space_id, validated_type)

        # Cache the results as dictionaries
        if use_cache:
            contents_dicts = [
                {
                    "id": c.id,
                    "space_id": c.space_id,
                    "title": c.title,
                    "type": c.type.value,
                    "content": c.content,
                    "url": c.url,
                    "created_at": c.created_at.isoformat(),
                }
                for c in contents
            ]
            await self.cache.set(
                get_space_contents_by_type_cache_key(space_id, validated_type.value),
                contents_dicts,
            )

        return contents

    async def update_content(
        self,
        content_id: int,
        space_id: int,
        user_id: int,
        title: str | None = None,
        content: str | None = None,
        url: str | None = None,
    ) -> Content:
        """
        Update content with authorization and validation.

        Args:
            content_id: ID of the content to update
            space_id: ID of the space (for verification)
            user_id: ID of the user performing the update
            title: New title (optional)
            content: New content body (optional)
            url: New URL (optional)

        Returns:
            Content: The updated content object

        Raises:
            ContentNotFound: If content doesn't exist
            UnauthorizedContentAccess: If user doesn't have permission
            ContentTitleTooLong: If new title is too long
            ContentBodyTooLong: If new content is too long
            InvalidUrlFormat: If URL format is invalid
        """
        # Get and verify content
        content_obj = await self.get_content(content_id, space_id, user_id)

        # Validate new values if provided
        if title is not None:
            self._validate_content_title(title)
            title = title.strip()

        if content is not None:
            self._validate_content_body(content)

        if url is not None:
            url = self._validate_url(url)

        # Update content
        updated_content = await self.dao.update_content(
            content_id=content_id,
            title=title,
            content=content,
            url=url,
        )

        if not updated_content:
            raise ContentNotFound(content_id)

        # Invalidate cache
        await self.cache.delete(get_content_cache_key(content_id))
        await self.cache.delete(get_space_contents_cache_key(space_id))

        logger.info(f"Content {content_id} updated")
        return updated_content

    async def delete_content(
        self,
        content_id: int,
        space_id: int,
        user_id: int,
    ) -> None:
        """
        Delete content with authorization check.

        Args:
            content_id: ID of the content to delete
            space_id: ID of the space (for verification)
            user_id: ID of the user performing the deletion

        Raises:
            ContentNotFound: If content doesn't exist
            UnauthorizedContentAccess: If user doesn't have permission
        """
        # Get and verify content
        await self.get_content(content_id, space_id, user_id)

        # Delete content
        deleted = await self.dao.delete_content(content_id)

        if not deleted:
            raise ContentNotFound(content_id)

        # Invalidate cache
        await self.cache.delete(get_content_cache_key(content_id))
        await self.cache.delete(get_space_contents_cache_key(space_id))

        logger.info(f"Content {content_id} deleted")
