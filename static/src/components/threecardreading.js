// ThreeCardReading.js - With mock data implementation
const ThreeCardReading = ({ userData, onError, onComplete }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [readingData, setReadingData] = React.useState(null);
  const [step, setStep] = React.useState('loading'); // loading, initial, revealing, completed
  const [revealedCards, setRevealedCards] = React.useState([false, false, false]);
  const [activeCardIndex, setActiveCardIndex] = React.useState(0);
  
  const mounted = React.useRef(true);
  const positions = ['Past', 'Present', 'Future'];

  // Generate mock data instead of calling the API
  const generateMockData = () => {
    // List of available cards
    const availableCards = [
      { name: "The Fool", image: "/static/images/cards/fool.jpg" },
      { name: "The Magician", image: "/static/images/cards/magician.jpg" },
      { name: "The High Priestess", image: "/static/images/cards/high_priestess.jpg" },
      { name: "The Empress", image: "/static/images/cards/empress.jpg" },
      { name: "The Emperor", image: "/static/images/cards/emperor.jpg" },
      { name: "The Hierophant", image: "/static/images/cards/hierophant.jpg" },
      { name: "The Lovers", image: "/static/images/cards/lovers.jpg" },
      { name: "The Chariot", image: "/static/images/cards/chariot.jpg" },
      { name: "Strength", image: "/static/images/cards/strength.jpg" },
      { name: "The Hermit", image: "/static/images/cards/hermit.jpg" },
      { name: "Wheel of Fortune", image: "/static/images/cards/wheel_of_fortune.jpg" },
      { name: "Justice", image: "/static/images/cards/justice.jpg" },
      { name: "The Hanged Man", image: "/static/images/cards/hanged_man.jpg" },
      { name: "Death", image: "/static/images/cards/death.jpg" },
      { name: "Temperance", image: "/static/images/cards/temperance.jpg" },
      { name: "The Devil", image: "/static/images/cards/devil.jpg" },
      { name: "The Tower", image: "/static/images/cards/tower.jpg" },
      { name: "The Star", image: "/static/images/cards/star.jpg" },
      { name: "The Moon", image: "/static/images/cards/moon.jpg" },
      { name: "The Sun", image: "/static/images/cards/sun.jpg" },
      { name: "Judgement", image: "/static/images/cards/judgement.jpg" },
      { name: "The World", image: "/static/images/cards/world.jpg" }
    ];

    // Shuffle and pick 3 random cards
    const shuffled = [...availableCards].sort(() => 0.5 - Math.random());
    const selectedCards = shuffled.slice(0, 3);
    
    // Get user's name and zodiac sign for personalization
    const userName = userData&&user_data&&name || 'Seeker';
    const zodiacSign = userData&&user_data&&zodiacSign || 'cosmic traveler';
    
    // Generate an interpretation
    const interpretation = `
Dear ${userName},

As a ${zodiacSign}, your three-card reading reveals significant cosmic energies at play in your journey:

[SECTION_1]
Your Past: ${selectedCards[0].name}

This card in your past position suggests a foundation of ${getCardTheme(selectedCards[0].name)}. The energies of this card have shaped your current path and provided you with important lessons that continue to influence you today.

Past experiences have equipped you with unique strengths that will serve you well as you move forward.
[/SECTION_1]

[SECTION_2]
Your Present: ${selectedCards[1].name}

In your current situation, ${selectedCards[1].name} indicates that you're experiencing a period of ${getCardTheme(selectedCards[1].name)}. This energy is prominent in your life right now and deserves your attention.

Pay close attention to opportunities that align with these themes, as they may be particularly significant for your journey.
[/SECTION_2]

[SECTION_3]
Your Future: ${selectedCards[2].name}

The ${selectedCards[2].name} in your future position reveals that you're moving toward a time of ${getCardTheme(selectedCards[2].name)}. This energy is beginning to manifest and will become more prominent as you continue on your path.

By embracing the lessons from your past and present, you'll be well-prepared to make the most of these emerging opportunities.
[/SECTION_3]

The connection between these three cards suggests a powerful narrative of growth and transformation. Your journey from ${selectedCards[0].name} through ${selectedCards[1].name} and toward ${selectedCards[2].name} reveals a cosmic pattern that's uniquely yours.

Trust in your intuition as you navigate these energies, and remember that you have the power to shape your destiny with conscious choices.
    `;
    
    return {
      cards: selectedCards.map(card => card.image),
      cardNames: selectedCards.map(card => card.name),
      interpretation: interpretation
    };
  };
  
  // Helper function to get theme for a card
  const getCardTheme = (cardName) => {
    const themes = {
      "The Fool": "new beginnings and unlimited potential",
      "The Magician": "manifestation and personal power",
      "The High Priestess": "intuition and inner wisdom",
      "The Empress": "abundance and nurturing energy",
      "The Emperor": "structure and authority",
      "The Hierophant": "tradition and spiritual guidance",
      "The Lovers": "relationships and choices",
      "The Chariot": "determination and willpower",
      "Strength": "courage and inner strength",
      "The Hermit": "introspection and soul-searching",
      "Wheel of Fortune": "change and cycles",
      "Justice": "fairness and truth",
      "The Hanged Man": "surrender and new perspectives",
      "Death": "transformation and renewal",
      "Temperance": "balance and moderation",
      "The Devil": "challenging attachments and limitations",
      "The Tower": "sudden change and revelation",
      "The Star": "hope and inspiration",
      "The Moon": "intuition and the subconscious",
      "The Sun": "joy and success",
      "Judgement": "rebirth and awakening",
      "The World": "completion and fulfillment"
    };
    
    return themes[cardName] || "cosmic energies";
  };

  // Setup component - Fetch real reading from FastAPI
  React.useEffect(() => {
    // Reset mounted ref to true when component mounts
    mounted.current = true;
    
    // Fetch real three-card reading from FastAPI
    const fetchThreeCardReading = async () => {
      if (!mounted.current) return;
      
      try {
        setIsLoading(true);
        
        // 🔄 UPDATED: Using FastAPI via API_CONFIG helper
        // OLD: Mock data generated locally
        // NEW: Real API call to FastAPI three_card_reading endpoint
        console.log('🎴 Fetching three-card reading from FastAPI:', window.API_CONFIG.BASE_URL);
        console.log('📤 User data:', { nfc_id: userData&&nfc_id });
        
        const data = await window.API_CONFIG.post(
          window.API_CONFIG.ENDPOINTS.THREE_CARD_READING,
          { nfc_id: userData.nfc_id }
        );
        
        console.log('✅ Three-card reading received:', data);
        
        if (mounted.current) {
          setReadingData(data.data);
          setStep('initial');
        }
        
      } catch (err) {
        console.error('❌ Error fetching three-card reading:', err);
        if (mounted.current) {
          setError(err.message || 'Failed to load your three-card reading');
        }
      } finally {
        if (mounted.current) {
          setIsLoading(false);
        }
      }
    };
    
    fetchThreeCardReading();
    
    // Cleanup function
    return () => {
      mounted.current = false;
    };
  }, []);

  // Handle card click to reveal
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

  // Extract sections from interpretation
  const extractSections = (text) => {
    if (!text) return [];
    
    const sections = [];
    const sectionPattern = /\[SECTION_(\d+)\]([\s\S]*?)\[\/SECTION_\1\]/g;
    
    let match;
    while ((match = sectionPattern.exec(text)) !== null) {
      sections.push({
        index: parseInt(match[1], 10),
        content: match[2].trim()
      });
    }
    
    return sections.sort((a, b) => a.index - b.index);
  };

  // For styling
  const mainContainerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    backgroundColor: 'rgba(10, 10, 31, 0.8)',
    borderRadius: '15px',
    opacity: 0,
    animation: 'fadeIn 0.5s ease forwards'
  };
  
  const titleStyle = {
    fontSize: '2rem',
    color: '#F4A261',
    marginBottom: '1.5rem',
    textAlign: 'center',
    fontWeight: 600,
    letterSpacing: '0.5px'
  };
  
  const instructionStyle = {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontSize: '1rem',
    margin: '2rem 0',
    lineHeight: '1.6'
  };
  
  const buttonStyle = {
    padding: '1rem 2rem',
    backgroundColor: 'rgba(165, 154, 209, 0.2)',
    color: '#fff',
    border: '1.5px solid #A59AD1',
    borderRadius: '25px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    margin: '0 10px'
  };
  
  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'rgba(244, 162, 97, 0.2)',
    border: '1.5px solid #F4A261',
  };
  
  const cardContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '20px',
    margin: '2rem 0'
  };
  
  const cardWrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '180px'
  };
  
  const cardPositionStyle = {
    color: '#F4A261',
    fontSize: '1.1rem',
    marginBottom: '1rem',
    textAlign: 'center'
  };
  
  const cardStyle = {
    width: '100%',
    height: '280px',
    position: 'relative',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.8s ease-in-out',
    cursor: 'pointer',
    borderRadius: '12px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)'
  };
  
  const revealedCardStyle = {
    ...cardStyle,
    transform: 'rotateY(180deg)'
  };
  
  const cardFaceStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: '12px',
    overflow: 'hidden'
  };
  
  const cardFrontStyle = {
    ...cardFaceStyle,
    transform: 'rotateY(180deg)'
  };
  
  const cardImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '12px'
  };
  
  const cardNameStyle = {
    marginTop: '1rem',
    fontSize: '1rem',
    color: '#A59AD1',
    textAlign: 'center'
  };
  
  const actionsStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '2rem'
  };
  
  const sectionStyle = {
    backgroundColor: 'rgba(26, 26, 38, 0.7)',
    borderRadius: '15px',
    padding: '20px',
    marginBottom: '20px',
    border: '1px solid rgba(165, 154, 209, 0.1)'
  };

  // Animation styles
  const animationStyles = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;

  // If there's an error
  if (error) {
    return React.createElement('div', {
      style: {
        ...mainContainerStyle,
        animation: 'fadeIn 0.5s ease forwards'
      }
    }, [
      React.createElement('style', {
        key: 'animation-style'
      }, animationStyles),
      
      React.createElement('h1', {
        key: 'error-title',
        style: titleStyle
      }, 'Three Card Reading'),
      
      React.createElement('div', {
        key: 'error-message',
        style: {
          backgroundColor: 'rgba(255, 107, 107, 0.1)',
          border: '1px solid rgba(255, 107, 107, 0.3)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          color: '#ff6b6b',
          textAlign: 'center'
        }
      }, [
        React.createElement('p', null, "We're experiencing a cosmic disturbance with the reading.")
      ]),
      
      React.createElement('div', {
        key: 'actions',
        style: actionsStyle
      }, [
        React.createElement('button', {
          key: 'back-button',
          onClick: onComplete,
          style: secondaryButtonStyle
        }, 'Return to Daily Reading')
      ])
    ]);
  }

  // If still loading
  if (isLoading || step === 'loading') {
    return React.createElement('div', {
      style: {
        ...mainContainerStyle,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        animation: 'fadeIn 0.5s ease forwards'
      }
    }, [
      React.createElement('style', {
        key: 'animation-styles'
      }, animationStyles),
      
      React.createElement('div', {
        key: 'loader',
        style: {
          width: '60px',
          height: '60px',
          border: '3px solid rgba(165, 154, 209, 0.3)',
          borderRadius: '50%',
          borderTop: '3px solid #A59AD1',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }
      }),
      
      React.createElement('p', {
        key: 'loading-text',
        style: {
          color: '#A59AD1',
          fontSize: '1.1rem'
        }
      }, 'The universe is aligning your cards...')
    ]);
  }

  // Initial screen
  if (step === 'initial') {
    return React.createElement('div', {
      style: {
        ...mainContainerStyle,
        animation: 'fadeIn 0.5s ease forwards'
      }
    }, [
      React.createElement('style', {
        key: 'animation-style'
      }, animationStyles),
      
      React.createElement('h1', {
        key: 'title',
        style: titleStyle
      }, 'Your Three Card Journey'),
      
      React.createElement('p', {
        key: 'instruction',
        style: instructionStyle
      }, 'Discover insights about your past, present, and future with this three-card spread. Each card reveals part of your cosmic journey.'),
      
      React.createElement('div', {
        key: 'actions',
        style: actionsStyle
      }, [
        React.createElement('button', {
          key: 'start-button',
          style: buttonStyle,
          onClick: handleStartReading
        }, 'Begin Your Reading ✨'),
        
        React.createElement('button', {
          key: 'back-button',
          style: secondaryButtonStyle,
          onClick: onComplete
        }, 'Return to Daily Reading')
      ])
    ]);
  }

  // Card revealing phase
  if (step === 'revealing') {
    return React.createElement('div', {
      style: {
        ...mainContainerStyle,
        animation: 'fadeIn 0.5s ease forwards'
      }
    }, [
      React.createElement('style', {
        key: 'animation-styles'
      }, animationStyles),
      
      React.createElement('h1', {
        key: 'title',
        style: titleStyle
      }, 'Your Three Card Reading'),
      
      React.createElement('p', {
        key: 'instruction',
        style: instructionStyle
      }, 'Click each card to reveal its cosmic message'),
      
      // Three cards container
      React.createElement('div', {
        key: 'cards-container',
        style: cardContainerStyle
      }, readingData.cards.map((cardImage, index) => 
        React.createElement('div', {
          key: `card-position-${index}`,
          style: cardWrapperStyle
        }, [
          React.createElement('div', {
            key: `position-title-${index}`,
            style: cardPositionStyle
          }, positions[index]),
          
          React.createElement('div', {
            key: `card-${index}`,
            style: revealedCards[index] ? revealedCardStyle : cardStyle,
            onClick: () => handleCardClick(index)
          }, [
            // Card back (shown initially)
            React.createElement('div', {
              key: `card-back-${index}`,
              style: cardFaceStyle
            }, [
              React.createElement('img', {
                src: '/static/images/cards/card-back.jpg',
                alt: 'Card Back',
                style: cardImageStyle
              })
            ]),
            
            // Card front (revealed on click)
            React.createElement('div', {
              key: `card-front-${index}`,
              style: cardFrontStyle
            }, [
              React.createElement('img', {
                src: cardImage,
                alt: readingData.cardNames ? readingData.cardNames[index] : `${positions[index]} Card`,
                style: cardImageStyle,
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
            style: cardNameStyle
          }, readingData.cardNames ? readingData.cardNames[index] : '')
        ])
      )),
      
      // Continue button appears when all cards are revealed
      revealedCards.every(Boolean) && React.createElement('div', {
        key: 'continue-button-container',
        style: {
          textAlign: 'center',
          marginTop: '2rem',
          animation: 'fadeIn 0.5s ease forwards'
        }
      }, [
        React.createElement('button', {
          key: 'continue-button',
          style: buttonStyle,
          onClick: () => setStep('completed')
        }, 'Continue to Your Reading')
      ])
    ]);
  }

  // Completed reading with interpretation
  if (step === 'completed') {
    const sections = extractSections(readingData.interpretation);
    
    return React.createElement('div', {
      style: {
        ...mainContainerStyle,
        animation: 'fadeIn 0.5s ease forwards'
      }
    }, [
      React.createElement('style', {
        key: 'animation-styles'
      }, animationStyles),
      
      React.createElement('h1', {
        key: 'title',
        style: titleStyle
      }, 'Your Reading Interpretation'),
      
      // Mini card display
      React.createElement('div', {
        key: 'mini-cards',
        style: {
          display: 'flex',
          justifyContent: 'center',
          gap: '15px',
          margin: '1.5rem 0',
          flexWrap: 'wrap'
        }
      }, readingData.cards.map((cardImage, index) => 
        React.createElement('div', {
          key: `mini-card-${index}`,
          style: {
            width: '90px',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            opacity: activeCardIndex === index ? 1 : 0.7,
            transform: activeCardIndex === index ? 'scale(1.05)' : 'scale(1)',
            border: activeCardIndex === index ? '2px solid #A59AD1' : 'none'
          },
          onClick: () => setActiveCardIndex(index)
        }, [
          React.createElement('img', {
            src: cardImage,
            alt: readingData.cardNames ? readingData.cardNames[index] : `${positions[index]} Card`,
            style: {
              width: '100%',
              height: '120px',
              objectFit: 'cover'
            }
          }),
          React.createElement('div', {
            style: {
              backgroundColor: 'rgba(26, 26, 38, 0.9)',
              color: '#F4A261',
              textAlign: 'center',
              padding: '5px 0',
              fontSize: '0.8rem'
            }
          }, positions[index])
        ])
      )),
      
      // Reading sections
      React.createElement('div', {
        key: 'reading-sections',
        style: {
          marginTop: '2rem'
        }
      }, sections.length > 0 ? 
        // If we have properly formatted sections, show them
        sections.map((section, index) => 
          React.createElement('div', {
            key: `section-${index}`,
            style: {
              ...sectionStyle,
              display: activeCardIndex === index ? 'block' : 'none',
              animation: 'fadeIn 0.5s ease'
            }
          }, [
            React.createElement('div', {
              key: `section-content-${index}`,
              style: {
                whiteSpace: 'pre-wrap',
                lineHeight: '1.7'
              }
            }, section.content)
          ])
        ) : 
        // Otherwise show the whole interpretation
        React.createElement('div', {
          key: 'full-interpretation',
          style: sectionStyle
        }, [
          React.createElement('div', {
            style: {
              whiteSpace: 'pre-wrap',
              lineHeight: '1.7'
            }
          }, readingData.interpretation.replace(/\[(.*?)\]/g, ''))
        ])
      ),
      
      // Action buttons
      React.createElement('div', {
        key: 'actions',
        style: actionsStyle
      }, [
        React.createElement('button', {
          key: 'return-button',
          style: buttonStyle,
          onClick: onComplete
        }, 'Return to Daily Reading')
      ]),
      
      // Footer
      React.createElement('p', {
        key: 'footer',
        style: {
          fontSize: '0.9rem',
          marginTop: '2rem',
          opacity: 0.8,
          textAlign: 'center'
        }
      }, "Return tomorrow for a fresh cosmic perspective ✨")
    ]);
  }

  // Fallback
  return null;
};

// Add to window so it can be referenced from other components
window.ThreeCardReading = ThreeCardReading;