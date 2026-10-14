import { useState, useEffect, useRef, useMemo } from 'react';
import soundManager from '../services/sound';

/* --- Handcrafted Celestial Vector Glyphs --- */
const HarmonicsGlyph = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12h2M6 8v8M10 4v16M14 7v10M18 10v4M22 12h-2" stroke="#f4a261" />
  </svg>
);

const MoonZodiacGlyph = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" stroke="#a59ad1" />
    <path d="M19 3v4M21 5h-4" stroke="#ffd700" strokeWidth="1.8" />
  </svg>
);

const ShuffleCardsGlyph = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="6" width="11" height="15" rx="2" stroke="#a59ad1" />
    <rect x="7" y="3" width="11" height="15" rx="2" stroke="#f4a261" />
    <rect x="11" y="7" width="11" height="15" rx="2" stroke="#ffd700" />
  </svg>
);

const SacredStarGlyph = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="url(#starGrad)" />
    <defs>
      <linearGradient id="starGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffd700" />
        <stop offset="0.5" stopColor="#f4a261" />
        <stop offset="1" stopColor="#a59ad1" />
      </linearGradient>
    </defs>
  </svg>
);

const SparkleTiny = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

export default function CelestialAttunementPortal({
  isVisible,
  userData,
  language = 'en',
}) {
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(12);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const soundPlayedRef = useRef(new Set());
  const startTimeRef = useRef(null);

  const isKa = language === 'ka';
  const name = userData?.name || (isKa ? 'მაძიებელი' : 'Seeker');
  const zodiacSign = userData?.zodiacSign || (isKa ? 'კოსმიური' : 'Cosmic');
  const focusArea = userData?.focusArea || '';

  // Ritual Attunement Stages
  const stages = useMemo(() => {
    if (isKa) {
      return [
        {
          id: 0,
          title: 'ვიბრაციის ჰარმონიზაცია',
          desc: `თქვენი ენერგეტიკული ველის დაკალიბრება კოსმოსურ სიხშირეებთან...`,
          icon: <HarmonicsGlyph />,
        },
        {
          id: 1,
          title: 'ასტროლოგიური შეერთება',
          desc: `${zodiacSign} ნიშნის აურის დაკავშირება ციურ ტალღებთან...`,
          icon: <MoonZodiacGlyph />,
        },
        {
          id: 2,
          title: '78 წმინდა არკანას არჩევა',
          desc: 'ბედისწერის სამი კარტი კვეთს დროისა და სივრცის ზღვარს...',
          icon: <ShuffleCardsGlyph />,
        },
        {
          id: 3,
          title: 'კოსმოსური წინასწარმეტყველება',
          desc: 'არქეტიპული სიბრძნის გაცხადება თქვენს პირად გზაზე...',
          icon: <SacredStarGlyph />,
        },
      ];
    }
    return [
      {
        id: 0,
        title: 'Harmonizing Frequency',
        desc: `Calibrating your personal energetic vibration with the cosmos...`,
        icon: <HarmonicsGlyph />,
      },
      {
        id: 1,
        title: 'Astrological Alignment',
        desc: `Weaving your ${zodiacSign} aura into today's celestial tides...`,
        icon: <MoonZodiacGlyph />,
      },
      {
        id: 2,
        title: 'Drawing Sacred Arcana',
        desc: 'Three destiny cards are stepping forward through the astral ether...',
        icon: <ShuffleCardsGlyph />,
      },
      {
        id: 3,
        title: 'Synthesizing Revelation',
        desc: 'Translating ancient archetypes into personal prophecy...',
        icon: <SacredStarGlyph />,
      },
    ];
  }, [isKa, zodiacSign]);

  // Ancient Hermetic & Tarot Quotes
  const quotes = useMemo(() => {
    if (isKa) {
      return [
        '„რაც ზემოთაა, იგივეა ქვემოთ; რაც შიგნითაა, იგივეა გარეთ.“ — ჰერმეს ტრისმეგისტოსი',
        '„კარტები აცხადებენ იმას, რაც თქვენს სულს უკვე ახსოვს.“',
        '„წარსული, აწმყო და მომავალი ერთი უსასრულო სინათლის ანარეკლია.“',
        '„ენდეთ ნიშნებსა და სინქრონულობას თქვენს წმინდა გზაზე.“',
      ];
    }
    return [
      '"As above, so below; as within, so without." — The Emerald Tablet',
      '"The cards reveal what your soul already remembers."',
      '"Past, Present, and Future are reflections of the same sacred flame."',
      '"Trust the cosmic synchronicities unfolding before you."',
    ];
  }, [isKa]);

  // Stage progression & sound manager effects
  useEffect(() => {
    if (!isVisible) {
      setStageIndex(0);
      setProgress(12);
      soundPlayedRef.current.clear();
      startTimeRef.current = null;
      return;
    }

    startTimeRef.current = Date.now();

    const stageTimer = setInterval(() => {
      const elapsed = Date.now() - (startTimeRef.current || Date.now());

      let currentStage = 0;
      let targetProgress = 15;

      if (elapsed < 2000) {
        currentStage = 0;
        targetProgress = Math.min(32, 12 + (elapsed / 2000) * 20);
      } else if (elapsed < 4200) {
        currentStage = 1;
        targetProgress = Math.min(58, 32 + ((elapsed - 2000) / 2200) * 26);
      } else if (elapsed < 6800) {
        currentStage = 2;
        targetProgress = Math.min(84, 58 + ((elapsed - 4200) / 2600) * 26);
      } else {
        currentStage = 3;
        targetProgress = Math.min(97, 84 + ((elapsed - 6800) / 3000) * 13);
      }

      setStageIndex(currentStage);
      setProgress(Math.round(targetProgress));

      // Trigger SFX on stage entry
      if (currentStage === 1 && !soundPlayedRef.current.has(1)) {
        soundManager.playStarSparkle();
        soundPlayedRef.current.add(1);
      } else if (currentStage === 2 && !soundPlayedRef.current.has(2)) {
        soundManager.playCardFlip();
        soundPlayedRef.current.add(2);
      } else if (currentStage === 3 && !soundPlayedRef.current.has(3)) {
        soundManager.playCelestialChime();
        soundPlayedRef.current.add(3);
      }
    }, 100);

    // Rotate quotes every 3.2 seconds
    const quoteTimer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 3200);

    return () => {
      clearInterval(stageTimer);
      clearInterval(quoteTimer);
    };
  }, [isVisible, quotes.length]);

  if (!isVisible) return null;

  const currentStage = stages[stageIndex] || stages[0];

  return (
    <div
      className="celestial-portal-overlay"
      role="dialog"
      aria-modal="true"
      aria-live="polite"
    >
      <div className="celestial-portal-window">
        {/* Ambient Nebula Halo */}
        <div className="portal-ambient-halo" />

        {/* Top Attunement Telemetry Bar */}
        <div className="portal-telemetry-badge">
          <span className="telemetry-spark"><SparkleTiny /></span>
          <span className="telemetry-text">
            {isKa ? 'მიმდინარეობს არკანას გამოხმობა:' : 'Sacred Attunement in Progress:'}{' '}
            <strong>{name}</strong>
            {zodiacSign && <span className="telemetry-sub"> • {zodiacSign}</span>}
            {focusArea && <span className="telemetry-focus"> • {focusArea}</span>}
          </span>
        </div>

        {/* 3D Astrolabe & Orbiting Tarot Cards Core */}
        <div className="portal-astrolabe-arena">
          {/* Rotating Celestial Astrolabe Rings */}
          <div className="astrolabe-ring ring-outer" />
          <div className="astrolabe-ring ring-mid" />
          <div className="astrolabe-ring ring-inner" />

          {/* Central Pulsing 528Hz Solfeggio Sol Core */}
          <div className="portal-solfeggio-core">
            <span className="core-flare flare-1" />
            <span className="core-flare flare-2" />
            <div className="core-center-gem">
              {currentStage.icon}
            </div>
          </div>

          {/* 3 Mystical Floating Orbiting Cards (Past, Present, Future) */}
          <div className="portal-orbiting-cards">
            <div className="orbit-card card-past">
              <div className="card-inner">
                <span className="card-glyph">🌙</span>
                <span className="card-label">{isKa ? 'წარსული' : 'Past'}</span>
              </div>
            </div>

            <div className="orbit-card card-present">
              <div className="card-inner">
                <span className="card-glyph">⭐</span>
                <span className="card-label">{isKa ? 'აწმყო' : 'Present'}</span>
              </div>
            </div>

            <div className="orbit-card card-future">
              <div className="card-inner">
                <span className="card-glyph">✨</span>
                <span className="card-label">{isKa ? 'მომავალი' : 'Future'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stage Milestone Information */}
        <div className="portal-stage-info">
          <div className="stage-milestone-indicator">
            {stages.map((stg, i) => (
              <span
                key={stg.id}
                className={`milestone-dot ${i === stageIndex ? 'active' : ''} ${
                  i < stageIndex ? 'completed' : ''
                }`}
              />
            ))}
          </div>

          <h3 className="portal-stage-title">{currentStage.title}</h3>
          <p className="portal-stage-desc">{currentStage.desc}</p>
        </div>

        {/* Luminous Progress Ribbon */}
        <div className="portal-progress-wrap">
          <div className="portal-progress-track">
            <div
              className="portal-progress-fill"
              style={{ width: `${progress}%` }}
            >
              <span className="progress-starlight-head" />
            </div>
          </div>
          <div className="portal-progress-meta">
            <span className="progress-status-caption">
              {isKa ? 'ეთერული კავშირი გააქტიურებულია' : 'Etheric portal open'}
            </span>
            <span className="progress-percentage">{progress}%</span>
          </div>
        </div>

        {/* Cycling Ancient Wisdom Quotes */}
        <div className="portal-quote-container">
          <p key={quoteIndex} className="portal-quote-text">
            {quotes[quoteIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}
