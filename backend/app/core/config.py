"""Centralized, typed application configuration."""

from functools import lru_cache
from typing import Annotated, Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


AppEnvironment = Literal["development", "test", "production"]


class Settings(BaseSettings):
    """Runtime settings loaded from environment variables and an optional `.env` file."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = "abdoul-ai"
    app_env: AppEnvironment = "development"
    debug: bool = Field(default=False, validation_alias="APP_DEBUG")
    api_v1_prefix: str = "/api/v1"
    backend_host: str = "0.0.0.0"
    backend_port: Annotated[int, Field(ge=1, le=65535)] = 8000

    @field_validator("api_v1_prefix")
    @classmethod
    def validate_api_v1_prefix(cls, value: str) -> str:
        """Keep API paths predictable before routers are introduced."""
        if not value.startswith("/"):
            raise ValueError("API_V1_PREFIX must start with '/'.")
        if value != "/" and value.endswith("/"):
            raise ValueError("API_V1_PREFIX must not end with '/'.")
        return value


@lru_cache
def get_settings() -> Settings:
    """Return the process-wide validated settings instance."""
    return Settings()
