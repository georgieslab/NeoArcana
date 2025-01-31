import firebase_admin
from firebase_admin import firestore
import secrets
import string
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class PosterManager:
    def __init__(self, db):
        self.db = db
        self.posters_ref = db.collection('posters')

    def generate_poster_code(self, length=8):
        """Generate a unique poster code"""
        characters = string.ascii_uppercase + string.digits
        while True:
            code = ''.join(secrets.choice(characters) for _ in range(length))
            # Check if code already exists
            existing = self.posters_ref.where('code', '==', code).limit(1).get()
            if not len(list(existing)):
                return code

    async def create_poster(self, location=None, notes=None):
        """Create a new poster with generated code"""
        try:
            code = self.generate_poster_code()
            poster_data = {
                'code': code,
                'created_at': datetime.now(),
                'location': location,
                'notes': notes,
                'is_active': True,
                'last_used': None,
                'use_count': 0
            }
            
            doc_ref = self.posters_ref.document()
            doc_ref.set(poster_data)
            
            logger.info(f"Created new poster with code: {code}")
            return {'success': True, 'code': code, 'id': doc_ref.id}
            
        except Exception as e:
            logger.error(f"Error creating poster: {str(e)}")
            return {'success': False, 'error': str(e)}

    async def verify_poster(self, code):
        """Verify a poster code and return poster data if valid"""
        try:
            docs = self.posters_ref.where('code', '==', code).where('is_active', '==', True).limit(1).get()
            
            for doc in docs:
                poster_data = doc.to_dict()
                # Update usage stats
                doc.reference.update({
                    'last_used': datetime.now(),
                    'use_count': poster_data.get('use_count', 0) + 1
                })
                return {'success': True, 'poster_id': doc.id, 'data': poster_data}
                
            return {'success': False, 'error': 'Invalid or inactive poster code'}
            
        except Exception as e:
            logger.error(f"Error verifying poster: {str(e)}")
            return {'success': False, 'error': str(e)}

    async def deactivate_poster(self, code):
        """Deactivate a poster"""
        try:
            docs = self.posters_ref.where('code', '==', code).limit(1).get()
            
            for doc in docs:
                doc.reference.update({
                    'is_active': False,
                    'deactivated_at': datetime.now()
                })
                return {'success': True}
                
            return {'success': False, 'error': 'Poster not found'}
            
        except Exception as e:
            logger.error(f"Error deactivating poster: {str(e)}")
            return {'success': False, 'error': str(e)}

    async def get_poster_stats(self, code=None):
        """Get usage statistics for posters"""
        try:
            if code:
                docs = self.posters_ref.where('code', '==', code).limit(1).get()
                for doc in docs:
                    return {'success': True, 'stats': doc.to_dict()}
                return {'success': False, 'error': 'Poster not found'}
            
            all_posters = []
            docs = self.posters_ref.order_by('created_at', direction=firestore.Query.DESCENDING).get()
            
            for doc in docs:
                poster_data = doc.to_dict()
                poster_data['id'] = doc.id
                all_posters.append(poster_data)
                
            return {'success': True, 'posters': all_posters}
            
        except Exception as e:
            logger.error(f"Error getting poster stats: {str(e)}")
            return {'success': False, 'error': str(e)}