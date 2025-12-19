"""
Reading API endpoints
"""
from fastapi import APIRouter, HTTPException, Depends
import logging

from api_v2.models.reading import (
    DailyAffirmationRequest,
    DailyAffirmationResponse,
    ReadingData
)
from api_v2.models.three_card import (
    ThreeCardRequest,
    ThreeCardResponse,
    ThreeCardReading,
    WeeklyReadingRequest,
    WeeklyReadingResponse
)
from api_v2.services.reading_service import ReadingService
from api_v2.dependencies.services import get_reading_service

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/daily_affirmation", response_model=DailyAffirmationResponse)
async def daily_affirmation(
    request: DailyAffirmationRequest,
    reading_service: ReadingService = Depends(get_reading_service)
):
    """
    Generate personalized daily tarot reading
    
    Creates a deeply personalized reading incorporating:
    - User's zodiac sign and birth data
    - Current moon phase and season
    - Day's planetary energy
    - Numerological significance
    - Personal color and interests
    
    Returns a complete reading with card interpretation,
    numerology insight, and daily affirmation.
    """
    try:
        logger.info(f"Daily affirmation request for: {request.userData.name}")
        
        # Convert Pydantic model to dict for service
        user_data = request.userData.dict()
        
        # Generate reading (ASYNC!)
        reading_data = await reading_service.generate_daily_reading(user_data)
        
        # Save reading to Firebase (async, doesn't block response)
        try:
            await reading_service.save_reading(
                user_data['nfc_id'],
                reading_data
            )
        except Exception as e:
            # Log but don't fail if save fails
            logger.warning(f"Failed to save reading: {e}")
        
        return DailyAffirmationResponse(
            success=True,
            data=ReadingData(**reading_data)
        )
        
    except Exception as e:
        logger.error(f"Error in daily_affirmation: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to generate reading"
        )
    
@router.post("/three_card_reading", response_model=ThreeCardResponse)
async def three_card_reading(
    request: ThreeCardRequest,
    reading_service: ReadingService = Depends(get_reading_service)
):
    """
    Generate three-card Past/Present/Future reading
    
    Creates a comprehensive reading with three cards representing:
    - **Past**: Influences and foundations that shaped your journey
    - **Present**: Current energies and situations at play
    - **Future**: Potential outcomes and guidance ahead
    
    Includes:
    - AI-powered interpretations via Claude
    - Cosmic context (moon phase, season, planetary energy)
    - Personalized based on zodiac, interests, and preferences
    - Cached for 24 hours (one reading per day)
    """
    try:
        logger.info(f"Three-card reading request for: {request.nfc_id}")
        
        # Generate reading (ASYNC!)
        reading_data = await reading_service.generate_three_card_reading(request.nfc_id)
        
        return ThreeCardResponse(
            success=True,
            data=ThreeCardReading(**reading_data)
        )
        
    except ValueError as e:
        logger.error(f"Validation error: {e}")
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error in three_card_reading: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to generate three-card reading"
        )
    
@router.post("/weekly_reading", response_model=WeeklyReadingResponse)
async def weekly_reading(
    request: WeeklyReadingRequest,
    reading_service: ReadingService = Depends(get_reading_service)
):
    """
    Generate weekly three-card reading (Premium Feature)
    
    **RATE LIMITED**: One reading per week per user
    
    Creates a comprehensive weekly forecast with three cards:
    - **Week's Challenge**: Main obstacle or lesson
    - **Week's Opportunity**: Gift or chance available
    - **Week's Outcome**: Likely result with wise navigation
    
    Features:
    - AI-powered interpretations via Claude
    - Cosmic context for the week ahead
    - Personalized based on zodiac and interests
    - **Rate limiting**: Returns cached reading if taken this week
    - **Premium tier management**: Perfect for monetization
    
    If the user has already received their weekly reading,
    returns the cached version with a message.
    """
    try:
        logger.info(f"Weekly reading request for: {request.nfc_id}")
        
        # Generate reading (ASYNC with rate limiting!)
        reading_data = await reading_service.generate_weekly_reading(request.nfc_id)
        
        return WeeklyReadingResponse(
            success=True,
            data=ThreeCardReading(**reading_data),
            cached=reading_data.get('cached', False)
        )
        
    except ValueError as e:
        # Rate limit or validation errors
        logger.warning(f"Weekly reading limit: {e}")
        raise HTTPException(
            status_code=429,  # 429 = Too Many Requests
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error in weekly_reading: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to generate weekly reading"
        )