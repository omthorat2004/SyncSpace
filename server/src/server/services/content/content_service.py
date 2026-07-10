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

logging.getLogger("src.server.services.content_service").setLevel(logging.INFO)

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

    async def _check_access(self, space, user_id: int | None, require_edit: bool = False) -> None:
        """
        Authorize a user against a space: the owner always has full access;
        shared members need at least a 'view' permission to read and an
        'edit' permission to create/update/delete content.
        """
        if user_id is None or space.owner_id == user_id:
            return

        permission = await self.space_dao.get_member_permission(space.id, user_id)
        if permission is None:
            raise UnauthorizedContentAccess()
        if require_edit and permission != "edit":
            raise UnauthorizedContentAccess()

    @staticmethod
    def _with_tag_names(content: Content) -> Content:
        """
        Stamp a plain `tag_names: list[str]` attribute onto a Content instance,
        computed from the real `tags` relationship. Response building always
        reads `tag_names` (never the relationship directly) so it works
        identically for objects freshly loaded from the DB and for objects
        reconstructed from a Redis cache hit (see _content_from_cache_item).
        """
        content.tag_names = [tag.name for tag in content.tags]
        return content

    @staticmethod
    def _content_to_cache_item(content: Content) -> dict:
        return {
            "id": content.id,
            "space_id": content.space_id,
            "title": content.title,
            "type": content.type.value,
            "content": content.content,
            "url": content.url,
            "created_at": content.created_at.isoformat(),
            "tags": getattr(content, "tag_names", []),
        }

    @staticmethod
    def _content_from_cache_item(item: dict) -> Content:
        tag_names = item.get("tags", []) or []
        content = Content(
            id=item["id"],
            space_id=item["space_id"],
            title=item["title"],
            type=ContentType(item["type"]),
            content=item["content"],
            url=item["url"],
            created_at=datetime.fromisoformat(item["created_at"]) if isinstance(item.get("created_at"), str) else item["created_at"],
        )
        content.tag_names = tag_names
        return content

    def _validate_content_title(self, title: str) -> None:
        """
        Validate content title according to business rules.

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

        Raises:
            ContentBodyTooLong: If content exceeds maximum length
        """
        if len(content) > MAX_CONTENT_BODY_LENGTH:
            raise ContentBodyTooLong(MAX_CONTENT_BODY_LENGTH)

    def _validate_content_type(self, content_type: str) -> ContentType:
        """
        Validate and convert content type.

        Raises:
            InvalidContentType: If content type is invalid
        """
        try:
            return ContentType(content_type.lower())
        except ValueError:
            valid_types = [ct.value for ct in ContentType]
            raise InvalidContentType(valid_types)

    def _validate_url(self, url: str | None) -> str | None:
        """
        Validate URL format if provided.

        Raises:
            InvalidUrlFormat: If URL format is invalid
        """
        if not url:
            return None

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
        tags: list[str] | None = None,
        user_id: int | None = None,
    ) -> Content:
        """
        Create new content in a space.

        Raises:
            SpaceNotFound: If space doesn't exist
            UnauthorizedContentAccess: If user doesn't have edit access
            ContentTitleRequired: If title is empty
            ContentTitleTooLong: If title is too long
            ContentBodyTooLong: If content is too long
            InvalidContentType: If content type is invalid
            InvalidUrlFormat: If URL format is invalid
            ContentCreationFailed: If database operation fails
        """
        space = await self.space_dao.get_space_by_id(space_id)
        if not space:
            raise SpaceNotFound(space_id)

        await self._check_access(space, user_id, require_edit=True)

        self._validate_content_title(title)
        self._validate_content_body(content)
        validated_type = self._validate_content_type(content_type)
        validated_url = self._validate_url(url)

        normalized_title = title.strip()

        try:
            new_content = await self.dao.create_content(
                space_id=space_id,
                title=normalized_title,
                content_type=validated_type.lower(),
                content=content,
                url=validated_url,
                tag_names=tags,
            )

            await self.space_dao.touch_space(space_id=space_id)
            self._with_tag_names(new_content)

            # Invalidate every cache entry this new item could affect
            await self.cache.delete(get_space_contents_cache_key(space_id))
            await self.cache.delete(
                get_space_contents_by_type_cache_key(space_id, validated_type.value)
            )
            await self.cache.delete(get_space_stats_cache_key(space_id))

            logger.info(f"Content created: {new_content.id} in space {space_id}")
            return new_content

        except IntegrityError:
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

        Raises:
            ContentNotFound: If content doesn't exist
            UnauthorizedContentAccess: If user doesn't have permission
        """
        cache_key = get_content_cache_key(content_id)
        cached_content = await self.cache.get(cache_key)
        if isinstance(cached_content, dict):
            logger.info(f"Content {content_id} retrieved from cache")
            content = self._content_from_cache_item(cached_content)
            if space_id is not None and content.space_id != space_id:
                raise ContentNotFound(content_id)
            if user_id is not None:
                space = await self.space_dao.get_space_by_id(content.space_id)
                if not space:
                    raise UnauthorizedContentAccess(content_id)
                try:
                    await self._check_access(space, user_id, require_edit=False)
                except UnauthorizedContentAccess:
                    raise UnauthorizedContentAccess(content_id)
            return content

        logger.info("Cache MISS")

        content = await self.dao.get_content_by_id(content_id)
        if not content:
            raise ContentNotFound(content_id)

        if space_id is not None and content.space_id != space_id:
            raise ContentNotFound(content_id)

        if user_id is not None:
            space = await self.space_dao.get_space_by_id(content.space_id)
            if not space:
                raise UnauthorizedContentAccess(content_id)
            try:
                await self._check_access(space, user_id, require_edit=False)
            except UnauthorizedContentAccess:
                raise UnauthorizedContentAccess(content_id)

        self._with_tag_names(content)
        await self.cache.set(cache_key, self._content_to_cache_item(content))

        return content

    async def get_space_contents(
        self,
        space_id: int,
        user_id: int | None = None,
        use_cache: bool = True,
    ) -> list[Content]:
        """
        Retrieve all content in a space with caching.

        Raises:
            SpaceNotFound: If space doesn't exist
            UnauthorizedContentAccess: If user doesn't have access
        """
        space = await self.space_dao.get_space_by_id(space_id)
        if not space:
            raise SpaceNotFound(space_id)

        await self._check_access(space, user_id, require_edit=False)

        if use_cache:
            cache_key = get_space_contents_cache_key(space_id)
            cached_contents = await self.cache.get(cache_key)
            if isinstance(cached_contents, list):
                logger.info(f"Space {space_id} contents retrieved from cache")
                return [self._content_from_cache_item(item) for item in cached_contents if isinstance(item, dict)]

        logger.info("Cache Miss")
        contents = await self.dao.get_contents_by_space(space_id)
        for c in contents:
            self._with_tag_names(c)

        if use_cache:
            await self.cache.set(
                get_space_contents_cache_key(space_id),
                [self._content_to_cache_item(c) for c in contents],
            )

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

        Raises:
            SpaceNotFound: If space doesn't exist
            UnauthorizedContentAccess: If user doesn't have access
            InvalidContentType: If content type is invalid
        """
        space = await self.space_dao.get_space_by_id(space_id)
        if not space:
            raise SpaceNotFound(space_id)

        await self._check_access(space, user_id, require_edit=False)

        validated_type = self._validate_content_type(content_type)

        if use_cache:
            cache_key = get_space_contents_by_type_cache_key(space_id, validated_type.value)
            cached_contents = await self.cache.get(cache_key)
            if isinstance(cached_contents, list):
                logger.info(f"Space {space_id} contents by type retrieved from cache")
                return [self._content_from_cache_item(item) for item in cached_contents if isinstance(item, dict)]

        contents = await self.dao.get_contents_by_type(space_id, validated_type)
        for c in contents:
            self._with_tag_names(c)

        if use_cache:
            await self.cache.set(
                get_space_contents_by_type_cache_key(space_id, validated_type.value),
                [self._content_to_cache_item(c) for c in contents],
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
        tags: list[str] | None = None,
    ) -> Content:
        """
        Update content with authorization and validation.

        Raises:
            ContentNotFound: If content doesn't exist
            UnauthorizedContentAccess: If user doesn't have permission
            ContentTitleTooLong: If new title is too long
            ContentBodyTooLong: If new content is too long
            InvalidUrlFormat: If URL format is invalid
        """
        # Get and verify content, then require edit permission to modify it
        content_obj = await self.get_content(content_id, space_id, user_id)
        space = await self.space_dao.get_space_by_id(space_id)
        if space:
            await self._check_access(space, user_id, require_edit=True)

        if title is not None:
            self._validate_content_title(title)
            title = title.strip()

        if content is not None:
            self._validate_content_body(content)

        if url is not None:
            url = self._validate_url(url)

        updated_content = await self.dao.update_content(
            content_id=content_id,
            title=title,
            content=content,
            url=url,
            tag_names=tags,
        )

        if not updated_content:
            raise ContentNotFound(content_id)

        self._with_tag_names(updated_content)

        # Invalidate every cache entry that could now be stale, including the
        # type-filtered listing (previously missed, so edits didn't show up
        # when browsing a space filtered by content type).
        await self.cache.delete(get_content_cache_key(content_id))
        await self.cache.delete(get_space_contents_cache_key(space_id))
        await self.cache.delete(
            get_space_contents_by_type_cache_key(space_id, content_obj.type.value)
        )

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

        Raises:
            ContentNotFound: If content doesn't exist
            UnauthorizedContentAccess: If user doesn't have permission
        """
        # Get and verify content, then require edit permission to delete it
        content_obj = await self.get_content(content_id, space_id, user_id)
        space = await self.space_dao.get_space_by_id(space_id)
        if space:
            await self._check_access(space, user_id, require_edit=True)

        deleted = await self.dao.delete_content(content_id)

        if not deleted:
            raise ContentNotFound(content_id)

        # Invalidate every cache entry that could now be stale, including the
        # type-filtered listing (previously missed).
        await self.cache.delete(get_content_cache_key(content_id))
        await self.cache.delete(get_space_contents_cache_key(space_id))
        await self.cache.delete(
            get_space_contents_by_type_cache_key(space_id, content_obj.type.value)
        )

        logger.info(f"Content {content_id} deleted")
