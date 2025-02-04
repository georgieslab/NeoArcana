import os
import logging
from datetime import datetime
from typing import Dict, Optional, Any
from flask import Blueprint, request, jsonify, render_template, redirect, url_for
from dotenv import load_dotenv
from .nfc_rate_limiter import NFCRateLimiter
from .nfc_cache import NFCReadingCache
import random
import string
import time
from google.cloud import firestore
from .claude_tarot_api import api_handler
from anthropic import Anthropic
client = Anthropic()

# Load environment variables first
load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Import database and core dependencies
try:
    from .firebase_init import db

    from .nfc_firestore import (
        register_nfc_user,
        get_nfc_user,
        save_daily_reading,
        get_last_reading,
        add_valid_poster_code
    )
    logger.info("Successfully imported local modules")
except Exception as e:
    logger.error(f"Error importing local modules: {str(e)}")
    raise

# Initialize validation and monitoring
from .nfc_validation import NFCValidation
from .nfc_monitoring import NFCMonitor

validator = NFCValidation(db)
monitor = NFCMonitor(db)
rate_limiter = NFCRateLimiter(db)
reading_cache = NFCReadingCache(db)

# Create Blueprint
nfc_routes = Blueprint('nfc_routes', __name__)

def generate_unique_poster_code():
    """Generate a unique 8-character poster code"""
    MAX_ATTEMPTS = 10
    attempts = 0
    
    while attempts < MAX_ATTEMPTS:
        try:
            # Generate a random 8-character code
            code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
            
            # Check if code exists
            poster_ref = db.collection('valid_posters').document(code)
            if not poster_ref.get().exists:
                logger.info(f"Generated unique poster code: {code}")
                return code
                
            attempts += 1
            
        except Exception as e:
            logger.error(f"Error generating poster code: {e}")
            attempts += 1
    
    raise Exception("Failed to generate unique poster code after maximum attempts")
        

def validate_user_data(user_data: Dict) -> tuple[bool, Optional[str], Optional[Dict]]:
    """
    Validate incoming user data and structure it properly.
    Returns (is_valid, error_message, structured_data)
    """
    if not isinstance(user_data, dict):
        return False, "Invalid user data format", None

    # Required core fields with validation
    required_fields = {
        'name': str,
        'zodiacSign': str,
        'language': str
    }

    structured_data = {
        'name': '',
        'zodiacSign': '',
        'language': 'en',
        'preferences': {
            'numbers': {},
            'interests': [],
            'color': None
        }
    }

    # Validate required fields
    for field, field_type in required_fields.items():
        value = user_data.get(field)
        if not value or not isinstance(value, field_type):
            return False, f"Missing or invalid {field}", None
        structured_data[field] = value

    # Process optional preferences if they exist
    preferences = user_data.get('preferences', {})
    if preferences:
        # Process numbers
        numbers = preferences.get('numbers', {})
        if numbers and isinstance(numbers, dict):
            structured_data['preferences']['numbers'] = {
                'favoriteNumber': str(numbers.get('favoriteNumber', '')),
                'luckyNumber': str(numbers.get('luckyNumber', '')),
                'guidanceNumber': str(numbers.get('guidanceNumber', ''))
            }

        # Process interests
        interests = preferences.get('interests', [])
        if interests and isinstance(interests, list):
            structured_data['preferences']['interests'] = interests

        # Process color
        color = preferences.get('color')
        if color and isinstance(color, dict) and 'name' in color and 'value' in color:
            structured_data['preferences']['color'] = color

    return True, None, structured_data


