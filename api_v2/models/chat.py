"""
Pydantic models for chat functionality
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime


class ChatMessage(BaseModel):
    """Single chat message"""
    role: str = Field(..., description="'user' or 'assistant'")
    content: str = Field(..., description="Message content")
    timestamp: Optional[datetime] = None


class StartChatRequest(BaseModel):
    """Request to start a new chat session"""
    name: str
    zodiacSign: str
    language: str = "en"
    cardName: Optional[str] = None
    reading: Optional[str] = None
    isPremium: bool = False
    nfc_id: str = Field(..., description="User's NFC ID for session tracking")


class StartChatResponse(BaseModel):
    """Response when starting chat"""
    success: bool
    response: str
    session_id: str


class ChatRequest(BaseModel):
    """Request to send a chat message"""
    message: str = Field(..., description="User's message")
    name: str
    zodiacSign: str
    language: str = "en"
    reading: Optional[str] = None
    cardName: Optional[str] = None
    session_id: str = Field(..., description="Chat session ID")
    messageHistory: Optional[List[ChatMessage]] = Field(default_factory=list)


class ChatResponse(BaseModel):
    """Response from chat"""
    success: bool
    response: str
    error: Optional[str] = None