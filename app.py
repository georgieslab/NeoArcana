import os
from flask import Flask, render_template, request, jsonify, make_response, Blueprint, redirect, url_for, send_from_directory
from dotenv import load_dotenv
import logging
from datetime import datetime, timedelta
import secrets
import string
import random
import uuid
from anthropic import Anthropic
import json
import firebase_admin
from firebase_admin import credentials, firestore
import time
import sys
from flask.cli import with_appcontext
import click

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

logger = logging.getLogger(__name__)

# Load environment variables properly (Fix for API key issue)
load_dotenv(override=True)

# Initialize Anthropic client with API key from environment
api_key = os.getenv('ANTHROPIC_API_KEY')
if not api_key:
    logger.error("ANTHROPIC_API_KEY environment variable is not set!")
else:
    # Log first few characters for debugging (remove in production)
    logger.info(f"API key loaded: {api_key[:7]}...")

try:
    client = Anthropic(api_key=api_key)
    logger.info("Anthropic client initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize Anthropic client: {e}")
    client = None

# Initialize Flask app
app = Flask(__name__, static_folder='static', template_folder='templates')

# Import Firebase and initialize db
try:
    from static.src.api.firebase_init import db
    logger.info("Firebase initialized successfully")
except Exception as e:
    logger.error(f"Error initializing Firebase: {e}")
    db = None

# Initialize Anthropic and Claude API handler
try:
    from static.src.api.claude_tarot_api import create_api_handler
    api_handler = create_api_handler()
    logger.info("Claude API handler created: %s", "Success" if api_handler else "Failed")
except Exception as e:
    logger.error(f"Error creating Claude API handler: {e}")
    api_handler = None

# Import and initialize monitoring and validation
try:
    from static.src.api.nfc_monitoring import NFCMonitor
    from static.src.api.nfc_validation import NFCValidation
    nfc_monitor = NFCMonitor(db)
    nfc_validator = NFCValidation(db)
    logger.info("NFC monitoring and validation initialized")
except Exception as e:
    logger.error(f"Error initializing NFC monitoring: {e}")
    nfc_monitor = None
    nfc_validator = None

# Initialize rate limiter
try:
    from static.src.api.nfc_rate_limiter import NFCRateLimiter
    rate_limiter = NFCRateLimiter(db)
    logger.info("Rate limiter initialized")
except Exception as e:
    logger.error(f"Error initializing rate limiter: {e}")
    rate_limiter = None

# Initialize reading cache
try:
    from static.src.api.nfc_cache import NFCReadingCache
    reading_cache = NFCReadingCache(db)
    logger.info("Reading cache initialized")
except Exception as e:
    logger.error(f"Error initializing reading cache: {e}")
    reading_cache = None

