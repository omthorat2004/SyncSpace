from src.server.dao.share_space_dao import ShareSpaceDAO
from src.server.core._settings import settings,Permission


class ShareSpaceService:
    def __init__(self,dao:ShareSpaceDAO):
        self.dao = dao
        
    async def share_space(self,space_id:int,user_id:int,permission:Permission = settings.permissions):
        await self.dao.share_space(space_id=space_id,user_id=user_id,permission=permission)
        