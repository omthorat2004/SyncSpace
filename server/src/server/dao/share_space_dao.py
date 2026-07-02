from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from src.server.models.auth_models import User
from src.server.models.space_member_model import SpaceMember
from src.server.schemas.space_shared import SharedSpacesResponse


class ShareSpaceDAO:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def share_space(
        self,
        space_id: int,
        permission: str,
        user_email: str,
    ):
        result = await self.db.execute(
            select(User).where(User.email == user_email)
        )

        user = result.scalar_one_or_none()

        if user is None:
            raise ValueError(f"User with email '{user_email}' not found")

        space_member = SpaceMember(
            space_id=space_id,
            permission=permission,
            user_id=user.id,
        )

        self.db.add(space_member)
        await self.db.commit()

    async def get_users_shared(self, space_id: int):
        result = await self.db.execute(
            select(SpaceMember)
            .options(selectinload(SpaceMember.user))
            .where(SpaceMember.space_id == space_id)
        )

        shared_spaces = result.scalars().all()

        users = [
            SharedSpacesResponse(
                name=shared_space.user.name,
                email=shared_space.user.email,
                permission=shared_space.permission,
                shared_at=shared_space.created_at,
            )
            for shared_space in shared_spaces
        ]

        return users