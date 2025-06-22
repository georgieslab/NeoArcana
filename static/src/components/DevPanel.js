// Updated DevPanel.js with correct API endpoint
const DevPanel = ({ step, setStep, isPremium, setIsPremium, resetState, onClose, isClosing }) => {
  const [showPromoSection, setShowPromoSection] = React.useState(false);
  const [promoCodes, setPromoCodes] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPosterSection, setShowPosterSection] = React.useState(false);
  const [posters, setPosters] = React.useState([]);
  const [error, setError] = React.useState(null);
  
  // Component mounted state to prevent memory leaks
  const mounted = React.useRef(true);
  const ADMIN_KEY = '29isthenewOne';

  // Set up cleanup on unmount to prevent memory leaks
  React.useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  // Function to fill test data
  const fillTestData = (profile) => {
    console.log(`Filling test data for profile: ${profile}`);
    
    switch(profile) {
      case 'default':
        // Fill with default test data
        break;
      case 'georgian':
        // Fill with Georgian test data
        break;
      case 'premium':
        // Activate premium and fill premium test data
        setIsPremium(true);
        localStorage.setItem('promoCode', 'Universeis30!');
        break;
      default:
        break;
    }
  };

  // Fetch posters from the database - FIXED ENDPOINT URL TO MATCH SERVER ROUTE
  const fetchPosters = async () => {
    try {
      if (!mounted.current) return;
      
      setIsLoading(true);
      setError(null);
      
      console.log("Fetching posters...");
      
      // Use the correct endpoint that matches the actual server route
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

      if (!mounted.current) return;

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response error:", errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log("Posters data:", data);
      
      if (mounted.current) {
        setPosters(data || []);
      }
      
    } catch (error) {
      console.error('Error fetching posters:', error);
      if (mounted.current) {
        setError('Failed to fetch posters: ' + error.message);
      }
    } finally {
      if (mounted.current) {
        setIsLoading(false);
      }
    }
  };

  // Delete poster - FIXED ENDPOINT URL
  const deletePoster = async (posterCode) => {
    if (!window.confirm(`Are you sure you want to delete poster ${posterCode}? This action cannot be undone.`)) {
      return;
    }

    try {
      if (!mounted.current) return;
      
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

      if (!mounted.current) return;

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Remove poster from local state
        if (mounted.current) {
          setPosters(currentPosters => 
            currentPosters.filter(poster => poster.poster_code !== posterCode)
          );
          alert('Poster deleted successfully!');
        }
      } else {
        throw new Error(data.error || 'Failed to delete poster');
      }
      
    } catch (error) {
      console.error('Error deleting poster:', error);
      if (mounted.current) {
        setError('Failed to delete poster: ' + error.message);
      }
    } finally {
      if (mounted.current) {
        setIsLoading(false);
      }
    }
  };

  const [newPoster, setNewPoster] = React.useState({
    owner: '',
    rebust: '',
    customCode: '',
    useCustomCode: false
  });

  // Create poster - FIXED ENDPOINT URL
  const createPoster = async (e) => {
    e.preventDefault();
    
    try {
      if (!mounted.current) return;
      
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
  
      console.log("Creating poster with data:", requestBody);
      
      const response = await fetch('/api/nfc/admin/posters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Key': ADMIN_KEY
        },
        body: JSON.stringify(requestBody)
      });

      if (!mounted.current) return;

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log("Create poster response:", data);
      
      if (data.success) {
        if (mounted.current) {
          setNewPoster({ 
            owner: '', 
            rebust: '', 
            customCode: '',
            useCustomCode: false 
          });
          alert(`New poster created successfully!\nPoster Code: ${data.poster_code}`);
          fetchPosters();
        }
      } else {
        throw new Error(data.error || 'Failed to create poster');
      }
      
    } catch (error) {
      console.error('Error creating poster:', error);
      if (mounted.current) {
        setError('Failed to create poster: ' + error.message);
        alert('Failed to create poster: ' + error.message);
      }
    } finally {
      if (mounted.current) {
        setIsLoading(false);
      }
    }
  };

  // Delete NFC code - FIXED ENDPOINT URL
  const deleteNFCCode = async (nfcId) => {
    if (!window.confirm(`Are you sure you want to delete NFC code ${nfcId}? This action cannot be undone.`)) {
      return;
    }

    try {
      if (!mounted.current) return;
      
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

      if (!mounted.current) return;

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
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
      if (mounted.current) {
        setError('Failed to delete NFC code: ' + error.message);
      }
    } finally {
      if (mounted.current) {
        setIsLoading(false);
      }
    }
  };

  // Add a button to access the test user page
  const openTestUserPage = () => {
    // Create a container for the test user page if it doesn't exist
    let container = document.getElementById('test-user-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'test-user-container';
      document.body.appendChild(container);
    }
    
    // Render the test user component
    ReactDOM.render(
      React.createElement(window.TestUserReading),
      container
    );
    
    // Hide the main app
    const appContainer = document.querySelector('.parent-container');
    if (appContainer) {
      appContainer.style.display = 'none';
    }
  };

  // Load data when sections are opened
  React.useEffect(() => {
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
              key={`step-${stepNum}`}
              onClick={() => setStep(stepNum)}
              className={`step-button ${step === stepNum ? 'active' : ''}`}
            >
              Step {stepNum}
            </button>
          ))}
        </div>
      </div>

      <div className="dev-panel-content">
        {/* Test User Button */}
        <button 
          onClick={openTestUserPage}
          className="test-user-button"
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '15px',
            fontWeight: 'bold'
          }}
        >
          🔍 Test User Reading (091094)
        </button>
        
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
            {/* Create Poster Form */}
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

            {/* Error Display */}
            {error && (
              <div className="error-message" style={{
                color: '#f44336',
                padding: '10px',
                margin: '10px 0',
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                borderRadius: '4px'
              }}>
                {error}
              </div>
            )}

            {/* Posters List */}
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
                      <small>Created: {new Date(poster.created_at?.seconds * 1000 || Date.now()).toLocaleDateString()}</small>
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