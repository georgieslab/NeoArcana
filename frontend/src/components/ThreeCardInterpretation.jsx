import { useState } from 'react';
import { renderFormattedParagraphs } from '../utils/textFormatter';

export default function ThreeCardInterpretation({
  readingData,
  name,
  zodiacSign,
  focusArea,
  language = 'en',
  onReturn,
  onOpenChat,
}) {
  const [selectedCard, setSelectedCard] = useState(null);

  const isKa = language === 'ka';
  const positions = isKa ? ['წარსული', 'აწმყო', 'მომავალი'] : ['Past', 'Present', 'Future'];
  const positionIcons = ['🌙', '⭐', '✨'];
  const positionColors = ['#a78bfa', '#38bdf8', '#f59e0b']; // Amethyst, Luminous Cyan/Lavender, Radiant Amber

  // Helper to sanitize markdown artifacts from AI generation
  const cleanSectionText = (str) => {
    if (!str) return '';
    return str
      .replace(/^[\s*#:\-_]+/, '') // Strip leading markdown chars
      .replace(/\[\/(?:PAST|PRESENT|FUTURE|INTEGRATION)\]/gi, '') // Strip closing tags
      .replace(/[\s*#:\-_]+$/, '') // Strip trailing markdown chars
      .trim();
  };

  // Robust parser for Bedrock/Claude reading formats
  const parseInterpretation = (rawText) => {
    const text = rawText || readingData?.reading_text || '';
    if (!text) {
      return [
        {
          title: isKa ? 'წარსული: ფესვები და გაკვეთილები' : 'The Past: Foundations & Lessons',
          icon: '🌙',
          content: isKa
            ? 'თქვენი სულის გზის განმსაზღვრელი წმინდა საფუძვლები და გამოცდილებები.'
            : 'The sacred foundations and experiences that shaped the path of your soul.',
          position: 'past',
          color: positionColors[0],
        },
        {
          title: isKa ? 'აწმყო: მიმდინარე ენერგეტიკული ნაკადები' : 'The Present: Active Energetic Influences',
          icon: '⭐',
          content: isKa
            ? 'ზეციური ძალები და შინაგანი სიბრძნე, რომელიც ამჟამად თქვენს განკარგულებაშია.'
            : 'The celestial forces and inner wisdom available to you in the current moment.',
          position: 'present',
          color: positionColors[1],
        },
        {
          title: isKa ? 'მომავალი: ბედისწერის ჰორიზონტი და პოტენციალი' : 'The Future: Unfolding Destiny & Potential',
          icon: '✨',
          content: isKa
            ? 'უმაღლესი შესაძლებლობები, რომლებიც იხსნება თქვენი შეგნებული არჩევანის კვალდაკვალ.'
            : 'The highest possibilities opening as your deliberate choices align with the cosmos.',
          position: 'future',
          color: positionColors[2],
        },
      ];
    }

    const sections = [];

    // Match [PAST] / **[PAST]** / ## Past / ## წარსული
    const pastRegex = /(?:\[PAST\]|\*\*\[PAST\]\*\*|\*\*PAST\*\*|##\s*Past|##\s*წარსული)([\s\S]*?)(?=(?:\[PRESENT\]|\*\*\[PRESENT\]\*\*|\*\*PRESENT\*\*|##\s*Present|##\s*აწმყო)|(?:\[FUTURE\]|\*\*\[FUTURE\]\*\*|\*\*FUTURE\*\*|##\s*Future|##\s*მომავალი)|(?:\[INTEGRATION\]|\*\*\[INTEGRATION\]\*\*|\*\*INTEGRATION\*\*|##\s*Integration|##\s*ინტეგრაცია)|$)/i;
    const presRegex = /(?:\[PRESENT\]|\*\*\[PRESENT\]\*\*|\*\*PRESENT\*\*|##\s*Present|##\s*აწმყო)([\s\S]*?)(?=(?:\[FUTURE\]|\*\*\[FUTURE\]\*\*|\*\*FUTURE\*\*|##\s*Future|##\s*მომავალი)|(?:\[INTEGRATION\]|\*\*\[INTEGRATION\]\*\*|\*\*INTEGRATION\*\*|##\s*Integration|##\s*ინტეგრაცია)|$)/i;
    const futRegex = /(?:\[FUTURE\]|\*\*\[FUTURE\]\*\*|\*\*FUTURE\*\*|##\s*Future|##\s*მომავალი)([\s\S]*?)(?=(?:\[INTEGRATION\]|\*\*\[INTEGRATION\]\*\*|\*\*INTEGRATION\*\*|##\s*Integration|##\s*ინტეგრაცია)|$)/i;
    const intRegex = /(?:\[INTEGRATION\]|\*\*\[INTEGRATION\]\*\*|\*\*INTEGRATION\*\*|##\s*Integration|##\s*ინტეგრაცია)([\s\S]*?)$/i;

    const pastMatch = text.match(pastRegex);
    const presMatch = text.match(presRegex);
    const futMatch = text.match(futRegex);
    const intMatch = text.match(intRegex);

    if (pastMatch && cleanSectionText(pastMatch[1])) {
      sections.push({
        title: isKa ? 'წარსული: ფესვები და მეხსიერება' : 'The Past: Foundations & Memory',
        icon: '🌙',
        content: cleanSectionText(pastMatch[1]),
        position: 'past',
        color: positionColors[0],
      });
    }
    if (presMatch && cleanSectionText(presMatch[1])) {
      sections.push({
        title: isKa ? 'აწმყო: მიმდინარე ენერგიები' : 'The Present: Currents of Now',
        icon: '⭐',
        content: cleanSectionText(presMatch[1]),
        position: 'present',
        color: positionColors[1],
      });
    }
    if (futMatch && cleanSectionText(futMatch[1])) {
      sections.push({
        title: isKa ? 'მომავალი: მომავლის ჰორიზონტი' : 'The Future: Horizon of Becoming',
        icon: '✨',
        content: cleanSectionText(futMatch[1]),
        position: 'future',
        color: positionColors[2],
      });
    }
    if (intMatch && cleanSectionText(intMatch[1])) {
      sections.push({
        title: isKa ? 'კოსმოსური სინთეზი და ინტეგრაცია' : 'Cosmic Synthesis & Spiritual Integration',
        icon: '🔮',
        content: cleanSectionText(intMatch[1]),
        position: 'integration',
        color: '#ffd700',
      });
    }

    // Fallback if no specific section markers matched
    if (sections.length === 0) {
      sections.push({
        title: isKa ? 'ღვთაებრივი არკანას გაშლა' : 'Divine Arcana Reading',
        icon: '🌌',
        content: text.trim(),
        position: 'overview',
        color: '#a59ad1',
      });
    }

    return sections;
  };

  const sections = parseInterpretation(readingData?.interpretation);

  // Normalize image URLs
  const getCardImgUrl = (card) => {
    if (!card) return '/static/images/cards/fallback-card.jpg';
    const img = typeof card === 'string' ? card : card.image || card.cardImage;
    if (!img) return '/static/images/cards/fallback-card.jpg';
    if (img.startsWith('http')) return img;
    if (img.startsWith('/static/images/cards/')) return img;
    if (img.startsWith('/static/images/')) return img;
    if (img.startsWith('/')) return `/static/images/cards${img}`;
    return `/static/images/cards/${img}`;
  };

  const getCardName = (index) => {
    if (readingData?.cardNames && readingData.cardNames[index]) {
      return readingData.cardNames[index];
    }
    if (readingData?.cards && readingData.cards[index]) {
      const c = readingData.cards[index];
      return typeof c === 'string'
        ? c.split('/').pop().replace('.jpg', '').replace(/_/g, ' ')
        : c.name;
    }
    return `Arcana ${index + 1}`;
  };

  const cardsList = readingData?.cards || [];
  const moonPhase = readingData?.moonPhase || readingData?.cosmicContext?.moonPhase;
  const season = readingData?.season || readingData?.cosmicContext?.season;
  const dayEnergy = readingData?.dayEnergy || readingData?.cosmicContext?.dayEnergy;

  // Separate synthesis from individual cards
  const cardSections = sections.filter((s) => s.position !== 'integration');
  const synthesisSection = sections.find((s) => s.position === 'integration');

  return (
    <div className="three-card-outer">
      <div className="three-card-glassy-container">
        {/* Stepper Indicator */}
        <div className="step-indicator">
          <div className="step">1</div>
          <div className="step">2</div>
          <div className="step active">3</div>
        </div>

        {/* Header */}
        <div className="three-card-header">
          <h1 className="three-card-title">
            {isKa ? 'წმინდა არკანა გაცხადდა' : 'Sacred Arcana Revealed'}
          </h1>
          <p className="three-card-subtitle">
            <span>
              {isKa ? 'გაცხადებულია: ' : 'Illuminated for '}
              <strong>{name || (isKa ? 'მაძიებლისთვის' : 'Seeker')}</strong>
            </span>
            {zodiacSign && <span className="subtitle-badge">✦ {zodiacSign}</span>}
            {focusArea && <span className="subtitle-badge">🧭 {focusArea}</span>}
          </p>
        </div>

        {/* Cosmic Timing Info Bar */}
        {(moonPhase || season || dayEnergy) && (
          <div className="cosmic-info-bar">
            {moonPhase && (
              <div className="cosmic-info-item">
                <span className="cosmic-icon">🌕</span>
                <span>{moonPhase}</span>
              </div>
            )}
            {moonPhase && season && <span className="cosmic-info-sep">•</span>}
            {season && (
              <div className="cosmic-info-item">
                <span className="cosmic-icon">🌿</span>
                <span>{season}</span>
              </div>
            )}
            {(moonPhase || season) && dayEnergy && <span className="cosmic-info-sep">•</span>}
            {dayEnergy && (
              <div className="cosmic-info-item">
                <span className="cosmic-icon">⚡</span>
                <span>{dayEnergy}</span>
              </div>
            )}
          </div>
        )}

        {/* ==========================================================
            FULLY OPEN CONTINUOUS READING FLOW (NO TABS / NO ACCORDIONS)
            Each card's sacred artwork is displayed side-by-side with its
            full open interpretation text!
            ========================================================== */}
        <div className="open-reading-flow">
          {cardSections.map((section, idx) => {
            const card = cardsList[idx];
            const cardColor = positionColors[idx] || '#a59ad1';
            const cardName = getCardName(idx);

            return (
              <section
                key={idx}
                className="open-card-story"
                style={{
                  borderLeftColor: cardColor,
                  boxShadow: `0 10px 32px rgba(0, 0, 0, 0.4), 0 0 24px ${cardColor}15`,
                }}
              >
                {/* Left: Sacred Card Pedestal */}
                <div className="open-card-pedestal">
                  <div
                    className="open-card-position-pill"
                    style={{
                      color: cardColor,
                      borderColor: `${cardColor}66`,
                      background: `${cardColor}18`,
                    }}
                  >
                    <span>{positionIcons[idx]}</span>
                    <span>{positions[idx]}</span>
                  </div>

                  {card && (
                    <div
                      className="open-card-art-frame"
                      style={{
                        borderColor: `${cardColor}88`,
                        boxShadow: `0 10px 28px rgba(0,0,0,0.6), 0 0 22px ${cardColor}44`,
                      }}
                      onClick={() => setSelectedCard({ card, idx, name: cardName, color: cardColor })}
                      role="button"
                      tabIndex={0}
                      aria-label={`View enlarged ${cardName}`}
                    >
                      <img
                        src={getCardImgUrl(card)}
                        alt={cardName}
                        className="open-card-img"
                        loading="eager"
                      />
                      <span className="open-card-zoom-badge">{isKa ? '🔍 გადიდება' : '🔍 Zoom'}</span>
                    </div>
                  )}

                  <h3 className="open-card-name" style={{ color: cardColor }}>
                    {cardName}
                  </h3>
                </div>

                {/* Right: Full Open Unfolded Reading Text */}
                <div className="open-card-text-container">
                  <div className="open-card-header">
                    <div
                      className="open-card-icon-bubble"
                      style={{
                        color: cardColor,
                        borderColor: `${cardColor}55`,
                        background: `${cardColor}18`,
                      }}
                    >
                      {section.icon || positionIcons[idx]}
                    </div>
                    <div>
                      <span className="open-card-subhead" style={{ color: cardColor }}>
                        {positions[idx]} {isKa ? 'სფერო' : 'Realm'} • {cardName}
                      </span>
                      <h2 className="open-card-title">{section.title}</h2>
                    </div>
                  </div>

                  <div className="open-card-paragraphs">
                    {renderFormattedParagraphs(section.content, "open-reading-paragraph")}
                  </div>
                </div>
              </section>
            );
          })}

          {/* Synthesis & Divine Integration (Full Width Open Card) */}
          {synthesisSection && (
            <section
              className="open-synthesis-card"
              style={{
                borderColor: 'rgba(255, 215, 0, 0.4)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 35px rgba(255, 215, 0, 0.15)',
              }}
            >
              <div className="synthesis-header">
                <div className="synthesis-icon-bubble">🔮</div>
                <div>
                  <span className="synthesis-eyebrow">{isKa ? 'კოსმოსური ქსოვა' : 'Cosmic Weaving'}</span>
                  <h2 className="synthesis-title">{synthesisSection.title}</h2>
                </div>
              </div>

              <div className="synthesis-paragraphs">
                {renderFormattedParagraphs(synthesisSection.content, "open-reading-paragraph synthesis-text")}
              </div>
            </section>
          )}
        </div>

        {/* Bottom Actions Bar */}
        {onReturn && (
          <div className="interpretation-actions">
            <button
              onClick={onReturn}
              className="restart-reading-btn"
              type="button"
            >
              <span>🔄</span>
              <span>{isKa ? 'ახალი გაშლა' : 'Draw Another Spread'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Floating Cosmic Chat Button (Always Accessible While Reading) */}
      {onOpenChat && (
        <button
          onClick={onOpenChat}
          className="floating-universe-chat-btn"
          type="button"
          aria-label={isKa ? 'ესაუბრეთ სამყაროს' : 'Converse with the Universe'}
          title={isKa ? 'ესაუბრეთ სამყაროს' : 'Converse with the Universe'}
        >
          <span className="floating-chat-pulse-ring" />
          <span className="floating-chat-icon">💬</span>
          <span className="floating-chat-label floating-chat-full-text">
            {isKa ? 'ესაუბრეთ სამყაროს' : 'Converse with the Universe'}
          </span>
          <span className="floating-chat-label floating-chat-short-text">
            {isKa ? 'კოსმოსური ჩატი' : 'Cosmic Chat'}
          </span>
          <span className="floating-chat-sparkle">✨</span>
        </button>
      )}

      {/* Fullscreen Card Zoom Overlay */}
      {selectedCard && (
        <div className="card-overlay" onClick={() => setSelectedCard(null)}>
          <div className="card-overlay-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="overlay-close"
              onClick={() => setSelectedCard(null)}
              type="button"
              aria-label="Close card view"
            >
              ✕
            </button>

            <div
              className="overlay-position"
              style={{
                color: selectedCard.color,
                borderColor: selectedCard.color,
                boxShadow: `0 0 20px ${selectedCard.color}44`,
              }}
            >
              <span>{positionIcons[selectedCard.idx]}</span>{' '}
              <span>{positions[selectedCard.idx]}</span>
            </div>

            <img
              src={getCardImgUrl(selectedCard.card)}
              alt={selectedCard.name}
              className="overlay-image"
              style={{
                borderColor: selectedCard.color,
                boxShadow: `0 20px 60px rgba(0,0,0,0.9), 0 0 50px ${selectedCard.color}55`,
              }}
            />

            <div className="overlay-name" style={{ color: selectedCard.color }}>
              {selectedCard.name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}