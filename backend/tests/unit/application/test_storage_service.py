"""Local storage security and lifecycle tests."""

import asyncio
from pathlib import Path

from app.application.services.storage_service import LocalStorage


def test_local_storage_generates_safe_name_and_deletes(tmp_path: Path) -> None:
    storage = LocalStorage(str(tmp_path), "/uploads")
    filename, path, url = asyncio.run(
        storage.upload_file(original_name="../../resume.pdf", content=b"pdf")
    )
    assert "/" not in filename
    assert url.endswith(filename)
    asyncio.run(storage.delete_file(path))
