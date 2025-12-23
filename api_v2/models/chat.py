"""
Chat models for API requests and responses
"""
from pydantic import BaseModel, Field
from typing import Optional, List


class StartChatRequest(BaseModel):
    """Request model for starting a new chat session"""
    name: str
    zodiacSign: str
    cardName: str
    reading: str
    isPremium: bool
    language: str
    nfc_id: Optional[str] = None  # ✅ Optional for trial users
    maintainLanguage: bool = True


class StartChatResponse(BaseModel):
    """Response model for chat session start"""
    success: bool
    response: str
    session_id: str


class ChatMessage(BaseModel):
    """Individual chat message"""
    role: str
    content: str


class ChatRequest(BaseModel):
    """Request model for sending a chat message"""
    message: str
    name: str
    zodiacSign: str
    language: str
    reading: str
    cardName: str
    session_id: str
    nfc_id: Optional[str] = None  # ✅ Optional for trial users
    messageHistory: List[ChatMessage] = Field(default_factory=list)


class ChatResponse(BaseModel):
    """Response model for chat message"""
    success: bool
    response: str
    session_id: Optional[str] = None