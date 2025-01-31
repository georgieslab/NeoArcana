from datetime import datetime, timedelta
import logging
from typing import Dict, Optional

logger = logging.getLogger(__name__)

class NFCReadingCache:
    def __init__(self, db):
        self.db = db
        self.cache_duration = timedelta(hours=24)
        
    def get_cache_key(self, nfc_id: str, language: str) -> str:
        """Generate a unique cache key including language"""
        today = datetime.now().strftime('%Y-%m-%d')
        return f"{nfc_id}_{language}_{today}"
        
    def get_cached_reading(self, nfc_id: str, language: str) -> Optional[Dict]:
        """Get cached reading if available and valid"""
        try:
            cache_key = self.get_cache_key(nfc_id, language)
            
            # Get user's latest reading
            user_ref = self.db.collection('nfc_users').document(nfc_id)
            readings_ref = user_ref.collection('readings')
            
            # Query for language-specific reading
            reading_doc = readings_ref.document(cache_key).get()
            
            if reading_doc.exists:
                reading_data = reading_doc.to_dict()
                reading_time = reading_data.get('timestamp')
                
                if reading_time:
                    # Check if reading is still valid
                    reading_dt = datetime.fromisoformat(reading_time)
                    if datetime.now() - reading_dt < self.cache_duration:
                        return reading_data
                        
            return None
            
        except Exception as e:
            logger.error(f"Cache retrieval error: {e}")
            return None
            
    def cache_reading(self, nfc_id: str, language: str, reading_data: Dict) -> bool:
        """Cache a new reading with language"""
        try:
            cache_key = self.get_cache_key(nfc_id, language)
            
            # Add timestamp and language to reading data
            reading_data.update({
                'timestamp': datetime.now().isoformat(),
                'language': language
            })
            
            # Save reading with language-specific key
            user_ref = self.db.collection('nfc_users').document(nfc_id)
            reading_ref = user_ref.collection('readings').document(cache_key)
            reading_ref.set(reading_data)
            
            return True
            
        except Exception as e:
            logger.error(f"Cache storage error: {e}")
            return False
            
    def invalidate_cache(self, nfc_id: str, language: str = None) -> bool:
        """Invalidate cached reading(s)"""
        try:
            user_ref = self.db.collection('nfc_users').document(nfc_id)
            if language:
                # Invalidate specific language cache
                cache_key = self.get_cache_key(nfc_id, language)
                reading_ref = user_ref.collection('readings').document(cache_key)
                reading_ref.delete()
            else:
                # Invalidate all language caches for today
                today = datetime.now().strftime('%Y-%m-%d')
                readings = user_ref.collection('readings')\
                    .where('timestamp', '>=', today)\
                    .stream()
                    
                for reading in readings:
                    reading.reference.delete()
                    
            return True
            
        except Exception as e:
            logger.error(f"Cache invalidation error: {e}")
            return False