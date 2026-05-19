from pydantic import BaseModel, Field


class User(BaseModel):
    id: int = Field(
        ...,
        ge=1,
    )
    email: str = Field(
        ...
    )
    name: str = Field(
        ...,
        min_length=2,
    )

    model_config = {"from_attributes": True}
