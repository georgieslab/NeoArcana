const CosmicLoading = () => {
  const [loadingPhase, setLoadingPhase] = React.useState(0);
  const phases = [
    { text: "Connecting to the Universe", icon: "✨" },
    { text: "Reading Your Stars", icon: "⭐" },
    { text: "Channeling Cosmic Energy", icon: "🌟" },
    { text: "Preparing Your Message", icon: "💫" }
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setLoadingPhase(prev => (prev + 1) % phases.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="cosmic-loading">
      <div className="cosmic-orb"></div>
      <div className="loading-progress">
        <div className="progress-bar"></div>
      </div>
      <div className="phase-message">
        <span className="phase-icon">{phases[loadingPhase].icon}</span>
        <span className="phase-text">{phases[loadingPhase].text}</span>
      </div>
    </div>
  );
};

window.CosmicLoading = CosmicLoading;