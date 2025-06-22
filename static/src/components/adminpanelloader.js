// AdminPanelLoader.js - Create this as a new file
const AdminPanelLoader = ({ appState, onClose }) => {
  // Check which admin panel component is available
  const UnifiedPanel = window.UnifiedAdminPanel;
  const NFCPanel = window.NFCAdminPanel;
  const DevPanel = window.DevPanel;
  
  // Use a fallback message if no admin panel components are available
  if (!UnifiedPanel && !NFCPanel && !DevPanel) {
    return React.createElement('div', {
      className: 'admin-panel-error'
    }, [
      React.createElement('h3', { key: 'error-title' }, 'Admin Panel Not Available'),
      React.createElement('p', { key: 'error-message' }, 
        'The admin panel component could not be loaded. Please check your browser console for errors.'),
      React.createElement('button', {
        key: 'close-button',
        className: 'close-button',
        onClick: onClose
      }, 'Close')
    ]);
  }
  
  // Prefer the UnifiedAdminPanel if available (as it combines functionality)
  if (UnifiedPanel) {
    return React.createElement(UnifiedPanel, { 
      appState,
      onCloseAdminPanel: onClose
    });
  }
  
  // Fall back to NFCAdminPanel if available
  if (NFCPanel) {
    return React.createElement(NFCPanel, {});
  }
  
  // As a last resort, use DevPanel if available
  if (DevPanel) {
    return React.createElement(DevPanel, {
      step: appState.step,
      setStep: appState.setStep,
      isPremium: appState.isPremium,
      setIsPremium: appState.setIsPremium,
      onClose: onClose,
      resetState: appState.resetState
    });
  }
};

// Register the component to the window object
window.AdminPanelLoader = AdminPanelLoader;