const NFCStep2 = ({ userData }) => {
  console.log('NFCStep2 received userData:', userData);

  const [selectedLanguage, setSelectedLanguage] = React.useState(() => {
    return (userData && 
            userData.user_data && 
            userData.user_data.preferences && 
            userData.user_data.preferences.language) || 'en';
  })

  // Add logging to debug language handling
  React.useEffect(() => {
    console.log('Selected language:', selectedLanguage);
    console.log('User preferences:', 
      userData && userData.user_data && userData.user_data.preferences
    );
  }, [selectedLanguage, userData]);
  
  const [isVisible, setIsVisible] = React.useState(false);
  const [showInstruction, setShowInstruction] = React.useState(false);
  const [showCard, setShowCard] = React.useState(false);
  const [showZodiacMessage, setShowZodiacMessage] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [readingData, setReadingData] = React.useState({
    affirmation: '',
    cardImage: '',
    interpretation: '',
    numerologyInsight: '',
  });
  const [showThreeCard, setShowThreeCard] = React.useState(false);
  
  const mounted = React.useRef(true);

  React.useEffect(() => {
    if (userData && userData.nfc_id) {
      console.log('NFCStep2 mounted with userData:', userData);
      fetchDailyReading();
    } else {
      console.log('Missing required userData:', userData);
    }
  }, [userData]);

  const handleLanguageChange = async (e) => {
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);
    localStorage.setItem('nfc_preferred_language', newLanguage);

    if (readingData.cardImage) {
      try {
        setLoading(true);
        const response = await fetch('/api/nfc/translate_reading', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reading: readingData,
            targetLanguage: newLanguage,
            userData: {
              nfc_id: userData && userData.nfc_id,
              name: userData && userData.user_data && userData.user_data.name || '',
              zodiacSign: userData && userData.user_data && userData.user_data.zodiacSign || ''
            }
          })
        });

        if (!response.ok) {
          throw new Error('Translation failed');
        }

        const translatedData = await response.json();
        if (mounted.current) {
          setReadingData(prev => ({
            ...prev,
            affirmation: translatedData.affirmation,
            interpretation: translatedData.interpretation,
            numerologyInsight: translatedData.numerologyInsight
          }));
        }
      } catch (error) {
        console.error('Translation error:', error);
        setSelectedLanguage(readingData.originalLanguage);
        localStorage.setItem('nfc_preferred_language', readingData.originalLanguage);
      } finally {
        if (mounted.current) {
          setLoading(false);
        }
      }
    }
  };

  React.useEffect(() => {
    if (userData && userData.nfc_id) {
      console.log('NFCStep2: Fetching daily reading for user:', userData);
      fetchDailyReading();
    }
  }, [userData]);

  const validateUserData = (data) => {
    console.log('Validating user data:', data);
    if (!data || !data.nfc_id) {
      console.error('Missing nfc_id');
      return false;
    }
    if (!data.user_data || !data.user_data.name) {
      console.error('Missing user_data.name');
      return false;
    }
    return true;
  };
  
  // Update the useEffect
  React.useEffect(() => {
    if (userData) {
      if (validateUserData(userData)) {
        console.log('Valid userData found, fetching reading');
        fetchDailyReading();
      } else {
        setError('Invalid user data provided');
      }
    }
  }, [userData]);
  
  const fetchDailyReading = async () => {
    if (!userData || !mounted.current) return;
  
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
  
      // Format user data
      const formattedData = {
        userData: {
          nfc_id: userData.nfc_id,
          name: userData.user_data.name,
          zodiacSign: userData.user_data.zodiacSign,
          language: userData.user_data.preferences.language,
          preferences: userData.user_data.preferences
        }
      };
  
      console.log('Sending reading request:', formattedData);
  
      const response = await fetch('/api/nfc/daily_affirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get daily reading');
      }
  
      const data = await response.json();
      
      if (mounted.current && data.success) {
        setReadingData(data.data);
        // Trigger the display sequence
        setIsVisible(true);
        setTimeout(() => {
          setShowCard(true);
          setTimeout(() => {
            setShowZodiacMessage(true);
            setTimeout(() => {
              setShowInstruction(true);
            }, 500);
          }, 500);
        }, 500);
      }
    } catch (error) {
      console.error('NFCStep2: Error loading daily reading:', error);
      setError('Unable to load your cosmic reading. Please try again.');
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };
  
  // Add useEffect cleanup
  React.useEffect(() => {
    const cleanup = () => {
      mounted.current = false;
    };
    return cleanup;
  }, []);
  if (error) {
    return React.createElement('div', {
      className: 'nfc-step2-container'
    }, [
      React.createElement('div', {
        key: 'error-message',
        className: 'nfc-error-message'
      }, React.createElement('p', null, error)),
      React.createElement('button', {
        key: 'retry-button',
        onClick: () => window.location.reload(),
        className: 'nfc-retry-button'
      }, 'Try Again ✨')
    ]);
  }

  if (loading) {
    return React.createElement(CosmicLoader, { type: 'nfc' });
  }

  if (showThreeCard) {
    return React.createElement(ThreeCardReading, {
      userData: userData,
      onError: setError,
      onComplete: () => setShowThreeCard(false)
    });
  }

  return React.createElement('div', {
    className: `nfc-step2-container ${isVisible ? 'nfc-fade-in' : ''}`
  }, [
    
    // Welcome message
    React.createElement('h1', {
      key: 'title',
      className: 'nfc-title'
    }, userData && userData.user_data && userData.user_data.name ? 
      `Welcome Back, ${userData.user_data.name}!` : 'Welcome Back!'),

    // Card display
    showCard && readingData.cardImage && React.createElement('div', {
      key: 'card-container',
      className: 'nfc-card-container nfc-fade-in'
    }, 
      React.createElement('img', {
        src: readingData.cardImage,
        alt: 'Your Daily Card',
        className: 'nfc-card-image',
        onError: (e) => {
          e.target.src = '/static/images/cards/card_back.jpg';
        }
      })
    ),

    // Interpretation
    showZodiacMessage && readingData.interpretation && React.createElement('div', {
      key: 'interpretation',
      className: 'nfc-text-section nfc-fade-in'
    }, [
      React.createElement('p', {
        key: 'interpretation-text',
        className: 'nfc-interpretation'
      }, readingData.interpretation),
      userData && userData.user_data && userData.user_data.zodiacSign && 
        React.createElement('p', {
          key: 'zodiac',
          className: 'nfc-zodiac-sign'
        }, userData.user_data.zodiacSign)
    ]),

    // Daily Message
    readingData.affirmation && React.createElement('div', {
      key: 'affirmation',
      className: 'nfc-text-section nfc-fade-in'
    }, [
      React.createElement('h2', {
        key: 'subtitle',
        className: 'nfc-subtitle'
      }, 'Your Daily Cosmic Message'),
      React.createElement('p', {
        key: 'affirmation-text',
        className: 'nfc-affirmation'
      }, readingData.affirmation)
    ]),

    // Reading Type Selector
    React.createElement('div', {
      key: 'reading-selector',
      className: 'reading-type-selector'
    }, [
      React.createElement('button', {
        key: 'daily',
        className: 'cosmic-button active',
        onClick: fetchDailyReading
      }, 'Daily Reading'),
      React.createElement('button', {
        key: 'weekly',
        className: 'cosmic-button',
        onClick: () => setShowThreeCard(true)
      }, 'Weekly 3-Card Reading')
    ]),

    // Instruction
    showInstruction && React.createElement('div', {
      key: 'instruction',
      className: 'nfc-text-section nfc-fade-in'
    }, 
      React.createElement('p', {
        className: 'nfc-instruction'
      }, '✨ Come back tomorrow for a new cosmic message ✨')
    )
  ]);
};

window.NFCStep2 = NFCStep2;