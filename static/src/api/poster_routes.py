from flask import Blueprint, request, jsonify
import logging
from .poster_manager import PosterManager

logger = logging.getLogger(__name__)

def init_poster_routes(db):
    poster_routes = Blueprint('poster_routes', __name__)
    poster_manager = PosterManager(db)

    @poster_routes.route('/api/posters/create', methods=['POST'])
    async def create_poster():
        try:
            data = request.get_json()
            location = data.get('location')
            notes = data.get('notes')
            
            result = await poster_manager.create_poster(location, notes)
            
            if result['success']:
                return jsonify(result)
            return jsonify(result), 400
            
        except Exception as e:
            logger.error(f"Error in create_poster: {str(e)}")
            return jsonify({'error': str(e)}), 500

    @poster_routes.route('/api/posters/verify', methods=['POST'])
    async def verify_poster():
        try:
            data = request.get_json()
            code = data.get('code')
            
            if not code:
                return jsonify({'error': 'No poster code provided'}), 400
                
            result = await poster_manager.verify_poster(code)
            
            if result['success']:
                return jsonify(result)
            return jsonify(result), 400
            
        except Exception as e:
            logger.error(f"Error in verify_poster: {str(e)}")
            return jsonify({'error': str(e)}), 500

    @poster_routes.route('/api/posters/deactivate', methods=['POST'])
    async def deactivate_poster():
        try:
            data = request.get_json()
            code = data.get('code')
            
            if not code:
                return jsonify({'error': 'No poster code provided'}), 400
                
            result = await poster_manager.deactivate_poster(code)
            
            if result['success']:
                return jsonify(result)
            return jsonify(result), 400
            
        except Exception as e:
            logger.error(f"Error in deactivate_poster: {str(e)}")
            return jsonify({'error': str(e)}), 500

    @poster_routes.route('/api/posters/stats', methods=['GET'])
    async def get_poster_stats():
        try:
            code = request.args.get('code')
            result = await poster_manager.get_poster_stats(code)
            
            if result['success']:
                return jsonify(result)
            return jsonify(result), 400
            
        except Exception as e:
            logger.error(f"Error in get_poster_stats: {str(e)}")
            return jsonify({'error': str(e)}), 500

    return poster_routes