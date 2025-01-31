import firebase_admin
from firebase_admin import credentials, firestore
import os
import json
import logging

logger = logging.getLogger(__name__)

def initialize_firebase():
    """Initialize Firebase with fallback options"""
    try:
        # First try: Use environment variable for credentials path
        cred_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
        if cred_path and os.path.exists(cred_path):
            logger.info("Using credentials file from environment variable")
            cred = credentials.Certificate(cred_path)
        else:
            # Second try: Use credentials JSON from environment variable
            cred_json = os.getenv('FIREBASE_CREDENTIALS')
            if cred_json:
                logger.info("Using credentials from environment variable JSON")
                try:
                    cred_dict = json.loads(cred_json)
                    cred = credentials.Certificate(cred_dict)
                except json.JSONDecodeError:
                    logger.error("Failed to parse FIREBASE_CREDENTIALS JSON")
                    return None
            else:
                # Final try: Use default credentials
                logger.info("Using default credentials")
                cred = credentials.ApplicationDefault()

        # Initialize Firebase
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        logger.info("Firebase initialized successfully")
        return db

    except Exception as e:
        logger.error(f"Failed to initialize Firebase: {str(e)}")
        return None

# Initialize database
db = initialize_firebase()