"""Append-only audit logging service."""

from uuid import UUID

from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.database.models import AuditLog, UserAdmin


class AuditService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    def record(
        self,
        *,
        actor: UserAdmin,
        action: str,
        resource: str,
        request: Request,
        resource_id: UUID | None = None,
        old_value: dict[str, object] | None = None,
        new_value: dict[str, object] | None = None,
    ) -> None:
        self.session.add(
            AuditLog(
                actor_id=actor.id,
                actor_email=actor.email,
                action=action,
                resource=resource,
                resource_id=resource_id,
                old_value=old_value,
                new_value=new_value,
                ip_address=request.client.host if request.client else None,
                user_agent=request.headers.get("user-agent"),
                request_id=request.headers.get("x-request-id"),
            )
        )
