"""Database connection and session management"""

from sqlmodel import Session
from app.config.database import engine


def get_db():
    with Session(engine) as session:
        yield session
