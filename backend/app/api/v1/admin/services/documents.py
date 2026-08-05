"""Validated document and media upload orchestration."""

from pathlib import Path
from uuid import UUID

from fastapi import UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.services.storage_service import StorageService
from app.infrastructure.database.models import Document, Media, Profile
from app.security.file_scanner import FileSecurityScanner, NoOpScanner, ScanResult

ALLOWED_DOCUMENT_TYPES = {"application/pdf", "image/png", "image/jpeg", "image/webp"}
ALLOWED_IMAGE_TYPES = {"image/png", "image/jpeg", "image/webp"}


class AdminDocumentService:
    def __init__(
        self,
        session: AsyncSession,
        storage: StorageService,
        max_bytes: int,
        scanner: FileSecurityScanner | None = None,
        allowed_types: set[str] | None = None,
    ) -> None:
        self.session, self.storage, self.max_bytes = session, storage, max_bytes
        self.scanner = scanner or NoOpScanner()
        self.allowed_types = allowed_types or ALLOWED_DOCUMENT_TYPES

    async def validate_file(
        self, file: UploadFile, *, images_only: bool = False
    ) -> bytes:
        allowed = (
            ALLOWED_IMAGE_TYPES & self.allowed_types
            if images_only
            else self.allowed_types
        )
        if file.content_type not in allowed:
            raise ValueError("Unsupported file type.")
        content = await file.read(self.max_bytes + 1)
        if not content or len(content) > self.max_bytes:
            raise ValueError("File is empty or exceeds the configured size limit.")
        signatures = {
            "application/pdf": (b"%PDF-",),
            "image/png": (b"\x89PNG\r\n\x1a\n",),
            "image/jpeg": (b"\xff\xd8\xff",),
            "image/webp": (b"RIFF",),
        }
        if not any(
            content.startswith(prefix) for prefix in signatures[file.content_type or ""]
        ):
            raise ValueError("File signature does not match its MIME type.")
        if file.content_type == "image/webp" and content[8:12] != b"WEBP":
            raise ValueError("File signature does not match its MIME type.")
        if await self.scanner.scan(content) is ScanResult.INFECTED:
            raise ValueError("File rejected by security scanner.")
        return content

    async def upload_document(self, file: UploadFile, actor_id: UUID) -> Document:
        content = await self.validate_file(file)
        original = Path(file.filename or "document").name
        filename, path, url = await self.storage.upload_file(
            original_name=original, content=content
        )
        profile_id = await self.session.scalar(
            select(Profile.id).order_by(Profile.created_at).limit(1)
        )
        if profile_id is None:
            await self.storage.delete_file(path)
            raise ValueError("A profile is required before uploading documents.")
        document = Document(
            profile_id=profile_id,
            title=original,
            description="",
            document_type="CV" if file.content_type == "application/pdf" else "OTHER",
            file_name=filename,
            original_name=original,
            file_url=url,
            storage_path=path,
            mime_type=file.content_type or "application/octet-stream",
            file_size=len(content),
            uploaded_by=actor_id,
            created_by=actor_id,
            updated_by=actor_id,
        )
        self.session.add(document)
        return document

    async def upload_media(
        self, file: UploadFile, actor_id: UUID, alt_text: str
    ) -> Media:
        content = await self.validate_file(file, images_only=True)
        original = Path(file.filename or "image").name
        filename, path, url = await self.storage.upload_file(
            original_name=original, content=content
        )
        media = Media(
            filename=filename,
            url=url,
            storage_path=path,
            mime_type=file.content_type or "image/jpeg",
            size=len(content),
            alt_text=alt_text[:500],
            uploaded_by=actor_id,
        )
        self.session.add(media)
        return media

    async def delete(self, document: Document, actor_id: UUID) -> None:
        if document.storage_path:
            await self.storage.delete_file(document.storage_path)
        document.is_active = False
        document.updated_by = actor_id

    def get_url(self, document: Document) -> str:
        if document.storage_path:
            return self.storage.get_file_url(document.storage_path)
        return document.file_url
