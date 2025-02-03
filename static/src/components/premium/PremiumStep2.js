const PremiumStep2 = ({ name, cardImages = [], handleCardReveal, zodiacSign }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [showInstruction, setShowInstruction] = React.useState(false);
  const [showCards, setShowCards] = React.useState(false);
  const [revealedCards, setRevealedCards] = React.useState([false, false, false]);
  const [error, setError] = React.useState(null);

  // Add detailed logging
  React.useEffect(() => {
    console.log('PremiumStep2 mounted with:', {
      name,
      cardImages,
      zodiacSign,
      isVisible,
      showCards
    });

    if (!cardImages || cardImages.length !== 3) {
      console.error('Invalid card data:', {
        cardImagesReceived: cardImages,
        length: cardImages ? cardImages.length : 0
      });
      setError('Unable to load cards. Please try again.');
      return;
    }

    // Only proceed with animations if we have valid card data
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
  }, [name, cardImages, zodiacSign]);

  const handleCardClick = (index) => {
    console.log('Card clicked:', index);
    if (!revealedCards[index]) {
      const newRevealedCards = [...revealedCards];
      newRevealedCards[index] = true;
      setRevealedCards(newRevealedCards);
    }
  };

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="cosmic-button"
        >
          Try Again
        </button>
      </div>
    );
  }

  const allCardsRevealed = revealedCards.every(card => card);

  return (
    <div className={`step2-container ${isVisible ? 'visible' : ''}`}>
      <div className="step-indicator">
        <div className="step">1</div>
        <div className="step active">2</div>
        <div className="step">3</div>
      </div>

      <h1 className="premium-title">Welcome {name}, to Your Reading</h1>

      {showInstruction && (
        <p className="premium-instruction">
          Click each card to reveal your past, present, and future
        </p>
      )}

      {showCards && (
        <div className="trial-card-container">
          {cardImages.map((image, index) => (
            <div key={index} className="premium-card-wrapper">
              <div 
                className={`premium-card ${revealedCards[index] ? 'revealed' : ''}`}
                onClick={() => handleCardClick(index)}
              >
                <div className="premium-card-face premium-card-back">
                  <img src="/static/images/card-back.jpg" alt="Card Back" />
                </div>
                <div className="premium-card-face premium-card-front">
                  <img 
                    src={image}
                    alt={`${['Past', 'Present', 'Future'][index]} Card`}
                    onError={(e) => {
                      console.error(`Error loading card image: ${image}`);
                      e.target.src = '/static/images/fallback-card.jpg';
                    }}
                  />
                </div>
              </div>
              <h4 className="premium-card-title">
                {['Past', 'Present', 'Future'][index]}
              </h4>
            </div>
          ))}
        </div>
      )}

      {allCardsRevealed && (
        <button 
          className="reveal-button visible"
          onClick={handleCardReveal}
        >
          Continue to Your Reading
        </button>
      )}
    </div>
  );
};


window.PremiumStep2 = PremiumStep2;