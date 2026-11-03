/**
 * NeoArcana Voice of the Oracle (Text-to-Speech Engine)
 * 
 * Powered by Web Speech API (SpeechSynthesis) with:
 * - Natural voice heuristic selection (Siri, Neural, Natural, Google US, Samantha, Jenny)
 * - Automatic background ambient audio ducking via SoundManager
 * - Section-by-section queued narration with progress tracking & highlighting
 * - Markdown & esoteric tag stripping for seamless auditory experience
 * - Play, Pause, Resume, Stop, and Pacing controls (0.85x, 1.0x, 1.15x)
 */
import soundManager from './sound';

function cleanTextForSpeech(text) {
  if (!text) return '';
  return text
    // Remove section headers like [PAST], **[PAST]**, ## Past, etc.
    .replace(/(?:\[(PAST|PRESENT|FUTURE|INTEGRATION)\]|\*\*\[\w+\]\*\*|##\s*[\w\u10A0-\u10FF]+)/gi, '')
    // Remove markdown bold, italic, strikethrough, backticks
    .replace(/[*_~`#]/g, '')
    // Replace bullet points with pauses
    .replace(/^\s*[-•*]\s+/gm, ', ')
    // Normalize dashes and arrows
    .replace(/[—–]/g, ', ')
    .replace(/->|→/g, ' leads to ')
    // Remove excessive newlines/spaces
    .replace(/\s+/g, ' ')
    .trim();
}

class SpeechOracle {
  constructor() {
    this.isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
    this.synth = this.isSupported ? window.speechSynthesis : null;
    
    this.queue = [];
    this.currentIndex = -1;
    this.isPlaying = false;
    this.isPaused = false;
    this.rate = 0.92; // Default calm, contemplative pacing
    this.pitch = 1.0;
    
    this.voices = [];
    this.selectedVoice = null;
    this.listeners = new Set();
    this.currentUtterance = null;

    if (this.isSupported) {
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  initVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices() || [];
  }

  getBestVoice(lang = 'en') {
    if (!this.voices.length) this.initVoices();
    if (!this.voices.length) return null;

    const isKa = lang === 'ka';
    if (isKa) {
      // Look for Georgian voice if installed on system
      const kaVoice = this.voices.find((v) => v.lang.startsWith('ka') || v.lang.includes('GE'));
      if (kaVoice) return kaVoice;
    }

    // Heuristics for English - prioritize natural/neural/studio voices
    const preferredNames = [
      'Natural',
      'Neural',
      'Siri',
      'Google US English',
      'Samantha',
      'Jenny',
      'Aria',
      'Guy',
      'Daniel',
      'Karen',
      'Serena',
    ];

    for (const name of preferredNames) {
      const match = this.voices.find(
        (v) => (v.lang.startsWith('en') || v.lang.startsWith(lang)) && v.name.toLowerCase().includes(name.toLowerCase())
      );
      if (match) return match;
    }

    // Fallback: any voice matching language, or default
    return this.voices.find((v) => v.lang.startsWith(lang)) || this.voices.find((v) => v.default) || this.voices[0];
  }

  subscribe(listener) {
    this.listeners.add(listener);
    // Immediately emit current state
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  notify() {
    const state = this.getState();
    this.listeners.forEach((fn) => {
      try {
        fn(state);
      } catch (err) {
        console.warn('Speech listener error:', err);
      }
    });
  }

  getState() {
    const currentItem = this.queue[this.currentIndex] || null;
    return {
      isSupported: this.isSupported,
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      currentIndex: this.currentIndex,
      currentSectionId: currentItem ? currentItem.id : null,
      currentSectionTitle: currentItem ? currentItem.title : null,
      totalSections: this.queue.length,
      rate: this.rate,
    };
  }

  setRate(newRate) {
    this.rate = Math.max(0.7, Math.min(1.5, newRate));
    if (this.isPlaying && !this.isPaused) {
      // Re-speak current section at new rate
      const currentIdx = this.currentIndex;
      this.speakSection(currentIdx);
    } else {
      this.notify();
    }
  }

  /**
   * Start or restart reading a list of sections:
   * items = [{ id: 'past', title: 'The Past — The Fool', text: '...' }, ...]
   */
  startReading(items, startIndex = 0, lang = 'en') {
    if (!this.isSupported || !items || !items.length) return;

    this.stop(false);
    this.queue = items;
    this.language = lang;
    this.selectedVoice = this.getBestVoice(lang);

    this.isPlaying = true;
    this.isPaused = false;
    soundManager.duckAmbient(true);

    this.speakSection(startIndex);
  }

  speakSection(index) {
    if (!this.synth || index < 0 || index >= this.queue.length) {
      this.finish();
      return;
    }

    this.currentIndex = index;
    const item = this.queue[index];
    const speechText = cleanTextForSpeech(`${item.title}. ${item.text}`);

    if (!speechText) {
      this.speakSection(index + 1);
      return;
    }

    if (this.synth.speaking || this.synth.pending) {
      this.synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.voice = this.selectedVoice || this.getBestVoice(this.language);
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;
    utterance.lang = this.language === 'ka' ? 'ka-GE' : 'en-US';

    utterance.onstart = () => {
      this.isPlaying = true;
      this.isPaused = false;
      this.notify();
    };

    utterance.onend = () => {
      if (!this.isPlaying) return;
      // Advance to next section in queue
      if (this.currentIndex + 1 < this.queue.length) {
        this.speakSection(this.currentIndex + 1);
      } else {
        this.finish();
      }
    };

    utterance.onerror = (e) => {
      if (e.error === 'interrupted' || e.error === 'canceled') return;
      console.warn('Speech synthesis error:', e);
      if (this.currentIndex + 1 < this.queue.length) {
        this.speakSection(this.currentIndex + 1);
      } else {
        this.finish();
      }
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
    this.notify();
  }

  pause() {
    if (!this.synth || !this.isPlaying || this.isPaused) return;
    this.synth.pause();
    this.isPaused = true;
    soundManager.duckAmbient(false);
    this.notify();
  }

  resume() {
    if (!this.synth || !this.isPaused) return;
    this.synth.resume();
    this.isPaused = false;
    soundManager.duckAmbient(true);
    this.notify();
  }

  togglePlayPause(items, startIndex = 0, lang = 'en') {
    if (!this.isPlaying) {
      this.startReading(items, startIndex, lang);
    } else if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  stop(restoreAmbient = true) {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isPlaying = false;
    this.isPaused = false;
    this.currentIndex = -1;
    this.currentUtterance = null;
    if (restoreAmbient) {
      soundManager.duckAmbient(false);
    }
    this.notify();
  }

  finish() {
    this.stop(true);
  }
}

const speechOracle = new SpeechOracle();
export default speechOracle;

