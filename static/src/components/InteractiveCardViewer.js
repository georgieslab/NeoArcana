const InteractiveCardViewer = ({ cardImage, cardName, onClose }) => {
    const [scale, setScale] = React.useState(1);
    const [isZoomed, setIsZoomed] = React.useState(false);
    const viewerRef = React.useRef(null);
  
    // Handle double tap to zoom
    const handleCardClick = () => {
      setIsZoomed(!isZoomed);
      setScale(isZoomed ? 1 : 2);
    };
  
    // Close on background click
    const handleBackgroundClick = (e) => {
      if (e.target === viewerRef.current) {
        onClose();
      }
    };
  
    return (
      <div 
        ref={viewerRef}
        className="card-viewer-overlay"
        onClick={handleBackgroundClick}
      >
        <div className="card-viewer-content">
          <button className="close-button" onClick={onClose}>
            ×
          </button>
          
          <div className="card-viewer-image-container">
            <img 
              src={`/static/images/${cardImage}`}
              alt={cardName}
              className={`card-viewer-image ${isZoomed ? 'zoomed' : ''}`}
              onClick={handleCardClick}
              style={{
                transform: `scale(${scale})`,
                transition: 'transform 0.3s ease'
              }}
            />
          </div>
          
          <div className="card-viewer-info">
            <h2 className="card-viewer-title">{cardName}</h2>
            <p className="card-viewer-instruction">Tap card to zoom</p>
          </div>
        </div>
      </div>
    );
  };
  

  window.InteractiveCardViewer = InteractiveCardViewer;