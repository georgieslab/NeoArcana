"""
Pydantic models for user registration
"""
from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict
from datetime import datetime


class ColorPreference(BaseModel):
    """User's color preference"""
    name: str = Field(..., description="Color name (e.g., 'Cosmic Purple')")
    value: str = Field(..., description="Hex color value (e.g., '#A59AD1')")


class NumberPreferences(BaseModel):
    """User's number preferences"""
    favoriteNumber: Optional[str] = None
    luckyNumber: Optional[str] = None
    guidanceNumber: Optional[str] = None


class UserPreferences(BaseModel):
    """User preferences for personalization"""
    color: Optional[ColorPreference] = None
    interests: List[str] = Field(default_factory=list)
    language: str = Field(default="en", description="ISO language code")
    numbers: Optional[NumberPreferences] = None
    gender: Optional[str] = None


class RegisterRequest(BaseModel):
    """Request to register new user with NFC poster"""
    posterCode: str = Field(..., description="NFC poster code", min_length=1)
    name: str = Field(..., description="User's name", min_length=1, max_length=100)
    dateOfBirth: str = Field(..., description="Date of birth (YYYY-MM-DD)")
    zodiacSign: str = Field(..., description="User's zodiac sign")
    preferences: UserPreferences = Field(default_factory=UserPreferences)
    
    @validator('dateOfBirth')
    def validate_date(cls, v):
        """Validate date format"""
        try:
            datetime.strptime(v, '%Y-%m-%d')
            return v
        except ValueError:
            raise ValueError('Date must be in YYYY-MM-DD format')
    
    @validator('zodiacSign')
    def validate_zodiac(cls, v):
        """Validate zodiac sign"""
        valid_signs = [
            'aries', 'taurus', 'gemini', 'cancer', 
            'leo', 'virgo', 'libra', 'scorpio',
            'sagittarius', 'capricorn', 'aquarius', 'pisces'
        ]
        if v.lower() not in valid_signs:
            raise ValueError(f'Invalid zodiac sign. Must be one of: {", ".join(valid_signs)}')
        return v.lower().capitalize()


class RegisterResponse(BaseModel):
    """Response from registration"""
    success: bool
    nfcId: Optional[str] = None
    message: str
    userData: Optional[Dict] = None


class UpdateUserRequest(BaseModel):
    """Request to update user preferences"""
    name: Optional[str] = None
    dateOfBirth: Optional[str] = None
    language: Optional[str] = None
    gender: Optional[str] = None
    interests: Optional[List[str]] = None
    color: Optional[ColorPreference] = None


class UpdateUserResponse(BaseModel):
    """Response from user update"""
    success: bool
    nfcId: str
    message: str