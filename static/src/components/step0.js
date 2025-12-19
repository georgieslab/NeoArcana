// ========================================
// NEOARCANA - STEP 0 (LANDING PAGE)
// Updated with Story Behind handler
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

  return React.createElement("div", { className: "cosmic-landing" },
    React.createElement("div", { className: "cosmic-landing-inner" },
      
      // Logo
      React.createElement("img", {
        src: "/static/images/logo.png",
        alt: "NeoArcana Logo",
        className: "cosmic-logo"
      }),
      
      // Title
      React.createElement("h1", { 
        className: "cosmic-landing-title" 
      }, "NeoArcana"),
      
      // Subtitle
      React.createElement("p", { 
        className: "cosmic-landing-subtitle" 
      }, "Where Ancient Wisdom Meets Modern Magic"),
      
      // Buttons Container
      React.createElement("div", { className: "cosmic-buttons" },
        // Primary Button - Try Free
        React.createElement("button", {
          onClick: onTryFree,
          className: "cosmic-button cosmic-button--primary cosmic-button--large"
        }, "✨ Galactic Trial"),
        
        // Secondary Button - Register Poster
        React.createElement("button", {
          onClick: handlePosterRegistration,
          className: "cosmic-button cosmic-button--secondary cosmic-button--large"
        }, "🎴 Register Poster"),
        
        // Ghost Button - Story Behind (NOW WORKS!)
        React.createElement("button", {
          onClick: handleShowStory,
          className: "cosmic-button cosmic-button--ghost cosmic-button--large"
        }, "✨ Story Behind")
      ),

      // Error Message (if any)
      error && React.createElement("div", { 
        className: "cosmic-error-message" 
      }, error),
      
      // Footer Text
      React.createElement("p", { className: "cosmic-footer-text" },
        "made w/ 🪄 by ",
        React.createElement("a", {
          href: "https://instagram.com/georgieslab",
          target: "_blank",
          rel: "noopener noreferrer"
        }, "georgie"),
        "."
      )
    )
  );
};

window.Step0 = Step0;