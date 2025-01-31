const DevPanel = ({ step, setStep, isPremium, setIsPremium, resetState, onClose, isClosing }) => {
  const [showPromoSection, setShowPromoSection] = window.React.useState(false);
  const [promoCodes, setPromoCodes] = window.React.useState([]);
  const [isLoading, setIsLoading] = window.React.useState(false);
  const [showPosterSection, setShowPosterSection] = window.React.useState(false);
  const [posters, setPosters] = window.React.useState([]);
  const [error, setError] = window.React.useState(null);
  const ADMIN_KEY = '29isthenewOne';

  // Fetch posters from the database
  const fetchPosters = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/nfc/admin/posters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Key': ADMIN_KEY
        },
        body: JSON.stringify({
          action: 'list'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setPosters(data || []);
      
    } catch (error) {
      console.error('Error fetching posters:', error);
      setError('Failed to fetch posters: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete poster
  const deletePoster = async (posterCode) => {
    if (!window.confirm(`Are you sure you want to delete poster ${posterCode}? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/nfc/admin/posters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Key': ADMIN_KEY
        },
        body: JSON.stringify({
          action: 'delete',
          poster_code: posterCode
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Remove poster from local state
        setPosters(currentPosters => 
          currentPosters.filter(poster => poster.poster_code !== posterCode)
        );
        alert('Poster deleted successfully!');
      } else {
        throw new Error(data.error || 'Failed to delete poster');
      }
      
    } catch (error) {
      console.error('Error deleting poster:', error);
      setError('Failed to delete poster: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const [newPoster, setNewPoster] = React.useState({
    owner: '',
    rebust: '',
    customCode: '',
    useCustomCode: false
  });

  const createPoster = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);

      const requestBody = {
        action: 'add',
        poster_code: newPoster.useCustomCode ? newPoster.customCode : undefined,
        batch_info: {
          owner: newPoster.owner,
          rebust: newPoster.rebust,
          manufacturing_date: new Date().toISOString().split('T')[0],
          production_location: 'Georgia',
          batch: 'DEV_BATCH'
        }
      };
  
      const response = await fetch('/api/nfc/admin/posters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Key': ADMIN_KEY
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create poster');
      }
      
      if (data.success) {
        setNewPoster({ 
          owner: '', 
          rebust: '', 
          customCode: '',
          useCustomCode: false 
        });
        alert(`New poster created successfully!\nPoster Code: ${data.poster_code}`);
        fetchPosters();
      } else {
        throw new Error(data.error || 'Failed to create poster');
      }
      
    } catch (error) {
      console.error('Error creating poster:', error);
      setError('Failed to create poster: ' + error.message);
      alert('Failed to create poster: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNFCCode = async (nfcId) => {
    if (!window.confirm(`Are you sure you want to delete NFC code ${nfcId}? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/nfc/admin/delete_code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Key': ADMIN_KEY
        },
        body: JSON.stringify({
          nfc_id: nfcId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        fetchPosters(); // Refresh the list
        alert('NFC code deleted successfully!');
      } else {
        throw new Error(data.error || 'Failed to delete NFC code');
      }
      
    } catch (error) {
      console.error('Error deleting NFC code:', error);
      setError('Failed to delete NFC code: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data when sections are opened
  window.React.useEffect(() => {
    if (showPosterSection) {
      fetchPosters();
    }
  }, [showPosterSection]);

  return (
    <div className={`dev-panel ${isClosing ? 'closing' : ''}`}>
      <div className="close-circle" onClick={onClose}>×</div>
      
      <div className="dev-panel-header">
        <h3>Dev Controls</h3>
        <div className="steps-nav">
          {[0, 1, 2, 3].map((stepNum) => (
            <button
              key={stepNum}
              onClick={() => setStep(stepNum)}
              className={`step-button ${step === stepNum ? 'active' : ''}`}
            >
              Step {stepNum}
            </button>
          ))}
        </div>
      </div>

      <div className="dev-panel-content">
        {/* Test Profiles */}
        <div className="test-profiles">
          <h4>Quick Fill Profiles</h4>
          <button onClick={() => fillTestData('default')} className="test-profile-button">
            🧪 Fill Test Data
          </button>
          <button onClick={() => fillTestData('georgian')} className="test-profile-button">
            🇬🇪 Georgian Test
          </button>
          <button onClick={() => fillTestData('premium')} className="test-profile-button premium">
            ✨ Premium Test
          </button>
        </div>

        <div className="dev-panel-divider" />
        
        {/* Poster Management */}
        <button 
          onClick={() => setShowPosterSection(!showPosterSection)}
          className="section-toggle-button"
        >
          {showPosterSection ? '🎯 Hide Posters' : '🎯 Manage Posters'}
        </button>

        {showPosterSection && (
        <div className="poster-section">
          // Update the form JSX
  <form onSubmit={createPoster} className="poster-form">
    <div className="form-group">
      <input
        type="text"
        value={newPoster.owner}
        onChange={(e) => setNewPoster(prev => ({ 
          ...prev, 
          owner: e.target.value.trim() 
        }))}
        placeholder="Owner Name"
        className="poster-input"
        required
      />
      <input
        type="text"
        value={newPoster.rebust}
        onChange={(e) => setNewPoster(prev => ({ 
          ...prev, 
          rebust: e.target.value.trim() 
        }))}
        placeholder="Rebust Code"
        className="poster-input"
        required
      />
      <div className="custom-code-section">
        <label className="custom-code-label">
          <input
            type="checkbox"
            checked={newPoster.useCustomCode}
            onChange={(e) => setNewPoster(prev => ({
              ...prev,
              useCustomCode: e.target.checked,
              customCode: e.target.checked ? prev.customCode : ''
            }))}
          />
          Use Custom Code
        </label>
        {newPoster.useCustomCode && (
          <input
            type="text"
            value={newPoster.customCode}
            onChange={(e) => setNewPoster(prev => ({
              ...prev,
              customCode: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
            }))}
            placeholder="Custom Code (8 characters)"
            pattern="[A-Z0-9]{8}"
            maxLength={8}
            className="poster-input"
            required={newPoster.useCustomCode}
          />
        )}
      </div>
    </div>
    <button 
      type="submit"
      disabled={
        isLoading || 
        !newPoster.owner || 
        !newPoster.rebust || 
        (newPoster.useCustomCode && newPoster.customCode.length !== 8)
      }
      className="create-poster-button"
    >
      {isLoading ? 'Creating...' : '✨ Create New Poster'}
    </button>
  </form>

            <div className="posters-list">
              {isLoading ? (
                <div className="loading">Loading posters...</div>
              ) : posters.length === 0 ? (
                <div className="no-data">No posters found</div>
              ) : (
                posters.map((poster) => (
                  <div key={poster.poster_code} className="poster-item">
                    <div className="poster-header">
                      <span className="code">{poster.poster_code}</span>
                      <span className={`status ${poster.is_active ? 'active' : 'inactive'}`}>
                        {poster.is_active ? '🟢 Active' : '🔴 Inactive'}
                      </span>
                    </div>
                    <div className="poster-details">
                      <small>Owner: {poster.owner || 'N/A'}</small>
                      <small>Rebust: {poster.rebust || 'N/A'}</small>
                      <small>Created: {new Date(poster.created_at).toLocaleDateString()}</small>
                    </div>
                    <div className="poster-actions">
                      <button 
                        onClick={() => deletePoster(poster.poster_code)}
                        className="delete-button"
                        disabled={isLoading}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="dev-panel-divider" />

        {/* Premium Toggle */}
        <button 
          onClick={() => {
            setIsPremium(!isPremium);
            if (!isPremium) {
              localStorage.setItem('promoCode', 'Universeis30!');
            } else {
              localStorage.removeItem('promoCode');
            }
          }}
          className={`premium-toggle ${isPremium ? 'active' : ''}`}
        >
          {isPremium ? '✨ Premium Active' : '☆ Activate Premium'}
        </button>
        
        <button onClick={resetState} className="reset-button">
          Reset All
        </button>
      </div>
    </div>
  );
};

window.DevPanel = DevPanel;