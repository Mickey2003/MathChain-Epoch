import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  GameState,
  DifficultyLevel,
  GameBlock,
  PowerUp,
  GameStats,
  Animation,
  ParticleEffect
} from '../types/game';

interface GameStore extends GameState {
  // 游戏控制
  startGame: (difficulty: DifficultyLevel) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  
  // 游戏逻辑
  selectBlock: (block: GameBlock) => void;
  clearSelection: () => void;
  checkMatch: () => boolean;
  processMatch: () => void;
  dropBlocks: () => void;
  generateNewBlocks: () => void;
  
  // 分数和等级
  addScore: (points: number) => void;
  incrementCombo: () => void;
  resetCombo: () => void;
  nextLevel: () => void;
  
  // 道具
  usePowerUp: (powerUpType: string) => void;
  addPowerUp: (powerUp: PowerUp) => void;
  
  // 动画和效果
  animations: Animation[];
  particles: ParticleEffect[];
  addAnimation: (animation: Animation) => void;
  removeAnimation: (id: string) => void;
  addParticle: (particle: ParticleEffect) => void;
  removeParticle: (id: string) => void;
  
  // 统计
  stats: GameStats;
  updateStats: () => void;
  
  // 设置
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  toggleSound: () => void;
  toggleMusic: () => void;
  toggleVibration: () => void;
}

const initialGameState: GameState = {
  level: 1,
  score: 0,
  moves: 0,
  timeLeft: 300, // 5分钟
  difficulty: DifficultyLevel.ELEMENTARY,
  isPlaying: false,
  isPaused: false,
  isGameOver: false,
  combo: 0,
  maxCombo: 0,
  blocks: [],
  selectedBlocks: [],
  currentExpression: null,
  powerUps: [
    { id: 'bomb', type: 'bomb', count: 3, description: '炸弹：消除周围3x3区域', icon: '💣' },
    { id: 'lightning', type: 'lightning', count: 2, description: '闪电：消除整行或整列', icon: '⚡' },
    { id: 'shuffle', type: 'shuffle', count: 1, description: '洗牌：重新排列所有方块', icon: '🔀' },
    { id: 'hint', type: 'hint', count: 5, description: '提示：显示可能的匹配', icon: '💡' },
    { id: 'time', type: 'time', count: 1, description: '时间：增加30秒', icon: '⏰' }
  ]
};

const initialStats: GameStats = {
  totalGamesPlayed: 0,
  totalScore: 0,
  bestScore: 0,
  averageScore: 0,
  totalTime: 0,
  levelsCompleted: 0,
  perfectGames: 0,
  difficultyStats: {
    [DifficultyLevel.ELEMENTARY]: { gamesPlayed: 0, bestScore: 0, averageScore: 0, levelsCompleted: 0 },
    [DifficultyLevel.MIDDLE]: { gamesPlayed: 0, bestScore: 0, averageScore: 0, levelsCompleted: 0 },
    [DifficultyLevel.HIGH]: { gamesPlayed: 0, bestScore: 0, averageScore: 0, levelsCompleted: 0 },
    [DifficultyLevel.COLLEGE]: { gamesPlayed: 0, bestScore: 0, averageScore: 0, levelsCompleted: 0 },
    [DifficultyLevel.HELL]: { gamesPlayed: 0, bestScore: 0, averageScore: 0, levelsCompleted: 0 }
  }
};

