import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { renderFormattedParagraphs } from '../utils/textFormatter';

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

  const quickPrompts = isKa ? [
    '✨ რა არის ამ გაშლის მთავარი გაკვეთილი?',
    '🔮 როგორ უკავშირდება ეს კარტები ერთმანეთს?',
    '⚡ რა დაფარულ დაბრკოლებას უნდა მივაქციო ყურადღება?',
    '🌟 როგორ მოვიდე საუკეთესო ჰარმონიაში მომავლის კარტთან?',
  ] : [
    '✨ What is the core lesson of this spread?',
    '🔮 How do these cards connect with each other?',
    '⚡ What hidden blockage should I be mindful of?',
    '🌟 How can I best align with the Future card?',
  ];

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
            `Greetings, ${name} of the cosmos! ✨ I am your sacred Tarot Oracle. Your arcana (${cardName}) have opened a portal—what questions echo in your spirit?`;

          setMessages([
            {
              role: 'assistant',
              content: welcomeText,
            },
          ]);
        }
      } catch (err) {
        console.warn('Chat init error:', err);
        if (isSubscribed) {
          setMessages([
            {
              role: 'assistant',
              content: `Greetings, ${name}! The stars are listening. What wisdom or clarification do you seek from your reading today?`,
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

    const userMsg = { role: 'user', content: textToSend.trim() };
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
          { role: 'assistant', content: data.response },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'The cosmic frequencies shift quietly... Trust your inner heart for the revelation.',
          },
        ]);
      }
    } catch (err) {
      console.error('Send message error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'The connection with the ether briefly rippled. Ask again and the cosmos will speak.',
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
        {/* Chat Header */}
        <div className="neo-chat-header">
          <div className="neo-chat-header-info">
            <span className="neo-chat-avatar">🔮</span>
            <div>
              <h2 id="chat-title" className="neo-chat-title">
                Talk to the Universe
              </h2>
              <p className="neo-chat-subtitle">
                <span>Oracle tuned to <strong>{name}</strong></span>
                {zodiacSign && <span>• {zodiacSign}</span>}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="neo-chat-close-btn"
            type="button"
            aria-label="Close chat"
          >
            ✕
          </button>
        </div>

        {/* Spread Attunement Bar */}
        <div className="neo-chat-attunement-bar">
          <span>🎴</span>
          <span>
            Attuned Spread: <strong>{cardName}</strong>
            {focusArea ? ` • Focus: ${focusArea}` : ''}
          </span>
        </div>

        {/* Message Stream */}
        <div className="neo-chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`neo-chat-bubble-wrapper ${
                msg.role === 'user' ? 'user-message' : 'bot-message'
              }`}
            >
              {msg.role === 'assistant' && (
                <span className="neo-chat-msg-avatar">🌌</span>
              )}
              <div className="neo-chat-bubble">
                {renderFormattedParagraphs(msg.content, 'neo-chat-para')}
              </div>
            </div>
          ))}

          {/* Typing Animation */}
          {isLoading && (
            <div className="neo-chat-bubble-wrapper bot-message">
              <span className="neo-chat-msg-avatar">🌌</span>
              <div className="neo-chat-bubble typing-indicator">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        {messages.length <= 3 && !isLoading && (
          <div className="neo-chat-chips">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                className="neo-chat-chip"
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="neo-chat-input-form"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isKa ? "დაუსვით თქვენი შეკითხვა კოსმოსს..." : "Whisper your question to the cosmos..."}
            disabled={isLoading}
            className="neo-chat-input"
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="neo-chat-submit-btn"
            aria-label="Send inquiry"
          >
            ➔
          </button>
        </form>
      </div>
    </div>
  );
}