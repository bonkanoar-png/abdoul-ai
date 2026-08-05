"""Cookie-authenticated, permission-aware Admin CMS routes."""

from typing import Annotated
from uuid import UUID

from fastapi import (
    APIRouter,
    File,
    Form,
    HTTPException,
    Request,
    Response,
    UploadFile,
    status,
)
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import func, select

from app.api.v1.admin.dependencies import (
    CurrentAdmin,
    DatabaseSession,
    require_permission,
)
from app.api.v1.admin.repositories import AdminContentRepository
from app.api.v1.admin.schemas import AdminContent, AdminContentInput, ProfileInput
from app.api.v1.admin.services import AdminContentService
from app.api.v1.admin.services.audit import AuditService
from app.api.v1.admin.services.documents import AdminDocumentService
from app.api.v1.admin.services.media_associations import (
    ASSOCIATIONS,
    MediaAssociationService,
)
from app.application.services.storage_service import LocalStorage
from app.core.config import get_settings
from app.infrastructure.database.models import (
    AdminRole,
    AuditLog,
    Document,
    Experience,
    Formation,
    Media,
    Profile,
    Project,
    Publication,
    UserAdmin,
)
from app.security.admin_auth import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)
from app.security.admin_rbac import AdminPermission
from app.security.token_revocation import TokenRevocationService

router = APIRouter()
auth_router = APIRouter(prefix="/auth", tags=["admin-auth"])
admin_router = APIRouter(prefix="/admin", tags=["admin"])
RESOURCES = (
    "experiences",
    "formations",
    "projects",
    "skills",
    "publications",
    "certifications",
    "documents",
)


class LoginInput(BaseModel):
    email: EmailStr
    password: str = Field(min_length=12, max_length=128)


class MediaAssociationInput(BaseModel):
    media_id: UUID
    sort_order: int = Field(default=0, ge=0, le=10_000)


@auth_router.post("/login", status_code=status.HTTP_204_NO_CONTENT)
async def login(
    payload: LoginInput, session: DatabaseSession, response: Response, request: Request
) -> Response:
    email = str(payload.email).lower()
    admin = await session.scalar(select(UserAdmin).where(UserAdmin.email == email))
    settings = get_settings()
    if (
        admin is None
        and settings.admin_initial_email
        and settings.admin_initial_password
        and email == settings.admin_initial_email.lower()
        and payload.password == settings.admin_initial_password.get_secret_value()
    ):
        admin = UserAdmin(
            email=email,
            password_hash=hash_password(payload.password),
            role=AdminRole.ADMIN,
        )
        session.add(admin)
        await session.flush()
    if admin is None or not verify_password(payload.password, admin.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials.")
    token = create_access_token(subject=admin.id, role=admin.role.value)
    secure = (
        settings.admin_cookie_secure
        if settings.admin_cookie_secure is not None
        else settings.app_env == "production"
    )
    response.set_cookie(
        settings.admin_cookie_name,
        token,
        httponly=True,
        secure=secure,
        samesite="lax",
        max_age=settings.admin_jwt_expire_minutes * 60,
        path="/api/v1",
    )
    AuditService(session).record(
        actor=admin, action="LOGIN", resource="auth", request=request
    )
    await session.commit()
    response.status_code = status.HTTP_204_NO_CONTENT
    return response


@auth_router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    response: Response, request: Request, session: DatabaseSession, admin: CurrentAdmin
) -> Response:
    settings = get_settings()
    token = request.cookies.get(settings.admin_cookie_name)
    if token:
        await TokenRevocationService().revoke(decode_access_token(token))
    AuditService(session).record(
        actor=admin, action="TOKEN_REVOKE", resource="auth", request=request
    )
    AuditService(session).record(
        actor=admin, action="LOGOUT", resource="auth", request=request
    )
    await session.commit()
    response.delete_cookie(settings.admin_cookie_name, path="/api/v1")
    response.status_code = status.HTTP_204_NO_CONTENT
    return response


@admin_router.get("/profile", response_model=ProfileInput)
async def get_profile(session: DatabaseSession, _admin: CurrentAdmin) -> Profile:
    profile = await session.scalar(
        select(Profile)
        .where(Profile.is_active.is_(True))
        .order_by(Profile.created_at)
        .limit(1)
    )
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found.")
    return profile


@admin_router.put("/profile", response_model=ProfileInput)
async def update_profile(
    payload: ProfileInput,
    request: Request,
    session: DatabaseSession,
    admin: CurrentAdmin,
) -> Profile:
    profile = await session.scalar(
        select(Profile).order_by(Profile.created_at).limit(1)
    )
    old: dict[str, object] | None = (
        None if profile is None else {"name": profile.name, "title": profile.title}
    )
    if profile is None:
        profile = Profile(
            **payload.model_dump(), created_by=admin.id, updated_by=admin.id
        )
        session.add(profile)
        await session.flush()
    else:
        for key, value in payload.model_dump().items():
            setattr(profile, key, value)
        profile.updated_by = admin.id
    AuditService(session).record(
        actor=admin,
        action="UPDATE",
        resource="profile",
        resource_id=profile.id,
        old_value=old,
        new_value=payload.model_dump(mode="json"),
        request=request,
    )
    await session.commit()
    await session.refresh(profile)
    return profile


