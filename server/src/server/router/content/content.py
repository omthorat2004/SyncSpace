"""
Router for content-related endpoints.

Provides HTTP endpoints for content management operations including:
- Creating new content
- Retrieving content
- Updating content information
- Deleting content
- Filtering content by type

All endpoints require authentication and follow RESTful conventions.
"""

import logging
from typing import Annotated

from fastapi import APIRouter, Depends, Query, status

from src.server.dependencies.auth import get_current_user
from src.server.dependencies.content_service import get_content_service
from src.server.schemas.content import (
    CreateContentRequest,
    CreateContentResponse,
    DeleteContentResponse,
    GetContentsResponse,
    UpdateContentRequest,
    UpdateContentResponse,
    ContentResponse,
)
from src.server.schemas.user import User
from src.server.services.content.content_service import ContentService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/spaces/{space_id}/contents", tags=["contents"])


@router.post(
    "",
    response_model=CreateContentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create new content",
    description="Create new content in a space.",
    responses={
        201: {"description": "Content created successfully"},
        400: {"description": "Invalid content data"},
        401: {"description": "Unauthorized"},
        403: {"description": "Forbidden - user doesn't own this space"},
        404: {"description": "Space not found"},
        500: {"description": "Internal server error"},
    },
)
async def create_content(
    space_id: int,
    payload: CreateContentRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    content_service: Annotated[ContentService, Depends(get_content_service)],
) -> CreateContentResponse:
    """
    Create new content in a space.

    Creates new content (note, link, or code) in the specified space.
    User must own the space to create content in it.

    Args:
        space_id: ID of the space
        payload: Content creation request data
        current_user: Authenticated user from JWT token
        content_service: Content service instance

    Returns:
        CreateContentResponse: Created content object with success message

    Raises:
        SpaceNotFound: If space doesn't exist
        UnauthorizedContentAccess: If user doesn't own the space
        ContentTitleRequired: If title is missing
        ContentBodyTooLong: If content exceeds maximum length
        InvalidContentType: If content type is invalid
        InvalidUrlFormat: If URL format is invalid
    """
    logger.info(f"Creating content in space {space_id} for user {current_user.id}")

    content = await content_service.create_content(
        space_id=space_id,
        title=payload.title,
        content_type=payload.type,
        content=payload.content,
        url=payload.url,
        user_id=current_user.id,
    )

    logger.info(f"Content created successfully: {content.id}")

    # Convert enum to string value for response
    content_dict = {
        "id": content.id,
        "space_id": content.space_id,
        "title": content.title,
        "type": content.type.value if hasattr(content.type, 'value') else content.type,
        "content": content.content,
        "url": content.url,
        "created_at": content.created_at,
    }

    return CreateContentResponse(
        content=ContentResponse.model_validate(content_dict),
        message="Content created successfully",
    )


@router.get(
    "",
    response_model=GetContentsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get space contents",
    description="Retrieve all content in a space with optional filtering.",
    responses={
        200: {"description": "Contents retrieved successfully"},
        401: {"description": "Unauthorized"},
        403: {"description": "Forbidden - user doesn't own this space"},
        404: {"description": "Space not found"},
        500: {"description": "Internal server error"},
    },
)
async def get_contents(
    space_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    content_service: Annotated[ContentService, Depends(get_content_service)],
    content_type: str | None = Query(
        default=None,
        description="Filter by content type (note, link, code)",
    ),
) -> GetContentsResponse:
    """
    Get all content in a space.

    Retrieves all content in a space, optionally filtered by type.
    Results are cached for performance. User must own the space.

    Args:
        space_id: ID of the space
        content_type: Optional content type filter
        current_user: Authenticated user from JWT token
        content_service: Content service instance

    Returns:
        GetContentsResponse: List of content items with count

    Raises:
        SpaceNotFound: If space doesn't exist
        UnauthorizedContentAccess: If user doesn't own the space
        InvalidContentType: If content type filter is invalid
    """
    logger.info(f"Fetching contents for space {space_id}")

    if content_type:
        contents = await content_service.get_space_contents_by_type(
            space_id=space_id,
            content_type=content_type,
            user_id=current_user.id,
            use_cache=True,
        )
    else:
        contents = await content_service.get_space_contents(
            space_id=space_id,
            user_id=current_user.id,
            use_cache=True,
        )

    logger.info(f"Retrieved {len(contents)} contents for space {space_id}")

    # Convert Content objects to dictionaries with enum values converted to strings
    content_dicts = []
    for content in contents:
        content_dict = {
            "id": content.id,
            "space_id": content.space_id,
            "title": content.title,
            "type": content.type.value if hasattr(content.type, 'value') else content.type,
            "content": content.content,
            "url": content.url,
            "created_at": content.created_at,
        }
        content_dicts.append(ContentResponse.model_validate(content_dict))

    return GetContentsResponse(
        contents=content_dicts,
        count=len(contents),
        space_id=space_id,
    )


