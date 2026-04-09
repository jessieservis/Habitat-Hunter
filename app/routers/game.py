"""Routes with business logic for the game."""

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.models.game import GameSession, GameRound
from app.models.species import Species
from app.database.connection import get_db
import uuid
import random

router = APIRouter(prefix="/game", tags=["Game"])


@router.post("", status_code=201)
def create_game_session(db: Session = Depends(get_db)):
    """
    Creates a new game session
    """
    # Create new game class
    game = GameSession()

    # Save game to db
    db.add(game)
    db.commit()
    db.refresh(game)

    # return game id
    return {"game_id": game.game_id, "status": "active"}


@router.post("/{game_id}/round", status_code=201)
def start_round(
    game_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    """
    Starts a new round and assigns a mystery animal
    """
    # Ensure the game session exists and is active
    game = db.get(GameSession, game_id)
    if not game:
        raise HTTPException(status_code=404, detail="Game session not found")
    if game.is_active is False:
        raise HTTPException(status_code=400, detail="Game session is not active")

    # Get all species IDs that have already been played in this specific game
    played_rounds = db.exec(select(GameRound).where(GameRound.game_id == game_id)).all()
    played_species_ids = {r.species_id for r in played_rounds}

    # Get all available species from the database
    all_species = db.exec(select(Species)).all()

    # Filter out the ones already played
    available_species = [
        s for s in all_species if s.species_id not in played_species_ids
    ]

    if not available_species:
        raise HTTPException(
            status_code=400, detail="No more animals left to guess in this session."
        )

    # Pick a random animal from the remaining pool
    chosen_species = random.choice(available_species)

    # Create a new round class
    round = GameRound(
        game_id=game_id,
        species_id=chosen_species.species_id,
    )

    # Save round to db
    db.add(round)
    db.commit()
    db.refresh(round)

    # Return round id and message for the mystery animal
    return {
        "round_id": round.round_id,
        "message": "New mystery animal assigned. Start guessing!",
    }


# TODO: Implement the get clue and make guess endpoints