# Initialize the unified admin routes
try:
    # Define admin routes blueprint
    def init_admin_routes(db, nfc_monitor=None):
        admin_routes = Blueprint('admin_routes', __name__)
        
        def generate_unique_poster_code(length=8):
            """Generate a unique 8-character poster code"""
            while True:
                # Generate a random 8-character code
                code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
                
                # Check if code exists
                poster_ref = db.collection('valid_posters').document(code)
                if not poster_ref.get().exists:
                    return code

        @admin_routes.route('/posters', methods=['POST'])
        def manage_posters():
            """
            Admin endpoint for managing poster codes
            - Generate new poster codes
            - List existing poster codes
            - Delete unused poster codes
            """
            try:
                # Verify admin key
                admin_key = os.getenv('ADMIN_KEY', '29isthenewOne')  # Fallback to dev key
                if request.headers.get('X-Admin-Key') != admin_key:
                    logger.warning("Unauthorized attempt to access admin endpoint")
                    return jsonify({"error": "Unauthorized"}), 401
                    
                data = request.get_json()
                if not data:
                    return jsonify({"error": "No data provided"}), 400
                    
                action = data.get('action')
                logger.info(f"Admin poster management: {action}")
                
                if action == 'add':
                    # Generate a unique code if not provided
                    poster_code = data.get('poster_code')
                    if not poster_code:
                        poster_code = generate_unique_poster_code()
                    
                    # Create batch info from request data
                    batch_info = data.get('batch_info', {})
                    
                    # Add the poster code
                    poster_ref = db.collection('valid_posters').document(poster_code)
                    poster_data = {
                        'created_at': datetime.now(),
                        'is_registered': False,
                        'nfc_programmed': True,
                        'owner': batch_info.get('owner', ''),
                        'rebust': batch_info.get('rebust', ''),
                        'nfc_id': f"nfc_{poster_code}"
                    }
                    
                    poster_ref.set(poster_data)
                    
                    logger.info(f"Successfully created poster with code: {poster_code}")
                    
                    return jsonify({
                        "success": True,
                        "poster_code": poster_code,
                        "data": poster_data
                    })
                        
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
                    # Delete a poster code if it's not registered
                    poster_code = data.get('poster_code')
                    if not poster_code:
                        return jsonify({
                            "success": False,
                            "error": "No poster code provided for deletion"
                        }), 400

                    poster_ref = db.collection('valid_posters').document(poster_code)
                    poster = poster_ref.get()
                    
                    if not poster.exists:
                        return jsonify({
                            "success": False,
                            "error": "Poster code not found"
                        }), 404
                        
                    poster_data = poster.to_dict()
                    if poster_data.get('is_registered'):
                        return jsonify({
                            "success": False,
                            "error": "Cannot delete a registered poster"
                        }), 400
                        
                    poster_ref.delete()
                    logger.info(f"Successfully deleted poster: {poster_code}")
                    
                    return jsonify({
                        "success": True,
                        "message": f"Poster {poster_code} deleted successfully"
                    })
                        
                else:
                    return jsonify({
                        "success": False,
                        "error": "Invalid action specified"
                    }), 400
                    
            except Exception as e:
                logger.error(f"Error in admin_manage_posters: {e}")
                return jsonify({
                    "success": False,
                    "error": str(e)
                }), 500
                
        @admin_routes.route('/delete_code', methods=['POST'])
        def delete_nfc_code():
            """Delete an NFC code"""
            try:
                # Verify admin key
                admin_key = os.getenv('ADMIN_KEY', '29isthenewOne')
                if request.headers.get('X-Admin-Key') != admin_key:
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
        
        @admin_routes.route('/analytics', methods=['GET'])
        def get_analytics():
            """Get app analytics data"""
            try:
                # Verify admin key
                admin_key = os.getenv('ADMIN_KEY', '29isthenewOne')
                if request.headers.get('X-Admin-Key') != admin_key:
                    return jsonify({"error": "Unauthorized"}), 401

                # Example analytics data
                total_users = db.collection('nfc_users').count().get()[0][0].value
                total_posters = db.collection('valid_posters').count().get()[0][0].value
                recent_users = []
                
                # Get the 10 most recent users
                recent_users_query = db.collection('nfc_users').order_by('registration_date', direction=firestore.Query.DESCENDING).limit(10)
                for user in recent_users_query.stream():
                    user_data = user.to_dict()
                    recent_users.append({
                        'nfc_id': user_data.get('nfc_id'),
                        'registration_date': user_data.get('registration_date'),
                        'name': user_data.get('user_data', {}).get('name', 'Unknown')
                    })

                return jsonify({
                    "success": True,
                    "data": {
                        "total_users": total_users,
                        "total_posters": total_posters,
                        "recent_users": recent_users
                    }
                })

            except Exception as e:
                logger.error(f"Error getting analytics: {e}")
                return jsonify({
                    "success": False,
                    "error": str(e)
                }), 500
                
        return admin_routes

    # Register admin routes
    admin_routes = init_admin_routes(db, nfc_monitor)
    app.register_blueprint(admin_routes, url_prefix='/api/nfc/admin')
    logger.info("Admin routes registered at /api/nfc/admin")
except Exception as e:
    logger.error(f"Error initializing admin routes: {e}")

# Import other API modules
try:
    from static.src.api.firestore_signup import (
        signup_user, 
        save_reading, 
        check_premium_status, 
        save_chat_message
    )
    from static.src.api.nfc_routes import nfc_routes
    app.register_blueprint(nfc_routes, url_prefix='/api/nfc')
    logger.info("NFC routes registered")
except Exception as e:
    logger.error(f"Error importing API modules: {e}")

# Import other necessary modules
try:
    from static.src.api.tarot_cards import get_random_cards
    from static.src.api.promo_codes import promo_manager
    logger.info("Additional API modules loaded successfully")
except ImportError as e:
    logger.error(f"Error importing additional API modules: {e}")

# Add debug logging
logger.info("Starting Tarot Application")
logger.info(f"API Handler Status: {api_handler is not None}")
logger.info(f"Debug Mode: {app.debug}")

