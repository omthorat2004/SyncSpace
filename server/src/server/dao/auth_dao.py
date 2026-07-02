from sqlalchemy import select, update,delete
from sqlalchemy.ext.asyncio import AsyncSession
from src.server.models.auth_models import RefreshToken, User


class AuthDAO:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_user(self, name: str, email: str, password: str):
        new_user = User(name=name, email=email)
        new_user.password = password
        self.db.add(new_user)
        await self.db.commit()
        await self.db.refresh(new_user)
        return new_user

    async def get_user_by_email(self, email: str):
        result = await self.db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        return user

    async def get_user_by_id(self, user_id: int):
        result = await self.db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        return user

    async def bump_user_token_version(self, user: User) -> int:
        user.token_version += 1
        await self.db.commit()
        await self.db.refresh(user)
        return user.token_version

    async def invalidate_refresh_tokens_for_user(self, user_id: int):
        await self.db.execute(
            update(RefreshToken)
            .where(RefreshToken.user_id == user_id, RefreshToken.valid.is_(True))
            .values(valid=False)
        )
        await self.db.commit()

    async def create_refresh_token_record(
        self,
        user_id: int,
        token_hash: str,
        token_version: int,
        ip_address: str | None = None,
    ):
        refresh_record = RefreshToken(
            user_id=user_id,
            token_hash=token_hash,
            token_version=token_version,
            ip_address=ip_address,
            valid=True,
        )
        self.db.add(refresh_record)
        await self.db.commit()
        await self.db.refresh(refresh_record)
        return refresh_record

    async def get_valid_refresh_token(self, user_id: int, token_hash: str):
        result = await self.db.execute(
            select(RefreshToken).where(
                RefreshToken.user_id == user_id,
                RefreshToken.token_hash == token_hash,
                RefreshToken.valid.is_(True),
            )
        )
        return result.scalar_one_or_none()

    async def invalidate_refresh_token_by_hash(self, user_id: int, token_hash: str):
        await self.db.execute(
            update(RefreshToken)
            .where(
                RefreshToken.user_id == user_id,
                RefreshToken.token_hash == token_hash,
                RefreshToken.valid.is_(True),
            )
            .values(valid=False)
        )
        await self.db.commit()
        
    async def delete_refresh_token(self,user_id:int):
        await self.db.execute(delete(RefreshToken).where(RefreshToken.user_id==user_id))
        