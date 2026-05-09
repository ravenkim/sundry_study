from __future__ import annotations

from typing import Optional

from pydantic import AliasChoices, BaseModel, ConfigDict, EmailStr, Field


class SignupRequest(BaseModel):
    """FE 회원가입 폼의 `name` 과 호환 (`nickname` 과 동일 의미)."""

    model_config = ConfigDict(populate_by_name=True)

    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    nickname: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=64,
        validation_alias=AliasChoices("nickname", "name"),
    )


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    nickname: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
