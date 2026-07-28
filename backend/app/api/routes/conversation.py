"""Read-only HTTP endpoints for persisted conversations."""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies.conversation import get_conversation_service, get_message_service
from app.api.schemas.conversation import ConversationResponse
from app.api.schemas.message import MessageResponse
from app.application.services.conversation_service import ConversationService
from app.application.services.message_service import MessageService

router = APIRouter(prefix="/conversations", tags=["conversations"])


@router.get("", response_model=list[ConversationResponse])
async def get_conversations(
    service: Annotated[ConversationService, Depends(get_conversation_service)],
) -> list[ConversationResponse]:
    conversations = await service.get_conversations()
    return [ConversationResponse.model_validate(item) for item in conversations]


@router.get("/{conversation_id}/messages", response_model=list[MessageResponse])
async def get_messages(
    conversation_id: UUID,
    service: Annotated[MessageService, Depends(get_message_service)],
) -> list[MessageResponse]:
    messages = await service.get_messages(conversation_id)
    if messages is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found.",
        )
    return [MessageResponse.model_validate(item) for item in messages]
