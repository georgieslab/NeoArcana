// ============================================================================
// NeoArcana API Configuration
// Handles all API calls to FastAPI backend
// ============================================================================

(function() {
  'use strict';

  // Determine backend URL based on environment
  const isDevelopment = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
  
  const BASE_URL = isDevelopment 
    ? 'http://localhost:8000'
    : '';

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
    try {
      console.log(`🚀 Posting to FastAPI: ${BASE_URL}${endpoint}`);
      console.log('📤 Request data:', data);

      const response = await fetch(`${BASE_URL}${endpoint}`, {
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
      throw error;
    }
  }

  // Helper function to make GET requests
  async function get(endpoint, params = {}) {
    try {
      const url = new URL(`${BASE_URL}${endpoint}`);
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

      console.log(`🔍 Getting from FastAPI: ${url.toString()}`);

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
      console.log(`🔄 Putting to FastAPI: ${BASE_URL}${endpoint}`);
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

  // Expose API_CONFIG to global scope
  window.API_CONFIG = {
    BASE_URL: BASE_URL,
    ENDPOINTS: ENDPOINTS,
    post: post,
    get: get,
    put: put,
    
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

  console.log('✅ API Config loaded. Using:', BASE_URL);
  console.log('FastAPI Mode:', isDevelopment ? 'Development' : 'Production');
  console.log('📋 Available endpoints:', Object.keys(ENDPOINTS).length);

})();