import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import unittest
from unittest.mock import Mock, patch
from datetime import datetime, timedelta
from flask import Flask
from google.cloud import firestore

# Import your custom classes
from static.src.api.nfc_validation import NFCValidation
from static.src.api.nfc_rate_limiter import NFCRateLimiter
from static.src.api.nfc_cache import NFCReadingCache
from static.src.api.nfc_monitoring import NFCMonitor

# For mocking Firestore timestamp
class MockTimestamp:
    def __init__(self, dt):
        self._dt = dt
    
    def timestamp(self):
        return self._dt.timestamp()

class TestNFCValidation(unittest.TestCase):
    def setUp(self):
        self.mock_db = Mock()
        self.validator = NFCValidation(self.mock_db)
    
    def test_poster_validation(self):
    # Mock Firestore document
        mock_doc = Mock()
        mock_doc.exists = True
        mock_doc.to_dict.return_value = {
            'is_registered': False,
            'nfc_programmed': True
        }
        
        self.mock_db.collection().document().get.return_value = mock_doc
        
        # Test valid poster
        is_valid, error_msg, poster_data = self.validator.validate_poster_registration('12345678')
        self.assertTrue(is_valid)
        self.assertIsNone(error_msg)
        
        # Test already registered poster
        mock_doc.to_dict.return_value = {
            'is_registered': True,
            'registration_date': datetime.now(),  # This needs to be a Firestore timestamp
            'registered_nfc_id': 'nfc_12345678'
        }
    
    # Mock the Firestore timestamp
        mock_timestamp = Mock()
        mock_timestamp.timestamp = Mock(return_value=datetime.now().timestamp())
        mock_doc.to_dict.return_value['registration_date'] = mock_timestamp
        
        is_valid, error_msg, _ = self.validator.validate_poster_registration('12345678')
        self.assertFalse(is_valid)
        self.assertIn("already been registered", error_msg)

class TestNFCRateLimiter(unittest.TestCase):
    def setUp(self):
        self.mock_db = Mock()
        self.rate_limiter = NFCRateLimiter(self.mock_db)
    
    def test_rate_limiting(self):
        # Mock recent attempts
        mock_attempts = []
        self.mock_db.collection().where().where().where().stream \
            .return_value = mock_attempts
        
        # Test within limits
        is_allowed, error_msg = self.rate_limiter.check_rate_limit(
            'nfc_123', 'daily_reading'
        )
        self.assertTrue(is_allowed)
        self.assertIsNone(error_msg)
        
        # Test exceeding limits
        mock_attempts = [Mock() for _ in range(5)]  # Max attempts
        self.mock_db.collection().where().where().where().stream \
            .return_value = mock_attempts
            
        is_allowed, error_msg = self.rate_limiter.check_rate_limit(
            'nfc_123', 'daily_reading'
        )
        self.assertFalse(is_allowed)
        self.assertIn("Rate limit exceeded", error_msg)

class TestNFCCache(unittest.TestCase):
    def setUp(self):
        self.mock_db = Mock()
        self.cache = NFCReadingCache(self.mock_db)
    
    def test_cache_operations(self):
        # Mock user document
        mock_user_doc = Mock()
        mock_user_doc.exists = True
        mock_user_doc.to_dict.return_value = {
            'last_reading_date': datetime.now().isoformat()
        }
        
        self.mock_db.collection().document().get.return_value = mock_user_doc
        
        # Test cache retrieval
        mock_reading_doc = Mock()
        mock_reading_doc.exists = True
        mock_reading_doc.to_dict.return_value = {
            'affirmation': 'Test affirmation',
            'cardImage': 'test.jpg',
            'interpretation': 'Test interpretation'
        }
        
        self.mock_db.collection().document().collection().document().get \
            .return_value = mock_reading_doc
            
        cached_reading = self.cache.get_cached_reading('nfc_123')
        self.assertIsNotNone(cached_reading)
        self.assertEqual(cached_reading['affirmation'], 'Test affirmation')

class TestIntegration(unittest.TestCase):
    def setUp(self):
        self.app = create_test_app()
        self.client = self.app.test_client()
        
    def test_daily_reading_flow(self):
        # Test complete daily reading flow
        test_data = {
            'userData': {
                'nfc_id': 'nfc_123',
                'name': 'Test User',
                'zodiacSign': 'Aries',
                'language': 'en',
                'preferences': {
                    'numbers': {
                        'favoriteNumber': '7',
                        'luckyNumber': '3',
                        'guidanceNumber': '9'
                    },
                    'color': {
                        'name': 'Cosmic Purple',
                        'value': '#A59AD1'
                    },
                    'interests': ['Love', 'Career']
                }
            }
        }
        
        response = self.client.post(
            '/api/nfc/daily_affirmation',
            json=test_data
        )
        
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data['success'])
        self.assertIn('data', data)
        self.assertIn('affirmation', data['data'])

def create_test_app():
    """Create Flask app for testing"""
    app = Flask(__name__)
    app.config['TESTING'] = True
    
    # Register routes with test dependencies
    test_db = Mock()  # Mock Firestore
    test_monitor = NFCMonitor(test_db)
    test_validator = NFCValidation(test_db)
    
    # Import from correct location
    from static.src.api.nfc_routes import nfc_routes
    
    # Register the blueprint directly
    app.register_blueprint(nfc_routes, url_prefix='/api/nfc')
    
    return app

if __name__ == '__main__':
    unittest.main()