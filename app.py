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

# Front-end dist path
FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), 'frontend', 'dist'))

# Proxy all /api/ calls to FastAPI (for production on Render)
@app.route('/api/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
def api_proxy(path):
    """Proxy API calls to FastAPI backend with retry while booting"""
    fastapi_url = f'http://localhost:8000/api/{path}'
    
    try:
        # Handle OPTIONS (CORS preflight)
        if request.method == 'OPTIONS':
            response = jsonify({'status': 'ok'})
            response.headers.add('Access-Control-Allow-Origin', '*')
            response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
            response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
            return response
            
        # Forward the request to FastAPI with up to 4 retries for daemon boot
        import time
        for attempt in range(4):
            try:
                if request.method == 'POST':
                    resp = requests.post(
                        fastapi_url,
                        json=request.get_json(silent=True) or {},
                        headers={'Content-Type': 'application/json'},
                        timeout=60
                    )
                elif request.method == 'GET':
                    resp = requests.get(
                        fastapi_url,
                        params=request.args,
                        timeout=60
                    )
                elif request.method == 'PUT':
                    resp = requests.put(
                        fastapi_url,
                        json=request.get_json(silent=True) or {},
                        headers={'Content-Type': 'application/json'},
                        timeout=60
                    )
                elif request.method == 'DELETE':
                    resp = requests.delete(fastapi_url, timeout=60)
                
                # Exclude hop-by-hop headers
                excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
                headers = [(k, v) for k, v in resp.raw.headers.items() if k.lower() not in excluded_headers]
                return (resp.content, resp.status_code, headers)
            except requests.exceptions.ConnectionError:
                if attempt < 3:
                    time.sleep(1)
                    continue
                raise
        
    except Exception as e:
        print(f"❌ Error proxying to FastAPI: {e}")
        return jsonify({"error": "API request failed", "details": str(e)}), 500

# Serve Vite build assets
@app.route('/assets/<path:path>')
def serve_assets(path):
    """Serve compiled Vite assets (JS, CSS chunks)"""
    assets_dir = os.path.join(FRONTEND_DIST, 'assets')
    if os.path.exists(assets_dir):
        return send_from_directory(assets_dir, path)
    return jsonify({"error": "Asset not found"}), 404

# Main page route
@app.route('/')
def index():
    """Serve the modern React application if built, fallback to legacy"""
    if os.path.exists(os.path.join(FRONTEND_DIST, 'index.html')):
        return send_from_directory(FRONTEND_DIST, 'index.html')
    return render_template('react.html')

# NFC registration route
@app.route('/nfc')
def nfc_registration():
    """NFC registration page"""
    if os.path.exists(os.path.join(FRONTEND_DIST, 'index.html')):
        return send_from_directory(FRONTEND_DIST, 'index.html')
    return render_template('react.html')

# Serve static files
@app.route('/static/<path:path>')
def serve_static(path):
    """Serve static files (JS, CSS, images)"""
    # Check frontend/dist/static first, then fallback to static/
    dist_static = os.path.join(FRONTEND_DIST, 'static')
    if os.path.exists(dist_static) and os.path.exists(os.path.join(dist_static, path)):
        return send_from_directory(dist_static, path)
    return send_from_directory('static', path)

# Health check
@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "neoarcana_server"
    })

# Catch-all for SPA client routing
@app.route('/<path:path>')
def spa_catch_all(path):
    if path.startswith(('api/', 'static/', 'assets/', 'health')):
        return jsonify({"error": "Not Found"}), 404
    file_path = os.path.join(FRONTEND_DIST, path)
    if os.path.isfile(file_path):
        return send_from_directory(FRONTEND_DIST, path)
    if os.path.exists(os.path.join(FRONTEND_DIST, 'index.html')):
        return send_from_directory(FRONTEND_DIST, 'index.html')
    return render_template('react.html')

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