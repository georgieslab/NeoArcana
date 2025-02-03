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
        <span className="label-text">
          {selectedInterests.length === 0 
            ? 'Select Your Interests' 
            : `${selectedInterests.length} Interests Selected`}
        </span>
        <div className={`cosmic-msd-label-icon ${isOpen ? 'open' : ''}`}>
          ▼
        </div>
      </div>

      {isOpen && (
        <div className="cosmic-msd-options">
          {interests.map((interest) => (
            <label 
              key={interest}
              className="cosmic-msd-options-option"
            >
              <input
                type="checkbox"
                className="cosmic-msd-options-checkbox"
                checked={selectedInterests.includes(interest)}
                onChange={() => toggleInterest(interest)}
              />
              {interest}
              <span className="cosmic-checkbox-custom"></span>
            </label>
          ))}
        </div>
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