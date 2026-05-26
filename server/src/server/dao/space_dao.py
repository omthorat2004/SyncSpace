"""
Data Access Object for Space operations.

Handles all database operations related to spaces including:
- Creating new spaces
- Retrieving spaces by ID or owner
- Updating space information
- Deleting spaces
"""

from sqlalchemy import select, delete, update
from sqlalchemy.ext.asyncio import AsyncSession
from src.server.models.space_models import Space
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

    async def get_spaces_by_owner(self, owner_id: int) -> list[Space]:
        """
        Retrieve all spaces owned by a specific user.

        Args:
            owner_id: ID of the space owner

        Returns:
            list[Space]: List of spaces owned by the user
        """
        result = await self.db.execute(
            select(Space).where(Space.owner_id == owner_id).order_by(Space.created_at.desc())
        )
        return result.scalars().all()

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

    async def space_exists(self, space_id: int) -> bool:
        """
        Check if a space exists.

        Args:
            space_id: ID of the space to check

        Returns:
            bool: True if space exists, False otherwise
        """
        result = await self.db.execute(
            select(Space).where(Space.id == space_id)
        )
        return result.scalar_one_or_none() is not None

    async def is_space_owner(self, space_id: int, user_id: int) -> bool:
        """
        Check if a user is the owner of a space.

        Args:
            space_id: ID of the space
            user_id: ID of the user

        Returns:
            bool: True if user is the owner, False otherwise
        """
        result = await self.db.execute(
            select(Space).where(
                Space.id == space_id,
                Space.owner_id == user_id,
            )
        )
        return result.scalar_one_or_none() is not None
    
    async def touch_space(self, space_id: int) -> None:
        await self.db.execute(
            update(Space)
            .where(Space.id == space_id)
            .values(updated_at=datetime.now())
        )

        await self.db.commit()

