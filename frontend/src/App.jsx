import { useState, useEffect, useCallback } from 'react';
import GalaxyBackground from './components/GalaxyBackground';
import CosmicLoader from './components/CosmicLoader';
import Step0 from './components/Step0';
import Step1Trial from './components/Step1Trial';
import NFCRegistration from './components/NFCRegistration';
import ThreeCardReveal from './components/ThreeCardReveal';
import ThreeCardInterpretation from './components/ThreeCardInterpretation';
import ChatInterface from './components/ChatInterface';
import StoryBehind from './components/StoryBehind';
import api from './services/api';
import './styles/main.css';

export default function App() {
  const [isAppLoading, setIsAppLoading] = useState(true); // 8s initial cosmic boot loader
  const [step, setStep] = useState(0); // 0: Landing, 1: Details/Registration, 2: Reveal, 3: Interpretation
  const [flowType, setFlowType] = useState('trial'); // 'trial' | 'nfc'
  const [userData, setUserData] = useState(null);
  const [readingData, setReadingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Consulting the Cosmos...');

  // Modals
  const [showStory, setShowStory] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [initialPosterCode, setInitialPosterCode] = useState('');

  // Fetch 3-card reading from backend
  const fetchReading = useCallback(async (nfcId = null, focus = 'General Cosmic Guidance', user = null) => {
    setIsLoading(true);
    setLoadingMessage('Drawing sacred Arcana from the ether...');

    try {
      const res = await api.getThreeCardReading(nfcId, focus, user);
      if (res?.success && res.data) {
        setReadingData(res.data);
        setStep(2); // Jump to Card Reveal
      } else {
        // Fallback demo data if backend offline
        setReadingData({
          cards: ['fool.jpg', 'magician.jpg', 'high_priestess.jpg'],
          cardNames: ['The Fool', 'The Magician', 'The High Priestess'],
          interpretation:
            '[PAST]\nThe Fool marks a courageous leap of faith you took. You embraced the unknown with pure trust.\n\n[PRESENT]\nThe Magician reveals your power to shape current reality. All tools and elements are at your disposal.\n\n[FUTURE]\nThe High Priestess shows deep intuitive awakening and mysteries unveiling in your journey.\n\n[INTEGRATION]\nTrust the inner compass and align action with divine wisdom.',
          cosmicContext: {
            moonPhase: 'Waxing Gibbous',
            season: 'Spring',
            dayEnergy: 'Intuition and Manifestation',
          },
        });
        setStep(2);
      }
    } catch (err) {
      console.warn('API error, loading fallback cosmic reading:', err);
      setReadingData({
        cards: ['fool.jpg', 'magician.jpg', 'high_priestess.jpg'],
        cardNames: ['The Fool', 'The Magician', 'The High Priestess'],
        interpretation:
          '[PAST]\nThe Fool marks a courageous leap of faith you took. You embraced the unknown with pure trust.\n\n[PRESENT]\nThe Magician reveals your power to shape current reality. All tools and elements are at your disposal.\n\n[FUTURE]\nThe High Priestess shows deep intuitive awakening and mysteries unveiling in your journey.\n\n[INTEGRATION]\nTrust your inner compass and align conscious action with divine wisdom.',
        cosmicContext: {
          moonPhase: 'Waxing Gibbous',
          season: 'Spring',
          dayEnergy: 'Manifestation & Insight',
        },
      });
      setStep(2);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle URL query parameters (NFC tap / poster registration)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const nfcIdParam = urlParams.get('id');
    const posterCodeParam = urlParams.get('posterCode');

    if (nfcIdParam) {
      console.log('NFC ID detected via URL:', nfcIdParam);
      setFlowType('nfc');
      setIsLoading(true);
      setLoadingMessage('Recognizing your NFC energy...');

      api.getUser(nfcIdParam)
        .then((res) => {
          if (res?.user) {
            setUserData(res.user);
            fetchReading(res.user.nfc_id || nfcIdParam);
          } else {
            // User not found, fall back to registration with code
            setInitialPosterCode(nfcIdParam);
            setStep(1);
          }
        })
        .catch(() => {
          setInitialPosterCode(nfcIdParam);
          setStep(1);
        })
        .finally(() => setIsLoading(false));
    } else if (posterCodeParam) {
      setFlowType('nfc');
      setInitialPosterCode(posterCodeParam);
      setStep(1);
    }
  }, [fetchReading]);

  // Handlers for Landing page
  const handleStartTrial = () => {
    setFlowType('trial');
    setStep(1);
  };

  const handleStartNFC = () => {
    setFlowType('nfc');
    setStep(1);
  };

  // Handlers for Step 1
  const handleTrialDetailsComplete = (data) => {
    setUserData(data);
    fetchReading(null, data?.focusArea || 'General Cosmic Guidance', data);
  };

  const handleNFCRegistrationComplete = (data) => {
    setUserData(data);
    fetchReading(data?.nfc_id, 'General Cosmic Guidance', data);
  };

  // Handler for card reveal completion -> goes to interpretation
  const handleRevealComplete = () => {
    setStep(3);
  };

  // Reset back to start
  const handleReturnToStart = () => {
    setStep(0);
    setReadingData(null);
  };

  return (
    <div className="neoarcana-app-wrapper">
      {/* 4.5s Initial Cosmic Boot Loader */}
      {isAppLoading && (
        <CosmicLoader
          duration={8000}
          onLoadingComplete={() => setIsAppLoading(false)}
        />
      )}

      {/* 3D Three.js Galaxy Background */}
      <GalaxyBackground />

      {/* Main Content Viewport */}
      <main className="neoarcana-viewport">
        {/* Step 0: Landing */}
        {step === 0 && (
          <Step0
            onTryFree={handleStartTrial}
            onPosterRegistration={handleStartNFC}
            onShowStory={() => setShowStory(true)}
          />
        )}

        {/* Step 1: Trial Registration / Form */}
        {step === 1 && flowType === 'trial' && (
          <Step1Trial
            onComplete={handleTrialDetailsComplete}
            onBack={() => setStep(0)}
            isSubmitting={isLoading}
          />
        )}

        {/* Step 1: NFC Poster Code & Attunement */}
        {step === 1 && flowType === 'nfc' && (
          <NFCRegistration
            initialPosterCode={initialPosterCode}
            onComplete={handleNFCRegistrationComplete}
            onBack={() => setStep(0)}
          />
        )}

        {/* Step 2: Interactive 3D Card Reveal */}
        {step === 2 && (
          <ThreeCardReveal
            name={userData?.name || 'Seeker'}
            zodiacSign={userData?.zodiacSign}
            readingData={readingData || {
              cards: ['fool.jpg', 'magician.jpg', 'high_priestess.jpg'],
              cardNames: ['The Fool', 'The Magician', 'The High Priestess'],
              interpretation: 'Delving into cosmic interpretation...'
            }}
            onComplete={handleRevealComplete}
          />
        )}

        {/* Step 3: Card Interpretation & Synthesis */}
        {step === 3 && readingData && (
          <ThreeCardInterpretation
            readingData={readingData}
            name={userData?.name || 'Seeker'}
            zodiacSign={userData?.zodiacSign}
            focusArea={userData?.focusArea}
            onReturn={handleReturnToStart}
            onOpenChat={() => setShowChat(true)}
          />
        )}
      </main>

      {/* Cosmic Loading Overlay */}
      {isLoading && (
        <div className="cosmic-loading-overlay fade-in">
          <div className="cosmic-spinner-wrapper">
            <div className="cosmic-spinner" />
            <p className="cosmic-loading-text">{loadingMessage}</p>
          </div>
        </div>
      )}

      {/* Story Behind Lore Modal */}
      {showStory && <StoryBehind onBack={() => setShowStory(false)} />}

      {/* Chat with the Universe Modal */}
      {showChat && (
        <ChatInterface
          name={userData?.name || 'Seeker'}
          zodiacSign={userData?.zodiacSign || ''}
          focusArea={userData?.focusArea || ''}
          cardName={readingData?.cardNames ? readingData.cardNames.join(', ') : 'Three Sacred Cards'}
          reading={readingData?.interpretation || readingData?.reading_text || ''}
          language={userData?.language || 'en'}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
}
