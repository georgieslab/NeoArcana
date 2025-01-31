from google.cloud import firestore
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta

# Load environment variables
if os.getenv('GAE_ENV', '').startswith('standard'):
    project_id = os.getenv('GOOGLE_CLOUD_PROJECT')
else:
    load_dotenv()
    project_id = os.getenv('PROJECT_ID')

# Initialize Firestore client
db = firestore.Client(project=project_id)

def signup_user(email):
    """Sign up a new user"""
    try:
        users_ref = db.collection('users')
        
        # Check if user exists
        existing_users = users_ref.where('email', '==', email).get()
        if len(list(existing_users)) > 0:
            return {"error": "User already exists"}, 400
        
        # Create new user document
        new_user = users_ref.document(email)
        new_user.set({
            'email': email,
            'signup_date': firestore.SERVER_TIMESTAMP,
            'is_premium': False,
            'reading_count': 0,
            'last_reading': None
        })

        return {"message": "User signed up successfully"}, 200
    except Exception as e:
        print(f"Error in signup_user: {str(e)}")
        return {"error": "An error occurred during signup"}, 500

def save_reading(email, reading_data):
    """Save a reading to user's history"""
    try:
        # Get user document
        user_ref = db.collection('users').document(email)
        user = user_ref.get()

        if not user.exists:
            return {"error": "User not found"}, 404

        # Create reading document
        reading_ref = db.collection('readings').document()
        reading_ref.set({
            'user_email': email,
            'card_name': reading_data.get('cardName'),
            'interpretation': reading_data.get('interpretation'),
            'affirmation': reading_data.get('affirmations')[0],
            'created_at': firestore.SERVER_TIMESTAMP,
            'zodiac_sign': reading_data.get('zodiacSign'),
            'chat_history': []
        })

        # Update user's reading count and last reading
        user_ref.update({
            'reading_count': firestore.Increment(1),
            'last_reading': reading_ref.id
        })

        return {"message": "Reading saved successfully"}, 200
    except Exception as e:
        print(f"Error in save_reading: {str(e)}")
        return {"error": "An error occurred saving the reading"}, 500

def check_premium_status(email):
    """Check if user has premium access"""
    try:
        user_ref = db.collection('users').document(email)
        user = user_ref.get()

        if not user.exists:
            return {"error": "User not found"}, 404

        user_data = user.to_dict()
        
        # Get premium subscription if exists
        premium_ref = db.collection('premium_subscriptions').document(email)
        premium = premium_ref.get()

        if not premium.exists:
            return {
                "is_premium": False,
                "message": "No premium subscription found"
            }, 200

        premium_data = premium.to_dict()
        is_active = premium_data.get('end_date', datetime.now()) > datetime.now()

        return {
            "is_premium": is_active,
            "subscription": premium_data
        }, 200

    except Exception as e:
        print(f"Error in check_premium_status: {str(e)}")
        return {"error": "Error checking premium status"}, 500

def save_chat_message(email, reading_id, message_data):
    """Save a chat message to a reading's history"""
    try:
        # Verify premium status
        premium_status, _ = check_premium_status(email)
        if not premium_status.get("is_premium"):
            return {"error": "Premium subscription required"}, 403

        reading_ref = db.collection('readings').document(reading_id)
        reading = reading_ref.get()

        if not reading.exists:
            return {"error": "Reading not found"}, 404

        # Add message to chat history
        reading_ref.update({
            'chat_history': firestore.ArrayUnion([{
                'timestamp': firestore.SERVER_TIMESTAMP,
                'message': message_data.get('message'),
                'response': message_data.get('response')
            }])
        })

        return {"message": "Chat message saved successfully"}, 200
    except Exception as e:
        print(f"Error in save_chat_message: {str(e)}")
        return {"error": "Error saving chat message"}, 500