import logging
from flask import request, jsonify
from datetime import datetime
from google.cloud import firestore
import random

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import your NFC Firestore functions
from nfc_firestore import get_nfc_user, db

# Major Arcana cards for readings
MAJOR_ARCANA = [
    {"name": "The Fool", "image": "/static/images/cards/the_fool.jpg"},
    {"name": "The Magician", "image": "/static/images/cards/the_magician.jpg"},
    {"name": "The High Priestess", "image": "/static/images/cards/the_high_priestess.jpg"},
    {"name": "The Empress", "image": "/static/images/cards/the_empress.jpg"},
    {"name": "The Emperor", "image": "/static/images/cards/the_emperor.jpg"},
    {"name": "The Hierophant", "image": "/static/images/cards/the_hierophant.jpg"},
    {"name": "The Lovers", "image": "/static/images/cards/the_lovers.jpg"},
    {"name": "The Chariot", "image": "/static/images/cards/the_chariot.jpg"},
    {"name": "Strength", "image": "/static/images/cards/strength.jpg"},
    {"name": "The Hermit", "image": "/static/images/cards/the_hermit.jpg"},
    {"name": "Wheel of Fortune", "image": "/static/images/cards/wheel_of_fortune.jpg"},
    {"name": "Justice", "image": "/static/images/cards/justice.jpg"},
    {"name": "The Hanged Man", "image": "/static/images/cards/the_hanged_man.jpg"},
    {"name": "Death", "image": "/static/images/cards/death.jpg"},
    {"name": "Temperance", "image": "/static/images/cards/temperance.jpg"},
    {"name": "The Devil", "image": "/static/images/cards/the_devil.jpg"},
    {"name": "The Tower", "image": "/static/images/cards/the_tower.jpg"},
    {"name": "The Star", "image": "/static/images/cards/the_star.jpg"},
    {"name": "The Moon", "image": "/static/images/cards/the_moon.jpg"},
    {"name": "The Sun", "image": "/static/images/cards/the_sun.jpg"},
    {"name": "Judgement", "image": "/static/images/cards/judgement.jpg"},
    {"name": "The World", "image": "/static/images/cards/the_world.jpg"}
]

def three_card_reading_endpoint():
    """Handles requests for three card tarot readings"""
    try:
        data = request.get_json()
        
        if not data or not data.get('nfc_id'):
            return jsonify({"error": "Missing nfc_id"}), 400
            
        nfc_id = data.get('nfc_id')
        
        # Get user data
        user_response, status_code = get_nfc_user(nfc_id)
        
        if status_code != 200:
            return jsonify(user_response), status_code
            
        user_data = user_response.get('user_data', {})
        
        # Check if the user has done a three-card reading today already
        today = datetime.now().strftime('%Y-%m-%d')
        user_ref = db.collection('nfc_users').document(nfc_id)
        
        # Check for existing three-card reading today
        existing_reading = user_ref.collection('three_card_readings').document(today).get()
        
        # If there's an existing reading, return it
        if existing_reading.exists:
            reading_data = existing_reading.to_dict()
            logger.info(f"Returning existing three-card reading for {nfc_id}")
            return jsonify({
                "success": True,
                "data": reading_data
            }), 200
        
        # Generate new three-card reading
        selected_cards = random.sample(MAJOR_ARCANA, 3)
        card_images = [card["image"] for card in selected_cards]
        card_names = [card["name"] for card in selected_cards]
        
        # Get user preferences for personalization
        name = user_data.get('user_data', {}).get('name', '')
        zodiac_sign = user_data.get('user_data', {}).get('zodiacSign', '')
        
        # Generate a basic interpretation (in a real app, you'd likely use Claude API here)
        interpretation = generate_three_card_interpretation(card_names, name, zodiac_sign)
        
        # Create reading data
        reading_data = {
            "date": today,
            "cards": card_images,
            "cardNames": card_names,
            "interpretation": interpretation,
            "positions": ["Past", "Present", "Future"],
            "timestamp": firestore.SERVER_TIMESTAMP
        }
        
        # Save reading to Firestore
        user_ref.collection('three_card_readings').document(today).set(reading_data)
        
        # Return the reading
        return jsonify({
            "success": True,
            "data": reading_data
        }), 200
        
    except Exception as e:
        logger.error(f"Error in three_card_reading: {str(e)}")
        return jsonify({"error": f"Error generating three-card reading: {str(e)}"}), 500
        
