from google.cloud import firestore
from datetime import datetime
import os
from dotenv import load_dotenv
import logging
import time
import string
import random

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if os.getenv('GAE_ENV', '').startswith('standard'):
    project_id = os.getenv('GOOGLE_CLOUD_PROJECT')
else:
    load_dotenv()
    project_id = os.getenv('PROJECT_ID')

db = firestore.Client(project=project_id)

def initialize_poster_code(poster_code):
    """Initialize a poster code in the valid_posters collection"""
    try:
        valid_posters = db.collection('valid_posters')
        poster_ref = valid_posters.document(poster_code)
        
        # Check if poster already exists
        if not poster_ref.get().exists:
            poster_data = {
                'poster_code': poster_code,
                'is_registered': False,
                'created_at': datetime.now().isoformat(),
                'nfc_programmed': True,
                'batch_info': {
                    'batch': 'INITIAL_BATCH',
                    'created_at': datetime.now().isoformat(),
                    'location': 'Georgia'
                }
            }
            poster_ref.set(poster_data)
            logger.info(f"Initialized poster code: {poster_code}")
            return True
            
        return True  # Already exists
        
    except Exception as e:
        logger.error(f"Error initializing poster code: {e}")
        return False
initialize_poster_code('R5QHJQ86')
    
def add_valid_poster_code(poster_code=None, batch_info=None):
    """Add a new valid poster code to the database"""
    try:
        # Generate a unique poster code if not provided
        if not poster_code:
            poster_code = generate_unique_poster_code()
        
        # Prepare poster data with required fields
        poster_data = {
            'created_at': batch_info.get('created_at', datetime.now().isoformat()),
            'owner': batch_info.get('owner', ''),
            'rebust': batch_info.get('rebust', ''),
            'is_active': True,
            'is_registered': False,  # Required field for registration check
            'use_count': 0,
            'nfc_id': f"nfc_{poster_code}"  # Associate NFC ID with poster
        }
        
        # Save to Firebase
        db.collection('valid_posters').document(poster_code).set(poster_data)
        
        return True, poster_code
        
    except Exception as e:
        logger.error(f"Error adding poster code: {e}")
        return False, None

def generate_unique_poster_code():
    """Generate a unique 8-character poster code"""
    while True:
        # Generate a random 8-character code
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        
        # Check if code already exists
        if not db.collection('valid_posters').document(code).get().exists:
            return code

def get_nfc_user(nfc_id):
    """Retrieve NFC user data"""
    try:
        # Add 'nfc_' prefix if not present
        if not nfc_id.startswith('nfc_'):
            nfc_id = f"nfc_{nfc_id}"

        logger.info(f"Fetching user data for NFC ID: {nfc_id}")
        
        # Get user document
        user_doc = db.collection('nfc_users').document(nfc_id).get()
        
        if not user_doc.exists:
            logger.error(f"No user found for NFC ID: {nfc_id}")
            return {"error": "NFC user not found"}, 404
            
        user_data = user_doc.to_dict()
        
        # Add nfc_id to the response if not present
        if 'nfc_id' not in user_data:
            user_data['nfc_id'] = nfc_id
            
        return {
            "success": True,
            "user_data": user_data
        }, 200
        
    except Exception as e:
        logger.error(f"Error fetching NFC user: {str(e)}")
        return {"error": f"Error retrieving NFC user data: {str(e)}"}, 500
    
def save_daily_reading(nfc_id, reading_data):
    """Save daily reading with numerology insights"""
    try:
        user_ref = db.collection('nfc_users').document(nfc_id)
        user = user_ref.get()
        
        if not user.exists:
            return {"error": "NFC user not found"}, 404
            
        today = datetime.now().strftime('%Y-%m-%d')
        
        # Get user's numbers for personalized insights
        user_data = user.to_dict()
        user_numbers = user_data.get('user_data', {}).get('preferences', {}).get('numbers', {})
        
        # Enhanced reading data with numerology
        enhanced_reading = {
            'date': today,
            'cardImage': reading_data.get('cardImage'),
            'affirmation': reading_data.get('affirmation'),
            'zodiacMessage': reading_data.get('zodiacMessage'),
            'numerologyInsight': {
                'favoriteNumber': user_numbers.get('favoriteNumber'),
                'luckyNumber': user_numbers.get('luckyNumber'),
                'guidanceNumber': user_numbers.get('guidanceNumber')
            },
            'timestamp': firestore.SERVER_TIMESTAMP
        }
        
        # Save reading in readings subcollection
        reading_ref = user_ref.collection('readings').document(today)
        reading_ref.set(enhanced_reading)
        
        # Update last reading date
        user_ref.update({
            'last_reading_date': today
        })
        
        return {"success": True, "message": "Daily reading saved"}, 200
        
    except Exception as e:
        logger.error(f"Error in save_daily_reading: {str(e)}")
        return {"error": "Error saving daily reading"}, 500
    
