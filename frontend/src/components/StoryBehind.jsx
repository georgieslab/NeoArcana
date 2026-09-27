import { useState, useEffect } from 'react';

export default function StoryBehind({ onBack }) {
  const [activeSection, setActiveSection] = useState('vision');

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

  const sections = [
    {
      id: 'vision',
      icon: '🌟',
      title: 'The Vision',
      subtitle: 'Where Ancient Wisdom Meets Modern Magic',
      content: [
        'NeoArcana was born from a profound question that kept me awake at night: What if we could bridge the gap between ancient tarot wisdom and cutting-edge AI technology?',
        'For centuries, tarot has offered guidance, insight, and self-reflection. But traditional readings required physical decks, expert readers, and often felt disconnected from our digital lives.',
        'I envisioned a world where anyone, anywhere, could receive deeply personalized cosmic guidance - combining the mystical depth of tarot with the intelligence of modern AI, accessible right from their pocket.',
      ],
      gradient: 'linear-gradient(135deg, #9370DB, #A59AD1)',
    },
    {
      id: 'journey',
      icon: '🚀',
      title: 'The Journey',
      subtitle: 'From Concept to Reality',
      content: [
        'As a designer with a passion for spirituality and technology, I spent over 700 hours bringing this vision to life. Every line of code, every gradient, every animation was crafted with intention.',
        "The biggest challenge? I wasn't a programmer when I started. I learned to code through AI assistance, prompt engineering, and sheer determination. NeoArcana isn't just an app - it's proof that vision and dedication can overcome technical barriers.",
        "Each cosmic gradient, every glassmorphism effect, and all the careful UX decisions reflect my design background. The app doesn't just work - it creates an experience, a journey into the mystical.",
      ],
      gradient: 'linear-gradient(135deg, #A59AD1, #F4A261)',
    },
    {
      id: 'magic',
      icon: '✨',
      title: 'The Magic',
      subtitle: 'AI-Powered Personalization',
      content: [
        'At the heart of NeoArcana lies intelligent foundation models. But this isn’t generic AI - every reading is deeply personalized to YOU.',
        'Your zodiac sign, birth date, favorite colors, interests, and even the current moon phase all weave together to create interpretations that feel remarkably personal and insightful.',
        'The AI doesn’t just pull random meanings - it understands tarot symbolism, astrological influences, and numerological significance. It crafts narratives that honor the ancient wisdom while speaking in a modern, accessible voice.',
        'Each reading considers cosmic context: the season, lunar cycle, and planetary energies. Your card isn’t just "The Star" - it’s "The Star for you, right now, in this moment of your journey."',
      ],
      gradient: 'linear-gradient(135deg, #F4A261, #FFD700)',
    },
    {
      id: 'innovation',
      icon: '🎴',
      title: 'The Innovation',
      subtitle: 'Bridging Physical and Digital',
      content: [
        'NFC technology transforms NeoArcana from just another app into something magical. Imagine tapping your phone to a beautiful cosmic poster on your wall and instantly receiving your personalized reading.',
        'Each NFC-enabled poster is a portal - a physical anchor point connecting the tangible world to your digital spiritual practice. It’s meditation meets technology, mysticism meets convenience.',
        'The posters aren’t just functional - they’re art. Designed to be displayed proudly, each one features stunning cosmic imagery that enhances your space while serving as your daily connection point.',
        'This physical-digital bridge makes spiritual practice more accessible. No shuffling cards, no complex spreads to remember - just a simple tap to connect with cosmic wisdom.',
      ],
      gradient: 'linear-gradient(135deg, #FFD700, #40E0D0)',
    },
    {
      id: 'technology',
      icon: '⚡',
      title: 'The Technology',
      subtitle: 'Built for the Future',
      content: [
        'NeoArcana is built as a lightning-fast responsive modern web experience, providing native-grade animations and fluid interactions across mobile and desktop.',
        'The backend runs on FastAPI and Amazon Bedrock with serverless intelligent LLM endpoints, delivering instant cosmic synthesis with sub-second response times.',
        'Firebase and Firestore power the cloud synchronization, ensuring your attunements and readings remain securely aligned across any device.',
        'Multiple languages are supported so the cosmos speaks to seekers in their native tongue: English, Spanish, French, German, Italian, Portuguese, and more.',
      ],
      gradient: 'linear-gradient(135deg, #40E0D0, #9370DB)',
    },
    {
      id: 'design',
      icon: '🎨',
      title: 'The Design',
      subtitle: 'Cosmic Aesthetics',
      content: [
        'Every gradient, every glow effect, every celestial animation serves a purpose: to transport you into a transcendent cosmic state of mind.',
        'Glassmorphism layers create ethereal depth, while interactive Three.js starry celestial particles respond to your presence.',
        'The typography and palette balance readability with mysticism - celestial gold (#ffd700), radiant amber (#f4a261), and royal amethyst (#a59ad1).',
      ],
      gradient: 'linear-gradient(135deg, #CEC7F2, #F4BFBF)',
    },
    {
      id: 'creator',
      icon: '🌈',
      title: 'The Creator',
      subtitle: "Georgie's Lab",
      content: [
        "Hi, I'm Georgie - a designer turned creator with a vision that wouldn't let me sleep. I've always been fascinated by the intersection of spirituality and technology.",
        'My design background guided the sacred atmosphere and experience, while modern agentic AI enabled me to architect the entire code foundation.',
        'Every pixel, gradient, and line of code carries deep intention: to make cosmic guidance accessible, sublime, and genuinely empowering.',
      ],
      gradient: 'linear-gradient(135deg, #F4BFBF, #A59AD1)',
    },
    {
      id: 'gratitude',
      icon: '🙏',
      title: 'Thank You',
      subtitle: 'For Being Part of This Journey',
      content: [
        "If you're reading this, you are part of NeoArcana's story. Whether you're drawing your first card or returning daily, you bring this universe to life.",
        'May the cosmos illuminate your path and the cards reveal your highest destiny. ✨',
      ],
      gradient: 'linear-gradient(135deg, #F4A261, #FFD700)',
    },
  ];

  const stats = [
    { number: '700+', label: 'Hours of Crafting', icon: '⏰' },
    { number: '22', label: 'Major Arcana Cards', icon: '🎴' },
    { number: '9', label: 'Languages Supported', icon: '🌍' },
    { number: '100%', label: 'Cosmic Dedication', icon: '✨' },
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

        {/* Header Section */}
        <div className="story-header">
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
            A Solo Creator's Journey to Bridge Ancient Wisdom with Modern Technology
          </p>
        </div>

        {/* Stats Grid */}
        <div className="story-stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="story-stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Content Sections */}
        <div className="story-content">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <section
                key={section.id}
                className={`story-section ${isActive ? 'active' : ''}`}
                onClick={() => setActiveSection(isActive ? null : section.id)}
              >
                <div className="section-header" style={{ background: section.gradient }}>
                  <span className="section-icon">{section.icon}</span>
                  <div className="section-titles">
                    <h2 className="section-title">{section.title}</h2>
                    <p className="section-subtitle">{section.subtitle}</p>
                  </div>
                  <span className="section-arrow">{isActive ? '▼' : '▶'}</span>
                </div>

                <div className={`section-content ${isActive ? 'expanded' : ''}`}>
                  {section.content.map((paragraph, pIdx) => (
                    <p key={pIdx} className="section-paragraph">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Creator Section */}
        <div className="story-creator-section">
          <div className="creator-card">
            <div className="creator-content">
              <h3 className="creator-name">Made with 🪄 by Georgie</h3>
              <p className="creator-bio">Designer • Developer • Cosmic Dreamer</p>
              <a
                href="https://instagram.com/georgieslab"
                target="_blank"
                rel="noopener noreferrer"
                className="creator-link"
              >
                <span>📱 Follow the Journey</span>
                <span className="link-handle">@georgieslab</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Back Button */}
        <button
          onClick={onBack}
          type="button"
          className="cosmic-button cosmic-button--primary cosmic-button--large story-back-button"
        >
          ← Back to Cosmos
        </button>
      </div>
    </div>
  );
}
