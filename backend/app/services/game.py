"""Shared game flow helpers for Habitat Hunter."""

import random
import uuid
from fastapi import HTTPException
from sqlmodel import Session, select
from app.models.game import GameRound, GameSession
from app.models.species import Species
from app.services.mapping import generate_comparison_map
from app.services.score import evaluate_guess


def start_round_for_game(db: Session, game_id: uuid.UUID) -> GameRound:
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

    return round


def get_next_clue_for_round(db: Session, game_id: uuid.UUID, round_id: uuid.UUID) -> str:
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
    return clue


def submit_guess_for_round(
    db: Session,
    game_id: uuid.UUID,
    round_id: uuid.UUID,
    guess: str,
) -> dict[str, object]:
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
    is_correct, score, cleaned_guess, location = evaluate_guess(
        guess, species.location, round.clues_used
    )

    # Save round
    round.is_completed = True
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
        "species_name": species.name,
        "conservation_info": species.conservation_info,
        "message": (
            "Correct!"
            if is_correct
            else f"Incorrect. The animal was from {species.location}."
        ),
    }
