"""
Firebase database initialization and connection
"""
import firebase_admin
from firebase_admin import credentials, firestore
from functools import lru_cache
import logging

logger = logging.getLogger(__name__)


@lru_cache()
def get_firebase_app():
    """
    Initialize Firebase app (cached)
    """
    try:
        # Try to get existing app
        return firebase_admin.get_app()
    except ValueError:
        # Initialize new app
        cred = credentials.Certificate('./tarot-433417-81a148e4ac53.json')
        return firebase_admin.initialize_app(cred)


@lru_cache()
def get_db():
    """
    Get Firestore database client (cached)
    """
    try:
        app = get_firebase_app()
        db = firestore.client()
        logger.info("✅ Firebase connected successfully")
        return db
    except Exception as e:
        logger.error(f"❌ Firebase connection failed: {e}")
        raise


# Get database instance
db = get_db()