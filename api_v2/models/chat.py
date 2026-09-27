"""
Chat models for API requests and responses
"""
from pydantic import BaseModel, Field
from typing import Optional, List


class StartChatRequest(BaseModel):
    """Request model for starting a new chat session"""
    name: str = "Seeker"
    zodiacSign: str = "Cosmic Seeker"
    cardName: Optional[str] = "Three Cards Spread"
    reading: Optional[str] = ""
    isPremium: bool = False
    language: str = "en"
    nfc_id: Optional[str] = None  # Optional for trial users
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
    name: Optional[str] = "Seeker"
    zodiacSign: Optional[str] = "Cosmic Seeker"
    language: Optional[str] = "en"
    reading: Optional[str] = ""
    cardName: Optional[str] = "Three Cards Spread"
    session_id: Optional[str] = None
    nfc_id: Optional[str] = None  # Optional for trial users
    messageHistory: List[ChatMessage] = Field(default_factory=list)


class ChatResponse(BaseModel):
    """Response model for chat message"""
    success: bool
    response: str
    session_id: Optional[str] = None