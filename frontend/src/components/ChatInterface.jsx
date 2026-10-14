import { useState, useEffect, useRef, useMemo } from 'react';
import api from '../services/api';
import { renderFormattedParagraphs } from '../utils/textFormatter';
import soundManager from '../services/sound';

/* --- Handcrafted Celestial SVG Icons --- */
const OracleSigil = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.4" />
    <circle cx="12" cy="12" r="4.5" stroke="#f4a261" strokeWidth="2" />
    <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22" stroke="#a59ad1" strokeWidth="2" />
    <circle cx="12" cy="12" r="1.5" fill="#ffd700" />
  </svg>
);

const OracleBotBadge = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

const UserBadge = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const CardDeckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="13" height="16" rx="2" />
    <path d="M8 2h10a2 2 0 0 1 2 2v14" />
  </svg>
);

const SparkleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

const EyeIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const CompassIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const LinkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

export default function ChatInterface({
  name = 'Seeker',
  zodiacSign = '',
  focusArea = '',
  reading = '',
  cardName = 'Three Sacred Cards',
  language = 'en',
  onClose,
}) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const isKa = language === 'ka';

  // Parse card names into clean badges
  const cardNamesList = useMemo(() => {
    if (typeof cardName === 'string' && cardName.includes(',')) {
      return cardName.split(',').map((c) => c.trim()).filter(Boolean);
    }
    return cardName ? [cardName] : [];
  }, [cardName]);

  const quickPrompts = useMemo(() => {
    if (isKa) {
      return [
        { id: 'lesson', text: 'რა არის ამ გაშლის მთავარი გაკვეთილი?', icon: <SparkleIcon /> },
        { id: 'connection', text: 'როგორ უკავშირდება ეს კარტები ერთმანეთს?', icon: <LinkIcon /> },
        { id: 'blockage', text: 'რა დაფარულ დაბრკოლებას მივაქციო ყურადღება?', icon: <EyeIcon /> },
        { id: 'future', text: 'როგორ მოვიდე ჰარმონიაში მომავალთან?', icon: <CompassIcon /> },
      ];
    }
    return [
      { id: 'lesson', text: 'What is the core lesson of this spread?', icon: <SparkleIcon /> },
      { id: 'connection', text: 'How do these cards intertwine?', icon: <LinkIcon /> },
      { id: 'blockage', text: 'What hidden blockages should I look out for?', icon: <EyeIcon /> },
      { id: 'future', text: 'How can I best align with the Future card?', icon: <CompassIcon /> },
    ];
  }, [isKa]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Initialize chat session on mount
  useEffect(() => {
    let isSubscribed = true;

    async function initSession() {
      setIsLoading(true);
      try {
        const data = await api.startChat({
          name,
          zodiacSign,
          cardName: cardName || 'Three Sacred Cards',
          reading: typeof reading === 'string' ? reading : JSON.stringify(reading),
          language,
        });

        if (isSubscribed) {
          const sid = data?.session_id || data?.sessionId;
          if (sid) setSessionId(sid);

          const welcomeText =
            data?.response ||
            data?.initialMessage ||
            `Greetings, ${name}. The ethereal gateway is open, attuned to your ${cardName || 'Sacred Arcana'}. What truth or guidance calls to your soul today?`;

          setMessages([
            {
              role: 'assistant',
              content: welcomeText,
              time: 'Just now',
            },
          ]);
          soundManager.playCelestialChime();
        }
      } catch (err) {
        console.warn('Chat init error:', err);
        if (isSubscribed) {
          setMessages([
            {
              role: 'assistant',
              content: `Greetings, ${name}. The cosmos is listening. What guidance or clarification do you seek from your sacred cards?`,
              time: 'Just now',
            },
          ]);
        }
      } finally {
        if (isSubscribed) setIsLoading(false);
      }
    }

    initSession();

    return () => {
      isSubscribed = false;
    };
  }, [name, zodiacSign, reading, cardName, language]);

  const handleSend = async (messageText) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    soundManager.playStarSparkle();

    const userMsg = { role: 'user', content: textToSend.trim(), time: 'Just now' };
    const currentHistory = [...messages, userMsg];
    setMessages(currentHistory);
    setInputMessage('');
    setIsLoading(true);

    try {
      const data = await api.sendMessage({
        message: textToSend.trim(),
        sessionId,
        name,
        zodiacSign,
        reading: typeof reading === 'string' ? reading : JSON.stringify(reading),
        cardName,
        language,
        messageHistory: currentHistory,
      });

      if (data?.response) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.response, time: 'Just now' },
        ]);
        soundManager.playCelestialChime();
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'The cosmic frequencies shimmer quietly... Meditate upon your inner compass for the revelation.',
            time: 'Just now',
          },
        ]);
      }
    } catch (err) {
      console.error('Send message error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'A momentary ripple passed through the astral ether. Whisper once more and the cosmos will speak.',
          time: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="neo-chat-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-title"
    >
      <div className="neo-chat-modal" onClick={(e) => e.stopPropagation()}>
        {/* Luminous Top Glow Aura */}
        <div className="neo-chat-ambient-aura" />

        {/* Chat Header */}
        <header className="neo-chat-header">
          <div className="neo-chat-header-info">
            <div className="neo-chat-sigil-bezel">
              <span className="sigil-glow" />
              <OracleSigil />
            </div>

            <div className="neo-chat-title-group">
              <h2 id="chat-title" className="neo-chat-title">
                {isKa ? 'კოსმიური ორაკული' : 'Celestial Oracle'}
              </h2>
              <div className="neo-chat-subtitle">
                <span className="neo-beacon-pulse" aria-hidden="true" />
                <span className="neo-subtitle-text">
                  {isKa ? 'მორგებულია:' : 'Tuned to'}{' '}
                  <strong>{name}</strong>
                  {zodiacSign && <span className="subtitle-sep">• {zodiacSign}</span>}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="neo-chat-close-btn"
            type="button"
            aria-label={isKa ? 'დახურვა' : 'Close oracle chat'}
            title={isKa ? 'დახურვა' : 'Close (Esc)'}
          >
            <CloseIcon />
          </button>
        </header>

        {/* Attunement Cards Ribbon */}
        <div className="neo-chat-attunement-bar">
          <div className="attunement-label">
            <CardDeckIcon />
            <span>{isKa ? 'გაშლა:' : 'Attuned Cards:'}</span>
          </div>

          <div className="attunement-tags-wrap">
            {cardNamesList.map((cName, idx) => (
              <span key={idx} className="neo-chat-card-tag">
                <span className="card-tag-star">✦</span>
                <span className="card-tag-name">{cName}</span>
              </span>
            ))}

            {focusArea && (
              <span className="neo-chat-focus-tag">
                <span className="focus-tag-dot">•</span>
                <span>{focusArea}</span>
              </span>
            )}
          </div>
        </div>

        {/* Message Stream */}
        <div className="neo-chat-messages">
          {messages.map((msg, index) => {
            const isBot = msg.role === 'assistant';
            return (
              <div
                key={index}
                className={`neo-chat-msg-row ${isBot ? 'bot-row' : 'user-row'}`}
              >
                {/* Meta Tag Above Bubble */}
                <div className="neo-chat-msg-meta">
                  <span className="msg-meta-author">
                    {isBot ? (
                      <>
                        <OracleBotBadge />
                        <span>ORACLE</span>
                      </>
                    ) : (
                      <>
                        <UserBadge />
                        <span>SEEKER</span>
                      </>
                    )}
                  </span>
                  {msg.time && <span className="msg-meta-time">{msg.time}</span>}
                </div>

                {/* Bubble Container */}
                <div className={`neo-chat-bubble ${isBot ? 'bot-bubble' : 'user-bubble'}`}>
                  {renderFormattedParagraphs(msg.content, 'neo-chat-para')}
                </div>
              </div>
            );
          })}

          {/* Ethereal Oracle Typing Indicator */}
          {isLoading && (
            <div className="neo-chat-msg-row bot-row">
              <div className="neo-chat-msg-meta">
                <span className="msg-meta-author">
                  <OracleBotBadge />
                  <span>ORACLE</span>
                </span>
                <span className="msg-meta-time">channeling</span>
              </div>

              <div className="neo-chat-bubble bot-bubble neo-chat-typing-bubble">
                <div className="neo-chat-typing-dots">
                  <span className="neo-typing-dot" />
                  <span className="neo-typing-dot" />
                  <span className="neo-typing-dot" />
                </div>
                <span className="neo-typing-caption">
                  {isKa ? 'კოსმოსიდან პასუხის მიღება...' : 'Consulting sacred arcana...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        {messages.length <= 4 && !isLoading && (
          <div className="neo-chat-chips-container">
            <div className="neo-chat-chips-scroll">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt.id}
                  type="button"
                  className="neo-chat-chip"
                  onClick={() => handleSend(prompt.text)}
                  disabled={isLoading}
                >
                  <span className="chip-ico">{prompt.icon}</span>
                  <span className="chip-text">{prompt.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Luxury Glass Input Dock */}
        <footer className="neo-chat-dock">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="neo-chat-input-pill"
          >
            <span className="input-spark-icon">
              <SparkleIcon />
            </span>

            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                isKa
                  ? 'დაუსვით შეკითხვა თქვენს არკანას...'
                  : 'Whisper your inquiry to the sacred cards...'
              }
              disabled={isLoading}
              className="neo-chat-input-field"
            />

            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="neo-chat-send-btn"
              aria-label={isKa ? 'გაგზავნა' : 'Send inquiry'}
              title={isKa ? 'გაგზავნა' : 'Send'}
            >
              <SendIcon />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
}