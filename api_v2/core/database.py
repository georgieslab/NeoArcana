"""
Database configuration and initialization.
Handles Firebase connection and provides db instance.
"""
import os
import json
import firebase_admin
from firebase_admin import credentials, firestore

def get_firebase_app():
    """Initialize and return Firebase app."""
    try:
        return firebase_admin.get_app()
    except ValueError:
        # Try to get credentials from environment variable first
        firebase_creds = os.getenv('FIREBASE_CREDENTIALS')
        
        if firebase_creds:
            # Parse JSON from environment variable
            try:
                cred_dict = json.loads(firebase_creds)
                cred = credentials.Certificate(cred_dict)
                print("✅ Firebase credentials loaded from environment variable")
            except json.JSONDecodeError as e:
                print(f"❌ Failed to parse FIREBASE_CREDENTIALS JSON: {e}")
                # If it's a file path, use it directly
                if os.path.exists(firebase_creds):
                    cred = credentials.Certificate(firebase_creds)
                    print(f"✅ Firebase credentials loaded from file: {firebase_creds}")
                else:
                    raise ValueError(f"FIREBASE_CREDENTIALS is neither valid JSON nor a file path: {firebase_creds}")
        else:
            # Fallback to local file for development
            local_creds_path = './tarot-433417-81a148e4ac53.json'
            if os.path.exists(local_creds_path):
                cred = credentials.Certificate(local_creds_path)
                print(f"✅ Firebase credentials loaded from local file: {local_creds_path}")
            else:
                raise ValueError("No Firebase credentials found! Set FIREBASE_CREDENTIALS environment variable or provide local credentials file.")
        
        firebase_admin.initialize_app(cred)
        print("✅ Firebase app initialized successfully")
        return firebase_admin.get_app()

def get_db():
    """Get Firestore database instance."""
    try:
        app = get_firebase_app()
        db = firestore.client()
        print("✅ Firestore client connected successfully")
        return db
    except Exception as e:
        print(f"❌ Firebase connection failed: {e}")
        raise

# Initialize database connection at module level
db = get_db()