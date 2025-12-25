// ========================================
// NEOARCANA - TRIAL STEP 3 (JSX VERSION)
// Clean, modern, and beautiful! 🎴
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

  // Three-card reading state
  const [showThreeCardReveal, setShowThreeCardReveal] = React.useState(false);
  const [showThreeCardInterpretation, setShowThreeCardInterpretation] = React.useState(false);
  const [threeCardData, setThreeCardData] = React.useState(null);
  const [isLoadingThreeCard, setIsLoadingThreeCard] = React.useState(false);

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

  // Handle three-card reading request
  const handleThreeCardReading = async () => {
    console.log('🎴 Requesting three-card reading...');
    setIsLoadingThreeCard(true);
    
    try {
      const response = await window.API_CONFIG.post(
        '/api/nfc/three_card_reading',
        { 
          nfc_id: null,
          userData: {
            name: name,
            zodiacSign: zodiacSign,
            language: language
          }
        }
      );
      
      console.log('✅ Three-card reading received:', response);
      
      if (response.success && response.data) {
        setThreeCardData(response.data);
        setShowThreeCardReveal(true);
      }
    } catch (error) {
      console.error('❌ Error getting three-card reading:', error);
      alert('Unable to generate three-card reading. Please try again.');
    } finally {
      setIsLoadingThreeCard(false);
    }
  };

  // Handle completion of three-card reveal (go to interpretation)
  const handleThreeCardRevealComplete = () => {
    console.log('✅ Three-card reveal complete, showing interpretation');
    setShowThreeCardReveal(false);
    setShowThreeCardInterpretation(true);
  };

  // Handle return from three-card interpretation
  const handleReturnFromThreeCard = () => {
    console.log('↩️ Returning to single card view');
    setShowThreeCardInterpretation(false);
    setThreeCardData(null);
  };

  // Parse interpretation into sections
  const parseInterpretation = (text) => {
    if (!text) return [];
    
    const sections = [];
    
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

  return (
    <div className={`trial-step3-container ${isVisible ? 'visible' : ''}`}>
      
      {/* Show THREE-CARD REVEAL */}
      {showThreeCardReveal && threeCardData ? (
        <window.ThreeCardReveal
          name={name}
          readingData={threeCardData}
          onComplete={handleThreeCardRevealComplete}
          zodiacSign={zodiacSign}
        />
      )
      
      /* Show THREE-CARD INTERPRETATION */
      : showThreeCardInterpretation && threeCardData ? (
        <window.ThreeCardInterpretation
          readingData={threeCardData}
          name={name}
          zodiacSign={zodiacSign}
          language={currentLanguage}
          onReturn={handleReturnFromThreeCard}
        />
      )
      
      /* Show SINGLE CARD VIEW (original) */
      : (
        <>
          {/* Main reading container */}
          <div className="trial-step3-reading-layout">
            
            {/* LEFT: Card Section WITH BUTTON! */}
            <div className="trial-step3-card-column">
              
              {/* Card Image */}
              <div 
                className="trial-step3-card-container"
                onClick={() => setSelectedCard(0)}
              >
                <img
                  src={cardImage}
                  alt={cardName}
                  className="trial-step3-card-image"
                />
              </div>
              
              {/* Card Name */}
              <h3 className="trial-step3-card-name">
                {cardName}
              </h3>

              {/* THREE-CARD BUTTON (Under card name!) */}
              <div className="trial-step3-card-actions">
                {!isLoadingThreeCard ? (
                  <button
                    onClick={handleThreeCardReading}
                    className="three-card-button-sidebar"
                  >
                    <span className="three-card-button-icon">🎴</span>
                    <span>Reveal Past • Present • Future</span>
                  </button>
                ) : (
                  /* Loading state */
                  <div className="cosmic-loader-sidebar">
                    <div className="loader-spinner" />
                    <p className="loader-text">
                      ✨ Consulting...
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Reading Section */}
            <div className="trial-step3-reading-column">
              <h2 className="trial-step3-reading-title">
                Your Reading
              </h2>
              
              <div className="trial-step3-interpretation-container">
                
                {sections.map((section, index) => (
                  <div 
                    key={index}
                    className="trial-step3-section"
                  >
                    <div className="trial-step3-section-header">
                      <span className="trial-step3-section-icon">
                        {section.icon}
                      </span>
                      <h3 className="trial-step3-section-title">
                        {section.title}
                      </h3>
                    </div>
                    <div className="trial-step3-section-content">
                      {section.content}
                    </div>
                  </div>
                ))}
                
                <div className="trial-step3-scroll-indicator">
                  <div className="trial-step3-scroll-arrow" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Chat Button (only in single card view) */}
      {!showThreeCardReveal && !showThreeCardInterpretation && (
        <button
          className={`trial-step3-chat-button ${showChat ? 'hidden' : ''}`}
          onClick={handleChatOpen}
          title="Chat about your reading"
        >
          <img
            src="/static/icons/chat.svg"
            alt="Chat"
            className="trial-step3-chat-icon"
          />
        </button>
      )}

      {/* Chat Interface */}
      {showChat && (
        <window.ChatInterface
          onClose={handleChatClose}
          name={name}
          zodiacSign={zodiacSign}
          cardName={cardName}
          interpretation={interpretation}
          isPremium={false}
          language={currentLanguage}
          chatHistory={chatHistory}
          onChatHistoryUpdate={setChatHistory}
        />
      )}

      {/* Card Overlay */}
      {selectedCard !== null && (
        <div
          className="trial-step3-card-overlay"
          onClick={() => setSelectedCard(null)}
        >
          <div className="trial-step3-enlarged-card">
            <img
              src={cardImage}
              alt={cardName}
            />
          </div>
        </div>
      )}
    </div>
  );
};

window.TrialStep3 = TrialStep3;