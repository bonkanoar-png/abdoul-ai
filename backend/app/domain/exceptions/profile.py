"""Public profile domain exceptions."""

from app.domain.exceptions.portfolio import DomainException


class InvalidProfile(DomainException):
    """Raised when required public profile data is missing."""
