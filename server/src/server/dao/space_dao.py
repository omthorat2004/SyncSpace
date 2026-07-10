"""
Data Access Object for Space operations.

Handles all database operations related to spaces including:
- Creating new spaces
- Retrieving spaces by ID or owner
- Updating space information
- Deleting spaces
"""

from sqlalchemy import select, delete, update, func
from sqlalchemy.ext.asyncio import AsyncSession
from src.server.models.space_models import Space, Content
from src.server.models.space_member_model import SpaceMember
from datetime import datetime


class SpaceDAO:
    """Data Access Object for Space model operations."""

    def __init__(self, db: AsyncSession):
        """
        Initialize SpaceDAO with database session.

        Args:
            db: AsyncSession instance for database operations
        """
        self.db = db

    async def create_space(self, name: str, description: str | None, owner_id: int) -> Space:
        """
        Create a new space in the database.

        Args:
            name: Name of the space
            description: Optional description of the space
            owner_id: ID of the user creating the space

        Returns:
            Space: The created space object

        Raises:
            IntegrityError: If database constraint is violated
        """
        new_space = Space(
            name=name,
            description=description,
            owner_id=owner_id,
        )
        self.db.add(new_space)
        await self.db.commit()
        await self.db.refresh(new_space)
        return new_space

    async def get_space_by_id(self, space_id: int) -> Space | None:
        """
        Retrieve a space by its ID.

        Args:
            space_id: ID of the space to retrieve

        Returns:
            Space | None: The space object if found, None otherwise
        """
        result = await self.db.execute(
            select(Space).where(Space.id == space_id)
        )
        return result.scalar_one_or_none()

    async def update_space(
        self,
        space_id: int,
        name: str | None = None,
        description: str | None = None,
    ) -> Space | None:
        """
        Update space information.

        Args:
            space_id: ID of the space to update
            name: New name for the space (optional)
            description: New description for the space (optional)

        Returns:
            Space | None: The updated space object if found, None otherwise
        """
        space = await self.get_space_by_id(space_id)
        if not space:
            return None

        if name is not None:
            space.name = name
        if description is not None:
            space.description = description

        await self.db.commit()
        await self.db.refresh(space)
        return space

    async def delete_space(self, space_id: int) -> bool:
        """
        Delete a space by its ID.

        Args:
            space_id: ID of the space to delete

        Returns:
            bool: True if space was deleted, False if not found
        """
        result = await self.db.execute(
            delete(Space).where(Space.id == space_id)
        )
        await self.db.commit()
        return result.rowcount > 0

    async def touch_space(self, space_id: int) -> None:
        await self.db.execute(
            update(Space)
            .where(Space.id == space_id)
            .values(updated_at=datetime.now())
        )

        await self.db.commit()

    async def get_member_permission(self, space_id: int, user_id: int) -> str | None:
        """
        Return the sharing permission a user has on a space they don't own,
        or None if the space isn't shared with them.
        """
        result = await self.db.execute(
            select(SpaceMember.permission).where(
                SpaceMember.space_id == space_id,
                SpaceMember.user_id == user_id,
            )
        )
        return result.scalar_one_or_none()

    async def get_spaces_by_owner_with_counts(
        self, owner_id: int
    ) -> list[tuple[Space, int, int]]:
        """
        Retrieve all spaces owned by a user along with their content and member counts.

        Returns:
            list[tuple[Space, int, int]]: (space, content_count, member_count) tuples
        """
        content_counts = (
            select(Content.space_id, func.count(Content.id).label("content_count"))
            .group_by(Content.space_id)
            .subquery()
        )
        member_counts = (
            select(SpaceMember.space_id, func.count(SpaceMember.id).label("member_count"))
            .group_by(SpaceMember.space_id)
            .subquery()
        )

        result = await self.db.execute(
            select(
                Space,
                func.coalesce(content_counts.c.content_count, 0),
                func.coalesce(member_counts.c.member_count, 0),
            )
            .outerjoin(content_counts, content_counts.c.space_id == Space.id)
            .outerjoin(member_counts, member_counts.c.space_id == Space.id)
            .where(Space.owner_id == owner_id)
            .order_by(Space.created_at.desc())
        )
        return [(space, content_count, member_count) for space, content_count, member_count in result.all()]

