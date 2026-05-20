/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class SoundFxEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  
  // Independent audio channels
  private uiSoundEnabled: boolean = true;
  private alertSoundEnabled: boolean = true;
  private terminalSoundEnabled: boolean = true;
  private voiceEnabled: boolean = true;
  private masterVolume: number = 0.5;

  constructor() {
    // Lazy initializing of audio context on user action is standards-compliant
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this.ctx = new AudioContextClass();
      } catch (err) {
        console.warn('AudioContext failed to initialize', err);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleSound(enabled?: boolean) {
    if (enabled !== undefined) {
      this.soundEnabled = enabled;
    } else {
      this.soundEnabled = !this.soundEnabled;
    }
    return this.soundEnabled;
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  // Channel Getters & Setters
  public getUiSoundEnabled() { return this.uiSoundEnabled; }
  public setUiSoundEnabled(val: boolean) { this.uiSoundEnabled = val; }

  public getAlertSoundEnabled() { return this.alertSoundEnabled; }
  public setAlertSoundEnabled(val: boolean) { this.alertSoundEnabled = val; }

  public getTerminalSoundEnabled() { return this.terminalSoundEnabled; }
  public setTerminalSoundEnabled(val: boolean) { this.terminalSoundEnabled = val; }

  public getVoiceEnabled() { return this.voiceEnabled; }
  public setVoiceEnabled(val: boolean) { this.voiceEnabled = val; }

  public getMasterVolume() { return this.masterVolume; }
  public setMasterVolume(val: number) { this.masterVolume = Math.max(0, Math.min(1, val)); }

  public playClick() {
    if (!this.soundEnabled || !this.uiSoundEnabled) return;
    this.initCtx();
    const ctx = this.ctx;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(540, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.08 * this.masterVolume, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  public playHover() {
    if (!this.soundEnabled || !this.uiSoundEnabled) return;
    this.initCtx();
    const ctx = this.ctx;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);

    gain.gain.setValueAtTime(0.015 * this.masterVolume, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  }

  public playTerminalType() {
    if (!this.soundEnabled || !this.terminalSoundEnabled) return;
    this.initCtx();
    const ctx = this.ctx;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    const freq = 1200 + Math.random() * 800; // Randomized pitch for typing feel
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.006 * this.masterVolume, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.015);

    osc.start();
    osc.stop(ctx.currentTime + 0.015);
  }

  public playWarning() {
    if (!this.soundEnabled || !this.alertSoundEnabled) return;
    this.initCtx();
    const ctx = this.ctx;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.5);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, ctx.currentTime);
    
    osc.disconnect(gain);
    osc.connect(filter);
    filter.connect(gain);

    gain.gain.setValueAtTime(0.06 * this.masterVolume, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.55);

    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  }

  public playStart() {
    if (!this.soundEnabled || !this.alertSoundEnabled) return;
    this.initCtx();
    const ctx = this.ctx;
    if (!ctx) return;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(330, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.3);

    osc2.frequency.setValueAtTime(220, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);

    const delay = ctx.createDelay();
    delay.delayTime.setValueAtTime(0.08, ctx.currentTime);

    osc1.connect(gain);
    osc2.connect(delay);
    delay.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.setValueAtTime(0.07 * this.masterVolume, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.5);
    osc2.stop(ctx.currentTime + 0.5);
  }

  public playSuccess() {
    if (!this.soundEnabled || !this.alertSoundEnabled) return;
    this.initCtx();
    const ctx = this.ctx;
    if (!ctx) return;

    const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
    const playNote = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, startTime);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0.0, startTime);
      gain.gain.linearRampToValueAtTime(0.05 * this.masterVolume, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    notes.forEach((freq, index) => {
      playNote(freq, ctx.currentTime + index * 0.1, 0.7);
    });
  }

  public speak(text: string) {
    if (!this.soundEnabled || !this.voiceEnabled) return;
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      
      // Attempt robotic english voice or fallback
      const roboticVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) || voices[0];
      if (roboticVoice) {
        utterance.voice = roboticVoice;
      }
      
      utterance.pitch = 0.85; // slightly lower pitch for robotic effect
      utterance.rate = 1.15; // fast speaking
      utterance.volume = 0.35 * this.masterVolume;
      
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis failed", e);
    }
  }
}

export const soundfx = new SoundFxEngine();
