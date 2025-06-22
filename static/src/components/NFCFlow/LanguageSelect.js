// Updated LanguageSelect component with new class names
const LanguageSelect = ({ selectedLanguage, onLanguageChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectRef = React.useRef(null);
  const languages = window.getAvailableLanguages();
  const isMobile = window.innerWidth <= 768;

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

  // Get the name of the selected language, or default to 'Your Language'
  const selectedLanguageName = languages.find(lang => lang.code === selectedLanguage)
    ? languages.find(lang => lang.code === selectedLanguage).name
    : 'Your Language';

  return React.createElement('div', {
    className: `neo-dropdown neo-language-select ${isOpen ? 'open' : ''}`,
    ref: selectRef
  }, [
    // Language selector label
    React.createElement('div', {
      key: 'label',
      className: 'neo-dropdown-label',
      onClick: () => setIsOpen(!isOpen),
      role: 'button',
      tabIndex: 0,
      'aria-haspopup': 'listbox',
      'aria-expanded': isOpen
    }, [
      React.createElement('img', {
        key: 'icon',
        src: '/static/icons/language.svg',
        alt: 'Language',
        className: 'neo-dropdown-icon'
      }),
      React.createElement('span', {
        key: 'text',
        className: 'neo-dropdown-text'
      }, selectedLanguageName),
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
        role: 'listbox'
      }, [
        // Mobile header
        isMobile && React.createElement('div', {
          key: 'header',
          className: 'neo-dropdown-header'
        }, [
          React.createElement('h3', {
            key: 'title'
          }, 'Select Language'),
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
          languages.map((lang) => 
            React.createElement('div', {
              key: lang.code,
              className: `neo-dropdown-option ${selectedLanguage === lang.code ? 'selected' : ''}`,
              onClick: () => {
                onLanguageChange(lang.code);
                setIsOpen(false);
              },
              role: 'option',
              'aria-selected': selectedLanguage === lang.code
            }, lang.name)
          )
        )
      ])
    ])
  ]);
};

window.LanguageSelect = LanguageSelect;