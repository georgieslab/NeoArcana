const NFCLoader = () => {
    return React.createElement('div', {
      className: 'nfc-loader-container'
    }, [
      React.createElement('div', {
        className: 'nfc-loader-circle',
        key: 'circle'
      }),
      React.createElement('div', {
        className: 'nfc-loader-stars',
        key: 'stars'
      }, Array(5).fill().map((_, i) => 
        React.createElement('div', {
          className: 'nfc-loader-star',
          key: `star-${i}`,
          style: {
            animationDelay: `${i * 0.2}s`
          }
        })
      )),
      React.createElement('div', {
        className: 'nfc-loader-text',
        key: 'text'
      }, 'Connecting to the Cosmos...')
    ]);
  };
  
  // Make it available globally
  window.NFCLoader = NFCLoader;