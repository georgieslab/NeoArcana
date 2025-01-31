from datetime import datetime, timedelta
import logging
from typing import Dict, Tuple, Optional

logger = logging.getLogger(__name__)

class NFCRateLimiter:
    def __init__(self, db):
        self.db = db
        self.daily_reading_collection = 'daily_readings'
        self.weekly_reading_collection = 'weekly_readings'
        self.nfc_tracking_collection = 'nfc_tracking'

    async def check_daily_limit(self, nfc_id: str) -> Tuple[bool, Optional[str]]:
        """Check if user can receive a daily reading"""
        try:
            # Get user's last daily reading
            user_ref = self.db.collection('nfc_users').document(nfc_id)
            user_doc = await user_ref.get()

            if not user_doc.exists:
                return False, "Invalid NFC ID"

            user_data = user_doc.to_dict()
            last_reading_date = user_data.get('last_reading_date')

            if last_reading_date:
                last_reading = datetime.fromisoformat(last_reading_date)
                today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
                
                if last_reading.date() >= today.date():
                    return False, "Daily reading already received"

            return True, None

        except Exception as e:
            logger.error(f"Error checking daily limit: {e}")
            return False, f"Error checking limit: {str(e)}"

    async def check_weekly_limit(self, nfc_id: str) -> Tuple[bool, Optional[str]]:
        """Check if user can receive a weekly 3-card reading"""
        try:
            # Get user's last weekly reading
            user_ref = self.db.collection('nfc_users').document(nfc_id)
            user_doc = await user_ref.get()

            if not user_doc.exists:
                return False, "Invalid NFC ID"

            user_data = user_doc.to_dict()
            last_weekly_reading = user_data.get('last_weekly_reading_date')

            if last_weekly_reading:
                last_reading = datetime.fromisoformat(last_weekly_reading)
                week_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
                # Adjust to start of week (Monday)
                while week_start.weekday() != 0:
                    week_start -= timedelta(days=1)
                
                if last_reading >= week_start:
                    return False, "Weekly reading already received this week"

            return True, None

        except Exception as e:
            logger.error(f"Error checking weekly limit: {e}")
            return False, f"Error checking limit: {str(e)}"

    async def record_daily_reading(self, nfc_id: str, reading_data: Dict) -> bool:
        """Record a successful daily reading"""
        try:
            # Update user's last reading date
            user_ref = self.db.collection('nfc_users').document(nfc_id)
            now = datetime.now().isoformat()
            
            await user_ref.update({
                'last_reading_date': now
            })

            # Store reading data
            reading_ref = self.db.collection(self.daily_reading_collection).document()
            reading_data.update({
                'nfc_id': nfc_id,
                'timestamp': now,
                'type': 'daily'
            })
            
            await reading_ref.set(reading_data)
            
            # Track the reading
            await self._track_reading(nfc_id, 'daily', True)
            
            return True

        except Exception as e:
            logger.error(f"Error recording daily reading: {e}")
            await self._track_reading(nfc_id, 'daily', False, str(e))
            return False

    async def record_weekly_reading(self, nfc_id: str, reading_data: Dict) -> bool:
        """Record a successful weekly 3-card reading"""
        try:
            # Update user's last weekly reading date
            user_ref = self.db.collection('nfc_users').document(nfc_id)
            now = datetime.now().isoformat()
            
            await user_ref.update({
                'last_weekly_reading_date': now
            })

            # Store reading data
            reading_ref = self.db.collection(self.weekly_reading_collection).document()
            reading_data.update({
                'nfc_id': nfc_id,
                'timestamp': now,
                'type': 'weekly'
            })
            
            await reading_ref.set(reading_data)
            
            # Track the reading
            await self._track_reading(nfc_id, 'weekly', True)
            
            return True

        except Exception as e:
            logger.error(f"Error recording weekly reading: {e}")
            await self._track_reading(nfc_id, 'weekly', False, str(e))
            return False

    async def _track_reading(self, nfc_id: str, reading_type: str, success: bool, error_msg: str = None):
        """Track reading attempt in monitoring system"""
        try:
            tracking_data = {
                'nfc_id': nfc_id,
                'timestamp': datetime.now().isoformat(),
                'type': f'{reading_type}_reading',
                'success': success
            }
            
            if error_msg:
                tracking_data['error'] = error_msg

            await self.db.collection(self.nfc_tracking_collection).add(tracking_data)

        except Exception as e:
            logger.error(f"Failed to track reading: {e}")

    async def get_last_reading(self, nfc_id: str, reading_type: str = 'daily') -> Optional[Dict]:
        """Get user's last reading of specified type"""
        try:
            collection = (self.weekly_reading_collection if reading_type == 'weekly' 
                        else self.daily_reading_collection)
            
            # Query last reading
            query = (self.db.collection(collection)
                    .where('nfc_id', '==', nfc_id)
                    .order_by('timestamp', direction='DESCENDING')
                    .limit(1))
            
            readings = await query.get()
            
            for reading in readings:  # Will only loop once due to limit(1)
                return reading.to_dict()
            
            return None

        except Exception as e:
            logger.error(f"Error retrieving last reading: {e}")
            return None