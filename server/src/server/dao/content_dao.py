"""
Data Access Object for Content operations.

Handles all database operations related to content including:
- Creating new content
- Retrieving content by ID or space
- Updating content information
- Deleting content
"""

from sqlalchemy import select, delete, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from src.server.models.space_models import Content, ContentType
from src.server.models.tag_models import Tag


class ContentDAO:
    """Data Access Object for Content model operations."""

    def __init__(self, db: AsyncSession):
        """
        Initialize ContentDAO with database session.

        Args:
            db: AsyncSession instance for database operations
        """
        self.db = db

    async def _resolve_tags(self, tag_names: list[str]) -> list[Tag]:
        """
        Fetch existing tags matching the given names (case-insensitive) and
        create any that don't exist yet.
        """
        normalized = sorted({name.strip().lower() for name in tag_names if name and name.strip()})
        if not normalized:
            return []

        result = await self.db.execute(select(Tag).where(Tag.name.in_(normalized)))
        existing = {tag.name: tag for tag in result.scalars().all()}

        tags = []
        for name in normalized:
            tag = existing.get(name)
            if tag is None:
                tag = Tag(name=name)
                self.db.add(tag)
                existing[name] = tag
            tags.append(tag)

        return tags

    async def create_content(
        self,
        space_id: int,
        title: str,
        content_type: ContentType,
        content: str,
        url: str | None = None,
        tag_names: list[str] | None = None,
    ) -> Content:
        """
        Create new content in a space.

        Args:
            space_id: ID of the space
            title: Title of the content
            content_type: Type of content (note, link, code)
            content: Content body/text
            url: Optional URL for link type content
            tag_names: Optional list of tag names to attach

        Returns:
            Content: The created content object

        Raises:
            IntegrityError: If database constraint is violated
        """
        new_content = Content(
            space_id=space_id,
            title=title,
            type=content_type.lower(),
            content=content,
            url=url,
        )
        if tag_names:
            new_content.tags = await self._resolve_tags(tag_names)

        self.db.add(new_content)
        await self.db.commit()
        return await self.get_content_by_id(new_content.id)

    async def get_content_by_id(self, content_id: int) -> Content | None:
        """
        Retrieve content by its ID.

        Args:
            content_id: ID of the content to retrieve

        Returns:
            Content | None: The content object if found, None otherwise
        """
        result = await self.db.execute(
            select(Content).options(selectinload(Content.tags)).where(Content.id == content_id)
        )
        return result.scalar_one_or_none()

    async def get_contents_by_space(self, space_id: int) -> list[Content]:
        """
        Retrieve all content in a specific space.

        Args:
            space_id: ID of the space

        Returns:
            list[Content]: List of content in the space, ordered by creation date (newest first)
        """
        result = await self.db.execute(
            select(Content)
            .options(selectinload(Content.tags))
            .where(Content.space_id == space_id)
            .order_by(Content.created_at.desc())
        )
        return result.scalars().all()

    async def get_contents_by_type(
        self,
        space_id: int,
        content_type: ContentType,
    ) -> list[Content]:
        """
        Retrieve content of a specific type in a space.

        Args:
            space_id: ID of the space
            content_type: Type of content to filter by

        Returns:
            list[Content]: List of content matching the type
        """
        result = await self.db.execute(
            select(Content)
            .options(selectinload(Content.tags))
            .where(
                and_(
                    Content.space_id == space_id,
                    Content.type == content_type,
                )
            )
            .order_by(Content.created_at.desc())
        )
        return result.scalars().all()

    async def update_content(
        self,
        content_id: int,
        title: str | None = None,
        content: str | None = None,
        url: str | None = None,
        tag_names: list[str] | None = None,
    ) -> Content | None:
        """
        Update content information.

        Args:
            content_id: ID of the content to update
            title: New title (optional)
            content: New content body (optional)
            url: New URL (optional)
            tag_names: If provided, replaces the content's tags entirely

        Returns:
            Content | None: The updated content object if found, None otherwise
        """
        content_obj = await self.get_content_by_id(content_id)
        if not content_obj:
            return None

        if title is not None:
            content_obj.title = title
        if content is not None:
            content_obj.content = content
        if url is not None:
            content_obj.url = url
        if tag_names is not None:
            content_obj.tags = await self._resolve_tags(tag_names)

        await self.db.commit()
        return await self.get_content_by_id(content_id)

    async def delete_content(self, content_id: int) -> bool:
        """
        Delete content by its ID.

        Args:
            content_id: ID of the content to delete

        Returns:
            bool: True if content was deleted, False if not found
        """
        result = await self.db.execute(
            delete(Content).where(Content.id == content_id)
        )
        await self.db.commit()
        return result.rowcount > 0

