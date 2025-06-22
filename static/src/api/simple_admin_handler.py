# simple_admin_handler.py
from flask import Blueprint, request, jsonify
import os
import logging
from datetime import datetime
import random
import string
from google.cloud import firestore

logger = logging.getLogger(__name__)

def init_simple_admin_routes(db):
    """Initialize simple, focused admin routes for poster management"""
    admin_routes = Blueprint('admin_routes', __name__)
    
    def generate_unique_poster_code(length=8):
        """Generate a unique 8-character poster code"""
        while True:
            # Generate a random 8-character code
            code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
            
            # Check if code exists
            poster_ref = db.collection('valid_posters').document(code)
            if not poster_ref.get().exists:
                return code
    
    @admin_routes.route('/posters', methods=['POST'])
    def manage_posters():
        """Endpoint for managing poster codes"""
        try:
            # Verify admin key
            admin_key = os.getenv('ADMIN_KEY', '29isthenewOne')  # Fallback to dev key
            if request.headers.get('X-Admin-Key') != admin_key:
                logger.warning("Unauthorized attempt to access admin endpoint")
                return jsonify({"error": "Unauthorized"}), 401
                
            data = request.get_json()
            if not data:
                return jsonify({"error": "No data provided"}), 400
                
            action = data.get('action')
            logger.info(f"Admin poster action: {action}")
            
            if action == 'add':
                # Generate a unique code if not provided
                poster_code = data.get('poster_code')
                if not poster_code:
                    poster_code = generate_unique_poster_code()
                
                # Create batch info from request data
                batch_info = data.get('batch_info', {})
                
                # Add the poster code
                poster_ref = db.collection('valid_posters').document(poster_code)
                poster_data = {
                    'created_at': firestore.SERVER_TIMESTAMP,
                    'is_registered': False,
                    'nfc_programmed': True,
                    'owner': batch_info.get('owner', ''),
                    'rebust': batch_info.get('rebust', ''),
                    'nfc_id': f"nfc_{poster_code}"
                }
                
                poster_ref.set(poster_data)
                logger.info(f"Successfully created poster with code: {poster_code}")
                
                return jsonify({
                    "success": True,
                    "poster_code": poster_code,
                    "data": {
                        **poster_data,
                        'created_at': datetime.now().isoformat()  # Add for response
                    }
                })
                    
            elif action == 'list':
                # List all valid poster codes
                valid_posters = db.collection('valid_posters').stream()
                posters = []
                for doc in valid_posters:
                    poster_data = doc.to_dict()
                    poster_data['poster_code'] = doc.id
                    posters.append(poster_data)
                
                return jsonify(posters)

            elif action == 'delete':
                # Delete a poster code if it's not registered
                poster_code = data.get('poster_code')
                if not poster_code:
                    return jsonify({
                        "success": False,
                        "error": "No poster code provided for deletion"
                    }), 400

                poster_ref = db.collection('valid_posters').document(poster_code)
                poster = poster_ref.get()
                
                if not poster.exists:
                    return jsonify({
                        "success": False,
                        "error": "Poster code not found"
                    }), 404
                    
                poster_data = poster.to_dict()
                if poster_data.get('is_registered'):
                    return jsonify({
                        "success": False,
                        "error": "Cannot delete a registered poster"
                    }), 400
                    
                poster_ref.delete()
                logger.info(f"Successfully deleted poster: {poster_code}")
                
                return jsonify({
                    "success": True,
                    "message": f"Poster {poster_code} deleted successfully"
                })
                    
            else:
                return jsonify({
                    "success": False,
                    "error": "Invalid action specified"
                }), 400
                
        except Exception as e:
            logger.error(f"Error in admin_manage_posters: {e}")
            return jsonify({
                "success": False,
                "error": str(e)
            }), 500
    
    @admin_routes.route('/test-user', methods=['POST'])
    def create_test_user():
        """Create a test user with code 091094"""
        try:
            # Verify admin key
            admin_key = os.getenv('ADMIN_KEY', '29isthenewOne')
            if request.headers.get('X-Admin-Key') != admin_key:
                return jsonify({"error": "Unauthorized"}), 401
            
            # Test user code
            test_code = "091094"
            nfc_id = f"nfc_{test_code}"
            
            # First, add the poster code
            poster_ref = db.collection('valid_posters').document(test_code)
            
            # Check if the poster already exists
            if poster_ref.get().exists:
                logger.info(f"Poster code {test_code} already exists")
            else:
                # Add the poster code
                poster_data = {
                    'poster_code': test_code,
                    'is_registered': True,
                    'created_at': datetime.now(),
                    'batch_info': {
                        'batch': 'TEST_BATCH',
                        'created_at': datetime.now().isoformat(),
                        'location': 'Georgia'
                    },
                    'nfc_programmed': True,
                    'registered_nfc_id': nfc_id
                }
                poster_ref.set(poster_data)
                logger.info(f"Added poster code: {test_code}")
            
            # Then, add the user data
            user_ref = db.collection('nfc_users').document(nfc_id)
            
            # Check if the user already exists
            if user_ref.get().exists:
                logger.info(f"User {nfc_id} already exists")
                return jsonify({
                    "success": True,
                    "message": "Test user already exists"
                })
            
            # Add the user data
            user_data = {
                'nfc_id': nfc_id,
                'poster_code': test_code,
                'registration_date': datetime.now().isoformat(),
                'user_data': {
                    'name': 'Test User',
                    'dateOfBirth': '1994-09-10',
                    'zodiacSign': 'Virgo',
                    'preferences': {
                        'color': {
                            'name': 'Cosmic Purple',
                            'value': '#A59AD1'
                        },
                        'numbers': {
                            'favoriteNumber': '9',
                            'luckyNumber': '10',
                            'guidanceNumber': '94'
                        },
                        'interests': ['Spirituality', 'Astrology', 'Meditation'],
                        'gender': 'other',
                        'language': 'en'
                    }
                },
                'last_reading_date': None,
                'status': 'active'
            }
            
            user_ref.set(user_data)
            logger.info(f"Added test user: {nfc_id}")
            
            return jsonify({
                "success": True,
                "message": "Test user created successfully",
                "nfc_id": nfc_id
            })
            
        except Exception as e:
            logger.error(f"Error creating test user: {str(e)}")
            return jsonify({
                "success": False,
                "error": str(e)
            }), 500
    
    return admin_routesa