import React from 'react';
import { motion } from 'framer-motion';
import { GameBlock } from '@/types/game';

interface GameBlockProps {
  block: GameBlock;
  onClick: () => void;
  isSelected: boolean;
  delay?: number;
}

const GameBlockComponent: React.FC<GameBlockProps> = ({ 
  block, 
  onClick, 
  isSelected, 
  delay = 0 
}) => {
  // 获取方块显示内容
  const getDisplayValue = () => {
    if (typeof block.value === 'string') {
      return block.value;
    }
    return block.value.toString();
  };

  // 获取方块样式类
  const getBlockClasses = () => {
    let classes = `game-block ${block.color}`;
    
    if (isSelected) {
      classes += ' selected';
    }
    
    if (block.isMatched) {
      classes += ' matched';
    }
    
    if (block.type === 'operation') {
      classes += ' font-bold text-xl';
    }
    
    return classes;
  };

  // 获取方块大小（根据内容调整）
  const getBlockSize = () => {
    const value = getDisplayValue();
    if (value.length > 3) {
      return 'text-sm';
    } else if (value.length > 2) {
      return 'text-base';
    }
    return 'text-lg';
  };

  // 动画变体
  const blockVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
      rotateY: -180
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay
      }
    },
    hover: {
      scale: 1.05,
      rotateY: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    selected: {
      scale: 1.1,
      rotateY: 10,
      boxShadow: "0 0 20px rgba(251, 191, 36, 0.8)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    },
    matched: {
      scale: 0,
      opacity: 0,
      rotateY: 180,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  // 粒子效果（选中时）
  const ParticleEffect = () => {
    if (!isSelected) return null;

    return (
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full"
            initial={{
              x: "50%",
              y: "50%",
              scale: 0
            }}
            animate={{
              x: `${50 + (Math.cos(i * Math.PI / 4) * 100)}%`,
              y: `${50 + (Math.sin(i * Math.PI / 4) * 100)}%`,
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.1
            }}
          />
        ))}
      </div>
    );
  };

  // 特殊效果（根据方块类型）
  const getSpecialEffect = () => {
    if (block.type === 'operation') {
      return (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      );
    }
    return null;
  };

  return (
    <motion.div
      className={`${getBlockClasses()} ${getBlockSize()} relative overflow-hidden cursor-pointer select-none`}
      variants={blockVariants}
      initial="hidden"
      animate={
        block.isMatched 
          ? "matched" 
          : isSelected 
            ? "selected" 
            : "visible"
      }
      whileHover={!block.isMatched && !isSelected ? "hover" : undefined}
      whileTap={!block.isMatched ? "tap" : undefined}
      onClick={onClick}
      style={{
        aspectRatio: '1',
        minHeight: '40px',
        minWidth: '40px'
      }}
    >
      {/* 背景渐变效果 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
      
      {/* 特殊效果 */}
      {getSpecialEffect()}
      
      {/* 粒子效果 */}
      <ParticleEffect />
      
      {/* 主要内容 */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <motion.span
          className="font-bold drop-shadow-sm"
          animate={isSelected ? {
            scale: [1, 1.1, 1],
            transition: {
              duration: 0.5,
              repeat: Infinity
            }
          } : {}}
        >
          {getDisplayValue()}
        </motion.span>
      </div>
      
      {/* 选中边框 */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 border-2 border-yellow-400 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity
          }}
        />
      )}
      
      {/* 匹配成功效果 */}
      {block.isMatched && (
        <motion.div
          className="absolute inset-0 bg-green-400 rounded-lg flex items-center justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.2, 0],
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-white text-2xl">✓</span>
        </motion.div>
      )}
      
      {/* 类型指示器 */}
      <div className="absolute top-1 right-1 w-2 h-2 rounded-full opacity-60">
        <div className={`w-full h-full rounded-full ${
          block.type === 'number' ? 'bg-blue-400' : 
          block.type === 'operation' ? 'bg-orange-400' : 
          'bg-green-400'
        }`} />
      </div>
    </motion.div>
  );
};

export default GameBlockComponent;
