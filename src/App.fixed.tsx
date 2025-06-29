import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import { DifficultyLevel } from './types/game';

// 导入主要组件
import MainMenu from './components/UI/MainMenu';

// 简化的游戏板组件
const SimpleGameBoard: React.FC = () => {
  const { difficulty } = useGameStore();
  
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="text-center text-white mb-8">
        <h2 className="text-3xl font-bold mb-4">游戏模式：{difficulty}</h2>
        <p className="text-lg">数学消除游戏正在开发中...</p>
      </div>
      
      {/* 简单的游戏网格 */}
      <div className="grid grid-cols-6 gap-2 max-w-md mx-auto">
        {Array.from({ length: 36 }, (_, i) => (
          <motion.div
            key={i}
            className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.02 }}
          >
            {Math.floor(Math.random() * 10)}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// 简化的游戏HUD
const SimpleGameHUD: React.FC<{ onPause: () => void; onMenu: () => void }> = ({ onPause, onMenu }) => {
  const { level, score, timeLeft } = useGameStore();
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* 左侧：游戏信息 */}
          <div className="flex items-center space-x-6">
            <div className="text-white">
              <div className="text-sm opacity-75">等级</div>
              <div className="text-xl font-bold">{level}</div>
            </div>
            <div className="text-white">
              <div className="text-sm opacity-75">分数</div>
              <div className="text-2xl font-bold">{score.toLocaleString()}</div>
            </div>
          </div>

          {/* 中间：时间 */}
          <div className="text-center">
            <div className="text-sm text-white opacity-75 mb-1">剩余时间</div>
            <div className="text-3xl font-bold text-white">
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* 右侧：控制按钮 */}
          <div className="flex space-x-2">
            <button
              onClick={onPause}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg font-bold transition-colors"
            >
              ⏸️ 暂停
            </button>
            <button
              onClick={onMenu}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold transition-colors"
            >
              🏠 菜单
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 页面状态枚举
enum GameScreen {
  MENU = 'menu',
  GAME = 'game'
}

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>(GameScreen.MENU);
  
  const {
    isPlaying,
    isPaused,
    isGameOver,
    startGame,
    pauseGame,
    resumeGame,
    resetGame
  } = useGameStore();

  // 处理键盘事件
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          if (isPlaying && !isPaused) {
            pauseGame();
          } else if (isPaused) {
            resumeGame();
          }
          break;
        case ' ':
          event.preventDefault();
          if (isPaused) {
            resumeGame();
          }
          break;
        case 'r':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            resetGame();
            setCurrentScreen(GameScreen.MENU);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, isPaused, pauseGame, resumeGame, resetGame]);

  // 游戏状态变化处理
  useEffect(() => {
    if (isPlaying) {
      setCurrentScreen(GameScreen.GAME);
    } else if (isGameOver) {
      setTimeout(() => {
        setCurrentScreen(GameScreen.MENU);
      }, 2000);
    }
  }, [isPlaying, isGameOver]);

  // 开始游戏
  const handleStartGame = (difficulty: DifficultyLevel) => {
    startGame(difficulty);
    setCurrentScreen(GameScreen.GAME);
  };

  // 返回主菜单
  const handleBackToMenu = () => {
    resetGame();
    setCurrentScreen(GameScreen.MENU);
  };

  // 暂停游戏
  const handlePauseGame = () => {
    if (isPlaying && !isPaused) {
      pauseGame();
    }
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 overflow-hidden">
      {/* 背景动画 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      {/* 主要内容区域 */}
      <AnimatePresence mode="wait">
        {currentScreen === GameScreen.MENU && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <MainMenu
              onStartGame={handleStartGame}
              onShowSettings={() => console.log('Settings')}
              onShowStats={() => console.log('Stats')}
            />
          </motion.div>
        )}

        {currentScreen === GameScreen.GAME && (
          <motion.div
            key="game"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col"
          >
            {/* 游戏HUD */}
            <SimpleGameHUD onPause={handlePauseGame} onMenu={handleBackToMenu} />
            
            {/* 游戏板 */}
            <div className="flex-1 flex items-center justify-center">
              <SimpleGameBoard />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 暂停提示 */}
      {isPaused && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">⏸️ 游戏暂停</h2>
            <p className="text-lg mb-6">按 ESC 或空格键继续游戏</p>
            <button
              onClick={resumeGame}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition-colors"
            >
              继续游戏
            </button>
          </div>
        </motion.div>
      )}

      {/* 版本信息 */}
      <div className="absolute bottom-2 right-2 text-white text-xs opacity-50 pointer-events-none">
        MathChain Epoch v1.0.0
      </div>
    </div>
  );
};

export default App;
