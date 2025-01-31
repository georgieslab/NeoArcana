const ThreeCardReading = ({ userData, onError, onComplete }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [readingData, setReadingData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [showReveal, setShowReveal] = React.useState(false);

  const fetchThreeCardReading = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/nfc/three_card_reading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nfc_id: userData.nfc_id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get three card reading');
      }

      const data = await response.json();
      if (data.success) {
        setReadingData(data.data);
        setShowReveal(true);
      } else {
        throw new Error(data.error || 'Failed to get reading');
      }
    } catch (err) {
      console.error('Error fetching three card reading:', err);
      setError(err.message);
      if (onError) onError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchThreeCardReading();
  }, []);

  if (isLoading) {
    return React.createElement('div', {
      className: 'three-card-loading'
    }, [
      React.createElement('div', {
        key: 'loading-text',
        className: 'cosmic-text'
      }, 'Preparing your three card reading...'),
      React.createElement(CosmicLoader, {
        key: 'loader',
        type: 'cards'
      })
    ]);
  }

  if (error) {
    return React.createElement('div', {
      className: 'three-card-error cosmic-gradient'
    }, error);
  }

  if (!readingData) {
    return React.createElement('div', {
      className: 'three-card-error cosmic-gradient'
    }, 'No reading data available');
  }

  return React.createElement('div', {
    className: 'three-card-container'
  }, 
    React.createElement(ThreeCardReveal, {
      readingData: readingData,
      onComplete: onComplete
    })
  );
};

window.ThreeCardReading = ThreeCardReading;