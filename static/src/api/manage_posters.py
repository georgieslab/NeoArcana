import os
import sys
from google.cloud import firestore
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Firestore
db = firestore.Client()

def add_valid_poster_code(poster_code, batch_info=None):
    """Add a valid poster code to the system"""
    try:
        valid_posters = db.collection('valid_posters')
        poster_data = {
            'poster_code': poster_code,
            'is_registered': False,
            'created_at': datetime.now(),
            'batch_info': batch_info,
            'nfc_programmed': True
        }
        valid_posters.document(poster_code).set(poster_data)
        return True
    except Exception as e:
        logger.error(f"Error adding valid poster code: {e}")
        return False

def add_initial_posters():
    poster_codes = [
        '09101994'  # The code you're testing with
    ]

    batch_info = {
        'batch': 'TEST_BATCH',
        'manufacturing_date': '2024-12-05',
        'production_location': 'Georgia'
    }

    for code in poster_codes:
        try:
            success = add_valid_poster_code(code, batch_info)
            if success:
                print(f"✨ Added poster code: {code}")
            else:
                print(f"❌ Failed to add poster code: {code}")
        except Exception as e:
            print(f"Error adding code {code}: {str(e)}")

if __name__ == "__main__":
    add_initial_posters()