import { useEffect } from 'react';

export default function StoryBehind({ onBack }) {
  // Allow closing via Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  const specs = [
    {
      badge: 'HARDWARE',
      label: 'NTAG213 Microchip',
      detail: 'Embedded NFC with cryptographic signature',
      icon: '🎴',
    },
    {
      badge: 'ASTRONOMY',
      label: 'PyEphem Engine',
      detail: 'Live celestial transits & lunar calculations',
      icon: '🪐',
    },
    {
      badge: 'ARCHETYPES',
      label: '22 Major Arcana',
      detail: 'Original sacred geometry & celestial vector art',
      icon: '✨',
    },
    {
      badge: 'GLOBAL',
      label: '9 Languages',
      detail: 'Multilingual archetypal synthesis',
      icon: '🌍',
    },
  ];

  return (
    <div
      className="story-container"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onBack();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label="The Story Behind NeoArcana"
    >
      <div className="story-inner">
        {/* Close Button */}
        <button
          onClick={onBack}
          className="story-close-button"
          aria-label="Close Story"
          type="button"
        >
          ×
        </button>

        {/* Hero Section */}
        <header className="story-header">
          <div className="story-badge">PHYGITAL TAROT &amp; CELESTIAL COMPUTING</div>
          <img
            src="/static/images/logo.png"
            alt="NeoArcana Logo"
            className="story-logo"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <h1 className="story-title">The Story Behind NeoArcana</h1>
          <p className="story-tagline">
            Bridging sacred physical art with the living cosmos — a phygital tarot experiment by Georgie's Lab.
          </p>
        </header>

        {/* Specifications Strip */}
        <div className="story-specs-grid">
          {specs.map((item, index) => (
            <div key={index} className="story-spec-card">
              <div className="spec-top">
                <span className="spec-icon">{item.icon}</span>
                <span className="spec-badge">{item.badge}</span>
              </div>
              <div className="spec-label">{item.label}</div>
              <div className="spec-detail">{item.detail}</div>
            </div>
          ))}
        </div>

        {/* Narrative Chapters */}
        <div className="story-chapters">
          {/* Chapter 1: The Spark */}
          <article className="story-chapter-card">
            <div className="chapter-header">
              <span className="chapter-pill">CHAPTER I</span>
              <h2 className="chapter-title">The Spark: Beyond the Frozen Print</h2>
            </div>
            <p className="chapter-text">
              For centuries, tarot has lived in two places: paper decks shuffled in solitude, or decorative prints hanging silently on a wall. But hanging tarot art always felt incomplete to me. You admire the sacred geometry of The Magician or The Star, but the artwork remains frozen in ink — blind to the sky outside your window.
            </p>
            <p className="chapter-text">
              I wanted to build an artwork that breathes with the universe. What if placing your palm and phone against the artwork on your wall wasn't just a gimmick, but a grounding morning ritual that awakens the print, calculates the exact celestial transits overhead, and speaks directly to your moment?
            </p>
          </article>

          {/* Chapter 2: The Phygital Craft */}
          <article className="story-chapter-card">
            <div className="chapter-header">
              <span className="chapter-pill">CHAPTER II</span>
              <h2 className="chapter-title">The Phygital Craft: Sacred Ink &amp; Microchips</h2>
            </div>
            <p className="chapter-text">
              NeoArcana lives at the convergence of tangible art and physical computing. We call this <em>phygital</em> — where the digital realm serves the physical world, not the other way around.
            </p>

            <div className="craft-features-grid">
              <div className="craft-feature-item">
                <div className="craft-icon">🖐️</div>
                <h3>The Touch Ritual</h3>
                <p>
                  In a culture lost in endless doomscrolling, reaching out to touch physical art on your wall creates a conscious pause. It anchors your daily practice in physical space.
                </p>
              </div>

              <div className="craft-feature-item">
                <div className="craft-icon">🔐</div>
                <h3>Hardware Authentication</h3>
                <p>
                  Each poster houses an embedded high-frequency NTAG NFC microchip. Tapping your phone registers the poster to your personal cosmos with cryptographic certainty.
                </p>
              </div>

              <div className="craft-feature-item">
                <div className="craft-icon">🎨</div>
                <h3>Sacred Geometry</h3>
                <p>
                  Every line, glyph, and color harmony is illustrated to balance classical Hermetic tarot symbolism with contemporary cosmic minimalism.
                </p>
              </div>
            </div>
          </article>

          {/* Chapter 3: The Engine */}
          <article className="story-chapter-card">
            <div className="chapter-header">
              <span className="chapter-pill">CHAPTER III</span>
              <h2 className="chapter-title">The Engine: Real Astronomical Ephemeris</h2>
            </div>
            <p className="chapter-text">
              Most digital card apps are little more than randomized fortune cookies. NeoArcana was engineered with genuine reverence for the celestial clock.
            </p>
            <p className="chapter-text">
              Our backend calculates real-time ephemeris data using Python's astronomical libraries. When you draw a card or tap your poster, the reading evaluates the live lunar phase, planetary positions, and seasonal solar altitude relative to your astrological profile. The 22 Major Arcana archetypes aren't recited from an old book; they are woven live into the fabric of the current sky.
            </p>
          </article>

          {/* Chapter 4: Featured Artifact — The Magician */}
          <article className="story-poster-showcase">
            <div className="poster-showcase-visual">
              <img
                src="/static/images/magician.jpg"
                alt="The Magician NFC Poster"
                className="showcase-poster-img"
              />
              <div className="poster-nfc-tag">
                <span className="nfc-pulse-ring"></span>
                <span className="nfc-tag-text">NFC EMBEDDED</span>
              </div>
            </div>

            <div className="poster-showcase-details">
              <span className="showcase-kicker">FLAGSHIP PHYSICAL RELEASE</span>
              <h2 className="showcase-title">The Magician NFC Poster</h2>
              <p className="showcase-tagline">
                The conduit between heaven and earth — as above, so below.
              </p>
              <p className="showcase-description">
                Hand-finished celestial artwork printed on heavy archival matte stock, embedded with a concealed NTAG NFC microchip. Tap your phone to the print anytime to instantly summon your daily cosmic guidance and astrological alignment.
              </p>

              <ul className="showcase-specs-list">
                <li>✨ Museum-quality archival fine art paper</li>
                <li>🎴 Concealed NTAG213 NFC hardware chip</li>
                <li>⚡ Instant one-tap phone attunement (iOS &amp; Android)</li>
                <li>🌌 Lifetime access to your daily cosmic readings</li>
              </ul>

              <div className="showcase-actions">
                <a
                  href="https://georgieslab.wixsite.com/georgies/product-page/the-magician-poster"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="showcase-buy-btn"
                >
                  <span>🛍️ Collect The Magician Poster at Georgie's Lab</span>
                  <span className="btn-arrow">↗</span>
                </a>
              </div>
            </div>
          </article>

          {/* Chapter 5: Georgie's Lab */}
          <article className="story-creator-card">
            <div className="creator-header">
              <span className="creator-icon">🪄</span>
              <div>
                <h2 className="creator-name">Georgie's Lab</h2>
                <p className="creator-sub">Design • Physical Computing • Sacred Tech</p>
              </div>
            </div>
            <p className="creator-manifesto">
              "NeoArcana is an ongoing laboratory experiment. I believe technology doesn't have to be noisy, addictive, or isolating. It can be physical, quiet, and sacred. When we combine tactile materials with thoughtful code, we create objects that invite us to pause, look up at the stars, and reflect."
            </p>
            <div className="creator-links">
              <a
                href="https://instagram.com/georgieslab"
                target="_blank"
                rel="noopener noreferrer"
                className="creator-link-pill"
              >
                <span>📱 Instagram</span>
                <span className="link-handle">@georgieslab</span>
              </a>
              <a
                href="https://georgieslab.wixsite.com/georgies/product-page/the-magician-poster"
                target="_blank"
                rel="noopener noreferrer"
                className="creator-link-pill"
              >
                <span>🏛️ The Lab Store</span>
                <span className="link-handle">The Magician Poster ↗</span>
              </a>
            </div>
          </article>
        </div>

        {/* Bottom Back Button */}
        <div className="story-footer">
          <button
            onClick={onBack}
            type="button"
            className="cosmic-button cosmic-button--primary cosmic-button--large story-back-btn"
          >
            ← Return to Cosmos
          </button>
        </div>
      </div>
    </div>
  );
}
