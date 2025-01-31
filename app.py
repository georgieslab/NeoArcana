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
import datetime
import time
import sys
from flask.cli import with_appcontext
import click
from flask import send_from_directory

# Load environment variables first
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__, static_folder='static', template_folder='templates')

# Production configuration
#

# Import Firebase and initialize db
from static.src.api.firebase_init import db

# Import and initialize monitoring and validation
from static.src.api.nfc_monitoring import NFCMonitor
from static.src.api.nfc_validation import NFCValidation
nfc_monitor = NFCMonitor(db)
nfc_validator = NFCValidation(db)

from static.src.api.nfc_rate_limiter import NFCRateLimiter
rate_limiter = NFCRateLimiter(db)

# Import and initialize admin routes
from static.src.api.admin_routes import init_admin_routes
admin_routes = init_admin_routes(db, nfc_monitor)

# Import other API modules
from static.src.api.claude_tarot_api import api_handler
from static.src.api.firestore_signup import signup_user, save_reading, check_premium_status, save_chat_message
from static.src.api.nfc_routes import nfc_routes  # Import the existing Blueprint

# Register blueprints
app.register_blueprint(admin_routes, url_prefix='/api/admin')

# Import and register blueprints
from static.src.api.nfc_routes import nfc_routes
app.register_blueprint(nfc_routes, url_prefix='/api/nfc')

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
# Also add this route to handle the old URL format
@app.route('/')
def index():
    """Handle root route with optional poster code"""
    poster_code = request.args.get('posterCode')
    
    if poster_code:
        # Redirect to /nfc with the poster code
        return redirect(url_for('handle_nfc', posterCode=poster_code))
    
    return render_template('react.html')

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

def add_user_data(name, email, birthday, preferences=None):
    """
    Function to add user data to Firestore.
    Args:
        name (str): User's name
        email (str): User's email
        birthday (str): User's birthday (in YYYY-MM-DD format)
        preferences (dict, optional): Additional preferences (like goals, mood, etc.)
    """
    user_data = {
        "name": name,
        "email": email,
        "birthday": birthday,
        "preferences": preferences,
        "created_at": datetime.datetime.now(),
    }
    
    db.collection("users").add(user_data)
    print(f"User data for {name} added to Firestore successfully!")

add_user_data(name="Georgie A.", email="georgieslab@gmail.com", birthday="1994-10-09")



def generate_affirmation(user_data):
    """
    Generate a personalized affirmation for the user.
    Args:
        user_data (dict): The user's data retrieved from Firestore.
    Returns:
        str: The generated affirmation.
    """
    zodiac_sign = get_zodiac_sign(user_data["birthday"])
    affirmations = [
        "Today is a day full of possibilities, embrace it with confidence, {}!".format(user_data["name"]),
        "The universe supports your journey, trust your path, {}!".format(user_data["name"]),
        "Breathe deeply, {}. Your potential is limitless.".format(user_data["name"])
    ]
    
    return random.choice(affirmations)


def get_zodiac_sign(birthday):
    """
    Determine the zodiac sign based on the user's birthday.
    Args:
        birthday (str): User's birthday in YYYY-MM-DD format.
    Returns:
        str: The user's zodiac sign.
    """
    month, day = int(birthday.split("-")[1]), int(birthday.split("-")[2])
    if (month == 3 and day >= 21) or (month == 4 and day <= 19):
        return "Aries"
    # Include other zodiac sign calculations here.
    return "Unknown"

# Example Affirmation Generation
user_data_example = {
    "name": "Georgie A.",
    "birthday": "1994-10-09",
}
affirmation = generate_affirmation(user_data_example)
print(affirmation)

def cosmic_card_reveal_animation():
    """
    Display a cosmic-themed card reveal animation.
    """
    animation_frames = [
        "✨🌌 Preparing the cosmic energies... 🌌✨",
        "✨✨ The stars are aligning... ✨✨",
        "🌠🌠 A cosmic force surrounds your card... 🌠🌠",
        "💫💫 Magic sparkles fill the air... 💫💫",
        "🌟✨ The universe reveals your card... ✨🌟"
    ]
    for frame in animation_frames:
        sys.stdout.write("\r" + frame)
        sys.stdout.flush()
        time.sleep(1.5)
    sys.stdout.write("\n")


def reveal_card():
    """
    Reveal a tarot card with a cosmic animation.
    """
    # Step 1: Play cosmic-themed card reveal animation
    cosmic_card_reveal_animation()
    
    # Step 2: Reveal a card (for example, selecting a random card)
    tarot_cards = [
        "The Fool", "The Magician", "The High Priestess", "The Empress", 
        "The Emperor", "The Lovers", "The Chariot", "Strength", "The Hermit"
    ]
    revealed_card = random.choice(tarot_cards)
    
    # Step 3: Display the revealed card
    print(f"✨ Your card is: {revealed_card} ✨")

# Example Cosmic Animation during Card Reveal
reveal_card()

