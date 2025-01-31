import json
from datetime import datetime, timedelta
import logging
import os
from secrets import choice
from string import ascii_uppercase, digits

# Set up logging
logger = logging.getLogger(__name__)

# Get the project root directory
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
STORAGE_FILE = os.path.join(ROOT_DIR, 'data', 'promo_codes.json')

class PromoCodeManager:
    def __init__(self, storage_file='data/promo_codes.json'):
        self.storage_file = storage_file
        self.codes = {}
        self.load_codes()

    def load_codes(self):
        """Load promo codes from storage file"""
        try:
            os.makedirs(os.path.dirname(self.storage_file), exist_ok=True)
            if os.path.exists(self.storage_file):
                with open(self.storage_file, 'r') as f:
                    self.codes = json.load(f)
            else:
                self.codes = {}
                self.save_codes()
        except Exception as e:
            logger.error(f"Error loading promo codes: {e}")
            self.codes = {}

    def save_codes(self):
        """Save promo codes to storage file"""
        try:
            with open(self.storage_file, 'w') as f:
                json.dump(self.codes, f, indent=2)
        except Exception as e:
            logger.error(f"Error saving promo codes: {e}")

    def generate_code(self, duration_days=365):
        """Generate a new promo code"""
        code = ''.join(choice(ascii_uppercase + digits) for _ in range(8))
        expiry = datetime.utcnow() + timedelta(days=duration_days)
        
        self.codes[code] = {
            'expiry': expiry.isoformat(),
            'created_at': datetime.utcnow().isoformat(),
            'uses': 0,
            'is_active': True
        }
        
        self.save_codes()
        logger.info(f"Generated new promo code: {code}")
        return code

    def validate_code(self, code):
        """Validate a promo code and track usage"""
        if not code or code not in self.codes:
            return False, "Invalid code"
            
        code_data = self.codes[code]
        
        if not code_data['is_active']:
            return False, "Code is inactive"
            
        expiry = datetime.fromisoformat(code_data['expiry'])
        if expiry < datetime.utcnow():
            return False, "Code has expired"
            
        # Track usage
        code_data['uses'] += 1
        code_data['last_used'] = datetime.utcnow().isoformat()
        self.save_codes()
        
        logger.info(f"Promo code {code} used. Total uses: {code_data['uses']}")
        return True, "Valid code"

    def get_code_stats(self, code):
        """Get usage statistics for a code"""
        if code not in self.codes:
            return None
            
        code_data = self.codes[code]
        return {
            'uses': code_data['uses'],
            'created_at': code_data['created_at'],
            'last_used': code_data.get('last_used', None),
            'expiry': code_data['expiry'],
            'is_active': code_data['is_active']
        }

    def get_all_codes(self):
        """Get all promo codes and their stats"""
        return {
            code: {
                'uses': data['uses'],
                'created_at': data['created_at'],
                'expiry': data['expiry'],
                'is_active': data['is_active'],
                'last_used': data.get('last_used', 'Never')
            }
            for code, data in self.codes.items()
        }

    def deactivate_code(self, code):
        """Deactivate a promo code"""
        if code in self.codes:
            self.codes[code]['is_active'] = False
            self.save_codes()
            logger.info(f"Deactivated promo code: {code}")
            return True
        return False

# Create data directory if it doesn't exist
os.makedirs(os.path.join(ROOT_DIR, 'data'), exist_ok=True)

# Initialize the manager
promo_manager = PromoCodeManager(storage_file=STORAGE_FILE)