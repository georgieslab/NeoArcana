// RegistrationFlow.js - Fixed to use FastAPI endpoints
const RegistrationFlow = ({ onRegistrationComplete, onError }) => {
  const [currentView, setCurrentView] = React.useState('welcome');
  const [posterCode, setPosterCode] = React.useState('');
  const [existingUser, setExistingUser] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Check URL for posterCode parameter
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlPosterCode = urlParams.get('posterCode');
    if (urlPosterCode) {
      console.log('RegistrationFlow: Poster code from URL:', urlPosterCode);
      setPosterCode(urlPosterCode);
      // Auto-verify if we have the code
      handleWelcomeSubmit({ preventDefault: () => {} }, urlPosterCode);
    }
  }, []);

  const handleWelcomeSubmit = async (e, prefilledCode) => {
    e.preventDefault();
    const codeToVerify = prefilledCode || posterCode;
    
    console.log('RegistrationFlow: Verifying poster code:', codeToVerify);
    setIsSubmitting(true);
    setError(null);

    try {
      // NEW: Call FastAPI verify_poster endpoint
      console.log('🔍 Calling FastAPI verify_poster:', window.API_CONFIG.BASE_URL);
      
      const data = await window.API_CONFIG.post(
        window.API_CONFIG.ENDPOINTS.VERIFY_POSTER,
        { nfc_id: codeToVerify }
      );

      console.log('✅ Verification response:', data);

      if (data.success) {
        if (data.existingUser) {
          console.log('RegistrationFlow: Existing user detected, loading data');
          setExistingUser(data.userData);
          setCurrentView('form');
        } else {
          console.log('RegistrationFlow: New user, showing form');
          setCurrentView('form');
        }
      } else {
        throw new Error(data.message || 'Invalid poster code');
      }
    } catch (err) {
      console.error('❌ Verification error:', err);
      setError(err.message || 'Failed to verify poster code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (userData) => {
    console.log('RegistrationFlow: Form submitted with data:', userData);
    setIsSubmitting(true);
    setError(null);

    try {
      // Add poster code to user data
      const registrationData = {
        ...userData,
        posterCode: posterCode
      };

      console.log('📤 Calling FastAPI register:', window.API_CONFIG.BASE_URL);

      // NEW: Call FastAPI register endpoint
      const data = await window.API_CONFIG.post(
        window.API_CONFIG.ENDPOINTS.REGISTER,
        registrationData
      );

      console.log('✅ Registration response:', data);

      if (data.success) {
        // Show success view briefly
        setCurrentView('success');
        
        // Call parent callback with the complete user data
        setTimeout(() => {
          if (onRegistrationComplete) {
            onRegistrationComplete({
              ...data,
              nfc_id: data.nfcId,
              user_data: userData
            });
          }
        }, 2000);
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('❌ Registration error:', err);
      setError(err.message || 'Failed to register');
      setCurrentView('form'); // Stay on form to show error
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render different views based on state
  if (currentView === 'welcome') {
    return React.createElement(window.WelcomeScreen, {
      posterCode: posterCode,
      onPosterCodeChange: setPosterCode,
      onSubmit: handleWelcomeSubmit,
      error: error,
      isSubmitting: isSubmitting
    });
  }

  if (currentView === 'form') {
    return React.createElement(window.NFCUserRegistration, {
      posterCode: posterCode,
      existingUserData: existingUser,
      onSubmit: handleFormSubmit,
      onError: (err) => {
        setError(err);
        if (onError) onError(err);
      },
      isSubmitting: isSubmitting,
      error: error
    });
  }

  if (currentView === 'success') {
    return React.createElement('div', { className: 'registration-success' },
      React.createElement('div', { className: 'success-icon' }, '✨'),
      React.createElement('h2', { className: 'cosmic-text' }, 'Registration Complete!'),
      React.createElement('p', null, 'Connecting to your cosmic reading...'),
      React.createElement('div', { className: 'cosmic-loader' })
    );
  }

  return null;
};

window.RegistrationFlow = RegistrationFlow;