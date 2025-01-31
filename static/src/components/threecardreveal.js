const ThreeCardReveal = ({ readingData, onComplete }) => {
    const [revealedCards, setRevealedCards] = React.useState([false, false, false]);
    const [showInterpretation, setShowInterpretation] = React.useState(false);
    const [currentCard, setCurrentCard] = React.useState(0);
    const positions = ['Past', 'Present', 'Future'];
  
    const revealNextCard = () => {
      if (currentCard < 3) {
        setRevealedCards(prev => {
          const newState = [...prev];
          newState[currentCard] = true;
          return newState;
        });
        setCurrentCard(prev => prev + 1);
      } else {
        setShowInterpretation(true);
      }
    };
  
    return React.createElement('div', {
      className: 'three-card-reveal-container'
    }, [
      // Cards Section
      React.createElement('div', {
        key: 'cards-section',
        className: 'cards-reveal-section'
      }, readingData.cards.map((card, index) => 
        React.createElement('div', {
          key: `card-container-${index}`,
          className: `card-container ${revealedCards[index] ? 'revealed' : ''}`,
        }, [
          React.createElement('div', {
            key: `position-${index}`,
            className: 'position-label'
          }, positions[index]),
          React.createElement('div', {
            key: `card-${index}`,
            className: 'card-wrapper'
          }, [
            React.createElement('div', {
              className: 'card-back'
            }),
            React.createElement('div', {
              className: 'card-front'
            }, 
              React.createElement('img', {
                src: card,
                alt: readingData.cardNames[index],
                className: 'card-image'
              })
            )
          ]),
          revealedCards[index] && React.createElement('div', {
            key: `name-${index}`,
            className: 'card-name cosmic-text'
          }, readingData.cardNames[index])
        ])
      )),
  
      // Action Button
      !showInterpretation && React.createElement('button', {
        key: 'reveal-button',
        className: 'cosmic-button reveal-button',
        onClick: revealNextCard
      }, currentCard === 0 ? 'Begin Reading' : currentCard === 3 ? 'Show Interpretation' : 'Reveal Next Card'),
  
      // Interpretation Section
      showInterpretation && React.createElement('div', {
        key: 'interpretation',
        className: 'interpretation-section fade-in'
      }, [
        React.createElement('h3', {
          key: 'interpretation-title',
          className: 'cosmic-text'
        }, 'Your Reading Interpretation'),
        React.createElement('div', {
          key: 'interpretation-text',
          className: 'interpretation-text'
        }, readingData.interpretation),
        React.createElement('button', {
          key: 'complete-button',
          className: 'cosmic-button',
          onClick: onComplete
        }, 'Complete Reading')
      ])
    ]);
  };
  
  window.ThreeCardReveal = ThreeCardReveal;