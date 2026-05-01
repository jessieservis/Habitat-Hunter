# Habitat Hunter Documentation

Created by: Jessie Servis (servi1jm)

## 1. Project Overview

Habitat Hunter is a full-stack web application where players guess where endangered animals live based on progressively revealed clues. The project combines a FastAPI backend, a React/Vite frontend, and a SQLite database seeded with species data.

The intended users are students, instructors, and players participating in an educational conservation game. The application supports three core user experiences:

- Account creation and login.
- A clue-based guessing game with score tracking.
- A result screen that reveals the species, conservation status, and a visual map comparison.

The game is designed to reinforce geography and conservation awareness. Each round presents a mystery species, gives the player one clue at a time, and awards more points when the player guesses correctly with fewer clues.

## 2. Deployment and Operations

### Local Setup

#### Backend

1. Create and activate a Python virtual environment.
2. Install dependencies from `backend/requirements.txt`.
3. Set `JWT_SECRET_KEY`.
4. Start the API with Uvicorn.

Windows PowerShell example:

```powershell
$env:JWT_SECRET_KEY = 'a-very-secret-key'
cd backend
uvicorn app.main:app --reload
```

The backend will:

- create the SQLite tables on startup,
- seed the species table if it is empty,
- expose the API on `http://127.0.0.1:8000`.

#### Frontend

1. Install frontend dependencies.
2. Start the Vite dev server.

Example:

```bash
cd frontend
npm i
npm run dev
```

The frontend is configured to call the backend at `http://127.0.0.1:8000`.

### Environment Variables

#### JWT_SECRET_KEY

Required for secure token signing.

- If unset, the backend falls back to a default insecure value and emits a warning.
- This is acceptable for local development only.
- Production deployments must set a strong secret.

### Database Behavior

- The application uses SQLite and creates a local database file named `habitat_hunter.db`.
- Tables are created automatically when the app starts.
- If the species table is empty, the application seeds it with mock endangered species records.

### Logging and Error Handling

- The SQLModel engine is configured with `echo=True`, so SQL statements are logged during development.
- Authentication failures return 401 responses.
- Missing or invalid game state returns 400 or 404 responses depending on the failure mode.
- The frontend handles 401 responses by clearing local session state and redirecting to login.

### Testing

The backend test suite uses an in-memory SQLite database and FastAPI test client fixtures.

Recommended command:

```powershell
cd backend
pytest -q
```

The tests cover:

- authentication success and failure cases,
- game session creation,
- round flow,
- clue delivery,
- scoring behavior,
- map generation guardrails.

### Operational Notes

- The repository does not include containerization or cloud deployment manifests.
- The current setup is intended for local development and classroom demonstration.
- For a production deployment, use a stronger database, set a real JWT secret, and place the backend behind a deployment target that supports persistent storage.

## 3. Important Implementation Details

- The frontend keeps the active game and round identifiers in memory, so a hard refresh can interrupt the current game flow.
- The result screen relies on client-side navigation state; direct navigation to `/result` redirects back to the start screen.
- The guess comparison is case-insensitive and trims whitespace.
- The map image is returned from the backend as base64 data and rendered by the frontend as a PNG image.
- Conservation text is shown after each guess to reinforce the educational goal of the project.

## 4. System Architecture

### Architecture Notes

The frontend is a single-page application that routes between login, start, play, and results views. It stores the JWT token in browser localStorage and keeps the current game and round identifiers in module-level client state.

The backend exposes authenticated game routes and unauthenticated auth routes. On startup, FastAPI creates the database tables, checks whether the species table is empty, and seeds the database if needed. The game service layer handles round selection, clue delivery, guess evaluation, scoring, and map generation.

### Main Runtime Components

- Frontend UI: React, React Router, Motion, Lucide icons.
- Backend API: FastAPI with CORS enabled for local Vite development.
- Persistence: SQLModel on SQLite.
- Game content: Seeded endangered species records.
- Map rendering: Plotly export through Kaleido, returned as base64 PNG data.
- Authentication: JWT bearer tokens with password hashing.

## 5. User Experience

### Player Flow

