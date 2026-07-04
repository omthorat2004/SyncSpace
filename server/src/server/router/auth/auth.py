from fastapi import APIRouter, Depends, Request, Response, status
from src.server.core.constants import REFRESH_COOKIE_NAME
from src.server.dependencies.auth import get_current_user, get_current_user_id
from src.server.dependencies.service import get_auth_service, get_token_service
from src.server.exceptions.auth_exceptions import InvalidRefreshTokenException
from src.server.schemas.auth import (CreateUserRequest, CreateUserResponse,
                                     LoginRequest, LoginResponse,
                                     RefreshTokenRequest, RefreshTokenResponse,LogoutResponseModel)
from src.server.schemas.user import User
from src.server.services.auth.auth_service import AuthService
from src.server.services.auth.token_service import TokenService
from src.server.utils.auth_utils import get_client_ip, set_auth_cookies
from src.server.core.constants import ACCESS_COOKIE_NAME
from src.server.schemas.auth import ReturnUserResponse

from typing import Annotated

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=CreateUserResponse, status_code=status.HTTP_201_CREATED)
async def signup(
	payload: CreateUserRequest,
	request: Request,
	response: Response,
	auth_service: AuthService = Depends(get_auth_service),
):
	client_ip = get_client_ip(request)
	user, access_token, refresh_token = await auth_service.create_user(
		payload.name,
		str(payload.email),
		payload.password.get_secret_value(),
		client_ip,
	)
	set_auth_cookies(response, access_token, refresh_token)

	return CreateUserResponse(
		user=User.model_validate(user),
		access_token=access_token,
		refresh_token=refresh_token,
	)


@router.post("/login", response_model=LoginResponse)
async def login(
	payload: LoginRequest,
	request: Request,
	response: Response,
	auth_service: AuthService = Depends(get_auth_service),
):
	client_ip = get_client_ip(request)
	user, access_token, refresh_token = await auth_service.login_user(
		str(payload.email),
		payload.password.get_secret_value(),
		client_ip,
	)
	set_auth_cookies(response, access_token, refresh_token)

	return LoginResponse(
		user=User.model_validate(user),
		access_token=access_token,
		refresh_token=refresh_token,
	)




@router.get("/me", response_model=ReturnUserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    print(current_user)
    return ReturnUserResponse(user=current_user)


@router.post("/refresh", response_model=RefreshTokenResponse)
async def refresh_token(
	request: Request,
	response: Response,
	payload: RefreshTokenRequest | None = None,
	token_service: TokenService = Depends(get_token_service),
):
	refresh_token = (payload.refresh_token if payload else None) or request.cookies.get(REFRESH_COOKIE_NAME)
	if not refresh_token:
		raise InvalidRefreshTokenException()

	client_ip = get_client_ip(request)
	user, access_token, rotated_refresh_token = await token_service.refresh_tokens(refresh_token, client_ip)
	set_auth_cookies(response, access_token, rotated_refresh_token)

	return RefreshTokenResponse(
		user=User.model_validate(user),
		access_token=access_token,
		refresh_token=rotated_refresh_token,
	)




@router.post("/logout",response_model=LogoutResponseModel,status_code=status.HTTP_200_OK)
async def logout(response:Response,user_id : Annotated[int,Depends(get_current_user_id)],token_service : Annotated[TokenService,Depends(get_token_service)]):
    await token_service.delete_refresh_token(user_id)
    response.delete_cookie(ACCESS_COOKIE_NAME)
    return LogoutResponseModel()
    
    