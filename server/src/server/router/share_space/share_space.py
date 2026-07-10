import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from src.server.dependencies.auth import get_current_user, get_current_user_id
from src.server.dependencies.service import get_share_space_service
from src.server.schemas.space_shared import (SharedSpacesResponse, SharedWithMeSpace,
                                             ShareActionResponse, ShareSpace,
                                             ShareSpaceResponse, UpdateSharePermissionRequest)
from src.server.schemas.user import User
from src.server.services.space.share_space_service import ShareSpaceService

router = APIRouter(prefix="/share",tags=["Shared Spaces"])

logger = logging.getLogger(__name__)


def _handle_share_error(exc: Exception):
    if isinstance(exc, PermissionError):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(exc))
    if isinstance(exc, ValueError):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    raise exc


@router.get(
    "/shared-with-me",
    response_model=list[SharedWithMeSpace],
    status_code=status.HTTP_200_OK,
    summary="Spaces shared with the current user",
)
async def get_spaces_shared_with_me(
    current_user: Annotated[User, Depends(get_current_user)],
    share_space_service: Annotated[ShareSpaceService, Depends(get_share_space_service)],
):
    return await share_space_service.get_spaces_shared_with_user(current_user.id)


@router.post(
    "/{space_id}",
    response_model=ShareSpaceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Share a space",
    description="Share a workspace with another user",
    responses = {
        201 : {"description":"Space shared"},
        403 : {"description":"Only the space owner can share it"},
        404 :{"description":"Space or User is not found"},
        401 :{"description":"Unauthorised Access"}
    },
)
async def share_space(
    space_id: int,
    payload: ShareSpace,
    share_space_service: Annotated[ShareSpaceService, Depends(get_share_space_service)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    logger.info(f"Share space with space id {space_id} by user {current_user.id}")

    if payload.email.lower() == current_user.email.lower():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot share a space with your own email",
        )

    try:
        await share_space_service.share_space(space_id=space_id, payload=payload, owner_id=current_user.id)
    except (ValueError, PermissionError) as exc:
        _handle_share_error(exc)

    logger.info(f"Space is shared with space id {space_id} by user {current_user.id}")

    return ShareSpaceResponse()


@router.get("/{space_id}",response_model=list[SharedSpacesResponse],status_code=status.HTTP_200_OK,summary="Return spaces",
            responses={

            })
async def return_shared_spaces(space_id:int,user_id:Annotated[int,Depends(get_current_user_id)],share_space_service:Annotated[ShareSpaceService,Depends(get_share_space_service)]):

    logger.info("Returning all of the users to which {space_id} is shared by {user_id}")

    return await share_space_service.get_users_shared(space_id)


@router.put(
    "/{space_id}/{member_id}",
    response_model=ShareActionResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a collaborator's permission",
    responses={
        200: {"description": "Permission updated"},
        403: {"description": "Only the space owner can manage sharing"},
        404: {"description": "Space or shared member not found"},
    },
)
async def update_share_permission(
    space_id: int,
    member_id: int,
    payload: UpdateSharePermissionRequest,
    share_space_service: Annotated[ShareSpaceService, Depends(get_share_space_service)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    try:
        await share_space_service.update_permission(
            space_id=space_id, member_id=member_id, permission=payload.permission, owner_id=current_user.id
        )
    except (ValueError, PermissionError) as exc:
        _handle_share_error(exc)

    return ShareActionResponse(message="Permission updated successfully")


@router.delete(
    "/{space_id}/{member_id}",
    response_model=ShareActionResponse,
    status_code=status.HTTP_200_OK,
    summary="Remove a collaborator's access",
    responses={
        200: {"description": "Access removed"},
        403: {"description": "Only the space owner can manage sharing"},
        404: {"description": "Space or shared member not found"},
    },
)
async def remove_shared_user(
    space_id: int,
    member_id: int,
    share_space_service: Annotated[ShareSpaceService, Depends(get_share_space_service)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    try:
        await share_space_service.remove_user(space_id=space_id, member_id=member_id, owner_id=current_user.id)
    except (ValueError, PermissionError) as exc:
        _handle_share_error(exc)

    return ShareActionResponse(message="Access removed successfully")


@router.post(
    "/{space_id}/{member_id}/resend",
    response_model=ShareActionResponse,
    status_code=status.HTTP_200_OK,
    summary="Resend a share invitation",
    responses={
        200: {"description": "Invitation resent"},
        403: {"description": "Only the space owner can manage sharing"},
        404: {"description": "Space or shared member not found"},
    },
)
async def resend_share_invite(
    space_id: int,
    member_id: int,
    share_space_service: Annotated[ShareSpaceService, Depends(get_share_space_service)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    try:
        await share_space_service.resend_invite(space_id=space_id, member_id=member_id, owner_id=current_user.id)
    except (ValueError, PermissionError) as exc:
        _handle_share_error(exc)

    return ShareActionResponse(message="Invitation resent successfully")
