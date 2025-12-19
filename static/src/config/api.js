/**
 * NeoArcana API Configuration
 * Centralized API endpoints for FastAPI backend
 */

const API_CONFIG = {
  // Base URL - automatically switches between dev and production
  BASE_URL: window.location.hostname === 'localhost' || 
            window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000'  // FastAPI development server
    : 'https://neoarcana-api.run.app', // Production (update with your URL)
  
  // All API endpoints
  ENDPOINTS: {
    // Health & System
    HEALTH: '/health',
    TEST_CLAUDE: '/test-claude',
    
    // NFC & User Management
    VERIFY_POSTER: '/api/nfc/verify_poster',
    REGISTER: '/api/nfc/register',
    GET_USER: '/api/nfc/user',  // append /{nfc_id}
    UPDATE_USER: '/api/nfc/user', // append /{nfc_id}
    CREATE_POSTER: '/api/admin/create_poster',
    
    // Tarot Readings
    DAILY_READING: '/api/nfc/daily_affirmation',
    THREE_CARD_READING: '/api/nfc/three_card_reading',
    WEEKLY_READING: '/api/nfc/weekly_reading',
    
    // Chat System
    START_CHAT: '/api/start_chat',
    CHAT: '/api/chat',
    CHAT_HISTORY: '/api/chat/history', // append /{session_id}
  },
  
  // Helper function to build full URL
  getUrl(endpoint) {
    return this.BASE_URL + endpoint;
  },
  
  // Helper for endpoints with parameters
  getUserUrl(nfc_id) {
    return `${this.BASE_URL}${this.ENDPOINTS.GET_USER}/${nfc_id}`;
  },
  
  getChatHistoryUrl(session_id) {
    return `${this.BASE_URL}${this.ENDPOINTS.CHAT_HISTORY}/${session_id}`;
  }
};

// Make available globally
window.API_CONFIG = API_CONFIG;

console.log('✅ API Config loaded:', API_CONFIG.BASE_URL);