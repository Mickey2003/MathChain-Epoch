import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { DifficultyLevel } from '@/types/game';

// 组件导入
import GameBoard from '@/components/Game/GameBoard';
import GameHUD from '@/components/Game/GameHUD';
import MainMenu from '@/components/UI/MainMenu';
import PauseMenu from '@/components/UI/PauseMenu';
import GameOverScreen from '@/components/UI/GameOverScreen';
import SettingsModal from '@/components/UI/SettingsModal';
import StatsModal from '@/components/UI/StatsModal';
import ParticleSystem from '@/components/Effects/ParticleSystem';
import SoundManager from '@/components/Audio/SoundManager';

// 页面状态枚举
enum GameScreen {
  MENU = 'menu',
  GAME = 'game',
  SETTINGS = 'settings',
  STATS = 'stats'
}

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>(GameScreen.MENU);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  
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
      // 游戏结束后延迟显示结束画面
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

  // 继续游戏
  const handleResumeGame = () => {
    resumeGame();
  };

  // 暂停游戏
  const handlePauseGame = () => {
    if (isPlaying && !isPaused) {
      pauseGame();
    }
  };

  return (
    <div className="game-container relative w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* 背景动画 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* 音效管理器 */}
      <SoundManager />

      {/* 粒子系统 */}
      <ParticleSystem />

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
              onShowSettings={() => setShowSettings(true)}
              onShowStats={() => setShowStats(true)}
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
            <GameHUD onPause={handlePauseGame} onMenu={handleBackToMenu} />
            
            {/* 游戏板 */}
            <div className="flex-1 flex items-center justify-center">
              <GameBoard />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 暂停菜单 */}
      <AnimatePresence>
        {isPaused && (
          <PauseMenu
            onResume={handleResumeGame}
            onRestart={() => {
              resetGame();
              setCurrentScreen(GameScreen.MENU);
            }}
            onMenu={handleBackToMenu}
            onSettings={() => setShowSettings(true)}
          />
        )}
      </AnimatePresence>

      {/* 游戏结束画面 */}
      <AnimatePresence>
        {isGameOver && (
          <GameOverScreen
            onRestart={() => {
              resetGame();
              setCurrentScreen(GameScreen.MENU);
            }}
            onMenu={handleBackToMenu}
          />
        )}
      </AnimatePresence>

      {/* 设置模态框 */}
      <AnimatePresence>
        {showSettings && (
          <SettingsModal onClose={() => setShowSettings(false)} />
        )}
      </AnimatePresence>

      {/* 统计模态框 */}
      <AnimatePresence>
        {showStats && (
          <StatsModal onClose={() => setShowStats(false)} />
        )}
      </AnimatePresence>

      {/* 版本信息 */}
      <div className="absolute bottom-2 right-2 text-white text-xs opacity-50 pointer-events-none">
        MathChain Epoch v1.0.0
      </div>
    </div>
  );
};

export default App;
