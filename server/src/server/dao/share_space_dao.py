from sqlalchemy import select, delete, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from src.server.models.auth_models import User
from src.server.models.space_member_model import SpaceMember
from src.server.models.space_models import Space, Content
from src.server.schemas.space_shared import SharedSpacesResponse, SharedWithMeSpace


class ShareSpaceDAO:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def _get_space(self, space_id: int) -> Space:
        result = await self.db.execute(select(Space).where(Space.id == space_id))
        space = result.scalar_one_or_none()
        if space is None:
            raise ValueError(f"Space with id '{space_id}' not found")
        return space

    async def _ensure_owner(self, space_id: int, owner_id: int) -> None:
        space = await self._get_space(space_id)
        if space.owner_id != owner_id:
            raise PermissionError("Only the space owner can manage sharing for this space")

    async def share_space(
        self,
        space_id: int,
        permission: str,
        user_email: str,
        owner_id: int,
    ):
        await self._ensure_owner(space_id, owner_id)

        result = await self.db.execute(
            select(User).where(User.email == user_email)
        )

        user = result.scalar_one_or_none()

        if user is None:
            raise ValueError(f"User with email '{user_email}' not found")

        existing = await self.db.execute(
            select(SpaceMember).where(
                SpaceMember.space_id == space_id,
                SpaceMember.user_id == user.id,
            )
        )
        if existing.scalar_one_or_none() is not None:
            raise ValueError("This space is already shared with that user")

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
                id=shared_space.id,
                name=shared_space.user.name,
                email=shared_space.user.email,
                permission=shared_space.permission,
                shared_at=shared_space.created_at,
                status="active",
            )
            for shared_space in shared_spaces
        ]

        return users

    async def _get_member(self, space_id: int, member_id: int) -> SpaceMember:
        result = await self.db.execute(
            select(SpaceMember).where(
                SpaceMember.id == member_id,
                SpaceMember.space_id == space_id,
            )
        )
        member = result.scalar_one_or_none()
        if member is None:
            raise ValueError("Shared member not found")
        return member

    async def update_permission(
        self, space_id: int, member_id: int, permission: str, owner_id: int
    ) -> None:
        await self._ensure_owner(space_id, owner_id)
        member = await self._get_member(space_id, member_id)
        member.permission = permission
        await self.db.commit()

    async def remove_user(self, space_id: int, member_id: int, owner_id: int) -> None:
        await self._ensure_owner(space_id, owner_id)
        await self._get_member(space_id, member_id)
        await self.db.execute(
            delete(SpaceMember).where(
                SpaceMember.id == member_id,
                SpaceMember.space_id == space_id,
            )
        )
        await self.db.commit()

    async def resend_invite(self, space_id: int, member_id: int, owner_id: int) -> None:
        await self._ensure_owner(space_id, owner_id)
        # No pending-invite flow exists yet (sharing grants access immediately),
        # so this just validates the member exists for now.
        await self._get_member(space_id, member_id)

    async def get_spaces_shared_with_user(self, user_id: int) -> list[SharedWithMeSpace]:
        content_counts = (
            select(Content.space_id, func.count(Content.id).label("item_count"))
            .group_by(Content.space_id)
            .subquery()
        )

        result = await self.db.execute(
            select(
                SpaceMember,
                Space,
                User,
                func.coalesce(content_counts.c.item_count, 0),
            )
            .join(Space, SpaceMember.space_id == Space.id)
            .join(User, Space.owner_id == User.id)
            .outerjoin(content_counts, content_counts.c.space_id == Space.id)
            .where(SpaceMember.user_id == user_id)
            .order_by(SpaceMember.created_at.desc())
        )

        return [
            SharedWithMeSpace(
                id=space.id,
                name=space.name,
                description=space.description,
                owner_id=owner.id,
                owner_name=owner.name,
                permission=member.permission,
                shared_at=member.created_at,
                item_count=item_count,
            )
            for member, space, owner, item_count in result.all()
        ]
