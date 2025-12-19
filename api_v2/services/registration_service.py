"""
Registration service - Business logic for user registration
"""
import logging
from datetime import datetime
from typing import Dict, Tuple

from api_v2.models.registration import RegisterRequest, UserPreferences

logger = logging.getLogger(__name__)


class RegistrationService:
    """Service for handling user registration"""
    
    def __init__(self, database):
        self.db = database
    
    async def validate_poster_code(self, poster_code: str) -> Tuple[bool, str, Dict]:
        """
        Validate poster code for registration
        Returns: (is_valid, error_message, poster_data)
        """
        try:
            # Check if poster exists
            poster_ref = self.db.collection('valid_posters').document(poster_code)
            poster = poster_ref.get()
            
            if not poster.exists:
                return False, "Invalid poster code", {}
            
            poster_data = poster.to_dict()
            
            # Check if already registered
            if poster_data.get('is_registered', False):
                return False, "This poster code has already been registered", {}
            
            return True, "", poster_data
            
        except Exception as e:
            logger.error(f"Error validating poster: {e}")
            return False, "Error validating poster code", {}
    
    async def register_user(self, request: RegisterRequest) -> Dict:
        """
        Register new user with NFC poster
        """
        try:
            # Validate poster code
            is_valid, error_msg, poster_data = await self.validate_poster_code(request.posterCode)
            
            if not is_valid:
                raise ValueError(error_msg)
            
            # Get NFC ID from poster
            nfc_id = poster_data.get('nfc_id', f"nfc_{request.posterCode}")
            
            # Structure user data
            user_data = {
                'name': request.name,
                'dateOfBirth': request.dateOfBirth,
                'zodiacSign': request.zodiacSign,
                'preferences': {
                    'color': request.preferences.color.dict() if request.preferences.color else None,
                    'interests': request.preferences.interests,
                    'language': request.preferences.language,
                    'numbers': request.preferences.numbers.dict() if request.preferences.numbers else {},
                    'gender': request.preferences.gender or ''
                }
            }
            
            # Create user document
            user_document = {
                'nfc_id': nfc_id,
                'poster_code': request.posterCode,
                'user_data': user_data,
                'created_at': datetime.now(),
                'last_reading': None,
                'registration_complete': True
            }
            
            # Save to Firestore - nfc_users collection
            user_ref = self.db.collection('nfc_users').document(nfc_id)
            user_ref.set(user_document)
            
            # Update poster as registered
            poster_ref = self.db.collection('valid_posters').document(request.posterCode)
            poster_ref.update({
                'is_registered': True,
                'registered_at': datetime.now(),
                'nfc_id': nfc_id,
                'user_name': request.name
            })
            
            logger.info(f"User registered successfully: {nfc_id}")
            
            return {
                'success': True,
                'nfcId': nfc_id,
                'message': 'Registration successful',
                'userData': user_data
            }
            
        except ValueError as e:
            logger.error(f"Validation error: {e}")
            raise
        except Exception as e:
            logger.error(f"Registration error: {e}")
            raise Exception(f"Registration failed: {str(e)}")
    
    async def get_user(self, nfc_id: str) -> Dict:
        """Get user data by NFC ID"""
        try:
            user_ref = self.db.collection('nfc_users').document(nfc_id)
            user = user_ref.get()
            
            if not user.exists:
                raise ValueError("User not found")
            
            return user.to_dict()
            
        except Exception as e:
            logger.error(f"Error getting user: {e}")
            raise
    
    async def update_user_preferences(self, nfc_id: str, updates: Dict) -> Dict:
        """Update user preferences"""
        try:
            user_ref = self.db.collection('nfc_users').document(nfc_id)
            
            # Verify user exists
            if not user_ref.get().exists:
                raise ValueError("User not found")
            
            # Structure update data
            update_data = {
                'user_data': {}
            }
            
            # Only update fields that are provided
            if updates.get('name'):
                update_data['user_data']['name'] = updates['name']
            if updates.get('dateOfBirth'):
                update_data['user_data']['dateOfBirth'] = updates['dateOfBirth']
            if updates.get('language'):
                update_data['user_data']['preferences.language'] = updates['language']
            if updates.get('gender'):
                update_data['user_data']['preferences.gender'] = updates['gender']
            if updates.get('interests') is not None:
                update_data['user_data']['preferences.interests'] = updates['interests']
            if updates.get('color'):
                update_data['user_data']['preferences.color'] = updates['color']
            
            # Update in Firestore
            user_ref.update(update_data)
            
            logger.info(f"User preferences updated: {nfc_id}")
            
            return await self.get_user(nfc_id)
            
        except Exception as e:
            logger.error(f"Error updating user: {e}")
            raiseservices.py