import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

interface GameHUDProps {
  onPause: () => void;
  onMenu: () => void;
}

const GameHUD: React.FC<GameHUDProps> = ({ onPause, onMenu }) => {
  const {
    level,
    score,
    moves,
    timeLeft,
    difficulty,
    combo,
    maxCombo,
    powerUps,
    usePowerUp
  } = useGameStore();

  const [displayScore, setDisplayScore] = useState(0);
  const [timeWarning, setTimeWarning] = useState(false);

  // 分数动画效果
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayScore(prev => {
        const diff = score - prev;
        if (diff === 0) return prev;
        return prev + Math.ceil(diff / 10);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [score]);

  // 时间警告效果
  useEffect(() => {
    setTimeWarning(timeLeft <= 30 && timeLeft > 0);
  }, [timeLeft]);

  // 格式化时间显示
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 获取难度显示名称
  const getDifficultyName = () => {
    const names = {
      elementary: '小学',
      middle: '初中',
      high: '高中',
      college: '大学',
      hell: '地狱'
    };
    return names[difficulty] || '未知';
  };

  // 获取难度颜色
  const getDifficultyColor = () => {
    const colors = {
      elementary: 'text-green-400',
      middle: 'text-blue-400',
      high: 'text-purple-400',
      college: 'text-yellow-400',
      hell: 'text-red-400'
    };
    return colors[difficulty] || 'text-gray-400';
  };

  return (
    <div className="w-full bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* 左侧：游戏信息 */}
          <div className="flex items-center space-x-6">
            {/* 等级和难度 */}
            <div className="text-white">
              <div className="text-sm opacity-75">等级</div>
              <div className="text-xl font-bold">{level}</div>
              <div className={`text-xs ${getDifficultyColor()}`}>
                {getDifficultyName()}
              </div>
            </div>

            {/* 分数 */}
            <div className="text-white">
              <div className="text-sm opacity-75">分数</div>
              <motion.div 
                className="text-2xl font-bold"
                animate={displayScore !== score ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {displayScore.toLocaleString()}
              </motion.div>
            </div>

            {/* 连击 */}
            <AnimatePresence>
              {combo > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="text-white"
                >
                  <div className="text-sm opacity-75">连击</div>
                  <motion.div 
                    className="text-xl font-bold text-yellow-400"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      textShadow: [
                        "0 0 0px rgba(251, 191, 36, 0)",
                        "0 0 10px rgba(251, 191, 36, 0.8)",
                        "0 0 0px rgba(251, 191, 36, 0)"
                      ]
                    }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    {combo}x
                  </motion.div>
                  <div className="text-xs text-yellow-300">
                    最高: {maxCombo}x
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 移动次数 */}
            <div className="text-white">
              <div className="text-sm opacity-75">移动</div>
              <div className="text-xl font-bold">{moves}</div>
            </div>
          </div>

          {/* 中间：时间 */}
          <div className="text-center">
            <div className="text-sm text-white opacity-75 mb-1">剩余时间</div>
            <motion.div
              className={`text-3xl font-bold ${timeWarning ? 'text-red-400' : 'text-white'}`}
              animate={timeWarning ? {
                scale: [1, 1.1, 1],
                color: ['#f87171', '#dc2626', '#f87171']
              } : {}}
              transition={{ duration: 0.5, repeat: timeWarning ? Infinity : 0 }}
            >
              {formatTime(timeLeft)}
            </motion.div>
            {timeWarning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-xs text-red-300 mt-1"
              >
                ⚠️ 时间不足！
              </motion.div>
            )}
          </div>

          {/* 右侧：道具和控制 */}
          <div className="flex items-center space-x-4">
            {/* 道具栏 */}
            <div className="flex space-x-2">
              {powerUps.slice(0, 3).map((powerUp) => (
                <motion.button
                  key={powerUp.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => powerUp.count > 0 && usePowerUp(powerUp.type)}
                  disabled={powerUp.count === 0}
                  className={`
                    relative w-12 h-12 rounded-lg border-2 transition-all
                    ${powerUp.count > 0 
                      ? 'bg-blue-600 border-blue-400 hover:bg-blue-500 cursor-pointer' 
                      : 'bg-gray-600 border-gray-500 cursor-not-allowed opacity-50'
                    }
                  `}
                  title={powerUp.description}
                >
                  <span className="text-lg">{powerUp.icon}</span>
                  {powerUp.count > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-black">
                      {powerUp.count}
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* 控制按钮 */}
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onPause}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg font-bold transition-colors"
              >
                ⏸️ 暂停
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onMenu}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold transition-colors"
              >
                🏠 菜单
              </motion.button>
            </div>
          </div>
        </div>

        {/* 进度条（可选） */}
        <div className="mt-3">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((score / (level * 1000)) * 100, 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="text-xs text-white opacity-75 mt-1 text-center">
            下一等级: {(level * 1000).toLocaleString()} 分
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHUD;
