const PremiumOverlay = ({ onClose, onSubscribe, currentFeature = null }) => {
  const [fadeIn, setFadeIn] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState('monthly');

  React.useEffect(() => {
    setFadeIn(true);
  }, []);

  const features = {
    chat: {
      title: "Unlimited Chat Access",
      description: "Dive deeper into your readings with unlimited AI-powered conversations"
    },
    threeCard: {
      title: "Three Card Readings",
      description: "Unlock deeper insights with past, present, and future spreads"
    },
    default: {
      title: "Unlock Premium Features",
      description: "Enhance your cosmic journey with premium insights"
    }
  };

  const currentFeatureInfo = features[currentFeature] || features.default;

  return (
    <div className={`premium-overlay ${fadeIn ? 'fade-in' : ''}`}>
      <div className="premium-content">
        <button onClick={onClose} className="close-button">
          <img src="/static/icons/close.svg" alt="Close" />
        </button>
        
        <div className="premium-header">
          <div className="premium-badge">✨ Premium</div>
          <h2>{currentFeatureInfo.title}</h2>
          <p className="premium-subtitle">{currentFeatureInfo.description}</p>
        </div>

        <div className="premium-plans">
          <div 
            className={`plan-option ${selectedPlan === 'monthly' ? 'selected' : ''}`}
            onClick={() => setSelectedPlan('monthly')}
          >
            <div className="plan-price">$4.99</div>
            <div className="plan-interval">per month</div>
          </div>
          <div 
            className={`plan-option ${selectedPlan === 'yearly' ? 'selected' : ''}`}
            onClick={() => setSelectedPlan('yearly')}
          >
            <div className="popular-badge">SAVE 20%</div>
            <div className="plan-price">$47.88</div>
            <div className="plan-interval">per year</div>
          </div>
        </div>

        <div className="premium-features">
          <div className="feature-item">
            <img src="/static/icons/chat.svg" alt="Chat" className="feature-icon" />
            <div className="feature-text">
              <h3>Unlimited AI Chat</h3>
              <p>Deep dive into your readings with no limits</p>
            </div>
          </div>

          <div className="feature-item">
            <img src="/static/icons/star.svg" alt="Readings" className="feature-icon" />
            <div className="feature-text">
              <h3>Three Card Spreads</h3>
              <p>Past, Present & Future insights</p>
            </div>
          </div>

          <div className="feature-item">
            <img src="/static/icons/lucky.svg" alt="History" className="feature-icon" />
            <div className="feature-text">
              <h3>Reading History</h3>
              <p>Access your past readings anytime</p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => onSubscribe(selectedPlan)} 
          className="subscribe-button"
        >
          Start {selectedPlan === 'monthly' ? 'Monthly' : 'Annual'} Premium
        </button>

        <div className="premium-guarantees">
          <div className="guarantee-item">
            <img src="/static/icons/star.svg" alt="Guarantee" className="guarantee-icon" />
            7-day money-back guarantee
          </div>
          <div className="guarantee-item">
            <img src="/static/icons/star.svg" alt="Cancel" className="guarantee-icon" />
            Cancel anytime
          </div>
        </div>
      </div>
    </div>
  );
};

window.PremiumOverlay = PremiumOverlay;