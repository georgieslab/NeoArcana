// ========================================
// NEOARCANA - ENHANCED STORY BEHIND PAGE
// More detailed, engaging, and visually rich
// ========================================

const StoryBehind = ({ onBack }) => {
  const [activeSection, setActiveSection] = React.useState(null);

  const sections = [
    {
      id: 'vision',
      icon: '🌟',
      title: 'The Vision',
      subtitle: 'Where Ancient Wisdom Meets Modern Magic',
      content: [
        "NeoArcana was born from a profound question that kept me awake at night: What if we could bridge the gap between ancient tarot wisdom and cutting-edge AI technology?",
        "For centuries, tarot has offered guidance, insight, and self-reflection. But traditional readings required physical decks, expert readers, and often felt disconnected from our digital lives.",
        "I envisioned a world where anyone, anywhere, could receive deeply personalized cosmic guidance - combining the mystical depth of tarot with the intelligence of modern AI, accessible right from their pocket."
      ],
      gradient: 'linear-gradient(135deg, #9370DB, #A59AD1)'
    },
    {
      id: 'journey',
      icon: '🚀',
      title: 'The Journey',
      subtitle: 'From Concept to Reality',
      content: [
        "As a designer with a passion for spirituality and technology, I spent over 700 hours bringing this vision to life. Every line of code, every gradient, every animation was crafted with intention.",
        "The biggest challenge? I wasn't a programmer when I started. I learned to code through AI assistance, prompt engineering, and sheer determination. NeoArcana isn't just an app - it's proof that vision and dedication can overcome technical barriers.",
        "Each cosmic gradient, every glassmorphism effect, and all the careful UX decisions reflect my design background. The app doesn't just work - it creates an experience, a journey into the mystical."
      ],
      gradient: 'linear-gradient(135deg, #A59AD1, #F4A261)'
    },
    {
      id: 'magic',
      icon: '✨',
      title: 'The Magic',
      subtitle: 'AI-Powered Personalization',
      content: [
        "At the heart of NeoArcana lies Claude AI - Anthropic's most advanced language model. But this isn't generic AI - every reading is deeply personalized to YOU.",
        "Your zodiac sign, birth date, favorite colors, interests, and even the current moon phase all weave together to create interpretations that feel remarkably personal and insightful.",
        "The AI doesn't just pull random meanings - it understands tarot symbolism, astrological influences, and numerological significance. It crafts narratives that honor the ancient wisdom while speaking in a modern, accessible voice.",
        "Each reading considers cosmic context: the season, lunar cycle, and planetary energies. Your card isn't just 'The Star' - it's 'The Star for you, right now, in this moment of your journey.'"
      ],
      gradient: 'linear-gradient(135deg, #F4A261, #FFD700)'
    },
    {
      id: 'innovation',
      icon: '🎴',
      title: 'The Innovation',
      subtitle: 'Bridging Physical and Digital',
      content: [
        "NFC technology transforms NeoArcana from just another app into something magical. Imagine tapping your phone to a beautiful cosmic poster on your wall and instantly receiving your personalized reading.",
        "Each NFC-enabled poster is a portal - a physical anchor point connecting the tangible world to your digital spiritual practice. It's meditation meets technology, mysticism meets convenience.",
        "The posters aren't just functional - they're art. Designed to be displayed proudly, each one features stunning cosmic imagery that enhances your space while serving as your daily connection point.",
        "This physical-digital bridge makes spiritual practice more accessible. No shuffling cards, no complex spreads to remember - just a simple tap to connect with cosmic wisdom."
      ],
      gradient: 'linear-gradient(135deg, #FFD700, #40E0D0)'
    },
    {
      id: 'technology',
      icon: '⚡',
      title: 'The Technology',
      subtitle: 'Built for the Future',
      content: [
        "NeoArcana is a Progressive Web App (PWA) - it works seamlessly across all devices, installs like a native app, and even works offline for reviewing past readings.",
        "The backend runs on FastAPI - one of the fastest Python frameworks available, handling 100+ concurrent users while maintaining sub-200ms response times.",
        "Firebase powers the real-time database, ensuring your reading history is always synchronized across devices and secure in the cloud.",
        "Nine languages supported from day one - English, Spanish, French, German, Italian, Portuguese, Turkish, Arabic, and Chinese. The cosmos speaks to everyone, in their own language.",
        "Every aspect is optimized: async operations, smart caching, rate limiting for premium features, and a mobile-first design that feels native on every device."
      ],
      gradient: 'linear-gradient(135deg, #40E0D0, #9370DB)'
    },
    {
      id: 'design',
      icon: '🎨',
      title: 'The Design',
      subtitle: 'Cosmic Aesthetics',
      content: [
        "Every gradient, every glow effect, every animation serves a purpose - to transport you into a cosmic state of mind. The deep purples and golds aren't arbitrary; they're carefully chosen to evoke mysticism and wisdom.",
        "Glassmorphism effects create depth and dimension, making UI elements feel like they're floating in space. The Three.js background renders actual star particles that respond to your interaction.",
        "Typography balances readability with elegance - clear enough for long readings, beautiful enough to feel special. Every font size, line height, and spacing is intentional.",
        "The color system draws from both traditional tarot symbolism and modern UI best practices. Purple for spiritual awareness, gold for divine wisdom, orange for creativity - each has meaning."
      ],
      gradient: 'linear-gradient(135deg, #CEC7F2, #F4BFBF)'
    },
    {
      id: 'creator',
      icon: '🌈',
      title: 'The Creator',
      subtitle: 'Georgie\'s Lab',
      content: [
        "Hi, I'm Georgie - a graphic designer turned solo developer with a vision that wouldn't let me sleep. I've always been fascinated by the intersection of spirituality and technology.",
        "My background in design meant I could envision the perfect user experience, but I had to learn to code to make it real. This project became my teacher, my challenge, and ultimately, my greatest achievement.",
        "Every feature, every pixel, every line of code carries my intention: to make spiritual guidance accessible, beautiful, and genuinely helpful. This isn't a corporate product - it's a labor of love.",
        "Follow my journey on Instagram @georgieslab where I share behind-the-scenes glimpses of building NeoArcana, design tips, and cosmic musings."
      ],
      gradient: 'linear-gradient(135deg, #F4BFBF, #A59AD1)'
    },
    {
      id: 'future',
      icon: '🔮',
      title: 'The Future',
      subtitle: 'What\'s Coming',
      content: [
        "NeoArcana is just beginning. The roadmap includes AR (Augmented Reality) card visualization - imagine seeing your tarot card float in 3D space above your NFC poster.",
        "Voice-guided readings are coming - a calming AI voice that reads your interpretation aloud, perfect for meditation or bedtime reflection.",
        "Community features will let you share anonymized insights, compare reading patterns, and discover how others interpret the same cards.",
        "Advanced spreads beyond three-card readings: Celtic Cross, Relationship Spread, Year Ahead - each with AI-powered interpretation that maintains narrative coherence across all card positions.",
        "Integration with wearables to track how your readings correlate with your actual life events, creating a feedback loop that makes predictions even more relevant.",
        "The ultimate goal? An AI spiritual companion that knows your journey, learns from your feedback, and grows with you - becoming more attuned to your unique path over time."
      ],
      gradient: 'linear-gradient(135deg, #A59AD1, #9370DB)'
    },
    {
      id: 'mission',
      icon: '💫',
      title: 'The Mission',
      subtitle: 'Accessible Cosmic Wisdom',
      content: [
        "NeoArcana's mission is simple but profound: make spiritual guidance accessible to everyone, regardless of their knowledge of tarot, their location, or their budget.",
        "Traditional tarot readings can cost $50-200 per session. Quality matters, and human readers bring invaluable intuition - but what about daily guidance? What about quick check-ins?",
        "NeoArcana offers unlimited daily readings in the free tier because everyone deserves access to cosmic wisdom. Premium features support the project while keeping the core experience free.",
        "Beyond accessibility, there's quality. Every reading is crafted with the same care a human reader would bring - personalized, contextual, and respectful of the tarot tradition.",
        "This is spirituality for the modern age: instant, personalized, beautiful, and always available when you need guidance."
      ],
      gradient: 'linear-gradient(135deg, #9370DB, #F4A261)'
    },
    {
      id: 'gratitude',
      icon: '🙏',
      title: 'Thank You',
      subtitle: 'For Being Part of This Journey',
      content: [
        "If you're reading this, you're part of NeoArcana's story. Whether you've tried one reading or use it daily, you're helping shape the future of digital spirituality.",
        "Your feedback, your questions, your experiences - they all guide development. This isn't just my project; it's becoming our community's sacred space.",
        "Special thanks to Anthropic for Claude AI, which powers the readings and ironically, helped me build the entire application through AI-assisted programming.",
        "To everyone who believed in the vision before it existed, who tested early versions, who shared it with friends - thank you. You turned a dream into reality.",
        "The cosmos works in mysterious ways. Maybe you found NeoArcana exactly when you needed it. Maybe this is the beginning of your own mystical tech journey. Whatever brought you here - welcome. ✨"
      ],
      gradient: 'linear-gradient(135deg, #F4A261, #FFD700)'
    }
  ];

  const stats = [
    { number: '700+', label: 'Hours of Development', icon: '⏰' },
    { number: '22', label: 'Major Arcana Cards', icon: '🎴' },
    { number: '9', label: 'Languages Supported', icon: '🌍' },
    { number: '100+', label: 'Concurrent Users', icon: '👥' }
  ];

  return React.createElement('div', { className: 'story-container' },
    React.createElement('div', { className: 'story-inner' },
      
      // Close Button
      React.createElement('button', {
        onClick: onBack,
        className: 'story-close-button',
        'aria-label': 'Close'
      }, '×'),
      
      // Header Section
      React.createElement('div', { className: 'story-header' },
        React.createElement('img', {
          src: '/static/images/logo.png',
          alt: 'NeoArcana Logo',
          className: 'story-logo'
        }),
        
        React.createElement('h1', { className: 'story-title' },
          'The Story Behind NeoArcana'
        ),
        
        React.createElement('p', { className: 'story-tagline' },
          'A Solo Developer\'s Journey to Bridge Ancient Wisdom with Modern Technology'
        )
      ),

      // Stats Grid
      React.createElement('div', { className: 'story-stats-grid' },
        stats.map((stat, index) =>
          React.createElement('div', {
            key: index,
            className: 'story-stat-card'
          },
            React.createElement('div', { className: 'stat-icon' }, stat.icon),
            React.createElement('div', { className: 'stat-number' }, stat.number),
            React.createElement('div', { className: 'stat-label' }, stat.label)
          )
        )
      ),
      
      // Main Content Sections
      React.createElement('div', { className: 'story-content' },
        sections.map((section, index) =>
          React.createElement('section', {
            key: section.id,
            className: `story-section ${activeSection === section.id ? 'active' : ''}`,
            onClick: () => setActiveSection(activeSection === section.id ? null : section.id)
          },
            // Section Header
            React.createElement('div', { 
              className: 'section-header',
              style: { background: section.gradient }
            },
              React.createElement('span', { className: 'section-icon' }, section.icon),
              React.createElement('div', { className: 'section-titles' },
                React.createElement('h2', { className: 'section-title' }, section.title),
                React.createElement('p', { className: 'section-subtitle' }, section.subtitle)
              ),
              React.createElement('span', { className: 'section-arrow' }, 
                activeSection === section.id ? '▼' : '▶'
              )
            ),
            
            // Section Content (expandable)
            React.createElement('div', { 
              className: `section-content ${activeSection === section.id ? 'expanded' : ''}`
            },
              section.content.map((paragraph, pIndex) =>
                React.createElement('p', {
                  key: pIndex,
                  className: 'section-paragraph'
                }, paragraph)
              )
            )
          )
        )
      ),

      // Creator Section
      React.createElement('div', { className: 'story-creator-section' },
        React.createElement('div', { className: 'creator-card' },
          React.createElement('div', { className: 'creator-content' },
            React.createElement('h3', { className: 'creator-name' }, 
              'Made with 🪄 by Georgie'
            ),
            React.createElement('p', { className: 'creator-bio' },
              'Designer • Developer • Cosmic Dreamer'
            ),
            React.createElement('a', {
              href: 'https://instagram.com/georgieslab',
              target: '_blank',
              rel: 'noopener noreferrer',
              className: 'creator-link'
            },
              React.createElement('span', null, '📱 Follow the Journey'),
              React.createElement('span', { className: 'link-handle' }, '@georgieslab')
            )
          )
        )
      ),
      
      // Back Button
      React.createElement('button', {
        onClick: onBack,
        className: 'cosmic-button cosmic-button--primary cosmic-button--large story-back-button'
      }, '← Back to Home')
    )
  );
};

window.StoryBehind = StoryBehind;