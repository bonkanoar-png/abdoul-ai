"""Pluggable security scanning contract for uploaded files."""

from enum import StrEnum
from typing import Protocol


class ScanResult(StrEnum):
    SAFE = "SAFE"
    INFECTED = "INFECTED"


class FileSecurityScanner(Protocol):
    async def scan(self, content: bytes) -> ScanResult: ...


class NoOpScanner:
    """Development adapter; replace with ClamAV or a cloud scanner in production."""

    async def scan(self, content: bytes) -> ScanResult:
        return ScanResult.SAFE
