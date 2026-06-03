from pydantic import BaseModel, EmailStr, Field
from datetime import datetime,timezone
from src.server.models.auth_models import User


class SharedUser(BaseModel):
    id : int
    email :EmailStr
    name : str

class ShareSpace(BaseModel):
    permission : str
    email:EmailStr

class ShareSpaceResponse(BaseModel):
    message : str = "Space is shared successfully"
    