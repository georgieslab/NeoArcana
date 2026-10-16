import { useState, useEffect, useRef } from 'react';
import soundManager from '../services/sound';

/* --- Handcrafted Celestial Vector Glyphs (Zero Emojis) --- */
const AwakenForcesGlyph = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9.5" stroke="rgba(244, 162, 97, 0.45)" strokeWidth="1.2" strokeDasharray="2 2" />
    <path
      d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
      fill="url(#loaderForceGrad)"
      stroke="#ffd700"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="1.5" fill="#ffffff" />
    <defs>
      <linearGradient id="loaderForceGrad" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffd700" />
        <stop offset="0.6" stopColor="#f4a261" />
        <stop offset="1" stopColor="#e76f51" />
      </linearGradient>
    </defs>
  </svg>
);

const StarGatePortalGlyph = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="rgba(100, 223, 223, 0.4)" strokeWidth="1.2" />
    <circle cx="12" cy="12" r="6.5" stroke="rgba(165, 154, 209, 0.6)" strokeWidth="1.2" strokeDasharray="3 2" />
    <path
      d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
      fill="url(#loaderGateGrad)"
      stroke="#64dfdf"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="2.2" fill="#ffffff" />
    <defs>
      <linearGradient id="loaderGateGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#64dfdf" />
        <stop offset="0.5" stopColor="#a78bfa" />
        <stop offset="1" stopColor="#38bdf8" />
      </linearGradient>
    </defs>
  </svg>
);

const CelestialEnergiesGlyph = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="rgba(244, 162, 97, 0.35)" strokeWidth="1" strokeDasharray="2 2" />
    <path
      d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"
      fill="url(#loaderMoonGrad)"
      stroke="#ffd700"
      strokeWidth="1.2"
    />
    <circle cx="18" cy="6" r="2" fill="#ffd700" />
    <path d="M18 2v2M18 8v2M14 6h2M20 6h2" stroke="#f4a261" strokeWidth="1.2" strokeLinecap="round" />
    <defs>
      <linearGradient id="loaderMoonGrad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#cdc0f2" />
        <stop offset="0.6" stopColor="#a59ad1" />
        <stop offset="1" stopColor="#6b4e71" />
      </linearGradient>
    </defs>
  </svg>
);

const SacredJourneyGlyph = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="rgba(255, 215, 0, 0.3)" strokeWidth="1.2" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="url(#loaderCompassGrad)" stroke="#ffd700" strokeWidth="1" />
    <circle cx="12" cy="12" r="2" fill="#ffffff" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="#f4a261" strokeWidth="1.4" strokeLinecap="round" />
    <defs>
      <linearGradient id="loaderCompassGrad" x1="7" y1="7" x2="17" y2="17" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffd700" />
        <stop offset="0.5" stopColor="#f4a261" />
        <stop offset="1" stopColor="#a59ad1" />
      </linearGradient>
    </defs>
  </svg>
);

const LoaderCenterStarGlyph = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 2L14.2 8.8L21 11L14.2 13.2L12 20L9.8 13.2L3 11L9.8 8.8L12 2Z"
      fill="url(#loaderCenterStarGrad)"
      stroke="#ffd700"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="11" r="1.8" fill="#ffffff" />
    <defs>
      <linearGradient id="loaderCenterStarGrad" x1="3" y1="2" x2="21" y2="20" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffd700" />
        <stop offset="0.5" stopColor="#f4a261" />
        <stop offset="1" stopColor="#a59ad1" />
      </linearGradient>
    </defs>
  </svg>
);

const COSMIC_PHRASES = [
  {
    id: 'awakening',
    title: 'Awakening Cosmic Forces',
    subtitle: 'Calibrating 528Hz Solfeggio Vibration',
    glyph: <AwakenForcesGlyph />,
  },
  {
    id: 'stargate',
    title: 'Opening Star Gates',
    subtitle: 'Aligning Astral Portals & Etheric Meridians',
    glyph: <StarGatePortalGlyph />,
  },
  {
    id: 'energies',
    title: 'Calibrating Celestial Energies',
    subtitle: 'Harmonizing Planetary Tides & Sacred Arcana',
    glyph: <CelestialEnergiesGlyph />,
  },
  {
    id: 'journey',
    title: 'Preparing Your Sacred Journey',
    subtitle: 'Unfolding the Sacred Geometry of Destiny',
    glyph: <SacredJourneyGlyph />,
  },
];

export default function CosmicLoader({
  duration = 8000, // 8 seconds
  onLoadingComplete,
}) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const mountedRef = useRef(true);
  const lastPhaseRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;
    lastPhaseRef.current = 0;
    const startTime = Date.now();

    // High-resolution progress update
    const progressInterval = setInterval(() => {
      if (!mountedRef.current) return;
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      // Phase transitions
      const phaseCount = COSMIC_PHRASES.length;
      const currentPhase = Math.min(
        phaseCount - 1,
        Math.floor((elapsed / (duration * 0.9)) * phaseCount)
      );

      // Play subtle chime on phase advance
      if (currentPhase !== lastPhaseRef.current) {
        lastPhaseRef.current = currentPhase;
        if (currentPhase === phaseCount - 1) {
          soundManager.playCelestialChime();
        } else {
          soundManager.playStarSparkle();
        }
      }

      setPhaseIndex(currentPhase);
    }, 40);

    // Trigger smooth fade-out 600ms before duration ends
    const fadeTimer = setTimeout(() => {
      if (mountedRef.current) {
        setIsFading(true);
      }
    }, Math.max(1000, duration - 600));

    // Complete loading and unmount
    const completeTimer = setTimeout(() => {
      if (mountedRef.current && onLoadingComplete) {
        onLoadingComplete();
      }
    }, duration);

    return () => {
      mountedRef.current = false;
      clearInterval(progressInterval);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onLoadingComplete]);

  const currentPhaseData = COSMIC_PHRASES[phaseIndex] || COSMIC_PHRASES[0];

  return (
    <div
      className={`cosmic-loader-container ${isFading ? 'fade-out' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading sacred cosmos"
    >
      {/* 3D Astrolabe Gyroscope Core */}
      <div className="cosmic-loader-arena">
        <div className="loader-astrolabe-ring loader-ring-outer" />
        <div className="loader-astrolabe-ring loader-ring-mid" />
        <div className="loader-astrolabe-ring loader-ring-inner" />
        <div className="loader-core-gem">
          <span className="loader-core-glow" />
          <LoaderCenterStarGlyph />
        </div>
      </div>

      {/* Phase Badge & Typography */}
      <div className="loader-phase-card">
        <div className="loader-icon-gem" key={phaseIndex}>
          {currentPhaseData.glyph}
        </div>
        <h2 className="loader-phase-title" key={`title-${phaseIndex}`}>
          {currentPhaseData.title}
        </h2>
        <p className="loader-phase-subtitle" key={`sub-${phaseIndex}`}>
          {currentPhaseData.subtitle}
        </p>
      </div>

      {/* Enhanced Progress Bar & Telemetry */}
      <div className="loader-progress-wrap">
        <div className="loader-progress-track">
          <div
            className="loader-progress-fill"
            style={{ width: `${progress}%` }}
          >
            <span className="loader-progress-head" />
          </div>
        </div>
        <div className="loader-telemetry-row">
          <span className="loader-telemetry-caption">
            <span className="loader-telemetry-spark">✦</span>
            <span>Aligning Cosmos</span>
          </span>
          <span className="loader-telemetry-pct">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