1. The player registers or logs in.
2. The frontend stores the JWT token and redirects to the start screen.
3. When the player starts a round, the frontend creates a game session if one does not already exist.
4. The backend selects a species not yet used in that game session.
5. The frontend requests clues one at a time.
6. The player submits a guess for the species’ country.
7. The backend returns correctness, score, total score, conservation info, and a comparison map.
8. The player proceeds to the next animal and repeats the loop.

### Frontend Screens

- Login/register screen for authentication.
- Start screen for beginning the game.
- Active round screen for clues and guesses.
- Result screen for answer reveal and scoring.

## 6. Data Model

```mermaid
  USER {
    uuid user_id PK
    string username "unique"
    string hashed_password
  }

  GAMESESSION {
    uuid game_id PK
    uuid user_id FK
    int total_score
    bool is_active
  }

  GAMEROUND {
    uuid round_id PK
    uuid game_id FK
    string species_id FK
    int clues_used
    string user_guess
    int score
    bool is_completed
  }

  SPECIES {
    string species_id PK
    string name
    string location
    json clues
    string conservation_info
  }
```

### Entities

#### User

A user account stores a UUID primary key, a unique username, and a hashed password. Passwords are never returned in API responses.

#### GameSession

A game session belongs to one user and tracks the player’s cumulative score and whether the session is still active.

#### GameRound

A game round belongs to one game session and stores the chosen species, the number of clues used, the player’s guess, the round score, and whether the round has already been completed.

#### Species

A species record stores the endangered animal metadata used by the game:

- species_id: stable string identifier.
- name: display name.
- location: the correct country or region the player is trying to guess.
- clues: ordered list of clue strings.
- conservation_info: educational conservation summary shown after the round.

### Relationships

- One user can own many game sessions.
- One game session can contain many rounds.
- One species can appear in many rounds across different games.
- A single round references exactly one species.

## 7. Business Rules

The following rules are enforced by the implementation:

- Usernames must be unique.
- Usernames must be 3 to 50 characters long.
- Passwords must be at least 8 characters long on the backend.
- JWT access tokens expire after 30 minutes.
- All game routes require a valid Bearer token.
- A new game session is created when the player begins playing and no active session exists on the client.
- A round cannot be played against an inactive game session.
- A species cannot repeat within the same game session.
- A round can only be guessed once.
- Clues are revealed in order.
- The backend refuses to provide more clues after the species’ clue list is exhausted.
- Correct guesses earn points; incorrect guesses earn zero.
- Score decreases as more clues are used, with a minimum floor of 200 points for a correct answer.
- The map visual compares the guessed location to the actual location.
- Blank guesses are not a supported input path; the frontend prevents empty submission and the service layer expects a non-empty string.

### Scoring Rule

The score formula is implemented in the scoring service:

- Base score: 1200
- Clue penalty: 200 points per clue used
- Minimum score for a correct answer: 200
- Incorrect answers: 0

This means a correct first-guess answer earns 1000 points, and each clue reduces the reward by 200 until the floor of 200 is reached.

## 8. API Documentation

### 8.1 Health Endpoint

#### GET /

Purpose: confirm that the API is running.

Authentication: none

Response:

```json
{ "message": "Habitat Hunter API is running" }
```

Status codes:

- 200 OK

---

### 8.2 Authentication

#### POST /auth/register

Purpose: create a new user account.

Authentication: none

Request body:

```json
{
	"username": "alice",
	"password": "password123"
}
```

Validation:

- `username` must be 3 to 50 characters.
- `password` must be at least 8 characters.

Successful response:

```json
{
	"user_id": "7f4f45f4-4ce4-4b4b-8f4f-2c0f6d3d9c9f",
	"username": "alice"
}
```

Status codes:

- 201 Created
- 409 Conflict when the username is already taken

Example:

```bash
curl -X POST http://127.0.0.1:8000/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"alice\",\"password\":\"password123\"}"
```

#### POST /auth/token

Purpose: exchange credentials for a JWT access token.

Authentication: none

Content type: application/x-www-form-urlencoded

Request form fields:

- username
- password

Successful response:

```json
{
	"access_token": "eyJhbGciOiJIUzI1NiIs...",
	"token_type": "bearer"
}
```

Status codes:

- 200 OK
- 401 Unauthorized when credentials are invalid

Example:

