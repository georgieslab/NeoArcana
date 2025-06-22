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
    className: `cosmic-welcome-container ${fadeOut ? 'cosmic-fade-out' : 'cosmic-fade-in'}`
  }, [
    React.createElement('h1', {
      key: 'title',
      className: 'cosmic-title cosmic-gradient-text'
    }, 'Welcome to NeoArcana'),
    
    React.createElement('p', {
      key: 'subtitle',
      className: 'cosmic-welcome-subtitle'
    }, 'Enter your poster code to begin your cosmic journey'),

    React.createElement('form', {
      key: 'form',
      onSubmit: handleSubmit,
      className: 'cosmic-form'
    }, [
      React.createElement('div', {
        key: 'input-container',
        className: 'cosmic-input-container'
      }, [
        React.createElement('input', {
          type: 'text',
          value: posterCode,
          onChange: (e) => setPosterCode(e.target.value.toUpperCase()),
          placeholder: 'Enter Poster Code',
          className: 'cosmic-input cosmic-code-input',
          maxLength: 8,
          disabled: isLoading,
          key: 'poster-input'
        })
      ]),

      error && React.createElement('div', {
        key: 'error',
        className: 'cosmic-error-container'
      }, React.createElement('p', {
        className: 'cosmic-error-message'
      }, error)),

      React.createElement('button', {
        key: 'submit-button',
        type: 'submit',
        className: 'cosmic-glassy-button1',
        disabled: isLoading || !posterCode.trim()
      }, isLoading ? 'Verifying...' : 'Begin Journey')
    ])
  ]);
};

window.WelcomeScreen = WelcomeScreen;