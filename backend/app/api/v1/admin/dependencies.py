"""Authentication and authorization dependencies for Admin routes."""

from typing import Annotated
from uuid import UUID

import jwt
from fastapi import Cookie, Depends, HTTPException, params
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.database import get_db_session
from app.infrastructure.database.models.user_admin import UserAdmin
from app.security.admin_auth import decode_access_token
from app.security.admin_rbac import AdminPermission, has_admin_permission
from app.security.token_revocation import TokenRevocationService


async def get_current_admin(
    session: Annotated[AsyncSession, Depends(get_db_session)],
    access_token: Annotated[str | None, Cookie()] = None,
) -> UserAdmin:
    """Resolve the authenticated administrator from the HttpOnly cookie."""
    if access_token is None:
        raise HTTPException(status_code=401, detail="Authentication required.")
    try:
        claims = decode_access_token(access_token)
        if await TokenRevocationService().is_revoked(str(claims["jti"])):
            raise HTTPException(
                status_code=401, detail="Access token has been revoked."
            )
        admin_id = UUID(str(claims["sub"]))
    except HTTPException:
        raise
    except (jwt.PyJWTError, KeyError, ValueError) as exc:
        raise HTTPException(
            status_code=401, detail="Invalid or expired access token."
        ) from exc
    admin = await session.scalar(select(UserAdmin).where(UserAdmin.id == admin_id))
    if admin is None:
        raise HTTPException(status_code=401, detail="Administrator no longer exists.")
    return admin


CurrentAdmin = Annotated[UserAdmin, Depends(get_current_admin)]
DatabaseSession = Annotated[AsyncSession, Depends(get_db_session)]


def require_permission(permission: AdminPermission) -> params.Depends:
    """Build a FastAPI dependency enforcing one permission."""

    async def dependency(admin: CurrentAdmin) -> UserAdmin:
        if not has_admin_permission(admin.role, permission):
            raise HTTPException(status_code=403, detail="Insufficient permission.")
        return admin

    return Depends(dependency)
