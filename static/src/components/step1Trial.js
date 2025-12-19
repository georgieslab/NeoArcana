// ========================================
// NEOARCANA - STEP 1 TRIAL (REGISTRATION)
// Fixed version with CosmicButton properly integrated
// ========================================

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

  // Check if form is valid
  const isValid = name.trim() && dateOfBirth && email && validateEmail(email);

  return React.createElement("div", { className: "trial-registration" },
    React.createElement("div", { className: "trial-registration-inner" },
      
      // Step Indicator
      React.createElement("div", { className: "step-indicator" },
        React.createElement("div", { className: "step active" }, "1"),
        React.createElement("div", { className: "step" }, "2"),
        React.createElement("div", { className: "step" }, "3")
      ),

      // Title
      React.createElement("h1", { className: "trial-registration-title" },
        "Begin Your Free Cosmic Journey"
      ),

      // Form
      React.createElement("form", { 
        onSubmit: handleSubmit, 
        className: "trial-form" 
      },
        
        // Name Input
        React.createElement("div", { className: "trial-input-container" },
          React.createElement("img", {
            src: "/static/icons/user.svg",
            alt: "Name",
            className: "trial-input-icon"
          }),
          React.createElement("input", {
            type: "text",
            value: name,
            onChange: (e) => setName(e.target.value),
            placeholder: "Your Name",
            className: "trial-input",
            required: true,
            autoComplete: "name"
          })
        ),

        // Email Input
        React.createElement("div", { className: "trial-input-container" },
          React.createElement("img", {
            src: "/static/icons/mail.svg",
            alt: "Email",
            className: "trial-input-icon"
          }),
          React.createElement("input", {
            type: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            placeholder: "Your Email",
            className: "trial-input",
            required: true,
            autoComplete: "email"
          })
        ),

        // Date Input Component
        React.createElement(DateInput, {
          value: dateOfBirth,
          onChange: (value) => {
            console.log('Date of Birth selected:', value);
            setDateOfBirth(value);
          }
        }),

        // Language Select Component
        React.createElement(LanguageSelect, {
          selectedLanguage: language,
          onLanguageChange: setLanguage
        }),

        // Error Messages
        (error || parentError) && React.createElement("div", { 
          className: "trial-error-message" 
        }, error || parentError),

        // ✨ COSMIC SUBMIT BUTTON ✨
        React.createElement(CosmicButton, {
          type: "submit",           // ← Submit form (not onClick!)
          disabled: !isValid,       // ← Disable if form invalid
          isAnimating: isSubmitting, // ← Show particles while submitting
          variant: "primary",       // ← Purple variant
          className: "trial-submit-button"
        }, isSubmitting ? 'Finding Your Star...' : 'Begin Your Journey ✨'),

        // Premium Promo Section
        React.createElement("div", { className: "trial-premium-promo" },
          React.createElement("p", { className: "trial-premium-text" },
            "✨ Want a deeper insight?"
          ),
          // ✨ COSMIC UPGRADE BUTTON ✨
          React.createElement(CosmicButton, {
            onClick: handleUpgradeClick,
            variant: "premium",      // ← Gold variant
            type: "button",
            className: "trial-upgrade-button"
          }, "Unlock Premium Features")
        )
      )
    )
  );
};

window.Step1Trial = Step1Trial;