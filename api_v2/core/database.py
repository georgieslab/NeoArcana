import os
import json

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
            except json.JSONDecodeError:
                # If it's a file path, use it directly
                cred = credentials.Certificate(firebase_creds)
        else:
            # Fallback to local file for development
            cred = credentials.Certificate('./tarot-433417-81a148e4ac53.json')
        
        firebase_admin.initialize_app(cred)
        return firebase_admin.get_app()