@nfc_routes.route('/verify_poster', methods=['POST'])
def verify_poster():
    """Verify if a poster code is valid for registration"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                "success": False,
                "error": "No data provided"
            }), 400
            
        poster_code = data.get('posterCode')
        if not poster_code:
            return jsonify({
                "success": False,
                "error": "No poster code provided"
            }), 400

        # Log the incoming request
        logger.info(f"Verifying poster code: {poster_code}")
            
        # Validate poster code
        is_valid, error_msg, poster_data = validator.validate_poster_registration(poster_code)
        
        if not is_valid:
            return jsonify({
                "success": False,
                "error": error_msg
            }), 400
            
        # Valid poster code
        return jsonify({
            "success": True,
            "existingUser": False,
            "nfcId": poster_data['nfc_id'],
            "message": "Valid poster code for registration"
        })
        
    except Exception as e:
        logger.error(f"Error in verify_poster: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Internal server error"
        }), 500

@nfc_routes.route('/translate_reading', methods=['POST'])
def translate_reading():
    """Translate an existing reading to a new language"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        reading = data.get('reading')
        target_language = data.get('targetLanguage', 'en')
        user_data = data.get('userData', {})

        if not reading:
            return jsonify({"error": "No reading provided"}), 400

        # Don't translate if target language is the same as original
        if reading.get('originalLanguage') == target_language:
            return jsonify(reading), 200

        try:
            # Use Claude API to translate the reading content
            response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
                max_tokens=1024,
                messages=[{
                    "role": "user", 
                    "content": f"""Translate this tarot reading to {target_language}. 
                    Maintain the mystical and personal tone. This is for {user_data.get('name', 'the user')}, 
                    a {user_data.get('zodiacSign', '')} sign.

                    Affirmation: {reading.get('affirmation', '')}
                    
                    Interpretation: {reading.get('interpretation', '')}
                    
                    Numerology Insight: {reading.get('numerologyInsight', '')}
                    """
                }]
            )

            translations = response.content[0].text.split('\n\n')
            
            # Extract translations while maintaining mystical tone
            translated_reading = {
                'cardImage': reading['cardImage'],  # Keep original image
                'affirmation': next((t for t in translations if 'Affirmation' in t), '').replace('Affirmation:', '').strip(),
                'interpretation': next((t for t in translations if 'Interpretation' in t), '').replace('Interpretation:', '').strip(),
                'numerologyInsight': next((t for t in translations if 'Numerology' in t), '').replace('Numerology Insight:', '').strip(),
                'originalLanguage': target_language
            }

            # Cache the translation
            cache_key = f"{user_data.get('nfc_id')}_{target_language}_translation"
            reading_cache.cache_reading(user_data.get('nfc_id'), target_language, translated_reading)

            return jsonify(translated_reading), 200

        except Exception as translation_error:
            logger.error(f"Translation error: {translation_error}")
            return jsonify({
                "error": "Translation failed",
                "details": str(translation_error)
            }), 500

    except Exception as e:
        logger.error(f"Error in translate_reading: {str(e)}")
        return jsonify({
            "error": "Failed to process translation request",
            "details": str(e)
        }), 500
