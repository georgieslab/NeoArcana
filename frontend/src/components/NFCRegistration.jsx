import { useState } from 'react';
import api from '../services/api';
import { calculateZodiacSign } from '../utils/zodiac';
import { supportedLanguages } from '../utils/languages';
import CosmicDatePicker from './CosmicDatePicker';

export default function NFCRegistration({
  initialPosterCode = '',
  onComplete,
  onBack,
}) {
  const [subStep, setSubStep] = useState(initialPosterCode ? 1 : 0);
  const [posterCode, setPosterCode] = useState(initialPosterCode);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  // User form data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [language, setLanguage] = useState('en');
  const [interests, setInterests] = useState([]);
  const [favoriteColor, setFavoriteColor] = useState('#A59AD1');
  const [gender] = useState('Celestial Balance');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const interestOptions = [
    { id: 'spiritual', label: '✨ Spiritual Growth', icon: '✨' },
    { id: 'love', label: '💖 Love & Relationships', icon: '💖' },
    { id: 'career', label: '🚀 Career & Purpose', icon: '🚀' },
    { id: 'creativity', label: '🎨 Art & Creativity', icon: '🎨' },
    { id: 'healing', label: '🌿 Inner Healing', icon: '🌿' },
    { id: 'abundance', label: '🌟 Wealth & Abundance', icon: '🌟' },
  ];

  const colorOptions = [
    { name: 'Cosmic Violet', hex: '#A59AD1' },
    { name: 'Mystic Purple', hex: '#6B4E71' },
    { name: 'Solar Gold', hex: '#F4A261' },
    { name: 'Stardust Yellow', hex: '#FFD700' },
    { name: 'Nebula Turquoise', hex: '#40E0D0' },
    { name: 'Deep Ether', hex: '#3B3B6D' },
  ];

  const toggleInterest = (id) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleVerifyCode = async (e) => {
    e?.preventDefault();
    if (!posterCode.trim()) return;

    setIsVerifying(true);
    setVerificationError('');

    try {
      const res = await api.verifyPoster(posterCode.trim());
      if (res.valid) {
        setSubStep(1); // Proceed to personal details
      } else {
        setVerificationError(res.message || 'Poster code not recognized.');
      }
    } catch (err) {
      console.warn('Verification error:', err);
      // In offline / dev mode, allow proceeding
      setSubStep(1);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    if (!name.trim() || !birthDate) return;

    setIsSubmitting(true);
    const zodiacSign = calculateZodiacSign(birthDate);

    const payload = {
      name: name.trim(),
      email: email.trim(),
      birthDate,
      zodiacSign,
      language,
      interests,
      favoriteColor,
      gender,
      posterCode: posterCode.trim(),
    };

    try {
      const res = await api.registerUser(payload);
      const nfcId = res?.nfcId || `nfc_${posterCode || 'registered'}`;
      onComplete({ ...payload, nfc_id: nfcId });
    } catch (err) {
      console.warn('Registration failed, continuing in guest/local mode:', err);
      onComplete({ ...payload, nfc_id: `nfc_${posterCode || 'local'}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="nfc-registration-wrapper">
      <div className="nfc-registration-container">
        {onBack && (
          <button className="cosmic-back-btn" onClick={onBack} type="button">
            ← Return
          </button>
        )}

        {/* Step 0: Enter Poster Code */}
        {subStep === 0 && (
          <div className="nfc-substep fade-in">
            <div className="nfc-icon-header">🎴</div>
            <h1 className="nfc-title">Connect Your Cosmic Poster</h1>
            <p className="nfc-desc">
              Enter the unique 8-character code located on your NFC poster or card:
            </p>

            <form onSubmit={handleVerifyCode} className="nfc-code-form">
              <input
                type="text"
                value={posterCode}
                onChange={(e) => setPosterCode(e.target.value.toUpperCase())}
                placeholder="e.g. 7X8K2M9P"
                maxLength={12}
                className="cosmic-input text-center text-xl tracking-widest font-mono"
                required
              />

              {verificationError && (
                <p className="cosmic-error-message">{verificationError}</p>
              )}

              <button
                type="submit"
                disabled={isVerifying || !posterCode.trim()}
                className="cosmic-button cosmic-button--primary cosmic-button--large w-full mt-4"
              >
                <span>{isVerifying ? 'Verifying Portal...' : '✨ Verify Code'}</span>
              </button>
            </form>
          </div>
        )}

        {/* Step 1: User Profile Info */}
        {subStep === 1 && (
          <form onSubmit={handleSubmitRegistration} className="nfc-substep fade-in">
            <h1 className="nfc-title">Tune Your Frequency</h1>
            <p className="nfc-desc">
              Provide your details so the cards resonate directly with your personal aura:
            </p>

            <div className="nfc-form-grid">
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your sacred name"
                  className="cosmic-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Date of Birth</label>
                <CosmicDatePicker
                  value={birthDate}
                  onChange={setBirthDate}
                  required
                  showBadge={true}
                />
              </div>

              <div className="form-group">
                <label>Email (Optional for readings journal)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="cosmic-input"
                />
              </div>

              <div className="form-group">
                <label>Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="cosmic-input cosmic-select"
                >
                  {supportedLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.native} ({lang.name}) {lang.flag}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Interests Multi-Select */}
            <div className="form-group mt-4">
              <label>Life Spheres to Align With</label>
              <div className="nfc-interests-chips">
                {interestOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`nfc-chip ${interests.includes(opt.id) ? 'selected' : ''}`}
                    onClick={() => toggleInterest(opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Aura Color Picker */}
            <div className="form-group mt-4">
              <label>Your Dominant Aura Color</label>
              <div className="nfc-color-palette">
                {colorOptions.map((color) => (
                  <button
                    key={color.hex}
                    type="button"
                    className={`nfc-color-swatch ${favoriteColor === color.hex ? 'active' : ''}`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setFavoriteColor(color.hex)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !birthDate}
              className="cosmic-button cosmic-button--primary cosmic-button--large w-full mt-6"
            >
              <span>{isSubmitting ? 'Attuning Energies...' : '🌟 Activate Portal & Draw Cards'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
