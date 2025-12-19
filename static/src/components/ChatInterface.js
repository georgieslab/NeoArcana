// ========================================
// NEOARCANA - CHAT INTERFACE
// Fixed version with proper class names
// ========================================

const ChatInterface = ({ 
  name, 
  zodiacSign, 
  cardName, 
  reading, 
  onClose, 
  isPremium,
  language,
  cardInfo,
  chatHistory,
  onChatHistoryUpdate
}) => {
  // State management
  const [messages, setMessages] = React.useState(chatHistory || []);
  const [newMessage, setNewMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  const [sessionId, setSessionId] = React.useState(null);
  const messagesEndRef = React.useRef(null);
  const mountedRef = React.useRef(true);

  // Update parent component when messages change
  React.useEffect(() => {
    if (onChatHistoryUpdate) {
      onChatHistoryUpdate(messages);
    }
  }, [messages]);

  // Initialize chat session
  React.useEffect(() => {
    console.log('[ChatInterface] Initializing with language:', language);
    
    if (!chatHistory && mountedRef.current) {
      startChatSession();
    }

    return () => {
      console.log('[ChatInterface] Unmounting');
      mountedRef.current = false;
    };
  }, []);

  // Restart chat session if language changes
  React.useEffect(() => {
    console.log('[ChatInterface] Language changed to:', language);
    if (chatHistory) return; // Don't restart if we have history
    
    if (mountedRef.current) {
      startChatSession();
    }
  }, [language]);

  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const startChatSession = async () => {
    if (!mountedRef.current) return;
    console.log('[ChatInterface] Starting chat session with language:', language);
    setIsLoading(true);
    setIsTyping(true);
    
    try {
      const initialData = {
        name,
        zodiacSign,
        cardName,
        reading: reading || '',
        isPremium,
        language,
        cardInfo,
        nfc_id: null,
        maintainLanguage: true
      };

      console.log('[ChatInterface] Starting chat with data:', initialData);
      console.log('🚀 Starting chat session via FastAPI:', window.API_CONFIG.BASE_URL);
      
      const data = await window.API_CONFIG.post(
        window.API_CONFIG.ENDPOINTS.START_CHAT,
        initialData
      );
      
      console.log('✅ Chat session started:', data);
      
      if (data.session_id) {
        setSessionId(data.session_id);
      }

      if (mountedRef.current) {
        const initialMessage = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date().toISOString(),
          language: language
        };

        setMessages([initialMessage]);
      }

    } catch (error) {
      console.error('[ChatInterface] Chat initialization error:', error);
      if (mountedRef.current) {
        setMessages([{
          role: 'error',
          content: error.message || 'Unable to connect to your guide. Please try again later.',
          language: language
        }]);
      }
    } finally {
      if (mountedRef.current) {
        setIsTyping(false);
        setIsLoading(false);
      }
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      language: language
    };

    if (mountedRef.current) {
      setNewMessage('');
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
      setIsTyping(true);
    }

    try {
      const chatData = {
        message: userMessage.content,
        name,
        zodiacSign,
        cardName,
        reading: reading || '',
        isPremium,
        language,
        cardInfo,
        nfc_id: null,
        messageHistory: messages.map(msg => ({
          ...msg,
          language
        })),
        sessionId,
        maintainLanguage: true
      };

      console.log('[ChatInterface] Sending chat message:', chatData);
      console.log('💬 Sending message to FastAPI:', window.API_CONFIG.BASE_URL);
      
      const data = await window.API_CONFIG.post(
        window.API_CONFIG.ENDPOINTS.CHAT,
        chatData
      );
      
      console.log('✅ Chat response received:', data);

      if (mountedRef.current) {
        const assistantMessage = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date().toISOString(),
          language: language
        };

        setMessages(prev => [...prev, assistantMessage]);
      }

    } catch (error) {
      console.error('[ChatInterface] Message sending error:', error);
      if (mountedRef.current) {
        setMessages(prev => [...prev, {
          role: 'error',
          content: error.message || 'Message failed to send. Please try again.',
          language: language
        }]);
      }
    } finally {
      if (mountedRef.current) {
        setIsTyping(false);
        setIsLoading(false);
      }
    }
  };

  return React.createElement('div', {
    className: 'neo-chat',
    'data-language': language
  },
    // Header
    React.createElement('div', { className: 'neo-chat-header' },
      React.createElement('div', { className: 'neo-chat-header-content' },
        React.createElement('img', {
          src: '/static/icons/eye.svg',
          alt: '',
          className: 'neo-chat-header-icon'
        }),
        React.createElement('h2', { className: 'neo-chat-title' }, 
          'Discuss Your Reading'
        )
      ),
      React.createElement('button', {
        onClick: onClose,
        className: 'neo-chat-close',
        'aria-label': 'Close chat'
      }, '×')
    ),

    // Messages Container
    React.createElement('div', { className: 'neo-chat-messages' },
      // Messages
      messages.map((msg, index) =>
        React.createElement('div', {
          key: index,
          className: `neo-chat-message neo-chat-message--${msg.role} ${
            index === messages.length - 1 ? 'neo-chat-message--fade-in' : ''
          }`
        },
          React.createElement('div', { className: 'neo-chat-message-content' },
            msg.role === 'assistant' && React.createElement('img', {
              src: '/static/icons/eye.svg',
              alt: '',
              className: 'neo-chat-message-icon'
            }),
            msg.content
          )
        )
      ),

      // Typing Indicator
      isTyping && React.createElement('div', {
        className: 'neo-chat-message neo-chat-message--assistant neo-chat-message--typing'
      },
        React.createElement('div', { className: 'neo-chat-typing-indicator' },
          React.createElement('span'),
          React.createElement('span'),
          React.createElement('span')
        )
      ),

      // Scroll anchor
      React.createElement('div', { ref: messagesEndRef })
    ),

    // Input Form
    React.createElement('form', {
      onSubmit: sendMessage,
      className: 'neo-chat-form'
    },
      React.createElement('input', {
        type: 'text',
        value: newMessage,
        onChange: (e) => setNewMessage(e.target.value),
        placeholder: 'Ask about your reading...',
        disabled: isLoading,
        className: 'neo-chat-input',
        lang: language,
        'aria-label': 'Chat message'
      }),
      React.createElement('button', {
        type: 'submit',
        disabled: isLoading || !newMessage.trim(),
        className: 'neo-chat-submit',
        'aria-label': 'Send message'
      },
        React.createElement('img', {
          src: '/static/icons/send.svg',
          alt: 'Send',
          className: 'neo-chat-submit-icon'
        })
      )
    )
  );
};

window.ChatInterface = ChatInterface;