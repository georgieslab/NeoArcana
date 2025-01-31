const AudioButton = ({ isMuted, toggleMute }) => {
  return (
    <button onClick={toggleMute} className="audio-button">
      <img
        src={isMuted ? '/static/icons/mute.svg' : '/static/icons/unmute.svg'}
        alt={isMuted ? 'Muted' : 'Unmuted'}
        className={`audio-icon ${isMuted ? 'muted' : 'unmuted'}`}
      />
    </button>
  );
};

window.AudioButton = AudioButton;