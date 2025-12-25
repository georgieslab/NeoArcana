// ========================================
// NEOARCANA - THREE CARD REVEAL
// EXACT same style as TrialStep2 but with 3 cards!
// ========================================

const ThreeCardReveal = ({ name, readingData, onComplete, zodiacSign }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [showInstruction, setShowInstruction] = React.useState(false);
  const [showCards, setShowCards] = React.useState(false);
  const [showZodiacMessage, setShowZodiacMessage] = React.useState(false);
  const [flippedCards, setFlippedCards] = React.useState([false, false, false]);
  const [revealingCards, setRevealingCards] = React.useState([false, false, false]);
  const [canClick, setCanClick] = React.useState([true, true, true]);
  const [zodiacMessage, setZodiacMessage] = React.useState('');
  const mounted = React.useRef(true);

  const positions = ['Past', 'Present', 'Future'];
  const positionIcons = ['🌙', '⭐', '✨'];

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
      if (mounted.current) setShowCards(true);
    };

    sequence();

    return () => {
      mounted.current = false;
    };
  }, []);

  // Check if all cards are flipped
  React.useEffect(() => {
    if (flippedCards.every(f => f)) {
      // All cards flipped, proceed after a delay
      setTimeout(() => {
        if (mounted.current) {
          onComplete();
        }
      }, 2000);
    }
  }, [flippedCards, onComplete]);

  const handleCardClick = async (index) => {
    if (!canClick[index] || revealingCards[index]) return;
    
    setCanClick(prev => {
      const newCanClick = [...prev];
      newCanClick[index] = false;
      return newCanClick;
    });
    
    setRevealingCards(prev => {
      const newRevealing = [...prev];
      newRevealing[index] = true;
      return newRevealing;
    });
    
    // Wait a moment for anticipation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Flip the card
    setFlippedCards(prev => {
      const newFlipped = [...prev];
      newFlipped[index] = true;
      return newFlipped;
    });
    
    // Wait for flip animation to complete
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Stop revealing animation
    if (mounted.current) {
      setRevealingCards(prev => {
        const newRevealing = [...prev];
        newRevealing[index] = false;
        return newRevealing;
      });
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
          flippedCards.every(f => f) ? 
            `All cards revealed! Proceeding to your reading...` :
            `The stars have chosen three cards for you, ${name}. Click each to reveal...`
        ),

        // Cards Section (3 cards in a row)
        showCards && React.createElement("div", { className: "three-card-reveal-section" },
          readingData.cards.map((cardImage, index) => 
            React.createElement("div", { 
              key: index,
              className: "three-card-column"
            },
              // Position Label
              React.createElement("div", { className: "card-position-label" },
                React.createElement("span", { className: "position-icon" }, positionIcons[index]),
                ' ',
                positions[index]
              ),

              // Card Wrapper
              React.createElement("div", { 
                className: `trial-step2-card-wrapper ${revealingCards[index] ? 'revealing' : ''} ${flippedCards[index] ? 'flipped' : ''}`,
                onClick: () => handleCardClick(index)
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
                      alt: readingData.cardNames[index]
                    })
                  )
                ),
                
                // Particle effects container
                revealingCards[index] && React.createElement("div", { className: "trial-step2-particles" },
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
              ),

              // Card Name (after flip)
              flippedCards[index] && React.createElement("div", { className: "card-name-label" },
                readingData.cardNames[index]
              )
            )
          )
        )
      )
    )
  );
};

window.ThreeCardReveal = ThreeCardReveal;