@app.route('/nfc')
def handle_nfc():
    """Handle NFC registration flow"""
    poster_code = request.args.get('posterCode')
    
    initial_state = {
        'view': 'registration',
        'isNFCRegistration': True,
        'step': 1,
        'posterCode': poster_code  # This will be null if no code is provided
    }
    
    logger.info(f"Rendering NFC page with initial state: {initial_state}")
    
    return render_template('react.html', initial_state=initial_state)

@app.route('/')
def index():
    """Handle root route with optional parameters"""
    nfc_id = request.args.get('id')
    poster_code = request.args.get('posterCode')
    admin_mode = request.args.get('admin') == 'true'
    
    initial_state = {}
    
    if nfc_id:
        # Pass NFC ID to template for daily reading
        initial_state = {
            'isNFCUser': True,
            'nfcId': nfc_id,
            'step': 2
        }
    elif poster_code:
        return redirect(url_for('handle_nfc', posterCode=poster_code))
    elif admin_mode:
        initial_state = {
            'showAdminPanel': True,
            'step': -1
        }
        
    return render_template('react.html', initial_state=initial_state)

@app.route('/api/nfc/verify_poster', methods=['POST'])
def verify_poster():
    """Verify if a poster code is valid for registration"""
    try:
        data = request.get_json()
        if not data:
            logger.error("No JSON data in request")
            return jsonify({
                "success": False,
                "error": "No data provided"
            }), 400
            
        poster_code = data.get('posterCode')
        if not poster_code:
            logger.error("No poster code in request data")
            return jsonify({
                "success": False,
                "error": "No poster code provided"
            }), 400
            
        logger.info(f"Verifying poster code: {poster_code}")
            
        # Check if poster code exists and is not registered
        poster_ref = db.collection('valid_posters').document(poster_code)
        poster = poster_ref.get()
        
        if not poster.exists:
            return jsonify({
                "success": False,
                "error": "Invalid poster code"
            }), 400
            
        poster_data = poster.to_dict()
        if poster_data.get('is_registered'):
            return jsonify({
                "success": False,
                "error": "This poster has already been registered"
            }), 400
            
        return jsonify({
            "success": True,
            "message": "Valid poster code"
        })
        
    except Exception as e:
        logger.error(f"Error verifying poster: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Failed to verify poster code"
        }), 500   

@app.route('/service-worker.js')
def service_worker():
    response = make_response(send_from_directory('static', 'service-worker.js'))
    response.headers['Content-Type'] = 'application/javascript'
    response.headers['Service-Worker-Allowed'] = '/'
    return response

@app.route('/manifest.json')
def manifest():
    return send_from_directory('static', 'manifest.json')

@app.route('/api/submit_user', methods=['POST'])
def submit_user():
    """Handle user data submission"""
    try:
        data = request.get_json()
        logger.debug("Received data: %s", data)
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        is_premium = data.get('isPremium', False)
        logger.info("Premium status: %s", is_premium)
        
        required_fields = ['name', 'dateOfBirth']
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            return jsonify({
                "error": f"Missing required fields: {', '.join(missing_fields)}"
            }), 400
        
        # Calculate zodiac sign
        try:
            date_obj = datetime.strptime(data['dateOfBirth'], '%Y-%m-%d')
            zodiac_sign = get_zodiac_sign(date_obj)
        except ValueError:
            return jsonify({"error": "Invalid date format"}), 400
            
        response_data = {
            "success": True,
            "zodiac_sign": zodiac_sign,
            "user_data": {
                "name": data['name'],
                "isPremium": is_premium
            }
        }
        logger.debug("Sending response: %s", response_data)
        return jsonify(response_data)
        
    except Exception as e:
        logger.error("Error in submit_user: %s", str(e))
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/api/get_tarot_reading', methods=['GET'])
def get_tarot_reading():
    try:
        name = request.args.get('name')
        zodiac_sign = request.args.get('zodiacSign')
        is_premium = request.args.get('isPremium', 'false').lower() == 'true'
        language = request.args.get('language', 'en')
        
        # Get color and interests for premium users
        color = None
        interests = None
        if is_premium:
            try:
                color_data = request.args.get('color')
                if color_data:
                    color = json.loads(color_data)
                
                interests_data = request.args.get('interests')
                if interests_data:
                    interests = json.loads(interests_data)
            except json.JSONDecodeError:
                logger.warning("Failed to parse color or interests data")

        logger.info(f"Tarot reading request - Name: {name}, Zodiac: {zodiac_sign}, Premium: {is_premium}, Language: {language}")

        if is_premium:
            reading_data = get_premium_reading(name, zodiac_sign, language, color, interests)
        else:
            reading_data = get_single_card_reading(name, zodiac_sign, language)

        if not reading_data or 'interpretation' not in reading_data:
            raise Exception("Reading data is missing or incomplete!")

        return jsonify(reading_data)

    except Exception as e:
        logger.error(f"Error in get_tarot_reading: {str(e)}")
        return jsonify({
            "error": "Failed to generate reading",
            "details": str(e)
        }), 500
    
