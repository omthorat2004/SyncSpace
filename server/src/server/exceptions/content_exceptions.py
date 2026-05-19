"""
Custom exceptions for content-related operations.

Provides specific exception types for content management errors with
appropriate HTTP status codes and error messages.
"""

from src.server.exceptions.base import AppException


class ContentNotFound(AppException):
    """Raised when content is not found."""

    def __init__(self, content_id: int):
        super().__init__(
            message=f"Content with ID {content_id} not found",
            status_code=404,
        )


class ContentTitleRequired(AppException):
    """Raised when content title is missing or empty."""

    def __init__(self):
        super().__init__(
            message="Content title is required and cannot be empty",
            status_code=400,
        )


class ContentTitleTooLong(AppException):
    """Raised when content title exceeds maximum length."""

    def __init__(self, max_length: int = 255):
        super().__init__(
            message=f"Content title cannot exceed {max_length} characters",
            status_code=400,
        )


class ContentBodyTooLong(AppException):
    """Raised when content body exceeds maximum length."""

    def __init__(self, max_length: int = 50000):
        super().__init__(
            message=f"Content body cannot exceed {max_length} characters",
            status_code=400,
        )


class InvalidContentType(AppException):
    """Raised when content type is invalid."""

    def __init__(self, valid_types: list[str] | None = None):
        types_str = ", ".join(valid_types) if valid_types else "note, link, code"
        super().__init__(
            message=f"Invalid content type. Valid types are: {types_str}",
            status_code=400,
        )


class InvalidUrlFormat(AppException):
    """Raised when URL format is invalid."""

    def __init__(self):
        super().__init__(
            message="Invalid URL format. URL must start with http:// or https://",
            status_code=400,
        )


class ContentCreationFailed(AppException):
    """Raised when content creation fails."""

    def __init__(self, reason: str = "Unknown error"):
        super().__init__(
            message=f"Failed to create content: {reason}",
            status_code=500,
        )


class UnauthorizedContentAccess(AppException):
    """Raised when user doesn't have permission to access content."""

    def __init__(self, content_id: int | None = None):
        if content_id:
            message = f"You don't have permission to access content {content_id}"
        else:
            message = "You don't have permission to perform this action"
        super().__init__(
            message=message,
            status_code=403,
        )


class SpaceNotFound(AppException):
    """Raised when space is not found."""

    def __init__(self, space_id: int):
        super().__init__(
            message=f"Space with ID {space_id} not found",
            status_code=404,
        )
