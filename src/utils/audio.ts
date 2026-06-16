/**
 * Synthesizes sound effects using the Web Audio API
 */
class SoundSynthesizer {
  private ctx: AudioContext | null = null;

  private initContext() {
    if (!this.ctx) {
      // @ts-ignore
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    // Resume context if suspended (browser security blocks autoplay)
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Play a clean, welcoming double chime for new tokens
   */
  public playNewTokenChime() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        
        gain.gain.setValueAtTime(0.0, start);
        gain.gain.linearRampToValueAtTime(0.12, start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        
        osc.start(start);
        osc.stop(start + duration);
      };

      // Play low note then high note
      playTone(523.25, now, 0.4); // C5
      playTone(659.25, now + 0.15, 0.5); // E5
    } catch (e) {
      console.warn('Audio synthesis failed', e);
    }
  }

  /**
   * Play a distinct, melodic triple chime indicating queue advancement
   */
  public playCallNextChime() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        
        osc.type = 'triangle'; // softer tone
        osc.frequency.setValueAtTime(freq, start);
        
        gain.gain.setValueAtTime(0.0, start);
        gain.gain.linearRampToValueAtTime(0.1, start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        
        osc.start(start);
        osc.stop(start + duration);
      };

      // Arpeggio C5 -> E5 -> G5
      playTone(523.25, now, 0.3); // C5
      playTone(659.25, now + 0.1, 0.3); // E5
      playTone(783.99, now + 0.2, 0.6); // G5
    } catch (e) {
      console.warn('Audio synthesis failed', e);
    }
  }

  /**
   * Play a cute, high-pitched double beep to simulate phone SMS notifications
   */
  public playSmsNotificationSound() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        
        gain.gain.setValueAtTime(0.0, start);
        gain.gain.linearRampToValueAtTime(0.08, start + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        
        osc.start(start);
        osc.stop(start + duration);
      };

      playTone(1200, now, 0.08);
      playTone(1200, now + 0.1, 0.12);
    } catch (e) {
      console.warn('Audio synthesis failed', e);
    }
  }
}

export const soundSynth = new SoundSynthesizer();

/**
 * Uses Web Speech API to read out patient call announcements
 */
export function announcePatientCall(tokenNumber: number, name: string, roomNumber: string) {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser');
    return;
  }

  // Cancel any ongoing announcements first to avoid queueing delays
  window.speechSynthesis.cancel();

  const speechText = `Token number ${tokenNumber}, ${name}, please proceed to ${roomNumber}`;
  const utterance = new SpeechSynthesisUtterance(speechText);
  utterance.rate = 0.95; // slightly slower for professional tone
  utterance.pitch = 1.0;
  utterance.volume = 0.9;

  // Try to find an Indian English or high quality natural-sounding voice
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(
    (voice) => 
      voice.lang.toLowerCase().includes('en-in') || 
      voice.name.toLowerCase().includes('india')
  ) || voices.find(
    (voice) => 
      (voice.name.toLowerCase().includes('google') || voice.name.toLowerCase().includes('natural')) &&
      voice.lang.startsWith('en')
  ) || voices.find((voice) => voice.lang.startsWith('en'));

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  window.speechSynthesis.speak(utterance);
}
