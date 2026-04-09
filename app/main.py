"""Main FastAPI application"""

from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.database.connection import engine
from sqlmodel import SQLModel
from app.models import game, species
from app.routers import game as game_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables
    SQLModel.metadata.create_all(bind=engine)
    print("Database initialized.")
    yield
    # Shutdown
    print("Shutting down app")


# --- App ----
app = FastAPI(
    title="Habitat Hunter",
    lifespan=lifespan,
)

# Mount the /game routes
app.include_router(game_router.router)


@app.get("/")
def read_root():
    return {"message": "Habitat Hunter API is running"}
