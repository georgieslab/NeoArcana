"""
Rate limiter service - Manage reading frequency limits
"""
import logging
from datetime import datetime, timedelta
from typing import Tuple, Optional, Dict

logger = logging.getLogger(__name__)


class RateLimiterService:
    """Service for rate limiting readings"""
    
    def __init__(self, database):
        self.db = database
    
    async def check_weekly_limit(self, nfc_id: str) -> Tuple[bool, Optional[str]]:
        """
        Check if user can get a weekly reading
        Returns: (can_read, error_message)
        """
        try:
            # Get user document
            user_ref = self.db.collection('nfc_users').document(nfc_id)
            user_doc = user_ref.get()
            
            if not user_doc.exists:
                return False, "User not found"
            
            user_data = user_doc.to_dict()
            
            # Check if user has premium access
            # For now, assume all users can get weekly readings
            # In production, you'd check subscription status here
            is_premium = user_data.get('is_premium', False)
            
            # Get last weekly reading date
            last_weekly = user_data.get('last_weekly_reading')
            
            if last_weekly:
                # Convert to datetime if it's a Firestore timestamp
                if hasattr(last_weekly, 'timestamp'):
                    last_weekly = datetime.fromtimestamp(last_weekly.timestamp())
                elif isinstance(last_weekly, str):
                    last_weekly = datetime.fromisoformat(last_weekly)
                
                # Check if 7 days have passed
                days_since = (datetime.now() - last_weekly).days
                
                if days_since < 7:
                    days_remaining = 7 - days_since
                    return False, f"Weekly reading available in {days_remaining} day(s)"
            
            # User can get reading
            return True, None
            
        except Exception as e:
            logger.error(f"Error checking weekly limit: {e}")
            return False, "Error checking reading availability"
    
    async def get_last_weekly_reading(self, nfc_id: str) -> Optional[Dict]:
        """Get the last weekly reading for a user"""
        try:
            user_ref = self.db.collection('nfc_users').document(nfc_id)
            
            # Get weekly readings subcollection
            weekly_readings = (
                user_ref.collection('weekly_readings')
                .order_by('timestamp', direction='DESCENDING')
                .limit(1)
                .stream()
            )
            
            for reading in weekly_readings:
                return reading.to_dict()
            
            return None
            
        except Exception as e:
            logger.error(f"Error getting last weekly reading: {e}")
            return None
    
    async def mark_weekly_reading_taken(self, nfc_id: str):
        """Mark that user has taken their weekly reading"""
        try:
            user_ref = self.db.collection('nfc_users').document(nfc_id)
            user_ref.update({
                'last_weekly_reading': datetime.now()
            })
            
            logger.info(f"Marked weekly reading taken for {nfc_id}")
            
        except Exception as e:
            logger.error(f"Error marking weekly reading: {e}")
    
    async def check_daily_limit(self, nfc_id: str) -> Tuple[bool, Optional[str]]:
        """
        Check if user can get a daily reading
        Returns: (can_read, error_message)
        """
        try:
            # For daily readings, we allow one per day
            user_ref = self.db.collection('nfc_users').document(nfc_id)
            user_doc = user_ref.get()
            
            if not user_doc.exists:
                return False, "User not found"
            
            user_data = user_doc.to_dict()
            last_daily = user_data.get('last_daily_reading')
            
            if last_daily:
                # Convert to datetime
                if hasattr(last_daily, 'timestamp'):
                    last_daily = datetime.fromtimestamp(last_daily.timestamp())
                elif isinstance(last_daily, str):
                    last_daily = datetime.fromisoformat(last_daily)
                
                # Check if it's the same day
                if last_daily.date() == datetime.now().date():
                    return False, "Daily reading already taken today. Come back tomorrow!"
            
            return True, None
            
        except Exception as e:
            logger.error(f"Error checking daily limit: {e}")
            return False, "Error checking reading availability"