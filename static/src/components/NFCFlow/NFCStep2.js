// NFCStep2.js - Fixed Positioning with Independent Scrolling
const CosmicReadingSection = ({ icon, title, content }) => {
  return React.createElement('div', {
    className: 'cosmic-section-card'
  }, [
    // Section header
    React.createElement('div', {
      key: 'header',
      className: 'cosmic-section-header'
    }, [
      React.createElement('img', {
        key: 'icon',
        src: `/static/icons/${icon}.svg`,
        alt: '',
        'aria-hidden': true,
        className: 'cosmic-section-icon'
      }),
      React.createElement('h3', {
        key: 'title',
        className: 'cosmic-section-title'
      }, title)
    ]),
    
    // Section content
    React.createElement('div', {
      key: 'content',
      className: 'cosmic-section-content'
    }, content || "The cosmic energies are at work in your life today.")
  ]);
};

// Background Stars Component
const CosmicStars = () => {
  const stars = Array(20).fill().map((_, i) => 
    React.createElement('div', {
      key: `star-${i}`,
      className: 'cosmic-star',
      style: {
        width: `${Math.random() * 3 + 1}px`,
        height: `${Math.random() * 3 + 1}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`
      }
    })
  );

  const orbs = Array(3).fill().map((_, i) => 
    React.createElement('div', {
      key: `orb-${i}`,
      className: 'cosmic-floating-orbs',
      style: {
        top: `${Math.random() * 80 + 10}%`,
        left: `${Math.random() * 80 + 10}%`,
        animationDelay: `${i * 2}s`
      }
    })
  );

  return React.createElement('div', {
    className: 'cosmic-bg-stars'
  }, [...stars, ...orbs]);
};

// Helper functions
const extractSection = (text, sectionName) => {
  try {
    if (!text) return '';
    
    // Remove potential "Dear [name]" intro
    const cleanText = text.includes('Dear') ? 
      text.substring(text.indexOf('[CARD_READING]')) : text;

    const startMarker = `[${sectionName}]`;
    const endMarker = `[/${sectionName}]`;
    
    // Find section
    const start = cleanText.indexOf(startMarker);
    if (start === -1) {
      // If section not found, try alternate approaches
      switch(sectionName) {
        case 'CARD_READING':
          return formatSection(cleanText.split('[NUMEROLOGY]')[0].replace('[CARD_READING]', ''));
        case 'NUMEROLOGY':
          return formatSection(cleanText.split('[AFFIRMATION]')[0].split('[NUMEROLOGY]')[1]);
        case 'AFFIRMATION':
          return formatSection(cleanText.split('[AFFIRMATION]')[1]);
        default:
          return '';
      }
    }
    
    const contentStart = start + startMarker.length;
    const end = cleanText.indexOf(endMarker, contentStart);
    
    return formatSection(cleanText.substring(contentStart, end !== -1 ? end : undefined));
  } catch (e) {
    console.error(`Error extracting section ${sectionName}:`, e);
    return '';
  }
};

const formatSection = (text) => {
  if (!text) return '';
  
  // Remove any initial labels or colons
  let cleaned = text.replace(/^[:\s]+/, '');
  
  // Remove any "Dear [name]" parts
  cleaned = cleaned.replace(/^Dear.*?,\s*/, '');
  
  // Remove any "here's your reading" type phrases
  cleaned = cleaned.replace(/here['']s your .*?reading:?\s*/i, '');
  
  return cleaned.trim();
};

