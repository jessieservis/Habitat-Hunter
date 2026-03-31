from sqlmodel import SQLModel, Field, Column, JSON
from typing import List


class Species(SQLModel, table=True):
    species_id: str = Field(primary_key=True)
    name: str
    location: str
    clues: List[str] = Field(sa_column=Column(JSON))  # SQLAlchemy column
    conservation_info: str
