import { useState } from 'react';
import { calculateZodiacSign, zodiacDetails } from '../utils/zodiac';
import { supportedLanguages } from '../utils/languages';
import CosmicDatePicker from './CosmicDatePicker';
import soundManager from '../services/sound';

export default function Step1Trial({ onComplete, onBack, isSubmitting }) {
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState('en');
  const [focusArea, setFocusArea] = useState('General Destiny');
  const [error, setError] = useState(null);

  const focusOptions = [
    { id: 'destiny', label: 'General Destiny', short: 'Destiny', icon: '💫' },
    { id: 'love', label: 'Love & Soul Connections', short: 'Love & Soul', icon: '💖' },
    { id: 'career', label: 'Career & Calling', short: 'Career', icon: '🚀' },
    { id: 'healing', label: 'Inner Healing & Peace', short: 'Healing', icon: '🌿' },
    { id: 'spiritual', label: 'Spiritual Awakening', short: 'Spiritual', icon: '🔮' },
  ];

  const zodiacSign = calculateZodiacSign(dateOfBirth);
  const zodiacInfo = zodiacSign ? zodiacDetails[zodiacSign] : null;

  const validateEmail = (val) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !dateOfBirth || !email.trim()) {
      setError('Please provide your name, date of birth, and email to align your reading.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    soundManager.playCelestialChime();

    const userData = {
      name: name.trim(),
      dateOfBirth,
      zodiacSign: zodiacSign || 'Cosmic Seeker',
      email: email.trim(),
      language,
      focusArea,
      isTrial: true,
      isPremium: false,
    };

    onComplete(userData);
  };

  return (
    <div className="trial-step1-screen">
      <div className="trial-step1-card trial-glass-window">
        {/* Sleek Glass Window Top Bar */}
        <div className="trial-window-topbar">
          {onBack ? (
            <button
              className="trial-window-back"
              onClick={onBack}
              type="button"
              title="Return to start"
            >
              <span className="back-arrow">←</span> Cosmos
            </button>
          ) : (
            <div />
          )}

          <div className="trial-window-badge">
            <span className="badge-dots">
              <span className="dot active" />
              <span className="dot" />
              <span className="dot" />
            </span>
            <span className="badge-text">1. Attunement</span>
          </div>
        </div>

        {/* Compact Window Header */}
        <div className="trial-window-header">
          <h1 className="trial-window-title">Tune Your Frequency</h1>
          <p className="trial-window-subtitle">
            Anchor your personal vibration before consulting the sacred cards
          </p>
        </div>

        <form onSubmit={handleSubmit} className="trial-compact-form">
          {/* Main 2-Col Field Group (Name & Email) */}
          <div className="trial-compact-grid">
            {/* Sacred Name */}
            <div className="trial-input-block">
              <label className="trial-compact-label" htmlFor="seeker-name">
                <span className="label-ico">👤</span> Name
              </label>
              <input
                id="seeker-name"
                type="text"
                placeholder="What may the cosmos call you?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="trial-glass-input"
                required
              />
            </div>

            {/* Delivery Email */}
            <div className="trial-input-block">
              <label className="trial-compact-label" htmlFor="seeker-email">
                <span className="label-ico">✉️</span> Delivery Email
              </label>
              <input
                id="seeker-email"
                type="email"
                placeholder="your.aura@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="trial-glass-input"
                required
              />
            </div>
          </div>

          {/* Date of Birth & Language Grid */}
          <div className="trial-compact-grid trial-dob-lang-row">
            {/* Date of Birth */}
            <div className="trial-input-block trial-dob-block">
              <label className="trial-compact-label">
                <span className="label-ico">📅</span> Date of Birth
              </label>
              <CosmicDatePicker
                value={dateOfBirth}
                onChange={setDateOfBirth}
                required
              />
            </div>

            {/* Language Selection */}
            <div className="trial-input-block trial-lang-block">
              <label className="trial-compact-label" htmlFor="seeker-lang">
                <span className="label-ico">🌐</span> Divine Tongue
              </label>
              <select
                id="seeker-lang"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="trial-glass-input trial-glass-select"
              >
                {supportedLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.native} ({lang.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Zodiac Inline Attunement Pill */}
          <div className="trial-zodiac-inline">
            {zodiacInfo ? (
              <div className="zodiac-pill-active" style={{ borderColor: zodiacInfo.color }}>
                <span className="zodiac-glyph">{zodiacInfo.symbol}</span>
                <span className="zodiac-name">{zodiacSign}</span>
                <span className="zodiac-divider">•</span>
                <span className="zodiac-meta">{zodiacInfo.elementIcon} {zodiacInfo.element}</span>
                <span className="zodiac-divider">•</span>
                <span className="zodiac-meta">🪐 {zodiacInfo.ruler}</span>
                <span className="zodiac-divider">•</span>
                <span className="zodiac-trait-pill">{zodiacInfo.trait}</span>
              </div>
            ) : (
              <div className="zodiac-pill-idle">
                <span className="sparkle-ico">✨</span>
                <span>Enter birth date to reveal your astrological sign</span>
              </div>
            )}
          </div>

          {/* Compact Focus Area Ribbon */}
          <div className="trial-focus-compact">
            <div className="focus-header-row">
              <span className="trial-compact-label">
                <span className="label-ico">🧭</span> Sphere of Illumination
              </span>
              <span className="focus-current-name">{focusArea}</span>
            </div>
            <div className="trial-pills-row">
              {focusOptions.map((opt) => {
                const isSelected = focusArea === opt.label;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`trial-focus-pill ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      soundManager.playStarSparkle();
                      setFocusArea(opt.label);
                    }}
                  >
                    <span className="pill-ico">{opt.icon}</span>
                    <span className="pill-title">{opt.short}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {error && <div className="trial-error-glass">{error}</div>}

          {/* Action Button */}
          <div className="trial-action-wrap">
            <button
              type="submit"
              disabled={isSubmitting}
              className="trial-cosmic-submit-btn"
            >
              <span className="btn-glow-layer" />
              <span className="btn-shimmer" />
              <span className="btn-content">
                {isSubmitting ? '✨ Channeling Cosmic Energies...' : '🌟 Align With Cosmos & Draw Cards'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
