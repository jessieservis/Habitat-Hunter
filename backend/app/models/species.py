"""Models for species data, using SQLModel for database mapping"""

from sqlmodel import SQLModel, Field, Column, JSON
from typing import List


class Species(SQLModel, table=True):
    # Tracks the species data for the game
    species_id: str = Field(primary_key=True)
    name: str
    location: str
    clues: List[str] = Field(sa_column=Column(JSON))
    conservation_info: str
