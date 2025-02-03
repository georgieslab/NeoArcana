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

  return (
    <div className="cosmic-msd" ref={selectRef}>
      <div 
        className="cosmic-msd-label"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <img 
          src="/static/icons/gender.svg" 
          alt="Gender" 
          className="input-icon" 
        />
        <span className="label-text">
          {selectedGender || 'Select Gender'}
        </span>
        <img 
          src="/static/icons/star.svg" 
          alt="" 
          className={`cosmic-msd-label-icon ${isOpen ? 'open' : ''}`}
          aria-hidden="true"
        />
      </div>

      {isOpen && (
        <React.Fragment>
          {isMobile && (
            <div 
              className="cosmic-backdrop"
              onClick={() => setIsOpen(false)}
            />
          )}
          <div className="cosmic-msd-options-container" role="listbox">
            {isMobile && (
              <div className="cosmic-msd-options-header">
                <h3>Select Gender</h3>
                <button 
                  className="cosmic-msd-close"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                >
                  ×
                </button>
              </div>
            )}
            <div className="cosmic-msd-options-list">
              {genders.map((gender) => (
                <div
                  key={gender}
                  className={`cosmic-msd-option ${selectedGender === gender ? 'selected' : ''}`}
                  onClick={() => handleGenderSelect(gender)}
                  role="option"
                  aria-selected={selectedGender === gender}
                  tabIndex={0}
                >
                  <span className="option-text">{gender}</span>
                  {selectedGender === gender && (
                    <img 
                      src="/static/icons/check.svg" 
                      alt="" 
                      className="option-check"
                      aria-hidden="true"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          </React.Fragment>
      )}
    </div>
  );
};

window.GenderSelect = GenderSelect;