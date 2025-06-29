import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

interface PauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
  onMenu: () => void;
  onSettings: () => void;
}

const PauseMenu: React.FC<PauseMenuProps> = ({ 
  onResume, 
  onRestart, 
  onMenu, 
  onSettings 
}) => {
  const { score, level, combo, timeLeft } = useGameStore();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const menuVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: -50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: 50,
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { 
      scale: 0.95,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  return (
    <motion.div
      className="modal-overlay"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        className="modal-content bg-gradient-to-br from-gray-900 to-gray-800 text-white max-w-md w-full mx-4"
        variants={menuVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
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
            ⏸️ 游戏暂停
          </motion.h2>
          <p className="text-gray-300">游戏已暂停，选择你的下一步行动</p>
        </div>

        {/* 当前游戏状态 */}
        <div className="bg-black/20 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-bold mb-3 text-center">当前状态</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-400">{score.toLocaleString()}</div>
              <div className="text-sm text-gray-300">分数</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{level}</div>
              <div className="text-sm text-gray-300">等级</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">{combo}x</div>
              <div className="text-sm text-gray-300">连击</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{formatTime(timeLeft)}</div>
              <div className="text-sm text-gray-300">剩余时间</div>
            </div>
          </div>
        </div>

        {/* 菜单按钮 */}
        <div className="space-y-3">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={onResume}
            className="w-full btn btn-primary text-lg py-4 flex items-center justify-center gap-3"
          >
            <span className="text-xl">▶️</span>
            继续游戏
          </motion.button>

          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={onSettings}
            className="w-full btn btn-secondary text-lg py-3 flex items-center justify-center gap-3"
          >
            <span className="text-xl">⚙️</span>
            设置
          </motion.button>

          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={onRestart}
            className="w-full btn btn-warning text-lg py-3 flex items-center justify-center gap-3"
          >
            <span className="text-xl">🔄</span>
            重新开始
          </motion.button>

          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={onMenu}
            className="w-full btn btn-danger text-lg py-3 flex items-center justify-center gap-3"
          >
            <span className="text-xl">🏠</span>
            返回主菜单
          </motion.button>
        </div>

        {/* 提示信息 */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            💡 提示：按 <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">ESC</kbd> 或 
            <kbd className="px-2 py-1 bg-gray-700 rounded text-xs ml-1">空格</kbd> 继续游戏
          </p>
        </div>

        {/* 装饰性动画 */}
        <div className="absolute top-4 right-4 opacity-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="text-4xl"
          >
            ⚙️
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PauseMenu;
