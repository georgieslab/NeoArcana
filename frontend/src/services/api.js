/**
 * NeoArcana API Service
 * Interacts with FastAPI backend routes
 */

export const api = {
  // Health
  async checkHealth() {
    try {
      const res = await fetch('/health');
      return await res.json();
    } catch (err) {
      console.error('Health check failed:', err);
      return { status: 'error', error: err.message };
    }
  },

  // Verify NFC Poster code
  async verifyPoster(posterCode) {
    const res = await fetch('/api/nfc/verify_poster', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nfc_id: posterCode }),
    });
    if (!res.ok) throw new Error(`Poster verification failed: ${res.statusText}`);
    return await res.json();
  },

  // Register NFC user
  async registerUser(userData) {
    const res = await fetch('/api/nfc/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error(`Registration failed: ${res.statusText}`);
    return await res.json();
  },

  // Fetch NFC user data
  async getUser(nfcId) {
    const formattedId = nfcId.startsWith('nfc_') ? nfcId : `nfc_${nfcId}`;
    const res = await fetch(`/api/nfc/user/${formattedId}`);
    if (!res.ok) throw new Error(`Fetch user failed: ${res.statusText}`);
    return await res.json();
  },

  // Daily Affirmation
  async getDailyAffirmation(userData) {
    const res = await fetch('/api/nfc/daily_affirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userData }),
    });
    if (!res.ok) throw new Error(`Daily reading failed: ${res.statusText}`);
    return await res.json();
  },

  // Three-Card Reading (supports both trial users with null and registered NFC users)
  async getThreeCardReading(nfcId = null, focus = 'General Guidance', userData = null) {
    const res = await fetch('/api/nfc/three_card_reading', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nfc_id: nfcId,
        focus: focus,
        userData: userData,
      }),
    });
    if (!res.ok) throw new Error(`Three card reading failed: ${res.statusText}`);
    return await res.json();
  },

  // Start Chat session with the Universe
  async startChat({ name, zodiacSign, cardName, reading, language = 'en' }) {
    const res = await fetch('/api/start_chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        zodiacSign,
        cardName,
        reading,
        language,
      }),
    });
    if (!res.ok) throw new Error(`Start chat failed: ${res.statusText}`);
    return await res.json();
  },

  // Send message in chat
  async sendMessage({ message, sessionId, name, zodiacSign, reading, cardName, language = 'en', messageHistory = [] }) {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        session_id: sessionId,
        name: name || 'Seeker',
        zodiacSign: zodiacSign || '',
        reading: reading || '',
        cardName: cardName || 'Three Cards Spread',
        language,
        messageHistory,
      }),
    });
    if (!res.ok) throw new Error(`Chat message failed: ${res.statusText}`);
    return await res.json();
  },
};

export default api;
