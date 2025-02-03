const ColorPicker = ({ selectedColor, onColorChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const pickerRef = React.useRef(null);
  const isMobile = window.innerWidth <= 768;

  const defaultColor = {
    name: 'Cosmic Purple',
    value: '#A59AD1'
  };

  const currentColor = selectedColor || defaultColor;

  const colors = [
    { name: 'Cosmic Purple', value: '#A59AD1' },
    { name: 'Mystic Blue', value: '#87CEEB' },
    { name: 'Celestial Pink', value: '#FFB6C1' },
    { name: 'Astral Gold', value: '#FFD700' },
    { name: 'Ethereal Green', value: '#98FB98' },
    { name: 'Spiritual Orange', value: '#FFA07A' },
    { name: 'Divine Violet', value: '#DDA0DD' },
    { name: 'Cosmic Teal', value: '#40E0D0' },
    { name: 'Luna Silver', value: '#C0C0C0' },
    { name: 'Mars Red', value: '#CD5C5C' },
    { name: 'Neptune Blue', value: '#4169E1' },
    { name: 'Venus Rose', value: '#FF69B4' }
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

  const handleColorSelect = (newColor) => {
    onColorChange(newColor);
    setIsOpen(false);
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
          src="/static/icons/color.svg" 
          alt="Color" 
          className="input-icon" 
        />
        <span 
          className="label-text" 
          style={{ color: currentColor.value }}
        >
          {currentColor.name}
        </span>
        <div 
          className="color-preview" 
          style={{ backgroundColor: currentColor.value }}
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
          <div className="cosmic-msd-options-container">
            {isMobile && (
              <div className="cosmic-msd-options-header">
                <h3>Select Your Color</h3>
                <button 
                  className="cosmic-msd-close"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close color picker"
                >
                  ×
                </button>
              </div>
            )}
            <div className="color-swatches">
              {colors.map((colorOption) => (
                <button
                  key={colorOption.name}
                  className={`color-swatch ${colorOption.name === currentColor.name ? 'selected' : ''}`}
                  style={{ backgroundColor: colorOption.value }}
                  onClick={() => handleColorSelect(colorOption)}
                  title={colorOption.name}
                  aria-label={colorOption.name}
                  role="option"
                  aria-selected={colorOption.name === currentColor.name}
                >
                  {colorOption.name === currentColor.name && (
                    <img 
                      src="/static/icons/check.svg" 
                      alt="" 
                      className="swatch-check"
                      aria-hidden="true"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

window.ColorPicker = ColorPicker;