import uuid
from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    # Tracks the Game's Users
    user_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    username: str = Field(unique=True, index=True)
    hashed_password: str
