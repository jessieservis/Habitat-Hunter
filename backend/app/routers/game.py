"""Routes for the game API"""

from fastapi import APIRouter, Depends, Form
from sqlmodel import Session
from uuid import UUID
from app.database.connection import get_db
from app.models.game import GameSession
from app.routers.auth import get_current_user
from app.models.user import UserPublic
from app.services.game import (
    get_next_clue_for_round,
    start_round_for_game,
    submit_guess_for_round,
)

router = APIRouter(prefix="/game", tags=["Game"])


@router.post("", status_code=201)
def create_game_session(
    db: Session = Depends(get_db), current_user: UserPublic = Depends(get_current_user)
):
    # Creates a new game session
    game = GameSession(user_id=current_user.user_id)
    # Save game to db
    db.add(game)
    db.commit()
    db.refresh(game)

    # return game id
    return {"game_id": game.game_id, "status": "active"}


@router.post("/{game_id}/round", status_code=201)
def start_round(
    game_id: UUID,
    db: Session = Depends(get_db),
    current_user: UserPublic = Depends(get_current_user),
):
    # Starts a new round and assigns a mystery animal
    round_ = start_round_for_game(db, game_id)

    # Return round id and message for the mystery animal
    return {
        "round_id": round_.round_id,
        "message": "New mystery animal assigned. Start guessing!",
    }


@router.get("/{game_id}/{round_id}/clue", status_code=200)
def give_clue(
    game_id: UUID,
    round_id: UUID,
    db: Session = Depends(get_db),
    current_user: UserPublic = Depends(get_current_user),
):
    # Gives a clue for the current animal
    clue = get_next_clue_for_round(db, game_id, round_id)
    return {"clue": clue}


@router.post("/{game_id}/{round_id}/guess", status_code=200)
def make_guess(
    game_id: UUID,
    round_id: UUID,
    guess: str = Form(...),
    db: Session = Depends(get_db),
    current_user: UserPublic = Depends(get_current_user),
):

    # Handles a user's guess for the current animal
    return submit_guess_for_round(db, game_id, round_id, guess)
