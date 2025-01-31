const InterestsPicker = ({ selectedInterests, onInterestsChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const pickerRef = React.useRef(null);
  const isMobile = window.innerWidth <= 768;

  const interests = [
    "Spirituality",
    "Career",
    "Love",
    "Health",
    "Family",
    "Travel",
    "Money",
    "Education",
    "Personal Growth",
    "Creativity",
    "Relationships",
    "Life Purpose"
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

  return (
    <div className="cosmic-msd" ref={pickerRef}>
      <div 
        className="cosmic-msd-label"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <img 
          src="/static/icons/interests.svg" 
          alt="Interests" 
          className="input-icon" 
        />
        <span className="label-text">
          {selectedInterests.length === 0 
            ? 'Select Your Interests' 
            : `${selectedInterests.length} Selected`}
        </span>
        <img 
          src="/static/icons/star.svg" 
          alt="" 
          className={`cosmic-msd-label-icon ${isOpen ? 'open' : ''}`}
          aria-hidden="true"
        />
      </div>

      {isOpen && (
        <>
          {isMobile && (
            <div 
              className="cosmic-backdrop"
              onClick={() => setIsOpen(false)}
            />
          )}
          <div className="cosmic-msd-options-container">
            {isMobile && (
              <div className="cosmic-msd-options-header">
                <h3>Select Your Interests</h3>
                <button 
                  className="cosmic-msd-close"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                >
                  ×
                </button>
              </div>
            )}
            <div className="cosmic-msd-options-grid">
              {interests.map((interest) => (
                <div
                  key={interest}
                  className={`cosmic-msd-option ${selectedInterests.includes(interest) ? 'selected' : ''}`}
                  onClick={() => toggleInterest(interest)}
                  role="checkbox"
                  aria-checked={selectedInterests.includes(interest)}
                  tabIndex={0}
                >
                  <span className="option-text">{interest}</span>
                  {selectedInterests.includes(interest) && (
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
        </>
      )}

      {selectedInterests.length > 0 && (
        <div className="selected-interests-preview">
          {selectedInterests.slice(0, 2).map((interest, index) => (
            <span key={interest} className="preview-interest">
              {interest}{index < Math.min(selectedInterests.length - 1, 1) ? ', ' : ''}
            </span>
          ))}
          {selectedInterests.length > 2 && (
            <span className="preview-more">
              +{selectedInterests.length - 2} more
            </span>
          )}
        </div>
      )}
    </div>
  );
};

window.InterestsPicker = InterestsPicker;