import { useState } from 'react';
import { renderFormattedParagraphs } from '../utils/textFormatter';

const ChatOracleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const ChatStarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

/* --- Handcrafted Celestial SVG Icons (Zero Emojis) --- */
const PastGlyph = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="url(#interpPastGrad)" stroke="#ffd700" strokeWidth="1.2" />
    <defs>
      <linearGradient id="interpPastGrad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#cdc0f2" />
        <stop offset="1" stopColor="#6b4e71" />
      </linearGradient>
    </defs>
  </svg>
);

const PresentGlyph = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4.5" fill="url(#interpPresGrad)" stroke="#ffd700" strokeWidth="1.2" />
    <line x1="12" y1="2" x2="12" y2="4.5" stroke="#f4a261" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="12" y1="19.5" x2="12" y2="22" stroke="#f4a261" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="4.93" y1="4.93" x2="6.7" y2="6.7" stroke="#f4a261" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="17.3" y1="17.3" x2="19.07" y2="19.07" stroke="#f4a261" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="2" y1="12" x2="4.5" y2="12" stroke="#f4a261" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="19.5" y1="12" x2="22" y2="12" stroke="#f4a261" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="4.93" y1="19.07" x2="6.7" y2="17.3" stroke="#f4a261" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="17.3" y1="6.7" x2="19.07" y2="4.93" stroke="#f4a261" strokeWidth="1.8" strokeLinecap="round" />
    <defs>
      <linearGradient id="interpPresGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffd700" />
        <stop offset="1" stopColor="#f4a261" />
      </linearGradient>
    </defs>
  </svg>
);

const FutureGlyph = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2L14.4 8.6L21 11L14.4 13.4L12 20L9.6 13.4L3 11L9.6 8.6L12 2Z" fill="url(#interpFutGrad)" stroke="#ffd700" strokeWidth="1.2" strokeLinejoin="round" />
    <circle cx="12" cy="11" r="1.5" fill="#ffffff" />
    <defs>
      <linearGradient id="interpFutGrad" x1="2" y1="1" x2="22" y2="20" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffd700" />
        <stop offset="0.5" stopColor="#f4a261" />
        <stop offset="1" stopColor="#a59ad1" />
      </linearGradient>
    </defs>
  </svg>
);

const CompassIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" />
  </svg>
);

const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#ffd700" stroke="#ffd700" strokeWidth="1" />
  </svg>
);

const SeasonLeafIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" fill="rgba(52, 211, 153, 0.25)" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

const EnergyGlyph = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f4a261" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="rgba(244, 162, 97, 0.4)" />
  </svg>
);

const ZoomIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="11" y1="8" x2="11" y2="14" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);

const CrystalOrbIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="11" r="8" fill="url(#orbGrad)" stroke="#ffd700" strokeWidth="1.2" />
    <path d="M7 21h10M9 19h6" stroke="#a59ad1" strokeWidth="2" />
    <path d="M9 8c1.5-2 4.5-2 6 0" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="1.2" strokeLinecap="round" />
    <defs>
      <radialGradient id="orbGrad" cx="35%" cy="30%" r="70%">
        <stop stopColor="#ffd700" stopOpacity="0.8" />
        <stop offset="0.6" stopColor="#a59ad1" stopOpacity="0.4" />
        <stop offset="1" stopColor="#1a1033" stopOpacity="0.9" />
      </radialGradient>
    </defs>
  </svg>
);

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M23 4v6h-6M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

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
  const positionIcons = [<PastGlyph key="p" />, <PresentGlyph key="pr" />, <FutureGlyph key="f" />];
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
          icon: <PastGlyph />,
          content: isKa
            ? 'თქვენი სულის გზის განმსაზღვრელი წმინდა საფუძვლები და გამოცდილებები.'
            : 'The sacred foundations and experiences that shaped the path of your soul.',
          position: 'past',
          color: positionColors[0],
        },
        {
          title: isKa ? 'აწმყო: მიმდინარე ენერგეტიკული ნაკადები' : 'The Present: Active Energetic Influences',
          icon: <PresentGlyph />,
          content: isKa
            ? 'ზეციური ძალები და შინაგანი სიბრძნე, რომელიც ამჟამად თქვენს განკარგულებაშია.'
            : 'The celestial forces and inner wisdom available to you in the current moment.',
          position: 'present',
          color: positionColors[1],
        },
        {
          title: isKa ? 'მომავალი: ბედისწერის ჰორიზონტი და პოტენციალი' : 'The Future: Unfolding Destiny & Potential',
          icon: <FutureGlyph />,
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
        icon: <PastGlyph />,
        content: cleanSectionText(pastMatch[1]),
        position: 'past',
        color: positionColors[0],
      });
    }
    if (presMatch && cleanSectionText(presMatch[1])) {
      sections.push({
        title: isKa ? 'აწმყო: მიმდინარე ენერგიები' : 'The Present: Currents of Now',
        icon: <PresentGlyph />,
        content: cleanSectionText(presMatch[1]),
        position: 'present',
        color: positionColors[1],
      });
    }
    if (futMatch && cleanSectionText(futMatch[1])) {
      sections.push({
        title: isKa ? 'მომავალი: მომავლის ჰორიზონტი' : 'The Future: Horizon of Becoming',
        icon: <FutureGlyph />,
        content: cleanSectionText(futMatch[1]),
        position: 'future',
        color: positionColors[2],
      });
    }
    if (intMatch && cleanSectionText(intMatch[1])) {
      sections.push({
        title: isKa ? 'კოსმოსური სინთეზი და ინტეგრაცია' : 'Cosmic Synthesis & Spiritual Integration',
        icon: <CrystalOrbIcon />,
        content: cleanSectionText(intMatch[1]),
        position: 'integration',
        color: '#ffd700',
      });
    }

    // Fallback if no specific section markers matched
    if (sections.length === 0) {
      sections.push({
        title: isKa ? 'ღვთაებრივი არკანას გაშლა' : 'Divine Arcana Reading',
        icon: <CrystalOrbIcon />,
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
            {focusArea && (
              <span className="subtitle-badge">
                <CompassIcon /> {focusArea}
              </span>
            )}
          </p>
        </div>

        {/* Cosmic Timing Info Bar */}
        {(moonPhase || season || dayEnergy) && (
          <div className="cosmic-info-bar">
            {moonPhase && (
              <div className="cosmic-info-item">
                <span className="cosmic-icon"><MoonIcon /></span>
                <span>{moonPhase}</span>
              </div>
            )}
            {moonPhase && season && <span className="cosmic-info-sep">•</span>}
            {season && (
              <div className="cosmic-info-item">
                <span className="cosmic-icon"><SeasonLeafIcon /></span>
                <span>{season}</span>
              </div>
            )}
            {(moonPhase || season) && dayEnergy && <span className="cosmic-info-sep">•</span>}
            {dayEnergy && (
              <div className="cosmic-info-item">
                <span className="cosmic-icon"><EnergyGlyph /></span>
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
                      <span className="open-card-zoom-badge">
                        <ZoomIcon /> {isKa ? 'გადიდება' : 'Zoom'}
                      </span>
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
                <div className="synthesis-icon-bubble">
                  <CrystalOrbIcon />
                </div>
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
              <span><RefreshIcon /></span>
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
          <span className="floating-chat-icon"><ChatOracleIcon /></span>
          <span className="floating-chat-label floating-chat-full-text">
            {isKa ? 'ესაუბრეთ სამყაროს' : 'Converse with the Universe'}
          </span>
          <span className="floating-chat-label floating-chat-short-text">
            {isKa ? 'კოსმოსური ჩატი' : 'Cosmic Chat'}
          </span>
          <span className="floating-chat-sparkle"><ChatStarIcon /></span>
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