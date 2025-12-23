// ============================================================================
// NeoArcana API Configuration
// Handles all API calls to FastAPI backend
// FIXED: Handles both HTTP and HTTPS origins
// ============================================================================

(function() {
  'use strict';

  // Determine backend URL based on environment
  const isDevelopment = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
  
  // FIXED: Always use HTTP for localhost FastAPI (even if frontend is HTTPS)
  // FastAPI runs on HTTP port 8000 regardless of Flask's protocol
  const BASE_URL = isDevelopment 
    ? 'http://localhost:8000'  // Always HTTP for local FastAPI
    : '';  // Production uses relative URLs (same origin)

  console.log('🔧 API Config initializing...');
  console.log('📍 Current location:', window.location.href);
  console.log('🎯 API Base URL:', BASE_URL);

  // API Endpoints - Complete list
  const ENDPOINTS = {
    // Health & System
    HEALTH: '/health',
    TEST_CLAUDE: '/test-claude',
    
    // NFC & User Management
    VERIFY_POSTER: '/api/nfc/verify_poster',
    REGISTER: '/api/nfc/register',
    GET_USER: '/api/nfc/user',
    UPDATE_USER: '/api/nfc/user',
    
    // Readings
    DAILY_AFFIRMATION: '/api/nfc/daily_affirmation',
    THREE_CARD_READING: '/api/nfc/three_card_reading',
    WEEKLY_READING: '/api/nfc/weekly_reading',
    
    // Chat
    START_CHAT: '/api/start_chat',
    CHAT: '/api/chat',
    CHAT_HISTORY: '/api/chat/history',
    
    // Admin
    CREATE_POSTER: '/api/admin/create_poster'
  };

  // Helper function to make POST requests
  async function post(endpoint, data) {
    const url = `${BASE_URL}${endpoint}`;
    
    try {
      console.log(`🚀 POST to FastAPI: ${url}`);
      console.log('📤 Request data:', JSON.stringify(data, null, 2));

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error (${response.status}):`, errorText);
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Response from FastAPI:', result);
      return result;

    } catch (error) {
      console.error('❌ API POST Error:', error);
      
      // Provide helpful error messages
      if (error.message.includes('Failed to fetch')) {
        console.error('🔍 Possible causes:');
        console.error('   1. FastAPI not running on port 8000');
        console.error('   2. CORS blocking the request');
        console.error('   3. Network connectivity issue');
        console.error('💡 Try: python -m uvicorn api_v2.main:app --reload --port 8000');
      }
      
      throw error;
    }
  }

  // Helper function to make GET requests
  async function get(endpoint, params = {}) {
    try {
      const url = new URL(`${BASE_URL}${endpoint}`);
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

      console.log(`🔍 GET from FastAPI: ${url.toString()}`);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error (${response.status}):`, errorText);
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Response from FastAPI:', result);
      return result;

    } catch (error) {
      console.error('❌ API GET Error:', error);
      throw error;
    }
  }

  // Helper function to make PUT requests
  async function put(endpoint, data) {
    try {
      console.log(`🔄 PUT to FastAPI: ${BASE_URL}${endpoint}`);
      console.log('📤 Request data:', data);

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error (${response.status}):`, errorText);
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Response from FastAPI:', result);
      return result;

    } catch (error) {
      console.error('❌ API PUT Error:', error);
      throw error;
    }
  }

  // Health check function
  async function checkHealth() {
    try {
      const result = await get(ENDPOINTS.HEALTH);
      console.log('💚 FastAPI Health:', result);
      return result;
    } catch (error) {
      console.error('💔 FastAPI not reachable:', error.message);
      return null;
    }
  }

  // Expose API_CONFIG to global scope
  window.API_CONFIG = {
    BASE_URL: BASE_URL,
    ENDPOINTS: ENDPOINTS,
    post: post,
    get: get,
    put: put,
    checkHealth: checkHealth,
    
    // Convenience methods for specific endpoints
    verifyPoster: (nfc_id) => post(ENDPOINTS.VERIFY_POSTER, { nfc_id }),
    register: (userData) => post(ENDPOINTS.REGISTER, userData),
    getUser: (nfc_id) => get(`${ENDPOINTS.GET_USER}/${nfc_id}`),
    updateUser: (nfc_id, userData) => put(`${ENDPOINTS.UPDATE_USER}/${nfc_id}`, userData),
    getDailyReading: (userData) => post(ENDPOINTS.DAILY_AFFIRMATION, userData),
    getThreeCardReading: (nfc_id) => post(ENDPOINTS.THREE_CARD_READING, { nfc_id }),
    getWeeklyReading: (nfc_id) => post(ENDPOINTS.WEEKLY_READING, { nfc_id }),
    startChat: (chatData) => post(ENDPOINTS.START_CHAT, chatData),
    sendChatMessage: (chatData) => post(ENDPOINTS.CHAT, chatData),
    getChatHistory: (session_id) => get(`${ENDPOINTS.CHAT_HISTORY}/${session_id}`)
  };

  console.log('✅ API Config loaded successfully');
  console.log('🌐 Mode:', isDevelopment ? 'Development' : 'Production');
  console.log('📋 Available endpoints:', Object.keys(ENDPOINTS).length);
  
  // Auto-check health on load (helpful for debugging)
  if (isDevelopment) {
    setTimeout(() => {
      checkHealth().then(result => {
        if (result) {
          console.log('🎉 FastAPI connection verified!');
        } else {
          console.warn('⚠️ FastAPI not responding. Make sure to run:');
          console.warn('   python -m uvicorn api_v2.main:app --reload --port 8000');
        }
      });
    }, 1000);
  }

})();