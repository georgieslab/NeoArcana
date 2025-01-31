const WelcomeScreen = ({ onCodeSubmit, isLoading, error }) => {
  const [posterCode, setPosterCode] = React.useState('');
  const [fadeOut, setFadeOut] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (posterCode.trim()) {
      console.log('WelcomeScreen: Submitting poster code:', posterCode.trim());
      setFadeOut(true);
      setTimeout(() => {
        onCodeSubmit(posterCode.trim());
      }, 500);
    }
  };

  return React.createElement('div', {
    className: `welcome-container ${fadeOut ? 'fade-out' : 'fade-in'}`
  }, [
    React.createElement('div', {
      key: 'welcome-card',
      className: 'welcome-card'
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'welcome-header'
      }, [
        React.createElement('h1', {
          key: 'title',
          className: 'cosmic-gradient cosmic-text'
        }, '✨ Welcome to NeoArcana'),
        React.createElement('p', {
          key: 'subtitle',
          className: 'welcome-subtitle'
        }, 'Enter your poster code to begin your cosmic journey')
      ]),

      React.createElement('form', {
        key: 'form',
        onSubmit: handleSubmit,
        className: 'welcome-form'
      }, [
        React.createElement('div', {
          key: 'input-container',
          className: 'code-input-container'
        }, [
          React.createElement('input', {
            type: 'text',
            value: posterCode,
            onChange: (e) => setPosterCode(e.target.value.toUpperCase()),
            placeholder: 'Enter Poster Code',
            className: 'code-input',
            maxLength: 8,
            disabled: isLoading,
            key: 'poster-input'
          })
        ]),

        error && React.createElement('div', {
          key: 'error',
          className: 'error-message'
        }, error),

        React.createElement('button', {
          key: 'submit-button',
          type: 'submit',
          className: 'cosmic-button',
          disabled: isLoading || !posterCode.trim()
        }, isLoading ? 'Verifying...' : 'Begin Journey ✨')
      ])
    ])
  ]);
};

window.WelcomeScreen = WelcomeScreen;