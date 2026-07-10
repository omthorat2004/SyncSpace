from src.server.dao.share_space_dao import ShareSpaceDAO
from src.server.core._settings import settings,Permission
from src.server.schemas.space_shared import ShareSpace

class ShareSpaceService:
    def __init__(self,dao:ShareSpaceDAO):
        self.dao = dao

    async def share_space(self,space_id:int,payload:ShareSpace,owner_id:int):

        await self.dao.share_space(space_id=space_id,permission=payload.permission,user_email=payload.email,owner_id=owner_id)

    async def get_users_shared(self,space_id:int):
        return await self.dao.get_users_shared(space_id)

    async def update_permission(self, space_id: int, member_id: int, permission: str, owner_id: int):
        await self.dao.update_permission(space_id=space_id, member_id=member_id, permission=permission, owner_id=owner_id)

    async def remove_user(self, space_id: int, member_id: int, owner_id: int):
        await self.dao.remove_user(space_id=space_id, member_id=member_id, owner_id=owner_id)

    async def resend_invite(self, space_id: int, member_id: int, owner_id: int):
        await self.dao.resend_invite(space_id=space_id, member_id=member_id, owner_id=owner_id)

    async def get_spaces_shared_with_user(self, user_id: int):
        return await self.dao.get_spaces_shared_with_user(user_id)
