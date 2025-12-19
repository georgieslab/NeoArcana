"""
Pydantic models for tarot readings
"""
from pydantic import BaseModel, Field
from typing import Optional, Dict


class UserDataForReading(BaseModel):
    """User data needed for generating reading"""
    nfc_id: str
    name: str
    zodiacSign: str
    language: Optional[str] = "en"
    preferences: Optional[Dict] = Field(default_factory=dict)


class DailyAffirmationRequest(BaseModel):
    """Request for daily affirmation reading"""
    userData: UserDataForReading


class ReadingData(BaseModel):
    """Tarot reading data"""
    cardName: str
    cardImage: str
    interpretation: str
    moonPhase: Optional[str] = None
    season: Optional[str] = None
    dayEnergy: Optional[str] = None
    numerologyDay: Optional[int] = None
    cached: bool = False


class DailyAffirmationResponse(BaseModel):
    """Response with daily affirmation reading"""
    success: bool
    data: Optional[ReadingData] = None
    error: Optional[str] = None