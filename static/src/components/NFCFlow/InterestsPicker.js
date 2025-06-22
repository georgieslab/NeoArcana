// Improved InterestsPicker component with better layout and selection UI
const InterestsPicker = ({ selectedInterests, onInterestsChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const pickerRef = React.useRef(null);
  const isMobile = window.innerWidth <= 768;

  const interests = [
    "Spirituality", "Career", "Love", "Health",
    "Family", "Travel", "Money", "Education",
    "Personal Growth", "Creativity", "Relationships", "Life Purpose"
  ];

  React.useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isMobile]);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const toggleInterest = (interest) => {
    const newInterests = selectedInterests.includes(interest)
      ? selectedInterests.filter(i => i !== interest)
      : [...selectedInterests, interest];
    onInterestsChange(newInterests);
  };

  return React.createElement('div', {
    className: `neo-dropdown neo-interests-picker ${isOpen ? 'open' : ''}`,
    ref: pickerRef,
    style: { width: '100%' } // Ensure full width
  }, [
    // Picker label
    React.createElement('div', {
      key: 'label',
      className: 'neo-dropdown-label',
      onClick: () => setIsOpen(!isOpen),
      role: 'button',
      tabIndex: 0,
      'aria-haspopup': 'true',
      'aria-expanded': isOpen
    }, [
      React.createElement('img', {
        key: 'icon',
        src: '/static/icons/interests.svg',
        alt: 'Interests',
        className: 'neo-dropdown-icon'
      }),
      React.createElement('span', {
        key: 'text',
        className: 'neo-dropdown-text'
      }, selectedInterests.length === 0 
          ? 'Select Your Interests' 
          : `${selectedInterests.length} Interests Selected`),
      React.createElement('div', {
        key: 'arrow',
        className: 'neo-dropdown-arrow'
      })
    ]),

    // Interests options
    isOpen && React.createElement(React.Fragment, {
      key: 'options-fragment'
    }, [
      // Mobile backdrop
      isMobile && React.createElement('div', {
        key: 'backdrop',
        className: 'neo-backdrop',
        onClick: () => setIsOpen(false)
      }),

      // Options container with improved styling and layout
      React.createElement('div', {
        key: 'options-container',
        className: 'neo-dropdown-options neo-interests-options-container',
        style: {
          width: '280px', // Fixed width to ensure proper sizing
          maxHeight: '421px', // Maximum height before scrolling
          overflow: 'auto', // Enable scrolling if needed
          padding: '12px', // Add padding for better spacing
          boxSizing: 'border-box',
          left: isMobile ? '50%' : '0',
          transform: isMobile ? 'translateX(-50%)' : 'none',
          backgroundColor: 'rgba(10, 10, 31, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(165, 154, 209, 0.3)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
        }
      }, [
        // Mobile header
        isMobile && React.createElement('div', {
          key: 'header',
          className: 'neo-dropdown-header',
          style: {
            borderBottom: '1px solid rgba(165, 154, 209, 0.2)',
            marginBottom: '12px',
            paddingBottom: '8px'
          }
        }, [
          React.createElement('h3', {
            key: 'title',
            style: {
              margin: 0,
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: '500'
            }
          }, 'Select Your Interests'),
          React.createElement('button', {
            key: 'close',
            className: 'neo-dropdown-close',
            onClick: () => setIsOpen(false),
            'aria-label': 'Close menu',
            style: {
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer'
            }
          }, '×')
        ]),

        // Interests grid layout
        React.createElement('div', {
          key: 'options',
          className: 'neo-interests-options',
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
            width: '100%'
          }
        }, 
          interests.map((interest) => 
            React.createElement('div', {
              key: interest,
              className: `neo-interest-option ${selectedInterests.includes(interest) ? 'selected' : ''}`,
              onClick: () => toggleInterest(interest),
              role: 'checkbox',
              'aria-checked': selectedInterests.includes(interest),
              tabIndex: 0,
              style: {
                padding: '10px 12px',
                borderRadius: '12px',
                cursor: 'pointer',
                position: 'relative',
                background: selectedInterests.includes(interest) ? 
                  'rgba(165, 154, 209, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                border: `1px solid ${selectedInterests.includes(interest) ? 
                  'rgba(165, 154, 209, 0.6)' : 'rgba(255, 255, 255, 0.2)'}`,
                color: selectedInterests.includes(interest) ? 
                  '#ffffff' : 'rgba(255, 255, 255, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                fontWeight: selectedInterests.includes(interest) ? '500' : '400'
              }
            }, [
              // Interest text
              React.createElement('span', {
                key: 'text'
              }, interest),
              
              // Checkmark for selected interests
              selectedInterests.includes(interest) && React.createElement('span', {
                key: 'check',
                className: 'neo-interest-checkmark',
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(165, 154, 209, 0.7)',
                  color: 'white',
                  fontSize: '12px'
                }
              }, '✓')
            ])
          )
        )
      ])
    ]),

    // Selected interests preview - improved display
    selectedInterests.length > 0 && React.createElement('div', {
      key: 'selected-preview',
      className: 'neo-interests-selected',
      style: {
        margin: '8px 0 0',
        padding: '8px 12px',
        borderRadius: '12px',
        backgroundColor: 'rgba(165, 154, 209, 0.1)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px'
      }
    }, [
      selectedInterests.slice(0, 3).map((interest, index) => 
        React.createElement('span', {
          key: interest,
          className: 'neo-interest-tag',
          style: {
            color: 'var(--neo-primary)',
            fontWeight: '500',
            display: 'inline-block',
            padding: '2px 6px',
            borderRadius: '8px',
            backgroundColor: 'rgba(165, 154, 209, 0.15)',
            fontSize: '0.9rem'
          }
        }, `${interest}${index < Math.min(selectedInterests.length - 1, 2) ? ',' : ''}`)
      ),
      selectedInterests.length > 3 && React.createElement('span', {
        key: 'more',
        className: 'neo-interest-more',
        style: {
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '0.8rem'
        }
      }, `+${selectedInterests.length - 3} more`)
    ])
  ]);
};

window.InterestsPicker = InterestsPicker;