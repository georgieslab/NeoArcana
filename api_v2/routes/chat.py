"""
Chat API endpoints
"""
from fastapi import APIRouter, HTTPException, Depends
import logging

from api_v2.models.chat import (
    StartChatRequest,
    StartChatResponse,
    ChatRequest,
    ChatResponse
)
from api_v2.services.chat_service import ChatService
from api_v2.dependencies.services import get_chat_service

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/start_chat", response_model=StartChatResponse)
async def start_chat(
    request: StartChatRequest,
    chat_service: ChatService = Depends(get_chat_service)
):
    """
    Start a new chat session about a tarot reading
    
    Creates a new conversation session with:
    - Personalized welcome message
    - Multi-language support (auto-translation)
    - Session tracking in Firebase
    - Context about the user's reading
    
    Returns a session_id to use for subsequent messages.
    """
    try:
        logger.info(f"Starting chat session for {request.name}")
        
        result = await chat_service.start_chat_session(
            name=request.name,
            zodiac_sign=request.zodiacSign,
            language=request.language,
            nfc_id=request.nfc_id,
            card_name=request.cardName,
            reading=request.reading,
            is_premium=request.isPremium
        )
        
        return StartChatResponse(**result)
        
    except Exception as e:
        logger.error(f"Error starting chat: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to start chat session"
        )


@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    chat_service: ChatService = Depends(get_chat_service)
):
    """
    Send a message in an ongoing chat conversation
    
    Features:
    - AI-powered responses via Claude
    - Full conversation history maintained
    - Personalized based on user profile and reading
    - Multi-language support
    - Context-aware (remembers previous messages)
    - Async (non-blocking, fast responses)
    
    The conversation continues from where it left off,
    maintaining context about the user's tarot reading.
    """
    try:
        logger.info(f"Chat message from {request.name} in session {request.session_id}")
        
        # Convert Pydantic models to dicts for service
        message_history = [msg.dict() for msg in request.messageHistory] if request.messageHistory else []
        
        result = await chat_service.send_message(
            session_id=request.session_id,
            message=request.message,
            name=request.name,
            zodiac_sign=request.zodiacSign,
            language=request.language,
            reading=request.reading,
            card_name=request.cardName,
            message_history=message_history
        )
        
        return ChatResponse(**result)
        
    except Exception as e:
        logger.error(f"Error in chat: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to process chat message"
        )


@router.get("/chat/history/{session_id}")
async def get_chat_history(
    session_id: str,
    chat_service: ChatService = Depends(get_chat_service)
):
    """
    Get full chat history for a session
    
    Retrieves all messages from a chat session stored in Firebase.
    Useful for:
    - Resuming conversations
    - Reviewing past discussions
    - Analytics
    """
    try:
        logger.info(f"Getting history for session {session_id}")
        
        history = await chat_service.get_session_history(session_id)
        
        return {
            "success": True,
            "session_id": session_id,
            "messages": history
        }
        
    except Exception as e:
        logger.error(f"Error getting chat history: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve chat history"
        )