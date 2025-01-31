const PremiumStep3 = ({ 
  name, 
  zodiacSign, 
  premiumCards, 
  interpretation,
  language 
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [showChat, setShowChat] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState(0);
  const [currentLanguage, setCurrentLanguage] = React.useState(language);

  // Track language changes
  React.useEffect(() => {
    console.log('[PremiumStep3] Language prop changed:', language);
    if (language !== currentLanguage) {
      console.log('[PremiumStep3] Updating current language to:', language);
      setCurrentLanguage(language);
    }
  }, [language]);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChatOpen = () => {
    console.log('[PremiumStep3] Opening chat with language:', currentLanguage);
    setShowChat(true);
  };

  const handleChatClose = () => {
    console.log('[PremiumStep3] Closing chat');
    setShowChat(false);
  };

  const extractSections = (text) => {
    const sections = [];
    const markers = ['[PAST]', '[PRESENT]', '[FUTURE]'];
    
    markers.forEach((marker, index) => {
      const startIndex = text.indexOf(marker) + marker.length;
      const endIndex = index < markers.length - 1 
        ? text.indexOf(markers[index + 1])
        : text.length;
        
      if (startIndex !== -1 && endIndex !== -1) {
        const content = text.slice(startIndex, endIndex).trim();
        sections.push({
          title: marker.replace(/[\[\]]/g, ''),
          content: content
        });
      }
    });
    
    return sections;
  };

  const sections = extractSections(interpretation);

  // Scroll indicator logic remains the same...
  React.useEffect(() => {
    const readingContents = document.querySelectorAll('.reading-content');
    
    readingContents.forEach(content => {
      let indicator = null;
      if (content.parentElement) {
        indicator = content.parentElement.querySelector('.scroll-indicator');
      }
      let isScrolling;
      
      const updateIndicator = () => {
        if (!content || !indicator) return;
        
        const isScrollable = content.scrollHeight > content.clientHeight;
        const isScrolledToBottom = content.scrollHeight - content.scrollTop <= content.clientHeight + 20;
        
        if (isScrollable && !isScrolledToBottom && !isScrolling) {
          indicator.classList.remove('hidden');
        } else {
          indicator.classList.add('hidden');
        }
      };

      const handleScroll = () => {
        if (indicator) {
          indicator.classList.add('hidden');
          isScrolling = true;
          clearTimeout(content.scrollTimeout);
          
          content.scrollTimeout = setTimeout(() => {
            isScrolling = false;
            updateIndicator();
          }, 150);
        }
      };

      if (content) {
        content.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', updateIndicator);
        setTimeout(updateIndicator, 100);
      }

      return () => {
        if (content) {
          content.removeEventListener('scroll', handleScroll);
          window.removeEventListener('resize', updateIndicator);
        }
      };
    });
  }, []);

  return (
    <div className={`step3-container premium ${isVisible ? 'visible' : ''}`}>
      <div className="premium-interpretation">
        {sections.map((section, index) => (
          <div 
            key={index}
            className={`reading-column ${activeSection === index ? 'active' : ''}`}
          >
            <div 
              className={`timeline-card ${activeSection === index ? 'active' : ''}`}
              onClick={() => setActiveSection(index)}
            >
              <img src={premiumCards[index]} alt={`${section.title.toLowerCase()} Card`} />
            </div>
            <h4 className="column-title">{section.title}</h4>
            <div className="reading-content-wrapper">
              <div className="reading-content">
                {section.content}
              </div>
              <div className="scroll-indicator">
                <div className="scroll-arrow"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="navigation-dots">
        {sections.map((_, index) => (
          <div 
            key={index}
            className={`dot ${activeSection === index ? 'active' : ''}`}
            onClick={() => setActiveSection(index)}
          />
        ))}
      </div>

      {!showChat && (
        <div className="chat-button-container">
          <button 
            className="chat-button"
            onClick={handleChatOpen}
          >
            Discuss Your Reading
          </button>
        </div>
      )}

      {showChat && (
        <ChatInterface
          name={name}
          zodiacSign={zodiacSign}
          interpretation={interpretation}
          language={currentLanguage}
          isPremium={true}
          onClose={handleChatClose}
        />
      )}
    </div>
  );
};

window.PremiumStep3 = PremiumStep3;