"""Password hashing and short-lived JWT access tokens for CMS administrators."""

from datetime import UTC, datetime, timedelta
from typing import Any
from uuid import UUID, uuid4

import jwt
from passlib.context import CryptContext  # type: ignore[import-untyped]

from app.core.config import get_settings

_passwords = CryptContext(schemes=["bcrypt"], deprecated="auto")
_algorithm = "HS256"


def hash_password(password: str) -> str:
    """Return a bcrypt password hash."""
    return _passwords.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    """Compare a password against its one-way hash."""
    return _passwords.verify(password, password_hash)


def create_access_token(*, subject: UUID, role: str) -> str:
    """Issue a signed, short-lived access token."""
    settings = get_settings()
    now = datetime.now(UTC)
    payload: dict[str, Any] = {
        "sub": str(subject),
        "role": role,
        "iat": now,
        "exp": now + timedelta(minutes=settings.admin_jwt_expire_minutes),
        "type": "admin_access",
        "jti": str(uuid4()),
    }
    return jwt.encode(
        payload, settings.admin_jwt_secret.get_secret_value(), algorithm=_algorithm
    )


def decode_access_token(token: str) -> dict[str, Any]:
    """Validate and decode an admin access token."""
    settings = get_settings()
    return jwt.decode(
        token, settings.admin_jwt_secret.get_secret_value(), algorithms=[_algorithm]
    )
