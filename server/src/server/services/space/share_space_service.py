from src.server.dao.share_space_dao import ShareSpaceDAO
from src.server.core._settings import settings,Permission
from src.server.schemas.space_shared import ShareSpace

class ShareSpaceService:
    def __init__(self,dao:ShareSpaceDAO):
        self.dao = dao
        
    async def share_space(self,space_id:int,payload:ShareSpace):
        
        await self.dao.share_space(space_id=space_id,permission=payload.permission,user_email=payload.email)
    
    async def get_users_shared(self,space_id:int):
        return await self.dao.get_users_shared(space_id)