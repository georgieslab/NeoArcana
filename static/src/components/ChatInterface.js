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
  // Modify the messages state to use chat history if available
  const [messages, setMessages] = React.useState(chatHistory || []);

  // Update parent component when messages change
  React.useEffect(() => {
    if (onChatHistoryUpdate) {
      onChatHistoryUpdate(messages);
    }
  }, [messages]);

  // Only start chat session if there's no chat history
  React.useEffect(() => {
    if (!chatHistory && mountedRef.current) {
      startChatSession();
    }
  }, []);
  const [newMessage, setNewMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  const [sessionId, setSessionId] = React.useState(null);
  const messagesEndRef = React.useRef(null);
  const mountedRef = React.useRef(true);


  React.useEffect(() => {
    console.log('[ChatInterface] Initializing with language:', language);
    
    // Start chat session only once when component mounts
    if (mountedRef.current) {
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
    if (mountedRef.current) {
      startChatSession();
    }
  }, [language]);

  const handleAPIError = async (response) => {
    const contentType = response.headers.get("content-type");
    if (!response.ok) {
      try {
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          console.error('[ChatInterface] API Error Details:', errorData);
          throw new Error(errorData.error || 'Failed to communicate with guide');
        } else {
          const textError = await response.text();
          console.error('[ChatInterface] API Error Text:', textError);
          throw new Error('Server error - please try again later');
        }
      } catch (error) {
        console.error('[ChatInterface] Error parsing API response:', error);
        throw error;
      }
    }
    
    try {
      return await response.json();
    } catch (error) {
      console.error('[ChatInterface] Error parsing success response:', error);
      throw new Error('Invalid response format');
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
        maintainLanguage: true
      };

      console.log('[ChatInterface] Starting chat with data:', initialData);

      const response = await fetch('/api/start_chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Accept-Language': language,
          'X-Chat-Language': language
        },
        body: JSON.stringify(initialData)
      });

      const data = await handleAPIError(response);
      console.log('[ChatInterface] Chat session started:', data);
      
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
        messageHistory: messages.map(msg => ({
          ...msg,
          language
        })),
        sessionId,
        maintainLanguage: true
      };

      console.log('[ChatInterface] Sending chat message:', chatData);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Accept-Language': language,
          'X-Chat-Language': language
        },
        body: JSON.stringify(chatData)
      });

      const data = await handleAPIError(response);
      console.log('[ChatInterface] Received chat response:', data);

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

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="cosmic-chat" data-language={language}>
      <div className="cosmic-chat__header">
        <h2 className="cosmic-chat__title">Discuss Your Reading</h2>
        <button onClick={onClose} className="cosmic-chat__close">×</button>
      </div>

      <div className="cosmic-chat__messages">
        {messages.map((msg, index) => (
          <div 
            key={index}
            className={`cosmic-chat__message cosmic-chat__message--${msg.role} ${
              index === messages.length - 1 ? 'cosmic-chat__message--fade-in' : ''
            }`}
          >
            <div className="cosmic-chat__message-content">
              {msg.role === 'assistant' && (
                <img src="/static/icons/eye.svg" alt="" className="cosmic-chat__icon" />
              )}
              {msg.content}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="cosmic-chat__message cosmic-chat__message--typing">
            <div className="cosmic-chat__typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="cosmic-chat__form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ask about your reading..."
          disabled={isLoading}
          className="cosmic-chat__input"
          lang={language}
        />
        <button 
          type="submit"
          disabled={isLoading || !newMessage.trim()}
          className="cosmic-chat__submit"
        >
          <img src="/static/icons/send.svg" alt="Send" className="cosmic-chat__submit-icon" />
        </button>
      </form>
    </div>
  );
};

window.ChatInterface = ChatInterface;