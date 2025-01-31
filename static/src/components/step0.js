const Step0 = ({ onTryFree, onSignUpPro, onExplore }) => {
  const [hideOtherButtons, setHideOtherButtons] = React.useState(false);
  const [showPromoCode, setShowPromoCode] = React.useState(false);
  const [promoCode, setPromoCode] = React.useState('');
  const [validationAnimation, setValidationAnimation] = React.useState(null);
  const [error, setError] = React.useState('');
  const [isValidating, setIsValidating] = React.useState(false);
  const [showLearnMore, setShowLearnMore] = React.useState(false);

  const validateAndProceed = (e) => {
    e.preventDefault();
    setIsValidating(true);
    setError('');
    
    setTimeout(() => {
      if (promoCode.trim() === 'Universeis30!') {
        setValidationAnimation('success');
        setTimeout(() => onTryFree(true), 1500);
      } else {
        setValidationAnimation('error');
        setError('Invalid promo code');
        setIsValidating(false);
      }
    }, 1000);
  };

  const handleDailyReadingClick = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const nfcId = urlParams.get('id');
    const posterCode = urlParams.get('posterCode');
    
    if (posterCode) {
      // If there's a poster code, redirect to registration
      window.location.href = `/nfc?posterCode=${posterCode}`;
    } else if (nfcId) {
      // If there's an NFC ID, proceed to daily reading
      onExplore();
    } else {
      // If neither exists, show registration instruction
      setError("Scan your poster's QR code to register your NFC tag");
      setTimeout(() => setError(''), 3000); // Clear error after 3 seconds
    }
  };

  return React.createElement("div", { className: "cosmic-landing" },
    React.createElement("div", { className: "cosmic-landing-inner" },
      React.createElement("img", {
        src: "/static/images/logo.png",
        alt: "Logo",
        className: "cosmic-logo"
      }),
      
      React.createElement("div", { className: "cosmic-buttons" },
        !hideOtherButtons && React.createElement(React.Fragment, null,
          React.createElement("button", {
            onClick: () => onTryFree(false),
            className: "cosmic-glassy-button3"
          }, "Galactic Trial"),
          
          React.createElement("button", {
            onClick: () => {
              setShowPromoCode(true);
              setHideOtherButtons(true);
            },
            className: "cosmic-glassy-button1"
          }, "Access Pro"),
          
          React.createElement("button", {
            onClick: handleDailyReadingClick,
            className: "cosmic-glassy-button4 cosmic-nfc-button"
          }, window.location.search.includes('posterCode') ? "Register NFC" : "Daily Reading"),
          
          React.createElement("button", {
            onClick: () => setShowLearnMore(true),
            className: "cosmic-glassy-button2"
          }, "Why Get Premium?")
        ),

        error && React.createElement("div", { className: "cosmic-error" }, error),

        showPromoCode && React.createElement("form", {
          onSubmit: validateAndProceed,
          className: `cosmic-promo-form ${validationAnimation || ''}`
        },
          React.createElement("input", {
            type: "text",
            value: promoCode,
            onChange: (e) => setPromoCode(e.target.value),
            placeholder: "Enter your promo code",
            className: `cosmic-promo-input ${error ? 'error' : ''}`,
            disabled: isValidating,
            autoComplete: "off",
            spellCheck: "false"
          }),
          React.createElement("button", {
            type: "submit",
            className: "cosmic-glassy-button1",
            disabled: isValidating || !promoCode.trim()
          }, isValidating ? 
            React.createElement("div", { className: "cosmic-loading" },
              React.createElement("span"),
              React.createElement("span"),
              React.createElement("span")
            ) : 'Activate Premium'
          ),
          
          React.createElement("button", {
            type: "button",
            onClick: () => {
              setShowPromoCode(false);
              setHideOtherButtons(false);
              setError('');
              setPromoCode('');
            },
            className: "cosmic-text-button"
          }, "Cancel")
        )
      )
    ),

    showLearnMore && React.createElement("div", { className: "cosmic-modal-overlay" },
      React.createElement("div", { className: "cosmic-modal-content" },
        React.createElement("h2", { className: "cosmic-title" }, "✨ Discover Premium Reading ✨"),
        
        React.createElement("div", { className: "cosmic-modal-body" },
          React.createElement("p", null, "Unlock the complete cosmic guidance:"),
          React.createElement("ul", null,
            React.createElement("li", null, "🌟 Three-Card Reading: Past, Present & Future"),
            React.createElement("li", null, "🔮 Personal Color Energy Reading"),
            React.createElement("li", null, "💫 Unlimited AI Guidance Chat"),
            React.createElement("li", null, "🌌 Interest-Based Path Reading"),
            React.createElement("li", null, "⭐ Premium Support & Updates")
          ),
          React.createElement("p", null, "Begin your complete cosmic journey today!")
        ),

        React.createElement("button", {
          className: "cosmic-glassy-button2",
          onClick: () => {
            setShowLearnMore(false);
            setShowPromoCode(true);
            setHideOtherButtons(true);
            window.open('https://www.georgies.work/product-page/cosmic-tarot-pro-code', '_blank');
          }
        }, "Access Premium Now"),
        
        React.createElement("button", {
          className: "cosmic-text-button",
          onClick: () => setShowLearnMore(false)
        }, "Later")
      )
    )
  );
};

window.Step0 = Step0;