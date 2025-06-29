import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { GameBlock, DifficultyLevel, MathOperation } from '@/types/game';
import GameBlockComponent from './GameBlock';

const GRID_SIZE = 8; // 8x8 网格

const GameBoard: React.FC = () => {
  const {
    difficulty,
    selectedBlocks,
    selectBlock,
    isPlaying,
    isPaused
  } = useGameStore();

  const [gameBlocks, setGameBlocks] = useState<GameBlock[][]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 根据难度生成数字范围和运算符
  const getDifficultyConfig = useCallback((diff: DifficultyLevel) => {
    switch (diff) {
      case DifficultyLevel.ELEMENTARY:
        return {
          numberRange: [1, 20],
          operations: [MathOperation.ADD, MathOperation.SUBTRACT, MathOperation.MULTIPLY],
          maxResult: 100
        };
      case DifficultyLevel.MIDDLE:
        return {
          numberRange: [1, 50],
          operations: [MathOperation.ADD, MathOperation.SUBTRACT, MathOperation.MULTIPLY, MathOperation.DIVIDE],
          maxResult: 200
        };
      case DifficultyLevel.HIGH:
        return {
          numberRange: [1, 100],
          operations: [MathOperation.ADD, MathOperation.SUBTRACT, MathOperation.MULTIPLY, MathOperation.DIVIDE, MathOperation.POWER],
          maxResult: 500
        };
      case DifficultyLevel.COLLEGE:
        return {
          numberRange: [1, 200],
          operations: [MathOperation.ADD, MathOperation.SUBTRACT, MathOperation.MULTIPLY, MathOperation.DIVIDE, MathOperation.POWER, MathOperation.SQRT, MathOperation.LOG],
          maxResult: 1000
        };
      case DifficultyLevel.HELL:
        return {
          numberRange: [1, 500],
          operations: Object.values(MathOperation),
          maxResult: 10000
        };
      default:
        return {
          numberRange: [1, 20],
          operations: [MathOperation.ADD, MathOperation.SUBTRACT],
          maxResult: 50
        };
    }
  }, []);

  // 生成随机数学表达式
  const generateMathExpression = useCallback((config: any) => {
    const { numberRange, operations } = config;
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let operand1 = Math.floor(Math.random() * (numberRange[1] - numberRange[0] + 1)) + numberRange[0];
    let operand2 = Math.floor(Math.random() * (numberRange[1] - numberRange[0] + 1)) + numberRange[0];
    let result: number;

    switch (operation) {
      case MathOperation.ADD:
        result = operand1 + operand2;
        break;
      case MathOperation.SUBTRACT:
        result = operand1 - operand2;
        if (result < 0) {
          [operand1, operand2] = [operand2, operand1];
          result = operand1 - operand2;
        }
        break;
      case MathOperation.MULTIPLY:
        result = operand1 * operand2;
        break;
      case MathOperation.DIVIDE:
        result = operand1;
        operand1 = result * operand2;
        break;
      case MathOperation.POWER:
        operand2 = Math.min(operand2, 4); // 限制指数大小
        result = Math.pow(operand1, operand2);
        break;
      default:
        result = operand1 + operand2;
    }

    return { operand1, operation, operand2, result };
  }, []);

  // 生成游戏方块
  const generateGameBlocks = useCallback(() => {
    const config = getDifficultyConfig(difficulty);
    const newBlocks: GameBlock[][] = [];

    // 生成一些正确的数学表达式
    const expressions = [];
    for (let i = 0; i < 5; i++) {
      expressions.push(generateMathExpression(config));
    }

    for (let row = 0; row < GRID_SIZE; row++) {
      newBlocks[row] = [];
      for (let col = 0; col < GRID_SIZE; col++) {
        const blockId = `${row}-${col}`;
        
        // 随机决定是否使用预设表达式的一部分
        if (Math.random() < 0.3 && expressions.length > 0) {
          const expr = expressions[Math.floor(Math.random() * expressions.length)];
          const parts = [expr.operand1, expr.operation, expr.operand2, expr.result];
          const part = parts[Math.floor(Math.random() * parts.length)];
          
          newBlocks[row][col] = {
            id: blockId,
            value: part,
            x: col,
            y: row,
            type: typeof part === 'number' ? 'number' : 'operation',
            isSelected: false,
            isMatched: false,
            isAnimating: false,
            color: getDifficultyColor(difficulty),
            difficulty
          };
        } else {
          // 生成随机数字或运算符
          const isNumber = Math.random() < 0.7;
          if (isNumber) {
            const value = Math.floor(Math.random() * (config.numberRange[1] - config.numberRange[0] + 1)) + config.numberRange[0];
            newBlocks[row][col] = {
              id: blockId,
              value,
              x: col,
              y: row,
              type: 'number',
              isSelected: false,
              isMatched: false,
              isAnimating: false,
              color: getDifficultyColor(difficulty),
              difficulty
            };
          } else {
            const operation = config.operations[Math.floor(Math.random() * config.operations.length)];
            newBlocks[row][col] = {
              id: blockId,
              value: operation,
              operation,
              x: col,
              y: row,
              type: 'operation',
              isSelected: false,
              isMatched: false,
              isAnimating: false,
              color: getDifficultyColor(difficulty),
              difficulty
            };
          }
        }
      }
    }

    return newBlocks;
  }, [difficulty, getDifficultyConfig, generateMathExpression]);

  // 获取难度对应的颜色
  const getDifficultyColor = (diff: DifficultyLevel): string => {
    switch (diff) {
      case DifficultyLevel.ELEMENTARY: return 'difficulty-elementary';
      case DifficultyLevel.MIDDLE: return 'difficulty-middle';
      case DifficultyLevel.HIGH: return 'difficulty-high';
      case DifficultyLevel.COLLEGE: return 'difficulty-college';
      case DifficultyLevel.HELL: return 'difficulty-hell';
      default: return 'difficulty-elementary';
    }
  };

  // 处理方块点击
  const handleBlockClick = (block: GameBlock) => {
    if (!isPlaying || isPaused || block.isMatched || block.isAnimating) {
      return;
    }

    selectBlock(block);
  };

  // 初始化游戏板
  useEffect(() => {
    if (isPlaying && !isInitialized) {
      const newBlocks = generateGameBlocks();
      setGameBlocks(newBlocks);
      setIsInitialized(true);
    }
  }, [isPlaying, isInitialized, generateGameBlocks]);

  // 重置游戏板
  useEffect(() => {
    if (!isPlaying) {
      setIsInitialized(false);
      setGameBlocks([]);
    }
  }, [isPlaying]);

  if (!isPlaying || gameBlocks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="game-board"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          width: 'min(90vw, 90vh)',
          height: 'min(90vw, 90vh)',
          maxWidth: '600px',
          maxHeight: '600px'
        }}
      >
        <AnimatePresence>
          {gameBlocks.map((row, rowIndex) =>
            row.map((block, colIndex) => (
              <GameBlockComponent
                key={block.id}
                block={block}
                onClick={() => handleBlockClick(block)}
                isSelected={selectedBlocks.some(b => b.id === block.id)}
                delay={rowIndex * 0.05 + colIndex * 0.02}
              />
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* 选择提示 */}
      {selectedBlocks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg"
        >
          <div className="text-white text-center">
            <p className="text-sm mb-2">已选择 {selectedBlocks.length}/3 个方块</p>
            <div className="flex gap-2 justify-center">
              {selectedBlocks.map((block, index) => (
                <span key={block.id} className="px-2 py-1 bg-yellow-500 rounded text-black font-bold">
                  {block.value}
                  {index < selectedBlocks.length - 1 && <span className="ml-1">→</span>}
                </span>
              ))}
            </div>
            {selectedBlocks.length < 3 && (
              <p className="text-xs mt-2 opacity-75">
                选择数字和运算符组成数学表达式
              </p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GameBoard;