// Language translations
const sectionTranslations = {
  en: {
    cardReading: "Card Reading",
    numerology: "Numerology Insight",
    affirmation: "Daily Affirmation",
    instruction: "✨ Come back tomorrow for a new cosmic message ✨",
    loading: "Loading your cosmic reading...",
    welcome: "Welcome Back",
    threeCardReading: "3-Card Reading",
    psychicReading: "Psychic Reading",
    comingSoon: "Coming Soon"
  },
  ka: {
    cardReading: "კარტის წაკითხვა",
    numerology: "ნუმეროლოგიური ჭვრეტა",
    affirmation: "დღიური აფირმაცია",
    instruction: "✨ დაბრუნდით ხვალ ახალი კოსმიური გზავნილისთვის ✨",
    loading: "თქვენი კოსმიური კითხვის ჩატვირთვა...",
    welcome: "კეთილი დაბრუნება",
    threeCardReading: "3-კარტიანი კითხვა",
    psychicReading: "ფსიქიკური კითხვა",
    comingSoon: "მალე"
  },
  ru: {
    cardReading: "Чтение Карт",
    numerology: "Нумерологическое Видение",
    affirmation: "Дневное Утверждение",
    instruction: "✨ Возвращайтесь завтра за новым космическим посланием ✨",
    loading: "Загрузка вашего космического чтения...",
    welcome: "Добро пожаловать",
    threeCardReading: "3-Карточное Чтение",
    psychicReading: "Психическое Чтение",
    comingSoon: "Скоро"
  }
};

const getTranslation = (key, language) => {
  const userLanguage = language || 'en';
  return (userLanguage in sectionTranslations && key in sectionTranslations[userLanguage]) 
  ? sectionTranslations[userLanguage][key] 
  : sectionTranslations.en[key];
};

