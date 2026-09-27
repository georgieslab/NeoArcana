/**
 * NeoArcana Cosmic Soundscapes Engine
 * 
 * Provides:
 * 1. Looping ethereal ambient background music (cosmicnoise.mp3) with smooth fades
 * 2. Web Audio API synthesized procedural SFX:
 *    - playCardFlip: Mystical card whoosh & ether resonance
 *    - playCelestialChime: 528Hz Solfeggio sacred frequency crystal chime
 *    - playStarSparkle: Soft high-frequency celestial blip
 * 3. Browser autoplay compliance (lazy AudioContext instantiation on user gesture)
 * 4. Persistent mute state in localStorage
 */

class SoundManager {
  constructor() {
    this.ambientAudio = null;
    this.audioCtx = null;
    this.listeners = new Set();

    // Check saved preference (default to muted so we don't startle the seeker)
    const saved = localStorage.getItem('neoarcana_sound_enabled');
    this.isEnabled = saved === 'true';

    this.initAmbient();
  }

  initAmbient() {
    if (typeof window === 'undefined') return;

    try {
      this.ambientAudio = new Audio('/static/sound/cosmicnoise.mp3');
      this.ambientAudio.loop = true;
      this.ambientAudio.volume = 0.28;
    } catch (e) {
      console.warn('Ambient audio could not be initialized:', e);
    }
  }

  getAudioContext() {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((fn) => fn(this.isEnabled));
  }

  async toggle() {
    if (this.isEnabled) {
      this.disable();
    } else {
      await this.enable();
    }
  }

  async enable() {
    this.isEnabled = true;
    localStorage.setItem('neoarcana_sound_enabled', 'true');
    this.notify();

    // Unlock Web Audio context
    this.getAudioContext();

    // Play ambient noise with gentle fade-in
    if (this.ambientAudio) {
      try {
        this.ambientAudio.currentTime = this.ambientAudio.currentTime || 0;
        this.ambientAudio.volume = 0.05;
        await this.ambientAudio.play();

        // Smooth fade in
        let vol = 0.05;
        const fadeInterval = setInterval(() => {
          if (vol < 0.28 && this.isEnabled) {
            vol += 0.03;
            this.ambientAudio.volume = Math.min(0.28, vol);
          } else {
            clearInterval(fadeInterval);
          }
        }, 80);
      } catch (err) {
        console.warn('Autoplay prevented by browser:', err);
      }
    }

    // Play welcome chime
    this.playCelestialChime();
  }

  disable() {
    this.isEnabled = false;
    localStorage.setItem('neoarcana_sound_enabled', 'false');
    this.notify();

    if (this.ambientAudio) {
      try {
        // Smooth fade out
        let vol = this.ambientAudio.volume;
        const fadeInterval = setInterval(() => {
          if (vol > 0.04) {
            vol -= 0.04;
            this.ambientAudio.volume = Math.max(0, vol);
          } else {
            this.ambientAudio.pause();
            this.ambientAudio.volume = 0.28;
            clearInterval(fadeInterval);
          }
        }, 50);
      } catch (e) {
        this.ambientAudio.pause();
      }
    }
  }

  // --- PROCEDURAL CELESTIAL SFX (Web Audio API) ---

  /**
   * Card Flip SFX: Mystical cosmic sweep when revealing cards
   */
  playCardFlip() {
    if (!this.isEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // 1. Resonant Bandpass Filter sweep
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(220, now);
      filter.frequency.exponentialRampToValueAtTime(780, now + 0.25);
      filter.Q.setValueAtTime(3.5, now);

      // 2. Gain Envelope
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      // 3. Dual Oscillators (Sine + Triangle for celestial texture)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(140, now);
      osc1.frequency.exponentialRampToValueAtTime(380, now + 0.28);

      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(280, now);
      osc2.frequency.exponentialRampToValueAtTime(560, now + 0.22);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.36);
      osc2.stop(now + 0.36);
    } catch (e) {
      console.warn('Error playing card flip sound:', e);
    }
  }

  /**
   * Celestial Chime SFX: 528Hz Solfeggio sacred frequency crystal bell
   */
  playCelestialChime() {
    if (!this.isEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // 528Hz (Transformation & Miracles) & 1056Hz harmonic overtone
      const freqs = [528, 1056, 1584];
      const gains = [0.18, 0.08, 0.03];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.linearRampToValueAtTime(gains[idx], now + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.65);
      });
    } catch (e) {
      console.warn('Error playing chime:', e);
    }
  }

  /**
   * Star Sparkle SFX: High-frequency celestial shimmer for button/chip interactions
   */
  playStarSparkle() {
    if (!this.isEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.08);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {
      console.warn('Error playing sparkle sound:', e);
    }
  }
}

// Global Singleton
const soundManager = new SoundManager();
export default soundManager;
