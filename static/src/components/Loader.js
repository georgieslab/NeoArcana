const CosmicLoader = ({ type = 'default', message = null, onLoadingComplete = null }) => {
  const [phase, setPhase] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(true);
  const [isFading, setIsFading] = React.useState(false);
  const mountedRef = React.useRef(true);
  
  const loadingPhrases = {
    default: [
      { text: "Connecting to the Universe", icon: "✨" },
      { text: "Reading Your Stars", icon: "⭐" },
      { text: "Channeling Cosmic Energy", icon: "🌟" },
      { text: "Preparing Your Message", icon: "💫" }
    ],
    nfc: [
      { text: "Connecting to Your Card", icon: "✨" },
      { text: "Reading Cosmic Frequencies", icon: "📡" },
      { text: "Aligning with Your Energy", icon: "🌟" },
      { text: "Preparing Your Reading", icon: "🔮" }
    ],
    initial: [
      { text: "Awakening Cosmic Forces", icon: "⚡" },
      { text: "Opening Star Gates", icon: "🌌" },
      { text: "Calibrating Energies", icon: "✨" },
      { text: "Preparing Your Journey", icon: "🚀" }
    ]
  };
  
  React.useEffect(() => {
    // Set mounted ref to true
    mountedRef.current = true;
    
    let timeoutId;
    let phaseInterval;
    let fadeTimeoutId;

    phaseInterval = setInterval(() => {
      if (mountedRef.current) {
        setPhase(prev => (prev + 1) % loadingPhrases[type].length);
      }
    }, 2500);

    if (onLoadingComplete) {
      // Start fade out at 4.5 seconds
      timeoutId = setTimeout(() => {
        if (mountedRef.current) {
          setIsFading(true);
          
          // Call onLoadingComplete after short delay to allow fade to start
          fadeTimeoutId = setTimeout(() => {
            if (mountedRef.current && onLoadingComplete) {
              onLoadingComplete();
              
              // Remove loader component after fade completes
              setTimeout(() => {
                if (mountedRef.current) {
                  setIsVisible(false);
                }
              }, 500);
            }
          }, 300);
        }
      }, 4500);
    }

    // Cleanup function
    return () => {
      mountedRef.current = false;
      if (timeoutId) clearTimeout(timeoutId);
      if (phaseInterval) clearInterval(phaseInterval);
      if (fadeTimeoutId) clearTimeout(fadeTimeoutId);
    };
  }, [type, onLoadingComplete]);

  if (!isVisible) return null;

  return React.createElement('div', {
    className: `cosmic-loader-container ${isFading ? 'fade-out' : ''}`
  }, [
    // Rotating orb
    React.createElement('div', {
        key: 'orb-wrapper',
        className: 'orb-wrapper'
      }, [
        React.createElement('div', { 
          key: 'center',
          className: 'center' 
        }, [
          React.createElement('div', { key: 'ball', className: 'ball' }),
          React.createElement('div', { key: 'blubb-1', className: 'blubb-1' }),
          React.createElement('div', { key: 'blubb-2', className: 'blubb-2' }),
          React.createElement('div', { key: 'blubb-3', className: 'blubb-3' }),
          React.createElement('div', { key: 'blubb-4', className: 'blubb-4' }),
          React.createElement('div', { key: 'blubb-5', className: 'blubb-5' }),
          React.createElement('div', { key: 'blubb-6', className: 'blubb-6' }),
          React.createElement('div', { key: 'blubb-7', className: 'blubb-7' }),
          React.createElement('div', { key: 'blubb-8', className: 'blubb-8' }),
          React.createElement('div', { key: 'sparkle-1', className: 'sparkle-1' }),
          React.createElement('div', { key: 'sparkle-2', className: 'sparkle-2' }),
          React.createElement('div', { key: 'sparkle-3', className: 'sparkle-3' }),
          React.createElement('div', { key: 'sparkle-4', className: 'sparkle-4' }),
          React.createElement('div', { key: 'sparkle-5', className: 'sparkle-5' }),
          React.createElement('div', { key: 'sparkle-6', className: 'sparkle-6' }),
          React.createElement('div', { key: 'sparkle-7', className: 'sparkle-7' }),
          React.createElement('div', { key: 'sparkle-8', className: 'sparkle-8' }),
          React.createElement('div', { key: 'sparkle-9', className: 'sparkle-9' }),
          React.createElement('div', { key: 'sparkle-10', className: 'sparkle-10' })
        ])
      ]),
    
    // Progress bar (non-rotating)
    React.createElement('div', {
      key: 'progress-wrapper',
      className: 'progress-wrapper'
    }, [
      React.createElement('div', {
        key: 'progress',
        className: 'loading-progress'
      }, [
        React.createElement('div', {
          key: 'progress-bar',
          className: 'progress-bar'
        })
      ])
    ]),
    
    // Message wrapper (non-rotating)
    React.createElement('div', {
      key: 'message-wrapper',
      className: 'message-wrapper'
    }, [
      React.createElement('div', {
        key: 'message',
        className: 'phase-message'
      }, [
        React.createElement('span', {
          key: 'icon',
          className: 'phase-icon'
        }, loadingPhrases[type][phase].icon),
        React.createElement('span', {
          key: 'text',
          className: 'phase-text'
        }, message || loadingPhrases[type][phase].text)
      ])
    ])
  ]);
};

window.CosmicLoader = CosmicLoader;