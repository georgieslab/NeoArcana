const PremiumStep2 = ({ name, cardImages = [], handleCardReveal, zodiacSign }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [showInstruction, setShowInstruction] = React.useState(false);
  const [showCards, setShowCards] = React.useState(false);
  const [revealedCards, setRevealedCards] = React.useState([false, false, false]);
  const [error, setError] = React.useState(null);
  const isMobile = window.innerWidth <= 768;

  React.useEffect(() => {
    console.log('PremiumStep2 mounted with:', {
      name,
      cardImages,
      zodiacSign,
      isMobile
    });

    if (!cardImages || cardImages.length !== 3) {
      console.error('Invalid card data:', {
        cardImagesReceived: cardImages,
        length: cardImages ? cardImages.length : 0
      });
      setError('Unable to load cards. Please try again.');
      return;
    }

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
    return React.createElement('div', {
      className: 'error-container'
    }, [
      React.createElement('p', {
        key: 'error',
        className: 'error-message'
      }, error),
      React.createElement('button', {
        key: 'retry',
        onClick: () => window.location.reload(),
        className: 'cosmic-button'
      }, 'Try Again')
    ]);
  }

  const allCardsRevealed = revealedCards.every(card => card);

  return React.createElement('div', {
    className: `premium-step2-container ${isVisible ? 'visible' : ''}`
  }, [
    // Step Indicator
    React.createElement('div', {
      key: 'steps',
      className: 'step-indicator'
    }, [1, 2, 3].map(step => 
      React.createElement('div', {
        key: `step-${step}`,
        className: `step ${step === 2 ? 'active' : ''}`
      }, step)
    )),

    // Title
    React.createElement('h1', {
      key: 'title',
      className: 'premium-title'
    }, `Welcome ${name}, to Your Reading`),

    // Instruction
    showInstruction && React.createElement('p', {
      key: 'instruction',
      className: 'premium-instruction'
    }, 'Click each card to reveal your past, present, and future'),

    // Cards Container
    showCards && React.createElement('div', {
      key: 'cards',
      className: 'premium-cards-grid'
    }, cardImages.map((image, index) => 
      React.createElement('div', {
        key: `card-wrapper-${index}`,
        className: 'premium-card-wrapper'
      }, [
        React.createElement('div', {
          key: `card-${index}`,
          className: `premium-card ${revealedCards[index] ? 'revealed' : ''}`,
          onClick: () => handleCardClick(index)
        }, [
          React.createElement('div', {
            key: 'back',
            className: 'premium-card-face premium-card-back'
          }, 
            React.createElement('img', {
              src: '/static/images/card-back.jpg',
              alt: 'Card Back'
            })
          ),
          React.createElement('div', {
            key: 'front',
            className: 'premium-card-face premium-card-front'
          }, 
            React.createElement('img', {
              src: image,
              alt: `${['Past', 'Present', 'Future'][index]} Card`,
              onError: (e) => {
                console.error(`Error loading card image: ${image}`);
                e.target.src = '/static/images/fallback-card.jpg';
              }
            })
          )
        ]),
        React.createElement('h4', {
          key: `title-${index}`,
          className: 'premium-card-title'
        }, ['Past', 'Present', 'Future'][index])
      ])
    )),

    // Continue Button
    allCardsRevealed && React.createElement('button', {
      key: 'continue',
      className: 'cosmic-button reveal-button',
      onClick: handleCardReveal
    }, 'Continue to Your Reading')
  ]);
};

window.PremiumStep2 = PremiumStep2;