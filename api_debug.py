# api_debug.py
import logging
from functools import wraps
from flask import request, jsonify
import json
import traceback

def debug_api(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        endpoint = request.endpoint
        method = request.method
        
        logger = logging.getLogger('api.debug')
        logger.info(f"\n{'='*50}")
        logger.info(f"API Call: {method} {endpoint}")
        
        # Log request data
        if method == 'GET':
            logger.info(f"Query Params: {dict(request.args)}")
        elif method in ['POST', 'PUT']:
            try:
                body = request.get_json()
                logger.info(f"Request Body: {json.dumps(body, indent=2)}")
            except Exception:
                logger.info(f"Raw Data: {request.get_data()}")
                
        try:
            response = f(*args, **kwargs)
            logger.info(f"Response: {response}")
            return response
        except Exception as e:
            logger.error(f"Error in {endpoint}: {str(e)}")
            logger.error(traceback.format_exc())
            return jsonify({"error": str(e)}), 500
            
    return decorated_function