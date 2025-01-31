const Step1Premium = ({ onComplete, isSubmitting, error: parentError }) => {
  const [name, setName] = React.useState('');
  const [dateOfBirth, setDateOfBirth] = React.useState('');
  const [language, setLanguage] = React.useState('en');
  const [error, setError] = React.useState(null);
  const [gender, setGender] = React.useState('');
  const [interests, setInterests] = React.useState([]);
  const [color, setColor] = React.useState({
    name: 'Cosmic Purple',
    value: '#A59AD1'
  });

  const mountedRef = React.useRef(true);

  React.useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation checks (keep your existing validation)
    if (!name.trim() || !dateOfBirth) {
      setError('Please fill in all required fields');
      return;
    }
  
    try {

      const userData = {
        name: name.trim(),
        dateOfBirth,
        isPremium: true,
        language, // Add this line
        gender,
        interests,
        color
      };
  
      
      console.log('Submitting user data:', userData);
      await onComplete(userData);
    } catch (error) {
      console.error('Error during onComplete:', error);
      setError('An error occurred. Please try again.');
        }
  };

  return (
    <div className="step1-container">
      <div className="step-indicator">
        <div className="step active">1</div>
        <div className="step">2</div>
        <div className="step">3</div>
      </div>

      <div className="premium-badge-container">
        <span className="premium-badge">✨ PREMIUM</span>
      </div>

      <h1 className="premium-title">Harness the Stars' Power</h1>

      <form onSubmit={handleSubmit} className="cosmic-form">
        <div className="input-container">
          <img src="/static/icons/user.svg" alt="" className="input-icon" />
          <input
            type="text"
            value={name}
            onChange={(e) => mountedRef.current && setName(e.target.value)}
            placeholder="Your Name"
            className="input"
            required
            autoComplete="off"
            disabled={isSubmitting}
          />
        </div>

        <DateInput
  value={dateOfBirth}
  onChange={(value) => {
    console.log('Date of Birth selected:', value);
    setDateOfBirth(value);
  }}
/>

<LanguageSelect 
  selectedLanguage={language}
  onLanguageChange={(value) => {
    if (mountedRef.current) {
      console.log('Language selected:', value);
      setLanguage(value);
    }
  }}
/>

        <div className="premium-fields">
          <GenderSelect 
            selectedGender={gender}
            onGenderChange={(value) => {
              if (mountedRef.current) {
                console.log('Gender selected:', value);
                setGender(value);
              }
            }}
          />

          <InterestsPicker 
            selectedInterests={interests}
            onInterestsChange={(values) => {
              if (mountedRef.current) {
                console.log('Interests selected:', values);
                setInterests(values);
              }
            }}
          />

          <ColorPicker 
            selectedColor={color}
            onColorChange={(value) => {
              if (mountedRef.current) {
                console.log('Color selected:', value);
                setColor(value);
              }
            }}
          />
        </div>

        {(error || parentError) && (
          <div className="error-message">
            {error || parentError}
          </div>
        )}

<CosmicButton 
  onClick={handleSubmit}
  disabled={isSubmitting}
  isAnimating={isSubmitting}
>
  {isSubmitting ? 'Finding Your Star...' : 'Reveal Your Path'}
</CosmicButton>

        <div className="premium-indicator">
          <span className="premium-star">✨</span>
          Premium Features Enabled
        </div>
      </form>
    </div>
  );
};

window.Step1Premium = Step1Premium;