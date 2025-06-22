// Updated RegistrationFlow component with new class names
const RegistrationFlow = ({ onRegistrationComplete, onError }) => {
  const mounted = React.useRef(true);
  const [showWelcome, setShowWelcome] = React.useState(true);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [verifiedPosterCode, setVerifiedPosterCode] = React.useState(null);

  // Add cleanup effect
  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleRegistrationComplete = (data) => {
    if (!mounted.current) return;
    console.log('Registration completed:', data);
    // Just handle the success, don't try to update parent state
    if (onRegistrationComplete) {
      onRegistrationComplete(data);
    }
  };

  const handleWelcomeSubmit = async (code) => {
    try {
      if (!mounted.current) return;
      console.log('RegistrationFlow: Verifying poster code:', code);
      setIsVerifying(true);
      setError(null);

      const response = await fetch('/api/nfc/verify_poster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ posterCode: code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify code');
      }

      if (mounted.current) {
        setVerifiedPosterCode(code);
        console.log('RegistrationFlow: Poster code verified:', code);
        setShowWelcome(false);
      }
    } catch (err) {
      console.error('Verification error:', err);
      if (mounted.current) {
        setError(err.message);
        if (onError) onError(err.message);
      }
    } finally {
      if (mounted.current) {
        setIsVerifying(false);
      }
    }
  };

  // Render welcome screen
  if (showWelcome) {
    return React.createElement('div', {
      className: 'neo-registration-flow'
    },
      React.createElement(WelcomeScreen, {
        onCodeSubmit: handleWelcomeSubmit,
        isLoading: isVerifying,
        error: error
      })
    );
  }

  // Render registration form
  return React.createElement('div', {
    className: 'neo-registration-flow'
  }, 
    React.createElement(NFCUserRegistration, {
      key: verifiedPosterCode, // Add key to ensure fresh mount
      posterCode: verifiedPosterCode,
      onComplete: handleRegistrationComplete,
      onError: (errorMsg) => {
        if (mounted.current) {
          setError(errorMsg);
          setShowWelcome(true);
        }
      },
      isSubmitting: isVerifying
    })
  );
};

window.RegistrationFlow = RegistrationFlow;