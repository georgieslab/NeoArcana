"""
Three-card and weekly reading models
"""
from pydantic import BaseModel, Field
from typing import Optional, List


class ThreeCardRequest(BaseModel):
    """Request model for three-card reading"""
    nfc_id: Optional[str] = None  # ✅ Optional for trial users
    userData: Optional[dict] = None  # ✅ NEW! For AI personalization (name, zodiacSign, language)
    
    class Config:
        json_schema_extra = {
            "example": {
                "nfc_id": "nfc_TEST001",
                "userData": {
                    "name": "Georgie",
                    "zodiacSign": "Libra",
                    "language": "en"
                }
            }
        }


class ThreeCardReading(BaseModel):
    """Three-card reading data structure"""
    cards: List[str]
    cardNames: List[str]
    positions: List[str]
    interpretation: str
    moonPhase: Optional[str] = None
    season: Optional[str] = None
    dayEnergy: Optional[str] = None
    numerologyDay: Optional[int] = None
    cached: bool = False


class ThreeCardResponse(BaseModel):
    """Response model for three-card reading"""
    success: bool
    data: ThreeCardReading


class WeeklyReadingRequest(BaseModel):
    """Request model for weekly reading"""
    nfc_id: str  # Required - premium feature only
    
    class Config:
        json_schema_extra = {
            "example": {
                "nfc_id": "nfc_TEST001"
            }
        }


class WeeklyReadingResponse(BaseModel):
    """Response model for weekly reading"""
    success: bool
    data: ThreeCardReading
    cached: bool = False