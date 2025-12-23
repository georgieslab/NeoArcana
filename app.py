import os
from flask import Flask, render_template, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import subprocess
import threading
import requests
from flask import request, jsonify

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__, 
            static_folder='static',
            template_folder='templates')

# Enable CORS
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000", "http://localhost:8000", "http://localhost:5000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Start FastAPI in background (only on Render)
def start_fastapi():
    """Start FastAPI server on port 8000"""
    try:
        print("🚀 Starting FastAPI backend on port 8000...")
        subprocess.run([
            'uvicorn', 
            'api_v2.main:app', 
            '--host', '0.0.0.0',
            '--port', '8000'
        ])
    except Exception as e:
        print(f"❌ Error starting FastAPI: {e}")

# Start FastAPI in background when deployed to Render
if os.getenv('RENDER'):
    fastapi_thread = threading.Thread(target=start_fastapi, daemon=True)
    fastapi_thread.start()
    print("✅ FastAPI background thread started (Render deployment)")

# Proxy all /api/ calls to FastAPI (for production on Render)
@app.route('/api/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
def api_proxy(path):
    """Proxy API calls to FastAPI backend"""
    fastapi_url = f'http://localhost:8000/api/{path}'
    
    try:
        # Handle OPTIONS (CORS preflight)
        if request.method == 'OPTIONS':
            response = jsonify({'status': 'ok'})
            response.headers.add('Access-Control-Allow-Origin', '*')
            response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
            response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
            return response
            
        # Forward the request to FastAPI
        if request.method == 'POST':
            resp = requests.post(
                fastapi_url,
                json=request.get_json(),
                headers={'Content-Type': 'application/json'}
            )
        elif request.method == 'GET':
            resp = requests.get(
                fastapi_url,
                params=request.args
            )
        elif request.method == 'PUT':
            resp = requests.put(
                fastapi_url,
                json=request.get_json(),
                headers={'Content-Type': 'application/json'}
            )
        elif request.method == 'DELETE':
            resp = requests.delete(fastapi_url)
        
        # Return FastAPI's response
        return resp.json(), resp.status_code
        
    except Exception as e:
        print(f"❌ Error proxying to FastAPI: {e}")
        return {"error": "API request failed", "details": str(e)}, 500

# Main page route
@app.route('/')
def index():
    """Serve the main React application"""
    return render_template('react.html')

# NFC registration route
@app.route('/nfc')
def nfc_registration():
    """NFC registration page"""
    return render_template('react.html')

# Serve static files
@app.route('/static/<path:path>')
def serve_static(path):
    """Serve static files (JS, CSS, images)"""
    return send_from_directory('static', path)

# Health check
@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "flask_frontend"
    })

# CORS headers for all responses
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    
    print("=" * 60)
    print("🚀 NeoArcana Flask Frontend Server")
    print("=" * 60)
    print(f"📡 Server: http://localhost:{port}")
    print("✅ Serving React app and static files")
    print("🔗 API calls go to FastAPI on port 8000")
    print("📂 Templates: templates/react.html")
    print("📂 Static: static/")
    print("=" * 60)
    
    # Run Flask WITHOUT SSL for local development
    app.run(
        host='0.0.0.0',
        port=port,
        debug=False  # Set to False to avoid reloading issues
    )