"""Main FastAPI application"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from sqlmodel import SQLModel, Session, select
from backend.app.config.database import engine
from backend.app.models import species
from backend.app.models.species import Species
from backend.app.routers import game as game_router
from backend.app.models import game
from backend.scripts.seed_db import seed_animals


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables
    SQLModel.metadata.create_all(bind=engine)

    # Check if the database is empty, if so, initialize it with mock animals
    with Session(engine) as session:
        # Query for the first species. if nothing comes back, the table is empty
        existing_data = session.exec(select(Species)).first()
        if not existing_data:
            print("Database is empty. Adding mock animals...")
            seed_animals()
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
