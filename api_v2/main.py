"""
NeoArcana FastAPI - With Registration and Readings
"""
from dotenv import load_dotenv
load_dotenv()  # Load .env FIRST!

# NOW import everything else
from datetime import datetime
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
import logging
import random
import string

from api_v2.routes import registration, readings, chat
from api_v2.core.database import db
from api_v2.core.config import settings

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create app FIRST
app = FastAPI(
    title="NeoArcana API v2",
    description="✨ Modern async backend for mystical tarot readings with NFC integration",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    swagger_ui_parameters={
        "defaultModelsExpandDepth": -1,  # Hide schemas section by default
        "docExpansion": "none",  # Collapse all endpoints by default
        "filter": True,  # Add search filter
        "syntaxHighlight.theme": "monokai",  # Dark code theme
    }
)

# ============================================================================
# CORS MIDDLEWARE - CRITICAL FOR FRONTEND CONNECTION
# ============================================================================
# Add CORS immediately after app creation
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5000",      # Flask development server
        "http://127.0.0.1:5000",      # Flask alternative
        "http://localhost:3000",      # Future Vite/React dev server
        "http://127.0.0.1:3000",      # Vite alternative
        "https://app.neoarcana.cloud",
         "https://neoarcana-dmoy.onrender.com"
        # Add your production domain when ready
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


