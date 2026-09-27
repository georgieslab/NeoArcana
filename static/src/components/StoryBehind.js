// ========================================
// NEOARCANA - STORY BEHIND (LEGACY FALLBACK)
// Authentic phygital tarot narrative & Magician showcase
// ========================================

const StoryBehind = ({ onBack }) => {
  React.useEffect(() => {
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
      icon: '🎴'
    },
    {
      badge: 'ASTRONOMY',
      label: 'PyEphem Engine',
      detail: 'Live celestial transits & lunar calculations',
      icon: '🪐'
    },
    {
      badge: 'ARCHETYPES',
      label: '22 Major Arcana',
      detail: 'Original sacred geometry & celestial vector art',
      icon: '✨'
    },
    {
      badge: 'GLOBAL',
      label: '9 Languages',
      detail: 'Multilingual archetypal synthesis',
      icon: '🌍'
    }
  ];

  return React.createElement('div', {
    className: 'story-container',
    onClick: (e) => {
      if (e.target === e.currentTarget) onBack();
    },
    role: 'dialog',
    'aria-modal': 'true',
    'aria-label': 'The Story Behind NeoArcana'
  },
    React.createElement('div', { className: 'story-inner' },
      // Close Button
      React.createElement('button', {
        onClick: onBack,
        className: 'story-close-button',
        'aria-label': 'Close Story',
        type: 'button'
      }, '×'),

      // Hero Header
      React.createElement('header', { className: 'story-header' },
        React.createElement('div', { className: 'story-badge' }, 'PHYGITAL TAROT & CELESTIAL COMPUTING'),
        React.createElement('img', {
          src: '/static/images/logo.png',
          alt: 'NeoArcana Logo',
          className: 'story-logo',
          onError: (e) => { e.target.style.display = 'none'; }
        }),
        React.createElement('h1', { className: 'story-title' }, 'The Story Behind NeoArcana'),
        React.createElement('p', { className: 'story-tagline' },
          'Bridging sacred physical art with the living cosmos — a phygital tarot experiment by Georgie\'s Lab.'
        )
      ),

      // Specifications Strip
      React.createElement('div', { className: 'story-specs-grid' },
        specs.map((item, index) =>
          React.createElement('div', { key: index, className: 'story-spec-card' },
            React.createElement('div', { className: 'spec-top' },
              React.createElement('span', { className: 'spec-icon' }, item.icon),
              React.createElement('span', { className: 'spec-badge' }, item.badge)
            ),
            React.createElement('div', { className: 'spec-label' }, item.label),
            React.createElement('div', { className: 'spec-detail' }, item.detail)
          )
        )
      ),

      // Narrative Chapters
      React.createElement('div', { className: 'story-chapters' },
        // Chapter 1
        React.createElement('article', { className: 'story-chapter-card' },
          React.createElement('div', { className: 'chapter-header' },
            React.createElement('span', { className: 'chapter-pill' }, 'CHAPTER I'),
            React.createElement('h2', { className: 'chapter-title' }, 'The Spark: Beyond the Frozen Print')
          ),
          React.createElement('p', { className: 'chapter-text' },
            'For centuries, tarot has lived in two places: paper decks shuffled in solitude, or decorative prints hanging silently on a wall. But hanging tarot art always felt incomplete to me. You admire the sacred geometry of The Magician or The Star, but the artwork remains frozen in ink — blind to the sky outside your window.'
          ),
          React.createElement('p', { className: 'chapter-text' },
            'I wanted to build an artwork that breathes with the universe. What if placing your palm and phone against the artwork on your wall wasn\'t just a gimmick, but a grounding morning ritual that awakens the print, calculates the exact celestial transits overhead, and speaks directly to your moment?'
          )
        ),

        // Chapter 2
        React.createElement('article', { className: 'story-chapter-card' },
          React.createElement('div', { className: 'chapter-header' },
            React.createElement('span', { className: 'chapter-pill' }, 'CHAPTER II'),
            React.createElement('h2', { className: 'chapter-title' }, 'The Phygital Craft: Sacred Ink & Microchips')
          ),
          React.createElement('p', { className: 'chapter-text' },
            'NeoArcana lives at the convergence of tangible art and physical computing. We call this phygital — where the digital realm serves the physical world, not the other way around.'
          ),
          React.createElement('div', { className: 'craft-features-grid' },
            React.createElement('div', { className: 'craft-feature-item' },
              React.createElement('div', { className: 'craft-icon' }, '🖐️'),
              React.createElement('h3', null, 'The Touch Ritual'),
              React.createElement('p', null, 'Reaching out to touch physical art on your wall creates a conscious pause, anchoring your practice in physical space.')
            ),
            React.createElement('div', { className: 'craft-feature-item' },
              React.createElement('div', { className: 'craft-icon' }, '🔐'),
              React.createElement('h3', null, 'Hardware Authentication'),
              React.createElement('p', null, 'Each poster houses an embedded high-frequency NTAG NFC microchip with cryptographic verification.')
            ),
            React.createElement('div', { className: 'craft-feature-item' },
              React.createElement('div', { className: 'craft-icon' }, '🎨'),
              React.createElement('h3', null, 'Sacred Geometry'),
              React.createElement('p', null, 'Every line, glyph, and color harmony balances classical Hermetic tarot symbolism with cosmic minimalism.')
            )
          )
        ),

        // Chapter 3
        React.createElement('article', { className: 'story-chapter-card' },
          React.createElement('div', { className: 'chapter-header' },
            React.createElement('span', { className: 'chapter-pill' }, 'CHAPTER III'),
            React.createElement('h2', { className: 'chapter-title' }, 'The Engine: Real Astronomical Ephemeris')
          ),
          React.createElement('p', { className: 'chapter-text' },
            'Most digital card apps are little more than randomized fortune cookies. NeoArcana was engineered with genuine reverence for the celestial clock.'
          ),
          React.createElement('p', { className: 'chapter-text' },
            'Our backend calculates real-time ephemeris data using astronomical math. When you draw a card or tap your poster, the reading evaluates the live lunar phase, planetary positions, and seasonal solar altitude relative to your astrological profile.'
          )
        ),

        // Chapter 4: Featured Poster Showcase
        React.createElement('article', { className: 'story-poster-showcase' },
          React.createElement('div', { className: 'poster-showcase-visual' },
            React.createElement('img', {
              src: '/static/images/magician.jpg',
              alt: 'The Magician NFC Poster',
              className: 'showcase-poster-img'
            }),
            React.createElement('div', { className: 'poster-nfc-tag' },
              React.createElement('span', { className: 'nfc-pulse-ring' }),
              React.createElement('span', { className: 'nfc-tag-text' }, 'NFC EMBEDDED')
            )
          ),
          React.createElement('div', { className: 'poster-showcase-details' },
            React.createElement('span', { className: 'showcase-kicker' }, 'FLAGSHIP PHYSICAL RELEASE'),
            React.createElement('h2', { className: 'showcase-title' }, 'The Magician NFC Poster'),
            React.createElement('p', { className: 'showcase-tagline' }, 'The conduit between heaven and earth — as above, so below.'),
            React.createElement('p', { className: 'showcase-description' },
              'Hand-finished celestial artwork printed on heavy archival matte stock, embedded with a concealed NTAG NFC microchip. Tap your phone to the print anytime to instantly summon your daily cosmic guidance and astrological alignment.'
            ),
            React.createElement('ul', { className: 'showcase-specs-list' },
              React.createElement('li', null, '✨ Museum-quality archival fine art paper'),
              React.createElement('li', null, '🎴 Concealed NTAG213 NFC hardware chip'),
              React.createElement('li', null, '⚡ Instant one-tap phone attunement (iOS & Android)'),
              React.createElement('li', null, '🌌 Lifetime access to your daily cosmic readings')
            ),
            React.createElement('div', { className: 'showcase-actions' },
              React.createElement('a', {
                href: 'https://georgieslab.wixsite.com/georgies/product-page/the-magician-poster',
                target: '_blank',
                rel: 'noopener noreferrer',
                className: 'showcase-buy-btn'
              },
                React.createElement('span', null, '🛍️ Collect The Magician Poster at Georgie\'s Lab'),
                React.createElement('span', { className: 'btn-arrow' }, '↗')
              )
            )
          )
        ),

        // Chapter 5: Georgie's Lab
        React.createElement('article', { className: 'story-creator-card' },
          React.createElement('div', { className: 'creator-header' },
            React.createElement('span', { className: 'creator-icon' }, '🪄'),
            React.createElement('div', null,
              React.createElement('h2', { className: 'creator-name' }, 'Georgie\'s Lab'),
              React.createElement('p', { className: 'creator-sub' }, 'Design • Physical Computing • Sacred Tech')
            )
          ),
          React.createElement('p', { className: 'creator-manifesto' },
            '"NeoArcana is an ongoing laboratory experiment. I believe technology doesn\'t have to be noisy, addictive, or isolating. It can be physical, quiet, and sacred. When we combine tactile materials with thoughtful code, we create objects that invite us to pause, look up at the stars, and reflect."'
          ),
          React.createElement('div', { className: 'creator-links' },
            React.createElement('a', {
              href: 'https://instagram.com/georgieslab',
              target: '_blank',
              rel: 'noopener noreferrer',
              className: 'creator-link-pill'
            },
              React.createElement('span', null, '📱 Instagram'),
              React.createElement('span', { className: 'link-handle' }, '@georgieslab')
            ),
            React.createElement('a', {
              href: 'https://georgieslab.wixsite.com/georgies/product-page/the-magician-poster',
              target: '_blank',
              rel: 'noopener noreferrer',
              className: 'creator-link-pill'
            },
              React.createElement('span', null, '🏛️ The Lab Store'),
              React.createElement('span', { className: 'link-handle' }, 'The Magician Poster ↗')
            )
          )
        )
      ),

      // Bottom Back Button
      React.createElement('div', { className: 'story-footer' },
        React.createElement('button', {
          onClick: onBack,
          type: 'button',
          className: 'cosmic-button cosmic-button--primary cosmic-button--large story-back-btn'
        }, '← Return to Cosmos')
      )
    )
  );
};

window.StoryBehind = StoryBehind;