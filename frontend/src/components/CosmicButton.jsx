import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * CosmicButton - Luminous celestial button with dynamic particles,
 * twinkling stars, rotating conic gradient halo, and sound effects.
 *
 * @param {Object} props
 * @param {Function} [props.onClick]
 * @param {React.ReactNode} props.children
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.isAnimating]
 * @param {string} [props.variant='primary'] - 'primary' | 'secondary' | 'premium' | 'cosmic'
 * @param {string} [props.type='button']
 * @param {string} [props.className='']
 * @param {boolean} [props.showStars=true]
 * @param {boolean} [props.showParticles=true]
 */
export default function CosmicButton({
  onClick,
  children,
  disabled = false,
  isAnimating = false,
  variant = 'primary',
  type = 'button',
  className = '',
  showStars = true,
  showParticles = true,
  ...rest
}) {
  const buttonRef = useRef(null);
  const [particles, setParticles] = useState([]);

  // Generate random radial particle
  const createParticle = useCallback(() => {
    if (!buttonRef.current) return null;
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 80 + 40;
    return {
      id: Math.random() + Date.now(),
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      size: Math.random() * 3 + 1.5,
      duration: Math.random() * 900 + 800,
    };
  }, []);

  // Continuous particle stream when button is in animating state
  useEffect(() => {
    let intervalId;
    if (isAnimating && showParticles) {
      intervalId = setInterval(() => {
        const newParticle = createParticle();
        if (newParticle) {
          setParticles((prev) => [...prev, newParticle].slice(-25));
        }
      }, 120);
    } else {
      setParticles([]);
    }
    return () => clearInterval(intervalId);
  }, [isAnimating, showParticles, createParticle]);

  // Spawn subtle particle burst on hover / enter
  const handleMouseEnter = () => {
    if (disabled || isAnimating || !showParticles) return;
    const bursts = Array.from({ length: 4 }).map(() => createParticle()).filter(Boolean);
    if (bursts.length > 0) {
      setParticles((prev) => [...prev, ...bursts].slice(-20));
      // Auto clean up after 1.5s
      setTimeout(() => {
        setParticles([]);
      }, 1500);
    }
  };

  const handleClick = (e) => {
    if (!disabled && !isAnimating && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      ref={buttonRef}
      type={type}
      className={`neo-button neo-button--cosmic neo-button--${variant} ${
        isAnimating ? 'neo-button--animating' : ''
      } ${className}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      disabled={disabled || isAnimating}
      {...rest}
    >
      <span className="neo-button-text">{children}</span>

      {showStars && (
        <>
          <span className="neo-button-star" aria-hidden="true">✦</span>
          <span className="neo-button-star" aria-hidden="true">✦</span>
          <span className="neo-button-star" aria-hidden="true">✦</span>
        </>
      )}

      {showParticles &&
        particles.map((particle) => (
          <span
            key={particle.id}
            className="neo-button-particle"
            style={{
              '--x': `${particle.x}px`,
              '--y': `${particle.y}px`,
              '--size': `${particle.size}px`,
              '--duration': `${particle.duration}ms`,
            }}
            aria-hidden="true"
          />
        ))}
    </button>
  );
}
