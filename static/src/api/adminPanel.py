# admin_routes_fixed.py
from flask import Blueprint, request, jsonify
import os
import logging
from datetime import datetime
import random
import string

logger = logging.getLogger(__name__)

def init_admin_routes(db, nfc_monitor=None):
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
        """
        Admin endpoint for managing poster codes
        - Generate new poster codes
        - List existing poster codes
        - Delete unused poster codes
        """
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
            logger.info(f"Admin poster management: {action}")
            
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
                    'created_at': datetime.now(),
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
                    "data": poster_data
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
            
    @admin_routes.route('/delete_code', methods=['POST'])
    def delete_nfc_code():
        """Delete an NFC code"""
        try:
            # Verify admin key
            admin_key = os.getenv('ADMIN_KEY', '29isthenewOne')
            if request.headers.get('X-Admin-Key') != admin_key:
                return jsonify({"error": "Unauthorized"}), 401

            data = request.get_json()
            nfc_id = data.get('nfc_id')

            if not nfc_id:
                return jsonify({
                    "success": False,
                    "error": "No NFC ID provided"
                }), 400

            # Delete NFC user data
            nfc_ref = db.collection('nfc_users').document(nfc_id)
            if not nfc_ref.get().exists:
                return jsonify({
                    "success": False,
                    "error": "NFC code not found"
                }), 404

            nfc_ref.delete()

            # Delete associated readings
            readings_ref = db.collection('nfc_readings').where('nfc_id', '==', nfc_id)
            for reading in readings_ref.stream():
                reading.reference.delete()

            return jsonify({
                "success": True,
                "message": f"NFC code {nfc_id} and associated data deleted successfully"
            })

        except Exception as e:
            logger.error(f"Error deleting NFC code: {e}")
            return jsonify({
                "success": False,
                "error": str(e)
            }), 500
    
    return admin_routes