const TarotApp = ({ language = 'en' }) => {

  // API Configuration - Add this RIGHT HERE!
  const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:8000'
    :'';  // Local development

  // UI State
  const mountedRef = React.useRef(true);
  const initialState = window.initialState || {};
  const [isNFCRegistration, setIsNFCRegistration] = React.useState(
    (initialState && initialState.view === 'registration') || 
    window.location.pathname === '/nfc'
  );

const [nfcId, setNfcId] = React.useState(
  initialState && initialState.nfcId ? initialState.nfcId : null
);

const [nfcUserData, setNfcUserData] = React.useState(null);
const [isNFCUser, setIsNFCUser] = React.useState(false);
const [showDailyReading, setShowDailyReading] = React.useState(false);

const [showAdmin, setShowAdmin] = React.useState(false);

React.useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const adminMode = urlParams.get('admin') === 'true';
  
  if (adminMode) {
    setShowAdmin(true);
    // Skip the normal flow
    setStep(-1);
  }
}, []);

  // Add cleanup effect
  React.useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);
  const [isLoading, setIsLoading] = React.useState(true);
  const [contentVisible, setContentVisible] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [fadeIn, setFadeIn] = React.useState(false);
  const [fadeOut, setFadeOut] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [showPopup, setShowPopup] = React.useState(false);
  const [previousStep, setPreviousStep] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [buttonText, setButtonText] = React.useState('Talk to the Universe');
  const [isClosing, setIsClosing] = React.useState(false);

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const nfcId = urlParams.get('id'); // Match the URL parameter name
    const posterCode = urlParams.get('posterCode');
  
    // If coming from NFC tap
    if (nfcId) {
      console.log('NFC ID detected:', nfcId);
      fetchNFCUserData(nfcId);
      setIsNFCUser(true);
      setStep(2); // Force step 2
    }
    // If coming from poster registration
    else if (posterCode) {
      setIsNFCRegistration(true);
      setStep(1);
    }
  }, []);

  if ('serviceWorker' in navigator) {
    const isLocalhost = 
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.startsWith('192.168.');
      
    const isProduction = window.location.hostname === 'app.neoarcana.cloud';
    
    window.addEventListener('load', () => {
      try {
        // Always register in production or when explicitly enabled
        if (isProduction || !isLocalhost || window.location.search.includes('enableSW=true')) {
          console.info('Registering service worker...');
          
          navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
              console.log('ServiceWorker registered successfully:', registration.scope);
              
              // Check for updates
              setInterval(() => {
                registration.update().catch(err => {
                  console.warn('Service worker update check failed:', err);
                });
              }, 60 * 60 * 1000); // Check every hour
            })
            .catch(error => {
              if (isProduction) {
                console.error('ServiceWorker registration failed:', error);
                // Retry registration once in production
                setTimeout(() => {
                  console.info('Retrying service worker registration...');
                  navigator.serviceWorker.register('/service-worker.js')
                    .catch(err => console.warn('ServiceWorker registration retry failed'));
                }, 3000);
              } else {
                console.warn('ServiceWorker registration skipped in development:', error);
              }
            });
        } else {
          console.info('ServiceWorker registration skipped in development environment');
        }
      } catch (e) {
        console.warn('Error during service worker registration:', e);
      }
    });
  }
  
  
  // Add to Home Screen
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  
    // Show when user is in step 2 (reading)
    if (step === 2) {
      const installButton = document.createElement('button');
      installButton.className = 'cosmic-glassy-button3';
      installButton.textContent = '✨ Add to Home Screen';
      document.querySelector('.nfc-step2-container').appendChild(installButton);
  
      installButton.addEventListener('click', async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          deferredPrompt = null;
          installButton.remove();
        }
      });
    }
  });

  React.useEffect(() => {
    if (initialState.isNFCRegistration) {
      setStep(1);  // Go to registration
    } else if (initialState.nfcId) {
      fetchNFCUserData(initialState.nfcId);
    }
  }, []);

  React.useEffect(() => {
    console.log('Initial state:', initialState);
    console.log('URL params:', new URLSearchParams(window.location.search).get('id'));
    if (initialState.nfcId) {
      console.log('Found nfcId in initial state:', initialState.nfcId);
      fetchNFCUserData(initialState.nfcId);
    }
  }, []);

  // User Data - Common
  const [name, setName] = React.useState('');
  const [dateOfBirth, setDateOfBirth] = React.useState('');
  const [zodiacSign, setZodiacSign] = React.useState('');
  
  // Trial Specific
  const [email, setEmail] = React.useState('');
  
  // Premium Specific
  const [gender, setGender] = React.useState('');
  const [interests, setInterests] = React.useState([]);
  const [color, setColor] = React.useState({
    name: 'Cosmic Purple',
    value: '#A59AD1'
  });

  // Premium State
  const [isPremium, setIsPremium] = React.useState(false);
  const [isPremiumReading, setIsPremiumReading] = React.useState(false);
  const [premiumCards, setPremiumCards] = React.useState([]);

  // Reading State
  const [cardName, setCardName] = React.useState('');
  const [cardImage, setCardImage] = React.useState('');
  const [interpretation, setInterpretation] = React.useState('');
  const [affirmations, setAffirmations] = React.useState([]);
  const [selectedLanguage, setSelectedLanguage] = React.useState('en');

  // Development Mode State
  const [isDev, setIsDev] = React.useState(false);
  const [devPanel, setDevPanel] = React.useState(false);

  // Audio State
  const [isMuted, setIsMuted] = React.useState(false);
  const [audioReady, setAudioReady] = React.useState(false);
  const audioRef = React.useRef(null);
  const emailSaveTimeoutRef = React.useRef(null);
  const fetchNFCUserData = async (nfcId) => {
    if (!nfcId || !mountedRef.current) return;
    
    try {
      console.log('Fetching NFC user data for ID:', nfcId);
      // Ensure nfc_id has correct prefix
      const formattedId = nfcId.startsWith('nfc_') ? nfcId : `nfc_${nfcId}`;
      
      const response = await fetch(`${API_BASE_URL}/api/nfc/user/${formattedId}`);
      const userData = await response.json();
      console.log('Received user data:', userData);
      
      // Verify component is still mounted before updating state
      if (!mountedRef.current) return;
      
      if (!userData.success) {
        throw new Error(userData.error || 'Failed to fetch user data');
      }
      
      // Make sure nfc_id is included in the userData
      const enhancedUserData = {
        ...userData.user_data,
        nfc_id: formattedId
      };
      
      setNfcUserData(enhancedUserData);
      setIsNFCUser(true);
      
      const userDataObj = userData.user_data && userData.user_data.user_data;
      if (userDataObj) {
        setName(userData.user_data.user_data.name || '');
        setZodiacSign(userData.user_data.user_data.zodiacSign || '');
      }
      
      setStep(2);
    } catch (error) {
      // Only update error state if still mounted
      if (mountedRef.current) {
        console.error('Error fetching NFC user data:', error);
        setError('Failed to load your cosmic connection. Please try again.');
      }
    }
  };

  const handleDailyReading = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const nfcId = urlParams.get('id');
    const posterCode = urlParams.get('posterCode');
    
    if (posterCode) {
      // Handle registration flow
      setIsNFCRegistration(true);
      setStep(1);
    } else if (nfcId) {
      try {
        await fetchNFCUserData(nfcId);
      } catch (error) {
        setError("Unable to load your cosmic reading. Please try again.");
        console.error('Error:', error);
      }
    } else {
      setError("Please scan your NFC tag or poster QR code to continue");
      setTimeout(() => setError(null), 3000);
    }
  };

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const nfcId = urlParams.get('id');
    const posterCode = urlParams.get('posterCode');
  
    if (posterCode) {
      console.log('Poster code detected:', posterCode);
      setIsNFCRegistration(true);
      setStep(1);
    } else if (nfcId) {
      console.log('NFC ID detected:', nfcId);
      fetchNFCUserData(nfcId);
      setIsNFCUser(true);
      setStep(2);
    }
  }, []);  // This will run once when component mounts

  const handleNFCRegistration = async (userData) => {
    try {
      setIsSubmitting(true);
      console.log('Processing NFC registration with data:', userData);
  
      // First verify poster code
      const verifyResponse = await fetch(`${API_BASE_URL}/api/nfc/verify_poster`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          posterCode: userData.posterCode
        })
      });
  
      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.error || 'Failed to verify poster code');
      }
  
      const verifyData = await verifyResponse.json();
      console.log('Verify response:', verifyData);
  
      // Include numbers data in the user data
      const formattedUserData = {
        ...userData,
        preferences: {
          ...userData.preferences,
          numbers: {
            ...userData.numbers
          }
        }
      };
  
      // If existing user, update
      if (verifyData.existingUser) {
        console.log('Updating existing user with ID:', verifyData.nfcId);
        const updateResponse = await fetch(`${API_BASE_URL}/api/nfc/update_user/${verifyData.nfcId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formattedUserData)
        });
  
        if (!updateResponse.ok) {
          const errorData = await updateResponse.json();
          throw new Error(errorData.error || 'Update failed');
        }
  
        const data = await updateResponse.json();
        setNfcUserData(data);
        setName(userData.name);
        setZodiacSign(userData.zodiacSign);
        setStep(2);
        return;
      }
  
      // Register new user with numbers data
      console.log('Registering new user with data:', formattedUserData);
      const registerResponse = await fetch(`${API_BASE_URL}/api/nfc/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedUserData)
      });
  
      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        throw new Error(errorData.error || 'Registration failed');
      }
  
      const data = await registerResponse.json();
      console.log('Registration successful:', data);
      setNfcUserData(data);
      setName(userData.name);
      setZodiacSign(userData.zodiacSign);
      setStep(2);
  
    } catch (error) {
      console.error('Error during NFC registration:', error);
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.code === 'KeyD') {
        e.preventDefault();
        setDevPanel(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  React.useEffect(() => {
    console.log('Current language:', selectedLanguage);
  }, [selectedLanguage]);

  React.useEffect(() => {
    const storedPremium = localStorage.getItem('promoCode') === 'Universeis30!';
    if (storedPremium) {
      setIsPremium(true);
      setIsPremiumReading(true);
    }
   
    const urlParams = new URLSearchParams(window.location.search);
    const devMode = urlParams.get('dev') === 'true';
    const initialStep = parseInt(urlParams.get('step'));
    
    setIsDev(devMode);
    setDevPanel(devMode);
    
    if (devMode && !isNaN(initialStep)) {
      setStep(initialStep);
    }
  }, []);

  // Initialize audio
  React.useEffect(() => {
    audioRef.current = new Audio('/static/sound/cosmicnoise.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    audioRef.current.oncanplaythrough = () => {
      setAudioReady(true);
    };

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);
  

  const handleLoadingComplete = React.useCallback(() => {
    setIsLoading(false);
    if (document.getElementById('canvas_container')) {
      document.getElementById('canvas_container').classList.add('fade-in');
    }
    setTimeout(() => {
      setContentVisible(true);
      setFadeIn(true);
    }, 100);
  }, []);

  const handleUserInteraction = React.useCallback((e) => {
    if (e.target.closest('.cosmic-msd')) return;
    
    if (audioReady && audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(error => {
        console.log('Audio play prevented:', error);
      });
    }
  }, [audioReady]);

  const handleTryFree = React.useCallback(() => {
  setFadeOut(true);
  
  // Always set to trial mode (no premium path)
  setIsPremium(false);
  setIsPremiumReading(false);
  
  setTimeout(() => {
    setStep(1);
    setFadeOut(false);
    setFadeIn(true);
    setTimeout(() => {
      setFadeIn(false);
    }, 500);
  }, 500);

  // Reset all form data
  setName('');
  setDateOfBirth('');
  setEmail('');
  setZodiacSign('');
  setCardName('');
  setCardImage('');
  setInterpretation('');
  setAffirmations([]);
  setPremiumCards([]);
  setError(null);

  if (window.zoomBackground) {
    window.zoomBackground(0.3, 1000);
  }
}, []);

    React.useEffect(() => {
      console.log('[Language Flow] Selected language changed:', selectedLanguage);
    }, [selectedLanguage]);
    
const handlePosterRegistration = React.useCallback(() => {
  console.log('Starting poster registration flow');
  setIsNFCRegistration(true);
  setIsNFCUser(true);
  setStep(1);
  
  // Reset any existing data
  setName('');
  setDateOfBirth('');
  setZodiacSign('');
  setError(null);
  
  if (window.zoomBackground) {
    window.zoomBackground(0.3, 1000);
  }
}, []);

const calculateZodiacSign = (dateOfBirth) => {
  const date = new Date(dateOfBirth);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const signs = [
    { sign: 'Capricorn', start: [12, 22], end: [1, 19] },
    { sign: 'Aquarius', start: [1, 20], end: [2, 18] },
    { sign: 'Pisces', start: [2, 19], end: [3, 20] },
    { sign: 'Aries', start: [3, 21], end: [4, 19] },
    { sign: 'Taurus', start: [4, 20], end: [5, 20] },
    { sign: 'Gemini', start: [5, 21], end: [6, 20] },
    { sign: 'Cancer', start: [6, 21], end: [7, 22] },
    { sign: 'Leo', start: [7, 23], end: [8, 22] },
    { sign: 'Virgo', start: [8, 23], end: [9, 22] },
    { sign: 'Libra', start: [9, 23], end: [10, 22] },
    { sign: 'Scorpio', start: [10, 23], end: [11, 21] },
    { sign: 'Sagittarius', start: [11, 22], end: [12, 21] }
  ];

  for (const { sign, start, end } of signs) {
    if (
      (month === start[0] && day >= start[1]) ||
      (month === end[0] && day <= end[1])
    ) {
      return sign;
    }
  }
  return 'Capricorn';
};

// Helper function to calculate birth path number
const calculateBirthPath = (dateOfBirth) => {
  const digits = dateOfBirth.replace(/-/g, '').split('').map(Number);
  let sum = digits.reduce((acc, digit) => acc + digit, 0);
  
  // Reduce to single digit (except master numbers 11, 22, 33)
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split('').map(Number).reduce((acc, digit) => acc + digit, 0);
  }
  
  return sum.toString();
};

// MAIN FUNCTION - Replace your existing handleSubmit with this
const handleSubmit = async (userData) => {
  console.log('[Language Flow] Form submitted with language:', userData.language);
  setIsSubmitting(true);
  setError(null);
  
  try {
    // Store user data in state
    setName(userData.name);
    setDateOfBirth(userData.dateOfBirth);
    setSelectedLanguage(userData.language);

    // Calculate zodiac sign locally (no API call needed)
    const zodiacSign = calculateZodiacSign(userData.dateOfBirth);
    setZodiacSign(zodiacSign);

    console.log('🎴 Fetching trial reading from FastAPI...');
    console.log('📊 User data:', {
      name: userData.name,
      zodiacSign: zodiacSign,
      language: userData.language
    });

    // Call FastAPI daily_affirmation endpoint for trial users
    // FIXED: Only send birthPath for trial users (no hardcoded favorite/lucky numbers)
    const readingRequest = {
      userData: {
        nfc_id: `trial_${Date.now()}`,
        name: userData.name,
        zodiacSign: zodiacSign,
        language: userData.language,
        preferences: {
          color: { 
            name: 'Cosmic Purple', 
            value: '#A59AD1' 
          },
          interests: [],
          numbers: {
            birthPath: calculateBirthPath(userData.dateOfBirth)
            // REMOVED: favoriteNumber (was '7')
            // REMOVED: luckyNumber (was '3')
            // AI will only reference birthPath for trial users
          }
        }
      }
    };

    console.log('📤 Trial reading request:', readingRequest);

    // Call FastAPI
    const data = await window.API_CONFIG.post(
      window.API_CONFIG.ENDPOINTS.DAILY_AFFIRMATION,
      readingRequest
    );

    console.log('✅ Trial reading received from FastAPI:', data);

    if (!mountedRef.current) return;
    
    if (data.success && data.data) {
      setCardName(data.data.cardName);
      setCardImage(data.data.cardImage);
      setInterpretation(data.data.interpretation);
      setSelectedLanguage(userData.language);
      
      console.log('🎊 Moving to Step 2 with personalized reading');
      setStep(2);
    } else {
      throw new Error(data.message || 'Failed to generate reading');
    }

  } catch (error) {
    console.error('❌ Error in handleSubmit:', error);
    
    if (mountedRef.current) {
      setError(error.message || 'An error occurred while connecting to the cosmic energies. Please try again.');
      
      if (error.message && error.message.includes('Failed to fetch')) {
        setError('Unable to connect to the cosmic servers. Please check your connection and try again.');
      } else if (error.message && error.message.includes('API_CONFIG')) {
        setError('API configuration not loaded. Please refresh the page.');
      }
    }
  } finally {
    if (mountedRef.current) {
      setIsSubmitting(false);
    }
  }
};

  const handleNFCSubmit = async (userData) => {
    try {
      setIsSubmitting(true);
      // API call to register NFC user
      const response = await fetch('${API_BASE_URL}/api/nfc/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
  
      if (!response.ok) throw new Error('Registration failed');
      
      const data = await response.json();
      setNfcId(data.nfcId);
      setStep(2);
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

const handleCardReveal = React.useCallback(() => {
  console.log("Transitioning to Step3 with:", {
    name,
    zodiacSign,
    isPremium,
    interpretation,
    cardImage,
    cardName,
    premiumCards
  });
  setStep(3);
}, [name, zodiacSign, isPremium, interpretation, cardImage, cardName, premiumCards]);

  const handleSignUpPro = React.useCallback(() => {
    setPreviousStep(step);
    setStep(4);
    document.body.classList.add('modal-active');
    document.getElementById('modal-container').classList.add('four');
  }, [step]);

  const handleExplore = React.useCallback(() => {
    setPreviousStep(step);
    setStep(5);
    document.body.classList.add('modal-active');
    document.getElementById('modal-container').classList.add('four');
  }, [step]);

  const handleClose = React.useCallback(() => {
    document.getElementById('modal-container').classList.add('out');
    document.body.classList.remove('modal-active');
    setTimeout(() => {
      setStep(previousStep);
      document.getElementById('modal-container').classList.remove('four', 'out');
    }, 500);
  }, [previousStep]);

  const toggleMute = React.useCallback(() => {
    setIsMuted(prev => !prev);
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play().then(() => {
          audioRef.current.muted = !isMuted;
        }).catch(error => console.log('Audio play prevented:', error));
      } else {
        audioRef.current.muted = !isMuted;
      }
    }
  }, [isMuted]);

  const handleRestart = React.useCallback(() => {
    setStep(1);
    setName('');
    setDateOfBirth('');
    setEmail('');
    setZodiacSign('');
    setCardName('');
    setCardImage('');
    setInterpretation('');
    setAffirmations([]);
    
    if (window.zoomBackground) {
      window.zoomBackground(0.3, 3400);
    }
  }, []);

  const handleBackToStep0 = React.useCallback(() => {
    setStep(0);
    setName('');
    setDateOfBirth('');
    setEmail('');
    setColor({
      name: 'Cosmic Purple',
      value: '#A59AD1'
    });
    setError(null);
    
    if (window.zoomBackground) {
      window.zoomBackground(0.3, 1000);
    }
  }, []);

  const handleCloseDevPanel = React.useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setDevPanel(false);
    }, 500);
  }, []);

  

  return (
    <React.Fragment>
      {isLoading && <CosmicLoader type="initial" onLoadingComplete={handleLoadingComplete} />}
      {contentVisible && (
        <div className="parent-container" onClick={handleUserInteraction}>
          {step === 0 && !showDailyReading && (
  <Step0
    onTryFree={handleTryFree}
    onExplore={handleDailyReading}
    onPosterRegistration={handlePosterRegistration}
  />
)}

          {showDailyReading && nfcUserData ? (
  <div className="container">
    <NFCStep2 
      userData={nfcUserData} 
      error={error}
      onError={() => {
        setError(null);
        setShowDailyReading(false);
            }}
          />
        </div>
      ) : (error && (
        <div className="error-message cosmic-gradient">
          <p>{error}</p>
        </div>
      ))}

      {step === 1 && (
        <React.Fragment>
          {isNFCUser || isNFCRegistration ? (
            <RegistrationFlow 
              onRegistrationComplete={(userData) => {
                console.log('Registration completed in TarotApp:', userData);
                // No need to set step or modify state
                // Let NFCUserRegistration handle the success screen
              }}
              onError={(error) => {
                setError(error);
                setIsNFCRegistration(false);
              }}
            />
          ) : isPremium ? (
            <Step1Premium
              onComplete={handleSubmit}
              isSubmitting={isSubmitting}
              error={error}
            />
          ) : (
            <Step1Trial
              onComplete={handleSubmit}
              isSubmitting={isSubmitting}
              error={error}
            />
          )}
        </React.Fragment>
      )}

      {step === 2 && (
          <React.Fragment>
            {console.log('Step 2 reached, userData:', nfcUserData)}
            {isNFCUser || isNFCRegistration ? (
        <NFCStep2
          name={name}
          cardImage={cardImage}
          zodiacSign={zodiacSign}
          userData={nfcUserData}
          handleCardReveal={handleCardReveal}
        />
            ) : isPremium ? (
        <PremiumStep2
          name={name}
          cardImages={premiumCards}
          handleCardReveal={handleCardReveal}
        />
            ) : (
        <TrialStep2
          name={name}
          cardImage={cardImage}
          handleCardReveal={handleCardReveal}
          zodiacSign={zodiacSign}
        />
            )}
          </React.Fragment>
      )}

{showAdmin && (
  <React.Fragment>
    <button onClick={() => {
      setShowAdmin(false);
      setStep(0);
    }} className="back-button">
      <img src="/static/icons/back.svg" alt="Back" className="back-icon" />
    </button>
    {window.AdminPanelLoader ? 
      <window.AdminPanelLoader
        appState={{
          step,
          setStep,
          isPremium,
          setIsPremium,
          resetState: () => {
            setStep(0);
            setIsPremium(false);
            setIsPremiumReading(false);
            setIsNFCUser(false);
            setIsNFCRegistration(false);
            setName('');
            setDateOfBirth('');
            setEmail('');
            setZodiacSign('');
            setCardName('');
            setCardImage('');
            setInterpretation('');
            setAffirmations([]);
            setPremiumCards([]);
            setNfcUserData(null);
            localStorage.clear();
          },
          onCloseAdminPanel: () => {
            setShowAdmin(false);
            setStep(0);
          }
        }}
        onClose={() => {
          setShowAdmin(false);
          setStep(0);
        }}
      /> :
      <div className="admin-panel-loading">
        <p>Loading admin panel...</p>
      </div>
    }
  </React.Fragment>
)}

      {step === 3 && (
        <React.Fragment>
          {isNFCUser || isNFCRegistration ? (
            null // NFC flow doesn't use step 3
          ) : isPremium ? (
            <window.PremiumStep3
              name={name}
              zodiacSign={zodiacSign}
              premiumCards={premiumCards}
              interpretation={interpretation}
              language={selectedLanguage}
            />
          ) : (
            <window.TrialStep3
              name={name}
              zodiacSign={zodiacSign}
              cardName={cardName}
              cardImage={cardImage}
              interpretation={interpretation}
              language={selectedLanguage}
              onSignUpPro={handleSignUpPro}
            />
          )}
        </React.Fragment>
      )}
          
          {step === 3 && !isNFCUser && !isNFCRegistration && (
            <button onClick={handleRestart} className="restart-button">
              <img src="/static/icons/restart.svg" alt="Restart" className="restart-icon" />
            </button>
          )}
          
          {step === 1 && (
            <button onClick={handleBackToStep0} className="back-button">
              <img src="/static/icons/back.svg" alt="Back" className="back-icon" />
            </button>
          )}
        </div>
      )}
  
      {isDev && devPanel && (
        <DevPanel 
          step={step}
          setStep={setStep}
          isPremium={isPremium}
          setIsPremium={setIsPremium}
          isNFCUser={isNFCUser}
          setIsNFCUser={setIsNFCUser}
          isClosing={isClosing}
          onClose={handleCloseDevPanel}
          resetState={() => {
            setStep(0);
            setIsPremium(false);
            setIsPremiumReading(false);
            setIsNFCUser(false);
            setIsNFCRegistration(false);
            setName('');
            setDateOfBirth('');
            setEmail('');
            setZodiacSign('');
            setCardName('');
            setCardImage('');
            setInterpretation('');
            setAffirmations([]);
            setPremiumCards([]);
            setNfcUserData(null);
            localStorage.clear();
          }}
        />
      )}

      <div className="fixed-audio-control">
  <AudioButton isMuted={isMuted} toggleMute={toggleMute} />
</div>

    </React.Fragment>
);  
};

window.TarotApp = TarotApp;