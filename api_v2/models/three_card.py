"""
Pydantic models for three-card tarot readings
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict


class ThreeCardRequest(BaseModel):
    """Request for three-card reading"""
    nfc_id: str = Field(..., description="User's NFC ID")


class CardPosition(BaseModel):
    """Single card in a position"""
    position: str  # "Past", "Present", or "Future"
    cardName: str
    cardImage: str
    keywords: List[str]


class ThreeCardReading(BaseModel):
    """Complete three-card reading data"""
    cards: List[str] = Field(..., description="List of card image URLs")
    cardNames: List[str] = Field(..., description="List of card names")
    positions: List[str] = ["Past", "Present", "Future"]
    interpretation: str = Field(..., description="Complete reading interpretation")
    moonPhase: Optional[str] = None
    season: Optional[str] = None
    dayEnergy: Optional[str] = None
    numerologyDay: Optional[int] = None
    cached: bool = False


class ThreeCardResponse(BaseModel):
    """Response with three-card reading"""
    success: bool
    data: Optional[ThreeCardReading] = None
    error: Optional[str] = None

class WeeklyReadingRequest(BaseModel):
    """Request for weekly reading"""
    nfc_id: str = Field(..., description="User's NFC ID")


class WeeklyReadingResponse(BaseModel):
    """Response with weekly reading"""
    success: bool
    data: Optional[ThreeCardReading] = None
    error: Optional[str] = None
    cached: bool = False