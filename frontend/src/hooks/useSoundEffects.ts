// frontend/src/hooks/useSoundEffects.ts
import { useCallback, useRef, useState } from 'react';

type SoundType =
  | 'card-play'
  | 'card-flip'
  | 'card-shuffle'
  | 'wild-card'
  | 'life-lost'
  | 'player-eliminated'
  | 'game-start'
  | 'game-win'
  | 'game-lose'
  | 'bomb'
  | 'reverse'
  | 'notification'
  | 'button-click';

export const useSoundEffects = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context on first interaction
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
  }, []);

  // Generate tone for sound effects
  const playTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = 'sine') => {
      if (isMuted) return;

      initAudioContext();
      const ctx = audioContextRef.current;
      if (!ctx) return;

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    },
    [isMuted, volume, initAudioContext]
  );

  // Sound effects
  const playSound = useCallback(
    (sound: SoundType) => {
      if (isMuted) return;

      switch (sound) {
        case 'card-play':
          playTone(440, 0.1, 'sine');
          setTimeout(() => playTone(550, 0.05, 'sine'), 50);
          break;

        case 'card-flip':
          playTone(330, 0.08, 'triangle');
          break;

        case 'card-shuffle':
          for (let i = 0; i < 5; i++) {
            setTimeout(() => playTone(200 + Math.random() * 100, 0.05, 'triangle'), i * 30);
          }
          break;

        case 'wild-card':
          playTone(880, 0.15, 'square');
          setTimeout(() => playTone(1100, 0.15, 'square'), 100);
          setTimeout(() => playTone(1320, 0.2, 'square'), 200);
          break;

        case 'life-lost':
          playTone(220, 0.2, 'sawtooth');
          setTimeout(() => playTone(165, 0.3, 'sawtooth'), 150);
          break;

        case 'player-eliminated':
          playTone(440, 0.1, 'square');
          setTimeout(() => playTone(330, 0.1, 'square'), 100);
          setTimeout(() => playTone(220, 0.3, 'square'), 200);
          break;

        case 'game-start':
          playTone(523, 0.15, 'sine'); // C
          setTimeout(() => playTone(659, 0.15, 'sine'), 150); // E
          setTimeout(() => playTone(784, 0.3, 'sine'), 300); // G
          break;

        case 'game-win':
          playTone(523, 0.1, 'sine');
          setTimeout(() => playTone(659, 0.1, 'sine'), 100);
          setTimeout(() => playTone(784, 0.1, 'sine'), 200);
          setTimeout(() => playTone(1047, 0.3, 'sine'), 300);
          break;

        case 'game-lose':
          playTone(392, 0.2, 'sawtooth');
          setTimeout(() => playTone(330, 0.2, 'sawtooth'), 200);
          setTimeout(() => playTone(262, 0.4, 'sawtooth'), 400);
          break;

        case 'bomb':
          playTone(100, 0.1, 'square');
          setTimeout(() => playTone(80, 0.15, 'sawtooth'), 50);
          setTimeout(() => playTone(60, 0.2, 'sawtooth'), 100);
          break;

        case 'reverse':
          playTone(660, 0.1, 'sine');
          setTimeout(() => playTone(440, 0.1, 'sine'), 100);
          break;

        case 'notification':
          playTone(800, 0.1, 'sine');
          setTimeout(() => playTone(1000, 0.1, 'sine'), 100);
          break;

        case 'button-click':
          playTone(600, 0.05, 'sine');
          break;

        default:
          break;
      }
    },
    [isMuted, playTone]
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const setVolumeLevel = useCallback((level: number) => {
    setVolume(Math.max(0, Math.min(1, level)));
  }, []);

  return {
    playSound,
    isMuted,
    toggleMute,
    volume,
    setVolume: setVolumeLevel,
  };
};
