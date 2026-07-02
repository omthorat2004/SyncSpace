from src.server.core.security import (create_access_token,
                                      create_refresh_token, hash_token,
                                      verify_token)
from src.server.dao.auth_dao import AuthDAO
from src.server.exceptions.auth_exceptions import InvalidRefreshTokenException


class TokenService:
    def __init__(self, dao: AuthDAO):
        self.dao = dao

    async def refresh_tokens(self, refresh_token: str, ip_address: str | None = None):
        token_data = verify_token(refresh_token)
        if not token_data or token_data.token_type != "refresh":
            raise InvalidRefreshTokenException()

        user = await self.dao.get_user_by_id(token_data.user_id)
        if not user or token_data.version != user.token_version:
            raise InvalidRefreshTokenException()

        incoming_hash = hash_token(refresh_token)
        stored_refresh_token = await self.dao.get_valid_refresh_token(user.id, incoming_hash)
        if not stored_refresh_token:
            raise InvalidRefreshTokenException()

        await self.dao.invalidate_refresh_token_by_hash(user.id, incoming_hash)

        access_token = create_access_token(user.id, token_data.session_id)
        rotated_refresh_token = create_refresh_token(user.id, user.token_version)
        await self.dao.create_refresh_token_record(
            user_id=user.id,
            token_hash=hash_token(rotated_refresh_token),
            token_version=user.token_version,
            ip_address=ip_address,
        )
        return user, access_token, rotated_refresh_token

    async def delete_refresh_token(self, user_id: int):
        await self.dao.delete_refresh_token(user_id)
        
