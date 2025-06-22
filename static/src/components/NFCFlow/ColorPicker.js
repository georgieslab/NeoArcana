// Improved ColorPicker component with better popup layout
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

  return React.createElement('div', {
    className: `neo-dropdown neo-color-picker ${isOpen ? 'open' : ''}`,
    ref: pickerRef,
    style: { width: '100%' }  // Ensure full width
  }, [
    // Color picker label
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
        src: '/static/icons/color.svg',
        alt: 'Color',
        className: 'neo-dropdown-icon'
      }),
      React.createElement('span', {
        key: 'text',
        className: 'neo-dropdown-text',
        style: { color: currentColor.value }
      }, currentColor.name),
      React.createElement('div', {
        key: 'preview',
        className: 'neo-color-preview',
        style: { backgroundColor: currentColor.value },
        'aria-hidden': 'true'
      })
    ]),

    // Color options
    isOpen && React.createElement(React.Fragment, {
      key: 'options-fragment'
    }, [
      // Mobile backdrop
      isMobile && React.createElement('div', {
        key: 'backdrop',
        className: 'neo-backdrop',
        onClick: () => setIsOpen(false)
      }),

      // Options container with improved positioning
      React.createElement('div', {
        key: 'options-container',
        className: 'neo-dropdown-options neo-color-options',
        style: {
          width: '240px',  // Fixed width to ensure proper sizing
          maxHeight: '300px',  // Maximum height before scrolling
          overflow: 'auto',  // Enable scrolling if needed
          padding: '12px',  // Add padding for better spacing
          boxSizing: 'border-box',
          left: isMobile ? '50%' : '0',
          transform: isMobile ? 'translateX(-50%)' : 'none'
        }
      }, [
        // Mobile header
        isMobile && React.createElement('div', {
          key: 'header',
          className: 'neo-dropdown-header'
        }, [
          React.createElement('h3', {
            key: 'title'
          }, 'Select Your Color'),
          React.createElement('button', {
            key: 'close',
            className: 'neo-dropdown-close',
            onClick: () => setIsOpen(false),
            'aria-label': 'Close color picker'
          }, '×')
        ]),

        // Color swatches container with improved grid
        React.createElement('div', {
          key: 'swatches',
          className: 'neo-color-swatches',
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',  // 4 colors per row
            gap: '8px',  // Smaller gap between colors
            width: '100%'
          }
        }, 
          colors.map((colorOption) => 
            React.createElement('div', {
              key: colorOption.name,
              className: `neo-color-swatch ${colorOption.name === currentColor.name ? 'selected' : ''}`,
              style: { 
                backgroundColor: colorOption.value,
                width: '45px',  // Smaller fixed width
                height: '45px',  // Smaller fixed height
                borderRadius: '50%',  // Maintain circle shape
                border: colorOption.name === currentColor.name ? 
                  '2px solid white' : '1px solid rgba(255, 255, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
                transform: colorOption.name === currentColor.name ? 'scale(1.1)' : 'scale(1)'
              },
              onClick: () => handleColorSelect(colorOption),
              title: colorOption.name,
              role: 'option',
              'aria-selected': colorOption.name === currentColor.name,
              tabIndex: 0
            }, 
              colorOption.name === currentColor.name && 
              React.createElement('img', {
                key: 'check',
                src: '/static/icons/check.svg',
                alt: '',
                style: {
                  width: '16px',
                  height: '16px',
                  filter: 'brightness(0) invert(1)'  // Make icon white
                },
                'aria-hidden': 'true'
              })
            )
          )
        )
      ])
    ])
  ]);
};

window.ColorPicker = ColorPicker;