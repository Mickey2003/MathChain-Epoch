import React, { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { useGameStore } from '@/store/gameStore';
import { SoundEffect } from '@/types/game';

// 音效文件映射（这里使用Web Audio API生成的音效）
// const createBeepSound = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
//   return new Howl({
//     src: ['data:audio/wav;base64,'], // 占位符，实际使用Web Audio API
//     volume: 0.5,
//     onload: function() {
//       // 使用Web Audio API生成音效
//       const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
//       const oscillator = audioContext.createOscillator();
//       const gainNode = audioContext.createGain();
//
//       oscillator.connect(gainNode);
//       gainNode.connect(audioContext.destination);
//
//       oscillator.frequency.value = frequency;
//       oscillator.type = type;
//
//       gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
//       gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
//
//       oscillator.start(audioContext.currentTime);
//       oscillator.stop(audioContext.currentTime + duration);
//     }
//   });
// };

const SoundManager: React.FC = () => {
  const { soundEnabled, musicEnabled } = useGameStore();
  const soundsRef = useRef<Record<SoundEffect, Howl>>({} as Record<SoundEffect, Howl>);
  const backgroundMusicRef = useRef<Howl | null>(null);

  // 初始化音效
  useEffect(() => {
    // 创建各种音效
    soundsRef.current = {
      [SoundEffect.MATCH]: new Howl({
        src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'],
        volume: 0.6
      }),
      
      [SoundEffect.COMBO]: new Howl({
        src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'],
        volume: 0.8
      }),
      
      [SoundEffect.POWER_UP]: new Howl({
        src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'],
        volume: 0.7
      }),
      
      [SoundEffect.LEVEL_UP]: new Howl({
        src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'],
        volume: 0.9
      }),
      
      [SoundEffect.GAME_OVER]: new Howl({
        src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'],
        volume: 0.8
      }),
      
      [SoundEffect.BUTTON_CLICK]: new Howl({
        src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'],
        volume: 0.4
      }),
      
      [SoundEffect.WRONG_MATCH]: new Howl({
        src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'],
        volume: 0.5
      }),
      
      [SoundEffect.TIME_WARNING]: new Howl({
        src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'],
        volume: 0.7
      })
    };

    // 创建背景音乐（简单的循环旋律）
    backgroundMusicRef.current = new Howl({
      src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'],
      loop: true,
      volume: 0.3
    });

    return () => {
      // 清理音效
      Object.values(soundsRef.current).forEach(sound => sound.unload());
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.unload();
      }
    };
  }, []);

  // 播放音效的函数
  const playSound = (effect: SoundEffect) => {
    if (soundEnabled && soundsRef.current[effect]) {
      soundsRef.current[effect].play();
    }
  };

  // 播放背景音乐
  useEffect(() => {
    if (musicEnabled && backgroundMusicRef.current) {
      backgroundMusicRef.current.play();
    } else if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
    }
  }, [musicEnabled]);

  // 监听游戏状态变化来播放相应音效
  // const gameStore = useGameStore();
  
  useEffect(() => {
    // 这里可以监听游戏状态变化并播放相应音效
    // 由于这是一个演示，我们使用简化的实现
    
    // 监听分数变化（匹配音效）
    const unsubscribe = useGameStore.subscribe(
      (state) => state.score,
      (score, prevScore) => {
        if (score > prevScore) {
          playSound(SoundEffect.MATCH);
        }
      }
    );

    return unsubscribe;
  }, [soundEnabled]);

  // 使用Web Audio API生成实时音效
  const generateTone = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!soundEnabled) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  };

  // 暴露音效播放函数到全局（用于其他组件调用）
  useEffect(() => {
    (window as any).playGameSound = (effect: SoundEffect) => {
      switch (effect) {
        case SoundEffect.MATCH:
          generateTone(523.25, 0.2); // C5
          break;
        case SoundEffect.COMBO:
          generateTone(659.25, 0.3); // E5
          setTimeout(() => generateTone(783.99, 0.3), 100); // G5
          break;
        case SoundEffect.POWER_UP:
          generateTone(440, 0.1); // A4
          setTimeout(() => generateTone(554.37, 0.1), 100); // C#5
          setTimeout(() => generateTone(659.25, 0.2), 200); // E5
          break;
        case SoundEffect.LEVEL_UP:
          generateTone(523.25, 0.2); // C5
          setTimeout(() => generateTone(659.25, 0.2), 200); // E5
          setTimeout(() => generateTone(783.99, 0.2), 400); // G5
          setTimeout(() => generateTone(1046.5, 0.4), 600); // C6
          break;
        case SoundEffect.GAME_OVER:
          generateTone(220, 0.5, 'sawtooth'); // A3
          setTimeout(() => generateTone(196, 0.5, 'sawtooth'), 300); // G3
          setTimeout(() => generateTone(174.61, 0.8, 'sawtooth'), 600); // F3
          break;
        case SoundEffect.BUTTON_CLICK:
          generateTone(800, 0.1, 'square');
          break;
        case SoundEffect.WRONG_MATCH:
          generateTone(150, 0.3, 'sawtooth');
          break;
        case SoundEffect.TIME_WARNING:
          generateTone(1000, 0.1);
          setTimeout(() => generateTone(1000, 0.1), 200);
          break;
      }
    };

    return () => {
      delete (window as any).playGameSound;
    };
  }, [soundEnabled]);

  return null; // 这个组件不渲染任何内容
};

export default SoundManager;
