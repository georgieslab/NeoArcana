// ========================================
// NEOARCANA - STEP 0 (LANDING PAGE - JSX)
// Beautiful, clean, modern! ✨
// ========================================

const Step0 = ({ onTryFree, onExplore, onPosterRegistration, onShowStory }) => {
  const [error, setError] = React.useState('');

  const handlePosterRegistration = () => {
    if (onPosterRegistration) {
      onPosterRegistration();
    }
  };

  const handleShowStory = () => {
    if (onShowStory) {
      onShowStory();
    }
  };

  return (
    <div className="cosmic-landing">
      <div className="cosmic-landing-inner">
        
        {/* Logo */}
        <img
          src="/static/images/logo.png"
          alt="NeoArcana Logo"
          className="cosmic-logo"
        />
        
        {/* Title */}
        <h1 className="cosmic-landing-title">
          NeoArcana
        </h1>
        
        {/* Subtitle */}
        <p className="cosmic-landing-subtitle">
          Where Ancient Wisdom Meets Modern Magic
        </p>
        
        {/* Buttons Container */}
        <div className="cosmic-buttons">
          
          {/* Primary Button - Try Free */}
          <button
            onClick={onTryFree}
            className="cosmic-button cosmic-button--primary cosmic-button--large"
          >
            ✨ Galactic Trial
          </button>
          
          {/* Secondary Button - Register Poster */}
          <button
            onClick={handlePosterRegistration}
            className="cosmic-button cosmic-button--secondary cosmic-button--large"
          >
            🎴 Register Poster
          </button>
          
          {/* Ghost Button - Story Behind */}
          <button
            onClick={handleShowStory}
            className="cosmic-button cosmic-button--ghost cosmic-button--large"
          >
            ✨ Story Behind
          </button>
        </div>

        {/* Error Message (if any) */}
        {error && (
          <div className="cosmic-error-message">
            {error}
          </div>
        )}
        
        {/* Footer Text */}
        <p className="cosmic-footer-text">
          made w/ 🪄 by{' '}
          <a
            href="https://instagram.com/georgieslab"
            target="_blank"
            rel="noopener noreferrer"
          >
            georgie
          </a>
          .
        </p>
      </div>
    </div>
  );
};

window.Step0 = Step0;