```bash
curl -X POST http://127.0.0.1:8000/auth/token ^
  -H "Content-Type: application/x-www-form-urlencoded" ^
  -d "username=alice&password=password123"
```

### Authentication Notes

- The frontend stores the returned token in browser localStorage.
- All game requests include `Authorization: Bearer <token>`.
- If the backend returns 401, the frontend clears the token and redirects the user to the login screen.

---

### 8.3 Game Flow

#### POST /game

Purpose: create a new game session for the current user.

Authentication: required

Request body: none

Successful response:

```json
{
	"game_id": "8dc2c1d9-6b34-4c1a-8b42-c7f55af9b7b0",
	"status": "active"
}
```

Status codes:

- 201 Created
- 401 Unauthorized if the token is missing or invalid

Example:

```bash
curl -X POST http://127.0.0.1:8000/game ^
  -H "Authorization: Bearer <token>"
```

#### POST /game/{game_id}/round

Purpose: start a new round inside an existing game session.

Authentication: required

Path parameters:

- `game_id`: UUID of the game session

Request body: none

Successful response:

```json
{
	"round_id": "d6f86d72-18ec-4fc9-8db0-7ddf13b7cb7a",
	"message": "New mystery animal assigned. Start guessing!"
}
```

Status codes:

- 201 Created
- 400 Bad Request if the game is inactive
- 401 Unauthorized if the token is missing or invalid
- 404 Not Found if the game session does not exist

Example:

```bash
curl -X POST http://127.0.0.1:8000/game/<game_id>/round ^
  -H "Authorization: Bearer <token>"
```

#### GET /game/{game_id}/{round_id}/clue

Purpose: reveal the next clue for the current round.

Authentication: required

Path parameters:

- `game_id`: UUID of the game session
- `round_id`: UUID of the round

Request body: none

Successful response:

```json
{
	"clue": "I am a small, rust-colored mammal with a ringed tail."
}
```

Status codes:

- 200 OK
- 400 Bad Request if no clues remain or the game/round is invalid for the session
- 401 Unauthorized if the token is missing or invalid
- 404 Not Found if the game or round does not exist

Behavior:

- Clues are served in order.
- Each successful clue request increments the round’s clue counter.

Example:

```bash
curl http://127.0.0.1:8000/game/<game_id>/<round_id>/clue ^
  -H "Authorization: Bearer <token>"
```

#### POST /game/{game_id}/{round_id}/guess

Purpose: submit a final guess for the current round.

Authentication: required

Path parameters:

- `game_id`: UUID of the game session
- `round_id`: UUID of the round

Request body type: form data

Form fields:

- guess: string containing the player’s country guess

Successful response:

```json
{
	"correct": true,
	"location": "Mexico",
	"score": 1000,
	"total_score": 1000,
	"clues_used": 1,
	"map_image": "<base64 PNG data>",
	"species_name": "Axolotl",
	"conservation_info": "Critically Endangered ...",
	"message": "Correct!"
}
```

Status codes:

- 200 OK
- 400 Bad Request if the round is already completed, the round does not belong to the game, or the game is inactive
- 401 Unauthorized if the token is missing or invalid
- 404 Not Found if the game or round does not exist

Important response fields:

- `correct`: boolean outcome of the guess
- `location`: the actual country or location
- `score`: points earned for this round
- `total_score`: cumulative score for the session
- `clues_used`: number of clues consumed before guessing
- `map_image`: base64-encoded PNG used by the frontend to render the comparison map
- `species_name`: revealed species name
- `conservation_info`: conservation summary shown to the player
- `message`: human-readable result string

Example:

```bash
curl -X POST http://127.0.0.1:8000/game/<game_id>/<round_id>/guess ^
  -H "Authorization: Bearer <token>" ^
  -F "guess=Mexico"
```

### 8.4 OpenAPI Relationship

Because the backend is built with FastAPI and Pydantic/SQLModel models, the route definitions automatically generate the machine-readable schema used by `/docs` and `/redoc`.

This document complements the generated docs in three ways:

- It explains the gameplay flow in plain language.
- It describes the database relationships and business rules.
- It documents the real client behavior, including how the frontend stores the token and manages round state.

If the API changes, updating the route definitions and response models will automatically keep the generated OpenAPI docs current.
