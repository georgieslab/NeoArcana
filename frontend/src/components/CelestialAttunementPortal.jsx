import { useState, useEffect, useRef, useMemo } from 'react';
import soundManager from '../services/sound';

/* --- Handcrafted Celestial Vector Glyphs (Zero Emojis) --- */
const HarmonicsGlyph = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="rgba(165, 154, 209, 0.35)" strokeWidth="1.2" strokeDasharray="2 2" />
    <circle cx="12" cy="12" r="6" stroke="rgba(244, 162, 97, 0.5)" strokeWidth="1.2" />
    <path d="M2 12h3M7 8v8M12 4v16M17 7v10M19 10v4M22 12h-1" stroke="url(#harmonicGrad)" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="12" r="2" fill="#ffd700" />
    <defs>
      <linearGradient id="harmonicGrad" x1="2" y1="4" x2="22" y2="20" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffd700" />
        <stop offset="0.5" stopColor="#f4a261" />
        <stop offset="1" stopColor="#a59ad1" />
      </linearGradient>
    </defs>
  </svg>
);

const MoonZodiacGlyph = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="rgba(244, 162, 97, 0.35)" strokeWidth="1.2" />
    <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" fill="url(#moonZodiacGrad)" stroke="#ffd700" strokeWidth="1.2" />
    <circle cx="18" cy="6" r="1.5" fill="#ffffff" />
    <path d="M18 2v2M18 8v2M14 6h2M20 6h2" stroke="#f4a261" strokeWidth="1.2" strokeLinecap="round" />
    <defs>
      <linearGradient id="moonZodiacGrad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#cdc0f2" />
        <stop offset="1" stopColor="#6b4e71" />
      </linearGradient>
    </defs>
  </svg>
);

const ShuffleCardsGlyph = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="2" y="6" width="10" height="15" rx="2" transform="rotate(-12 7 13.5)" stroke="rgba(165, 154, 209, 0.7)" strokeWidth="1.4" fill="rgba(22, 14, 44, 0.6)" />
    <rect x="7" y="3.5" width="10" height="15" rx="2" stroke="rgba(244, 162, 97, 0.85)" strokeWidth="1.4" fill="rgba(28, 18, 54, 0.7)" />
    <rect x="12" y="6" width="10" height="15" rx="2" transform="rotate(12 17 13.5)" stroke="#ffd700" strokeWidth="1.4" fill="rgba(34, 20, 64, 0.8)" />
    <circle cx="12" cy="11" r="1.8" fill="#ffd700" />
    <path d="M12 8.5v5M9.5 11h5" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

const SacredStarGlyph = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="rgba(255, 215, 0, 0.3)" strokeWidth="1" strokeDasharray="3 3" />
    <path d="M12 1L14.7 8.3L22 9.5L16.5 14.7L18.2 22L12 18.2L5.8 22L7.5 14.7L2 9.5L9.3 8.3L12 1Z" fill="url(#portalStarGrad)" stroke="#ffd700" strokeWidth="1.2" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="2.5" fill="#ffffff" />
    <defs>
      <linearGradient id="portalStarGrad" x1="2" y1="1" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffd700" />
        <stop offset="0.45" stopColor="#f4a261" />
        <stop offset="1" stopColor="#a59ad1" />
      </linearGradient>
    </defs>
  </svg>
);

const PortalCompleteGlyph = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="rgba(100, 223, 223, 0.5)" strokeWidth="1.2" />
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="url(#portalCompleteGrad)" stroke="#64dfdf" strokeWidth="1.2" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="2.2" fill="#ffffff" />
    <defs>
      <linearGradient id="portalCompleteGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#64dfdf" />
        <stop offset="0.5" stopColor="#ffd700" />
        <stop offset="1" stopColor="#a78bfa" />
      </linearGradient>
    </defs>
  </svg>
);

const SparkleTiny = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

