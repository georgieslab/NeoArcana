// ========================================
// NEOARCANA - STORY BEHIND PAGE
// ========================================

const StoryBehind = ({ onBack }) => {
  return React.createElement("div", { className: "story-container" },
    React.createElement("div", { className: "story-inner" },
      
      // Close Button
      React.createElement("button", {
        onClick: onBack,
        className: "story-close-button",
        "aria-label": "Close"
      }, "×"),
      
      // Logo
      React.createElement("img", {
        src: "/static/images/logo.png",
        alt: "NeoArcana Logo",
        className: "story-logo"
      }),
      
      // Title
      React.createElement("h1", { className: "story-title" },
        "The Story Behind NeoArcana"
      ),
      
      // Story Content
      React.createElement("div", { className: "story-content" },
        
        React.createElement("section", { className: "story-section" },
          React.createElement("h2", null, "🌟 The Vision"),
          React.createElement("p", null,
            "NeoArcana was born from a simple question: What if ancient tarot wisdom could meet cutting-edge AI technology?"
          )
        ),
        
        React.createElement("section", { className: "story-section" },
          React.createElement("h2", null, "✨ The Magic"),
          React.createElement("p", null,
            "By combining traditional tarot symbolism with Claude AI, we create deeply personalized readings that honor both mysticism and modernity."
          )
        ),
        
        React.createElement("section", { className: "story-section" },
          React.createElement("h2", null, "🎴 The Innovation"),
          React.createElement("p", null,
            "NFC-enabled posters bridge physical and digital worlds - tap your phone to unlock your cosmic connection."
          )
        ),
        
        React.createElement("section", { className: "story-section" },
          React.createElement("h2", null, "🌈 The Creator"),
          React.createElement("p", null,
            "Made with 🪄 by ",
            React.createElement("a", {
              href: "https://instagram.com/georgieslab",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "story-link"
            }, "georgie"),
            " - a designer exploring the intersection of spirituality and technology."
          )
        ),
        
        React.createElement("section", { className: "story-section" },
          React.createElement("h2", null, "💫 The Mission"),
          React.createElement("p", null,
            "To make spiritual guidance accessible, personalized, and beautiful - one cosmic reading at a time."
          )
        )
      ),
      
      // Back Button
      React.createElement(CosmicButton, {
        onClick: onBack,
        variant: "primary",
        className: "story-back-button"
      }, "Back to Home")
    )
  );
};

window.StoryBehind = StoryBehind;