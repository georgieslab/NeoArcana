const OptimizedCardImage = ({ cardName, imagePath, className = '' }) => {
    const [isLoaded, setIsLoaded] = React.useState(false);
  
    return (
      <img
        src={imagePath}
        alt={cardName}
        className={`${className} ${isLoaded ? 'loaded' : ''}`}
        onLoad={() => setIsLoaded(true)}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
      />
    );
  };
  
  window.OptimizedCardImage = OptimizedCardImage;