# Import API modules after Flask initialization
try:
    from static.src.api.claude_tarot_api import api_handler
    from static.src.api.tarot_cards import get_random_cards
    from static.src.api.promo_codes import promo_manager
    logger.info("API modules loaded successfully")
except ImportError as e:
    logger.error(f"Error importing API modules: {e}")
    raise

# Add debug logging
logger.info("Starting Tarot Application")
logger.info(f"API Handler Status: {api_handler is not None}")
logger.info(f"Debug Mode: {app.debug}")

# CORS headers
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Admin-Key')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

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
        
        response = api_handler.client.messages.create(
            model=api_handler.model,
            max_tokens=2048,
            messages=[{"role": "user", "content": prompt}]
        )

        interpretation = validate_reading_response(response.content[0].text, language)
        
        return {
            "cards": [get_card_image_path(card['image']) for card in selected_cards],
            "cardNames": [card['name'] for card in selected_cards],
            "interpretation": interpretation
        }
        
    except Exception as e:
        logger.error(f"Error in premium reading generation: {e}")
        raise

def get_single_card_reading(name, zodiac_sign, language):
    """Generate single card reading"""
    try:
        selected_card = get_random_cards(1)[0]

        prompt = f"""Create a single card tarot reading for {name}, a {zodiac_sign}.

        Critical Instructions:
        1. Respond ENTIRELY in {getLanguageForClaude(language)} language
        2. Use proper grammar and natural phrasing
        3. Maintain a mystical yet professional tone
        4. Focus on clear, practical guidance
        
        The card drawn is: {selected_card['name']}
        Key themes: {', '.join(selected_card['keywords'])}
        
        Provide a personal and meaningful interpretation that addresses their current situation."""

        response = api_handler.client.messages.create(
            model=api_handler.model,
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}]
        )

        interpretation = validate_reading_response(response.content[0].text, language)
        
        return {
            "cardName": selected_card['name'],
            "cardImage": get_card_image_path(selected_card['image']),
            "interpretation": interpretation
        }
        
    except Exception as e:
        logger.error(f"Error in single card reading: {e}")
        raise

def validate_reading_response(text, language):
    """Validate and clean up reading response"""
    # For Georgian, ensure proper script usage
    if language == 'ka':
        georgian_chars = set('აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰ')
        text_chars = set(text)
        if len(georgian_chars.intersection(text_chars)) < 10:
            logger.warning("Invalid Georgian response detected, retrying...")
            raise ValueError("Invalid language response")
            
    # Clean up any markdown or extra formatting
    text = text.strip()
    text = text.replace('```', '')
    
    return text

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
        
        if request.headers.get('X-Admin-Key') != os.getenv('ADMIN_KEY'):
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

@app.route('/api/promo_stats', methods=['GET'])
def get_promo_stats():
    if request.headers.get('X-Admin-Key') != os.getenv('ADMIN_KEY'):
        return jsonify({'error': 'Unauthorized'}), 401
        
    codes = promo_manager.get_all_codes()
    return jsonify(codes)

@app.route('/api/deactivate_code', methods=['POST'])
def deactivate_code():
    if request.headers.get('X-Admin-Key') != os.getenv('ADMIN_KEY'):
        return jsonify({'error': 'Unauthorized'}), 401
        
    code = request.json.get('code')
    if not code:
        return jsonify({'error': 'No code provided'}), 400
        
    success = promo_manager.deactivate_code(code)
    return jsonify({'success': success})

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
            date_obj = datetime.datetime.strptime(data['dateOfBirth'], '%Y-%m-%d')
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
    
@app.route('/add_user', methods=['POST'])
def add_user():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    birthday = data.get('birthday')
    preferences = data.get('preferences')

    user_data = {
        "name": name,
        "email": email,
        "birthday": birthday,
        "preferences": preferences,
        "created_at": datetime.datetime.now(),
    }

    db.collection("users").add(user_data)
    return jsonify({"message": f"User data for {name} added to Firestore successfully!"}), 201

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
                response = api_handler.client.messages.create(
                    model=api_handler.model,
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
            response = api_handler.client.messages.create(
                model=api_handler.model,
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
    
# In app.py
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
    }), 500

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# In app.py
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response

@app.route('/debug/routes', methods=['GET'])
def list_routes():
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append({
            "endpoint": rule.endpoint,
            "methods": list(rule.methods),
            "path": str(rule)
        })
    return jsonify(routes)

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

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    logger.warning(f"404 Error: {request.url}")
    return jsonify({
        "error": "Endpoint not found",
        "url": request.url,
        "method": request.method
    }), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"500 Error: {str(error)}", exc_info=True)
    return jsonify({
        "error": "Internal server error",
        "requestId": request.headers.get('X-Request-ID')
    }), 500

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

if __name__ == '__main__':
    # Get port from environment variable for Cloud Run
    port = int(os.getenv('PORT', 8080))
    
    # Production server configuration
    app.run(
        host='0.0.0.0',
        port=port,
        debug=False,  # Disable debug mode in production
        ssl_context='adhoc'  # Basic SSL support
    )