/* --- Orbiting Card Artwork & Filigree SVGs (Zero Emojis) --- */
const CardBackFiligree = () => (
  <svg viewBox="0 0 48 74" fill="none" className="card-filigree-bg" aria-hidden="true">
    <rect x="3" y="3" width="42" height="68" rx="5" stroke="rgba(255, 215, 0, 0.45)" strokeWidth="1" />
    <rect x="6" y="6" width="36" height="62" rx="3.5" stroke="rgba(165, 154, 209, 0.35)" strokeWidth="0.75" strokeDasharray="2 2" />
    <path d="M24 16L32 37L24 58L16 37Z" stroke="rgba(255, 215, 0, 0.35)" strokeWidth="1" />
    <circle cx="24" cy="37" r="4" stroke="rgba(244, 162, 97, 0.5)" strokeWidth="1" />
  </svg>
);

const PastCardGlyph = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="url(#pastMoonGrad)" stroke="rgba(255, 215, 0, 0.85)" strokeWidth="1.5" />
    <circle cx="8.5" cy="11.5" r="1.2" fill="#ffffff" />
    <defs>
      <linearGradient id="pastMoonGrad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#cdc0f2" />
        <stop offset="1" stopColor="#6b4e71" />
      </linearGradient>
    </defs>
  </svg>
);

const PresentCardGlyph = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="4.5" fill="url(#presSunGrad)" stroke="#ffd700" strokeWidth="1.5" />
    <line x1="12" y1="1.5" x2="12" y2="4" stroke="#f4a261" strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="20" x2="12" y2="22.5" stroke="#f4a261" strokeWidth="2" strokeLinecap="round" />
    <line x1="4.5" y1="4.5" x2="6.5" y2="6.5" stroke="#f4a261" strokeWidth="2" strokeLinecap="round" />
    <line x1="17.5" y1="17.5" x2="19.5" y2="19.5" stroke="#f4a261" strokeWidth="2" strokeLinecap="round" />
    <line x1="1.5" y1="12" x2="4" y2="12" stroke="#f4a261" strokeWidth="2" strokeLinecap="round" />
    <line x1="20" y1="12" x2="22.5" y2="12" stroke="#f4a261" strokeWidth="2" strokeLinecap="round" />
    <line x1="4.5" y1="19.5" x2="6.5" y2="17.5" stroke="#f4a261" strokeWidth="2" strokeLinecap="round" />
    <line x1="17.5" y1="6.5" x2="19.5" y2="4.5" stroke="#f4a261" strokeWidth="2" strokeLinecap="round" />
    <defs>
      <linearGradient id="presSunGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffd700" />
        <stop offset="1" stopColor="#f4a261" />
      </linearGradient>
    </defs>
  </svg>
);

const FutureCardGlyph = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 1.5L14.5 8.2L21.5 10.7L14.5 13.2L12 19.9L9.5 13.2L2.5 10.7L9.5 8.2L12 1.5Z" fill="url(#futStarGrad)" stroke="#ffd700" strokeWidth="1.2" strokeLinejoin="round" />
    <circle cx="12" cy="10.7" r="1.6" fill="#ffffff" />
    <defs>
      <linearGradient id="futStarGrad" x1="2" y1="1" x2="22" y2="20" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffd700" />
        <stop offset="0.5" stopColor="#f4a261" />
        <stop offset="1" stopColor="#a59ad1" />
      </linearGradient>
    </defs>
  </svg>
);

const MIN_RITUAL_DURATION = 7400; // 7.4 seconds minimum ritual duration

