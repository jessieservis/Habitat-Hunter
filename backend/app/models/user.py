"""Models for user data, using SQLModel for database mapping"""

import uuid
from sqlmodel import Field, SQLModel
from pydantic import BaseModel


class User(SQLModel, table=True):
    # Tracks the Game's Users
    user_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    username: str = Field(unique=True, index=True)
    hashed_password: str


class UserCreate(BaseModel):
    # How data looks when registering new user
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8)


class UserPublic(BaseModel):
    # User data that is returned to callers
    user_id: uuid.UUID
    username: str


class TokenResponse(BaseModel):
    # JWT token response returned by post auth token
    access_token: str
    token_type: str = "bearer"
