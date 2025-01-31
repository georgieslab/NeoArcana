const NFCDataHandler = {
  extractUserData: (userData) => {
    if (!userData) {
      console.error('No user data provided to extractUserData');
      return null;
    }

    console.log('Raw user data received:', userData);

    // Handle both direct and nested user_data structures
    const userDataObj = userData.user_data || userData;
    
    // Get the correct ID, checking multiple possible locations
    const id = userDataObj.id || userData.nfc_id || userData.nfcId;
    if (!id) {
      console.error('No valid ID found in user data');
      throw new Error('Invalid user data: no ID found');
    }

    // Extract preferences with defaults
    const preferencesObj = userDataObj.preferences || {};
    const numbersObj = preferencesObj.numbers || {};

    const extractedData = {
      id: id,
      name: userDataObj.name || null,
      zodiacSign: userDataObj.zodiacSign || null,
      dateOfBirth: userDataObj.dateOfBirth || null,
      preferences: {
        color: preferencesObj.color || {
          name: 'Cosmic Purple',
          value: '#A59AD1'
        },
        interests: preferencesObj.interests || [],
        language: preferencesObj.language || 'en',
        gender: preferencesObj.gender || '',
        futurePlans: preferencesObj.futurePlans || '',
        numbers: {
          favoriteNumber: numbersObj.favoriteNumber || '',
          luckyNumber: numbersObj.luckyNumber || '',
          guidanceNumber: numbersObj.guidanceNumber || ''
        }
      },
      registrationDate: userDataObj.registration_date || userData.registrationDate || null,
      lastReadingDate: userDataObj.last_reading_date || userData.lastReadingDate || null,
      posterCode: userDataObj.poster_code || userData.posterCode || null
    };

    console.log('Extracted user data:', extractedData);
    
    // Validate required fields
    if (!extractedData.name) {
      console.error('No name found in user data');
      throw new Error('Name is required but not found in user data');
    }

    return extractedData;
  },
  
  validateRegistrationData: (formData) => {
    // Validate required fields
    const required = ['name', 'dateOfBirth', 'posterCode'];
    const missing = required.filter(field => !formData[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    // Validate number ranges if provided
    if (formData.numbers) {
      const numbers = formData.numbers;
      const numberFields = ['favoriteNumber', 'luckyNumber', 'guidanceNumber'];
      
      for (const field of numberFields) {
        if (numbers[field]) {
          const num = parseInt(numbers[field]);
          if (isNaN(num) || num < 0 || num > 99) {
            throw new Error(`${field} must be between 0 and 99`);
          }
        }
      }
    }

    return true;
  },

  formatRegistrationData: (formData) => {
    // Create a properly formatted data structure for registration
    const formatted = {
      name: formData.name,
      dateOfBirth: formData.dateOfBirth,
      posterCode: formData.posterCode,
      preferences: {
        color: formData.color || {
          name: 'Cosmic Purple',
          value: '#A59AD1'
        },
        interests: formData.interests || [],
        language: formData.language || 'en',
        gender: formData.gender || '',
        futurePlans: formData.futurePlans || '',
        numbers: {}
      }
    };

    // Format numbers if provided
    if (formData.numbers) {
      formatted.preferences.numbers = {
        favoriteNumber: parseInt(formData.numbers.favoriteNumber) || '',
        luckyNumber: parseInt(formData.numbers.luckyNumber) || '',
        guidanceNumber: parseInt(formData.numbers.guidanceNumber) || ''
      };
    }

    return formatted;
  },
  
  handleDailyReading: async (userData) => {
    try {
      console.log('handleDailyReading received:', userData);
      
      // First normalize the user data
      const normalizedUser = NFCDataHandler.extractUserData(userData);
      console.log('Normalized user data:', normalizedUser);
      
      if (!normalizedUser || !normalizedUser.id) {
        throw new Error('Invalid user data');
      }

      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      const lastReadingDate = normalizedUser.lastReadingDate;
      
      // Check if user already has a reading for today
      if (lastReadingDate === today) {
        const response = await fetch(`/api/nfc/last_reading/${normalizedUser.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch last reading');
        }
        const data = await response.json();
        return data.reading;
      }

      // Request new daily reading
      const readingResponse = await fetch('/api/nfc/daily_affirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: normalizedUser.id,
          userData: {
            name: normalizedUser.name,
            zodiacSign: normalizedUser.zodiacSign || 'Universal',
            language: normalizedUser.preferences.language || 'en',
            interests: normalizedUser.preferences.interests || [],
            futurePlans: normalizedUser.preferences.futurePlans || '',
            numbers: normalizedUser.preferences.numbers || {}
          }
        })
      });

      if (!readingResponse.ok) {
        const errorData = await readingResponse.json();
        throw new Error(errorData.error || 'Failed to generate daily reading');
      }

      const readingData = await readingResponse.json();
      
      // Store the reading
      await fetch('/api/nfc/store_reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: normalizedUser.id,
          cardImage: readingData.cardImage || '/static/images/cards/default.jpg',
          affirmation: readingData.affirmation || 'Connect with the cosmic energy today',
          zodiacMessage: readingData.zodiacMessage || null,
          date: today
        })
      });

      return readingData;
      
    } catch (error) {
      console.error('Error in handleDailyReading:', error);
      throw error;
    }
  }
};

// Expose to window for global access
window.NFCDataHandler = NFCDataHandler;