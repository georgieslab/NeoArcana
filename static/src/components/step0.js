const Step0 = ({ onTryFree, onExplore, onPosterRegistration }) => {
  const [error, setError] = React.useState('');

  const handlePosterRegistration = () => {
    // Instead of redirecting, call the prop function to trigger registration flow
    if (onPosterRegistration) {
      onPosterRegistration();
    }
  };

  return React.createElement("div", { className: "cosmic-landing" },
    React.createElement("div", { className: "cosmic-landing-inner" },
      React.createElement("h1", {
        className: "title cosmic-gradient cosmic-text"
      }, "NeoArcana"),
      React.createElement("img", {
        src: "/static/images/logo.png",
        alt: "Logo",
        className: "cosmic-logo"
      }),
      
      React.createElement("div", { className: "cosmic-buttons" },
        React.createElement(React.Fragment, null,
          React.createElement("button", {
            onClick: onTryFree,
            className: "cosmic-glassy-button3"
          }, "Galactic Trial"),
          
          React.createElement("button", {
            onClick: handlePosterRegistration,
            className: "cosmic-glassy-button4 cosmic-nfc-button"
          }, "Register Poster"),
          
          React.createElement("button", {
            onClick: () => window.open('https://www.neoarcana.cloud', '_blank'),
            className: "cosmic-glassy-button2"
          }, "Story Behind ✨")
        ),

        error && React.createElement("div", { className: "cosmic-error" }, error)
      ),
      
      // Footer text moved outside of modal and buttons
      React.createElement("p", {
        className: "cosmic-footer-text",
        style: {
          textAlign: "center",
          fontSize: "0.9rem",
          marginTop: "2rem",
          opacity: "0.8"
        }
      }, [
        "made w/ 🪄 by ",
        React.createElement("a", {
          href: "https://instagram.com/georgieslab",
          target: "_blank",
          rel: "noopener noreferrer",
          style: {
            color: "inherit",
            textDecoration: "underline",
            cursor: "pointer"
          }
        }, "georgie"),
        "."
      ])
    ),
    
  );
};

window.Step0 = Step0;