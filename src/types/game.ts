// 游戏难度级别
export enum DifficultyLevel {
  ELEMENTARY = 'elementary',  // 小学
  MIDDLE = 'middle',          // 初中
  HIGH = 'high',              // 高中
  COLLEGE = 'college',        // 大学
  HELL = 'hell'               // 地狱
}

// 数学运算类型
export enum MathOperation {
  ADD = '+',
  SUBTRACT = '-',
  MULTIPLY = '×',
  DIVIDE = '÷',
  POWER = '^',
  SQRT = '√',
  LOG = 'log',
  SIN = 'sin',
  COS = 'cos',
  TAN = 'tan',
  INTEGRAL = '∫',
  DERIVATIVE = "d/dx"
}

// 游戏块类型
export interface GameBlock {
  id: string;
  value: number | string;
  operation?: MathOperation;
  x: number;
  y: number;
  type: 'number' | 'operation' | 'result';
  isSelected: boolean;
  isMatched: boolean;
  isAnimating: boolean;
  color: string;
  difficulty: DifficultyLevel;
}

// 数学表达式
export interface MathExpression {
  id: string;
  operand1: number;
  operation: MathOperation;
  operand2: number;
  result: number;
  difficulty: DifficultyLevel;
  isCorrect: boolean;
}

// 游戏状态
export interface GameState {
  level: number;
  score: number;
  moves: number;
  timeLeft: number;
  difficulty: DifficultyLevel;
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  combo: number;
  maxCombo: number;
  blocks: GameBlock[][];
  selectedBlocks: GameBlock[];
  currentExpression: MathExpression | null;
  powerUps: PowerUp[];
}

// 道具类型
export interface PowerUp {
  id: string;
  type: 'bomb' | 'lightning' | 'shuffle' | 'hint' | 'time';
  count: number;
  description: string;
  icon: string;
}

// 关卡配置
export interface LevelConfig {
  level: number;
  difficulty: DifficultyLevel;
  gridSize: { rows: number; cols: number };
  timeLimit: number;
  targetScore: number;
  maxMoves: number;
  availableOperations: MathOperation[];
  specialRules?: string[];
}

// 游戏统计
export interface GameStats {
  totalGamesPlayed: number;
  totalScore: number;
  bestScore: number;
  averageScore: number;
  totalTime: number;
  levelsCompleted: number;
  perfectGames: number;
  difficultyStats: Record<DifficultyLevel, {
    gamesPlayed: number;
    bestScore: number;
    averageScore: number;
    levelsCompleted: number;
  }>;
}

// 动画类型
export interface Animation {
  id: string;
  type: 'match' | 'fall' | 'explode' | 'combo' | 'score';
  x: number;
  y: number;
  duration: number;
  delay?: number;
  value?: number | string;
}

// 音效类型
export enum SoundEffect {
  MATCH = 'match',
  COMBO = 'combo',
  POWER_UP = 'powerup',
  LEVEL_UP = 'levelup',
  GAME_OVER = 'gameover',
  BUTTON_CLICK = 'click',
  WRONG_MATCH = 'wrong',
  TIME_WARNING = 'warning'
}

// 粒子效果类型
export interface ParticleEffect {
  id: string;
  type: 'stars' | 'explosion' | 'sparkle' | 'numbers';
  x: number;
  y: number;
  color: string;
  count: number;
  duration: number;
}
