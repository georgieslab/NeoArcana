// ========================================
// NEOARCANA - THREE CARD INTERPRETATION
// VISIBLE GLASSY CONTAINER + DESKTOP SCROLL FIX! 🎴✨
// ========================================

import React, { useState, useEffect } from 'react';

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

  return (
    <div 
      className={`three-card-outer-container ${isVisible ? 'visible' : ''}`}
      style={{
        minHeight: '100vh',
        padding: '2rem 1rem',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      
      {/* VISIBLE GLASSY SCROLLABLE CONTAINER */}
      <div 
        className="three-card-glassy-container"
        style={{
          maxWidth: '1400px',
          maxHeight: '85vh',
          margin: '0 auto',
          padding: '2.5rem',
          
          // STRONGER BACKGROUND - More visible!
          background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.85), rgba(20, 20, 35, 0.9))',
          
          // Glass blur effect - Browser compatible
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          
          // VISIBLE BORDER - Glowing purple edge
          borderRadius: '24px',
          border: '3px solid rgba(165, 154, 209, 0.5)',
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 0 40px rgba(165, 154, 209, 0.3)
          `,
          
          // DESKTOP SCROLL FIX - Force scrolling!
          overflowY: 'scroll',
          overflowX: 'hidden',
          
          // Ensure it's a scroll container
          position: 'relative',
          
          // Custom scrollbar
          WebkitOverflowScrolling: 'touch'
        }}
      >
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              background: 'linear-gradient(135deg, #9370DB, #A59AD1, #F4A261)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: '800',
              marginBottom: '0.75rem',
              letterSpacing: '0.5px'
            }}
          >
            🔮 Your Three-Card Journey 🔮
          </h1>
          {name && (
            <p style={{ 
              fontSize: '1.2rem', 
              color: 'rgba(255, 255, 255, 0.8)',
              fontStyle: 'italic',
              margin: 0
            }}>
              A personalized reading for {name}
            </p>
          )}
        </div>

        {/* THREE CARDS AT TOP - Horizontal Row */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            marginBottom: '2.5rem',
            flexWrap: 'wrap'
          }}
        >
          {readingData.cards.map((cardImage, index) => (
            <div
              key={index}
              onClick={() => setSelectedCard(index)}
              style={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {/* Position Label */}
              <div style={{ 
                color: positionColors[index],
                fontSize: '1rem',
                fontWeight: '700',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
              }}>
                <span style={{ fontSize: '1.3rem' }}>{positionIcons[index]}</span>
                {' '}
                {positions[index]}
              </div>

              {/* Card Image */}
              <div style={{
                width: '200px',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                marginBottom: '1rem',
                border: '2px solid rgba(165, 154, 209, 0.3)'
              }}>
                <img
                  src={cardImage}
                  alt={readingData.cardNames[index]}
                  style={{ 
                    width: '100%', 
                    display: 'block' 
                  }}
                />
              </div>
              
              {/* Card Name */}
              <div style={{ 
                color: positionColors[index],
                fontSize: '1.1rem',
                fontWeight: '800',
                textAlign: 'center',
                maxWidth: '200px',
                textShadow: '0 2px 10px rgba(0,0,0,0.6)'
              }}>
                {readingData.cardNames[index]}
              </div>
            </div>
          ))}
        </div>

        {/* Cosmic Info */}
        {(readingData.moonPhase || readingData.season) && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2.5rem',
            padding: '1.25rem 2rem',
            background: 'rgba(165, 154, 209, 0.15)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '2px solid rgba(165, 154, 209, 0.3)',
            marginBottom: '3rem',
            flexWrap: 'wrap',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
          }}>
            {readingData.moonPhase && (
              <div style={{ 
                fontSize: '1.05rem',
                color: 'rgba(255, 255, 255, 0.95)',
                fontWeight: '600'
              }}>
                <span style={{ fontSize: '1.4rem' }}>🌙</span> {readingData.moonPhase}
              </div>
            )}
            {readingData.season && (
              <div style={{ 
                fontSize: '1.05rem',
                color: 'rgba(255, 255, 255, 0.95)',
                fontWeight: '600'
              }}>
                <span style={{ fontSize: '1.4rem' }}>🍂</span> {readingData.season}
              </div>
            )}
          </div>
        )}

        {/* READING SECTIONS - Scrollable content */}
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {sections.map((section, index) => (
            <div 
              key={index}
              style={{ marginBottom: '3rem' }}
            >
              {/* Section Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                marginBottom: '1.5rem',
                paddingBottom: '1rem',
                borderBottom: `2px solid ${section.color}44`
              }}>
                <div style={{ 
                  width: '55px',
                  height: '55px',
                  borderRadius: '14px',
                  border: `2px solid ${section.color}`,
                  background: `linear-gradient(135deg, ${section.color}33, ${section.color}11)`,
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  flexShrink: 0,
                  boxShadow: `0 4px 16px ${section.color}44`
                }}>
                  {section.icon}
                </div>
                <h2 style={{ 
                  color: section.color,
                  fontSize: '2rem',
                  fontWeight: '800',
                  margin: 0,
                  letterSpacing: '0.5px',
                  textShadow: `0 2px 20px ${section.color}88`
                }}>
                  {section.title}
                </h2>
              </div>
              
              {/* Section Content */}
              <div style={{
                fontSize: '1.15rem',
                lineHeight: '1.9',
                color: 'rgba(255, 255, 255, 0.95)',
                whiteSpace: 'pre-wrap',
                textAlign: 'justify',
                paddingLeft: '70px'
              }}>
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div style={{
          textAlign: 'center',
          padding: '2rem 0 1rem',
          opacity: 0.6,
          fontSize: '0.9rem',
          color: '#A59AD1',
          fontWeight: '600'
        }}>
          ✨ Scroll to read complete journey ✨
        </div>
      </div>

      {/* Return Button - Outside glassy container */}
      {onReturn && (
        <button
          onClick={onReturn}
          style={{
            position: 'fixed',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '1.1rem 2.75rem',
            fontSize: '1.1rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, rgba(165, 154, 209, 0.4), rgba(107, 78, 113, 0.4))',
            border: '2px solid #A59AD1',
            color: '#A59AD1',
            borderRadius: '60px',
            cursor: 'pointer',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            zIndex: 100,
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(-50%) translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 10px 32px rgba(165, 154, 209, 0.6)';
            e.currentTarget.style.borderColor = '#CEC7F2';
            e.currentTarget.style.color = '#CEC7F2';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(-50%)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
            e.currentTarget.style.borderColor = '#A59AD1';
            e.currentTarget.style.color = '#A59AD1';
          }}
        >
          ← Return to Single Card
        </button>
      )}

      {/* Card Overlay (enlarged view) */}
      {selectedCard !== null && (
        <div
          onClick={() => setSelectedCard(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            cursor: 'pointer'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem',
              position: 'relative'
            }}
          >
            <div style={{ 
              color: positionColors[selectedCard],
              fontSize: '1.3rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              padding: '0.75rem 1.5rem',
              background: 'rgba(26, 26, 38, 0.9)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: `2px solid ${positionColors[selectedCard]}`
            }}>
              {positionIcons[selectedCard]} {positions[selectedCard]}
            </div>
            <img
              src={readingData.cards[selectedCard]}
              alt={readingData.cardNames[selectedCard]}
              style={{
                maxWidth: '500px',
                maxHeight: '70vh',
                borderRadius: '20px',
                boxShadow: '0 24px 80px rgba(0, 0, 0, 0.8)'
              }}
            />
            <div style={{ 
              color: positionColors[selectedCard],
              fontSize: '2.5rem',
              fontWeight: '800',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)'
            }}>
              {readingData.cardNames[selectedCard]}
            </div>
            <button
              onClick={() => setSelectedCard(null)}
              style={{
                position: 'absolute',
                top: '-60px',
                right: '0',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(165, 154, 209, 0.4)',
                border: '2px solid #A59AD1',
                color: '#fff',
                fontSize: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(165, 154, 209, 0.6)';
                e.currentTarget.style.transform = 'rotate(90deg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(165, 154, 209, 0.4)';
                e.currentTarget.style.transform = 'rotate(0deg)';
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style>{`
        .three-card-glassy-container::-webkit-scrollbar {
          width: 12px;
        }
        
        .three-card-glassy-container::-webkit-scrollbar-track {
          background: rgba(165, 154, 209, 0.1);
          border-radius: 10px;
        }
        
        .three-card-glassy-container::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #A59AD1, #F4A261);
          border-radius: 10px;
          border: 2px solid rgba(26, 26, 46, 0.5);
        }
        
        .three-card-glassy-container::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #CEC7F2, #F4A261);
        }
      `}</style>
    </div>
  );
};

export default ThreeCardInterpretation;