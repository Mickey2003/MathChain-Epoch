import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const {
    soundEnabled,
    musicEnabled,
    vibrationEnabled,
    toggleSound,
    toggleMusic,
    toggleVibration
  } = useGameStore();

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

  const ToggleSwitch: React.FC<{
    enabled: boolean;
    onToggle: () => void;
    label: string;
    description: string;
    icon: string;
  }> = ({ enabled, onToggle, label, description, icon }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
    >
      <div className="flex items-center space-x-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <div className="font-semibold text-white">{label}</div>
          <div className="text-sm text-gray-300">{description}</div>
        </div>
      </div>
      
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        className={`
          relative w-14 h-8 rounded-full transition-colors duration-200
          ${enabled ? 'bg-blue-500' : 'bg-gray-600'}
        `}
      >
        <motion.div
          className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
          animate={{
            x: enabled ? 30 : 2
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </motion.div>
  );

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
        className="modal-content bg-gradient-to-br from-gray-900 to-gray-800 text-white max-w-md w-full mx-4"
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
            ⚙️ 游戏设置
          </motion.h2>
          <p className="text-gray-300">自定义你的游戏体验</p>
        </div>

        {/* 音频设置 */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-4 text-blue-400">🔊 音频设置</h3>
          <div className="space-y-3">
            <ToggleSwitch
              enabled={soundEnabled}
              onToggle={toggleSound}
              label="音效"
              description="游戏音效和提示音"
              icon="🔊"
            />
            
            <ToggleSwitch
              enabled={musicEnabled}
              onToggle={toggleMusic}
              label="背景音乐"
              description="游戏背景音乐"
              icon="🎵"
            />
          </div>
        </div>

        {/* 反馈设置 */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-4 text-purple-400">📱 反馈设置</h3>
          <div className="space-y-3">
            <ToggleSwitch
              enabled={vibrationEnabled}
              onToggle={toggleVibration}
              label="震动反馈"
              description="触摸和操作时的震动反馈"
              icon="📳"
            />
          </div>
        </div>

        {/* 游戏信息 */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-4 text-green-400">ℹ️ 游戏信息</h3>
          <div className="bg-white/5 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">版本</span>
              <span className="text-white font-semibold">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">开发者</span>
              <span className="text-white font-semibold">MathChain Team</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">引擎</span>
              <span className="text-white font-semibold">React + Canvas</span>
            </div>
          </div>
        </div>

        {/* 快捷键说明 */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-4 text-yellow-400">⌨️ 快捷键</h3>
          <div className="bg-white/5 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">暂停/继续</span>
              <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">ESC</kbd>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">继续游戏</span>
              <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">空格</kbd>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">重新开始</span>
              <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Ctrl+R</kbd>
            </div>
          </div>
        </div>

        {/* 关闭按钮 */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="w-full btn btn-primary text-lg py-3 flex items-center justify-center gap-3"
        >
          <span className="text-xl">✓</span>
          确定
        </motion.button>

        {/* 装饰性动画 */}
        <div className="absolute top-4 right-4 opacity-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="text-3xl"
          >
            ⚙️
          </motion.div>
        </div>

        {/* 背景装饰 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingsModal;
