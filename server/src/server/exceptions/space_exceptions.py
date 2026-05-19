"""
Custom exceptions for space-related operations.

Provides domain-specific exceptions for space management features
with appropriate HTTP status codes and error messages.
"""

from src.server.exceptions.base import AppException


class SpaceException(AppException):
    """Base exception for space-related errors."""

    pass


class SpaceNotFound(SpaceException):
    """Raised when a space is not found."""

    def __init__(self, space_id: int | None = None):
        message = f"Space not found" + (f" (ID: {space_id})" if space_id else "")
        super().__init__(message=message, status_code=404)


class UnauthorizedSpaceAccess(SpaceException):
    """Raised when user attempts to access a space they don't own."""

    def __init__(self, space_id: int | None = None):
        message = f"You don't have permission to access this space" + (f" (ID: {space_id})" if space_id else "")
        super().__init__(message=message, status_code=403)


class InvalidSpaceData(SpaceException):
    """Raised when space data is invalid."""

    def __init__(self, message: str = "Invalid space data"):
        super().__init__(message=message, status_code=400)


class SpaceNameRequired(InvalidSpaceData):
    """Raised when space name is missing or empty."""

    def __init__(self):
        super().__init__(message="Space name is required")


class SpaceNameTooShort(InvalidSpaceData):
    """Raised when space name is too short."""

    def __init__(self, min_length: int = 3):
        super().__init__(message=f"Space name must be at least {min_length} characters long")


class SpaceNameTooLong(InvalidSpaceData):
    """Raised when space name is too long."""

    def __init__(self, max_length: int = 255):
        super().__init__(message=f"Space name must not exceed {max_length} characters")


class DescriptionTooLong(InvalidSpaceData):
    """Raised when space description is too long."""

    def __init__(self, max_length: int = 500):
        super().__init__(message=f"Description must not exceed {max_length} characters")


class SpaceCreationFailed(SpaceException):
    """Raised when space creation fails due to database error."""

    def __init__(self, reason: str = "Failed to create space"):
        super().__init__(message=reason, status_code=500)


class DuplicateSpaceName(InvalidSpaceData):
    """Raised when attempting to create a space with a duplicate name."""

    def __init__(self):
        super().__init__(message="A space with this name already exists")