export default function CelestialAttunementPortal({
  isVisible,
  userData,
  language = 'en',
  isReady = true,
  onComplete,
}) {
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(12);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const soundPlayedRef = useRef(new Set());
  const startTimeRef = useRef(null);
  const completionTriggeredRef = useRef(false);
  const isReadyRef = useRef(isReady);
  isReadyRef.current = isReady;

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
          title: 'სიხშირის ჰარმონიზაცია',
          desc: 'თქვენი ენერგეტიკული ველის დაკალიბრება 528Hz სოლფეჯიოს წმინდა სიხშირესთან...',
          icon: <HarmonicsGlyph />,
        },
        {
          id: 1,
          title: 'ასტროლოგიური შეერთება',
          desc: `${zodiacSign ? `${zodiacSign} ნიშნის აურის` : 'თქვენი ციური ნიშნის'} დაკავშირება სამყაროს პლანეტარულ დინებებთან...`,
          icon: <MoonZodiacGlyph />,
        },
        {
          id: 2,
          title: 'წმინდა არკანას გამოხმობა',
          desc: 'ბედისწერის სამი კარტი კვეთს ასტრალურ ზღვარს თქვენს გზაზე...',
          icon: <ShuffleCardsGlyph />,
        },
        {
          id: 3,
          title: 'გაცხადების სინთეზი',
          desc: 'უძველესი ჰერმეტული არქეტიპების გარდაქმნა პირად წინასწარმეტყველებად...',
          icon: <SacredStarGlyph />,
        },
        {
          id: 4,
          title: 'კოსმოსური შეერთება დასრულდა',
          desc: 'ასტრალური პორტალი გაიხსნა. წმინდა არკანა მზადაა...',
          icon: <PortalCompleteGlyph />,
        },
      ];
    }
    return [
      {
        id: 0,
        title: 'Harmonizing Frequency',
        desc: 'Calibrating your personal energetic field with the sacred 528Hz Solfeggio frequency...',
        icon: <HarmonicsGlyph />,
      },
      {
        id: 1,
        title: 'Astrological Alignment',
        desc: `Weaving your ${zodiacSign} aura into today's celestial planetary currents...`,
        icon: <MoonZodiacGlyph />,
      },
      {
        id: 2,
        title: 'Drawing Sacred Arcana',
        desc: 'Three destiny cards are stepping forward across the astral threshold...',
        icon: <ShuffleCardsGlyph />,
      },
      {
        id: 3,
        title: 'Synthesizing Revelation',
        desc: 'Translating ancient Hermetic archetypes into your personal prophecy...',
        icon: <SacredStarGlyph />,
      },
      {
        id: 4,
        title: 'Cosmic Alignment Complete',
        desc: 'The astral portal opens. Revealing your sacred cards...',
        icon: <PortalCompleteGlyph />,
      },
    ];
  }, [isKa, zodiacSign]);

  // Ancient Hermetic & Tarot Quotes (Without cheesy emojis)
  const quotes = useMemo(() => {
    if (isKa) {
      return [
        '„რაც ზემოთაა, იგივეა ქვემოთ; რაც შიგნითაა, იგივეა გარეთ.“ — ჰერმეს ტრისმეგისტოსი',
        '„კარტები აცხადებენ იმას, რაც თქვენს სულს უკვე ახსოვს.“',
        '„წარსული, აწმყო და მომავალი ერთი უსასრულო სინათლის ანარეკლია.“',
        '„ენდეთ ნიშნებსა და სინქრონულობას თქვენს წმინდა გზაზე.“',
        '„ყოველი არკანა სარკეა, რომელშიც სამყარო საკუთარ თავს ჭვრეტს.“',
        '„კოსმოსური გონება პასუხობს მათ, ვინც გულწრფელად ეძებს.“',
      ];
    }
    return [
      '"As above, so below; as within, so without." — The Emerald Tablet',
      '"The cards reveal what your soul already remembers."',
      '"Past, Present, and Future are reflections of the same sacred flame."',
      '"Trust the cosmic synchronicities unfolding before you."',
      '"Every arcana is a mirror through which the cosmos contemplates itself."',
      '"The celestial mind responds to those who seek with reverence."',
    ];
  }, [isKa]);

  // Stage progression & sound manager effects
  useEffect(() => {
    if (!isVisible) {
      setStageIndex(0);
      setProgress(12);
      setIsFadingOut(false);
      setIsCompleted(false);
      soundPlayedRef.current.clear();
      startTimeRef.current = null;
      completionTriggeredRef.current = false;
      return;
    }

    startTimeRef.current = Date.now();

    const stageTimer = setInterval(() => {
      const elapsed = Date.now() - (startTimeRef.current || Date.now());

      let currentStage = 0;
      let targetProgress = 15;

      if (elapsed < 1900) {
        currentStage = 0;
        targetProgress = Math.min(35, 12 + (elapsed / 1900) * 23);
      } else if (elapsed < 3800) {
        currentStage = 1;
        targetProgress = Math.min(62, 35 + ((elapsed - 1900) / 1900) * 27);
      } else if (elapsed < 5700) {
        currentStage = 2;
        targetProgress = Math.min(86, 62 + ((elapsed - 3800) / 1900) * 24);
      } else if (elapsed < MIN_RITUAL_DURATION) {
        currentStage = 3;
        targetProgress = Math.min(97, 86 + ((elapsed - 5700) / 1700) * 11);
      } else {
        // Minimum time has elapsed
        if (isReadyRef.current) {
          currentStage = 4;
          targetProgress = 100;
        } else {
          // Keep hovering at 97-98% until data is ready
          currentStage = 3;
          targetProgress = 98;
        }
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
      } else if (currentStage === 4 && !soundPlayedRef.current.has(4)) {
        soundManager.playCelestialChime();
        soundPlayedRef.current.add(4);
        setIsCompleted(true);

        // Smooth exit sequence
        if (!completionTriggeredRef.current) {
          completionTriggeredRef.current = true;
          setTimeout(() => {
            setIsFadingOut(true);
          }, 450);
          setTimeout(() => {
            if (onComplete) {
              onComplete();
            }
          }, 1050);
        }
      }
    }, 60);

    // Rotate quotes every 3 seconds
    const quoteTimer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 3000);

    return () => {
      clearInterval(stageTimer);
      clearInterval(quoteTimer);
    };
  }, [isVisible, quotes.length, onComplete]);

  if (!isVisible && !isFadingOut) return null;

  const currentStage = stages[stageIndex] || stages[0];

  return (
    <div
      className={`celestial-portal-overlay ${isFadingOut ? 'fade-out' : ''} ${isCompleted ? 'portal-completed' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-live="polite"
      aria-label={isKa ? 'წმინდა კოსმოსური შეერთება' : 'Sacred Celestial Attunement'}
    >
      <div className={`celestial-portal-window stage-${stageIndex}-active`}>
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
        <div className={`portal-astrolabe-arena ${stageIndex >= 2 ? 'cards-attuned' : ''}`}>
          {/* Rotating Celestial Astrolabe Rings */}
          <div className="astrolabe-ring ring-outer" />
          <div className="astrolabe-ring ring-mid" />
          <div className="astrolabe-ring ring-inner" />

          {/* Central Pulsing 528Hz Solfeggio Sol Core */}
          <div className="portal-solfeggio-core">
            <span className="core-flare flare-1" />
            <span className="core-flare flare-2" />
            <div className="core-center-gem" key={stageIndex}>
              {currentStage.icon}
            </div>
          </div>

          {/* 3 Mystical Floating Orbiting Cards (Past, Present, Future) */}
          <div className="portal-orbiting-cards">
            <div className={`orbit-card card-past ${stageIndex >= 2 ? 'illuminated' : ''}`}>
              <CardBackFiligree />
              <div className="card-inner">
                <span className="card-glyph"><PastCardGlyph /></span>
                <span className="card-label">{isKa ? 'წარსული' : 'Past'}</span>
              </div>
            </div>

            <div className={`orbit-card card-present ${stageIndex >= 2 ? 'illuminated' : ''}`}>
              <CardBackFiligree />
              <div className="card-inner">
                <span className="card-glyph"><PresentCardGlyph /></span>
                <span className="card-label">{isKa ? 'აწმყო' : 'Present'}</span>
              </div>
            </div>

            <div className={`orbit-card card-future ${stageIndex >= 2 ? 'illuminated' : ''}`}>
              <CardBackFiligree />
              <div className="card-inner">
                <span className="card-glyph"><FutureCardGlyph /></span>
                <span className="card-label">{isKa ? 'მომავალი' : 'Future'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stage Milestone Information */}
        <div className="portal-stage-info">
          <div className="stage-milestone-indicator">
            {stages.slice(0, 4).map((stg, i) => (
              <span
                key={stg.id}
                className={`milestone-dot ${i === stageIndex ? 'active' : ''} ${
                  i < stageIndex || stageIndex === 4 ? 'completed' : ''
                }`}
              />
            ))}
          </div>

          <h3 className="portal-stage-title" key={`title-${stageIndex}`}>
            {currentStage.title}
          </h3>
          <p className="portal-stage-desc" key={`desc-${stageIndex}`}>
            {currentStage.desc}
          </p>
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
              {progress >= 100
                ? (isKa ? 'კოსმოსური პორტალი გახსნილია' : 'Cosmic portal unlocked')
                : (isKa ? 'ეთერული პორტალი გააქტიურებულია' : 'Etheric portal active')}
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
