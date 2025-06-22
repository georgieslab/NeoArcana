// Fixed GenderSelect.js component with proper width constraints
const GenderSelect = ({ selectedGender, onGenderChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectRef = React.useRef(null);
  const isMobile = window.innerWidth <= 768;

  const genders = [
    "Female",
    "Male",
    "Non-Binary",
    "Other",
    "Prefer not to say"
  ];

  React.useEffect(() => {
    if (isMobile && isOpen) {
      // Only prevent scroll on mobile
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
      if (selectRef.current && !selectRef.current.contains(event.target)) {
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

  const handleGenderSelect = (gender) => {
    onGenderChange(gender);
    setIsOpen(false);
  };

  return React.createElement('div', {
    className: `neo-dropdown neo-gender-select ${isOpen ? 'open' : ''}`,
    ref: selectRef,
    style: { width: '100%' } // Ensure full width
  }, [
    // Dropdown label
    React.createElement('div', {
      key: 'label',
      className: 'neo-dropdown-label',
      onClick: () => setIsOpen(!isOpen),
      role: 'button',
      tabIndex: 0,
      'aria-haspopup': 'listbox',
      'aria-expanded': isOpen,
      style: { 
        width: '100%', 
        boxSizing: 'border-box',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden'
      }
    }, [
      React.createElement('img', {
        key: 'icon',
        src: '/static/icons/gender.svg',
        alt: 'Gender',
        className: 'neo-dropdown-icon'
      }),
      React.createElement('span', {
        key: 'text',
        className: 'neo-dropdown-text',
        style: {
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap'
        }
      }, selectedGender || 'Select Gender'),
      React.createElement('div', {
        key: 'arrow',
        className: 'neo-dropdown-arrow'
      })
    ]),

    // Dropdown options
    isOpen && React.createElement(React.Fragment, {
      key: 'options-fragment'
    }, [
      // Mobile backdrop
      isMobile && React.createElement('div', {
        key: 'backdrop',
        className: 'neo-backdrop',
        onClick: () => setIsOpen(false)
      }),

      // Options container
      React.createElement('div', {
        key: 'options-container',
        className: 'neo-dropdown-options',
        role: 'listbox',
        style: { 
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }
      }, [
        // Mobile header
        isMobile && React.createElement('div', {
          key: 'header',
          className: 'neo-dropdown-header'
        }, [
          React.createElement('h3', {
            key: 'title'
          }, 'Select Gender'),
          React.createElement('button', {
            key: 'close',
            className: 'neo-dropdown-close',
            onClick: () => setIsOpen(false),
            'aria-label': 'Close menu'
          }, '×')
        ]),

        // Options list
        React.createElement('div', {
          key: 'options-list',
          className: 'neo-dropdown-options-list'
        }, 
          genders.map((gender) => 
            React.createElement('div', {
              key: gender,
              className: `neo-dropdown-option ${selectedGender === gender ? 'selected' : ''}`,
              onClick: () => handleGenderSelect(gender),
              role: 'option',
              'aria-selected': selectedGender === gender,
              tabIndex: 0
            }, gender)
          )
        )
      ])
    ])
  ]);
};

window.GenderSelect = GenderSelect;