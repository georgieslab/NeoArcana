import { useState } from 'react';

/* --- Handcrafted Celestial Vectors (Zero Emojis) --- */
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