@router.get(
    "/{content_id}",
    response_model=ContentResponse,
    status_code=status.HTTP_200_OK,
    summary="Get content details",
    description="Retrieve details of a specific content item.",
    responses={
        200: {"description": "Content retrieved successfully"},
        401: {"description": "Unauthorized"},
        403: {"description": "Forbidden - user doesn't have permission"},
        404: {"description": "Content not found"},
        500: {"description": "Internal server error"},
    },
)
async def get_content(
    space_id: int,
    content_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    content_service: Annotated[ContentService, Depends(get_content_service)],
) -> ContentResponse:
    """
    Get details of a specific content item.

    Retrieves detailed information about a content item.
    User must own the space containing the content.

    Args:
        space_id: ID of the space
        content_id: ID of the content
        current_user: Authenticated user from JWT token
        content_service: Content service instance

    Returns:
        ContentResponse: Content object with all details

    Raises:
        ContentNotFound: If content doesn't exist
        UnauthorizedContentAccess: If user doesn't have permission
    """
    logger.info(f"Fetching content {content_id} from space {space_id}")

    content = await content_service.get_content(
        content_id=content_id,
        space_id=space_id,
        user_id=current_user.id,
    )

    # Convert enum to string value for response
    content_dict = {
        "id": content.id,
        "space_id": content.space_id,
        "title": content.title,
        "type": content.type.value if hasattr(content.type, 'value') else content.type,
        "content": content.content,
        "url": content.url,
        "created_at": content.created_at,
    }

    return ContentResponse.model_validate(content_dict)


@router.put(
    "/{content_id}",
    response_model=UpdateContentResponse,
    status_code=status.HTTP_200_OK,
    summary="Update content",
    description="Update content information.",
    responses={
        200: {"description": "Content updated successfully"},
        400: {"description": "Invalid content data"},
        401: {"description": "Unauthorized"},
        403: {"description": "Forbidden - user doesn't have permission"},
        404: {"description": "Content not found"},
        500: {"description": "Internal server error"},
    },
)
async def update_content(
    space_id: int,
    content_id: int,
    payload: UpdateContentRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    content_service: Annotated[ContentService, Depends(get_content_service)],
) -> UpdateContentResponse:
    """
    Update content information.

    Updates the title, content body, or URL of a content item.
    User must own the space containing the content.

    Args:
        space_id: ID of the space
        content_id: ID of the content to update
        payload: Content update request data
        current_user: Authenticated user from JWT token
        content_service: Content service instance

    Returns:
        UpdateContentResponse: Updated content object

    Raises:
        ContentNotFound: If content doesn't exist
        UnauthorizedContentAccess: If user doesn't have permission
        ContentTitleTooLong: If new title is too long
        ContentBodyTooLong: If new content is too long
        InvalidUrlFormat: If URL format is invalid
    """
    logger.info(f"Updating content {content_id} in space {space_id}")

    content = await content_service.update_content(
        content_id=content_id,
        space_id=space_id,
        user_id=current_user.id,
        title=payload.title,
        content=payload.content,
        url=payload.url,
    )

    logger.info(f"Content {content_id} updated successfully")

    # Convert enum to string value for response
    content_dict = {
        "id": content.id,
        "space_id": content.space_id,
        "title": content.title,
        "type": content.type.value if hasattr(content.type, 'value') else content.type,
        "content": content.content,
        "url": content.url,
        "created_at": content.created_at,
    }

    return UpdateContentResponse(
        content=ContentResponse.model_validate(content_dict),
        message="Content updated successfully",
    )


@router.delete(
    "/{content_id}",
    response_model=DeleteContentResponse,
    status_code=status.HTTP_200_OK,
    summary="Delete content",
    description="Delete a content item.",
    responses={
        200: {"description": "Content deleted successfully"},
        401: {"description": "Unauthorized"},
        403: {"description": "Forbidden - user doesn't have permission"},
        404: {"description": "Content not found"},
        500: {"description": "Internal server error"},
    },
)
async def delete_content(
    space_id: int,
    content_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    content_service: Annotated[ContentService, Depends(get_content_service)],
) -> DeleteContentResponse:
    """
    Delete a content item.

    Deletes a content item from a space. User must own the space.
    This operation is irreversible.

    Args:
        space_id: ID of the space
        content_id: ID of the content to delete
        current_user: Authenticated user from JWT token
        content_service: Content service instance

    Returns:
        DeleteContentResponse: Confirmation message with deleted content ID

    Raises:
        ContentNotFound: If content doesn't exist
        UnauthorizedContentAccess: If user doesn't have permission
    """
    logger.info(f"Deleting content {content_id} from space {space_id}")

    await content_service.delete_content(
        content_id=content_id,
        space_id=space_id,
        user_id=current_user.id,
    )

    logger.info(f"Content {content_id} deleted successfully")

    return DeleteContentResponse(
        message="Content deleted successfully",
        content_id=content_id,
    )