export const useGameStore = create<GameStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialGameState,
    animations: [],
    particles: [],
    stats: initialStats,
    soundEnabled: true,
    musicEnabled: true,
    vibrationEnabled: true,

    startGame: (difficulty: DifficultyLevel) => {
      set({
        ...initialGameState,
        difficulty,
        isPlaying: true,
        timeLeft: difficulty === DifficultyLevel.HELL ? 180 : 300
      });
      // 初始化游戏板
      get().generateNewBlocks();
    },

    pauseGame: () => set({ isPaused: true }),
    resumeGame: () => set({ isPaused: false }),
    
    endGame: () => {
      set({ isPlaying: false, isGameOver: true });
      get().updateStats();
    },

    resetGame: () => set(initialGameState),

    selectBlock: (block: GameBlock) => {
      const { selectedBlocks } = get();
      const isAlreadySelected = selectedBlocks.some(b => b.id === block.id);
      
      if (isAlreadySelected) {
        // 取消选择
        set({
          selectedBlocks: selectedBlocks.filter(b => b.id !== block.id)
        });
      } else if (selectedBlocks.length < 3) {
        // 添加到选择
        set({
          selectedBlocks: [...selectedBlocks, block]
        });
        
        // 如果选择了3个块，检查匹配
        if (selectedBlocks.length === 2) {
          setTimeout(() => get().checkMatch(), 100);
        }
      }
    },

    clearSelection: () => set({ selectedBlocks: [] }),

    checkMatch: () => {
      const { selectedBlocks } = get();
      if (selectedBlocks.length !== 3) return false;
      
      // 这里实现数学表达式匹配逻辑
      // 暂时返回随机结果用于演示
      const isMatch = Math.random() > 0.5;
      
      if (isMatch) {
        get().processMatch();
        return true;
      } else {
        get().clearSelection();
        return false;
      }
    },

    processMatch: () => {
      const { selectedBlocks, combo } = get();
      const baseScore = 100;
      const comboMultiplier = Math.max(1, combo);
      const points = baseScore * comboMultiplier * selectedBlocks.length;
      
      get().addScore(points);
      get().incrementCombo();
      get().clearSelection();
      
      // 添加匹配动画
      selectedBlocks.forEach(block => {
        get().addAnimation({
          id: `match-${block.id}`,
          type: 'match',
          x: block.x,
          y: block.y,
          duration: 500
        });
      });
      
      setTimeout(() => {
        get().dropBlocks();
        get().generateNewBlocks();
      }, 500);
    },

    dropBlocks: () => {
      // 实现方块下落逻辑
      console.log('Dropping blocks...');
    },

    generateNewBlocks: () => {
      // 实现新方块生成逻辑
      console.log('Generating new blocks...');
    },

    addScore: (points: number) => {
      set(state => ({ score: state.score + points }));
    },

    incrementCombo: () => {
      set(state => ({
        combo: state.combo + 1,
        maxCombo: Math.max(state.maxCombo, state.combo + 1)
      }));
    },

    resetCombo: () => set({ combo: 0 }),

    nextLevel: () => {
      set(state => ({ level: state.level + 1 }));
    },

    usePowerUp: (powerUpType: string) => {
      set(state => ({
        powerUps: state.powerUps.map(p => 
          p.type === powerUpType && p.count > 0 
            ? { ...p, count: p.count - 1 }
            : p
        )
      }));
    },

    addPowerUp: (powerUp: PowerUp) => {
      set(state => ({
        powerUps: state.powerUps.map(p =>
          p.type === powerUp.type
            ? { ...p, count: p.count + powerUp.count }
            : p
        )
      }));
    },

    addAnimation: (animation: Animation) => {
      set(state => ({
        animations: [...state.animations, animation]
      }));
    },

    removeAnimation: (id: string) => {
      set(state => ({
        animations: state.animations.filter(a => a.id !== id)
      }));
    },

    addParticle: (particle: ParticleEffect) => {
      set(state => ({
        particles: [...state.particles, particle]
      }));
    },

    removeParticle: (id: string) => {
      set(state => ({
        particles: state.particles.filter(p => p.id !== id)
      }));
    },

    updateStats: () => {
      const { score, difficulty, level } = get();
      set(state => ({
        stats: {
          ...state.stats,
          totalGamesPlayed: state.stats.totalGamesPlayed + 1,
          totalScore: state.stats.totalScore + score,
          bestScore: Math.max(state.stats.bestScore, score),
          averageScore: (state.stats.totalScore + score) / (state.stats.totalGamesPlayed + 1),
          levelsCompleted: state.stats.levelsCompleted + (level > 1 ? 1 : 0),
          difficultyStats: {
            ...state.stats.difficultyStats,
            [difficulty]: {
              ...state.stats.difficultyStats[difficulty],
              gamesPlayed: state.stats.difficultyStats[difficulty].gamesPlayed + 1,
              bestScore: Math.max(state.stats.difficultyStats[difficulty].bestScore, score),
              averageScore: (state.stats.difficultyStats[difficulty].averageScore * state.stats.difficultyStats[difficulty].gamesPlayed + score) / (state.stats.difficultyStats[difficulty].gamesPlayed + 1),
              levelsCompleted: state.stats.difficultyStats[difficulty].levelsCompleted + (level > 1 ? 1 : 0)
            }
          }
        }
      }));
    },

    toggleSound: () => set(state => ({ soundEnabled: !state.soundEnabled })),
    toggleMusic: () => set(state => ({ musicEnabled: !state.musicEnabled })),
    toggleVibration: () => set(state => ({ vibrationEnabled: !state.vibrationEnabled }))
  }))
);