# ============================================================================
# CUSTOM SWAGGER UI WITH NEOARCANA COSMIC THEME
# ============================================================================
@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    """Custom Swagger UI with cosmic NeoArcana styling"""
    return HTMLResponse(f"""
    <!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css">
        <link rel="icon" type="image/png" href="/static/icons/icon-192x192.png">
        <title>NeoArcana API ✨</title>
        <style>
            /* NeoArcana Cosmic Theme */
            :root {{
                --primary-purple: #A59AD1;
                --primary-dark: #6B4E71;
                --primary-light: #CEC7F2;
                --accent-orange: #F4A261;
                --accent-gold: #FFD700;
                --bg-dark: #0a0a1f;
                --bg-darker: #1a1a2e;
            }}
            
            body {{
                background: linear-gradient(135deg, #0a0a1f 0%, #1a1a2e 50%, #2a1a3e 100%) !important;
                margin: 0;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            }}
            
            /* Topbar styling */
            .swagger-ui .topbar {{
                background: linear-gradient(135deg, var(--primary-purple), var(--primary-dark)) !important;
                padding: 20px 0;
                border-bottom: 2px solid var(--accent-gold);
                box-shadow: 0 4px 20px rgba(165, 154, 209, 0.3);
            }}
            
            .swagger-ui .topbar .download-url-wrapper {{
                display: none;
            }}
            
            /* Title styling */
            .swagger-ui .info .title {{
                color: var(--accent-gold) !important;
                font-size: 42px !important;
                font-weight: 700 !important;
                text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
                font-family: 'Georgia', serif;
            }}
            
            .swagger-ui .info .title::before {{
                content: "✨ ";
            }}
            
            .swagger-ui .info .title::after {{
                content: " 🔮";
            }}
            
            /* Description */
            .swagger-ui .info .description {{
                color: var(--primary-light) !important;
                font-size: 18px !important;
                line-height: 1.6;
            }}
            
            /* Main container */
            .swagger-ui .wrapper {{
                max-width: 1400px;
                margin: 0 auto;
                padding: 40px 20px;
            }}
            
            /* Operation blocks */
            .swagger-ui .opblock {{
                background: rgba(26, 26, 46, 0.8) !important;
                border: 2px solid var(--primary-purple) !important;
                border-radius: 12px !important;
                margin-bottom: 20px !important;
                box-shadow: 0 4px 15px rgba(165, 154, 209, 0.2) !important;
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;
            }}
            
            .swagger-ui .opblock:hover {{
                border-color: var(--accent-gold) !important;
                box-shadow: 0 6px 25px rgba(255, 215, 0, 0.3) !important;
                transform: translateY(-2px);
            }}
            
            /* Method badges */
            .swagger-ui .opblock.opblock-post {{
                border-left: 5px solid var(--accent-orange) !important;
            }}
            
            .swagger-ui .opblock.opblock-get {{
                border-left: 5px solid var(--primary-light) !important;
            }}
            
            .swagger-ui .opblock.opblock-put {{
                border-left: 5px solid var(--accent-gold) !important;
            }}
            
            /* HTTP method labels */
            .swagger-ui .opblock-summary-method {{
                background: linear-gradient(135deg, var(--primary-purple), var(--primary-dark)) !important;
                color: white !important;
                font-weight: 700 !important;
                border-radius: 8px !important;
                text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }}
            
            /* Endpoint paths */
            .swagger-ui .opblock-summary-path {{
                color: var(--primary-light) !important;
                font-family: 'Monaco', 'Courier New', monospace !important;
                font-weight: 600 !important;
            }}
            
            /* Description text */
            .swagger-ui .opblock-summary-description {{
                color: var(--primary-light) !important;
                font-style: italic;
            }}
            
            /* Tags */
            .swagger-ui .opblock-tag {{
                color: var(--accent-gold) !important;
                font-size: 24px !important;
                font-weight: 700 !important;
                border-bottom: 3px solid var(--primary-purple) !important;
                padding: 15px 0 !important;
                margin-bottom: 20px !important;
            }}
            
            /* Buttons */
            .swagger-ui .btn {{
                background: linear-gradient(135deg, var(--primary-purple), var(--primary-dark)) !important;
                color: white !important;
                border: none !important;
                border-radius: 8px !important;
                padding: 12px 24px !important;
                font-weight: 600 !important;
                box-shadow: 0 4px 15px rgba(165, 154, 209, 0.3) !important;
                transition: all 0.3s ease !important;
            }}
            
            .swagger-ui .btn:hover {{
                background: linear-gradient(135deg, var(--accent-gold), var(--accent-orange)) !important;
                box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4) !important;
                transform: translateY(-2px);
            }}
            
            .swagger-ui .btn.execute {{
                background: linear-gradient(135deg, var(--accent-orange), var(--accent-gold)) !important;
            }}
            
            /* Input fields */
            .swagger-ui input[type=text],
            .swagger-ui input[type=email],
            .swagger-ui textarea,
            .swagger-ui select {{
                background: rgba(26, 26, 46, 0.9) !important;
                border: 2px solid var(--primary-purple) !important;
                color: var(--primary-light) !important;
                border-radius: 8px !important;
            }}
            
            .swagger-ui input[type=text]:focus,
            .swagger-ui textarea:focus {{
                border-color: var(--accent-gold) !important;
                box-shadow: 0 0 10px rgba(255, 215, 0, 0.3) !important;
            }}
            
            /* Response blocks */
            .swagger-ui .responses-inner {{
                background: rgba(26, 26, 46, 0.6) !important;
                border: 1px solid var(--primary-purple) !important;
                border-radius: 8px !important;
                padding: 15px !important;
            }}
            
            /* Code blocks */
            .swagger-ui .highlight-code {{
                background: rgba(10, 10, 31, 0.9) !important;
                border: 1px solid var(--primary-purple) !important;
            }}
            
            .swagger-ui .microlight {{
                color: var(--primary-light) !important;
            }}
            
            /* Models section */
            .swagger-ui section.models {{
                background: rgba(26, 26, 46, 0.6) !important;
                border: 2px solid var(--primary-purple) !important;
                border-radius: 12px !important;
                padding: 20px !important;
            }}
            
            .swagger-ui section.models h4 {{
                color: var(--accent-gold) !important;
            }}
            
            /* Authorization button */
            .swagger-ui .authorization__btn {{
                background: linear-gradient(135deg, var(--accent-orange), var(--accent-gold)) !important;
                border: none !important;
                color: white !important;
            }}
            
            /* Try it out button */
            .swagger-ui .try-out__btn {{
                background: linear-gradient(135deg, var(--primary-purple), var(--primary-dark)) !important;
                border: none !important;
                color: white !important;
            }}
            
            /* Download button */
            .swagger-ui .download-contents {{
                background: linear-gradient(135deg, var(--accent-orange), var(--accent-gold)) !important;
                border: none !important;
                color: white !important;
            }}
            
            /* Clear button */
            .swagger-ui .btn-clear {{
                background: rgba(244, 67, 54, 0.7) !important;
            }}
            
            /* Loading spinner */
            .swagger-ui .loading-container {{
                background: rgba(26, 26, 46, 0.95) !important;
            }}
            
            /* Scrollbar styling */
            ::-webkit-scrollbar {{
                width: 12px;
            }}
            
            ::-webkit-scrollbar-track {{
                background: var(--bg-darker);
            }}
            
            ::-webkit-scrollbar-thumb {{
                background: var(--primary-purple);
                border-radius: 6px;
            }}
            
            ::-webkit-scrollbar-thumb:hover {{
                background: var(--accent-gold);
            }}
            
            /* Search/Filter box */
            .swagger-ui .filter-container {{
                background: rgba(26, 26, 46, 0.8) !important;
                border: 2px solid var(--primary-purple) !important;
                border-radius: 8px !important;
                margin-bottom: 30px !important;
            }}
            
            .swagger-ui .filter input[type=text] {{
                color: var(--primary-light) !important;
            }}
        </style>
    </head>
    <body>
        <div id="swagger-ui"></div>
        <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
        <script>
            window.onload = function() {{
                const ui = SwaggerUIBundle({{
                    url: '/openapi.json',
                    dom_id: '#swagger-ui',
                    deepLinking: true,
                    presets: [
                        SwaggerUIBundle.presets.apis,
                        SwaggerUIBundle.SwaggerUIStandalonePreset
                    ],
                    plugins: [
                        SwaggerUIBundle.plugins.DownloadUrl
                    ],
                    layout: "BaseLayout",
                    defaultModelsExpandDepth: -1,
                    docExpansion: "none",
                    filter: true,
                    syntaxHighlight: {{
                        theme: "monokai"
                    }}
                }})
            }}
        </script>
    </body>
    </html>
    """)


