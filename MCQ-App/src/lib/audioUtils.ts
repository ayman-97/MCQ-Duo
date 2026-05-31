// Audio utilities for gameplay feedback
let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext && typeof window !== "undefined") {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioContext?.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
};

export const playSound = async (soundName: "pop" | "thud" | "levelup"): Promise<void> => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    if (soundName === "pop") {
      // Pop sound: quick beep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } else if (soundName === "thud") {
      // Thud sound: low frequency impact
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.15);
      
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } else if (soundName === "levelup") {
      // Level up: ascending tones
      const notes = [523, 659, 784]; // C5, E5, G5
      
      for (let i = 0; i < notes.length; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        const startTime = ctx.currentTime + i * 0.15;
        osc.frequency.setValueAtTime(notes[i], startTime);
        
        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
        
        osc.start(startTime);
        osc.stop(startTime + 0.2);
      }
    }
  } catch (e) {
    console.error("Audio playback error:", e);
  }
};

// Haptic feedback
export const triggerHaptic = (type: "light" | "medium" | "heavy"): void => {
  if (!navigator.vibrate) return;
  
  const patterns: { [key: string]: number | number[] } = {
    light: 10,
    medium: [20, 10, 20],
    heavy: [30, 20, 30],
  };
  
  navigator.vibrate(patterns[type]);
};

// Combined feedback
export const feedback = {
  correctAnswer: () => {
    playSound("pop");
    triggerHaptic("light");
  },
  wrongAnswer: () => {
    playSound("thud");
    triggerHaptic("medium");
  },
  levelUp: () => {
    playSound("levelup");
    triggerHaptic("heavy");
  },
};
