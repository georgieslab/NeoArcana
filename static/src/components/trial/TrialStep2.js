// ========================================
// NEOARCANA - TRIAL STEP 2 (CARD REVEAL)
// FIXED: Proper card flip + EXCITING reveal!
// ========================================

const TrialStep2 = ({ name, cardImage, handleCardReveal, zodiacSign }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [showInstruction, setShowInstruction] = React.useState(false);
  const [showCard, setShowCard] = React.useState(false);
  const [showZodiacMessage, setShowZodiacMessage] = React.useState(false);
  const [instructionText, setInstructionText] = React.useState('');
  const [isRevealing, setIsRevealing] = React.useState(false);
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [canClick, setCanClick] = React.useState(true);
  const [zodiacMessage, setZodiacMessage] = React.useState('');
  const mounted = React.useRef(true);

  React.useEffect(() => {
    if (zodiacSign) {
      const message = window.getPersonalMessage(zodiacSign);
      setZodiacMessage(message);
    }
  }, [zodiacSign]);

  React.useEffect(() => {
    const sequence = async () => {
      if (!mounted.current) return;

      if (window.zoomBackground) {
        window.zoomBackground(1.3, 2000);
      }

      await new Promise(resolve => setTimeout(resolve, 100));
      if (mounted.current) setIsVisible(true);

      await new Promise(resolve => setTimeout(resolve, 500));
      if (mounted.current) {
        setShowInstruction(true);
        setShowZodiacMessage(true);
      }

      await new Promise(resolve => setTimeout(resolve, 500));
      if (mounted.current) setShowCard(true);
    };

    sequence();

    return () => {
      mounted.current = false;
    };
  }, []);

  const handleCardClick = async () => {
    if (!canClick || isRevealing) return;
    
    setCanClick(false);
    setIsRevealing(true);
    
    // Wait a moment for anticipation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Flip the card
    setIsFlipped(true);
    
    // Wait for flip animation to complete
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Proceed to next step
    if (mounted.current) {
      handleCardReveal();
    }
  };

  return React.createElement("div", { 
    className: `trial-step2-reveal ${isVisible ? 'visible' : ''}` 
  },
    React.createElement("div", { className: "trial-step2-reveal-inner" },
      
      // Step Indicator
      React.createElement("div", { className: "step-indicator" },
        React.createElement("div", { className: "step" }, "1"),
        React.createElement("div", { className: "step active" }, "2"),
        React.createElement("div", { className: "step" }, "3")
      ),

      // Content Container
      React.createElement("div", { className: "trial-step2-content" },
        
        // Title
        React.createElement("h1", { className: "trial-step2-title" },
          `Hey ${name}!`
        ),

        // Zodiac Message
        showZodiacMessage && React.createElement("div", { className: "trial-step2-zodiac-message fade-in" },
          React.createElement("p", null, `${zodiacMessage} - ${zodiacSign}`)
        ),

        // Instruction
        showInstruction && React.createElement("p", { className: "trial-step2-instruction" },
          instructionText || `The stars have chosen a card for you, ${name}. Click to reveal...`
        ),

        // Card Section
        showCard && React.createElement("div", { className: "trial-step2-card-section" },
          React.createElement("div", { 
            className: `trial-step2-card-wrapper ${isRevealing ? 'revealing' : ''} ${isFlipped ? 'flipped' : ''}`,
            onClick: handleCardClick
          },
            // Card container with 3D flip
            React.createElement("div", { className: "trial-step2-card" },
              
              // Back face
              React.createElement("div", { className: "trial-step2-card-face trial-step2-card-back" },
                React.createElement("img", { 
                  src: "/static/images/card-back.jpg",
                  alt: "Card Back" 
                })
              ),
              
              // Front face
              React.createElement("div", { className: "trial-step2-card-face trial-step2-card-front" },
                React.createElement("img", { 
                  src: cardImage,
                  alt: "Your Card" 
                })
              )
            ),
            
            // Particle effects container
            isRevealing && React.createElement("div", { className: "trial-step2-particles" },
              // Generate 20 particles
              Array.from({ length: 20 }).map((_, i) => 
                React.createElement("div", {
                  key: i,
                  className: "trial-step2-particle",
                  style: {
                    '--delay': `${i * 0.05}s`,
                    '--angle': `${(360 / 20) * i}deg`
                  }
                })
              )
            ),
            
            // Cosmic glow effect
            React.createElement("div", { className: "trial-step2-cosmic-glow" })
          )
        )
      )
    )
  );
};

window.TrialStep2 = TrialStep2;