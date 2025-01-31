const Step4 = ({ onSignup, onClose, email, setEmail }) => {
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignup(email);
    setIsSubmitted(true);
  };

  return (
    <div className="modal-content step4-container">
      <h2 className="title cosmic-text">Unlock the Mysteries of the Cosmos</h2>
      <div className="text-container">
        <p className="cosmic-message">
          Dive into your own cosmic narrative with our tailored tarot readings. Subscribe now for an enlightening journey through the stars—only €2.99 for three months. Discover profound insights and celestial guidance, meticulously crafted by the cosmos, and personalized just for you. Begin your mystical adventure today; the universe awaits.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="cosmic-form">
        <div className="input-container">
          <img src="/static/icons/email.svg" alt="Email" className="input-icon" />
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="cosmic-input"
            disabled={isSubmitted}
          />
        </div>
        <button 
          type="submit" 
          className="cosmic-glassy-button2"
          disabled={isSubmitted}
        >
          {isSubmitted ? 'Welcome Aboard!' : 'Join the Cosmic Voyage'}
        </button>
      </form>
      <button onClick={onClose} className="close-button">
        <img src="/static/icons/close.svg" alt="Close" />
      </button>
    </div>
  );
};

window.Step4 = Step4;
