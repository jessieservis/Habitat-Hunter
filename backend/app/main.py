"""Main FastAPI application"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Session, select
from app.config.database import engine
from app.models import species
from app.models.species import Species
from app.routers import species as species_router
from app.routers import game as game_router
from app.routers import auth as auth_router

# from app.models import game, species, user
from scripts.seed_db import seed_animals


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

# Add the game routes
app.include_router(game_router.router)

# Add auth routes
app.include_router(auth_router.router)

# Add species routes
# app.include_router(species_router.router)

@app.get("/")
def read_root():
    return {"message": "Habitat Hunter API is running"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",  # Allow 5173 frontend to send requests to backend
        "http://localhost:5174",  # Sometimes Vite bumps to 5174 if 5173 is busy
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],  # The '*' here is what specifically allows the OPTIONS method
    allow_headers=["*"],
)
