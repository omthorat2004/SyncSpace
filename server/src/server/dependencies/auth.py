from fastapi import HTTPException, Request, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.server.core.constants import ACCESS_COOKIE_NAME
from src.server.core.security import verify_token
from src.server.database.database import get_db
from src.server.dao.auth_dao import AuthDAO
from src.server.schemas.user import User


async def get_current_user_id(request: Request):
    token = request.cookies.get(ACCESS_COOKIE_NAME)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing access token cookie",
        )
    payload = verify_token(token)
    if (
        not payload
        or payload.token_type != "access"
        or not getattr(payload, "user_id", None)
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    return payload.user_id


async def get_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db)
) -> User:
    token = request.cookies.get(ACCESS_COOKIE_NAME)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing access token cookie",
        )
    payload = verify_token(token)
    if not payload or payload.token_type != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    
    # Fetch user from database
    auth_dao = AuthDAO(db)
    user = await auth_dao.get_user_by_id(payload.user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    
    return User.model_validate(user)


async def get_optional_user(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    token = request.cookies.get(ACCESS_COOKIE_NAME)
    if not token:
        return None
    payload = verify_token(token)
    if not payload or payload.token_type != "access":
        return None
    
    # Fetch user from database
    auth_dao = AuthDAO(db)
    user = await auth_dao.get_user_by_id(payload.user_id)
    return User.model_validate(user) if user else None
