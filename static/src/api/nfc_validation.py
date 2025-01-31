from datetime import datetime, timedelta
import logging
from typing import Dict, Optional, Any

logger = logging.getLogger(__name__)

class NFCValidation:
    def __init__(self, db):
        self.db = db
        
    def validate_poster_registration(self, poster_code: str) -> tuple[bool, Optional[str], Optional[Dict]]:
        """
        Comprehensive validation for poster registration
        Returns: (is_valid, error_message, poster_data)
        """
        try:
            # Basic validation
            if not poster_code or not isinstance(poster_code, str):
                return False, "Invalid poster code format", None
                
            # Query Firestore
            poster_ref = self.db.collection('valid_posters').document(poster_code)
            poster_doc = poster_ref.get()
            
            # Check if poster exists
            if not poster_doc.exists:
                return False, "Invalid poster code", None
                
            poster_data = poster_doc.to_dict() or {}
            
            # Initialize missing fields if needed
            if 'is_registered' not in poster_data:
                logger.info(f"Initializing missing fields for poster {poster_code}")
                update_data = {
                    'is_registered': False,
                    'nfc_id': f"nfc_{poster_code}",
                    'created_at': datetime.now().isoformat()
                }
                poster_ref.update(update_data)
                poster_data.update(update_data)
            
            # Check if already registered
            if poster_data.get('is_registered'):
                logger.info(f"Poster {poster_code} is already registered")
                return False, "This poster code has already been registered", None
            
            # Return validated data
            return True, None, {
                'status': 'new',
                'nfc_id': poster_data.get('nfc_id', f"nfc_{poster_code}"),
                'is_registered': False
            }
                
        except Exception as e:
            logger.error(f"Validation error for poster {poster_code}: {str(e)}")
            return False, f"Error validating poster code: {str(e)}", None