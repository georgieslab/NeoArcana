const LanguageSelect = ({ selectedLanguage, onLanguageChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectRef = React.useRef(null);
  const languages = window.getAvailableLanguages();

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get the name of the selected language, or default to 'Your Language'
  const selectedLanguageName = languages.find(lang => lang.code === selectedLanguage)
    ? languages.find(lang => lang.code === selectedLanguage).name
    : 'Your Language';

  return (
    <div className="cosmic-msd" ref={selectRef}>
      <div
        className="cosmic-msd-label"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img src="/static/icons/language.svg" alt="Language" className="input-icon" />
        <span className="label-text">
          {selectedLanguageName}
        </span>
      </div>

      {isOpen && (
        <div className="cosmic-msd-options-container">
          <div className="cosmic-msd-options-list">
            {languages.map((lang) => (
              <div
                key={lang.code}
                className={`cosmic-msd-option ${selectedLanguage === lang.code ? 'selected' : ''}`}
                onClick={() => {
                  onLanguageChange(lang.code);
                  setIsOpen(false);
                }}
              >
                {lang.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

window.LanguageSelect = LanguageSelect;
