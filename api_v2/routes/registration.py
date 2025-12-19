"""
Registration API endpoints
"""
from fastapi import APIRouter, HTTPException, Depends
import logging

from api_v2.models.registration import (
    RegisterRequest,
    RegisterResponse,
    UpdateUserRequest,
    UpdateUserResponse
)
from api_v2.services.registration_service import RegistrationService
from api_v2.dependencies.services import get_registration_service

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/register", response_model=RegisterResponse)
async def register_user(
    request: RegisterRequest,
    reg_service: RegistrationService = Depends(get_registration_service)
):
    """
    Register new user with NFC poster
    
    - **posterCode**: NFC poster code (required)
    - **name**: User's full name (required)
    - **dateOfBirth**: Birth date in YYYY-MM-DD format (required)
    - **zodiacSign**: Zodiac sign (required)
    - **preferences**: Optional personalization preferences
        - **color**: Favorite color (name + hex value)
        - **interests**: List of interests
        - **language**: Preferred language (ISO code, default: en)
        - **numbers**: Lucky numbers
        - **gender**: Gender preference
    """
    try:
        logger.info(f"Registration request for poster: {request.posterCode}")
        
        result = await reg_service.register_user(request)
        
        return RegisterResponse(
            success=result['success'],
            nfcId=result['nfcId'],
            message=result['message'],
            userData=result.get('userData')
        )
        
    except ValueError as e:
        # Validation errors (poster invalid, already registered, etc.)
        logger.warning(f"Registration validation error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # Unexpected errors
        logger.error(f"Registration error: {e}")
        raise HTTPException(status_code=500, detail="Registration failed")


@router.get("/user/{nfc_id}")
async def get_user(
    nfc_id: str,
    reg_service: RegistrationService = Depends(get_registration_service)
):
    """
    Get user data by NFC ID
    
    - **nfc_id**: The user's NFC identifier
    """
    try:
        user_data = await reg_service.get_user(nfc_id)
        return {
            "success": True,
            "data": user_data
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error getting user: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving user")


@router.put("/user/{nfc_id}", response_model=UpdateUserResponse)
async def update_user(
    nfc_id: str,
    request: UpdateUserRequest,
    reg_service: RegistrationService = Depends(get_registration_service)
):
    """
    Update user preferences
    
    - **nfc_id**: The user's NFC identifier
    - All fields are optional - only provided fields will be updated
    """
    try:
        # Convert request to dict, excluding None values
        updates = request.dict(exclude_none=True)
        
        await reg_service.update_user_preferences(nfc_id, updates)
        
        return UpdateUserResponse(
            success=True,
            nfcId=nfc_id,
            message="User data updated successfully"
        )
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating user: {e}")
        raise HTTPException(status_code=500, detail="Update failed")