// ========================================
// NEOARCANA - THREE CARD INTERPRETATION
// Clean JS with React.createElement + CSS file! 🎴
// ========================================

(function(global) {
  'use strict';

  const { React } = global;
  const { useState, useEffect } = React;

  const ThreeCardInterpretation = ({ 
    readingData,
    name, 
    zodiacSign, 
    language,
    onReturn
  }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const positions = ['Past', 'Present', 'Future'];
    const positionIcons = ['🌙', '⭐', '✨'];
    const positionColors = ['#9370DB', '#A59AD1', '#F4A261'];

    useEffect(() => {
      setIsVisible(true);
    }, []);

    // Parse interpretation into sections
    const parseInterpretation = (text) => {
      if (!text) return [];
      
      const sections = [];
      
      const past = text.match(/\[PAST\]([\s\S]*?)(?=\[PRESENT\]|\[FUTURE\]|\[INTEGRATION\]|$)/);
      const present = text.match(/\[PRESENT\]([\s\S]*?)(?=\[FUTURE\]|\[INTEGRATION\]|$)/);
      const future = text.match(/\[FUTURE\]([\s\S]*?)(?=\[INTEGRATION\]|$)/);
      const integration = text.match(/\[INTEGRATION\]([\s\S]*?)$/);
      
      if (past && past[1]) {
        sections.push({
          title: 'The Past',
          icon: '🌙',
          content: past[1].trim(),
          position: 'past',
          color: positionColors[0]
        });
      }
      
      if (present && present[1]) {
        sections.push({
          title: 'The Present',
          icon: '⭐',
          content: present[1].trim(),
          position: 'present',
          color: positionColors[1]
        });
      }
      
      if (future && future[1]) {
        sections.push({
          title: 'The Future',
          icon: '✨',
          content: future[1].trim(),
          position: 'future',
          color: positionColors[2]
        });
      }
      
      if (integration && integration[1]) {
        sections.push({
          title: 'Your Journey',
          icon: '🔮',
          content: integration[1].trim(),
          position: 'integration',
          color: '#CEC7F2'
        });
      }
      
      if (sections.length === 0) {
        sections.push({
          title: 'Your Reading',
          icon: '🔮',
          content: text,
          position: 'general',
          color: '#A59AD1'
        });
      }
      
      return sections;
    };

    const sections = parseInterpretation(readingData.interpretation);

    return React.createElement('div', {
      className: `three-card-outer ${isVisible ? 'visible' : ''}`
    },
      // GLASSY SCROLLABLE CONTAINER
      React.createElement('div', {
        className: 'three-card-glassy-container'
      },
        
        // Header
        React.createElement('div', {
          className: 'three-card-header'
        },
          React.createElement('h1', {
            className: 'three-card-title'
          }, '🔮 Your Three-Card Journey 🔮'),
          
          name && React.createElement('p', {
            className: 'three-card-subtitle'
          }, `A personalized reading for ${name}`)
        ),

        // THREE CARDS ROW
        React.createElement('div', {
          className: 'three-card-cards-row'
        },
          readingData.cards.map((cardImage, index) => {
            return React.createElement('div', {
              key: index,
              className: 'three-card-item',
              onClick: () => setSelectedCard(index)
            },
              // Position Label
              React.createElement('div', {
                className: `card-position card-position-${index}`,
                style: { color: positionColors[index] }
              },
                React.createElement('span', {
                  className: 'position-icon'
                }, positionIcons[index]),
                ' ',
                positions[index]
              ),

              // Card Image
              React.createElement('div', {
                className: 'card-image-wrapper',
                style: { 
                  borderColor: `${positionColors[index]}66`,
                  boxShadow: `0 10px 40px rgba(0,0,0,0.7), 0 0 20px ${positionColors[index]}44`
                }
              },
                React.createElement('img', {
                  src: cardImage,
                  alt: readingData.cardNames[index],
                  className: 'card-image'
                })
              ),
              
              // Card Name
              React.createElement('div', {
                className: 'card-name',
                style: { color: positionColors[index] }
              }, readingData.cardNames[index])
            );
          })
        ),

        // Cosmic Info Bar
        (readingData.moonPhase || readingData.season) && 
          React.createElement('div', {
            className: 'cosmic-info-bar'
          },
            readingData.moonPhase && 
              React.createElement('div', {
                className: 'cosmic-info-item'
              },
                React.createElement('span', {
                  className: 'cosmic-icon'
                }, '🌙'),
                ' ',
                readingData.moonPhase
              ),
            
            readingData.season && 
              React.createElement('div', {
                className: 'cosmic-info-item'
              },
                React.createElement('span', {
                  className: 'cosmic-icon'
                }, '🍂'),
                ' ',
                readingData.season
              )
          ),

        // READING SECTIONS
        React.createElement('div', {
          className: 'reading-sections'
        },
          sections.map((section, index) => {
            return React.createElement('div', {
              key: index,
              className: `reading-section section-${section.position}`
            },
              // Section Header
              React.createElement('div', {
                className: 'section-header',
                style: { borderBottomColor: `${section.color}66` }
              },
                React.createElement('div', {
                  className: 'section-icon-wrapper',
                  style: {
                    borderColor: section.color,
                    background: `linear-gradient(135deg, ${section.color}44, ${section.color}22)`,
                    boxShadow: `0 5px 20px ${section.color}66, inset 0 1px 0 rgba(255,255,255,0.2)`
                  }
                },
                  React.createElement('span', {
                    className: 'section-icon'
                  }, section.icon)
                ),
                
                React.createElement('h2', {
                  className: 'section-title',
                  style: { 
                    color: section.color,
                    textShadow: `0 3px 20px ${section.color}99`
                  }
                }, section.title)
              ),
              
              // Section Content
              React.createElement('div', {
                className: 'section-content'
              }, section.content)
            );
          })
        ),

        // Scroll indicator
        React.createElement('div', {
          className: 'scroll-indicator'
        }, '✨ Scroll to explore your complete journey ✨')
      ),

      // Return Button
      onReturn && React.createElement('button', {
        className: 'return-button',
        onClick: onReturn
      }, '← Return to Single Card'),

      // Card Overlay (enlarged view)
      selectedCard !== null && 
        React.createElement('div', {
          className: 'card-overlay',
          onClick: () => setSelectedCard(null)
        },
          React.createElement('div', {
            className: 'card-overlay-content',
            onClick: (e) => e.stopPropagation()
          },
            // Position label
            React.createElement('div', {
              className: 'overlay-position',
              style: { 
                color: positionColors[selectedCard],
                borderColor: positionColors[selectedCard],
                boxShadow: `0 6px 30px ${positionColors[selectedCard]}88`
              }
            },
              positionIcons[selectedCard],
              ' ',
              positions[selectedCard]
            ),
            
            // Enlarged image
            React.createElement('img', {
              src: readingData.cards[selectedCard],
              alt: readingData.cardNames[selectedCard],
              className: 'overlay-image',
              style: { borderColor: `${positionColors[selectedCard]}66` }
            }),
            
            // Card name
            React.createElement('div', {
              className: 'overlay-name',
              style: { 
                color: positionColors[selectedCard],
                textShadow: `0 5px 30px ${positionColors[selectedCard]}aa`
              }
            }, readingData.cardNames[selectedCard]),
            
            // Close button
            React.createElement('button', {
              className: 'overlay-close',
              onClick: () => setSelectedCard(null)
            }, '✕')
          )
        )
    );
  };

  // Export to global scope
  global.ThreeCardInterpretation = ThreeCardInterpretation;

})(window);