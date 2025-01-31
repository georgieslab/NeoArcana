const ReadingHistory = ({ onClose }) => {
    const [readings, setReadings] = React.useState([]);
    const [selectedReading, setSelectedReading] = React.useState(null);
  
    React.useEffect(() => {
      const savedReadings = JSON.parse(localStorage.getItem('tarotReadings') || '[]');
      setReadings(savedReadings.reverse()); // Show newest first
    }, []);
  
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };
  
    const deleteReading = (index) => {
      const newReadings = [...readings];
      newReadings.splice(index, 1);
      setReadings(newReadings);
      localStorage.setItem('tarotReadings', JSON.stringify(newReadings));
    };
  
    return (
      <div className="reading-history-modal">
        <div className="reading-history-content">
          <button className="close-button" onClick={onClose}>×</button>
          <h2>Your Reading History</h2>
  
          {readings.length === 0 ? (
            <p className="no-readings">No saved readings yet.</p>
          ) : (
            <div className="readings-list">
              {readings.map((reading, index) => (
                <div key={index} className="reading-card">
                  <div className="reading-card-header">
                    <h3>{reading.cardName}</h3>
                    <span className="reading-date">{formatDate(reading.date)}</span>
                  </div>
                  
                  <img 
                    src={`/static/images/${reading.cardImage}`}
                    alt={reading.cardName}
                    className="reading-card-image"
                    onClick={() => setSelectedReading(reading)}
                  />
                  
                  <div className="reading-card-preview">
                    <p>{reading.interpretation.substring(0, 100)}...</p>
                  </div>
                  
                  <div className="reading-card-actions">
                    <button 
                      onClick={() => setSelectedReading(reading)}
                      className="cosmic-button view-button"
                    >
                      View Full Reading
                    </button>
                    <button 
                      onClick={() => deleteReading(index)}
                      className="cosmic-button delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
  
        {selectedReading && (
          <div className="reading-detail-modal">
            <div className="reading-detail-content">
              <button 
                className="close-button" 
                onClick={() => setSelectedReading(null)}
              >
                ×
              </button>
              <h2>{selectedReading.cardName}</h2>
              <img 
                src={`/static/images/${selectedReading.cardImage}`}
                alt={selectedReading.cardName}
                className="reading-detail-image"
              />
              <div className="reading-detail-text">
                <h3>Interpretation</h3>
                <p>{selectedReading.interpretation}</p>
                <h3>Affirmations</h3>
                <ul>
                  {selectedReading.affirmations.map((affirmation, index) => (
                    <li key={index}>{affirmation}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

window.ReadingHistory = ReadingHistory;