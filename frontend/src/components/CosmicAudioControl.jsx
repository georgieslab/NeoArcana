import { useState, useEffect } from 'react';
import soundManager from '../services/sound';

export default function CosmicAudioControl() {
  const [isEnabled, setIsEnabled] = useState(soundManager.isEnabled);

  useEffect(() => {
    const unsubscribe = soundManager.subscribe((state) => {
      setIsEnabled(state);
    });
    return unsubscribe;
  }, []);

  const handleToggle = () => {
    soundManager.toggle();
  };

  return (
    <button
      onClick={handleToggle}
      className={`cosmic-audio-toggle ${isEnabled ? 'sound-active' : 'sound-muted'}`}
      type="button"
      aria-label={isEnabled ? 'Mute Cosmic Soundscape' : 'Enable Cosmic Soundscape'}
      title={isEnabled ? 'Mute Cosmic Soundscape (Ambient & SFX)' : 'Enable Cosmic Soundscape (Ambient & SFX)'}
    >
      <div className="audio-toggle-inner">
        {isEnabled ? (
          <div className="audio-soundwaves" aria-hidden="true">
            <span className="wave-bar bar-1"></span>
            <span className="wave-bar bar-2"></span>
            <span className="wave-bar bar-3"></span>
            <span className="wave-bar bar-4"></span>
          </div>
        ) : (
          <span className="audio-muted-icon" aria-hidden="true">
            🔇
          </span>
        )}
        <span className="audio-toggle-label">
          {isEnabled ? 'Sound ON' : 'Sound'}
        </span>
      </div>
    </button>
  );
}
