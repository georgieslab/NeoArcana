const PremiumCodeManager = ({ onCodeValidated }) => {
    const [code, setCode] = React.useState('');
    const [isChecking, setIsChecking] = React.useState(false);
    const [error, setError] = React.useState('');
    const [showInput, setShowInput] = React.useState(false);
  
    const validateCode = async (e) => {
      e.preventDefault();
      setIsChecking(true);
      setError('');
  
      try {
        const response = await fetch('/api/validate_premium_code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: code.trim() })
        });
  
        const data = await response.json();
  
        if (data.valid) {
          // Store premium status in localStorage
          localStorage.setItem('premiumCode', code.trim());
          localStorage.setItem('premiumExpiry', data.expiry);
          onCodeValidated(true);
          setShowInput(false);
        } else {
          setError('Invalid code. Please check and try again.');
        }
      } catch (error) {
        setError('Failed to validate code. Please try again.');
      } finally {
        setIsChecking(false);
      }
    };
  
    if (!showInput) {
      return (
        <button 
          onClick={() => setShowInput(true)}
          className="cosmic-button premium-activate"
        >
          💫 Activate Premium Code
        </button>
      );
    }
  
    return (
      <div className="premium-code-container">
        <form onSubmit={validateCode} className="premium-code-form">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your premium code"
            className="premium-code-input"
            disabled={isChecking}
          />
          <button 
            type="submit" 
            className="cosmic-button"
            disabled={isChecking || !code.trim()}
          >
            {isChecking ? "Validating..." : "Activate Premium"}
          </button>
        </form>
        {error && <div className="premium-code-error">{error}</div>}
        <button 
          onClick={() => setShowInput(false)}
          className="premium-code-cancel"
        >
          Cancel
        </button>
      </div>
    );
  };
  
  window.PremiumCodeManager = PremiumCodeManager;