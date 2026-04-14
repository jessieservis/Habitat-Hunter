"""Routes with business logic for the game."""

from fastapi import APIRouter, Depends, Form, HTTPException
from sqlmodel import Session, select
from app.models import species
from app.models.game import GameSession, GameRound
from app.models.species import Species
from app.database.connection import get_db
import uuid
import random
from app.services.mapping import generate_comparison_map

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


@router.get("/{game_id}/{round_id}/clue", status_code=200)
def give_clue(
    game_id: uuid.UUID,
    round_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    """
    Gives a clue for the current animal
    """
    # Ensure the game session exists and is active
    game = db.get(GameSession, game_id)
    if not game:
        raise HTTPException(status_code=404, detail="Game session not found")
    if game.is_active is False:
        raise HTTPException(status_code=400, detail="Game session is not active")

    # Ensure the round exists and belongs to the game session
    round = db.get(GameRound, round_id)
    if not round:
        raise HTTPException(status_code=404, detail="Round not found")
    if round.game_id != game_id:
        raise HTTPException(
            status_code=400, detail="Round does not belong to this game session"
        )

    # Give a clue
    species = db.get(Species, round.species_id)
    if round.clues_used >= len(species.clues):
        raise HTTPException(
            status_code=400, detail="No more clues available for this animal"
        )
    clue = species.clues[round.clues_used]

    # Increment clues used
    round.clues_used += 1

    # Save round to db
    db.add(round)
    db.commit()
    db.refresh(round)

    # Return the clue
    return {
        "clue": clue,
    }


@router.post("/{game_id}/{round_id}/guess", status_code=200)
def make_guess(
    game_id: uuid.UUID,
    round_id: uuid.UUID,
    guess: str = Form(...),
    db: Session = Depends(get_db),
):
    """
    Handles a user's guess for the current animal
    """
    # Ensure the game session exists and is active
    game = db.get(GameSession, game_id)
    if not game:
        raise HTTPException(status_code=404, detail="Game session not found")
    if game.is_active is False:
        raise HTTPException(status_code=400, detail="Game session is not active")

    # Ensure the round exists and belongs to the game session
    round = db.get(GameRound, round_id)
    if not round:
        raise HTTPException(status_code=404, detail="Round not found")
    if round.game_id != game_id:
        raise HTTPException(
            status_code=400, detail="Round does not belong to this game session"
        )
    if round.is_completed:
        raise HTTPException(status_code=400, detail="Round is already completed")

    species = db.get(Species, round.species_id)

    # Check the guess against the correct answer
    cleaned_guess = guess.strip().lower()
    location = species.location.strip().lower()
    is_correct = cleaned_guess == location

    # Calculate score (Example: 1000 pts base, minus 200 per clue used)
    score = 0
    if is_correct:
        penalty = round.clues_used * 200
        score = max(100, 1000 - penalty)  # Minimum of 100 points if they get it right

    # Save round
    round.is_completed = is_correct
    round.score = score
    db.add(round)
    db.commit()

    # Generate the Plotly Map
    map_base64 = generate_comparison_map(cleaned_guess, location)

    return {
        "correct": is_correct,
        "location": species.location,
        "score": score,
        "clues_used": round.clues_used,
        "map_image": map_base64,
        "message": (
            "Correct!"
            if is_correct
            else f"Incorrect. The animal was from {species.location}."
        ),
    }
