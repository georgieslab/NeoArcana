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
    { id: 'destiny', label: 'General Destiny', icon: '💫' },
    { id: 'love', label: 'Love & Soul Connections', icon: '💖' },
    { id: 'career', label: 'Career & Calling', icon: '🚀' },
    { id: 'healing', label: 'Inner Healing & Peace', icon: '🌿' },
    { id: 'spiritual', label: 'Spiritual Awakening', icon: '🔮' },
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
      <div className="trial-step1-card">
        {/* Navigation */}
        {onBack && (
          <button className="trial-step1-back-btn" onClick={onBack} type="button">
            <span className="back-arrow">←</span> Return to Cosmos
          </button>
        )}

        {/* Ethereal Stepper */}
        <div className="trial-stepper">
          <div className="stepper-item active">
            <div className="stepper-circle">
              <span className="stepper-icon">🔮</span>
            </div>
            <span className="stepper-label">1. Attunement</span>
          </div>
          <div className="stepper-line" />
          <div className="stepper-item">
            <div className="stepper-circle">
              <span className="stepper-icon">🎴</span>
            </div>
            <span className="stepper-label">2. Divination</span>
          </div>
          <div className="stepper-line" />
          <div className="stepper-item">
            <div className="stepper-circle">
              <span className="stepper-icon">✨</span>
            </div>
            <span className="stepper-label">3. Oracle</span>
          </div>
        </div>

        {/* Header */}
        <div className="trial-step1-header">
          <h1 className="trial-step1-title">Tune Your Frequency</h1>
          <p className="trial-step1-subtitle">
            Anchor your astrological vibration before consulting the sacred cards
          </p>
        </div>

        <form onSubmit={handleSubmit} className="trial-step1-form">
          {/* Main 2-Column Inputs Grid */}
          <div className="trial-step1-grid">
            {/* Name Field */}
            <div className="trial-field-group">
              <label className="trial-label" htmlFor="seeker-name">
                <span className="label-icon">👤</span> Your Sacred Name
              </label>
              <div className="trial-input-wrap">
                <input
                  id="seeker-name"
                  type="text"
                  placeholder="What may the universe call you?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="trial-cosmic-input"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="trial-field-group">
              <label className="trial-label" htmlFor="seeker-email">
                <span className="label-icon">✉️</span> Reading Delivery Email
              </label>
              <div className="trial-input-wrap">
                <input
                  id="seeker-email"
                  type="email"
                  placeholder="your.aura@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="trial-cosmic-input"
                  required
                />
              </div>
            </div>

            {/* Date of Birth Field */}
            <div className="trial-field-group trial-field-group--dob">
              <label className="trial-label">
                <span className="label-icon">📅</span> Date of Birth
              </label>
              <CosmicDatePicker
                value={dateOfBirth}
                onChange={setDateOfBirth}
                required
              />
            </div>

            {/* Language Selection */}
            <div className="trial-field-group trial-field-group--lang">
              <label className="trial-label" htmlFor="seeker-lang">
                <span className="label-icon">🌐</span> Divine Tongue
              </label>
              <div className="trial-input-wrap">
                <select
                  id="seeker-lang"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="trial-cosmic-input trial-cosmic-select"
                >
                  {supportedLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.native} ({lang.name}) {lang.flag}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Dynamic Zodiac Bloom Banner */}
          <div className={`trial-zodiac-banner ${zodiacInfo ? 'revealed' : 'waiting'}`}>
            {zodiacInfo ? (
              <div className="zodiac-banner-content">
                <div className="zodiac-glyph-ring" style={{ borderColor: zodiacInfo.color }}>
                  <span className="zodiac-glyph">{zodiacInfo.symbol}</span>
                </div>
                <div className="zodiac-details">
                  <div className="zodiac-header-row">
                    <span className="zodiac-name">{zodiacSign}</span>
                    <span className="zodiac-element-pill">
                      {zodiacInfo.elementIcon} {zodiacInfo.element} Sign
                    </span>
                    <span className="zodiac-ruler-pill">
                      🪐 {zodiacInfo.ruler}
                    </span>
                  </div>
                  <p className="zodiac-trait">Energy: {zodiacInfo.trait}</p>
                </div>
              </div>
            ) : (
              <div className="zodiac-placeholder">
                <span className="placeholder-sparkle">✨</span>
                <span>Enter your date of birth to reveal your celestial guardian sign</span>
              </div>
            )}
          </div>

          {/* Focus Area Inquiry Chips */}
          <div className="trial-focus-section">
            <label className="trial-label">
              <span className="label-icon">🧭</span> What Sphere of Life Seeks Illumination?
            </label>
            <div className="trial-focus-chips">
              {focusOptions.map((opt) => {
                const isSelected = focusArea === opt.label;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`focus-chip ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      soundManager.playStarSparkle();
                      setFocusArea(opt.label);
                    }}
                  >
                    <span className="chip-icon">{opt.icon}</span>
                    <span className="chip-text">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {error && <div className="trial-error-alert">{error}</div>}

          {/* Cosmic Submit Button */}
          <div className="trial-submit-wrap">
            <button
              type="submit"
              disabled={isSubmitting}
              className="trial-cosmic-button"
            >
              <span className="button-shimmer" />
              <span className="button-text">
                {isSubmitting ? '✨ Channeling Cosmic Energies...' : '🌟 Align With Cosmos & Draw Cards'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
