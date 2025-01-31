
const TrialStep2 = ({ name, cardImage, handleCardReveal, zodiacSign }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [showInstruction, setShowInstruction] = React.useState(false);
  const [showCard, setShowCard] = React.useState(false);
  const [showZodiacMessage, setShowZodiacMessage] = React.useState(false);
  const [instructionText, setInstructionText] = React.useState('');
  const [currentCard, setCurrentCard] = React.useState(null);
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

  const handleTrialCardClick = React.useCallback(async () => {
    if (!canClick) return;
    
    if (currentCard === null) {
      setCanClick(false);
      setCurrentCard(0);
      handleCardReveal(); // Call this only once
    }
  }, [canClick, currentCard, handleCardReveal]);

  const TrialCard = ({ cardImage, onClick, isRevealed }) => {
    const [isPreReveal, setIsPreReveal] = React.useState(false);
    const [particles, setParticles] = React.useState([]);
    
    const handleClick = async () => {
      if (isRevealed || isPreReveal) return;
      
      // Start pre-reveal animation
      setIsPreReveal(true);
      
      // Create particles
      const newParticles = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        duration: 0.8 + Math.random() * 0.5,
        delay: Math.random() * 0.5,
        style: {
          animation: `particleExpand ${0.8 + Math.random() * 0.5}s cubic-bezier(0.4, 0, 0.2, 1) forwards ${Math.random() * 0.5}s`
        }
      }));
      setParticles(newParticles);
  
      // Wait for pre-reveal animation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Trigger the main reveal
      onClick();
      
      // Clean up particles after animation
      setTimeout(() => {
        setParticles([]);
      }, 2500);
    };
  
    return (
      <div className="trial-card-container" onClick={handleClick}>
        <div className={`trial-card ${isPreReveal ? 'pre-reveal' : ''} ${isRevealed ? 'is-flipped' : ''}`}>
          <div className="trial-card-face trial-card-back">
            <img src="/static/images/card-back.jpg" alt="Card Back" />
          </div>
          <div className="trial-card-face trial-card-front">
            <img src={cardImage} alt="Your Card" />
          </div>
        </div>
        {particles.map(particle => (
          <div 
            key={particle.id}
            className="cosmic-particle"
            style={particle.style}
          />
        ))}
        <div className="cosmic-glow"></div>
      </div>
    );
  };

  return (
    <div className={`container step2-container ${isVisible ? 'visible' : ''}`}>
      <div className="step-indicator">
        <div className="step">1</div>
        <div className="step active">2</div>
        <div className="step">3</div>
      </div>

      <div className="step-content">
        <h1 className="title cosmic-gradient cosmic-text">Hey {name}!</h1>

        {showZodiacMessage && (
          <div className="zodiac-message fade-in">
            <p>{zodiacMessage} - {zodiacSign}</p>
          </div>
        )}

        {showInstruction && (
          <p className="card-instruction">{instructionText || `The stars have chosen a card for you, ${name}...`}</p>
        )}

        {showCard && (
          <div className="trial-card-section">
            <TrialCard
              cardImage={cardImage}
              onClick={handleTrialCardClick}
              isRevealed={currentCard === 0}
            />
          </div>
        )}
      </div>
    </div>
  );
};

window.TrialStep2 = TrialStep2;