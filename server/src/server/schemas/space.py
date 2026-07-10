"""
Pydantic schemas for space-related API requests and responses.

Provides validation and serialization for space data in HTTP communication.
"""

from datetime import datetime
from pydantic import BaseModel, Field, field_validator


class CreateSpaceRequest(BaseModel):
    """Request schema for creating a new space."""

    name: str = Field(
        ...,
        min_length=3,
        max_length=255,
        description="Name of the space",
        examples=["Project Alpha", "Learning Notes"],
    )
    description: str | None = Field(
        default=None,
        max_length=500,
        description="Optional description of the space",
        examples=["A space for organizing project ideas"],
    )

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        """Validate and normalize space name."""
        if not v or not v.strip():
            raise ValueError("Space name cannot be empty")
        return v.strip()

    @field_validator("description")
    @classmethod
    def validate_description(cls, v: str | None) -> str | None:
        """Validate and normalize description."""
        if v is None:
            return None
        return v.strip() if v.strip() else None


class UpdateSpaceRequest(BaseModel):
    """Request schema for updating a space."""

    name: str | None = Field(
        default=None,
        min_length=3,
        max_length=255,
        description="New name for the space",
    )
    description: str | None = Field(
        default=None,
        max_length=500,
        description="New description for the space",
    )

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str | None) -> str | None:
        """Validate and normalize space name."""
        if v is None:
            return None
        if not v.strip():
            raise ValueError("Space name cannot be empty")
        return v.strip()

    @field_validator("description")
    @classmethod
    def validate_description(cls, v: str | None) -> str | None:
        """Validate and normalize description."""
        if v is None:
            return None
        return v.strip() if v.strip() else None


class SpaceResponse(BaseModel):
    """Response schema for a space object."""

    id: int = Field(..., description="Unique identifier for the space")
    name: str = Field(..., description="Name of the space")
    description: str | None = Field(default=None, description="Description of the space")
    owner_id: int = Field(..., description="ID of the space owner")
    created_at: datetime = Field(..., description="Timestamp when space was created")
    updated_at: datetime = Field(..., description="Timestamp when space was last updated")
    content_count: int = Field(default=0, description="Number of content items in the space")
    member_count: int = Field(default=0, description="Number of users the space is shared with")
    my_permission: str = Field(
        default="owner",
        description="The requesting user's access level on this space: 'owner', 'edit', or 'view'",
    )

    model_config = {"from_attributes": True}


class CreateSpaceResponse(BaseModel):
    """Response schema for space creation."""

    space: SpaceResponse = Field(..., description="The created space object")
    message: str = Field(default="Space created successfully", description="Success message")


class GetSpacesResponse(BaseModel):
    """Response schema for retrieving multiple spaces."""

    spaces: list[SpaceResponse] = Field(..., description="List of spaces")
    count: int = Field(..., description="Total number of spaces")


class DeleteSpaceResponse(BaseModel):
    """Response schema for space deletion."""

    message: str = Field(default="Space deleted successfully", description="Success message")
    space_id: int = Field(..., description="ID of the deleted space")
