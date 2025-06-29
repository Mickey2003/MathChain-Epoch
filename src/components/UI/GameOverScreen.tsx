import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGameStore } from '../../store/gameStore';

interface GameOverScreenProps {
  onRestart: () => void;
  onMenu: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ onRestart, onMenu }) => {
  const {
    score,
    level,
    maxCombo,
    moves,
    difficulty,
    stats
  } = useGameStore();

  const [showStats, setShowStats] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);

  // 检查是否创造新记录
  useEffect(() => {
    const isRecord = score > stats.bestScore;
    setIsNewRecord(isRecord);
    
    if (isRecord) {
      // 新记录庆祝动画
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
      }, 250);
      
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 400);
    }
  }, [score, stats.bestScore]);

  // 延迟显示统计信息
  useEffect(() => {
    const timer = setTimeout(() => setShowStats(true), 1000);
    return () => clearTimeout(timer);
  }, []);

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

  // 获取评价等级
  const getGradeInfo = () => {
    const percentage = Math.min((score / (level * 1000)) * 100, 100);
    
    if (percentage >= 90) return { grade: 'S', color: 'text-yellow-400', message: '完美表现！' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-400', message: '优秀！' };
    if (percentage >= 70) return { grade: 'B', color: 'text-blue-400', message: '良好！' };
    if (percentage >= 60) return { grade: 'C', color: 'text-purple-400', message: '及格！' };
    return { grade: 'D', color: 'text-red-400', message: '需要努力！' };
  };

  const gradeInfo = getGradeInfo();

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const contentVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.5,
      y: 100
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: 0.2
      }
    }
  };

  const statsVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1 + 0.5
      }
    })
  };

  return (
    <motion.div
      className="modal-overlay"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="modal-content bg-gradient-to-br from-gray-900 to-gray-800 text-white max-w-lg w-full mx-4"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 游戏结束标题 */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="text-6xl mb-4"
          >
            {isNewRecord ? '🏆' : '🎮'}
          </motion.div>
          
          <motion.h2 
            className="text-4xl font-bold mb-2"
            animate={isNewRecord ? {
              color: ['#fbbf24', '#f59e0b', '#fbbf24'],
              textShadow: [
                "0 0 0px rgba(251, 191, 36, 0)",
                "0 0 20px rgba(251, 191, 36, 0.8)",
                "0 0 0px rgba(251, 191, 36, 0)"
              ]
            } : {}}
            transition={{ duration: 1, repeat: isNewRecord ? Infinity : 0 }}
          >
            {isNewRecord ? '🎉 新记录！' : '游戏结束'}
          </motion.h2>
          
          <p className="text-gray-300">
            {getDifficultyName()}难度 · 等级 {level}
          </p>
        </div>

        {/* 评价等级 */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className={`text-8xl font-bold ${gradeInfo.color} mb-2`}
          >
            {gradeInfo.grade}
          </motion.div>
          <p className="text-lg text-gray-300">{gradeInfo.message}</p>
        </div>

        {/* 游戏统计 */}
        {showStats && (
          <div className="bg-black/20 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-bold mb-4 text-center">游戏统计</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: '最终分数', value: score.toLocaleString(), color: 'text-blue-400' },
                { label: '达到等级', value: level, color: 'text-purple-400' },
                { label: '最高连击', value: `${maxCombo}x`, color: 'text-yellow-400' },
                { label: '移动次数', value: moves, color: 'text-green-400' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  custom={index}
                  variants={statsVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-center"
                >
                  <div className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* 历史最佳 */}
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-3 mb-6">
          <div className="text-center">
            <div className="text-sm text-gray-300 mb-1">历史最佳分数</div>
            <div className="text-xl font-bold text-yellow-400">
              {Math.max(score, stats.bestScore).toLocaleString()}
            </div>
            {isNewRecord && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-green-400 mt-1"
              >
                ✨ 刚刚创造！
              </motion.div>
            )}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRestart}
            className="w-full btn btn-primary text-lg py-4 flex items-center justify-center gap-3"
          >
            <span className="text-xl">🔄</span>
            再来一局
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenu}
            className="w-full btn btn-secondary text-lg py-3 flex items-center justify-center gap-3"
          >
            <span className="text-xl">🏠</span>
            返回主菜单
          </motion.button>
        </div>

        {/* 分享提示 */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            🎯 挑战朋友一起来玩数链纪元！
          </p>
        </div>

        {/* 装饰性粒子 */}
        {isNewRecord && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                initial={{
                  x: '50%',
                  y: '50%',
                  scale: 0
                }}
                animate={{
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  delay: Math.random() * 2,
                  repeat: Infinity
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default GameOverScreen;