# ============================================================================
# ROOT & HEALTH ENDPOINTS
# ============================================================================
@app.get("/")
async def root():
    """API root with information"""
    return {
        "message": "Welcome to NeoArcana API v2! 🌟",
        "docs": "Visit /docs for interactive API documentation",
        "version": "2.0.0",
        "endpoints": {
            "registration": "/api/nfc/register",
            "daily_reading": "/api/nfc/daily_affirmation",
            "three_card": "/api/nfc/three_card_reading",
            "weekly_reading": "/api/nfc/weekly_reading",
            "chat": "/api/chat",
            "start_chat": "/api/start_chat"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    logger.info("Health check requested")
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0",
        "message": "FastAPI is running! ✨",
        "firebase": "connected",
        "services": {
            "firebase": "connected" if db else "disconnected",
            "claude_api": "configured" if settings.ANTHROPIC_API_KEY else "not_configured"
        }
    }

@app.get("/test-claude")
async def test_claude():
    """Test Claude API connection"""
    try:
        from anthropic import AsyncAnthropic
        import os
        
        api_key = os.getenv('ANTHROPIC_API_KEY')
        if not api_key:
            return {
                "success": False,
                "error": "No API key found in environment",
                "api_key_loaded": False
            }
        
        client = AsyncAnthropic(api_key=api_key)
        
        response = await client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=100,
            messages=[{"role": "user", "content": "Say 'Hello from FastAPI!' in one sentence."}]
        )
        
        return {
            "success": True,
            "message": response.content[0].text,
            "api_key_loaded": True
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "api_key_loaded": bool(os.getenv('ANTHROPIC_API_KEY'))
        }

# ============================================================================
# PYDANTIC MODELS FOR VERIFICATION
# ============================================================================
class VerifyRequest(BaseModel):
    """Request model with automatic validation"""
    nfc_id: str