@app.route('/api/start_chat', methods=['POST'])
def start_chat():
    try:
        data = request.get_json()
        logger.info(f"Starting chat with data: {data}")
        
        if not api_handler:
            return jsonify({"error": "API service unavailable"}), 503
            
        language = data.get('language', 'en')
        logger.info(f"Using language: {language}")
            
        # Format initial message based on reading type and language
        if data.get('isPremium'):
            welcome_msg = (
                f"Hi {data['name']}! I'm here to discuss your premium three-card reading "
                f"representing your past, present, and future. What would you like to know more about?"
            )
        else:
            welcome_msg = (
                f"Hi {data['name']}! I'm here to discuss your tarot reading "
                f"with the {data['cardName']} card. What would you like to know more about?"
            )
            
        # If language is not English, use Claude to translate welcome message
        if language != 'en':
            try:
                translate_prompt = f"Translate this message to {language}: {welcome_msg}"
                response = client.messages.create(
                    model="claude-3-5-sonnet-20241022",
                    max_tokens=1000,
                    messages=[{"role": "user", "content": translate_prompt}]
                )
                welcome_msg = response.content[0].text
            except Exception as e:
                logger.error(f"Translation error: {e}")
                # Fallback to English if translation fails
                
        return jsonify({
            "success": True,
            "response": welcome_msg,
            "session_id": str(uuid.uuid4())
        })
        
    except Exception as e:
        logger.error(f"Chat initialization error: {e}")
        return jsonify({
            "error": "Failed to start chat session"
        }), 500
    
@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        logger.info(f"Chat request received with data: {data}")
        
        # Validate required fields
        required_fields = ['message', 'name', 'zodiacSign']
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            error_msg = f"Missing required fields: {', '.join(missing_fields)}"
            logger.error(error_msg)
            return jsonify({"error": error_msg}), 400

        if not api_handler:
            logger.error("API handler not initialized")
            return jsonify({"error": "API service unavailable"}), 503
        
        try:
            # Format message history
            message_history = data.get('messageHistory', [])
            logger.debug(f"Message history: {message_history}")
            
            # Create system prompt
            system_prompt = f"""You are a friendly and knowledgeable tarot reader having an ongoing conversation with {data['name']}, 
            who is a {data['zodiacSign']}. Their reading was: {data.get('reading', '')}
            
            Important:
            1. You are continuing an existing conversation - do not introduce yourself again
            2. Maintain conversation flow naturally
            3. Keep responses focused on the tarot reading, and user zodiac sign
            4. Respond in {getLanguageForClaude(data.get('language', 'en'))} language
            5. Keep responses concise but meaningful
            """
            
            claude_messages = []
            
            # Add previous messages if any
            for msg in message_history:
                if isinstance(msg, dict) and 'role' in msg and 'content' in msg:
                    role = "assistant" if msg['role'] == 'assistant' else "user"
                    claude_messages.append({
                        "role": role,
                        "content": msg['content']
                    })
            
            # Add current message
            claude_messages.append({
                "role": "user",
                "content": data['message']
            })
            
            logger.info(f"Sending request to Claude with {len(claude_messages)} messages")
            
            # Use system parameter separately from messages
            response = client.messages.create(
               model="claude-3-5-sonnet-20241022",
                max_tokens=1000,
                system=system_prompt,  # System prompt as separate parameter
                messages=claude_messages
            )
            
            if not response or not response.content:
                raise ValueError("Empty response from Claude")

            logger.info("Successfully received response from Claude")
            return jsonify({
                "success": True,
                "response": response.content[0].text
            })

        except Exception as e:
            logger.error(f"Claude API error: {str(e)}")
            return jsonify({
                "error": "Failed to generate response",
                "details": str(e)
            }), 500
            
    except Exception as e:
        logger.error(f"Chat processing error: {str(e)}")
        return jsonify({
            "error": "Failed to process message",
            "details": str(e)
        }), 500

