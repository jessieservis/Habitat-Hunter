"""Tests for the database, sets up fixtures for other tests to use"""

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database.connection import get_db
from app.models.species import Species

# 1. Create an in-memory SQLite database
sqlite_url = "sqlite://"
engine = create_engine(
    sqlite_url, connect_args={"check_same_thread": False}, poolclass=StaticPool
)


@pytest.fixture(name="session")
def session_fixture():
    # 2. Build tables
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        # 3. Seed a fake animal so the game logic has something to pick
        test_animal = Species(
            species_id="test-animal",
            name="Test Animal",
            location="testland",
            clues=["It lives in tests.", "It loves code."],
            conservation_info="Safe",
        )
        session.add(test_animal)
        session.commit()

        yield session

    # 4. Destroy tables after tests
    SQLModel.metadata.drop_all(engine)


@pytest.fixture(name="client")
def client_fixture(session: Session):
    # 5. Intercept FastAPI's database dependency
    def get_session_override():
        return session

    app.dependency_overrides[get_db] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


@pytest.fixture(name="auth_client")
def auth_client_fixture(client: TestClient):
    # 6. Helper fixture that provides a pre-logged-in client
    client.post("/auth/register", json={"username": "testuser", "password": "password"})
    response = client.post(
        "/auth/token", data={"username": "testuser", "password": "password"}
    )
    token = response.json()["access_token"]

    client.headers.update({"Authorization": f"Bearer {token}"})
    return client