class VerifyResponse(BaseModel):
    """Response model with type safety"""
    success: bool
    valid: bool
    message: str

@app.post("/api/nfc/verify_poster", response_model=VerifyResponse)
async def verify_poster(request: VerifyRequest):
    """
    Verify NFC poster code - REAL Firebase version!
    
    Checks if poster exists in your database and if it's registered.
    """
    try:
        logger.info(f"Verifying poster: {request.nfc_id}")
        
        # Check in Firebase valid_posters collection
        poster_ref = db.collection('valid_posters').document(request.nfc_id)
        poster = poster_ref.get()
        
        if not poster.exists:
            logger.warning(f"Poster not found: {request.nfc_id}")
            return VerifyResponse(
                success=True,
                valid=False,
                message="Poster not found in database"
            )
        
        # Poster exists - check if it's registered
        poster_data = poster.to_dict()
        is_registered = poster_data.get('is_registered', False)
        
        logger.info(f"Poster found! Registered: {is_registered}")
        
        return VerifyResponse(
            success=True,
            valid=True,
            message="Poster already registered" if is_registered else "Valid poster, ready to register!"
        )
        
    except Exception as e:
        logger.error(f"Error verifying poster: {e}")
        return VerifyResponse(
            success=False,
            valid=False,
            message=f"Error checking poster: {str(e)}"
        )

@app.post("/api/admin/create_poster")
async def create_poster(admin_key: str = None):
    """
    Admin endpoint to create a new poster code
    Requires admin key for authentication
    """
    # Verify admin key
    if not admin_key or admin_key != "29isthenewOne":
        raise HTTPException(status_code=401, detail="Unauthorized - Invalid admin key")
    
    try:
        # Generate unique code
        max_attempts = 10
        code = None
        
        for _ in range(max_attempts):
            # Generate random 8-character code
            test_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
            
            # Check if exists
            poster_ref = db.collection('valid_posters').document(test_code)
            if not poster_ref.get().exists:
                code = test_code
                break
        
        if not code:
            raise HTTPException(status_code=500, detail="Failed to generate unique code")
        
        # Create poster
        poster_data = {
            'created_at': datetime.now(),
            'is_registered': False,
            'nfc_programmed': True,
            'nfc_id': f"nfc_{code}",
            'created_by': 'admin',
            'location': 'test',
            'notes': 'Created via FastAPI'
        }
        
        poster_ref = db.collection('valid_posters').document(code)
        poster_ref.set(poster_data)
        
        logger.info(f"✅ Created poster code: {code}")
        
        return {
            "success": True,
            "posterCode": code,
            "nfcId": f"nfc_{code}",
            "message": f"Poster code {code} created successfully"
        }
        
    except Exception as e:
        logger.error(f"Error creating poster: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create poster: {str(e)}")

# ============================================================================
# INCLUDE ROUTERS - Register all API routes
# ============================================================================
app.include_router(registration.router, prefix="/api/nfc", tags=["Registration & Users"])
app.include_router(readings.router, prefix="/api/nfc", tags=["Tarot Readings"])
app.include_router(chat.router, prefix="/api", tags=["AI Chat"])

# ============================================================================
# STARTUP EVENT
# ============================================================================
@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    logger.info("=" * 60)
    logger.info("🚀 NeoArcana API v2 starting...")
    logger.info("📡 Server: http://localhost:8000")
    logger.info("📚 API Docs: http://localhost:8000/docs")
    logger.info(f"🔥 Firebase: {'Connected' if db else 'Not Connected'}")
    logger.info(f"🤖 Claude API: {'Configured' if settings.ANTHROPIC_API_KEY else 'NOT CONFIGURED'}")
    logger.info("🌐 CORS: Enabled for localhost:5000, localhost:3000")
    logger.info("✅ All routes loaded successfully")
    logger.info("=" * 60)

# ============================================================================
# RUN WITH: python -m uvicorn api_v2.main:app --reload --port 8000
# ============================================================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)