import { useState } from 'react';

/* --- Handcrafted Celestial Vectors (Zero Emojis) --- */
const GalacticStarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 1L14.7 8.3L22 9.5L16.5 14.7L18.2 22L12 18.2L5.8 22L7.5 14.7L2 9.5L9.3 8.3L12 1Z"
      fill="url(#step0StarGrad)"
      stroke="#ffd700"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="2.2" fill="#ffffff" />
    <defs>
      <linearGradient id="step0StarGrad" x1="2" y1="1" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffd700" />
        <stop offset="0.5" stopColor="#64dfdf" />
        <stop offset="1" stopColor="#9370db" />
      </linearGradient>
    </defs>
  </svg>
);

const NfcCardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="16" rx="3" stroke="#f4a261" strokeWidth="1.8" fill="rgba(244, 162, 97, 0.15)" />
    <path d="M7 15a4 4 0 0 1 0-6" stroke="#ffd700" strokeWidth="1.6" />
    <path d="M10 17a7 7 0 0 1 0-10" stroke="#f4a261" strokeWidth="1.6" />
    <circle cx="17" cy="12" r="1.5" fill="#ffd700" />
  </svg>
);

const StoryScrollIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4" stroke="#cdc0f2" />
    <path d="M19 17V5a2 2 0 0 0-2-2H4" stroke="#cdc0f2" />
    <path d="M10 8h6M10 12h4" stroke="#f4a261" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const WandSparkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ verticalAlign: 'middle', display: 'inline-block' }}>
    <path d="m15 4-2 2M15 9l-2-2M18 6l-2 2M6 20l10-10-2-2L4 18l2 2Z" fill="url(#wandGrad)" stroke="#f4a261" />
    <circle cx="19" cy="4" r="1" fill="#ffd700" />
    <defs>
      <linearGradient id="wandGrad" x1="4" y1="20" x2="16" y2="8" gradientUnits="userSpaceOnUse">
        <stop stopColor="#a59ad1" />
        <stop offset="1" stopColor="#ffd700" />
      </linearGradient>
    </defs>
  </svg>
);

export default function Step0({ onTryFree, onPosterRegistration, onShowStory }) {
  const [error] = useState('');

  return (
    <div className="cosmic-landing">
      <div className="cosmic-landing-inner">
        {/* Mystic Glow Logo */}
        <div className="cosmic-logo-wrapper">
          <img
            src="/static/images/logo.png"
            alt="NeoArcana Logo"
            className="cosmic-logo"
            onError={(e) => {
              // Graceful fallback if logo png not found
              e.target.style.display = 'none';
            }}
          />
        </div>

        {/* Title & Tagline */}
        <h1 className="cosmic-landing-title">NeoArcana</h1>
        <p className="cosmic-landing-subtitle">
          Where Ancient Wisdom Meets Modern Magic
        </p>

        {/* Action Buttons */}
        <div className="cosmic-buttons">
          <button
            onClick={onTryFree}
            type="button"
            className="cosmic-button cosmic-button--primary cosmic-button--trial cosmic-button--large"
            title="Begin your personalized cosmic reading for free"
          >
            <span className="cosmic-btn-inner">
              <span className="cosmic-btn-icon cosmic-btn-icon--trial">
                <GalacticStarIcon />
              </span>
              <span className="cosmic-btn-label">Galactic Trial</span>
              <span className="cosmic-btn-tag cosmic-btn-tag--free">FREE</span>
            </span>
          </button>

          <button
            onClick={onPosterRegistration}
            type="button"
            className="cosmic-button cosmic-button--secondary cosmic-button--poster cosmic-button--large"
            title="Connect your physical NFC poster or smart card"
          >
            <span className="cosmic-btn-inner">
              <span className="cosmic-btn-icon">
                <NfcCardIcon />
              </span>
              <span className="cosmic-btn-label">Register Poster</span>
              <span className="cosmic-btn-nfc-tag">NFC</span>
            </span>
          </button>

          <button
            onClick={onShowStory}
            type="button"
            className="cosmic-button cosmic-button--ghost cosmic-button--large"
          >
            <span className="cosmic-btn-inner">
              <span className="cosmic-btn-icon">
                <StoryScrollIcon />
              </span>
              <span className="cosmic-btn-label">Story Behind</span>
            </span>
          </button>
        </div>

        {error && <div className="cosmic-error-message">{error}</div>}

        {/* Creator Footer */}
        <p className="cosmic-footer-text">
          made with <WandSparkIcon /> by{' '}
          <a
            href="https://instagram.com/georgieslab"
            target="_blank"
            rel="noopener noreferrer"
          >
            georgie
          </a>
          .
        </p>
      </div>
    </div>
  );
}