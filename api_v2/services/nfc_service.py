"""
NFC service - Business logic for NFC operations
"""
import logging
from datetime import datetime
from typing import Dict

logger = logging.getLogger(__name__)


class NFCService:
    """
    Service for NFC-related operations
    """
    
    def __init__(self, database):
        self.db = database
    
    async def verify_poster(self, nfc_id: str) -> Dict:
        """
        Verify if NFC poster is valid and check registration status
        """
        try:
            # Check in valid_posters collection
            poster_ref = self.db.collection('valid_posters').document(nfc_id)
            poster = poster_ref.get()
            
            if not poster.exists:
                return {
                    "valid": False,
                    "registered": False,
                    "message": "Invalid NFC poster"
                }
            
            poster_data = poster.to_dict()
            is_registered = poster_data.get('is_registered', False)
            
            return {
                "valid": True,
                "registered": is_registered,
                "message": "Valid poster" if not is_registered else "Poster already registered"
            }
        
        except Exception as e:
            logger.error(f"Error verifying poster: {e}")
            raise