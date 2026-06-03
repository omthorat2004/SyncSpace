from sqlalchemy.ext.asyncio import AsyncSession
from src.server.models.space_member_model import SpaceMember
from src.server.core._settings import settings
from pydantic import EmailStr
from src.server.models.auth_models import User

class ShareSpaceDAO:
    def __init__(self,db:AsyncSession):
        self.db = db
        
    async def share_space(self,space_id:int,user_id:int,permission:str=settings.permissions):
        space_member = SpaceMember(space_id=space_id,user_id=user_id)
        self.db.add(space_member)
    
    async def get_user_by_email(self,email:EmailStr) ->
        