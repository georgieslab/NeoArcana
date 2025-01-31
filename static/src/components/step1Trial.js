const Step1Trial = ({ onComplete, isSubmitting, error: parentError }) => {
  const [name, setName] = React.useState('');
  const [dateOfBirth, setDateOfBirth] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [language, setLanguage] = React.useState('en');
  const [error, setError] = React.useState(null);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!name.trim() || !dateOfBirth || !email) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const userData = {
        name: name.trim(),
        dateOfBirth,
        email: email.trim(),
        language,
        isTrial: true,
        isPremium: false
      };

      await onComplete(userData);
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  const handleUpgradeClick = (e) => {
    e.preventDefault();
    window.open('https://www.georgies.work/shop', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="step1-container">
      {/* Step Indicator */}
      <div className="step-indicator">
        <div className="step active">1</div>
        <div className="step">2</div>
        <div className="step">3</div>
      </div>

      {/* Title */}
      <h1 className="title cosmic-gradient cosmic-text">
        Begin Your Free Cosmic Journey
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="cosmic-form">
        {/* Name Input */}
        <div className="input-container">
          <img src="/static/icons/user.svg" alt="Name" className="input-icon" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="input"
            required
            autoComplete="on"
          />
        </div>

        {/* Date Input */}
        <DateInput
          value={dateOfBirth}
          onChange={(value) => {
            console.log('Date of Birth selected:', value);
            setDateOfBirth(value);
          }}
        />

        {/* Language Select */}
        <LanguageSelect 
          selectedLanguage={language}
          onLanguageChange={setLanguage}
        />

        {/* Email Input */}
        <div className="input-container">
          <img src="/static/icons/mail.svg" alt="Email" className="input-icon" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            className="input"
            required
            autoComplete="off"
          />
        </div>

        {/* Error Messages */}
        {(error || parentError) && (
          <div className="error-message">
            {error || parentError}
          </div>
        )}

        {/* Submit Button */}
        <CosmicButton 
          onClick={handleSubmit}
          disabled={isSubmitting}
          isAnimating={isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? 'Finding Your Star...' : 'Begin Your Journey'}
        </CosmicButton>

        {/* Premium Promo */}
        <div className="premium-promo">
          <p>✨ Want a deeper insight?</p>
          <button 
            onClick={handleUpgradeClick} 
            className="cosmic-glassy-button2"
          >
            Access Premium
          </button>
        </div>
      </form>
    </div>
  );
};

window.Step1Trial = Step1Trial;