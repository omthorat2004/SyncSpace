from fastapi import APIRouter,status, Depends
from src.server.schemas.space_shared import ShareSpace, ShareSpaceResponse
import logging
from src.server.dependencies.auth import get_current_user_id
from src.server.dependencies.service import get_share_space_service
from src.server.services.space.share_space_service import ShareSpaceService
from typing import Annotated
from src.server.models.auth_models import User

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
    user_id :Annotated[int,Depends(get_current_user_id)],
):
    logger.info(f"Share space with space id {space_id} to the user {user_id}")
    
    
    await share_space_service.share_space(space_id=space_id,user_id=user_id,permission=payload.permission)
    
    
    logger.info(f"Space is shared with space id {space_id} to the user {user_id}")
    
    return ShareSpaceResponse(
        
    )
    