// Main component
const NFCStep2 = ({ userData }) => {
  console.log('NFCStep2 received userData:', userData);

  // Component state
  const [selectedLanguage, setSelectedLanguage] = React.useState(() => {
    return (userData && 
            userData.user_data && 
            userData.user_data.preferences && 
            userData.user_data.preferences.language) || 'en';
  });
  
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [readingData, setReadingData] = React.useState(null);
  const [showThreeCard, setShowThreeCard] = React.useState(false);
  const [pulseCard, setPulseCard] = React.useState(false);
  
  // Refs
  const mounted = React.useRef(true);
  const wrapperRef = React.useRef(null);

  // Initialize component with fixed positioning
  React.useEffect(() => {
    console.log('NFCStep2 initializing...');
    
    // Lock body scroll and position
    document.body.classList.add('cosmic-reading-active');
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    
    // Force initial scroll to top of our wrapper
    if (wrapperRef.current) {
      wrapperRef.current.scrollTop = 0;
    }
    
    // Start card pulse effect after loading
    const pulseTimer = setTimeout(() => {
      if (mounted.current && !loading) {
        setPulseCard(true);
      }
    }, 3000);
    
    return () => {
      mounted.current = false;
      clearTimeout(pulseTimer);
      
      // Restore body scroll when component unmounts
      document.body.classList.remove('cosmic-reading-active');
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [loading]);

  // Force scroll to top on content changes
  React.useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollTop = 0;
    }
  }, [loading, showThreeCard, readingData]);

  // Fetch reading data
  React.useEffect(() => {
    if (userData && userData.nfc_id) {
      fetchDailyReading();
    } else {
      console.error('Missing userData or nfc_id');
      setError('User data not available');
      setLoading(false);
    }
  }, [userData]);

  // API interaction
  const fetchDailyReading = async () => {
    try {
      setLoading(true);
      
      const formattedData = {
        userData: {
          nfc_id: userData.nfc_id,
          name: userData.user_data?.name || 'User',
          zodiacSign: userData.user_data?.zodiacSign || '',
          language: userData.user_data?.preferences?.language || 'en',
          preferences: userData.user_data?.preferences || {}
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
        throw new Error('Failed to fetch reading');
      }
      
      const data = await response.json();
      
      if (mounted.current) {
        console.log('Reading data received:', data);
        setReadingData(data.data);
        
        setTimeout(() => {
          if (mounted.current) {
            setLoading(false);
            // Ensure scroll to top after loading
            if (wrapperRef.current) {
              wrapperRef.current.scrollTop = 0;
            }
          }
        }, 1000);
      }
    } catch (err) {
      console.error('Error fetching reading:', err);
      if (mounted.current) {
        setError(err.message);
        setLoading(false);
      }
    }
  };

  // User interactions
  const handleThreeCardRequest = () => {
    console.log('Three card reading requested');
    setShowThreeCard(true);
  };
  
  const handleReturnFromThreeCard = () => {
    console.log('Returning from three card reading');
    setShowThreeCard(false);
    setTimeout(() => {
      if (wrapperRef.current) {
        wrapperRef.current.scrollTop = 0;
      }
    }, 100);
  };

  const handleCardClick = () => {
    setPulseCard(!pulseCard);
    // Add a subtle haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  // Parse reading sections
  const parseReading = (text) => {
    if (!text) return {};
    return {
      cardReading: extractSection(text, 'CARD_READING'),
      numerology: extractSection(text, 'NUMEROLOGY'),
      affirmation: extractSection(text, 'AFFIRMATION')
    };
  };

  // Loading state
  if (loading) {
    return React.createElement('div', {
      ref: wrapperRef,
      className: 'cosmic-reading-wrapper'
    }, [
      React.createElement(CosmicStars, { key: 'stars' }),
      
      React.createElement('div', {
        key: 'loading',
        className: 'cosmic-loading-container'
      }, [
        React.createElement('div', {
          key: 'loader',
          className: 'cosmic-loader'
        }, [
          React.createElement('div', {
            key: 'ring1',
            className: 'cosmic-loader-ring'
          }),
          React.createElement('div', {
            key: 'ring2',
            className: 'cosmic-loader-ring'
          }),
          React.createElement('div', {
            key: 'ring3',
            className: 'cosmic-loader-ring'
          }),
          React.createElement('div', {
            key: 'core',
            className: 'cosmic-loader-core'
          })
        ]),
        
        React.createElement('p', {
          key: 'loading-text',
          className: 'cosmic-loading-text'
        }, getTranslation('loading', selectedLanguage)),
        
        React.createElement('p', {
          key: 'loading-hint',
          className: 'cosmic-loading-hint'
        }, 'Connecting with the universal energies...')
      ])
    ]);
  }

  // Error state
  if (error) {
    return React.createElement('div', {
      ref: wrapperRef,
      className: 'cosmic-reading-wrapper'
    }, [
      React.createElement(CosmicStars, { key: 'stars' }),
      
      React.createElement('div', {
        key: 'error',
        className: 'cosmic-error-container'
      }, [
        React.createElement('div', {
          key: 'error-card',
          className: 'cosmic-error-card'
        }, [
          React.createElement('h2', {
            key: 'error-title',
            className: 'cosmic-error-title'
          }, 'Cosmic Disturbance Detected'),
          
          React.createElement('p', {
            key: 'error-message',
            className: 'cosmic-error-message'
          }, error),
          
          React.createElement('button', {
            key: 'retry-btn',
            onClick: fetchDailyReading,
            className: 'cosmic-btn cosmic-btn-error'
          }, 'Reconnect with the Cosmos')
        ])
      ])
    ]);
  }

  // Three card reading
  if (showThreeCard) {
    const ThreeCardComponent = window.ThreeCardReading || window.NFCThreeCardReading;
    
    if (ThreeCardComponent) {
      return React.createElement('div', {
        ref: wrapperRef,
        className: 'cosmic-reading-wrapper'
      }, [
        React.createElement(ThreeCardComponent, {
          key: 'three-card',
          userData: userData,
          onError: setError,
          onComplete: handleReturnFromThreeCard
        })
      ]);
    } else {
      return React.createElement('div', {
        ref: wrapperRef,
        className: 'cosmic-reading-wrapper'
      }, [
        React.createElement(CosmicStars, { key: 'stars' }),
        
        React.createElement('div', {
          key: 'three-card-fallback',
          className: 'cosmic-reading-content',
          style: { textAlign: 'center', paddingTop: '3rem' }
        }, [
          React.createElement('h2', {
            key: 'title',
            className: 'cosmic-title-main'
          }, 'Three Card Reading'),
          
          React.createElement('p', {
            key: 'message',
            className: 'cosmic-instruction'
          }, 'The Three Card Reading component is not available. Please try again later.'),
          
          React.createElement('button', {
            key: 'back-btn',
            onClick: handleReturnFromThreeCard,
            className: 'cosmic-btn cosmic-btn-primary'
          }, 'Return to Daily Reading')
        ])
      ]);
    }
  }

  // Get user name with fallback
  const userName = userData && userData.user_data && userData.user_data.name ? 
    userData.user_data.name : '';
  
  const welcomeMessage = userName ? 
    `${getTranslation('welcome', selectedLanguage)}, ${userName}!` : 
    getTranslation('welcome', selectedLanguage) + '!';

  // Main reading view
  return React.createElement('div', {
    ref: wrapperRef,
    className: 'cosmic-reading-wrapper'
  }, [
    React.createElement(CosmicStars, { key: 'stars' }),
    
    React.createElement('div', {
      key: 'content',
      className: 'cosmic-reading-content'
    }, [
      // Welcome title
      React.createElement('h1', {
        key: 'title',
        className: 'cosmic-title-main'
      }, welcomeMessage),

      // Card display
      readingData && readingData.cardImage && React.createElement('div', {
        key: 'card-showcase',
        className: 'cosmic-card-showcase'
      }, [
        React.createElement('div', {
          key: 'card-container',
          className: `cosmic-card-container ${pulseCard ? 'cosmic-card-glow' : ''}`,
          onClick: handleCardClick
        }, [
          React.createElement('img', {
            key: 'card-image',
            src: readingData.cardImage,
            alt: readingData.cardName || 'Your Daily Card',
            className: `cosmic-card-image ${pulseCard ? 'cosmic-card-pulse' : ''}`,
            onError: (e) => {
              console.error('Error loading card image:', e);
              e.target.src = '/static/images/cards/card_back.jpg';
            }
          })
        ])
      ]),

      // Reading sections
      readingData && readingData.interpretation && React.createElement('div', {
        key: 'sections',
        className: 'cosmic-sections-grid'
      }, [
        React.createElement(CosmicReadingSection, {
          key: 'tarot',
          icon: 'tarot',
          title: getTranslation('cardReading', selectedLanguage),
          content: parseReading(readingData.interpretation).cardReading
        }),
        React.createElement(CosmicReadingSection, {
          key: 'numerology',
          icon: 'numerology',
          title: getTranslation('numerology', selectedLanguage),
          content: parseReading(readingData.interpretation).numerology
        }),
        React.createElement(CosmicReadingSection, {
          key: 'affirmation',
          icon: 'affirmation',
          title: getTranslation('affirmation', selectedLanguage),
          content: parseReading(readingData.interpretation).affirmation
        })
      ]),

      // Action buttons
      React.createElement('div', {
        key: 'actions',
        className: 'cosmic-actions-container'
      }, [
        React.createElement('button', {
          key: 'three-card-btn',
          onClick: handleThreeCardRequest,
          className: 'cosmic-btn cosmic-btn-primary'
        }, getTranslation('threeCardReading', selectedLanguage)),
        
        React.createElement('button', {
          key: 'coming-soon-btn',
          disabled: true,
          className: 'cosmic-btn cosmic-btn-disabled'
        }, [
          getTranslation('psychicReading', selectedLanguage),
          React.createElement('div', {
            key: 'badge',
            className: 'cosmic-coming-soon-badge'
          }, `${getTranslation('comingSoon', selectedLanguage)} 🌒`)
        ])
      ]),

      // Instructions
      React.createElement('div', {
        key: 'instruction',
        className: 'cosmic-instruction'
      }, getTranslation('instruction', selectedLanguage)),
      
      // Footer
      React.createElement('p', {
        key: 'footer',
        className: 'cosmic-footer'
      }, [
        "made w/ 🪄 by ",
        React.createElement('a', {
          href: "https://instagram.com/georgieslab",
          target: "_blank",
          rel: "noopener noreferrer"
        }, "georgie"),
        "."
      ])
    ])
  ]);
};

window.NFCStep2 = NFCStep2;