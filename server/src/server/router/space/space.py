"""
Router for space-related endpoints.

Provides HTTP endpoints for space management operations including:
- Creating new spaces
- Retrieving spaces
- Updating space information
- Deleting spaces

All endpoints require authentication and follow RESTful conventions.
"""

import logging
from typing import Annotated

from fastapi import APIRouter, Depends, status

from src.server.dependencies.auth import get_current_user
from src.server.dependencies.space_service import get_space_service
from src.server.schemas.space import (
    CreateSpaceRequest,
    CreateSpaceResponse,
    DeleteSpaceResponse,
    GetSpacesResponse,
    SpaceResponse,
    UpdateSpaceRequest,
)
from src.server.schemas.user import User
from src.server.services.space.space_service import SpaceService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/spaces", tags=["spaces"])


@router.post(
    "",
    response_model=CreateSpaceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new space",
    description="Create a new workspace space for the authenticated user.",
    responses={
        201: {"description": "Space created successfully"},
        400: {"description": "Invalid space data"},
        401: {"description": "Unauthorized"},
        500: {"description": "Internal server error"},
    },
)
async def create_space(
    payload: CreateSpaceRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    space_service: Annotated[SpaceService, Depends(get_space_service)],
) -> CreateSpaceResponse:
    """
    Create a new space.

    Creates a new workspace space owned by the authenticated user.

    Args:
        payload: Space creation request data
        current_user: Authenticated user from JWT token
        space_service: Space service instance

    Returns:
        CreateSpaceResponse: Created space object with success message

    Raises:
        SpaceNameRequired: If space name is missing
        SpaceNameTooShort: If space name is too short
        SpaceNameTooLong: If space name is too long
        DescriptionTooLong: If description exceeds maximum length
        SpaceCreationFailed: If database operation fails
    """
    logger.info(f"Creating space '{payload.name}' for user {current_user.id}")

    space = await space_service.create_space(
        name=payload.name,
        description=payload.description,
        owner_id=current_user.id,
    )

    logger.info(f"Space created successfully: {space.id}")

    return CreateSpaceResponse(
        space=SpaceResponse.model_validate(space),
        message="Space created successfully",
    )


@router.get(
    "",
    response_model=GetSpacesResponse,
    status_code=status.HTTP_200_OK,
    summary="Get user's spaces",
    description="Retrieve all spaces owned by the authenticated user.",
    responses={
        200: {"description": "Spaces retrieved successfully"},
        401: {"description": "Unauthorized"},
        500: {"description": "Internal server error"},
    },
)
async def get_spaces(
    current_user: Annotated[User, Depends(get_current_user)],
    space_service: Annotated[SpaceService, Depends(get_space_service)],
) -> GetSpacesResponse:
    """
    Get all spaces for the authenticated user.

    Retrieves a list of all workspace spaces owned by the authenticated user,
    ordered by creation date (newest first).

    Args:
        current_user: Authenticated user from JWT token
        space_service: Space service instance

    Returns:
        GetSpacesResponse: List of spaces with count
    """
    logger.info(f"Fetching spaces for user {current_user.id}")

    spaces_with_counts = await space_service.get_user_spaces_with_counts(current_user.id)

    logger.info(f"Retrieved {len(spaces_with_counts)} spaces for user {current_user.id}")

    return GetSpacesResponse(
        spaces=[
            SpaceResponse(
                id=space.id,
                name=space.name,
                description=space.description,
                owner_id=space.owner_id,
                created_at=space.created_at,
                updated_at=space.updated_at,
                content_count=content_count,
                member_count=member_count,
            )
            for space, content_count, member_count in spaces_with_counts
        ],
        count=len(spaces_with_counts),
    )


