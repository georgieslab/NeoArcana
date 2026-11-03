import { useState, useEffect, useMemo } from 'react';
import speechOracle from '../services/speech';

/* --- Handcrafted Vector Glyphs (Zero Emojis) --- */
const OracleSpeakerGlyph = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M11 5L6 9H2V15H6L11 19V5Z"
      fill="url(#oracleSpeakerGrad)"
      stroke="#ffd700"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <path
      d="M15.54 8.46C16.48 9.4 17 10.66 17 12C17 13.34 16.48 14.6 15.54 15.54"
      stroke="#f4a261"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M19.07 4.93C20.94 6.8 22 9.33 22 12C22 14.67 20.94 17.2 19.07 19.07"
      stroke="rgba(255, 215, 0, 0.75)"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <defs>
      <linearGradient id="oracleSpeakerGrad" x1="2" y1="5" x2="11" y2="19" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffd700" />
        <stop offset="1" stopColor="#f4a261" />
      </linearGradient>
    </defs>
  </svg>
);

const OraclePlayGlyph = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <polygon points="6 3 20 12 6 21 6 3" fill="#ffffff" stroke="#ffd700" strokeWidth="1" strokeLinejoin="round" />
  </svg>
);

const OraclePauseGlyph = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="5" y="4" width="4" height="16" rx="2" fill="#ffffff" />
    <rect x="15" y="4" width="4" height="16" rx="2" fill="#ffffff" />
  </svg>
);

const OracleStopGlyph = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="4" y="4" width="16" height="16" rx="3" fill="#ffffff" />
  </svg>
);

const SoundwaveBars = () => (
  <span className="oracle-soundwave" aria-hidden="true">
    <span className="wave-bar bar-1" />
    <span className="wave-bar bar-2" />
    <span className="wave-bar bar-3" />
    <span className="wave-bar bar-4" />
  </span>
);

export default function OracleVoicePlayer({
  sections = [],
  name = 'Seeker',
  language = 'en',
  onActiveSectionChange,
}) {
  const [speechState, setSpeechState] = useState(() => speechOracle.getState());
  const isKa = language === 'ka';

  // Subscribe to speech engine updates
  useEffect(() => {
    const unsubscribe = speechOracle.subscribe((state) => {
      setSpeechState(state);
      if (onActiveSectionChange) {
        onActiveSectionChange(state.currentSectionId);
      }
    });

    return () => {
      unsubscribe();
      speechOracle.stop(true);
    };
  }, [onActiveSectionChange]);

  // Transform sections into structured spoken playlist
  const playlist = useMemo(() => {
    return sections.map((sec) => ({
      id: sec.position || sec.title,
      title: sec.title,
      text: sec.content,
    }));
  }, [sections]);

  if (!speechState.isSupported) {
    return null; // Gracefully omit if browser has no speech synthesis support
  }

  const { isPlaying, isPaused, currentIndex, currentSectionTitle, rate } = speechState;

  const handleToggle = () => {
    speechOracle.togglePlayPause(playlist, 0, language);
  };

  const handleStop = () => {
    speechOracle.stop(true);
  };

  const cycleRate = () => {
    const rates = [0.85, 1.0, 1.15];
    const nextIdx = (rates.indexOf(rate) + 1) % rates.length;
    speechOracle.setRate(rates[nextIdx]);
  };

  return (
    <div
      className={`oracle-voice-player ${isPlaying ? 'is-playing' : ''} ${isPaused ? 'is-paused' : ''}`}
      role="region"
      aria-label={isKa ? 'ორაკულის ხმა — წაკითხვა ხმამაღლა' : 'Voice of the Oracle — Read Aloud'}
    >
      <div className="oracle-player-glass">
        {/* Left: Indicator & Icon */}
        <div className="oracle-icon-wrapper">
          <div className="oracle-speaker-icon">
            <OracleSpeakerGlyph />
          </div>
          {isPlaying && !isPaused && <SoundwaveBars />}
        </div>

        {/* Center: Status & Title */}
        <div className="oracle-info-wrap">
          <div className="oracle-badge-row">
            <span className="oracle-badge-spark">✦</span>
            <span className="oracle-badge-label">
              {isKa ? 'ორაკულის ხმა' : 'Voice of the Oracle'}
            </span>
            {isPlaying && (
              <span className="oracle-progress-pill">
                {currentIndex + 1} / {playlist.length}
              </span>
            )}
          </div>

          <p className="oracle-status-text">
            {isPlaying
              ? (isPaused
                  ? (isKa ? 'შეჩერებულია' : 'Narration Paused')
                  : (currentSectionTitle || (isKa ? 'მიმდინარეობს წაკითხვა...' : 'Speaking...')))
              : (isKa ? `მოუსმინეთ თქვენს პირად არკანას (${name})` : `Listen to your sacred reading, ${name}`)}
          </p>
        </div>

        {/* Right: Controls */}
        <div className="oracle-controls">
          {/* Rate Selector */}
          <button
            type="button"
            className="oracle-rate-btn"
            onClick={cycleRate}
            title={isKa ? 'სიჩქარის შეცვლა' : 'Change voice speed'}
            aria-label={`Voice speed: ${rate}x`}
          >
            {rate}x
          </button>

          {/* Play / Pause Toggle Button */}
          <button
            type="button"
            className={`oracle-main-btn ${isPlaying && !isPaused ? 'playing' : ''}`}
            onClick={handleToggle}
            title={isPlaying && !isPaused ? (isKa ? 'შეჩერება' : 'Pause') : (isKa ? 'მოსმენა' : 'Read Aloud')}
            aria-label={isPlaying && !isPaused ? 'Pause narration' : 'Start narration'}
          >
            {isPlaying && !isPaused ? <OraclePauseGlyph /> : <OraclePlayGlyph />}
          </button>

          {/* Stop Button (visible while playing or paused) */}
          {isPlaying && (
            <button
              type="button"
              className="oracle-stop-btn"
              onClick={handleStop}
              title={isKa ? 'შეწყვეტა' : 'Stop'}
              aria-label="Stop narration"
            >
              <OracleStopGlyph />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

