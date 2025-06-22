// Fixed NFCThreeCardReading.js - Simplified version that works with existing CSS
const NFCThreeCardReading = ({ userData, onError, onComplete }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [readingData, setReadingData] = React.useState(null);
  const [step, setStep] = React.useState('loading'); // loading, initial, revealing, completed
  const [revealedCards, setRevealedCards] = React.useState([false, false, false]);
  const [activeCardIndex, setActiveCardIndex] = React.useState(null);
  
  // Create a mounted ref to prevent state updates after unmounting
  const mounted = React.useRef(true);
  const positions = ['Past', 'Present', 'Future'];

  // Fetch the three card reading data
  const fetchThreeCardReading = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!userData || !userData.nfc_id) {
        throw new Error('Missing NFC ID for reading');
      }
      
      console.log('Fetching three-card reading for user:', userData.nfc_id);
      
      const response = await fetch('/api/nfc/three_card_reading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nfc_id: userData.nfc_id
        })
      });

      // Check if component is still mounted before updating state
      if (!mounted.current) return;

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get three card reading');
      }

      const data = await response.json();
      
      if (!mounted.current) return;
      
      if (data.success) {
        console.log('Three-card reading data received:', data);
        setReadingData(data.data);
        setStep('initial');
      } else {
        throw new Error(data.error || 'Failed to get reading');
      }
    } catch (err) {
      if (!mounted.current) return;
      
      console.error('Error fetching three card reading:', err);
      setError(err.message);
      if (onError) onError(err.message);
    } finally {
      if (mounted.current) {
        setIsLoading(false);
      }
    }
  };

  // Set up component
  React.useEffect(() => {
    // Reset mounted ref to true when component mounts
    mounted.current = true;
    
    // Begin fetching reading data
    fetchThreeCardReading();
    
    // When component unmounts
    return () => {
      mounted.current = false;
    };
  }, []);

  // Handle card click
  const handleCardClick = (index) => {
    if (revealedCards[index]) return; // Card already revealed
    
    const newRevealedCards = [...revealedCards];
    newRevealedCards[index] = true;
    setRevealedCards(newRevealedCards);
    setActiveCardIndex(index);
    
    // Show interpretation when all cards are revealed
    if (newRevealedCards.every(Boolean)) {
      setTimeout(() => {
        setStep('completed');
      }, 1000);
    }
  };

  // Handle starting the reading
  const handleStartReading = () => {
    setStep('revealing');
  };

  // If there's an error
  if (error) {
    return React.createElement('div', {
      className: 'nfc-reading'
    }, [
      React.createElement('div', {
        key: 'error-message',
        className: 'nfc-reading__error'
      }, React.createElement('p', null, error)),
      React.createElement('button', {
        key: 'retry-button',
        onClick: fetchThreeCardReading,
        className: 'nfc-reading__retry-button'
      }, 'Try Again ✨'),
      React.createElement('button', {
        key: 'back-button',
        onClick: onComplete,
        className: 'nfc-reading__button'
      }, 'Return to Daily Reading')
    ]);
  }

  // If still loading
  if (isLoading || step === 'loading') {
    return React.createElement('div', {
      className: 'nfc-reading'
    }, [
      React.createElement('div', {
        key: 'loading',
        className: 'nfc-reading__loading'
      }, [
        React.createElement('div', {
          key: 'loader',
          className: 'nfc-reading__loader'
        }),
        React.createElement('p', {
          key: 'loading-text',
          className: 'nfc-reading__loading-text'
        }, 'The universe is aligning your cards...')
      ])
    ]);
  }

  // Initial screen
  if (step === 'initial') {
    return React.createElement('div', {
      className: 'nfc-reading'
    }, [
      React.createElement('div', {
        key: 'container',
        className: 'nfc-reading__container nfc-reading__fade-in'
      }, [
        React.createElement('h1', {
          key: 'title',
          className: 'nfc-reading__title'
        }, 'Your Three Card Journey'),
        
        React.createElement('p', {
          key: 'instruction',
          className: 'nfc-reading__instruction'
        }, 'Discover insights about your past, present, and future with this three-card spread. Each card reveals part of your cosmic journey.'),
        
        React.createElement('button', {
          key: 'start-button',
          className: 'nfc-reading__button',
          onClick: handleStartReading
        }, 'Begin Your Reading ✨'),
        
        React.createElement('button', {
          key: 'back-button',
          className: 'nfc-reading__button nfc-reading__button--secondary',
          onClick: onComplete
        }, 'Return to Daily Reading')
      ])
    ]);
  }

  // Card revealing phase
  if (step === 'revealing') {
    return React.createElement('div', {
      className: 'nfc-reading'
    }, [
      React.createElement('div', {
        key: 'container',
        className: 'nfc-reading__container nfc-reading__fade-in'
      }, [
        React.createElement('h1', {
          key: 'title',
          className: 'nfc-reading__title'
        }, 'Your Three Card Reading'),
        
        React.createElement('p', {
          key: 'instruction',
          className: 'nfc-reading__instruction'
        }, 'Click each card to reveal its cosmic message'),
        
        // Three cards display as simple flex container
        React.createElement('div', {
          key: 'cards-container',
          className: 'nfc-reading__sections', // Reusing existing class
          style: {
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }
        }, readingData.cards.map((cardImage, index) => 
          React.createElement('div', {
            key: `card-wrapper-${index}`,
            className: 'nfc-reading__section', // Reusing existing class
            style: {
              textAlign: 'center',
              cursor: 'pointer'
            },
            onClick: () => handleCardClick(index)
          }, [
            React.createElement('h3', {
              key: `position-title-${index}`,
              className: 'nfc-reading__section-title'
            }, positions[index]),
            
            // Card image
            React.createElement('div', {
              key: `card-container-${index}`,
              style: {
                transition: 'transform 0.5s ease',
                transform: revealedCards[index] ? 'rotateY(180deg)' : 'none',
                transformStyle: 'preserve-3d',
                position: 'relative',
                width: '180px',
                height: '300px',
                margin: '0 auto'
              }
            }, [
              // Card back (hidden when revealed)
              React.createElement('div', {
                key: `card-back-${index}`,
                style: {
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  visibility: revealedCards[index] ? 'hidden' : 'visible'
                }
              }, [
                React.createElement('img', {
                  src: '/static/images/cards/card-back.jpg',
                  alt: 'Card Back',
                  style: {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '10px'
                  }
                })
              ]),
              
              // Card front (visible when revealed)
              React.createElement('div', {
                key: `card-front-${index}`,
                style: {
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  visibility: revealedCards[index] ? 'visible' : 'hidden'
                }
              }, [
                React.createElement('img', {
                  src: cardImage,
                  alt: readingData.cardNames ? readingData.cardNames[index] : `${positions[index]} Card`,
                  style: {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '10px'
                  },
                  onError: (e) => {
                    console.error(`Error loading card image: ${cardImage}`);
                    e.target.src = '/static/images/cards/fallback-card.jpg';
                  }
                })
              ])
            ]),
            
            // Show card name when revealed
            revealedCards[index] && React.createElement('div', {
              key: `card-name-${index}`,
              className: 'nfc-reading__section-content',
              style: {
                marginTop: '15px',
                fontWeight: 'bold',
                animation: 'fadeIn 0.5s ease'
              }
            }, readingData.cardNames ? readingData.cardNames[index] : '')
          ])
        )),

        // Continue button appears when all cards are revealed
        revealedCards.every(Boolean) && React.createElement('div', {
          key: 'actions',
          className: 'nfc-reading__actions',
          style: {
            marginTop: '20px'
          }
        }, [
          React.createElement('button', {
            key: 'continue-button',
            className: 'nfc-reading__button',
            onClick: () => setStep('completed')
          }, 'See Your Reading Interpretation')
        ])
      ])
    ]);
  }

  // Completed reading with interpretation
  if (step === 'completed') {
    return React.createElement('div', {
      className: 'nfc-reading'
    }, [
      React.createElement('div', {
        key: 'container',
        className: 'nfc-reading__container nfc-reading__fade-in'
      }, [
        React.createElement('h1', {
          key: 'title',
          className: 'nfc-reading__title'
        }, 'Your Reading Interpretation'),
        
        // Card summary
        React.createElement('div', {
          key: 'card-summary',
          className: 'nfc-reading__section',
          style: {
            textAlign: 'center',
            marginBottom: '20px'
          }
        }, [
          React.createElement('p', {
            key: 'summary-text',
            className: 'nfc-reading__section-content'
          }, `Your cards: ${readingData.cardNames ? readingData.cardNames.join(', ') : 'Three cosmic forces'}`)
        ]),
        
        // Reading interpretation
        React.createElement('div', {
          key: 'interpretation',
          className: 'nfc-reading__section'
        }, [
          React.createElement('div', {
            key: 'interpretation-content',
            className: 'nfc-reading__section-content',
            style: {
              whiteSpace: 'pre-wrap'
            }
          }, readingData.interpretation || 'The cosmic forces reveal a connection between your past, present, and future. These cards suggest important energies at work in your life.')
        ]),
        
        // Action buttons
        React.createElement('div', {
          key: 'actions',
          className: 'nfc-reading__actions'
        }, [
          React.createElement('button', {
            key: 'return-button',
            className: 'nfc-reading__button',
            onClick: onComplete
          }, 'Return to Daily Reading')
        ]),
        
        // Footer
        React.createElement('p', {
          key: 'footer',
          className: 'nfc-reading__footer'
        }, "Return tomorrow for a fresh cosmic perspective ✨")
      ])
    ]);
  }

  // Fallback
  return null;
};

// Add to window so it can be referenced from other components
window.NFCThreeCardReading = NFCThreeCardReading;