@nfc_routes.route('/weekly_reading', methods=['POST'])  
async def get_weekly_reading():
    """Get weekly 3-card reading"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        nfc_id = data.get('nfc_id')
        if not nfc_id:
            return jsonify({"error": "No NFC ID provided"}), 400

        # Check weekly limit
        can_read, limit_error = await rate_limiter.check_weekly_limit(nfc_id)
        if not can_read:
            # Try to get last reading if limit reached
            last_reading = await rate_limiter.get_last_reading(nfc_id, 'weekly')
            if last_reading:
                return jsonify({
                    "success": True,
                    "cached": True,
                    "data": last_reading,
                    "message": "Showing last week's reading"
                })
            return jsonify({
                "success": False,
                "error": limit_error
            }), 429

        # Get user data
        user_doc = await db.collection('nfc_users').document(nfc_id).get()
        if not user_doc.exists:
            return jsonify({"error": "User not found"}), 404

        user_data = user_doc.to_dict()
        preferences = user_data.get('user_data', {}).get('preferences', {})

        # Generate 3-card reading using Claude
        reading = api_handler.get_three_card_reading(
            name=user_data.get('user_data', {}).get('name', ''),
            zodiac_sign=user_data.get('user_data', {}).get('zodiacSign', ''),
            language=preferences.get('language', 'en'),
            color=preferences.get('color'),
            interests=preferences.get('interests', []),
            gender=preferences.get('gender', '')
        )

        # Record the reading
        success = await rate_limiter.record_weekly_reading(nfc_id, reading)
        if not success:
            return jsonify({
                "error": "Failed to save reading"
            }), 500

        return jsonify({
            "success": True,
            "cached": False,
            "data": reading
        })

    except Exception as e:
        logger.error(f"Error in weekly reading: {str(e)}")
        return jsonify({
            "error": "Failed to generate weekly reading"
        }), 500
    
@nfc_routes.route('/daily_affirmation', methods=['POST'])
def daily_affirmation():
    try:
        data = request.get_json()
        logger.info(f"Received daily affirmation request: {data}")
        
        if not data or 'userData' not in data:
            return jsonify({
                "success": False,
                "error": "No user data provided"
            }), 400

        user_data = data['userData']
        nfc_id = user_data.get('nfc_id')
        
        if not nfc_id:
            return jsonify({
                "success": False,
                "error": "No NFC ID provided"
            }), 400

        # Get cached reading if exists
        cached_reading = reading_cache.get_cached_reading(nfc_id, user_data.get('language', 'en'))
        if cached_reading:
            logger.info(f"Returning cached reading for {nfc_id}")
            return jsonify({
                "success": True,
                "data": cached_reading,
                "cached": True
            })

        try:
            # Use the existing single card reading method
            reading = api_handler.get_single_card_reading(
                name=user_data.get('name'),
                zodiac_sign=user_data.get('zodiacSign'),
                language=user_data.get('language', 'en'),
                numbers=user_data.get('preferences', {}).get('numbers', {}),
                color=user_data.get('preferences', {}).get('color'),
                interests=user_data.get('preferences', {}).get('interests', [])
            )

            # Cache the new reading
            reading_cache.cache_reading(nfc_id, user_data.get('language', 'en'), reading)
            
            return jsonify({
                "success": True,
                "data": reading
            })

        except Exception as reading_error:
            logger.error(f"Error generating reading: {reading_error}")
            raise

    except Exception as e:
        logger.error(f"Error in daily_affirmation: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Failed to generate reading",
            "details": str(e)
        }), 500

@nfc_routes.route('/three_card_reading', methods=['POST'])
async def get_three_card_reading():
    """Get a three card tarot spread"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        nfc_id = data.get('nfc_id')
        if not nfc_id:
            return jsonify({"error": "No NFC ID provided"}), 400

        # Check weekly limit
        can_read, limit_error = await rate_limiter.check_weekly_limit(nfc_id)
        if not can_read:
            # Try to get last weekly reading if limit reached
            last_reading = await rate_limiter.get_last_reading(nfc_id, 'weekly')
            if last_reading:
                return jsonify({
                    "success": True,
                    "cached": True,
                    "data": last_reading,
                    "message": "Showing this week's reading"
                })
            return jsonify({
                "success": False,
                "error": "You can get a new 3-card reading next week"
            }), 429

        # Get user preferences
        user_ref = db.collection('nfc_users').document(nfc_id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            return jsonify({"error": "User not found"}), 404
            
        user_data = user_doc.to_dict()
        user_prefs = user_data.get('user_data', {}).get('preferences', {})

        # Get three card reading
        reading = api_handler.get_three_card_reading(
            name=user_data.get('user_data', {}).get('name', ''),
            zodiac_sign=user_data.get('user_data', {}).get('zodiacSign', ''),
            language=user_prefs.get('language', 'en'),
            color=user_prefs.get('color'),
            interests=user_prefs.get('interests', []),
            gender=user_prefs.get('gender', '')
        )

        # Include additional metadata
        reading['timestamp'] = datetime.now().isoformat()
        reading['type'] = 'three_card'
        reading['nfc_id'] = nfc_id

        # Record the reading
        await rate_limiter.record_weekly_reading(nfc_id, reading)

        # Return the reading
        return jsonify({
            "success": True,
            "cached": False,
            "data": reading
        })

    except Exception as e:
        logger.error(f"Error in three card reading: {str(e)}")
        return jsonify({
            "error": "Failed to generate three card reading",
            "details": str(e)
        }), 500
        
@nfc_routes.route('/admin/posters', methods=['POST'])
def manage_poster_codes():
    try:
        if request.headers.get('X-Admin-Key') != os.getenv('ADMIN_KEY'):
            return jsonify({"error": "Unauthorized"}), 401
            
        data = request.get_json()
        logger.info(f"Received poster management request: {data}")
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        action = data.get('action')
        
        if action == 'add':
            # Generate a unique code if not provided
            poster_code = data.get('poster_code') or generate_unique_poster_code()
            
            # Create batch info from request data
            batch_info = {
                'batch': 'DEV_BATCH',
                'manufacturing_date': datetime.now().strftime('%Y-%m-%d'),
                'production_location': 'Georgia',
                'owner': data.get('batch_info', {}).get('owner', ''),
                'rebust': data.get('batch_info', {}).get('rebust', '')
            }
            
            # Add the poster code using the same method as manage_posters.py
            try:
                valid_posters = db.collection('valid_posters')
                poster_data = {
                    'poster_code': poster_code,
                    'is_registered': False,
                    'created_at': datetime.now(),
                    'batch_info': batch_info,
                    'nfc_programmed': True,
                    'owner': batch_info['owner'],
                    'rebust': batch_info['rebust']
                }
                
                # Add to Firestore
                valid_posters.document(poster_code).set(poster_data)
                
                logger.info(f"Successfully created poster with code: {poster_code}")
                
                return jsonify({
                    "success": True,
                    "poster_code": poster_code,
                    "message": "Poster code created successfully",
                    "data": poster_data
                })
                
            except Exception as e:
                logger.error(f"Failed to create poster: {e}")
                return jsonify({
                    "success": False,
                    "error": f"Failed to create poster code: {str(e)}"
                }), 500
                
        elif action == 'list':
            # List all valid poster codes
            valid_posters = db.collection('valid_posters').stream()
            posters = []
            for doc in valid_posters:
                poster_data = doc.to_dict()
                poster_data['poster_code'] = doc.id
                posters.append(poster_data)
            
            return jsonify(posters)

        elif action == 'delete':
            poster_code = data.get('poster_code')
            if not poster_code:
                return jsonify({
                    "success": False,
                    "error": "No poster code provided for deletion"
                }), 400

            try:
                db.collection('valid_posters').document(poster_code).delete()
                logger.info(f"Successfully deleted poster: {poster_code}")
                return jsonify({
                    "success": True,
                    "message": f"Poster {poster_code} deleted successfully"
                })
            except Exception as e:
                logger.error(f"Failed to delete poster: {e}")
                return jsonify({
                    "success": False,
                    "error": f"Failed to delete poster: {str(e)}"
                }), 500
                
        else:
            return jsonify({
                "success": False,
                "error": "Invalid action specified"
            }), 400
            
    except Exception as e:
        logger.error(f"Error managing poster codes: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
@nfc_routes.route('/admin/delete_code', methods=['POST'])
def delete_nfc_code():
    try:
        if request.headers.get('X-Admin-Key') != os.getenv('ADMIN_KEY'):
            return jsonify({"error": "Unauthorized"}), 401

        data = request.get_json()
        nfc_id = data.get('nfc_id')

        if not nfc_id:
            return jsonify({
                "success": False,
                "error": "No NFC ID provided"
            }), 400

        # Delete NFC user data
        nfc_ref = db.collection('nfc_users').document(nfc_id)
        if not nfc_ref.get().exists:
            return jsonify({
                "success": False,
                "error": "NFC code not found"
            }), 404

        nfc_ref.delete()

        # Delete associated readings
        readings_ref = db.collection('nfc_readings').where('nfc_id', '==', nfc_id)
        for reading in readings_ref.stream():
            reading.reference.delete()

        return jsonify({
            "success": True,
            "message": f"NFC code {nfc_id} and associated data deleted successfully"
        })

    except Exception as e:
        logger.error(f"Error deleting NFC code: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@nfc_routes.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        logger.info(f"Registration data received: {data}")

        # Structure user data properly
        user_data = {
            'name': data.get('name'),
            'dateOfBirth': data.get('dateOfBirth'),
            'zodiacSign': data.get('zodiacSign'),
            'preferences': {
                'color': data.get('preferences', {}).get('color'),
                'interests': data.get('preferences', {}).get('interests', []),
                'language': data.get('preferences', {}).get('language', 'en'),
                'numbers': data.get('preferences', {}).get('numbers', {}),
                'gender': data.get('preferences', {}).get('gender', '')
            }
        }

        logger.info(f"Structured user data: {user_data}")

        result, status_code = register_nfc_user(
            data.get('posterCode'),
            user_data
        )

        logger.info(f"Registration complete with status {status_code}: {result}")

        return jsonify(result), status_code

    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        return jsonify({
            "error": str(e),
            "success": False
        }), 500
        
@nfc_routes.route('/update_user/<nfc_id>', methods=['PUT'])
def update_user(nfc_id):
    try:
        data = request.get_json()
        logger.info(f"Updating user {nfc_id} with data: {data}")
        
        user_ref = db.collection('nfc_users').document(nfc_id)
        user_doc = user_ref.get()

        if not user_doc.exists:
            return jsonify({"error": "User not found"}), 404

        # Update user data
        update_data = {
            'user_data': {
                'name': data.get('name'),
                'dateOfBirth': data.get('dateOfBirth'),
                'language': data.get('language'),
                'gender': data.get('gender'),
                'interests': data.get('interests', []),
                'color': data.get('color')
            }
        }

        user_ref.update(update_data)
        
        return jsonify({
            "success": True,
            "nfcId": nfc_id,
            "message": "User data updated successfully"
        })
        
    except Exception as e:
        logger.error(f"Error updating user: {str(e)}")
        return jsonify({"error": str(e)}), 500

@nfc_routes.route('/user/<nfc_id>', methods=['GET'])
def get_user(nfc_id):
    try:
        result, status_code = get_nfc_user(nfc_id)
        return jsonify(result), status_code
        
    except Exception as e:
        logger.error(f"Error in get_user: {str(e)}")
        return jsonify({"error": "Error retrieving user data"}), 500