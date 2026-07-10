from pydantic import BaseModel, EmailStr
from datetime import datetime


class ShareSpace(BaseModel):
    permission : str
    email:EmailStr

class ShareSpaceResponse(BaseModel):
    message : str = "Space is shared successfully"


class SharedSpacesResponse(BaseModel):
    id: int
    name:str
    permission:str
    shared_at:datetime
    email:str
    status: str = "active"


class UpdateSharePermissionRequest(BaseModel):
    permission: str


class ShareActionResponse(BaseModel):
    message: str


class SharedWithMeSpace(BaseModel):
    id: int
    name: str
    description: str | None = None
    owner_id: int
    owner_name: str
    permission: str
    shared_at: datetime
    item_count: int = 0


