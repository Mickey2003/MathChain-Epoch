import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { DifficultyLevel } from '@/types/game';

interface StatsModalProps {
  onClose: () => void;
}

const StatsModal: React.FC<StatsModalProps> = ({ onClose }) => {
  const { stats } = useGameStore();
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');

  const difficultyNames = {
    [DifficultyLevel.ELEMENTARY]: '小学',
    [DifficultyLevel.MIDDLE]: '初中',
    [DifficultyLevel.HIGH]: '高中',
    [DifficultyLevel.COLLEGE]: '大学',
    [DifficultyLevel.HELL]: '地狱'
  };

  const difficultyColors = {
    [DifficultyLevel.ELEMENTARY]: 'text-green-400',
    [DifficultyLevel.MIDDLE]: 'text-blue-400',
    [DifficultyLevel.HIGH]: 'text-purple-400',
    [DifficultyLevel.COLLEGE]: 'text-yellow-400',
    [DifficultyLevel.HELL]: 'text-red-400'
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: { opacity: 0, scale: 0.8, y: 50 }
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: string;
    color: string;
    delay?: number;
  }> = ({ title, value, icon, color, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/5 rounded-lg p-4 text-center border border-white/10"
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div className={`text-2xl font-bold ${color} mb-1`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="text-sm text-gray-300">{title}</div>
    </motion.div>
  );

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getSelectedStats = () => {
    if (selectedDifficulty === 'all') {
      return {
        gamesPlayed: stats.totalGamesPlayed,
        bestScore: stats.bestScore,
        averageScore: Math.round(stats.averageScore),
        levelsCompleted: stats.levelsCompleted
      };
    } else {
      return stats.difficultyStats[selectedDifficulty as DifficultyLevel];
    }
  };

  const selectedStats = getSelectedStats();

  return (
    <motion.div
      className="modal-overlay"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
    >
      <motion.div
        className="modal-content bg-gradient-to-br from-gray-900 to-gray-800 text-white max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题 */}
        <div className="text-center mb-6">
          <motion.h2 
            className="text-3xl font-bold mb-2"
            animate={{ 
              textShadow: [
                "0 0 0px rgba(59, 130, 246, 0)",
                "0 0 10px rgba(59, 130, 246, 0.5)",
                "0 0 0px rgba(59, 130, 246, 0)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            📊 游戏统计
          </motion.h2>
          <p className="text-gray-300">查看你的游戏成就和进度</p>
        </div>

        {/* 难度选择器 */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 text-center">选择难度</h3>
          <div className="flex flex-wrap justify-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDifficulty('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedDifficulty === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              全部
            </motion.button>
            
            {Object.entries(difficultyNames).map(([difficulty, name]) => (
              <motion.button
                key={difficulty}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDifficulty(difficulty as DifficultyLevel)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  selectedDifficulty === difficulty
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* 统计卡片 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDifficulty}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          >
            <StatCard
              title="游戏次数"
              value={selectedStats.gamesPlayed}
              icon="🎮"
              color="text-blue-400"
              delay={0.1}
            />
            
            <StatCard
              title="最高分数"
              value={selectedStats.bestScore}
              icon="🏆"
              color="text-yellow-400"
              delay={0.2}
            />
            
            <StatCard
              title="平均分数"
              value={selectedStats.averageScore}
              icon="📈"
              color="text-green-400"
              delay={0.3}
            />
            
            <StatCard
              title="完成关卡"
              value={selectedStats.levelsCompleted}
              icon="🎯"
              color="text-purple-400"
              delay={0.4}
            />
          </motion.div>
        </AnimatePresence>

        {/* 全局统计（仅在显示全部时） */}
        {selectedDifficulty === 'all' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <h3 className="text-lg font-bold mb-4 text-center text-blue-400">🌟 全局成就</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                title="总游戏时间"
                value={formatTime(stats.totalTime)}
                icon="⏱️"
                color="text-cyan-400"
              />
              
              <StatCard
                title="完美游戏"
                value={stats.perfectGames}
                icon="💎"
                color="text-pink-400"
              />
              
              <StatCard
                title="总分数"
                value={stats.totalScore}
                icon="💯"
                color="text-orange-400"
              />
            </div>
          </motion.div>
        )}

        {/* 难度进度条 */}
        {selectedDifficulty === 'all' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-6"
          >
            <h3 className="text-lg font-bold mb-4 text-center text-purple-400">🎓 难度掌握度</h3>
            <div className="space-y-3">
              {Object.entries(difficultyNames).map(([difficulty, name]) => {
                const diffStats = stats.difficultyStats[difficulty as DifficultyLevel];
                const progress = Math.min((diffStats.gamesPlayed / 10) * 100, 100);
                
                return (
                  <div key={difficulty} className="bg-white/5 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className={`font-semibold ${difficultyColors[difficulty as DifficultyLevel]}`}>
                        {name}
                      </span>
                      <span className="text-sm text-gray-300">
                        {diffStats.gamesPlayed} 局游戏
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full bg-gradient-to-r ${
                          difficulty === DifficultyLevel.ELEMENTARY ? 'from-green-400 to-green-500' :
                          difficulty === DifficultyLevel.MIDDLE ? 'from-blue-400 to-blue-500' :
                          difficulty === DifficultyLevel.HIGH ? 'from-purple-400 to-purple-500' :
                          difficulty === DifficultyLevel.COLLEGE ? 'from-yellow-400 to-yellow-500' :
                          'from-red-400 to-red-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: 0.7 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* 关闭按钮 */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="w-full btn btn-primary text-lg py-3 flex items-center justify-center gap-3"
        >
          <span className="text-xl">✓</span>
          关闭
        </motion.button>

        {/* 装饰性动画 */}
        <div className="absolute top-4 right-4 opacity-20">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 10, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity }
            }}
            className="text-3xl"
          >
            📊
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StatsModal;
