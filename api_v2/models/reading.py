"""
Daily reading models
"""
from pydantic import BaseModel, Field
from typing import Optional


class UserPreferences(BaseModel):
    """User preferences structure"""
    color: Optional[dict] = None
    interests: Optional[list] = None
    language: Optional[str] = "en"
    gender: Optional[str] = None
    numbers: Optional[dict] = None


class UserData(BaseModel):
    """User data for reading generation"""
    nfc_id: Optional[str] = None
    name: str
    dateOfBirth: Optional[str] = None
    zodiacSign: str
    language: str = "en"
    preferences: UserPreferences = Field(default_factory=UserPreferences)


class DailyAffirmationRequest(BaseModel):
    """Request model for daily affirmation"""
    userData: UserData
    
    class Config:
        json_schema_extra = {
            "example": {
                "userData": {
                    "nfc_id": "nfc_TEST001",
                    "name": "Georgie",
                    "dateOfBirth": "1994-09-01",
                    "zodiacSign": "Libra",
                    "language": "en",
                    "preferences": {
                        "color": {"name": "Cosmic Purple", "value": "#A59AD1"},
                        "interests": ["tarot", "astrology"],
                        "language": "en"
                    }
                }
            }
        }


class ReadingData(BaseModel):
    """Reading data structure"""
    cardName: str
    cardImage: str
    interpretation: str
    moonPhase: Optional[str] = None
    season: Optional[str] = None
    dayEnergy: Optional[str] = None
    numerologyDay: Optional[int] = None
    cached: bool = False


class DailyAffirmationResponse(BaseModel):
    """Response model for daily affirmation"""
    success: bool
    data: ReadingData