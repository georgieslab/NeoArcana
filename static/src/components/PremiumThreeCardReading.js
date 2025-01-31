const PremiumThreeCardReading = ({ name, cardImages = [], handleCardReveal, zodiacSign }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isSpinning, setIsSpinning] = React.useState(false);
  const [isRevealed, setIsRevealed] = React.useState(false);
  const [showInstruction, setShowInstruction] = React.useState(false);
  const [showCards, setShowCards] = React.useState(false);
  const [instructionText, setInstructionText] = React.useState('');

  React.useEffect(() => {
    console.log('PremiumThreeCardReading rendered with:', {
      name,
      zodiacSign,
      cardImages,
      isVisible,
      isSpinning,
      isRevealed
    });

    // Only proceed with animations if we have valid card data
    if (cardImages && cardImages.length === 3) {
      const sequence = async () => {
        if (window.zoomBackground) {
          window.zoomBackground(1.3, 2000);
        }

        await new Promise(resolve => setTimeout(resolve, 100));
        setIsVisible(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setShowInstruction(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setShowCards(true);
      };

      sequence();
    }
  }, [name, zodiacSign, cardImages, isVisible, isSpinning, isRevealed]);

  // Fix image paths
  const getCardImagePath = (imageName) => {
    if (!imageName) return '/static/images/fallback-card.jpg';
    return imageName.startsWith('/static/images/') 
      ? imageName 
      : `/static/images/${imageName}`;
  };

  // Handle card click for spinning and revealing
  const handleCardClick = React.useCallback(() => {
    if (!isSpinning && !isRevealed) {
      setIsSpinning(true);
      setInstructionText('The universe is revealing your past, present, and future...');

      const spinDuration = 5000; // 5 seconds spin
      setTimeout(() => {
        setIsSpinning(false);
        setIsRevealed(true);
        setInstructionText('Click to see your detailed reading!');
      }, spinDuration);
    } else if (isRevealed) {
      handleCardReveal();
    }
  }, [isSpinning, isRevealed, handleCardReveal]);

  // Ensure all three cards are received
  if (!cardImages || cardImages.length !== 3) {
    console.warn('Incomplete card data:', {
      cardImagesReceived: cardImages,
      length: cardImages ? cardImages.length : 0
    });
    return (
      <div className="loading-message">
        <h2>Preparing your reading...</h2>
        <p>Please wait while we connect with the cosmic energies.</p>
      </div>
    );
  }

  const positions = ['Past', 'Present', 'Future'];

  return (
    <div className={`premium-reading-container ${isVisible ? 'visible' : ''}`}>
      <div className="step-indicator">
        <div className="step">1</div>
        <div className="step active">2</div>
        <div className="step">3</div>
      </div>

      <div className="step-content">
        <h1 className="premium-title">Hey {name}!</h1>

        {showInstruction && (
          <p className="premium-instruction">
            {instructionText || `The stars have aligned three cards for you, ${name}. Click to reveal their insights.`}
          </p>
        )}

        {showCards && (
          <div className="premium-cards-container">
            {positions.map((position, index) => (
              <div key={position} className="premium-card-wrapper">
                <div 
                  className={`premium-card ${isSpinning ? 'spinning' : ''} ${isRevealed ? 'revealed' : ''}`}
                  onClick={handleCardClick}
                >
                  <div className="premium-card-face premium-card-back">
                    <img
                      src="/static/images/card-back.jpg"
                      alt="Card Back"
                      className="premium-card-image"
                    />
                  </div>
                  <div className="premium-card-face premium-card-front">
                    <img
                      src={getCardImagePath(cardImages[index])}
                      alt={`${position} Card`}
                      className="premium-card-image"
                      onError={(e) => {
                        console.error(`Error loading card image: ${cardImages[index]}`);
                        e.target.src = '/static/images/fallback-card.jpg';
                      }}
                    />
                  </div>
                </div>
                <div className="premium-card-title">{position}</div>
              </div>
            ))}
          </div>
        )}

        <div className="zodiac-sign">
          <span className="zodiac-icon">⭐</span>
          <span className="zodiac-text">{zodiacSign}</span>
        </div>
      </div>

      <style>{`
        .premium-reading-container {
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
          padding: 2rem;
          text-align: center;
        }

        .premium-reading-container.visible {
          opacity: 1;
        }

        .premium-cards-container {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-top: 2rem;
        }

        .premium-card-wrapper {
          perspective: 1000px;
          width: 200px;
        }

        .premium-card {
          position: relative;
          width: 100%;
          height: 350px;
          transition: transform 0.8s;
          transform-style: preserve-3d;
          cursor: pointer;
        }

        .premium-card.spinning {
          animation: spin 5s linear infinite;
        }

        .premium-card.revealed {
          transform: rotateY(180deg);
        }

        .premium-card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .premium-card-front {
          transform: rotateY(180deg);
        }

        .premium-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 10px;
        }

        .premium-card-title {
          text-align: center;
          margin-top: 1rem;
          font-size: 1.2rem;
          color: #A59AD1;
        }

        .zodiac-sign {
          margin-top: 2rem;
          font-size: 1.2rem;
          color: #A59AD1;
        }

        .zodiac-icon {
          margin-right: 0.5rem;
          animation: pulse 2s infinite;
        }

        @keyframes spin {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        .loading-message {
          text-align: center;
          padding: 2rem;
          color: #A59AD1;
        }

        .loading-message h2 {
          margin-bottom: 1rem;
        }

        .step-indicator {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .step {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(165, 154, 209, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #A59AD1;
        }

        .step.active {
          background: #A59AD1;
          color: white;
        }

        .premium-title {
          font-size: 2rem;
          color: #A59AD1;
          margin-bottom: 1.5rem;
        }

        .premium-instruction {
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 2rem;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};

window.PremiumThreeCardReading = PremiumThreeCardReading;