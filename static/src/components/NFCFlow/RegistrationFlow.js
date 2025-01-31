// In RegistrationFlow.js
const RegistrationFlow = ({ onRegistrationComplete, onError }) => {
  const [showWelcome, setShowWelcome] = React.useState(true);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [verifiedPosterCode, setVerifiedPosterCode] = React.useState(null);

  const handleWelcomeSubmit = async (code) => {
    try {
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

      setVerifiedPosterCode(code); // Store the verified code
      console.log('RegistrationFlow: Poster code verified:', code);
      setShowWelcome(false);
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.message);
      if (onError) onError(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  if (showWelcome) {
    return React.createElement(WelcomeScreen, {
      onCodeSubmit: handleWelcomeSubmit,
      isLoading: isVerifying,
      error: error
    });
  }

  // Pass the verified poster code to NFCUserRegistration
  return React.createElement('div', {
    className: 'nfc-registration-flow'
  }, 
    React.createElement(NFCUserRegistration, {
      posterCode: verifiedPosterCode, // Pass the stored code
      onComplete: onRegistrationComplete,
      onError: (errorMsg) => {
        setError(errorMsg);
        setShowWelcome(true);
      },
      isSubmitting: isVerifying
    })
  );
};

window.RegistrationFlow = RegistrationFlow;