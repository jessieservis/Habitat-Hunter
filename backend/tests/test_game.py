"""Tests for the game API"""

import uuid
from app.models.game import GameSession


def test_unauthorized_user_blocked(client):
    # Tests that an unauthenticated user cannot create a game session
    response = client.post("/game")
    assert response.status_code == 401


def test_create_game_session(auth_client):
    # Tests that an authenticated user can create a game session
    response = auth_client.post("/game")
    assert response.status_code == 201
    assert "game_id" in response.json()


def test_full_game_loop(auth_client):
    # Tests the whole game flow
    # 1. Start Game
    game_res = auth_client.post("/game")
    game_id = game_res.json()["game_id"]

    # 2. Start Round
    round_res = auth_client.post(f"/game/{game_id}/round")
    assert round_res.status_code == 201
    round_id = round_res.json()["round_id"]

    # 3. Get Clue
    clue_res = auth_client.get(f"/game/{game_id}/{round_id}/clue")
    assert clue_res.status_code == 200
    assert clue_res.json()["clue"] == "It lives in tests."

    # 4. Make Correct Guess
    guess_res = auth_client.post(
        f"/game/{game_id}/{round_id}/guess",
        data={"guess": "testland"},  # Matches our conftest.py seed data
    )
    assert guess_res.status_code == 200
    data = guess_res.json()
    assert data["correct"] is True
    assert data["score"] > 0
    assert data["species_name"] == "Test Animal"


def test_guessing_twice_on_same_round_fails(auth_client):
    """
    Tests that once a guess has been submitted for a round,
    the round is marked as completed and no further guesses are accepted
    """
    game_res = auth_client.post("/game")
    game_id = game_res.json()["game_id"]

    round_res = auth_client.post(f"/game/{game_id}/round")
    round_id = round_res.json()["round_id"]

    first_guess = auth_client.post(
        f"/game/{game_id}/{round_id}/guess",
        data={"guess": "testland"},
    )
    assert first_guess.status_code == 200

    second_guess = auth_client.post(
        f"/game/{game_id}/{round_id}/guess",
        data={"guess": "testland"},
    )
    assert second_guess.status_code == 400
    assert second_guess.json()["detail"] == "Round is already completed"


def test_start_round_rejects_inactive_game(auth_client, session):
    # Tests that you cannot start a round on a game session that has been marked as inactive
    game_res = auth_client.post("/game")
    game_id = uuid.UUID(game_res.json()["game_id"])

    game = session.get(GameSession, game_id)
    assert game is not None
    game.is_active = False
    session.add(game)
    session.commit()

    round_res = auth_client.post(f"/game/{game_id}/round")
    assert round_res.status_code == 400
    assert round_res.json()["detail"] == "Game session is not active"
