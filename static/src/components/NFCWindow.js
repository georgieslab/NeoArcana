const NFCWindow = ({ userName, zodiacSign, onClose }) => {
  const [affirmation, setAffirmation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAffirmation = async () => {
      setLoading(true);
      const affirmations = [
        `Today is full of possibilities, ${userName}!`,
        `The universe supports you, trust the path, ${userName}!`,
        `Believe in yourself, ${userName}. Your potential is limitless!`,
        `Good things are coming your way, ${userName}. Stay positive!`,
        `The stars shine brightest for you, ${userName}!`,
      ];

      const randomIndex = Math.floor(Math.random() * affirmations.length);
      const selectedAffirmation = affirmations[randomIndex];
      setAffirmation(selectedAffirmation);
      setLoading(false);
    };

    fetchAffirmation();
  }, [userName]);

  return (
    <div className="nfc-content">
      <h1 className="nfc-title">Welcome Back, {userName}!</h1>
      {zodiacSign && <h2 className="nfc-zodiac">Your Zodiac Sign: {zodiacSign}</h2>}
      {loading ? (
        <div className="loading-indicator">✨ Retrieving your affirmation... ✨</div>
      ) : (
        <div className="affirmation-container">
          <p className="affirmation-text">{affirmation}</p>
        </div>
      )}
    </div>
  );
};

window.NFCWindow = NFCWindow;