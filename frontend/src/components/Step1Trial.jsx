import { useState } from 'react';
import { calculateZodiacSign, zodiacDetails } from '../utils/zodiac';
import { supportedLanguages } from '../utils/languages';
import CosmicDatePicker from './CosmicDatePicker';
import CosmicButton from './CosmicButton';
import soundManager from '../services/sound';

/* --- Clean Celestial SVG Icons (No Emojis) --- */
const DestinyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

const LoveIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CareerIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

const HealingIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

const SpiritualIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const UserIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MailIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" x2="22" y1="12" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const CompassIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const SparkleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

export default function Step1Trial({ onComplete, onBack, isSubmitting }) {
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState('en');
  const [focusArea, setFocusArea] = useState('General Destiny');
  const [error, setError] = useState(null);

  const focusOptions = [
    { id: 'destiny', label: 'General Destiny', title: 'Destiny', icon: <DestinyIcon /> },
    { id: 'love', label: 'Love & Soul Connections', title: 'Love & Soul', icon: <LoveIcon /> },
    { id: 'career', label: 'Career & Calling', title: 'Career', icon: <CareerIcon /> },
    { id: 'healing', label: 'Inner Healing & Peace', title: 'Healing', icon: <HealingIcon /> },
    { id: 'spiritual', label: 'Spiritual Awakening', title: 'Spiritual', icon: <SpiritualIcon /> },
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
                <span className="label-ico"><UserIcon /></span> Name
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
                <span className="label-ico"><MailIcon /></span> Delivery Email
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
                <span className="label-ico"><CalendarIcon /></span> Date of Birth
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
                <span className="label-ico"><GlobeIcon /></span> Divine Tongue
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
                <span className="sparkle-ico"><SparkleIcon /></span>
                <span>Enter birth date to reveal your astrological sign</span>
              </div>
            )}
          </div>

          {/* Single-Line Focus Area Ribbon */}
          <div className="trial-focus-compact">
            <div className="focus-header-row">
              <span className="trial-compact-label">
                <span className="label-ico"><CompassIcon /></span> Sphere of Illumination
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
                    title={opt.label}
                  >
                    <span className="pill-ico">{opt.icon}</span>
                    <span className="pill-title">{opt.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {error && <div className="trial-error-glass">{error}</div>}

          {/* Action Button (CosmicButton with particles & stars) */}
          <div className="trial-action-wrap">
            <CosmicButton
              type="submit"
              disabled={isSubmitting}
              isAnimating={isSubmitting}
              variant="cosmic"
              className="trial-cosmic-submit-btn"
              title="Align With Cosmos & Draw Cards"
            >
              <span className="trial-btn-content">
                <SparkleIcon />
                <span>
                  {isSubmitting ? 'Channeling Cosmic Energies...' : 'Align With Cosmos & Draw Cards'}
                </span>
              </span>
            </CosmicButton>
          </div>
        </form>
      </div>
    </div>
  );
}
