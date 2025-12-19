// ========================================
// NEOARCANA - TRIAL STEP 3 (READING DISPLAY)
// FIXED: Parses interpretation tags into sections
// Side-by-side layout on desktop, stacked on mobile
// ========================================

const TrialStep3 = ({ 
  cardImage, 
  cardName, 
  interpretation, 
  name, 
  zodiacSign, 
  language 
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [showChat, setShowChat] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [currentLanguage, setCurrentLanguage] = React.useState(language);
  const [chatHistory, setChatHistory] = React.useState(null);

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
    
    // Split by section markers
    const cardReading = text.match(/\[CARD_READING\]([\s\S]*?)(?=\[|$)/);
    const numerology = text.match(/\[NUMEROLOGY_INSIGHT\]([\s\S]*?)(?=\[|$)/);
    const affirmation = text.match(/\[DAILY_AFFIRMATION\]([\s\S]*?)(?=\[|$)/);
    
    if (cardReading && cardReading[1]) {
      sections.push({
        title: 'Card Reading',
        icon: '🔮',
        content: cardReading[1].trim()
      });
    }
    
    if (numerology && numerology[1]) {
      sections.push({
        title: 'Numerology',
        icon: '✨',
        content: numerology[1].trim()
      });
    }
    
    if (affirmation && affirmation[1]) {
      sections.push({
        title: 'Affirmation',
        icon: '💫',
        content: affirmation[1].trim()
      });
    }
    
    // If no sections found, return the whole text as one section
    if (sections.length === 0) {
      sections.push({
        title: 'Your Reading',
        icon: '🔮',
        content: text
      });
    }
    
    return sections;
  };

  const sections = parseInterpretation(interpretation);

  return React.createElement("div", { 
    className: `trial-step3-container ${isVisible ? 'visible' : ''}` 
  },
    
    // Main reading container with side-by-side layout
    React.createElement("div", { className: "trial-step3-reading-layout" },
      
      // LEFT SIDE: Card Section
      React.createElement("div", { className: "trial-step3-card-column" },
        React.createElement("div", { 
          className: "trial-step3-card-container",
          onClick: () => setSelectedCard(0)
        },
          React.createElement("img", {
            src: cardImage,
            alt: cardName,
            className: "trial-step3-card-image"
          })
        ),
        
        // Card name below card
        React.createElement("h3", { className: "trial-step3-card-name" }, 
          cardName
        )
      ),

      // RIGHT SIDE: Reading Section
      React.createElement("div", { className: "trial-step3-reading-column" },
        React.createElement("h2", { className: "trial-step3-reading-title" }, 
          "Your Reading"
        ),
        
        React.createElement("div", { className: "trial-step3-interpretation-container" },
          
          // Render each section
          sections.map((section, index) => 
            React.createElement("div", { 
              key: index,
              className: "trial-step3-section"
            },
              React.createElement("div", { className: "trial-step3-section-header" },
                React.createElement("span", { className: "trial-step3-section-icon" }, section.icon),
                React.createElement("h3", { className: "trial-step3-section-title" }, section.title)
              ),
              React.createElement("div", { className: "trial-step3-section-content" },
                section.content
              )
            )
          ),
          
          // Scroll indicator (only shows when content overflows)
          React.createElement("div", { className: "trial-step3-scroll-indicator" },
            React.createElement("div", { className: "trial-step3-scroll-arrow" })
          )
        )
      )
    ),

    // Chat Button (LEFT side)
    React.createElement("button", {
      className: `trial-step3-chat-button ${showChat ? 'hidden' : ''}`,
      onClick: handleChatOpen,
      title: "Chat about your reading"
    },
      React.createElement("img", {
        src: "/static/icons/chat.svg",
        alt: "Chat",
        className: "trial-step3-chat-icon"
      })
    ),

    // Chat Interface
    showChat && React.createElement(window.ChatInterface, {
      onClose: handleChatClose,
      name: name,
      zodiacSign: zodiacSign,
      cardName: cardName,
      interpretation: interpretation,
      isPremium: false,
      language: currentLanguage,
      chatHistory: chatHistory,
      onChatHistoryUpdate: setChatHistory
    }),

    // Card Overlay (full screen when clicked)
    selectedCard !== null && React.createElement("div", {
      className: "trial-step3-card-overlay",
      onClick: () => setSelectedCard(null)
    },
      React.createElement("div", { className: "trial-step3-enlarged-card" },
        React.createElement("img", {
          src: cardImage,
          alt: cardName
        })
      )
    )
  );
};

window.TrialStep3 = TrialStep3;