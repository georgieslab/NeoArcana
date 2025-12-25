// ========================================
// NEOARCANA - THREE CARD INTERPRETATION
// JSX VERSION - Clean & Modern! 🎴
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

  return (
    <div className={`three-card-top-layout ${isVisible ? 'visible' : ''}`}>
      
      {/* Page Container */}
      <div className="three-card-page-container">
        
        {/* Header */}
        <div className="three-card-page-header">
          <h1 className="three-card-page-title">
            🔮 Your Three-Card Journey 🔮
          </h1>
          {name && (
            <p className="three-card-page-subtitle">
              A personalized reading for {name}
            </p>
          )}
        </div>

        {/* THREE CARDS AT TOP - Horizontal Row */}
        <div className="three-card-top-cards-row">
          {readingData.cards.map((cardImage, index) => (
            <div
              key={index}
              className="three-card-top-card-item"
              onClick={() => setSelectedCard(index)}
              style={{ '--card-delay': `${index * 0.15}s` }}
            >
              {/* Position Label */}
              <div 
                className="card-top-position"
                style={{ color: positionColors[index] }}
              >
                <span className="position-icon-top">{positionIcons[index]}</span>
                {' '}
                {positions[index]}
              </div>

              {/* Card Image (smaller) */}
              <div className="card-top-image-wrapper">
                <img
                  src={cardImage}
                  alt={readingData.cardNames[index]}
                  className="card-top-image"
                />
                {/* Hover overlay */}
                <div className="card-top-hover">
                  <span>Click to Enlarge</span>
                </div>
              </div>
              
              {/* Card Name */}
              <div 
                className="card-top-name"
                style={{ color: positionColors[index] }}
              >
                {readingData.cardNames[index]}
              </div>
            </div>
          ))}
        </div>

        {/* Cosmic Info (centered below cards) */}
        {(readingData.moonPhase || readingData.season) && (
          <div className="three-card-cosmic-bar">
            {readingData.moonPhase && (
              <div className="cosmic-bar-item">
                <span className="cosmic-bar-icon">🌙</span>
                <span> {readingData.moonPhase}</span>
              </div>
            )}
            {readingData.season && (
              <div className="cosmic-bar-item">
                <span className="cosmic-bar-icon">🍂</span>
                <span> {readingData.season}</span>
              </div>
            )}
          </div>
        )}

        {/* READING SECTIONS BELOW */}
        <div className="three-card-reading-sections">
          {sections.map((section, index) => (
            <div 
              key={index}
              className={`reading-section section-${section.position}`}
              style={{ '--section-delay': `${index * 0.15}s` }}
            >
              {/* Section Header */}
              <div className="reading-section-header">
                <div 
                  className="section-icon-wrapper"
                  style={{ 
                    background: `linear-gradient(135deg, ${section.color}33, ${section.color}11)`,
                    borderColor: section.color
                  }}
                >
                  <span className="section-icon">{section.icon}</span>
                </div>
                <h2 
                  className="section-title"
                  style={{ color: section.color }}
                >
                  {section.title}
                </h2>
              </div>
              
              {/* Section Content */}
              <div className="reading-section-content">
                {section.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Return Button */}
      {onReturn && (
        <button
          className="three-card-return-btn"
          onClick={onReturn}
        >
          ← Return to Single Card
        </button>
      )}

      {/* Chat Button (floating) */}
      <button
        className={`three-card-chat-btn ${showChat ? 'hidden' : ''}`}
        onClick={handleChatOpen}
        title="Chat about your reading"
      >
        <img
          src="/static/icons/chat.svg"
          alt="Chat"
          className="chat-btn-icon"
        />
      </button>

      {/* Chat Interface */}
      {showChat && (
        <window.ChatInterface
          onClose={handleChatClose}
          name={name}
          zodiacSign={zodiacSign}
          cardName={`${readingData.cardNames[0]}, ${readingData.cardNames[1]}, ${readingData.cardNames[2]}`}
          interpretation={readingData.interpretation}
          isPremium={false}
          language={currentLanguage}
          chatHistory={chatHistory}
          onChatHistoryUpdate={setChatHistory}
        />
      )}

      {/* Card Overlay (enlarged view) */}
      {selectedCard !== null && (
        <div
          className="card-enlarged-overlay"
          onClick={() => setSelectedCard(null)}
        >
          <div 
            className="card-enlarged-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="enlarged-position"
              style={{ color: positionColors[selectedCard] }}
            >
              {positionIcons[selectedCard]} {positions[selectedCard]}
            </div>
            <img
              src={readingData.cards[selectedCard]}
              alt={readingData.cardNames[selectedCard]}
              className="enlarged-img"
            />
            <div 
              className="enlarged-name"
              style={{ color: positionColors[selectedCard] }}
            >
              {readingData.cardNames[selectedCard]}
            </div>
            <button
              className="enlarged-close"
              onClick={() => setSelectedCard(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

window.ThreeCardInterpretation = ThreeCardInterpretation;