import logging
from typing import Annotated

from fastapi import APIRouter, Depends, status
from src.server.dependencies.auth import get_current_user
from src.server.dependencies.service import get_auth_service
from src.server.schemas.auth import (ChangePasswordRequest, ChangePasswordResponse,
                                     UpdateProfileRequest, UpdateProfileResponse)
from src.server.schemas.user import User
from src.server.services.auth.auth_service import AuthService

router = APIRouter(prefix="/user", tags=["user"])

logger = logging.getLogger(__name__)


@router.put("/profile", response_model=UpdateProfileResponse, status_code=status.HTTP_200_OK)
async def update_profile(
    payload: UpdateProfileRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
):
    logger.info(f"Updating profile for user {current_user.id}")

    updated_user = await auth_service.update_profile(
        user_id=current_user.id,
        name=payload.name,
        email=payload.email,
    )

    return UpdateProfileResponse(user=User.model_validate(updated_user))


@router.post("/change-password", response_model=ChangePasswordResponse, status_code=status.HTTP_200_OK)
async def change_password(
    payload: ChangePasswordRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
):
    logger.info(f"Changing password for user {current_user.id}")

    await auth_service.change_password(
        user_id=current_user.id,
        old_password=payload.old_password,
        new_password=payload.new_password.get_secret_value(),
    )

    return ChangePasswordResponse()
