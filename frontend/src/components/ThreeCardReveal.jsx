import { useState, useEffect } from 'react';
import { getPersonalMessage } from '../utils/zodiac';

export default function ThreeCardReveal({ name, readingData, onComplete, zodiacSign, language = 'en' }) {
  const [isVisible] = useState(true);
  const [showInstruction] = useState(true);
  const [showCards] = useState(true);
  const [showZodiacMessage] = useState(true);
  const [flippedCards, setFlippedCards] = useState([false, false, false]);
  const [revealingCards, setRevealingCards] = useState([false, false, false]);
  const [canClick, setCanClick] = useState([true, true, true]);

  const zodiacMessage = zodiacSign ? getPersonalMessage(zodiacSign) : '';

  const isKa = language === 'ka';
  const positions = isKa ? ['წარსული', 'აწმყო', 'მომავალი'] : ['Past', 'Present', 'Future'];
  const positionIcons = ['🌙', '⭐', '✨'];

  useEffect(() => {
    if (typeof window !== 'undefined' && window.zoomBackground) {
      window.zoomBackground(1.3, 2000);
    }
  }, []);

  // Proceed to interpretation when all 3 cards are flipped
  useEffect(() => {
    if (flippedCards.every((f) => f)) {
      const timer = setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [flippedCards, onComplete]);

  const handleCardClick = (index) => {
    if (!canClick[index] || revealingCards[index] || flippedCards[index]) return;

    setCanClick((prev) => {
      const updated = [...prev];
      updated[index] = false;
      return updated;
    });

    setRevealingCards((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });

    setTimeout(() => {
      setFlippedCards((prev) => {
        const updated = [...prev];
        updated[index] = true;
        return updated;
      });
    }, 250);

    setTimeout(() => {
      setRevealingCards((prev) => {
        const updated = [...prev];
        updated[index] = false;
        return updated;
      });
    }, 1200);
  };

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
      return typeof c === 'string' ? c.replace('.jpg', '').replace('_', ' ') : c.name;
    }
    return `Card ${index + 1}`;
  };

  const cardsList = readingData?.cards || ['fool.jpg', 'magician.jpg', 'high_priestess.jpg'];

  return (
    <div className={`trial-step2-reveal ${isVisible ? 'visible' : ''}`}>
      <div className="trial-step2-reveal-inner">
        {/* Step Indicator */}
        <div className="step-indicator">
          <div className="step">1</div>
          <div className="step active">2</div>
          <div className="step">3</div>
        </div>

        <div className="trial-step2-content">
          <h1 className="trial-step2-title">
            {isKa ? `მოგესალმებით, ${name || 'მაძიებელო'}` : `Greetings, ${name || 'Seeker'}`}
          </h1>

          {showZodiacMessage && (
            <div className="trial-step2-zodiac-message fade-in">
              <p>{zodiacMessage} {zodiacSign ? `— ${zodiacSign}` : ''}</p>
            </div>
          )}

          {showInstruction && (
            <p className="trial-step2-instruction">
              {flippedCards.every((f) => f)
                ? (isKa ? 'ყველა კარტი გახსნილია! მიმდინარეობს კოსმოსური ინტერპრეტაციის გაცხადება...' : 'All cards revealed! Delving into cosmic interpretation...')
                : (isKa ? 'სამი წმინდა კარტი ეთერიდან. შეეხეთ თითოეულ კარტს თქვენი არკანის გასახსნელად:' : 'Three cards chosen from the ether. Tap each card to reveal your arcana:')}
            </p>
          )}

          {showCards && (
            <div className="three-card-reveal-section">
              {cardsList.map((card, index) => (
                <div key={index} className="three-card-column">
                  <div className="card-position-label">
                    <span className="position-icon">{positionIcons[index]}</span>{' '}
                    {positions[index]}
                  </div>

                  <div
                    className={`trial-step2-card-wrapper ${
                      revealingCards[index] ? 'revealing' : ''
                    } ${flippedCards[index] ? 'flipped' : ''}`}
                    onClick={() => handleCardClick(index)}
                    role="button"
                    tabIndex={0}
                    aria-label={isKa ? `გახსენით ${positions[index]}ს კარტი` : `Reveal ${positions[index]} card`}
                  >
                    <div className="trial-step2-card">
                      {/* Back face */}
                      <div className="trial-step2-card-face trial-step2-card-back">
                        <img src="/static/images/card-back.jpg" alt="Card Back" />
                      </div>

                      {/* Front face */}
                      <div className="trial-step2-card-face trial-step2-card-front">
                        <img src={getCardImgUrl(card)} alt={getCardName(index)} />
                      </div>
                    </div>

                    {revealingCards[index] && (
                      <div className="trial-step2-particles">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div
                            key={i}
                            className="trial-step2-particle"
                            style={{
                              '--delay': `${i * 0.05}s`,
                              '--angle': `${(360 / 16) * i}deg`,
                            }}
                          />
                        ))}
                      </div>
                    )}

                    <div className="trial-step2-cosmic-glow" />
                  </div>

                  {flippedCards[index] && (
                    <div className="card-name-label fade-in">{getCardName(index)}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}