@app.route('/test_tarot')
def test_tarot():
    try:
        # Create a new Anthropic client with key from environment
        client = Anthropic()
        
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            messages=[{
                "role": "user",
                "content": "Create a one-card tarot reading focused on personal growth. Include the card name and a short interpretation."
            }],
            max_tokens=1000
        )
        
        reading = response.content[0].text
        
        return jsonify({
            "success": True,
            "reading": reading
        })
        
    except Exception as e:
        logger.error(f"Error in test_tarot: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/validate_premium_code', methods=['POST'])
def validate_premium_code():
    data = request.get_json()
    code = data.get('code', '').strip()
    
    if not code:
        return jsonify({'valid': False, 'error': 'No code provided'})
    
    is_valid, message = promo_manager.validate_code(code)
    if not is_valid:
        return jsonify({'valid': False, 'error': message})
    
    code_stats = promo_manager.get_code_stats(code)
    return jsonify({
        'valid': True,
        'expiry': code_stats['expiry'],
        'uses': code_stats['uses']
    })

@app.route('/api/generate_premium_code', methods=['POST'])
def create_premium_code():
    try:
        logger.info("Received request to generate premium code")
        logger.debug(f"Request headers: {request.headers}")
        logger.debug(f"Request body: {request.get_json()}")
        
        if request.headers.get('X-Admin-Key') != os.getenv('ADMIN_KEY', '29isthenewOne'):
            logger.warning("Unauthorized attempt to generate code")
            return jsonify({'error': 'Unauthorized'}), 401
            
        # Get duration from request or use default
        data = request.get_json() or {}
        duration_days = data.get('duration_days', 365)
        
        code = promo_manager.generate_code(duration_days)
        logger.info(f"Successfully generated new code: {code}")
        return jsonify({'code': code})
        
    except Exception as e:
        logger.error(f"Error generating premium code: {e}")
        return jsonify({'error': str(e)}), 500

# Add test user endpoint
@app.route('/api/add_test_user', methods=['POST'])
def add_test_user():
    """Add the test user to the database"""
    try:
        # Verify admin key
        admin_key = os.getenv('ADMIN_KEY', '29isthenewOne')
        if request.headers.get('X-Admin-Key') != admin_key:
            return jsonify({"error": "Unauthorized"}), 401
        
        # Test user code
        test_code = "091094"
        nfc_id = f"nfc_{test_code}"
        
        # First, add the poster code
        poster_ref = db.collection('valid_posters').document(test_code)
        
        # Check if the poster already exists
        if poster_ref.get().exists:
            logger.info(f"Poster code {test_code} already exists")
        else:
            # Add the poster code
            poster_data = {
                'poster_code': test_code,
                'is_registered': True,
                'created_at': datetime.now(),
                'batch_info': {
                    'batch': 'TEST_BATCH',
                    'created_at': datetime.now().isoformat(),
                    'location': 'Georgia'
                },
                'nfc_programmed': True,
                'registered_nfc_id': nfc_id
            }
            poster_ref.set(poster_data)
            logger.info(f"Added poster code: {test_code}")
        
        # Then, add the user data
        user_ref = db.collection('nfc_users').document(nfc_id)
        
        # Check if the user already exists
        if user_ref.get().exists:
            logger.info(f"User {nfc_id} already exists")
            return jsonify({"success": True, "message": "Test user already exists"})
        
        # Add the user data
        user_data = {
            'nfc_id': nfc_id,
            'poster_code': test_code,
            'registration_date': datetime.now().isoformat(),
            'user_data': {
                'name': 'Test User',
                'dateOfBirth': '1994-09-10',
                'zodiacSign': 'Virgo',
                'preferences': {
                    'color': {
                        'name': 'Cosmic Purple',
                        'value': '#A59AD1'
                    },
                    'numbers': {
                        'favoriteNumber': '9',
                        'luckyNumber': '10',
                        'guidanceNumber': '94'
                    },
                    'interests': ['Spirituality', 'Astrology', 'Meditation'],
                    'gender': 'other',
                    'language': 'en'
                }
            },
            'last_reading_date': None,
            'status': 'active'
        }
        
        user_ref.set(user_data)
        logger.info(f"Added test user: {nfc_id}")
        
        return jsonify({"success": True, "message": "Test user added successfully"})
        
    except Exception as e:
        logger.error(f"Error adding test user: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

def get_zodiac_sign(date_obj):
    """Calculate zodiac sign from date object"""
    month = date_obj.month
    day = date_obj.day
    
    if (month == 3 and day >= 21) or (month == 4 and day <= 19):
        return "Aries"
    elif (month == 4 and day >= 20) or (month == 5 and day <= 20):
        return "Taurus"
    elif (month == 5 and day >= 21) or (month == 6 and day <= 20):
        return "Gemini"
    elif (month == 6 and day >= 21) or (month == 7 and day <= 22):
        return "Cancer"
    elif (month == 7 and day >= 23) or (month == 8 and day <= 22):
        return "Leo"
    elif (month == 8 and day >= 23) or (month == 9 and day <= 22):
        return "Virgo"
    elif (month == 9 and day >= 23) or (month == 10 and day <= 22):
        return "Libra"
    elif (month == 10 and day >= 23) or (month == 11 and day <= 21):
        return "Scorpio"
    elif (month == 11 and day >= 22) or (month == 12 and day <= 21):
        return "Sagittarius"
    elif (month == 12 and day >= 22) or (month == 1 and day <= 19):
        return "Capricorn"
    elif (month == 1 and day >= 20) or (month == 2 and day <= 18):
        return "Aquarius"
    else:
        return "Pisces"

def getLanguageForClaude(iso_code):
    """Convert ISO language code to Claude-friendly language name"""
    language_map = {
        'ka': 'Georgian',
        'ru': 'Russian',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'zh': 'Chinese',
        'ja': 'Japanese',
        'ko': 'Korean',
        'en': 'English'
    }
    return language_map.get(iso_code, 'English')

def get_card_image_path(image_path):
    """Ensure consistent image path format"""
    if not image_path:
        return '/static/images/cards/default.jpg'
    return f'/static/images/cards/{image_path.split("/")[-1]}'

def get_single_card_reading(name, zodiac_sign, language='en'):
    """Generate single card reading"""
    try:
        selected_card = get_random_cards(1)[0]
        current_date = datetime.now()
        
        prompt = f"""Create a personalized daily tarot reading in {getLanguageForClaude(language)} for {name}, 
        who is a {zodiac_sign}.

        Critical Instructions:
        1. Respond ENTIRELY in {getLanguageForClaude(language)}
        2. Format the reading with these exact markers:

        [CARD_READING]
        Card interpretation connecting with their {zodiac_sign} path
        [/CARD_READING]

        [NUMEROLOGY_INSIGHT]
        Connect numerology with their zodiac energy
        [/NUMEROLOGY_INSIGHT]

        [DAILY_AFFIRMATION]
        A powerful daily affirmation in {getLanguageForClaude(language)}
        [/DAILY_AFFIRMATION]

        The card drawn is: {selected_card['name']}
        Key themes: {', '.join(selected_card['keywords'])}
        
        Keep each section mystical yet practical, entirely in {getLanguageForClaude(language)}."""

        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}]
        )

        return {
            "cardName": selected_card['name'],
            "cardImage": get_card_image_path(selected_card['image']),
            "interpretation": response.content[0].text
        }

    except Exception as e:
        logger.error(f"Error in single card reading: {e}")
        
        # Fallback response when API fails
        return {
            "cardName": "The Star",
            "cardImage": "/static/images/cards/star.jpg",
            "interpretation": f"""[CARD_READING]
The Star shines upon your path, bringing hope and renewal. Trust that you are being guided toward healing and inspiration.
[/CARD_READING]

[NUMEROLOGY_INSIGHT]
Today's energy encourages reflection and spiritual connection. Listen to your inner wisdom.
[/NUMEROLOGY_INSIGHT]

[DAILY_AFFIRMATION]
I trust the path that unfolds before me and welcome divine guidance.
[/DAILY_AFFIRMATION]"""
        }

