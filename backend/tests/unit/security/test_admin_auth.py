"""Unit tests for administrator credentials and JWT tokens."""

from uuid import uuid4

import jwt
import pytest

from app.security.admin_auth import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)


def test_password_is_hashed_and_verified() -> None:
    password = "a-secure-admin-password"
    password_hash = hash_password(password)
    assert password not in password_hash
    assert verify_password(password, password_hash)
    assert not verify_password("incorrect-password", password_hash)


def test_access_token_contains_subject_and_role() -> None:
    subject = uuid4()
    claims = decode_access_token(create_access_token(subject=subject, role="ADMIN"))
    assert claims["sub"] == str(subject)
    assert claims["role"] == "ADMIN"
    assert claims["type"] == "admin_access"


def test_invalid_access_token_is_rejected() -> None:
    with pytest.raises(jwt.PyJWTError):
        decode_access_token("not-a-token")
