const NFCStep2 = ({ userData }) => {
  console.log('NFCStep2 received userData:', userData);

  // State Management
  const [selectedLanguage, setSelectedLanguage] = React.useState(() => {
    return localStorage.getItem('nfc_preferred_language') || 
           (userData && userData.user_data && userData.user_data.preferences ? 
           userData.user_data.preferences.language || 'en' : 'en');
  });

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
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleLanguageChange = async (e) => {
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);
    localStorage.setItem('nfc_preferred_language', newLanguage);

    // Only translate if we have existing reading
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
              nfc_id: userData.nfc_id,
              name: userData.user_data.name || '',
              zodiacSign: userData.user_data.zodiacSign || ''
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

  const fetchDailyReading = async () => {
    if (!userData || !mounted.current) return;

    try {
      setLoading(true);
      const formattedData = {
        userData: {
          nfc_id: userData.nfc_id || '',
          name: userData.user_data.name || '',
          zodiacSign: userData.user_data.zodiacSign || '',
          language: selectedLanguage,
          preferences: {
            numbers: userData.user_data.preferences?.numbers || {},
            interests: userData.user_data.preferences?.interests || [],
            color: userData.user_data.preferences?.color || null
          }
        }
      };

      console.log('Sending formatted data:', formattedData);

      const response = await fetch('/api/nfc/daily_affirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) {
        throw new Error('Failed to get daily reading');
      }

      const data = await response.json();
      
      if (mounted.current && data.success) {
        setReadingData({
          ...data.data,
          originalLanguage: selectedLanguage
        });

        if (window.zoomBackground) {
          window.zoomBackground(1.3, 2000);
        }

        setIsVisible(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setShowInstruction(true);
        setShowZodiacMessage(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setShowCard(true);
      }
    } catch (error) {
      console.error('Error loading daily reading:', error);
      if (mounted.current) {
        setError('Unable to load your cosmic reading. Please try again.');
      }
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };

  // Initial reading fetch
  React.useEffect(() => {
    if (userData && userData.nfc_id && !showThreeCard) {
      fetchDailyReading();
    }
  }, [userData, selectedLanguage]);

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

    // Language selector
    React.createElement('div', {
      key: 'language-selector',
      className: 'nfc-language-selector'
    }, 
      React.createElement('select', {
        value: selectedLanguage,
        onChange: handleLanguageChange,
        className: 'nfc-language-select'
      }, [
        React.createElement('option', { key: 'en', value: 'en' }, 'English'),
        React.createElement('option', { key: 'ka', value: 'ka' }, 'ქართული'),
        React.createElement('option', { key: 'ru', value: 'ru' }, 'Русский'),
        React.createElement('option', { key: 'es', value: 'es' }, 'Español'),
        React.createElement('option', { key: 'fr', value: 'fr' }, 'Français'),
        React.createElement('option', { key: 'de', value: 'de' }, 'Deutsch'),
        React.createElement('option', { key: 'zh', value: 'zh' }, '中文'),
        React.createElement('option', { key: 'ja', value: 'ja' }, '日本語'),
        React.createElement('option', { key: 'ko', value: 'ko' }, '한국어')
      ])
    ),

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