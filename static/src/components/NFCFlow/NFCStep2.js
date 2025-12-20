/**
 * NFCStep2.js - IMPROVED VERSION
 * Daily Tarot Reading Display for NFC Users
 * Features:
 * - Fixed layout (no awkward scrolling)
 * - Smooth animations
 * - Pulsing card effect
 * - Section-by-section reveal
 * - Mobile responsive
 * - FastAPI integration
 */

const NFCStep2 = ({ userData, error, onError }) => {
  // State Management
  const [loading, setLoading] = React.useState(true);
  const [readingData, setReadingData] = React.useState(null);
  const [apiError, setApiError] = React.useState(error || null);
  const [cardPulse, setCardPulse] = React.useState(true);
  const [showSections, setShowSections] = React.useState(false);
  const [chatOpen, setChatOpen] = React.useState(false);

  // Refs
  const mountedRef = React.useRef(true);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Lock body scroll when component mounts
  React.useEffect(() => {
    document.body.classList.add('cosmic-reading-active');
    
    return () => {
      document.body.classList.remove('cosmic-reading-active');
    };
  }, []);

  // Fetch daily reading
  React.useEffect(() => {
    const fetchDailyReading = async () => {
      if (!userData || !userData.nfc_id) {
        setApiError('No user data available');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching daily reading for:', userData.nfc_id);
        
        // Prepare user data for API
        const requestData = {
          userData: {
            nfc_id: userData.nfc_id,
            name: userData.user_data&&name || userData.name || 'Cosmic Traveler',
            zodiacSign: userData.user_data&&zodiacSign || userData.zodiacSign || 'Unknown',
            language: userData.user_data&&preferences&&language || 'en',
            preferences: {
              color: userData.user_data&&preferences&&color || { name: 'Cosmic Purple', value: '#A59AD1' },
              interests: userData.user_data&&preferences&&interests || [],
              numbers: userData.user_data&&preferences&&numbers || {}
            }
          }
        };

        console.log('Request data:', requestData);

        const response = await fetch('/api/nfc/daily_affirmation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch reading');
        }

        const data = await response.json();
        console.log('Received reading data:', data);

        if (!mountedRef.current) return;

        if (data.success) {
          setReadingData(data.data);
          
          // Show sections after a delay
          setTimeout(() => {
            if (mountedRef.current) {
              setShowSections(true);
            }
          }, 800);

          // Stop card pulse after sections appear
          setTimeout(() => {
            if (mountedRef.current) {
              setCardPulse(false);
            }
          }, 2000);
        } else {
          throw new Error(data.error || 'Failed to generate reading');
        }

      } catch (error) {
        console.error('Error fetching daily reading:', error);
        if (mountedRef.current) {
          setApiError(error.message || 'Failed to connect to cosmic energies');
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchDailyReading();
  }, [userData]);

  // Parse interpretation into sections
  const parseInterpretation = (interpretation) => {
    if (!interpretation) return [];

    const sections = [
      {
        id: 'reading',
        title: 'Card Reading',
        icon: '/static/icons/cards.svg',
        regex: /\[CARD_READING\](.*?)(?=\[|$)/s
      },
      {
        id: 'numerology',
        title: 'Numerology Insight',
        icon: '/static/icons/numbers.svg',
        regex: /\[NUMEROLOGY_INSIGHT\](.*?)(?=\[|$)/s
      },
      {
        id: 'affirmation',
        title: 'Daily Affirmation',
        icon: '/static/icons/heart.svg',
        regex: /\[DAILY_AFFIRMATION\](.*?)(?=\[|$)/s
      }
    ];

    return sections.map(section => {
      const match = interpretation.match(section.regex);
      return {
        ...section,
        content: match ? match[1].trim() : ''
      };
    }).filter(section => section.content);
  };

  // Handle chat start
  const handleStartChat = async () => {
    try {
      console.log('Starting chat session...');
      setChatOpen(true);
      
      // Implement chat interface
      // This could open a modal or navigate to chat view
      
    } catch (error) {
      console.error('Error starting chat:', error);
      setApiError('Failed to start chat. Please try again.');
    }
  };

  // Handle three-card reading
  const handleThreeCardReading = () => {
    console.log('Three-card reading requested');
    // Navigate to three-card reading flow
    // This would typically update parent component state
  };

  // Create background stars
  const createStars = () => {
    const stars = [];
    for (let i = 0; i < 50; i++) {
      const size = Math.random() * 3 + 1;
      const style = {
        width: `${size}px`,
        height: `${size}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${Math.random() * 2 + 2}s`
      };
      stars.push(
        React.createElement('div', {
          key: `star-${i}`,
          className: 'cosmic-star',
          style: style
        })
      );
    }
    return stars;
  };

  // Create floating orbs
  const createOrbs = () => {
    const orbs = [];
    for (let i = 0; i < 3; i++) {
      const style = {
        top: `${Math.random() * 80 + 10}%`,
        left: `${Math.random() * 80 + 10}%`,
        animationDelay: `${i * 2}s`,
        animationDuration: `${6 + i * 2}s`
      };
      orbs.push(
        React.createElement('div', {
          key: `orb-${i}`,
          className: 'cosmic-floating-orbs',
          style: style
        })
      );
    }
    return orbs;
  };

  // LOADING STATE
  if (loading) {
    return React.createElement('div', { className: 'cosmic-reading-wrapper' },
      // Background
      React.createElement('div', { className: 'cosmic-bg-stars' },
        ...createStars(),
        ...createOrbs()
      ),
      
      // Loading content
      React.createElement('div', { className: 'cosmic-reading-content' },
        React.createElement('div', { className: 'cosmic-loading-container' },
          React.createElement('div', { className: 'cosmic-loader' },
            React.createElement('div', { className: 'cosmic-loader-ring' }),
            React.createElement('div', { className: 'cosmic-loader-ring' }),
            React.createElement('div', { className: 'cosmic-loader-ring' }),
            React.createElement('div', { className: 'cosmic-loader-core' })
          ),
          React.createElement('div', { className: 'cosmic-loading-text' },
            'Consulting the cosmic energies...'
          ),
          React.createElement('div', { className: 'cosmic-loading-hint' },
            'Your personalized reading is being prepared'
          )
        )
      )
    );
  }

  // ERROR STATE
  if (apiError) {
    return React.createElement('div', { className: 'cosmic-reading-wrapper' },
      // Background
      React.createElement('div', { className: 'cosmic-bg-stars' },
        ...createStars()
      ),
      
      // Error content
      React.createElement('div', { className: 'cosmic-reading-content' },
        React.createElement('div', { className: 'cosmic-error-container' },
          React.createElement('div', { className: 'cosmic-error-card' },
            React.createElement('h2', { className: 'cosmic-error-title' },
              '✨ Cosmic Disruption ✨'
            ),
            React.createElement('p', { className: 'cosmic-error-message' },
              apiError
            ),
            React.createElement('button', {
              className: 'cosmic-btn cosmic-btn-error',
              onClick: () => {
                setApiError(null);
                setLoading(true);
                // Retry loading
                window.location.reload();
              }
            },
              'Try Again'
            )
          )
        )
      )
    );
  }

  // SUCCESS STATE - Display Reading
  if (readingData) {
    const sections = parseInterpretation(readingData.interpretation);
    const userName = userData.user_data&&name || userData.name || 'Cosmic Traveler';

    return React.createElement('div', { className: 'cosmic-reading-wrapper' },
      // Background
      React.createElement('div', { className: 'cosmic-bg-stars' },
        ...createStars(),
        ...createOrbs()
      ),

      // Main Content
      React.createElement('div', { className: 'cosmic-reading-content' },
        
        // Title
        React.createElement('h1', { className: 'cosmic-title-main' },
          `${userName}'s Daily Reading`
        ),

        // Card Showcase
        React.createElement('div', { className: 'cosmic-card-showcase' },
          React.createElement('div', {
            className: `cosmic-card-container ${cardPulse ? 'cosmic-card-glow' : ''}`
          },
            React.createElement('img', {
              src: readingData.cardImage,
              alt: readingData.cardName,
              className: `cosmic-card-image ${cardPulse ? 'cosmic-card-pulse' : ''}`,
              onError: (e) => {
                console.error('Image failed to load:', readingData.cardImage);
                e.target.src = '/static/images/cards/card-back.jpg';
              }
            })
          )
        ),

        // Card Name
        React.createElement('h2', {
          className: 'cosmic-section-title',
          style: { textAlign: 'center', marginBottom: '2rem' }
        },
          readingData.cardName
        ),

        // Sections Grid
        showSections && React.createElement('div', { className: 'cosmic-sections-grid' },
          ...sections.map((section, index) =>
            React.createElement('div', {
              key: section.id,
              className: 'cosmic-section-card'
            },
              // Section Header
              React.createElement('div', { className: 'cosmic-section-header' },
                React.createElement('img', {
                  src: section.icon,
                  alt: section.title,
                  className: 'cosmic-section-icon',
                  onError: (e) => {
                    e.target.style.display = 'none';
                  }
                }),
                React.createElement('h3', { className: 'cosmic-section-title' },
                  section.title
                )
              ),

              // Section Content
              React.createElement('div', { className: 'cosmic-section-content' },
                section.content
              )
            )
          )
        ),

        // Action Buttons
        showSections && React.createElement('div', { className: 'cosmic-actions-container' },
          
          // Chat Button
          React.createElement('button', {
            className: 'cosmic-btn cosmic-btn-primary',
            onClick: handleStartChat
          },
            '💬 Ask About Your Reading'
          ),

          // Three-Card Reading Button (Coming Soon)
          React.createElement('button', {
            className: 'cosmic-btn cosmic-btn-disabled',
            disabled: true
          },
            React.createElement('span', { className: 'cosmic-coming-soon-badge' },
              'COMING SOON'
            ),
            '🔮 Get Three-Card Reading'
          )
        ),

        // Instruction
        showSections && React.createElement('div', { className: 'cosmic-instruction' },
          '💡 Tap your NFC poster again tomorrow for a new reading'
        ),

        // Footer
        React.createElement('div', { className: 'cosmic-footer' },
          React.createElement('p', {},
            'Powered by ',
            React.createElement('a', {
              href: 'https://neoarcana.cloud',
              target: '_blank',
              rel: 'noopener noreferrer'
            },
              'NeoArcana'
            )
          ),
          readingData.cached && React.createElement('p', {
            style: { fontSize: '0.8rem', opacity: 0.5, marginTop: '0.5rem' }
          },
            '⚡ Cached reading from today'
          )
        )
      )
    );
  }

  // Fallback
  return React.createElement('div', { className: 'cosmic-reading-wrapper' },
    React.createElement('div', { className: 'cosmic-reading-content' },
      React.createElement('div', { className: 'cosmic-loading-container' },
        React.createElement('div', { className: 'cosmic-loading-text' },
          'Preparing your cosmic journey...'
        )
      )
    )
  );
};

// Export to global scope
window.NFCStep2 = NFCStep2;