@router.get(
    "/{space_id}",
    response_model=SpaceResponse,
    status_code=status.HTTP_200_OK,
    summary="Get space details",
    description="Retrieve details of a specific space.",
    responses={
        200: {"description": "Space retrieved successfully"},
        401: {"description": "Unauthorized"},
        403: {"description": "Forbidden - user doesn't own this space"},
        404: {"description": "Space not found"},
        500: {"description": "Internal server error"},
    },
)
async def get_space(
    space_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    space_service: Annotated[SpaceService, Depends(get_space_service)],
) -> SpaceResponse:
    """
    Get details of a specific space.

    Retrieves detailed information about a space. User must be the owner
    of the space to access it.

    Args:
        space_id: ID of the space to retrieve
        current_user: Authenticated user from JWT token
        space_service: Space service instance

    Returns:
        SpaceResponse: Space object with all details

    Raises:
        SpaceNotFound: If space doesn't exist
        UnauthorizedSpaceAccess: If user is not the owner
    """
    logger.info(f"Fetching space {space_id} for user {current_user.id}")

    space = await space_service.get_space(space_id, current_user.id)
    permission = await space_service.get_user_permission(space, current_user.id)

    return SpaceResponse(
        id=space.id,
        name=space.name,
        description=space.description,
        owner_id=space.owner_id,
        created_at=space.created_at,
        updated_at=space.updated_at,
        my_permission=permission,
    )


@router.put(
    "/{space_id}",
    response_model=SpaceResponse,
    status_code=status.HTTP_200_OK,
    summary="Update space",
    description="Update space information.",
    responses={
        200: {"description": "Space updated successfully"},
        400: {"description": "Invalid space data"},
        401: {"description": "Unauthorized"},
        403: {"description": "Forbidden - user doesn't own this space"},
        404: {"description": "Space not found"},
        500: {"description": "Internal server error"},
    },
)
async def update_space(
    space_id: int,
    payload: UpdateSpaceRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    space_service: Annotated[SpaceService, Depends(get_space_service)],
) -> SpaceResponse:
    """
    Update space information.

    Updates the name and/or description of a space. User must be the owner
    of the space to update it.

    Args:
        space_id: ID of the space to update
        payload: Space update request data
        current_user: Authenticated user from JWT token
        space_service: Space service instance

    Returns:
        SpaceResponse: Updated space object

    Raises:
        SpaceNotFound: If space doesn't exist
        UnauthorizedSpaceAccess: If user is not the owner
        SpaceNameTooShort: If new name is too short
        SpaceNameTooLong: If new name is too long
        DescriptionTooLong: If new description is too long
    """
    logger.info(f"Updating space {space_id} for user {current_user.id}")

    space = await space_service.update_space(
        space_id=space_id,
        user_id=current_user.id,
        name=payload.name,
        description=payload.description,
    )

    logger.info(f"Space {space_id} updated successfully")

    return SpaceResponse.model_validate(space)


@router.delete(
    "/{space_id}",
    response_model=DeleteSpaceResponse,
    status_code=status.HTTP_200_OK,
    summary="Delete space",
    description="Delete a space and all its contents.",
    responses={
        200: {"description": "Space deleted successfully"},
        401: {"description": "Unauthorized"},
        403: {"description": "Forbidden - user doesn't own this space"},
        404: {"description": "Space not found"},
        500: {"description": "Internal server error"},
    },
)
async def delete_space(
    space_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    space_service: Annotated[SpaceService, Depends(get_space_service)],
) -> DeleteSpaceResponse:
    """
    Delete a space.

    Deletes a space and all its associated content. User must be the owner
    of the space to delete it. This operation is irreversible.

    Args:
        space_id: ID of the space to delete
        current_user: Authenticated user from JWT token
        space_service: Space service instance

    Returns:
        DeleteSpaceResponse: Confirmation message with deleted space ID

    Raises:
        SpaceNotFound: If space doesn't exist
        UnauthorizedSpaceAccess: If user is not the owner
    """
    logger.info(f"Deleting space {space_id} for user {current_user.id}")

    await space_service.delete_space(space_id, current_user.id)

    logger.info(f"Space {space_id} deleted successfully")

    return DeleteSpaceResponse(
        message="Space deleted successfully",
        space_id=space_id,
    )