def validate_nfc_data(data):
    """Validate NFC user data before saving to Firestore"""
    
    class ValidationError(Exception):
        pass
    
    try:
        # Required base fields
        if not isinstance(data, dict):
            raise ValidationError("Invalid data format")
            
        required_base = ['name', 'dateOfBirth', 'zodiacSign']
        for field in required_base:
            if not data.get(field):
                raise ValidationError(f"Missing required field: {field}")
                
        # Validate numbers if present
        numbers = data.get('numbers', {})
        if numbers:
            if not isinstance(numbers, dict):
                raise ValidationError("Invalid numbers format")
                
            for num_field in ['favoriteNumber', 'luckyNumber', 'guidanceNumber']:
                if num_field in numbers:
                    try:
                        # Convert to string and validate
                        num_value = str(numbers[num_field])
                        if not num_value.isdigit() or len(num_value) > 3:
                            raise ValidationError(f"Invalid {num_field}")
                    except (ValueError, TypeError):
                        raise ValidationError(f"Invalid {num_field} format")
                        
        # Validate color if present
        color = data.get('color')
        if color:
            if not isinstance(color, dict) or 'name' not in color or 'value' not in color:
                raise ValidationError("Invalid color format")
                
        # Validate interests if present
        interests = data.get('interests', [])
        if not isinstance(interests, list):
            raise ValidationError("Invalid interests format")
            
        # Validate language
        language = data.get('language', 'en')
        if not isinstance(language, str) or len(language) != 2:
            raise ValidationError("Invalid language format")
            
        return True, None
        
    except ValidationError as e:
        return False, str(e)
    except Exception as e:
        return False, f"Validation error: {str(e)}"
    

# In nfc_firestore.py - add these new functions

def add_valid_poster_code(poster_code, batch_info=None):
    """Add a valid poster code to the system"""
    try:
        valid_posters = db.collection('valid_posters')
        poster_data = {
            'poster_code': poster_code,
            'is_registered': False,  # Will be set to True when a user registers
            'created_at': firestore.SERVER_TIMESTAMP,
            'batch_info': batch_info,  # Optional batch/manufacturing info
            'nfc_programmed': True     # Indicates NFC chip has been programmed
        }
        valid_posters.document(poster_code).set(poster_data)
        return True
    except Exception as e:
        logger.error(f"Error adding valid poster code: {e}")
        return False

def get_valid_poster_codes():
    """Get all valid poster codes"""
    try:
        valid_posters = db.collection('valid_posters').stream()
        return [{
            'poster_code': doc.id,
            **doc.to_dict()
        } for doc in valid_posters]
    except Exception as e:
        logger.error(f"Error getting valid poster codes: {e}")
        return []

def update_poster_nfc_status(poster_code, is_programmed=True):
    """Update NFC programming status for a poster"""
    try:
        valid_posters = db.collection('valid_posters')
        valid_posters.document(poster_code).update({
            'nfc_programmed': is_programmed,
            'programmed_at': firestore.SERVER_TIMESTAMP
        })
        return True
    except Exception as e:
        logger.error(f"Error updating NFC status: {e}")
        return False

def register_nfc_user(poster_code, user_data):
    """Register a new NFC user"""
    try:
        nfc_id = f"nfc_{poster_code}"
        
        # Structure user data
        structured_data = {
            'nfc_id': nfc_id,
            'poster_code': poster_code,
            'registration_date': datetime.now().isoformat(),
            'user_data': {
                'name': user_data.get('name'),
                'dateOfBirth': user_data.get('dateOfBirth'),
                'zodiacSign': user_data.get('zodiacSign', ''),
                'preferences': user_data.get('preferences', {
                    'color': {
                        'name': 'Cosmic Purple',
                        'value': '#A59AD1'
                    },
                    'numbers': {},
                    'interests': [],
                    'gender': '',
                    'language': user_data.get('preferences', {}).get('language', 'en')
                })
            },
            'last_reading_date': None,
            'status': 'active'
        }

        # Log the structured data
        logger.info(f"Structured user data for registration: {structured_data}")

        transaction = db.transaction()
        
        @firestore.transactional
        def register_in_transaction(transaction):
            # Get valid poster reference
            valid_poster_ref = db.collection('valid_posters').document(poster_code)
            valid_poster = valid_poster_ref.get(transaction=transaction)
            
            if not valid_poster.exists:
                return {"error": "Invalid poster code"}, 400
                
            if valid_poster.get('is_registered'):
                return {"error": "Poster already registered"}, 409
                
            # Update poster status
            transaction.update(valid_poster_ref, {
                'is_registered': True,
                'registration_date': firestore.SERVER_TIMESTAMP,
                'registered_nfc_id': nfc_id
            })
            
            # Create user document with structured data
            user_ref = db.collection('nfc_users').document(nfc_id)
            transaction.set(user_ref, structured_data)
            
            return {
                "success": True,
                "nfc_id": nfc_id,
                "data": structured_data
            }, 200
        
        return register_in_transaction(transaction)
        
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        return {"error": str(e)}, 500

def get_last_reading(nfc_id):
    """Get user's last reading"""
    try:
        user_ref = db.collection('nfc_users').document(nfc_id)
        user = user_ref.get()
        
        if not user.exists:
            return {"error": "NFC user not found"}, 404
            
        user_data = user.to_dict()
        last_reading_date = user_data.get('last_reading_date')
        
        if not last_reading_date:
            return {"message": "No previous reading found"}, 200
            
        reading_doc = user_ref.collection('readings').document(last_reading_date).get()
        
        if not reading_doc.exists:
            return {"message": "No reading data found"}, 200
            
        return {"success": True, "reading": reading_doc.to_dict()}, 200
        
    except Exception as e:
        print(f"Error in get_last_reading: {str(e)}")
        return {"error": "Error retrieving last reading"}, 500