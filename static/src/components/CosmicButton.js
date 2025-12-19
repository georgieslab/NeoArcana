// ========================================
// NEOARCANA - COSMIC BUTTON
// Beautiful button with particles & stars
// ========================================

const CosmicButton = ({ 
  onClick, 
  children, 
  disabled, 
  isAnimating,
  variant = 'primary', // 'primary', 'secondary', 'premium'
  type = 'button',
  className = ''
}) => {
  const buttonRef = React.useRef(null);
  const [particles, setParticles] = React.useState([]);

  const createParticle = React.useCallback(() => {
    if (!buttonRef.current) return null;
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 100 + 50;
    return {
      id: Math.random(),
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 1000 + 1000,
    };
  }, []);

  React.useEffect(() => {
    let intervalId;
    if (isAnimating) {
      intervalId = setInterval(() => {
        const newParticle = createParticle();
        if (newParticle) {
          setParticles(prev => [...prev, newParticle].slice(-30));
        }
      }, 100);
    } else {
      setParticles([]);
    }
    return () => clearInterval(intervalId);
  }, [isAnimating, createParticle]);

  const handleClick = (e) => {
    if (!disabled && !isAnimating && onClick) {
      onClick(e);
    }
  };

  return (
    <button 
      ref={buttonRef}
      type={type}
      className={`neo-button neo-button--cosmic neo-button--${variant} ${isAnimating ? 'neo-button--animating' : ''} ${className}`} 
      onClick={handleClick} 
      disabled={disabled || isAnimating}
    >
      <span className="neo-button-text">{children}</span>
      <span className="neo-button-star">✦</span>
      <span className="neo-button-star">✦</span>
      <span className="neo-button-star">✦</span>
      {particles.map((particle) => (
        <span 
          key={particle.id} 
          className="neo-button-particle" 
          style={{
            '--x': `${particle.x}px`,
            '--y': `${particle.y}px`,
            '--size': `${particle.size}px`,
            '--duration': `${particle.duration}ms`,
          }} 
        />
      ))}
    </button>
  );
};

window.CosmicButton = CosmicButton;