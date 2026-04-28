"""Routes for user authentication and token management"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session, select
from app.database.connection import get_db
from app.models.user import User, UserCreate, UserPublic, TokenResponse
from app.services.auth import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
)

router = APIRouter(prefix="/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


# Helpers
def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> UserPublic:
    """
    Dependency: validate the Bearer token and return the current user.
    Raise 401 if the token is missing, expired, or tampered with.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    username = decode_access_token(token)
    if username is None:
        raise credentials_exception

    user = db.exec(select(User).where(User.username == username)).first()
    if user is None:
        raise credentials_exception

    return UserPublic(user_id=user.user_id, username=user.username)


# Endpoints
@router.post(
    "/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED
)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Create a new user account. Passwords are hashed before storage.
    existing = db.exec(select(User).where(User.username == user_data.username)).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already taken",
        )

    # Hash the password and create the user record
    hashed = hash_password(user_data.password)
    new_user = User(username=user_data.username, hashed_password=hashed)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return UserPublic(user_id=new_user.user_id, username=new_user.username)


@router.post("/token", response_model=TokenResponse)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    # Exchange valid credentials for a JWT access token.
    user = db.exec(select(User).where(User.username == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create JWT token with username as subject
    token = create_access_token(data={"sub": user.username})
    return TokenResponse(access_token=token, token_type="bearer")
