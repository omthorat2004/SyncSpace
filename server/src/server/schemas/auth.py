from pydantic import AliasChoices, BaseModel, EmailStr, Field, SecretStr
from src.server.schemas.user import User


class CreateUserRequest(BaseModel):
    name: str = Field(
        ...,
        min_length=2,
    )
    email: EmailStr
    password: SecretStr

class CreateUserResponse(BaseModel):
    user: User = Field(
        ...
    )
    access_token: str = Field(
        ...
    )
    refresh_token: str = Field(
        ...
    )

class LoginRequest(BaseModel):
    email: EmailStr
    password: SecretStr

class LoginResponse(BaseModel):
    user: User = Field(
        ...
    )
    access_token: str = Field(
        ...
    )
    refresh_token: str = Field(
        ...
    )


class RefreshTokenResponse(BaseModel):
    user: User = Field(
        ...
    )
    access_token: str = Field(
        ...
    )
    refresh_token: str = Field(
        ...
    )


class RefreshTokenRequest(BaseModel):
    refresh_token: str | None = Field(
        default=None,
        validation_alias=AliasChoices("refresh_token", "refreshToken"),
    )
    




class LogoutResponseModel(BaseModel):
    message : str = "Logout successfully!"
    
    
class ReturnUserResponse(BaseModel):
    user:User


class UpdateProfileRequest(BaseModel):
    name: str | None = Field(default=None, min_length=2)
    email: EmailStr | None = Field(default=None)


class UpdateProfileResponse(BaseModel):
    user: User
    message: str = "Profile updated successfully"


class ChangePasswordRequest(BaseModel):
    old_password: str = Field(..., min_length=1, validation_alias=AliasChoices("old_password", "oldPassword"))
    new_password: SecretStr = Field(..., min_length=8, validation_alias=AliasChoices("new_password", "newPassword"))


class ChangePasswordResponse(BaseModel):
    message: str = "Password changed successfully"

