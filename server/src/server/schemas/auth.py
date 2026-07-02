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