def get_premium_reading(name, zodiac_sign, language, color=None, interests=None):
    """Generate three-card premium reading"""
    try:
        selected_cards = get_random_cards(3)
        positions = ['Past', 'Present', 'Future']
        
        cards_info = [
            f"{pos}: {card['name']} ({', '.join(card['keywords'])})"
            for pos, card in zip(positions, selected_cards)
        ]

        # Language-specific position labels
        position_labels = {
            'ka': ['წარსული', 'აწმყო', 'მომავალი'],
            'ru': ['Прошлое', 'Настоящее', 'Будущее'],
            'es': ['Pasado', 'Presente', 'Futuro'],
        }.get(language, positions)

        # Format personal details section
        personal_details = f"Their zodiac sign is {zodiac_sign}"
        if color and isinstance(color, dict):
            personal_details += f", and their chosen color is {color.get('name', '')} ({color.get('value', '')})"
        if interests and isinstance(interests, list) and len(interests) > 0:
            personal_details += f". They are interested in: {', '.join(interests)}"

        prompt = f"""You are creating a personalized premium three-card tarot reading for {name}.
        
        Personal Details: {personal_details}

        Critical Instructions:
        1. Respond ENTIRELY in {getLanguageForClaude(language)} language
        2. Use proper grammar and natural phrasing
        3. Maintain a mystical yet professional tone
        4. Format using these exact markers:
        [PAST] for {position_labels[0]}
        [PRESENT] for {position_labels[1]}
        [FUTURE] for {position_labels[2]}
        5. Incorporate their color preference and interests into the interpretation when relevant
        6. Connect the cards' meanings to their personal interests and traits

        The cards drawn are:
        {' | '.join(cards_info)}

        Provide a cohesive reading that connects past, present, and future."""

        logger.info(f"Sending premium reading request for {name} with personal details")
        
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2048,
            messages=[{"role": "user", "content": prompt}]
        )

        interpretation = response.content[0].text
        
        return {
            "cards": [get_card_image_path(card['image']) for card in selected_cards],
            "cardNames": [card['name'] for card in selected_cards],
            "interpretation": interpretation
        }
        
    except Exception as e:
        logger.error(f"Error in premium reading generation: {e}")
        
        # Fallback reading
        return {
            "cards": ["/static/images/cards/star.jpg", 
                      "/static/images/cards/sun.jpg", 
                      "/static/images/cards/world.jpg"],
            "cardNames": ["The Star", "The Sun", "The World"],
            "interpretation": "The cosmic energies are currently realigning. Please try again later for your personalized reading."
        }

