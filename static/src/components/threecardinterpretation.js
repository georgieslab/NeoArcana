// ========================================
// NEOARCANA - THREE CARD INTERPRETATION
// NEW LAYOUT: Cards at top, reading below! 🎴
// ========================================

const ThreeCardInterpretation = ({ 
  readingData,
  name, 
  zodiacSign, 
  language,
  onReturn
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [showChat, setShowChat] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [currentLanguage, setCurrentLanguage] = React.useState(language);
  const [chatHistory, setChatHistory] = React.useState(null);

  const positions = ['Past', 'Present', 'Future'];
  const positionIcons = ['🌙', '⭐', '✨'];
  const positionColors = ['#9370DB', '#A59AD1', '#F4A261'];

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  React.useEffect(() => {
    if (language !== currentLanguage) {
      setCurrentLanguage(language);
    }
  }, [language]);

  const handleChatOpen = () => {
    setShowChat(true);
  };

  const handleChatClose = () => {
    setShowChat(false);
  };

  // Parse interpretation into sections
  const parseInterpretation = (text) => {
    if (!text) return [];
    
    const sections = [];
    
    // Look for [PAST], [PRESENT], [FUTURE], [INTEGRATION]
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
    
    // Fallback if no sections found
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

  return React.createElement("div", { 
    className: `three-card-top-layout ${isVisible ? 'visible' : ''}` 
  },
    
    // Page Container
    React.createElement("div", { className: "three-card-page-container" },
      
      // Header
      React.createElement("div", { className: "three-card-page-header" },
        React.createElement("h1", { className: "three-card-page-title" },
          '🔮 Your Three-Card Journey 🔮'
        ),
        name && React.createElement("p", { className: "three-card-page-subtitle" },
          `A personalized reading for ${name}`
        )
      ),

      // THREE CARDS AT TOP - Horizontal Row
      React.createElement("div", { className: "three-card-top-cards-row" },
        readingData.cards.map((cardImage, index) =>
          React.createElement("div", {
            key: index,
            className: "three-card-top-card-item",
            onClick: () => setSelectedCard(index),
            style: { '--card-delay': `${index * 0.15}s` }
          },
            // Position Label
            React.createElement("div", { 
              className: "card-top-position",
              style: { color: positionColors[index] }
            },
              React.createElement("span", { className: "position-icon-top" }, positionIcons[index]),
              ' ',
              positions[index]
            ),

            // Card Image (smaller)
            React.createElement("div", { className: "card-top-image-wrapper" },
              React.createElement("img", {
                src: cardImage,
                alt: readingData.cardNames[index],
                className: "card-top-image"
              }),
              // Hover overlay
              React.createElement("div", { className: "card-top-hover" },
                React.createElement("span", null, 'Click to Enlarge')
              )
            ),
            
            // Card Name
            React.createElement("div", { 
              className: "card-top-name",
              style: { color: positionColors[index] }
            }, readingData.cardNames[index])
          )
        )
      ),

      // Cosmic Info (centered below cards)
      (readingData.moonPhase || readingData.season) && React.createElement("div", { 
        className: "three-card-cosmic-bar" 
      },
        readingData.moonPhase && React.createElement("div", { className: "cosmic-bar-item" },
          React.createElement("span", { className: "cosmic-bar-icon" }, '🌙'),
          React.createElement("span", null, ` ${readingData.moonPhase}`)
        ),
        readingData.season && React.createElement("div", { className: "cosmic-bar-item" },
          React.createElement("span", { className: "cosmic-bar-icon" }, '🍂'),
          React.createElement("span", null, ` ${readingData.season}`)
        )
      ),

      // READING SECTIONS BELOW
      React.createElement("div", { className: "three-card-reading-sections" },
        
        sections.map((section, index) => 
          React.createElement("div", { 
            key: index,
            className: `reading-section section-${section.position}`,
            style: { '--section-delay': `${index * 0.15}s` }
          },
            // Section Header
            React.createElement("div", { className: "reading-section-header" },
              React.createElement("div", { 
                className: "section-icon-wrapper",
                style: { 
                  background: `linear-gradient(135deg, ${section.color}33, ${section.color}11)`,
                  borderColor: section.color
                }
              },
                React.createElement("span", { className: "section-icon" }, section.icon)
              ),
              React.createElement("h2", { 
                className: "section-title",
                style: { color: section.color }
              }, section.title)
            ),
            
            // Section Content
            React.createElement("div", { className: "reading-section-content" },
              section.content
            )
          )
        )
      )
    ),

    // Return Button
    onReturn && React.createElement("button", {
      className: "three-card-return-btn",
      onClick: onReturn
    },
      '← Return to Single Card'
    ),

    // Chat Button (floating)
    React.createElement("button", {
      className: `three-card-chat-btn ${showChat ? 'hidden' : ''}`,
      onClick: handleChatOpen,
      title: "Chat about your reading"
    },
      React.createElement("img", {
        src: "/static/icons/chat.svg",
        alt: "Chat",
        className: "chat-btn-icon"
      })
    ),

    // Chat Interface
    showChat && React.createElement(window.ChatInterface, {
      onClose: handleChatClose,
      name: name,
      zodiacSign: zodiacSign,
      cardName: `${readingData.cardNames[0]}, ${readingData.cardNames[1]}, ${readingData.cardNames[2]}`,
      interpretation: readingData.interpretation,
      isPremium: false,
      language: currentLanguage,
      chatHistory: chatHistory,
      onChatHistoryUpdate: setChatHistory
    }),

    // Card Overlay (enlarged view)
    selectedCard !== null && React.createElement("div", {
      className: "card-enlarged-overlay",
      onClick: () => setSelectedCard(null)
    },
      React.createElement("div", { 
        className: "card-enlarged-content",
        onClick: (e) => e.stopPropagation()
      },
        React.createElement("div", { 
          className: "enlarged-position",
          style: { color: positionColors[selectedCard] }
        },
          positionIcons[selectedCard], ' ', positions[selectedCard]
        ),
        React.createElement("img", {
          src: readingData.cards[selectedCard],
          alt: readingData.cardNames[selectedCard],
          className: "enlarged-img"
        }),
        React.createElement("div", { 
          className: "enlarged-name",
          style: { color: positionColors[selectedCard] }
        },
          readingData.cardNames[selectedCard]
        ),
        React.createElement("button", {
          className: "enlarged-close",
          onClick: () => setSelectedCard(null)
        }, '✕')
      )
    )
  );
};

window.ThreeCardInterpretation = ThreeCardInterpretation;