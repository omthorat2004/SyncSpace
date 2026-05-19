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
from src.server.models.space_models import Content, ContentType


class ContentDAO:
    """Data Access Object for Content model operations."""

    def __init__(self, db: AsyncSession):
        """
        Initialize ContentDAO with database session.

        Args:
            db: AsyncSession instance for database operations
        """
        self.db = db

    async def create_content(
        self,
        space_id: int,
        title: str,
        content_type: ContentType,
        content: str,
        url: str | None = None,
    ) -> Content:
        """
        Create new content in a space.

        Args:
            space_id: ID of the space
            title: Title of the content
            content_type: Type of content (note, link, code)
            content: Content body/text
            url: Optional URL for link type content

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
        self.db.add(new_content)
        await self.db.commit()
        await self.db.refresh(new_content)
        return new_content

    async def get_content_by_id(self, content_id: int) -> Content | None:
        """
        Retrieve content by its ID.

        Args:
            content_id: ID of the content to retrieve

        Returns:
            Content | None: The content object if found, None otherwise
        """
        result = await self.db.execute(
            select(Content).where(Content.id == content_id)
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
    ) -> Content | None:
        """
        Update content information.

        Args:
            content_id: ID of the content to update
            title: New title (optional)
            content: New content body (optional)
            url: New URL (optional)

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

        await self.db.commit()
        await self.db.refresh(content_obj)
        return content_obj

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

    async def content_exists(self, content_id: int) -> bool:
        """
        Check if content exists.

        Args:
            content_id: ID of the content to check

        Returns:
            bool: True if content exists, False otherwise
        """
        result = await self.db.execute(
            select(Content).where(Content.id == content_id)
        )
        return result.scalar_one_or_none() is not None

    async def is_content_in_space(self, content_id: int, space_id: int) -> bool:
        """
        Check if content belongs to a specific space.

        Args:
            content_id: ID of the content
            space_id: ID of the space

        Returns:
            bool: True if content is in the space, False otherwise
        """
        result = await self.db.execute(
            select(Content).where(
                and_(
                    Content.id == content_id,
                    Content.space_id == space_id,
                )
            )
        )
        return result.scalar_one_or_none() is not None

    async def count_contents_in_space(self, space_id: int) -> int:
        """
        Count total content items in a space.

        Args:
            space_id: ID of the space

        Returns:
            int: Total count of content items
        """
        result = await self.db.execute(
            select(Content).where(Content.space_id == space_id)
        )
        return len(result.scalars().all())
