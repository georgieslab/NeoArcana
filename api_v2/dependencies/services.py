"""
Service dependencies for dependency injection
"""
from functools import lru_cache

from api_v2.core.database import db
from api_v2.services.nfc_service import NFCService
from api_v2.services.registration_service import RegistrationService


@lru_cache()
def get_nfc_service() -> NFCService:
    """
    Get NFCService instance (cached)
    """
    return NFCService(db)


@lru_cache()
def get_registration_service() -> RegistrationService:
    """
    Get RegistrationService instance (cached)
    """
    return RegistrationService(db)


from api_v2.services.reading_service import ReadingService

@lru_cache()
def get_reading_service() -> ReadingService:
    """Get ReadingService instance (cached)"""
    return ReadingService(db)

from api_v2.services.chat_service import ChatService

@lru_cache()
def get_chat_service() -> ChatService:
    """Get ChatService instance (cached)"""
    return ChatService(db)

from api_v2.services.rate_limiter_service import RateLimiterService

@lru_cache()
def get_rate_limiter_service() -> RateLimiterService:
    """Get RateLimiterService instance (cached)"""
    return RateLimiterService(db)