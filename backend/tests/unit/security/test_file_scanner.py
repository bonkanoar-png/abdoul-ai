"""Upload signature and scanner tests."""

import asyncio
from io import BytesIO

from starlette.datastructures import Headers, UploadFile

from app.api.v1.admin.services.documents import AdminDocumentService
from app.security.file_scanner import ScanResult


class InfectedScanner:
    async def scan(self, content: bytes) -> ScanResult:
        return ScanResult.INFECTED


def upload(name: str, mime: str, content: bytes) -> UploadFile:
    return UploadFile(
        BytesIO(content), filename=name, headers=Headers({"content-type": mime})
    )


def test_valid_pdf_signature_is_accepted() -> None:
    service = AdminDocumentService(object(), object(), 1024)
    assert asyncio.run(
        service.validate_file(upload("cv.pdf", "application/pdf", b"%PDF-1.4 safe"))
    ).startswith(b"%PDF")


def test_corrupted_signature_and_infected_file_are_rejected() -> None:
    service = AdminDocumentService(object(), object(), 1024)
    try:
        asyncio.run(
            service.validate_file(upload("fake.pdf", "application/pdf", b"not-pdf"))
        )
    except ValueError as exc:
        assert "signature" in str(exc)
    else:
        raise AssertionError("corrupted file accepted")
    infected = AdminDocumentService(object(), object(), 1024, scanner=InfectedScanner())
    try:
        asyncio.run(
            infected.validate_file(
                upload("cv.pdf", "application/pdf", b"%PDF-1.4 infected")
            )
        )
    except ValueError as exc:
        assert "scanner" in str(exc)
    else:
        raise AssertionError("infected file accepted")
