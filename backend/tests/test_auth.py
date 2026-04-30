"""Tests for the authentication routes"""
from datetime import timedelta

from app.services.auth import create_access_token, decode_access_token


def test_expired_token_is_invalid():
    # Create a token that expired in the past
    token = create_access_token(
        {"sub": "expired_user"}, expires_delta=timedelta(seconds=-1)
    )
    assert decode_access_token(token) is None


def test_register_creates_user(client):
    # Tests that a new user can register successfully
    response = client.post(
        "/auth/register", json={"username": "alice", "password": "password123"}
    )
    assert response.status_code == 201
    assert response.json()["username"] == "alice"


def test_register_duplicate_fails(client):
    # Tests that registering with an existing username fails
    client.post("/auth/register", json={"username": "bob", "password": "password123"})
    response = client.post(
        "/auth/register", json={"username": "bob", "password": "password123"}
    )
    assert response.status_code == 409


def test_login_returns_token(client):
    # Tests that a registered user can log in and receive a token
    client.post(
        "/auth/register", json={"username": "charlie", "password": "password123"}
    )
    response = client.post(
        "/auth/token", data={"username": "charlie", "password": "password123"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
