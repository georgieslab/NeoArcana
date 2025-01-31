const PremiumFeatures = ({ reading, onStartChat, onClose }) => {
    const [isRedirecting, setIsRedirecting] = React.useState(false);
    
    const handleGetPremium = () => {
      setIsRedirecting(true);
      // Redirect to Wix subscription page
      window.location.href = `${process.env.WIX_SITE_URL}/premium-subscription`;
    };
    
    return (
      <div className="premium-overlay">
        <div className="premium-content">
          <h2>Unlock Premium Features</h2>
          
          <div className="premium-features">
            <div className="feature">
              <img src="/static/icons/chat.svg" alt="Chat" />
              <h3>Interactive Chat</h3>
              <p>Discuss your reading in detail with AI-powered insights</p>
            </div>
            
            <div className="feature">
              <img src="/static/icons/history.svg" alt="History" />
              <h3>Reading History</h3>
              <p>Access all your past readings and insights</p>
            </div>
            
            <div className="feature">
              <img src="/static/icons/insights.svg" alt="Insights" />
              <h3>Deep Insights</h3>
              <p>Get personalized interpretations based on your profile</p>
            </div>
          </div>
          
          <div className="premium-actions">
            <button 
              onClick={handleGetPremium}
              className="cosmic-button premium-button"
              disabled={isRedirecting}
            >
              {isRedirecting ? 'Redirecting...' : 'Get Premium Access'}
            </button>
            
            <button 
              onClick={onClose}
              className="cosmic-button secondary"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Add to window object for global access
  window.PremiumFeatures = PremiumFeatures;