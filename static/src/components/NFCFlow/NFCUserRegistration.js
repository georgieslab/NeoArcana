// Updated NFCUserRegistration component with FastAPI integration
// 🔄 CHANGED: Now uses API_CONFIG to connect to FastAPI backend
const NFCUserRegistration = ({ onComplete, onError, posterCode: initialPosterCode }) => {
  const mounted = React.useRef(true);
  const [registrationSuccess, setRegistrationSuccess] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [currentStep, setCurrentStep] = React.useState(1);

  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const [formData, setFormData] = React.useState({
    name: '',
    dateOfBirth: '',
    gender: '',
    color: {
      name: 'Cosmic Purple',
      value: '#A59AD1'
    },
    interests: [],
    language: 'en',
    posterCode: initialPosterCode,
    futurePlans: '',
    numbers: {
      favoriteNumber: '',
      luckyNumber: '',
      guidanceNumber: ''
    }
  });

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

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!mounted.current) return;
    
    setFormError(null);
    setIsSubmitting(true);
  
    try {
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
          numbers: formData.numbers,
        },
      };

      // 🔄 CHANGED: Using API_CONFIG for FastAPI connection
      // OLD: const response = await fetch('/api/nfc/register', {...})
      console.log('🚀 Submitting registration to FastAPI:', window.API_CONFIG.BASE_URL);
      
      const data = await window.API_CONFIG.post(
        window.API_CONFIG.ENDPOINTS.REGISTER,
        registrationData
      );

      // API_CONFIG.post() automatically handles response parsing and errors
      console.log('✅ Registration successful:', data);

      if (mounted.current) {
        setRegistrationSuccess(true);
        if (onComplete) {
          onComplete(data);
        }
      }

    } catch (err) {
      // API_CONFIG.post() throws errors with descriptive messages
      console.error('❌ Registration error:', err);
      if (mounted.current) {
        setFormError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      if (mounted.current) {
        setIsSubmitting(false);
      }
    }
  };

  if (registrationSuccess) {
    return React.createElement('div', {
      className: 'neo-container neo-success-container'
    }, [
      React.createElement('h1', {
        key: 'title',
        className: 'neo-title neo-gradient-text'
      }, '✨ Registration Complete! ✨'),
      
      React.createElement('div', {
        key: 'success-content',
        className: 'neo-success-content'
      }, [
        React.createElement('p', {
          key: 'welcome',
          className: 'neo-welcome-message'
        }, `Welcome to your cosmic journey, ${formData.name}!`),
        
        React.createElement('div', {
          key: 'details',
          className: 'neo-details'
        }, [
          React.createElement('p', { key: 'color' }, 
            `Your cosmic color: ${formData.color.name}`
          ),
          React.createElement('p', { key: 'zodiac' }, 
            `Zodiac Sign: ${calculateZodiacSign(formData.dateOfBirth)}`
          ),
          React.createElement('p', { key: 'interests' },
            `Focus Areas: ${formData.interests.join(', ')}`
          )
        ]),
        
        React.createElement('button', {
          key: 'home-button',
          className: 'neo-button',
          onClick: () => window.location.href = '/'
        }, '✨ Return to Main Menu ✨')
      ])
    ]);
  }

  const renderStep1 = () => 
    React.createElement('div', {
      className: 'neo-registration-step'
    }, [
      React.createElement('h1', {
        key: 'title',
        className: 'neo-title neo-gradient-text'
      }, 'Welcome to Your Cosmic Journey'),
      
      // Name input
      React.createElement('div', {
        key: 'name-container',
        className: 'neo-input-container'
      }, [
        React.createElement('img', {
          key: 'user-icon',
          src: '/static/icons/user.svg',
          alt: 'User',
          className: 'neo-input-icon'
        }),
        React.createElement('input', {
          key: 'name-input',
          type: 'text',
          value: formData.name,
          onChange: (e) => setFormData({ ...formData, name: e.target.value }),
          placeholder: 'Your Name',
          className: 'neo-input',
          required: true
        })
      ]),
      
      // Date input
      React.createElement(DateInput, {
        key: 'date-input',
        value: formData.dateOfBirth,
        onChange: (date) => setFormData({ ...formData, dateOfBirth: date })
      }),
  
      // Gender select
      React.createElement(GenderSelect, {
        key: 'gender-select',
        selectedGender: formData.gender,
        onGenderChange: (gender) => setFormData({ ...formData, gender })
      }),
  
      // Continue button
      React.createElement('button', {
        key: 'continue-button',
        className: 'cosmic-glassy-button2',
        onClick: () => setCurrentStep(2),
        disabled: !formData.name || !formData.dateOfBirth
      }, 'Continue Your Journey ✨')
    ]);

  const renderStep2 = () => 
    React.createElement('div', {
      className: 'neo-registration-step'
    }, [
      React.createElement('h1', {
        key: 'title',
        className: 'neo-title neo-gradient-text'
      }, 'Choose Your Cosmic Energy'),
  
      React.createElement('div', {
        key: 'premium-fields',
        className: 'neo-premium-fields'
      }, [
        React.createElement(ColorPicker, {
          key: 'color-picker',
          selectedColor: formData.color,
          onColorChange: (color) => setFormData({ ...formData, color })
        }),
  
        React.createElement(LanguageSelect, {
          key: 'language-select',
          selectedLanguage: formData.language,
          onLanguageChange: (language) => setFormData({ ...formData, language })
        }),
  
        React.createElement('div', {
          key: 'numerology',
          className: 'neo-numerology-section'
        }, [
          React.createElement('h3', {
            key: 'numbers-title',
            className: 'neo-subtitle'
          }, 'Your Cosmic Numbers'),
  
          // Number inputs
          React.createElement('div', {
            key: 'favorite-number',
            className: 'neo-input-container'
          }, [
            React.createElement('img', {
              key: 'star-icon',
              src: '/static/icons/star.svg',
              alt: 'Favorite',
              className: 'neo-input-icon'
            }),
            React.createElement('input', {
              key: 'favorite-input',
              type: 'number',
              min: '0',
              max: '99',
              value: formData.numbers.favoriteNumber,
              onChange: (e) => setFormData({
                ...formData,
                numbers: {
                  ...formData.numbers,
                  favoriteNumber: e.target.value
                }
              }),
              placeholder: 'Your Favorite Number (0-99)',
              className: 'neo-input'
            })
          ]),
  
          // Lucky number input
          React.createElement('div', {
            key: 'lucky-number',
            className: 'neo-input-container'
          }, [
            React.createElement('img', {
              key: 'clover-icon',
              src: '/static/icons/clover.svg',
              alt: 'Lucky',
              className: 'neo-input-icon'
            }),
            React.createElement('input', {
              key: 'lucky-input',
              type: 'number',
              min: '0',
              max: '99',
              value: formData.numbers.luckyNumber,
              onChange: (e) => setFormData({
                ...formData,
                numbers: {
                  ...formData.numbers,
                  luckyNumber: e.target.value
                }
              }),
              placeholder: 'Your Lucky Number (0-99)',
              className: 'neo-input'
            })
          ]),
  
          // Guidance number input
          React.createElement('div', {
            key: 'guidance-number',
            className: 'neo-input-container'
          }, [
            React.createElement('img', {
              key: 'compass-icon',
              src: '/static/icons/compass.svg',
              alt: 'Guidance',
              className: 'neo-input-icon'
            }),
            React.createElement('input', {
              key: 'guidance-input',
              type: 'number',
              min: '0',
              max: '99',
              value: formData.numbers.guidanceNumber,
              onChange: (e) => setFormData({
                ...formData,
                numbers: {
                  ...formData.numbers,
                  guidanceNumber: e.target.value
                }
              }),
              placeholder: 'Your Guidance Number (0-99)',
              className: 'neo-input'
            })
          ])
        ])
      ]),
  
      React.createElement('div', {
        key: 'button-container',
        className: 'neo-button-container'
      }, [
        React.createElement('button', {
          key: 'next-button',
          className: 'cosmic-glassy-button2',
          onClick: () => setCurrentStep(3),
          disabled: !formData.numbers.favoriteNumber || 
                   !formData.numbers.luckyNumber || 
                   !formData.numbers.guidanceNumber
        }, 'Next Step ✨'),
        
        React.createElement('button', {
          key: 'back-button',
          className: 'neo-text-button',
          onClick: () => setCurrentStep(1)
        }, 'Go Back')
      ])
    ]);

  const renderStep3 = () => 
    React.createElement('div', {
      className: 'neo-registration-step'
    }, [
      React.createElement('h1', {
        key: 'title',
        className: 'neo-title neo-gradient-text'
      }, 'Choose Your Cosmic Focus'),
  
      React.createElement(InterestsPicker, {
        key: 'interests-picker',
        selectedInterests: formData.interests,
        onInterestsChange: (interests) => setFormData({ ...formData, interests })
      }),
  
      React.createElement('div', {
        key: 'plans-container',
        className: 'neo-input-container'
      }, [
        React.createElement('textarea', {
          key: 'plans-input',
          value: formData.futurePlans,
          onChange: (e) => setFormData({ ...formData, futurePlans: e.target.value }),
          placeholder: 'What are your dreams and aspirations for the future? (minimum 25 characters)',
          className: 'neo-textarea',
          rows: 4,
          minLength: 25
        }),
        React.createElement('div', {
          key: 'char-count',
          className: 'neo-character-count'
        }, `${formData.futurePlans.length}/25 characters`)
      ]),
  
      React.createElement('div', {
        key: 'button-container',
        className: 'neo-button-container'
      }, [
        React.createElement('button', {
          key: 'submit-button',
          className: 'cosmic-glassy-button1',
          onClick: handleSubmit,
          disabled: isSubmitting || 
                   formData.interests.length === 0 || 
                   formData.futurePlans.length < 25
        }, isSubmitting ? 'Connecting to the Universe...' : 'Complete Registration ✨'),
        
        React.createElement('button', {
          key: 'back-button',
          className: 'neo-text-button',
          onClick: () => setCurrentStep(2)
        }, 'Go Back')
      ])
    ]);

  return React.createElement('div', {
    className: 'neo-container'
  }, [
    React.createElement('div', {
      key: 'step-indicator',
      className: 'neo-step-indicator'
    }, [
      React.createElement('div', {
        key: 'step1',
        className: `neo-step ${currentStep >= 1 ? 'active' : ''}`
      }, '1'),
      React.createElement('div', {
        key: 'step2',
        className: `neo-step ${currentStep >= 2 ? 'active' : ''}`
      }, '2'),
      React.createElement('div', {
        key: 'step3',
        className: `neo-step ${currentStep >= 3 ? 'active' : ''}`
      }, '3')
    ]),
  
    // Error display
    (error || formError) && React.createElement('div', {
      key: 'error-container',
      className: 'neo-error-container neo-fade-in'
    }, 
      React.createElement('div', {
        className: 'neo-error-message'
      }, [
        React.createElement('p', { key: 'error-text' }, error || formError),
        ((error && error.includes('already registered')) || 
         (formError && formError.includes('already registered'))) &&
          React.createElement('button', {
            key: 'error-button',
            className: 'neo-button neo-button--secondary',
            onClick: () => {
              setError(null);
              setFormError(null);
              window.location.reload();
            }
          }, 'Try Different Code ✨')
      ])
    ),
  
    // Form
    React.createElement('form', {
      key: 'registration-form',
      onSubmit: (e) => e.preventDefault(),
      className: 'neo-form'
    }, [
      currentStep === 1 ? renderStep1() : null,
      currentStep === 2 ? renderStep2() : null,
      currentStep === 3 ? renderStep3() : null
    ])
  ]);
};

window.NFCUserRegistration = NFCUserRegistration;