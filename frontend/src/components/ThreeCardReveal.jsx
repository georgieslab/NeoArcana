// ========================================
// NEOARCANA - THREE CARD REVEAL (JSX)
// Beautiful flip animation for three cards! 🎴
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

  return (
    <div className={`trial-step2-reveal ${isVisible ? 'visible' : ''}`}>
      <div className="trial-step2-reveal-inner">
        
        {/* Step Indicator */}
        <div className="step-indicator">
          <div className="step">1</div>
          <div className="step active">2</div>
          <div className="step">3</div>
        </div>

        {/* Content Container */}
        <div className="trial-step2-content">
          
          {/* Title */}
          <h1 className="trial-step2-title">
            Hey {name}!
          </h1>

          {/* Zodiac Message */}
          {showZodiacMessage && (
            <div className="trial-step2-zodiac-message fade-in">
              <p>{zodiacMessage} - {zodiacSign}</p>
            </div>
          )}

          {/* Instruction */}
          {showInstruction && (
            <p className="trial-step2-instruction">
              {flippedCards.every(f => f) ? 
                `All cards revealed! Proceeding to your reading...` :
                `The stars have chosen three cards for you, ${name}. Click each to reveal...`
              }
            </p>
          )}

          {/* Cards Section (3 cards in a row) */}
          {showCards && (
            <div className="three-card-reveal-section">
              {readingData.cards.map((cardImage, index) => (
                <div 
                  key={index}
                  className="three-card-column"
                >
                  {/* Position Label */}
                  <div className="card-position-label">
                    <span className="position-icon">{positionIcons[index]}</span>
                    {' '}
                    {positions[index]}
                  </div>

                  {/* Card Wrapper */}
                  <div 
                    className={`trial-step2-card-wrapper ${revealingCards[index] ? 'revealing' : ''} ${flippedCards[index] ? 'flipped' : ''}`}
                    onClick={() => handleCardClick(index)}
                  >
                    {/* Card container with 3D flip */}
                    <div className="trial-step2-card">
                      
                      {/* Back face */}
                      <div className="trial-step2-card-face trial-step2-card-back">
                        <img 
                          src="/static/images/card-back.jpg"
                          alt="Card Back" 
                        />
                      </div>
                      
                      {/* Front face */}
                      <div className="trial-step2-card-face trial-step2-card-front">
                        <img 
                          src={cardImage}
                          alt={readingData.cardNames[index]}
                        />
                      </div>
                    </div>
                    
                    {/* Particle effects container */}
                    {revealingCards[index] && (
                      <div className="trial-step2-particles">
                        {/* Generate 20 particles */}
                        {Array.from({ length: 20 }).map((_, i) => (
                          <div
                            key={i}
                            className="trial-step2-particle"
                            style={{
                              '--delay': `${i * 0.05}s`,
                              '--angle': `${(360 / 20) * i}deg`
                            }}
                          />
                        ))}
                      </div>
                    )}
                    
                    {/* Cosmic glow effect */}
                    <div className="trial-step2-cosmic-glow" />
                  </div>

                  {/* Card Name (after flip) */}
                  {flippedCards[index] && (
                    <div className="card-name-label">
                      {readingData.cardNames[index]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

window.ThreeCardReveal = ThreeCardReveal;