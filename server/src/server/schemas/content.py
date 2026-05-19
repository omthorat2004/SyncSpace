"""
Pydantic schemas for content-related API requests and responses.

Provides validation and serialization for content data in HTTP communication.
"""

from datetime import datetime
from pydantic import BaseModel, Field, field_validator


class CreateContentRequest(BaseModel):
    """Request schema for creating new content."""

    title: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Title of the content",
        examples=["My First Note", "React Best Practices"],
    )
    type: str = Field(
        ...,
        description="Type of content (note, link, code)",
        examples=["note", "link", "code"],
    )
    content: str = Field(
        ...,
        max_length=50000,
        description="Content body/text",
        examples=["This is my note content"],
    )
    url: str | None = Field(
        default=None,
        description="Optional URL for link type content",
        examples=["https://example.com"],
    )

    @field_validator("title")
    @classmethod
    def validate_title(cls, v: str) -> str:
        """Validate and normalize title."""
        if not v or not v.strip():
            raise ValueError("Title cannot be empty")
        return v.strip()

    @field_validator("type")
    @classmethod
    def validate_type(cls, v: str) -> str:
        """Validate content type."""
        valid_types = ["note", "link", "code"]
        if v.lower() not in valid_types:
            raise ValueError(f"Type must be one of: {', '.join(valid_types)}")
        return v.lower()


class UpdateContentRequest(BaseModel):
    """Request schema for updating content."""

    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
        description="New title for the content",
    )
    content: str | None = Field(
        default=None,
        max_length=50000,
        description="New content body",
    )
    url: str | None = Field(
        default=None,
        description="New URL for link type content",
    )

    @field_validator("title")
    @classmethod
    def validate_title(cls, v: str | None) -> str | None:
        """Validate and normalize title."""
        if v is None:
            return None
        if not v.strip():
            raise ValueError("Title cannot be empty")
        return v.strip()


class ContentResponse(BaseModel):
    """Response schema for a content object."""

    id: int = Field(..., description="Unique identifier for the content")
    space_id: int = Field(..., description="ID of the space containing this content")
    title: str = Field(..., description="Title of the content")
    type: str = Field(..., description="Type of content (note, link, code)")
    content: str = Field(..., description="Content body/text")
    url: str | None = Field(default=None, description="URL for link type content")
    created_at: datetime = Field(..., description="Timestamp when content was created")

    model_config = {"from_attributes": True}


class CreateContentResponse(BaseModel):
    """Response schema for content creation."""

    content: ContentResponse = Field(..., description="The created content object")
    message: str = Field(default="Content created successfully", description="Success message")


class GetContentsResponse(BaseModel):
    """Response schema for retrieving multiple contents."""

    contents: list[ContentResponse] = Field(..., description="List of content items")
    count: int = Field(..., description="Total number of content items")
    space_id: int = Field(..., description="ID of the space")


class UpdateContentResponse(BaseModel):
    """Response schema for content update."""

    content: ContentResponse = Field(..., description="The updated content object")
    message: str = Field(default="Content updated successfully", description="Success message")


class DeleteContentResponse(BaseModel):
    """Response schema for content deletion."""

    message: str = Field(default="Content deleted successfully", description="Success message")
    content_id: int = Field(..., description="ID of the deleted content")
