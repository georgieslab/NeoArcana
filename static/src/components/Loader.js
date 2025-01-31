const CosmicLoader = ({ type = 'default', message = null, onLoadingComplete = null }) => {
  const [phase, setPhase] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(true);
  const [isFading, setIsFading] = React.useState(false);
  
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
    let timeoutId;
    let phaseInterval;
    let fadeTimeoutId;

    phaseInterval = setInterval(() => {
      setPhase(prev => (prev + 1) % loadingPhrases[type].length);
    }, 2500);

    if (onLoadingComplete) {
      // Start fade out at 4.5 seconds
      timeoutId = setTimeout(() => {
        setIsFading(true);
        
        // Call onLoadingComplete after short delay to allow fade to start
        fadeTimeoutId = setTimeout(() => {
          onLoadingComplete();
          
          // Remove loader component after fade completes
          setTimeout(() => {
            setIsVisible(false);
          }, 500);
        }, 300);
      }, 4500);
    }

    return () => {
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
        key: 'orb',
        className: 'cosmic-orb'
      })
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