def content_service(resource: str, session: DatabaseSession) -> AdminContentService:
    if resource not in RESOURCES:
        raise HTTPException(status_code=404, detail="Admin resource not found.")
    return AdminContentService(AdminContentRepository(session, resource), resource)


def uploads(session: DatabaseSession) -> AdminDocumentService:
    settings = get_settings()
    return AdminDocumentService(
        session,
        LocalStorage(settings.upload_directory, settings.public_upload_base_url),
        settings.upload_max_bytes,
        allowed_types=set(settings.upload_allowed_types),
    )


@admin_router.post(
    "/documents/upload",
    status_code=201,
    dependencies=[require_permission(AdminPermission.DOCUMENT_MANAGE)],
)
async def upload_document(
    request: Request,
    session: DatabaseSession,
    admin: CurrentAdmin,
    file: Annotated[UploadFile, File()],
) -> dict[str, object]:
    try:
        document = await uploads(session).upload_document(file, admin.id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    AuditService(session).record(
        actor=admin,
        action="UPLOAD",
        resource="documents",
        resource_id=document.id,
        request=request,
    )
    await session.commit()
    await session.refresh(document)
    return {
        "id": document.id,
        "filename": document.file_name,
        "original_name": document.original_name,
        "mime_type": document.mime_type,
        "size": document.file_size,
        "url": document.file_url,
    }


@admin_router.delete(
    "/documents/{document_id}",
    status_code=204,
    dependencies=[require_permission(AdminPermission.DOCUMENT_MANAGE)],
)
async def delete_document(
    document_id: UUID,
    request: Request,
    session: DatabaseSession,
    admin: CurrentAdmin,
) -> Response:
    document = await session.get(Document, document_id)
    if document is None or not document.is_active:
        raise HTTPException(status_code=404, detail="Document not found.")
    await uploads(session).delete(document, admin.id)
    AuditService(session).record(
        actor=admin,
        action="DELETE",
        resource="documents",
        resource_id=document.id,
        request=request,
    )
    await session.commit()
    return Response(status_code=204)


@admin_router.post(
    "/media/upload",
    status_code=201,
    dependencies=[require_permission(AdminPermission.DOCUMENT_MANAGE)],
)
async def upload_media(
    request: Request,
    session: DatabaseSession,
    admin: CurrentAdmin,
    file: Annotated[UploadFile, File()],
    alt_text: Annotated[str, Form()] = "",
) -> dict[str, object]:
    try:
        media = await uploads(session).upload_media(file, admin.id, alt_text)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    AuditService(session).record(
        actor=admin,
        action="UPLOAD",
        resource="media",
        resource_id=media.id,
        request=request,
    )
    await session.commit()
    await session.refresh(media)
    return {
        "id": media.id,
        "filename": media.filename,
        "url": media.url,
        "mime_type": media.mime_type,
        "size": media.size,
        "alt_text": media.alt_text,
    }


@admin_router.get(
    "/media", dependencies=[require_permission(AdminPermission.CONTENT_READ)]
)
async def list_media(
    session: DatabaseSession, _admin: CurrentAdmin
) -> list[dict[str, object]]:
    rows = list(
        (
            await session.scalars(
                select(Media)
                .where(Media.is_active.is_(True))
                .order_by(Media.created_at.desc())
            )
        ).all()
    )
    return [
        {
            "id": row.id,
            "filename": row.filename,
            "url": row.url,
            "mime_type": row.mime_type,
            "size": row.size,
            "alt_text": row.alt_text,
        }
        for row in rows
    ]


@admin_router.get(
    "/{resource}/{content_id}/media",
    dependencies=[require_permission(AdminPermission.CONTENT_READ)],
)
async def associated_media(
    resource: str, content_id: UUID, session: DatabaseSession, _admin: CurrentAdmin
) -> list[dict[str, object]]:
    if resource not in ASSOCIATIONS:
        raise HTTPException(status_code=404, detail="Unsupported media resource.")
    return await MediaAssociationService(session).list(resource, content_id)


@admin_router.post(
    "/{resource}/{content_id}/media",
    status_code=204,
    dependencies=[require_permission(AdminPermission.DOCUMENT_MANAGE)],
)
async def attach_media(
    resource: str,
    content_id: UUID,
    payload: MediaAssociationInput,
    request: Request,
    session: DatabaseSession,
    admin: CurrentAdmin,
) -> Response:
    if resource not in ASSOCIATIONS:
        raise HTTPException(status_code=404, detail="Unsupported media resource.")
    try:
        await MediaAssociationService(session).attach(
            resource, content_id, payload.media_id, payload.sort_order
        )
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    AuditService(session).record(
        actor=admin,
        action="MEDIA_ATTACH",
        resource=resource,
        resource_id=content_id,
        new_value=payload.model_dump(mode="json"),
        request=request,
    )
    await session.commit()
    return Response(status_code=204)


@admin_router.delete(
    "/{resource}/{content_id}/media/{media_id}",
    status_code=204,
    dependencies=[require_permission(AdminPermission.DOCUMENT_MANAGE)],
)
async def detach_media(
    resource: str,
    content_id: UUID,
    media_id: UUID,
    request: Request,
    session: DatabaseSession,
    admin: CurrentAdmin,
) -> Response:
    if resource not in ASSOCIATIONS:
        raise HTTPException(status_code=404, detail="Unsupported media resource.")
    if not await MediaAssociationService(session).detach(
        resource, content_id, media_id
    ):
        raise HTTPException(status_code=404, detail="Media association not found.")
    AuditService(session).record(
        actor=admin,
        action="MEDIA_DETACH",
        resource=resource,
        resource_id=content_id,
        old_value={"media_id": str(media_id)},
        request=request,
    )
    await session.commit()
    return Response(status_code=204)


@admin_router.get(
    "/statistics", dependencies=[require_permission(AdminPermission.STATISTICS_VIEW)]
)
async def statistics(
    session: DatabaseSession, _admin: CurrentAdmin
) -> dict[str, object]:
    models = {
        "projects_count": Project,
        "experiences_count": Experience,
        "formations_count": Formation,
        "documents_count": Document,
        "publications_count": Publication,
        "users_count": UserAdmin,
    }
    values: dict[str, object] = {
        name: int(await session.scalar(select(func.count()).select_from(model)) or 0)
        for name, model in models.items()
    }
    last = await session.scalar(
        select(AuditLog).order_by(AuditLog.created_at.desc()).limit(1)
    )
    values["last_activity"] = last.created_at.isoformat() if last else None
    return values


@admin_router.get(
    "/audit", dependencies=[require_permission(AdminPermission.STATISTICS_VIEW)]
)
async def audit(
    session: DatabaseSession, _admin: CurrentAdmin
) -> list[dict[str, object]]:
    rows = list(
        (
            await session.scalars(
                select(AuditLog).order_by(AuditLog.created_at.desc()).limit(100)
            )
        ).all()
    )
    return [
        {
            "id": row.id,
            "actor_email": row.actor_email,
            "action": row.action,
            "resource": row.resource,
            "resource_id": row.resource_id,
            "created_at": row.created_at,
        }
        for row in rows
    ]


@admin_router.get(
    "/{resource}",
    response_model=list[AdminContent],
    dependencies=[require_permission(AdminPermission.CONTENT_READ)],
)
async def list_content(
    resource: str, session: DatabaseSession, _admin: CurrentAdmin
) -> list[AdminContent]:
    return await content_service(resource, session).list()


@admin_router.post(
    "/{resource}",
    response_model=AdminContent,
    status_code=201,
    dependencies=[require_permission(AdminPermission.CONTENT_CREATE)],
)
async def create_content(
    resource: str,
    payload: AdminContentInput,
    request: Request,
    session: DatabaseSession,
    admin: CurrentAdmin,
) -> AdminContent:
    try:
        item = await content_service(resource, session).create(payload, admin.id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    AuditService(session).record(
        actor=admin,
        action="CREATE",
        resource=resource,
        resource_id=item.id,
        new_value=payload.model_dump(mode="json"),
        request=request,
    )
    await session.commit()
    return item


@admin_router.get(
    "/{resource}/{item_id}",
    response_model=AdminContent,
    dependencies=[require_permission(AdminPermission.CONTENT_READ)],
)
async def get_content(
    resource: str, item_id: UUID, session: DatabaseSession, _admin: CurrentAdmin
) -> AdminContent:
    item = await content_service(resource, session).get(item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Resource not found.")
    return item


@admin_router.put(
    "/{resource}/{item_id}",
    response_model=AdminContent,
    dependencies=[require_permission(AdminPermission.CONTENT_UPDATE)],
)
async def update_content(
    resource: str,
    item_id: UUID,
    payload: AdminContentInput,
    request: Request,
    session: DatabaseSession,
    admin: CurrentAdmin,
) -> AdminContent:
    item = await content_service(resource, session).update(item_id, payload, admin.id)
    if item is None:
        raise HTTPException(status_code=404, detail="Resource not found.")
    AuditService(session).record(
        actor=admin,
        action="UPDATE",
        resource=resource,
        resource_id=item.id,
        new_value=payload.model_dump(mode="json"),
        request=request,
    )
    await session.commit()
    return item


@admin_router.delete(
    "/{resource}/{item_id}",
    status_code=204,
    dependencies=[require_permission(AdminPermission.CONTENT_DELETE)],
)
async def delete_content(
    resource: str,
    item_id: UUID,
    request: Request,
    session: DatabaseSession,
    admin: CurrentAdmin,
) -> Response:
    if not await content_service(resource, session).archive(item_id, admin.id):
        raise HTTPException(status_code=404, detail="Resource not found.")
    AuditService(session).record(
        actor=admin,
        action="DELETE",
        resource=resource,
        resource_id=item_id,
        request=request,
    )
    await session.commit()
    return Response(status_code=204)


router.include_router(auth_router)
router.include_router(admin_router)
