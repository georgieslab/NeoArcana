const NFCUserRegistration = ({ onComplete, onError, posterCode: initialPosterCode }) => {
  // State declarations
  const [error, setError] = React.useState(null);
  const [formError, setFormError] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(1);
  const [registrationSuccess, setRegistrationSuccess] = React.useState(false);

  console.log('NFCUserRegistration: Initializing with poster code:', initialPosterCode);

  const [formData, setFormData] = React.useState(() => ({
    name: '',
    dateOfBirth: '',
    gender: '',
    color: {
      name: 'Cosmic Purple',
      value: '#A59AD1'
    },
    interests: [],
    language: 'en',
    posterCode: initialPosterCode, // Use the passed poster code
    futurePlans: '',
    numbers: {
      favoriteNumber: '',
      luckyNumber: '',
      guidanceNumber: ''
    }
  }));

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);
    
    try {
      console.log('Starting registration process with data:', formData);
      
      if (!formData.posterCode && !initialPosterCode) {
        throw new Error('No poster code provided');
      }

      const registrationData = {
        posterCode: formData.posterCode || initialPosterCode,
        name: formData.name,
        dateOfBirth: formData.dateOfBirth,
        zodiacSign: calculateZodiacSign(formData.dateOfBirth),
        gender: formData.gender,
        preferences: {
          color: formData.color,
          interests: formData.interests,
          language: formData.language,
          numbers: formData.numbers
        }
      };

      console.log('Submitting registration data:', registrationData);

      const registerResponse = await fetch('/api/nfc/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(registrationData)
      });

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      const data = await registerResponse.json();
      console.log('Registration successful:', data);
      setRegistrationSuccess(true);
      if (onComplete) {
        onComplete(data);
      }
      
    } catch (err) {
      console.error('Registration error:', err);
      setFormError(err.message || 'Registration failed. Please try again.');
      if (onError) {
        onError(err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateZodiacSign = (dateStr) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
    return "Pisces";
  };

  if (registrationSuccess) {
    return React.createElement('div', {
      className: 'nfc-registration-container'
    }, [
      React.createElement('div', {
        className: 'success-container fade-in',
        key: 'success-container'
      }, [
        React.createElement('h1', {
          className: 'title cosmic-gradient cosmic-text',
          key: 'success-title'
        }, 'Registration Complete! ✨'),
        React.createElement('div', {
          className: 'success-message',
          key: 'success-message'
        }, [
          React.createElement('p', { key: 'p1' }, 'Your cosmic journey awaits! To receive your daily reading:'),
          React.createElement('ol', { key: 'instructions' }, [
            React.createElement('li', { key: 'step1' }, 'Find the NFC chip on your cosmic poster'),
            React.createElement('li', { key: 'step2' }, 'Tap your phone against it'),
            React.createElement('li', { key: 'step3' }, 'Receive your personalized cosmic guidance')
          ]),
          React.createElement('p', { key: 'p2', className: 'cosmic-text' }, '✨ See you in the stars! ✨')
        ])
      ])
    ]);
  }

  const renderStep1 = () => (
    <div className="registration-step">
      <h1 className="title cosmic-gradient cosmic-text">
        Welcome to Your Cosmic Journey
      </h1>
      
      <div className="input-container">
        <img src="/static/icons/user.svg" alt="User" className="input-icon" />
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Your Name"
          className="input"
          required
        />
      </div>

      <DateInput
        value={formData.dateOfBirth}
        onChange={(date) => setFormData({ ...formData, dateOfBirth: date })}
      />

      <GenderSelect
        selectedGender={formData.gender}
        onGenderChange={(gender) => setFormData({ ...formData, gender })}
      />

      <button 
        className="cosmic-glassy-button1"
        onClick={() => setCurrentStep(2)}
        disabled={!formData.name || !formData.dateOfBirth}
      >
        Continue Your Journey ✨
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="registration-step">
      <h1 className="title cosmic-gradient cosmic-text">
        Choose Your Cosmic Energy
      </h1>

      <div className="premium-fields">
        <ColorPicker
          selectedColor={formData.color}
          onColorChange={(color) => setFormData({ ...formData, color })}
        />

        <LanguageSelect
          selectedLanguage={formData.language}
          onLanguageChange={(language) => setFormData({ ...formData, language })}
        />

        <div className="numerology-section">
          <h3 className="section-title">Your Cosmic Numbers</h3>
          
          <div className="input-container">
            <img src="/static/icons/star.svg" alt="Favorite" className="input-icon" />
            <input
              type="number"
              min="0"
              max="99"
              value={formData.numbers.favoriteNumber}
              onChange={(e) => setFormData({
                ...formData,
                numbers: {
                  ...formData.numbers,
                  favoriteNumber: e.target.value
                }
              })}
              placeholder="Your Favorite Number (0-99)"
              className="input"
            />
          </div>

          <div className="input-container">
            <img src="/static/icons/clover.svg" alt="Lucky" className="input-icon" />
            <input
              type="number"
              min="0"
              max="99"
              value={formData.numbers.luckyNumber}
              onChange={(e) => setFormData({
                ...formData,
                numbers: {
                  ...formData.numbers,
                  luckyNumber: e.target.value
                }
              })}
              placeholder="Your Lucky Number (0-99)"
              className="input"
            />
          </div>

          <div className="input-container">
            <img src="/static/icons/compass.svg" alt="Guidance" className="input-icon" />
            <input
              type="number"
              min="0"
              max="99"
              value={formData.numbers.guidanceNumber}
              onChange={(e) => setFormData({
                ...formData,
                numbers: {
                  ...formData.numbers,
                  guidanceNumber: e.target.value
                }
              })}
              placeholder="Your Guidance Number (0-99)"
              className="input"
            />
          </div>
        </div>
      </div>

      <div className="button-container">
        <button 
          className="cosmic-glassy-button2"
          onClick={() => setCurrentStep(3)}
          disabled={!formData.numbers.favoriteNumber || 
                   !formData.numbers.luckyNumber || 
                   !formData.numbers.guidanceNumber}
        >
          Next Step ✨
        </button>
        
        <button 
          className="text-button-cosmic"
          onClick={() => setCurrentStep(1)}
        >
          Go Back
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="registration-step">
      <h1 className="title cosmic-gradient cosmic-text">
        Choose Your Cosmic Focus
      </h1>

      <InterestsPicker
        selectedInterests={formData.interests}
        onInterestsChange={(interests) => setFormData({ ...formData, interests })}
      />

      <div className="future-plans-container">
        <textarea
          value={formData.futurePlans}
          onChange={(e) => setFormData({ ...formData, futurePlans: e.target.value })}
          placeholder="What are your dreams and aspirations for the future? (minimum 25 characters)"
          className="textarea-input"
          rows={4}
          minLength={25}
        />
        <div className="character-count">
          {formData.futurePlans.length}/25 characters
        </div>
      </div>

      <div className="button-container">
        <button 
          className="cosmic-glassy-button1"
          onClick={handleSubmit}
          disabled={isSubmitting || 
                   formData.interests.length === 0 || 
                   formData.futurePlans.length < 25}
        >
          {isSubmitting ? 'Connecting to the Universe...' : 'Complete Registration ✨'}
        </button>
        
        <button 
          className="text-button-cosmic"
          onClick={() => setCurrentStep(2)}
        >
          Go Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="nfc-registration-container">
      <div className="step-indicator">
        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1</div>
        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2</div>
        <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3</div>
      </div>

      {/* Error display section */}
      {(error || formError) && (
        <div className="error-container fade-in">
          <div className="error-message cosmic-gradient">
            <p>{error || formError}</p>
            {(error || formError)?.includes('already registered') && (
              <button 
                className="cosmic-glassy-button2"
                onClick={() => {
                  setError(null);
                  setFormError(null);
                  window.location.reload();
                }}
              >
                Try Different Code ✨
              </button>
            )}
          </div>
        </div>
      )}
      
      <form onSubmit={(e) => e.preventDefault()} className="registration-form">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </form>
    </div>
  );
};

window.NFCUserRegistration = NFCUserRegistration;