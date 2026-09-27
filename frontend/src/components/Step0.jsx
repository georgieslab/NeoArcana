import { useState } from 'react';

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
            className="cosmic-button cosmic-button--primary cosmic-button--large"
          >
            <span>✨ Galactic Trial</span>
          </button>

          <button
            onClick={onPosterRegistration}
            type="button"
            className="cosmic-button cosmic-button--secondary cosmic-button--large"
          >
            <span>🎴 Register Poster</span>
          </button>

          <button
            onClick={onShowStory}
            type="button"
            className="cosmic-button cosmic-button--ghost cosmic-button--large"
          >
            <span>📜 Story Behind</span>
          </button>
        </div>

        {error && <div className="cosmic-error-message">{error}</div>}

        {/* Creator Footer */}
        <p className="cosmic-footer-text">
          made w/ 🪄 by{' '}
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