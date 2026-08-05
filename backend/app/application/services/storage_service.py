"""Storage abstraction for CMS-managed binary files."""

import asyncio
from pathlib import Path
from typing import Protocol
from uuid import uuid4


class StorageService(Protocol):
    async def upload_file(
        self, *, original_name: str, content: bytes
    ) -> tuple[str, str, str]: ...
    async def delete_file(self, storage_path: str) -> None: ...
    def get_file_url(self, storage_path: str) -> str: ...


class LocalStorage:
    """Local volume storage with generated names and traversal-safe paths."""

    def __init__(self, root: str, public_base_url: str) -> None:
        self.root = Path(root).resolve()
        self.public_base_url = public_base_url.rstrip("/")

    async def upload_file(
        self, *, original_name: str, content: bytes
    ) -> tuple[str, str, str]:
        suffix = Path(original_name).suffix.lower()
        filename = f"{uuid4().hex}{suffix}"
        destination = (self.root / filename).resolve()
        if self.root not in destination.parents:
            raise ValueError("Invalid storage path.")
        await asyncio.to_thread(self.root.mkdir, parents=True, exist_ok=True)
        await asyncio.to_thread(destination.write_bytes, content)
        return filename, str(destination), self.get_file_url(filename)

    async def delete_file(self, storage_path: str) -> None:
        path = Path(storage_path).resolve()
        if self.root not in path.parents:
            raise ValueError("Invalid storage path.")
        await asyncio.to_thread(path.unlink, missing_ok=True)

    def get_file_url(self, storage_path: str) -> str:
        return f"{self.public_base_url}/{Path(storage_path).name}"


class S3CompatibleStorage:
    """Explicit production extension point; credentials are supplied by its adapter."""

    async def upload_file(
        self, *, original_name: str, content: bytes
    ) -> tuple[str, str, str]:
        raise NotImplementedError("Configure an S3-compatible adapter before use.")

    async def delete_file(self, storage_path: str) -> None:
        raise NotImplementedError("Configure an S3-compatible adapter before use.")

    def get_file_url(self, storage_path: str) -> str:
        raise NotImplementedError("Configure an S3-compatible adapter before use.")
