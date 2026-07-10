"""
Service layer for space operations.

Handles business logic for space management including:
- Validation of space data
- Space creation with business rules
- Authorization checks
- Space retrieval and updates
"""

from sqlalchemy.exc import IntegrityError
from src.server.dao.space_dao import SpaceDAO
from src.server.exceptions.space_exceptions import (
    DescriptionTooLong,
    DuplicateSpaceName,
    InvalidSpaceData,
    SpaceCreationFailed,
    SpaceNameRequired,
    SpaceNameTooLong,
    SpaceNameTooShort,
    SpaceNotFound,
    UnauthorizedSpaceAccess,
)
from src.server.models.space_models import Space


class SpaceService:
    """Service for managing space operations."""

    # Validation constants
    MIN_SPACE_NAME_LENGTH = 3
    MAX_SPACE_NAME_LENGTH = 255
    MAX_DESCRIPTION_LENGTH = 500

    def __init__(self, dao: SpaceDAO):
        """
        Initialize SpaceService with DAO dependency.

        Args:
            dao: SpaceDAO instance for database operations
        """
        self.dao = dao

    def _validate_space_name(self, name: str) -> None:
        """
        Validate space name according to business rules.

        Args:
            name: Space name to validate

        Raises:
            SpaceNameRequired: If name is empty or None
            SpaceNameTooShort: If name is shorter than minimum
            SpaceNameTooLong: If name is longer than maximum
        """
        if not name or not name.strip():
            raise SpaceNameRequired()

        trimmed_name = name.strip()

        if len(trimmed_name) < self.MIN_SPACE_NAME_LENGTH:
            raise SpaceNameTooShort(self.MIN_SPACE_NAME_LENGTH)

        if len(trimmed_name) > self.MAX_SPACE_NAME_LENGTH:
            raise SpaceNameTooLong(self.MAX_SPACE_NAME_LENGTH)

    def _validate_description(self, description: str | None) -> None:
        """
        Validate space description according to business rules.

        Args:
            description: Space description to validate

        Raises:
            DescriptionTooLong: If description exceeds maximum length
        """
        if description and len(description) > self.MAX_DESCRIPTION_LENGTH:
            raise DescriptionTooLong(self.MAX_DESCRIPTION_LENGTH)

    async def create_space(
        self,
        name: str,
        description: str | None,
        owner_id: int,
    ) -> Space:
        """
        Create a new space with validation and business logic.

        Args:
            name: Name of the space
            description: Optional description of the space
            owner_id: ID of the user creating the space

        Returns:
            Space: The created space object

        Raises:
            SpaceNameRequired: If name is empty
            SpaceNameTooShort: If name is too short
            SpaceNameTooLong: If name is too long
            DescriptionTooLong: If description is too long
            DuplicateSpaceName: If space with same name already exists for user
            SpaceCreationFailed: If database operation fails
        """
        # Validate inputs
        self._validate_space_name(name)
        self._validate_description(description)

        # Normalize name (trim whitespace)
        normalized_name = name.strip()
        normalized_description = description.strip() if description else None

        try:
            # Create space in database
            space = await self.dao.create_space(
                name=normalized_name,
                description=normalized_description,
                owner_id=owner_id,
            )
            return space

        except IntegrityError as e:
            # Handle database constraint violations
            if "unique" in str(e).lower():
                raise DuplicateSpaceName()
            raise SpaceCreationFailed(reason="Database constraint violation")
        except Exception as e:
            raise SpaceCreationFailed(reason=f"Unexpected error: {str(e)}")

    async def get_space(self, space_id: int, user_id: int | None = None) -> Space:
        """
        Retrieve a space by ID with optional authorization check.

        Access is granted to the owner or to any user the space has been
        shared with (any permission level), since shared collaborators need
        to be able to open the space to see its contents.

        Args:
            space_id: ID of the space to retrieve
            user_id: Optional user ID for authorization check

        Returns:
            Space: The space object

        Raises:
            SpaceNotFound: If space doesn't exist
            UnauthorizedSpaceAccess: If user_id provided and user has no access
        """
        space = await self.dao.get_space_by_id(space_id)

        if not space:
            raise SpaceNotFound(space_id)

        if user_id is not None and space.owner_id != user_id:
            permission = await self.dao.get_member_permission(space_id, user_id)
            if permission is None:
                raise UnauthorizedSpaceAccess(space_id)

        return space

    async def get_user_permission(self, space: Space, user_id: int) -> str:
        """
        Return the requesting user's access level on a space: 'owner' if they
        own it, otherwise their sharing permission ('view'/'edit'). Callers
        should only pass a space the user is already known to have access to
        (e.g. via get_space) — this does not itself enforce authorization.
        """
        if space.owner_id == user_id:
            return "owner"

        permission = await self.dao.get_member_permission(space.id, user_id)
        return permission or "view"

    async def _get_owned_space(self, space_id: int, user_id: int) -> Space:
        """Retrieve a space, raising unless the user is its owner (for rename/delete)."""
        space = await self.dao.get_space_by_id(space_id)

        if not space:
            raise SpaceNotFound(space_id)

        if space.owner_id != user_id:
            raise UnauthorizedSpaceAccess(space_id)

        return space

    async def get_user_spaces_with_counts(self, owner_id: int) -> list[tuple[Space, int, int]]:
        """
        Retrieve all spaces owned by a user along with content/member counts.

        Returns:
            list[tuple[Space, int, int]]: (space, content_count, member_count) tuples
        """
        return await self.dao.get_spaces_by_owner_with_counts(owner_id)

    async def update_space(
        self,
        space_id: int,
        user_id: int,
        name: str | None = None,
        description: str | None = None,
    ) -> Space:
        """
        Update space information with authorization and validation.

        Args:
            space_id: ID of the space to update
            user_id: ID of the user performing the update
            name: New name for the space (optional)
            description: New description for the space (optional)

        Returns:
            Space: The updated space object

        Raises:
            SpaceNotFound: If space doesn't exist
            UnauthorizedSpaceAccess: If user is not the owner
            SpaceNameTooShort: If new name is too short
            SpaceNameTooLong: If new name is too long
            DescriptionTooLong: If new description is too long
        """
        # Check authorization (owner only)
        space = await self._get_owned_space(space_id, user_id)

        # Validate new values if provided
        if name is not None:
            self._validate_space_name(name)
            name = name.strip()

        if description is not None:
            self._validate_description(description)
            description = description.strip() if description else None

        # Update space
        updated_space = await self.dao.update_space(
            space_id=space_id,
            name=name,
            description=description,
        )

        if not updated_space:
            raise SpaceNotFound(space_id)

        return updated_space

    async def delete_space(self, space_id: int, user_id: int) -> None:
        """
        Delete a space with authorization check.

        Args:
            space_id: ID of the space to delete
            user_id: ID of the user performing the deletion

        Raises:
            SpaceNotFound: If space doesn't exist
            UnauthorizedSpaceAccess: If user is not the owner
        """
        # Check authorization (owner only)
        await self._get_owned_space(space_id, user_id)

        # Delete space
        deleted = await self.dao.delete_space(space_id)

        if not deleted:
            raise SpaceNotFound(space_id)
