"""Models for game sessions and rounds, using SQLModel for database mapping"""

import uuid
from typing import Optional
from sqlmodel import Field, SQLModel


class GameSession(SQLModel, table=True):
    # Tracks the state of a player's session
    game_id: uuid.UUID = Field(
        default_factory=uuid.uuid4, primary_key=True
    ) 
    user_id: uuid.UUID = Field(foreign_key="user.user_id")
    total_score: int = Field(default=0)
    is_active: bool = Field(default=True)


class GameRound(SQLModel, table=True):
    # Tracks a specific guess and result for a single animal
    round_id: uuid.UUID = Field(
        default_factory=uuid.uuid4, primary_key=True
    )
    game_id: uuid.UUID = Field(foreign_key="gamesession.game_id")
    species_id: str = Field(foreign_key="species.species_id")
    clues_used: int = Field(default=0) 
    user_guess: Optional[str] = (
        None  # Optional until the player actually makes a guess
    )
    score: int = Field(default=0)
    is_completed: bool = Field(default=False)