def generate_three_card_interpretation(card_names, name, zodiac_sign):
    """Generate a basic interpretation for the three cards"""
    # Simple template-based interpretation
    past_card = card_names[0]
    present_card = card_names[1]
    future_card = card_names[2]
    
    # Simple interpretations for each position
    past_interpretations = {
        "The Fool": "Your past was marked by new beginnings and taking leaps of faith.",
        "The Magician": "In your past, you discovered your ability to manifest and create.",
        "The High Priestess": "Your past was influenced by intuition and hidden knowledge.",
        "The Empress": "Your past was abundant with creativity and nurturing energy.",
        "The Emperor": "Structure and authority were significant themes in your past.",
        "The Hierophant": "Tradition and spiritual guidance played important roles in your past.",
        "The Lovers": "Important relationships and choices defined your past.",
        "The Chariot": "You've overcome obstacles through determination in your past.",
        "Strength": "Inner courage and resilience were your past foundations.",
        "The Hermit": "Your past involved periods of introspection and seeking wisdom.",
        "Wheel of Fortune": "Your past was marked by significant turning points and cycles.",
        "Justice": "Truth and fairness were important themes in your past decisions.",
        "The Hanged Man": "Your past required sacrifice and new perspectives.",
        "Death": "Significant transformations and endings occurred in your past.",
        "Temperance": "Balance and moderation were key lessons from your past.",
        "The Devil": "Your past contained challenges with attachments or limitations.",
        "The Tower": "Sudden revelations or changes disrupted your past foundations.",
        "The Star": "Hope and inspiration were guiding lights in your past.",
        "The Moon": "Your past held mysteries and subconscious patterns.",
        "The Sun": "Joy and success illuminated periods of your past.",
        "Judgement": "Your past involved awakening to important truths.",
        "The World": "Your past included significant completions and accomplishments."
    }
    
    present_interpretations = {
        "The Fool": "You're currently at the beginning of an exciting new journey.",
        "The Magician": "You currently possess all the tools you need for success.",
        "The High Priestess": "Your intuition is particularly strong in your present situation.",
        "The Empress": "Creativity and abundance are flowing in your present.",
        "The Emperor": "Structure and leadership are key themes in your present.",
        "The Hierophant": "You're currently seeking wisdom through established channels.",
        "The Lovers": "Important relationships and choices face you in the present.",
        "The Chariot": "You're currently moving forward with determination.",
        "Strength": "Your inner strength is being tested in your current situation.",
        "The Hermit": "This is a time for introspection and inner guidance.",
        "Wheel of Fortune": "You're in the midst of significant change and turning points.",
        "Justice": "Balance and fairness are central to your present situation.",
        "The Hanged Man": "Your present requires patience and a new perspective.",
        "Death": "You're in the midst of a profound transformation.",
        "Temperance": "Finding balance is your current challenge and opportunity.",
        "The Devil": "You're currently facing attachments or limitations to overcome.",
        "The Tower": "Unexpected revelations are shaking your current foundations.",
        "The Star": "Hope and inspiration are guiding your present path.",
        "The Moon": "Your present involves navigating uncertainty and hidden factors.",
        "The Sun": "Joy and clarity illuminate your present circumstances.",
        "Judgement": "You're experiencing an awakening in your present situation.",
        "The World": "You're reaching completion and integration in your current phase."
    }
    
    future_interpretations = {
        "The Fool": "New adventures and possibilities await in your future.",
        "The Magician": "You'll soon have opportunities to manifest your desires.",
        "The High Priestess": "Deeper wisdom and intuition will guide your future.",
        "The Empress": "Creativity and abundance will flourish in your future.",
        "The Emperor": "Structure and authority will be important in your path ahead.",
        "The Hierophant": "Traditional wisdom will provide guidance in your future.",
        "The Lovers": "Significant relationships and choices lie in your future.",
        "The Chariot": "Progress and victory are indicated in your future.",
        "Strength": "Inner courage will be your ally in challenges to come.",
        "The Hermit": "A period of meaningful solitude and wisdom-seeking approaches.",
        "Wheel of Fortune": "Destiny brings important changes to your future.",
        "Justice": "Fair outcomes and balance will manifest in your future.",
        "The Hanged Man": "Your future will bring valuable new perspectives.",
        "Death": "Transformative endings and beginnings await in your future.",
        "Temperance": "Harmony and balanced integration lie ahead.",
        "The Devil": "You'll face and overcome limitations in your future.",
        "The Tower": "Sudden revelations will create new opportunities ahead.",
        "The Star": "Hope and renewal will light your future path.",
        "The Moon": "The mysteries of your path will gradually be revealed.",
        "The Sun": "Success and joy await in your future.",
        "Judgement": "A powerful awakening or calling lies ahead.",
        "The World": "You're approaching a significant completion and achievement."
    }
    
    # Get interpretations with fallbacks
    past_meaning = past_interpretations.get(past_card, "Your past laid the foundation for your current journey.")
    present_meaning = present_interpretations.get(present_card, "Your present situation is revealing important insights.")
    future_meaning = future_interpretations.get(future_card, "Your future holds promising developments and opportunities.")
    
    # Combine into complete reading with personalization
    reading = f"Dear {name}, your three-card reading reveals important insights across the timeline of your journey.\n\n"
    reading += f"For your past, {past_card} shows that {past_meaning}\n\n"
    reading += f"In your present situation, {present_card} indicates that {present_meaning}\n\n"
    reading += f"Looking toward your future, {future_card} suggests that {future_meaning}\n\n"
    
    if zodiac_sign:
        reading += f"As a {zodiac_sign}, this reading is particularly significant because it highlights your natural "
        
        if zodiac_sign in ["Aries", "Leo", "Sagittarius"]:
            reading += "fiery energy and passion, which can help you transform challenges into opportunities for growth."
        elif zodiac_sign in ["Taurus", "Virgo", "Capricorn"]:
            reading += "grounded nature and practicality, which serve as valuable assets on your journey."
        elif zodiac_sign in ["Gemini", "Libra", "Aquarius"]:
            reading += "intellectual curiosity and adaptability, which allow you to see multiple perspectives."
        elif zodiac_sign in ["Cancer", "Scorpio", "Pisces"]:
            reading += "emotional intuition and sensitivity, which deepen your connection to the messages in these cards."
    
    reading += "\n\nRemember that you have the power to shape your destiny. These cards offer guidance, but your choices determine your path."
    
    return reading