// UnifiedAdminPanel.js - Combines DevPanel and NFCAdminPanel functionality
const UnifiedAdminPanel = ({ appState, setAppState }) => {
  // Extract state properties from appState
  const { step, isPremium } = appState;
  
  // State for panel management
  const [activeTab, setActiveTab] = React.useState('development');
  const [isClosing, setIsClosing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  
  // State for poster management
  const [posters, setPosters] = React.useState([]);
  const [adminKey, setAdminKey] = React.useState('29isthenewOne');
  const [newPosterInfo, setNewPosterInfo] = React.useState({
    owner: '',
    rebust: '',
    customCode: '',
    useCustomCode: false
  });
  
  // Component mounted state to prevent memory leaks
  const mounted = React.useRef(true);
  
  // Set up cleanup on unmount to prevent memory leaks
  React.useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  // Handle panel closure
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      if (typeof appState.onCloseAdminPanel === 'function') {
        appState.onCloseAdminPanel();
      }
    }, 500);
  };

  // Set step function
  const setStep = (newStep) => {
    if (typeof appState.setStep === 'function') {
      appState.setStep(newStep);
    }
  };

  // Set premium function
  const setIsPremium = (value) => {
    if (typeof appState.setIsPremium === 'function') {
      appState.setIsPremium(value);
      
      if (value) {
        localStorage.setItem('promoCode', 'Universeis30!');
      } else {
        localStorage.removeItem('promoCode');
      }
    }
  };

  // Reset state function
  const resetState = () => {
    if (typeof appState.resetState === 'function') {
      appState.resetState();
    }
  };

  // Test profile utility
  const fillTestData = (profile) => {
    console.log(`Filling test data for profile: ${profile}`);
    
    switch(profile) {
      case 'default':
        // Fill with default test data
        break;
      case 'georgian':
        // Fill with Georgian test data
        if (typeof appState.setLanguage === 'function') {
          appState.setLanguage('ka');
        }
        break;
      case 'premium':
        // Activate premium and fill premium test data
        setIsPremium(true);
        break;
      default:
        break;
    }
  };

  // Fetch posters from the database
  const fetchPosters = async () => {
    try {
      if (!mounted.current) return;
      
      setIsLoading(true);
      setError(null);
      
      console.log("Fetching posters...");
      
      const response = await fetch('/api/nfc/admin/posters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Key': adminKey
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
        setPosters(Array.isArray(data) ? data : []);
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

  // Delete poster
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
          'X-Admin-Key': adminKey
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

  // Create poster
  const createPoster = async (e) => {
    e.preventDefault();
    
    try {
      if (!mounted.current) return;
      
      setIsLoading(true);
      setError(null);

      const requestBody = {
        action: 'add',
        poster_code: newPosterInfo.useCustomCode ? newPosterInfo.customCode : undefined,
        batch_info: {
          owner: newPosterInfo.owner,
          rebust: newPosterInfo.rebust,
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
          'X-Admin-Key': adminKey
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
          setNewPosterInfo({ 
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

  // Load data when poster tab is opened
  React.useEffect(() => {
    if (activeTab === 'posters') {
      fetchPosters();
    }
  }, [activeTab]);

  // Render development tab
  const renderDevelopmentTab = () => {
    return React.createElement('div', {
      className: 'admin-tab-content'
    }, [
      // Test User Button
      React.createElement('button', {
        key: 'test-user-button',
        onClick: openTestUserPage,
        className: 'admin-button admin-button-primary'
      }, '🔍 Test User Reading (091094)'),
      
      // App State Control
      React.createElement('div', {
        key: 'app-state-control',
        className: 'admin-section'
      }, [
        React.createElement('h3', {
          key: 'section-title',
          className: 'admin-section-title'
        }, 'App State Control'),
        
        React.createElement('div', {
          key: 'steps-nav',
          className: 'admin-steps-nav'
        }, [
          React.createElement('label', { key: 'steps-label', className: 'admin-label' }, 'Step:'),
          [0, 1, 2, 3].map((stepNum) => (
            React.createElement('button', {
              key: `step-${stepNum}`,
              onClick: () => setStep(stepNum),
              className: `admin-step-button ${step === stepNum ? 'active' : ''}`
            }, stepNum)
          ))
        ]),
        
        React.createElement('div', {
          key: 'premium-control',
          className: 'admin-premium-control'
        }, [
          React.createElement('button', {
            key: 'premium-toggle',
            onClick: () => setIsPremium(!isPremium),
            className: `admin-premium-toggle ${isPremium ? 'active' : ''}`
          }, isPremium ? '✨ Premium Active' : '☆ Activate Premium')
        ])
      ]),
      
      // Test Profiles
      React.createElement('div', {
        key: 'test-profiles',
        className: 'admin-section'
      }, [
        React.createElement('h3', {
          key: 'section-title',
          className: 'admin-section-title'
        }, 'Test Profiles'),
        
        React.createElement('div', {
          key: 'profiles-buttons',
          className: 'admin-test-profiles'
        }, [
          React.createElement('button', {
            key: 'default-profile',
            onClick: () => fillTestData('default'),
            className: 'admin-button'
          }, '🧪 Default Test'),
          
          React.createElement('button', {
            key: 'georgian-profile',
            onClick: () => fillTestData('georgian'),
            className: 'admin-button'
          }, '🇬🇪 Georgian Test'),
          
          React.createElement('button', {
            key: 'premium-profile',
            onClick: () => fillTestData('premium'),
            className: 'admin-button premium'
          }, '✨ Premium Test')
        ])
      ]),
      
      // Reset Button
      React.createElement('div', {
        key: 'reset-section',
        className: 'admin-section admin-reset-section'
      }, [
        React.createElement('button', {
          key: 'reset-button',
          onClick: resetState,
          className: 'admin-button admin-button-danger'
        }, '🔄 Reset All State')
      ])
    ]);
  };

  // Render posters tab
  const renderPostersTab = () => {
    return React.createElement('div', {
      className: 'admin-tab-content'
    }, [
      // Create Poster Form
      React.createElement('div', {
        key: 'create-poster-section',
        className: 'admin-section'
      }, [
        React.createElement('h3', {
          key: 'section-title',
          className: 'admin-section-title'
        }, 'Create New Poster'),
        
        React.createElement('form', {
          key: 'create-form',
          className: 'admin-form',
          onSubmit: createPoster
        }, [
          React.createElement('div', {
            key: 'form-row',
            className: 'admin-form-row'
          }, [
            React.createElement('input', {
              key: 'owner-input',
              type: 'text',
              value: newPosterInfo.owner,
              onChange: (e) => setNewPosterInfo(prev => ({ 
                ...prev, 
                owner: e.target.value.trim() 
              })),
              placeholder: 'Owner Name',
              className: 'admin-input',
              required: true
            }),
            
            React.createElement('input', {
              key: 'rebust-input',
              type: 'text',
              value: newPosterInfo.rebust,
              onChange: (e) => setNewPosterInfo(prev => ({ 
                ...prev, 
                rebust: e.target.value.trim() 
              })),
              placeholder: 'Rebust Code',
              className: 'admin-input',
              required: true
            })
          ]),
          
          React.createElement('div', {
            key: 'custom-code-row',
            className: 'admin-form-row'
          }, [
            React.createElement('label', {
              key: 'custom-code-label',
              className: 'admin-checkbox-label'
            }, [
              React.createElement('input', {
                key: 'custom-code-checkbox',
                type: 'checkbox',
                checked: newPosterInfo.useCustomCode,
                onChange: (e) => setNewPosterInfo(prev => ({
                  ...prev,
                  useCustomCode: e.target.checked,
                  customCode: e.target.checked ? prev.customCode : ''
                }))
              }),
              'Use Custom Code'
            ]),
            
            newPosterInfo.useCustomCode && React.createElement('input', {
              key: 'custom-code-input',
              type: 'text',
              value: newPosterInfo.customCode,
              onChange: (e) => setNewPosterInfo(prev => ({
                ...prev,
                customCode: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
              })),
              placeholder: 'Custom Code (8 characters)',
              pattern: '[A-Z0-9]{8}',
              maxLength: 8,
              className: 'admin-input',
              required: newPosterInfo.useCustomCode
            })
          ]),
          
          React.createElement('button', {
            key: 'submit-button',
            type: 'submit',
            className: 'admin-button admin-button-primary',
            disabled: isLoading || !newPosterInfo.owner || !newPosterInfo.rebust || 
                      (newPosterInfo.useCustomCode && newPosterInfo.customCode.length !== 8)
          }, isLoading ? 'Creating...' : '✨ Create New Poster')
        ])
      ]),
      
      // Error Message
      error && React.createElement('div', {
        key: 'error-message',
        className: 'admin-error'
      }, error),
      
      // Posters List
      React.createElement('div', {
        key: 'posters-list-section',
        className: 'admin-section'
      }, [
        React.createElement('div', {
          key: 'posters-header',
          className: 'admin-section-header'
        }, [
          React.createElement('h3', {
            key: 'section-title',
            className: 'admin-section-title'
          }, `Existing Posters (${posters.length})`),
          
          React.createElement('button', {
            key: 'refresh-button',
            onClick: fetchPosters,
            className: 'admin-button admin-button-secondary',
            disabled: isLoading
          }, isLoading ? 'Refreshing...' : '🔄 Refresh')
        ]),
        
        React.createElement('div', {
          key: 'posters-list',
          className: 'admin-posters-list'
        }, 
          isLoading ? 
            React.createElement('div', { key: 'loading', className: 'admin-loading' }, 'Loading posters...') :
            posters.length === 0 ? 
              React.createElement('p', { key: 'no-data', className: 'admin-no-data' }, 'No posters found') :
              posters.map(poster => 
                React.createElement('div', {
                  key: poster.poster_code,
                  className: 'admin-poster-item'
                }, [
                  React.createElement('div', {
                    key: 'poster-info',
                    className: 'admin-poster-info'
                  }, [
                    React.createElement('div', {
                      key: 'poster-code-container',
                      className: 'admin-poster-code-container'
                    }, [
                      React.createElement('span', {
                        key: 'poster-code-label',
                        className: 'admin-poster-label'
                      }, 'Code:'),
                      React.createElement('span', {
                        key: 'poster-code',
                        className: 'admin-poster-code'
                      }, poster.poster_code)
                    ]),
                    
                    React.createElement('div', {
                      key: 'poster-status-container',
                      className: 'admin-poster-status-container'
                    }, [
                      React.createElement('span', {
                        key: 'poster-status',
                        className: `admin-poster-status ${poster.is_registered ? 'registered' : 'available'}`
                      }, poster.is_registered ? '⚠️ Registered' : '✅ Available')
                    ]),
                    
                    React.createElement('div', {
                      key: 'poster-owner-container',
                      className: 'admin-poster-owner-container'
                    }, [
                      React.createElement('span', {
                        key: 'poster-owner-label',
                        className: 'admin-poster-label'
                      }, 'Owner:'),
                      React.createElement('span', {
                        key: 'poster-owner',
                        className: 'admin-poster-owner'
                      }, poster.owner || 'No owner')
                    ])
                  ]),
                  
                  !poster.is_registered && React.createElement('button', {
                    key: 'delete-button',
                    className: 'admin-delete-button',
                    onClick: () => deletePoster(poster.poster_code),
                    disabled: isLoading
                  }, '🗑️ Delete')
                ])
              )
        )
      ])
    ]);
  };

  // Render analytics tab
  const renderAnalyticsTab = () => {
    return React.createElement('div', {
      className: 'admin-tab-content'
    }, [
      React.createElement('h3', {
        key: 'title',
        className: 'admin-section-title'
      }, 'User Analytics'),
      
      React.createElement('p', {
        key: 'coming-soon',
        className: 'admin-coming-soon'
      }, 'Analytics features coming soon')
    ]);
  };

  // Render settings tab
  const renderSettingsTab = () => {
    return React.createElement('div', {
      className: 'admin-tab-content'
    }, [
      React.createElement('h3', {
        key: 'title',
        className: 'admin-section-title'
      }, 'Admin Settings'),
      
      React.createElement('div', {
        key: 'admin-key-section',
        className: 'admin-form-row'
      }, [
        React.createElement('label', {
          key: 'admin-key-label',
          htmlFor: 'admin-key-input',
          className: 'admin-label'
        }, 'Admin Key:'),
        
        React.createElement('input', {
          key: 'admin-key-input',
          id: 'admin-key-input',
          type: 'password',
          value: adminKey,
          onChange: (e) => setAdminKey(e.target.value),
          className: 'admin-input',
          placeholder: 'Enter admin key'
        })
      ])
    ]);
  };

  // Main component render
  return React.createElement('div', {
    className: `unified-admin-panel ${isClosing ? 'closing' : ''}`
  }, [
    // Header
    React.createElement('div', {
      key: 'header',
      className: 'admin-header'
    }, [
      React.createElement('h2', {
        key: 'title',
        className: 'admin-title'
      }, 'NeoArcana Admin Panel'),
      
      React.createElement('button', {
        key: 'close-button',
        className: 'admin-close-button',
        onClick: handleClose
      }, '×')
    ]),
    
    // Tabs Navigation
    React.createElement('div', {
      key: 'tabs',
      className: 'admin-tabs'
    }, [
      React.createElement('button', {
        key: 'dev-tab',
        className: `admin-tab ${activeTab === 'development' ? 'active' : ''}`,
        onClick: () => setActiveTab('development')
      }, '🧪 Development'),
      
      React.createElement('button', {
        key: 'posters-tab',
        className: `admin-tab ${activeTab === 'posters' ? 'active' : ''}`,
        onClick: () => setActiveTab('posters')
      }, '🎯 Poster Codes'),
      
      React.createElement('button', {
        key: 'analytics-tab',
        className: `admin-tab ${activeTab === 'analytics' ? 'active' : ''}`,
        onClick: () => setActiveTab('analytics')
      }, '📊 Analytics'),
      
      React.createElement('button', {
        key: 'settings-tab',
        className: `admin-tab ${activeTab === 'settings' ? 'active' : ''}`,
        onClick: () => setActiveTab('settings')
      }, '⚙️ Settings')
    ]),
    
    // Tab Content
    React.createElement('div', {
      key: 'tab-content',
      className: 'admin-tab-container'
    }, 
      activeTab === 'development' ? renderDevelopmentTab() :
      activeTab === 'posters' ? renderPostersTab() :
      activeTab === 'analytics' ? renderAnalyticsTab() :
      renderSettingsTab()
    )
  ]);
};

// Add styles for the UnifiedAdminPanel
const adminPanelStyles = document.createElement('style');
adminPanelStyles.textContent = `
.unified-admin-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #0a0a1f;
  color: white;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease-out;
  overflow: hidden;
}

.unified-admin-panel.closing {
  animation: slideOut 0.3s ease-in forwards;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(to right, rgba(165, 154, 209, 0.2), rgba(26, 26, 38, 0.7));
  border-bottom: 1px solid rgba(165, 154, 209, 0.3);
}

.admin-title {
  font-size: 24px;
  color: #A59AD1;
  margin: 0;
}

.admin-close-button {
  background: none;
  border: none;
  color: white;
  font-size: 28px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.admin-close-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.admin-tabs {
  display: flex;
  background-color: rgba(26, 26, 38, 0.7);
  border-bottom: 1px solid rgba(165, 154, 209, 0.3);
}

.admin-tab {
  background: none;
  border: none;
  color: white;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s;
  border-bottom: 2px solid transparent;
}

.admin-tab:hover {
  background-color: rgba(165, 154, 209, 0.1);
}

.admin-tab.active {
  color: #A59AD1;
  border-bottom: 2px solid #A59AD1;
  background-color: rgba(165, 154, 209, 0.1);
}

.admin-tab-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.admin-tab-content {
  max-width: 1200px;
  margin: 0 auto;
}

.admin-section {
  background-color: rgba(26, 26, 38, 0.7);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.admin-section-title {
  font-size: 18px;
  margin-top: 0;
  margin-bottom: 15px;
  color: #A59AD1;
}

.admin-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.admin-steps-nav {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 15px;
}

.admin-step-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1.5px solid rgba(165, 154, 209, 0.5);
  background-color: rgba(165, 154, 209, 0.1);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.admin-step-button.active {
  background-color: rgba(165, 154, 209, 0.3);
  border-color: #A59AD1;
  color: #A59AD1;
}

.admin-step-button:hover:not(.active) {
  background-color: rgba(165, 154, 209, 0.2);
}

.admin-premium-control {
  margin-top: 10px;
}

.admin-premium-toggle {
  background-color: rgba(255, 215, 0, 0.2);
  color: #FFD700;
  border: 1.5px solid #FFD700;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: bold;
}

.admin-premium-toggle.active {
  background-color: rgba(255, 215, 0, 0.3);
}

.admin-test-profiles {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.admin-button {
  background-color: rgba(165, 154, 209, 0.2);
  color: #A59AD1;
  border: 1.5px solid #A59AD1;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.admin-button:hover:not(:disabled) {
  background-color: rgba(165, 154, 209, 0.3);
  transform: translateY(-2px);
}

.admin-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.admin-button.admin-button-primary {
  background-color: rgba(100, 149, 237, 0.2);
  color: #6495ED;
  border-color: #6495ED;
}

.admin-button.admin-button-primary:hover:not(:disabled) {
  background-color: rgba(100, 149, 237, 0.3);
}

.admin-button.admin-button-secondary {
  background-color: rgba(244, 162, 97, 0.2);
  color: #F4A261;
  border-color: #F4A261;
}

.admin-button.admin-button-secondary:hover:not(:disabled) {
  background-color: rgba(244, 162, 97, 0.3);
}

.admin-button.admin-button-danger {
  background-color: rgba(239, 68, 68, 0.2);
  color: #EF4444;
  border-color: #EF4444;
}

.admin-button.admin-button-danger:hover:not(:disabled) {
  background-color: rgba(239, 68, 68, 0.3);
}

.admin-button.premium {
  background-color: rgba(255, 215, 0, 0.2);
  color: #FFD700;
  border-color: #FFD700;
}

.admin-reset-section {
  display: flex;
  justify-content: center;
}

.admin-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.admin-form-row {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.admin-input {
  flex: 1;
  min-width: 200px;
  background-color: rgba(15, 15, 25, 0.7);
  border: 1px solid rgba(165, 154, 209, 0.5);
  padding: 12px 15px;
  border-radius: 6px;
  color: white;
  outline: none;
  transition: border 0.3s;
}

.admin-input:focus {
  border-color: #A59AD1;
}

.admin-label {
  color: #A59AD1;
  margin-right: 10px;
  font-weight: 500;
}

.admin-checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.admin-checkbox-label input {
  width: 18px;
  height: 18px;
}

.admin-error {
  background-color: rgba(239, 68, 68, 0.1);
  color: #EF4444;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  border-left: 3px solid #EF4444;
}

.admin-posters-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 10px;
}

.admin-poster-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: rgba(15, 15, 25, 0.7);
  border-radius: 6px;
  border-left: 3px solid #A59AD1;
  transition: all 0.2s;
}

.admin-poster-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.admin-poster-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  width: 100%;
}

.admin-poster-label {
  color: rgba(255, 255, 255, 0.6);
  margin-right: 8px;
}

.admin-poster-code {
  color: #A59AD1;
  font-family: monospace;
  font-weight: bold;
}

.admin-poster-status {
  padding: 5px 10px;
  border-radius: 4px;
  display: inline-block;
}

.admin-poster-status.registered {
  color: #FFC107;
}

.admin-poster-status.available {
  color: #4CAF50;
}

.admin-delete-button {
  background-color: rgba(239, 68, 68, 0.1);
  color: #EF4444;
  border: 1px solid rgba(239, 68, 68, 0.5);
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.admin-delete-button:hover:not(:disabled) {
  background-color: rgba(239, 68, 68, 0.2);
}

.admin-loading, .admin-no-data {
  text-align: center;
  padding: 20px;
  color: rgba(255, 255, 255, 0.7);
}

.admin-coming-soon {
  text-align: center;
  padding: 30px;
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
  background-color: rgba(26, 26, 38, 0.7);
  border-radius: 8px;
}

@keyframes slideIn {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slideOut {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-100%);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .admin-form-row {
    flex-direction: column;
  }
  
  .admin-posters-list {
    max-height: 300px;
  }
  
  .admin-poster-info {
    grid-template-columns: 1fr;
  }
  
  .admin-tabs {
    overflow-x: auto;
  }
  
  .admin-tab {
    padding: 10px 15px;
    white-space: nowrap;
  }
}
`;

document.head.appendChild(adminPanelStyles);

// Expose the component to the window
window.UnifiedAdminPanel = UnifiedAdminPanel;