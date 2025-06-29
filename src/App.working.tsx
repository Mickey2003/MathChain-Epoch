import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import { DifficultyLevel } from './types/game';

// 简化的主菜单组件
const SimpleMainMenu: React.FC<{ onStartGame: (difficulty: DifficultyLevel) => void }> = ({ onStartGame }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-4xl w-full"
      >
        {/* 游戏标题 */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-black font-mono bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            MathChain
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-blue-200 mb-2">
            数链纪元
          </h2>
          <p className="text-lg text-blue-300 opacity-80">
            数学消除 · 智慧挑战 · 无限可能
          </p>
        </div>

        {/* 难度选择 */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center">选择难度</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { level: DifficultyLevel.ELEMENTARY, name: '小学', color: 'from-green-400 to-green-600', icon: '🌱' },
              { level: DifficultyLevel.MIDDLE, name: '初中', color: 'from-blue-400 to-blue-600', icon: '📚' },
              { level: DifficultyLevel.HIGH, name: '高中', color: 'from-purple-400 to-purple-600', icon: '🎓' },
              { level: DifficultyLevel.COLLEGE, name: '大学', color: 'from-yellow-400 to-orange-600', icon: '🔬' },
              { level: DifficultyLevel.HELL, name: '地狱', color: 'from-red-400 to-red-600', icon: '🔥' }
            ].map((difficulty) => (
              <motion.button
                key={difficulty.level}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onStartGame(difficulty.level)}
                className={`
                  relative p-6 rounded-2xl bg-gradient-to-br ${difficulty.color}
                  shadow-lg hover:shadow-xl transition-all duration-300
                  border border-white/20 backdrop-blur-sm
                  group overflow-hidden
                `}
              >
                <div className="relative z-10">
                  <div className="text-4xl mb-3">{difficulty.icon}</div>
                  <h4 className="text-xl font-bold mb-2">{difficulty.name}</h4>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// 简化的游戏界面
const SimpleGameScreen: React.FC<{ onBackToMenu: () => void }> = ({ onBackToMenu }) => {
  return (
    <div className="flex flex-col h-full">
      {/* 简单的HUD */}
      <div className="bg-black/20 backdrop-blur-sm p-4 flex justify-between items-center">
        <div className="text-white">
          <span className="text-xl font-bold">MathChain Epoch</span>
        </div>
        <button
          onClick={onBackToMenu}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold transition-colors"
        >
          返回菜单
        </button>
      </div>
      
      {/* 游戏区域 */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-4xl font-bold mb-4">游戏开发中</h2>
          <p className="text-xl mb-8">数学消除游戏即将上线！</p>
          <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
            {Array.from({ length: 16 }, (_, i) => (
              <motion.div
                key={i}
                className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  rotateY: [0, 360],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 5
                }}
              >
                {Math.floor(Math.random() * 10)}
              </motion.div>
            ))}
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
  const { startGame, resetGame } = useGameStore();

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
            <SimpleMainMenu onStartGame={handleStartGame} />
          </motion.div>
        )}

        {currentScreen === GameScreen.GAME && (
          <motion.div
            key="game"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <SimpleGameScreen onBackToMenu={handleBackToMenu} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 版本信息 */}
      <div className="absolute bottom-2 right-2 text-white text-xs opacity-50 pointer-events-none">
        MathChain Epoch v1.0.0 - Demo
      </div>
    </div>
  );
};

export default App;
