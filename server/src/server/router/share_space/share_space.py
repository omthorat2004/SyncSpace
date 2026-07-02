import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from src.server.dependencies.auth import get_current_user, get_current_user_id
from src.server.dependencies.service import get_share_space_service
from src.server.schemas.space_shared import (SharedSpacesResponse, ShareSpace,
                                             ShareSpaceResponse)
from src.server.schemas.user import User
from src.server.services.space.share_space_service import ShareSpaceService

router = APIRouter(prefix="/share",tags=["Shared Spaces"])

logger = logging.getLogger(__name__)

@router.post(
    "/{space_id}",
    response_model=ShareSpaceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Share a space",
    description="Share a workspace with another user",
    responses = {
        201 : {"description":"Space shared"},
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
        await share_space_service.share_space(space_id=space_id, payload=payload)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )

    logger.info(f"Space is shared with space id {space_id} by user {current_user.id}")

    return ShareSpaceResponse()
    

@router.get("/{space_id}",response_model=list[SharedSpacesResponse],status_code=status.HTTP_200_OK,summary="Return spaces",
            responses={
                
            })
async def return_shared_spaces(space_id:int,user_id:Annotated[int,Depends(get_current_user_id)],share_space_service:Annotated[ShareSpaceService,Depends(get_share_space_service)]):
    
    logger.info("Returning all of the users to which {space_id} is shared by {user_id}")
    
    return await share_space_service.get_users_shared(space_id)
    
