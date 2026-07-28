"""Tests for the document domain entity."""

from datetime import UTC, datetime
from uuid import uuid4

import pytest

from app.domain.entities.document import Document, DocumentType
from app.domain.exceptions.portfolio import InvalidDocument

NOW = datetime(2026, 7, 28, tzinfo=UTC)


def build_document(
    *,
    title: str = "CV Data Scientist",
    file_name: str = "cv.pdf",
    mime_type: str = "application/pdf",
    file_size: int = 1024,
    sort_order: int = 0,
) -> Document:
    return Document(
        uuid4(),
        uuid4(),
        title,
        "Public CV.",
        DocumentType.CV,
        file_name,
        "https://example.com/cv.pdf",
        mime_type,
        file_size,
        True,
        sort_order,
        NOW,
        NOW,
    )


def test_document_accepts_valid_metadata() -> None:
    assert build_document().document_type is DocumentType.CV


def test_document_requires_title() -> None:
    with pytest.raises(InvalidDocument):
        build_document(title=" ")


def test_document_requires_file_name() -> None:
    with pytest.raises(InvalidDocument):
        build_document(file_name="")


def test_document_requires_mime_type() -> None:
    with pytest.raises(InvalidDocument):
        build_document(mime_type=" ")


@pytest.mark.parametrize("file_size", [0, -1])
def test_document_requires_positive_file_size(file_size: int) -> None:
    with pytest.raises(InvalidDocument):
        build_document(file_size=file_size)


def test_document_requires_non_negative_sort_order() -> None:
    with pytest.raises(InvalidDocument):
        build_document(sort_order=-1)
