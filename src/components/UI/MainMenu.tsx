import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DifficultyLevel } from '@/types/game';

interface MainMenuProps {
  onStartGame: (difficulty: DifficultyLevel) => void;
  onShowSettings: () => void;
  onShowStats: () => void;
}

const difficultyConfig = {
  [DifficultyLevel.ELEMENTARY]: {
    name: '小学',
    description: '基础加减乘除',
    color: 'from-green-400 to-green-600',
    icon: '🌱',
    examples: ['2 + 3 = 5', '8 - 4 = 4', '3 × 2 = 6']
  },
  [DifficultyLevel.MIDDLE]: {
    name: '初中',
    description: '分数、负数、简单代数',
    color: 'from-blue-400 to-blue-600',
    icon: '📚',
    examples: ['2x + 3 = 7', '1/2 + 1/3 = 5/6', '(-2) × 3 = -6']
  },
  [DifficultyLevel.HIGH]: {
    name: '高中',
    description: '函数、三角、指数',
    color: 'from-purple-400 to-purple-600',
    icon: '🎓',
    examples: ['sin(30°) = 1/2', '2³ = 8', 'log₂(8) = 3']
  },
  [DifficultyLevel.COLLEGE]: {
    name: '大学',
    description: '微积分、线性代数',
    color: 'from-yellow-400 to-orange-600',
    icon: '🔬',
    examples: ['∫x dx = x²/2', 'd/dx(x²) = 2x', '|A| = det(A)']
  },
  [DifficultyLevel.HELL]: {
    name: '地狱',
    description: '高等数学、复分析',
    color: 'from-red-400 to-red-600',
    icon: '🔥',
    examples: ['∮ f(z)dz = 0', 'Γ(n) = (n-1)!', 'ζ(s) = Σ 1/nˢ']
  }
};

const MainMenu: React.FC<MainMenuProps> = ({ onStartGame, onShowSettings, onShowStats }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);
  const [showDifficultyDetails, setShowDifficultyDetails] = useState(false);

  const handleDifficultySelect = (difficulty: DifficultyLevel) => {
    setSelectedDifficulty(difficulty);
    setShowDifficultyDetails(true);
  };

  const handleStartGame = () => {
    if (selectedDifficulty) {
      onStartGame(selectedDifficulty);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-white">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-4xl w-full"
      >
        {/* 游戏标题 */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-6xl md:text-8xl font-black font-game bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            MathChain
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-blue-200 mb-2">
            数链纪元
          </h2>
          <p className="text-lg text-blue-300 opacity-80">
            数学消除 · 智慧挑战 · 无限可能
          </p>
        </motion.div>

        {!showDifficultyDetails ? (
          <>
            {/* 难度选择 */}
            <motion.div variants={itemVariants} className="mb-8">
              <h3 className="text-2xl font-bold mb-6 text-center">选择难度</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {Object.entries(difficultyConfig).map(([difficulty, config]) => (
                  <motion.button
                    key={difficulty}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDifficultySelect(difficulty as DifficultyLevel)}
                    className={`
                      relative p-6 rounded-2xl bg-gradient-to-br ${config.color}
                      shadow-lg hover:shadow-xl transition-all duration-300
                      border border-white/20 backdrop-blur-sm
                      group overflow-hidden
                    `}
                  >
                    {/* 背景光效 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative z-10">
                      <div className="text-4xl mb-3">{config.icon}</div>
                      <h4 className="text-xl font-bold mb-2">{config.name}</h4>
                      <p className="text-sm opacity-90">{config.description}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* 菜单按钮 */}
            <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onShowStats}
                className="btn btn-secondary px-8 py-3"
              >
                📊 游戏统计
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onShowSettings}
                className="btn btn-primary px-8 py-3"
              >
                ⚙️ 设置
              </motion.button>
            </motion.div>
          </>
        ) : (
          /* 难度详情页面 */
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl mx-auto"
          >
            {selectedDifficulty && (
              <>
                <div className="mb-8">
                  <div className="text-6xl mb-4">
                    {difficultyConfig[selectedDifficulty].icon}
                  </div>
                  <h3 className="text-4xl font-bold mb-4">
                    {difficultyConfig[selectedDifficulty].name}级难度
                  </h3>
                  <p className="text-xl text-blue-200 mb-6">
                    {difficultyConfig[selectedDifficulty].description}
                  </p>
                </div>

                <div className="mb-8">
                  <h4 className="text-xl font-bold mb-4">题目示例：</h4>
                  <div className="grid gap-3">
                    {difficultyConfig[selectedDifficulty].examples.map((example, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center font-mono text-lg"
                      >
                        {example}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDifficultyDetails(false)}
                    className="btn bg-gray-600 hover:bg-gray-700 px-8 py-3"
                  >
                    ← 返回
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartGame}
                    className={`btn bg-gradient-to-r ${difficultyConfig[selectedDifficulty].color} px-12 py-3 text-xl font-bold`}
                  >
                    🚀 开始游戏
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* 游戏说明 */}
        {!showDifficultyDetails && (
          <motion.div variants={itemVariants} className="mt-12 text-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
              <h4 className="text-lg font-bold mb-3">🎮 游戏玩法</h4>
              <p className="text-sm text-blue-200 leading-relaxed">
                选择三个方块组成正确的数学表达式进行消除。连续消除可获得连击奖励！
                使用道具帮助你解决困难的局面，挑战更高的分数和等级。
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MainMenu;
