import { useState, useEffect, useRef } from 'react';

/**
 * CosmicLoader Component
 * Runs on initial app boot for 8 seconds while textures, shaders,
 * and background geometry are loaded and stabilized in the background.
 */
const COSMIC_PHRASES = [
  { text: 'Awakening Cosmic Forces', icon: '⚡' },
  { text: 'Opening Star Gates', icon: '🌌' },
  { text: 'Calibrating Celestial Energies', icon: '✨' },
  { text: 'Preparing Your Sacred Journey', icon: '🔮' },
];

export default function CosmicLoader({
  duration = 8000, // 8 seconds
  onLoadingComplete,
}) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
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

  return (
    <div
      className={`cosmic-loader-container ${isFading ? 'fade-out' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at center, #09001f 0%, #02000c 80%)',
        backdropFilter: 'blur(16px)',
        zIndex: 99999,
        gap: '1.75rem',
        opacity: isFading ? 0 : 1,
        transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isFading ? 'none' : 'auto',
      }}
    >
      {/* Mystical Gyroscope Cosmic Orb */}
      <div
        className="cosmic-loader-orb-box"
        style={{
          position: 'relative',
          width: '110px',
          height: '110px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="cosmic-orb" />
        
        {/* Pulsing Core Glow */}
        <div
          style={{
            position: 'absolute',
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(205, 192, 242, 0.9) 0%, rgba(165, 154, 209, 0.4) 60%, transparent 100%)',
            boxShadow: '0 0 25px rgba(165, 154, 209, 0.7)',
            filter: 'blur(3px)',
            pointerEvents: 'none',
          }}
        />

        {/* Ambient Orbiting Particles */}
        <div
          style={{
            position: 'absolute',
            width: '95px',
            height: '95px',
            borderRadius: '50%',
            border: '1.5px solid rgba(244, 162, 97, 0.45)',
            borderTopColor: '#f4a261',
            borderBottomColor: 'transparent',
            animation: 'spin 3s linear infinite',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            border: '1.5px dashed rgba(165, 154, 209, 0.35)',
            animation: 'spin 6s linear infinite reverse',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Dynamic Astral Phase Messages */}
      <div
        className="phase-message"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.6rem',
          minHeight: '80px',
          textAlign: 'center',
        }}
      >
        <span
          className="phase-icon"
          style={{
            fontSize: '2.5rem',
            filter: 'drop-shadow(0 0 12px rgba(244, 162, 97, 0.6))',
            transition: 'all 0.3s ease',
          }}
        >
          {COSMIC_PHRASES[phaseIndex].icon}
        </span>
        <span
          className="phase-text"
          style={{
            fontSize: '1.15rem',
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 600,
            letterSpacing: '0.08em',
            background: 'linear-gradient(135deg, #ffffff 0%, #cdc0f2 50%, #f4a261 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 20px rgba(165, 154, 209, 0.3)',
          }}
        >
          {COSMIC_PHRASES[phaseIndex].text}
        </span>
      </div>

      {/* Timed Progress Bar */}
      <div
        className="loading-progress"
        style={{
          width: '240px',
          height: '4px',
          background: 'rgba(165, 154, 209, 0.15)',
          borderRadius: '4px',
          overflow: 'hidden',
          boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #a59ad1, #f4a261, #e0b0ff)',
            boxShadow: '0 0 12px rgba(165, 154, 209, 0.8)',
            transition: 'width 0.05s linear',
            borderRadius: '4px',
          }}
        />
      </div>

      {/* Subtitle Percentage */}
      <div
        style={{
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          color: 'rgba(205, 192, 242, 0.6)',
          textTransform: 'uppercase',
          fontFamily: "'Orbitron', sans-serif",
          fontWeight: 500,
        }}
      >
        Aligning Cosmos {progress}%
      </div>
    </div>
  );
}
