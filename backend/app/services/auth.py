"""Authentication helpers used by the auth router"""

import os
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from passlib.context import CryptContext

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change_this_in_production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Password helpers
def hash_password(plain: str) -> str:
    # return hash of plain text password
    return pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    # return true if plain text password matches the hashed password
    return pwd_context.verify(plain, hashed)


# Token helpers
def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    # create a JWT access token with the given data and expiration time
    payload = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    payload.update({"exp": expire})
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> str | None:
    # decodes the JWT access token and return the username if valid, otherwise return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str | None = payload.get("sub")
        return username
    except JWTError:
        return None
