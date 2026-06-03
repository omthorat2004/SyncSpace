from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.server.dao.auth_dao import AuthDAO
from src.server.dao.share_space_dao import ShareSpaceDAO
from src.server.database.database import get_db
from src.server.services.auth.auth_service import AuthService
from src.server.services.auth.token_service import TokenService
from src.server.services.space.share_space_service import ShareSpaceService

def get_auth_service(db: AsyncSession = Depends(get_db)) -> AuthService:
	return AuthService(AuthDAO(db))


def get_token_service(db: AsyncSession = Depends(get_db)) -> TokenService:
	return TokenService(AuthDAO(db))


def get_share_space_service(db:AsyncSession = Depends(get_db)) -> ShareSpaceService:
    return ShareSpaceService(ShareSpaceDAO(db=db))

