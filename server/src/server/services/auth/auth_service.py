from sqlalchemy.exc import IntegrityError
from src.server.core.security import (create_access_token,
                                      create_refresh_token, hash_token)
from src.server.dao.auth_dao import AuthDAO
from src.server.exceptions.auth_exceptions import (InvalidCredentialsException,
                                                   MissingFieldsException,
                                                   UserAlreadyExistsException)


class AuthService:
    def __init__(self, dao: AuthDAO):
        self.dao = dao

    async def create_user(self, name: str, email: str, password: str, ip_address: str | None = None):
        if not name or not email or not password:
            raise MissingFieldsException()

        existing_user = await self.dao.get_user_by_email(email)
        if existing_user:
            raise UserAlreadyExistsException()

        try:
            new_user = await self.dao.create_user(name, email, password)
            access_token = create_access_token(new_user.id)
            refresh_token = create_refresh_token(new_user.id, new_user.token_version)
            await self.dao.create_refresh_token_record(
                user_id=new_user.id,
                token_hash=hash_token(refresh_token),
                token_version=new_user.token_version,
                ip_address=ip_address,
            )
            return new_user, access_token, refresh_token
        except IntegrityError:
            raise UserAlreadyExistsException()

    async def login_user(self, email: str, password: str, ip_address: str | None = None):
        user = await self.dao.get_user_by_email(email)
        if not user or not user.verify_password(password):
            raise InvalidCredentialsException()

        # Single-device strategy: each login rotates token_version and invalidates previous refresh sessions.
        new_token_version = await self.dao.bump_user_token_version(user)
        await self.dao.invalidate_refresh_tokens_for_user(user.id)

        access_token = create_access_token(user.id)
        refresh_token = create_refresh_token(user.id, new_token_version)
        await self.dao.create_refresh_token_record(
            user_id=user.id,
            token_hash=hash_token(refresh_token),
            token_version=new_token_version,
            ip_address=ip_address,
        )
        return user, access_token, refresh_token