# API Debug endpoint
@app.route('/api/debug/routes', methods=['GET'])
def debug_routes():
    """Debug endpoint to list all registered routes"""
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append({
            "endpoint": rule.endpoint,
            "methods": list(rule.methods),
            "path": str(rule)
        })
    return jsonify(routes)

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    logger.error(f"404 Error: {request.url}")
    return jsonify({
        "error": "Endpoint not found",
        "url": request.url,
        "method": request.method
    }), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"500 Error: {str(error)}")
    return jsonify({
        "error": "Internal server error",
        "requestId": request.headers.get('X-Request-ID')
    }), 500

# CORS headers
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Admin-Key')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Handle preflight requests
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response

# Security headers middleware
@app.after_request
def add_security_headers(response):
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    return response

# Request logger for production monitoring
@app.before_request
def log_request_info():
    logger.info(f"""Request:
        Method: {request.method}
        Path: {request.path}
        IP: {request.remote_addr}
        User Agent: {request.user_agent}
        """)
    if request.is_json:
        logger.debug(f"JSON Body: {request.get_json()}")

# Health check endpoint for Cloud Run
@app.route('/health')
def health_check():
    try:
        # Check critical services
        api_status = "connected" if api_handler else "not configured"
        db_status = "connected" if db else "not configured"
        
        return jsonify({
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "services": {
                "api": api_status,
                "database": db_status
            }
        })
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return jsonify({
            "status": "unhealthy",
            "error": str(e)
        }), 500

# Register graceful shutdown handlers
def graceful_shutdown(signum, frame):
    logger.info("Received shutdown signal, shutting down gracefully...")
    # Cleanup resources, close connections, etc.
    sys.exit(0)

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8080))
    
    # Run without SSL for local development
    if os.getenv('FLASK_ENV') == 'development' or os.getenv('FLASK_DEBUG', 'False').lower() in ('true', '1', 't'):
        app.run(
            host='0.0.0.0',
            port=port,
            debug=True
        )
    else:
        # Use SSL in production
        app.run(
            host='0.0.0.0',
            port=port,
            debug=False,
            ssl_context='adhoc'
        )