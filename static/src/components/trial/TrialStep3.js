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

  return (
    <div className={`step3-container ${isVisible ? 'visible' : ''}`}>
      <div className="card-section">
        <div 
          className="card-image-container"
          onClick={() => setSelectedCard(0)}
        >
          <img 
            src={cardImage}
            alt={cardName}
            className="tarot-card-image"
          />
        </div>
      </div>

      <div className="reading-section">
        <h2 className="reading-title">Your Reading</h2>
        <div className="interpretation-text">
          {interpretation}
          <div className="scroll-indicator">
            <div className="scroll-arrow"></div>
          </div>
        </div>
      </div>

      <button 
        className={`floating-chat-button ${showChat ? 'hidden' : ''}`}
        onClick={handleChatOpen}
      >
        <img src="/static/icons/chat.svg" alt="Chat" className="button-icon" />
      </button>

      {showChat && (
        <ChatInterface
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

      {selectedCard !== null && (
        <div className="card-overlay" onClick={() => setSelectedCard(null)}>
          <div className="enlarged-card">
            <img src={cardImage} alt={cardName} />
          </div>
        </div>
      )}
    </div>
  );
}

window.TrialStep3 = TrialStep3;