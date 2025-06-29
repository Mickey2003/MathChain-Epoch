import { describe, it, expect } from 'vitest';
import { MathEngine } from '../MathEngine';
import { DifficultyLevel, MathOperation } from '@/types/game';

describe('MathEngine', () => {
  const mathEngine = MathEngine.getInstance();

  describe('getDifficultyConfig', () => {
    it('should return correct config for elementary level', () => {
      const config = mathEngine.getDifficultyConfig(DifficultyLevel.ELEMENTARY);
      expect(config.numberRange).toEqual([1, 20]);
      expect(config.allowNegative).toBe(false);
      expect(config.allowDecimals).toBe(false);
    });

    it('should return correct config for hell level', () => {
      const config = mathEngine.getDifficultyConfig(DifficultyLevel.HELL);
      expect(config.numberRange).toEqual([1, 1000]);
      expect(config.allowNegative).toBe(true);
      expect(config.allowDecimals).toBe(true);
    });
  });

  describe('validateExpression', () => {
    it('should validate addition correctly', () => {
      const result = mathEngine.validateExpression(2, MathOperation.ADD, 3, 5);
      expect(result).toBe(true);
    });

    it('should validate subtraction correctly', () => {
      const result = mathEngine.validateExpression(5, MathOperation.SUBTRACT, 3, 2);
      expect(result).toBe(true);
    });

    it('should validate multiplication correctly', () => {
      const result = mathEngine.validateExpression(3, MathOperation.MULTIPLY, 4, 12);
      expect(result).toBe(true);
    });

    it('should validate division correctly', () => {
      const result = mathEngine.validateExpression(12, MathOperation.DIVIDE, 3, 4);
      expect(result).toBe(true);
    });

    it('should reject incorrect expressions', () => {
      const result = mathEngine.validateExpression(2, MathOperation.ADD, 3, 6);
      expect(result).toBe(false);
    });
  });

  describe('generateExpression', () => {
    it('should generate valid expressions for elementary level', () => {
      const expression = mathEngine.generateExpression(DifficultyLevel.ELEMENTARY);
      expect(expression).toHaveProperty('operand1');
      expect(expression).toHaveProperty('operation');
      expect(expression).toHaveProperty('operand2');
      expect(expression).toHaveProperty('result');
      expect(expression.difficulty).toBe(DifficultyLevel.ELEMENTARY);
    });

    it('should generate expressions with results within expected range', () => {
      for (let i = 0; i < 10; i++) {
        const expression = mathEngine.generateExpression(DifficultyLevel.ELEMENTARY);
        const isValid = mathEngine.validateExpression(
          expression.operand1,
          expression.operation,
          expression.operand2,
          expression.result
        );
        expect(isValid).toBe(true);
      }
    });
  });

  describe('checkValidCombination', () => {
    it('should validate correct combinations', () => {
      const result = mathEngine.checkValidCombination([2, '+', 3, 5]);
      expect(result.isValid).toBe(true);
      expect(result.expression).toBeDefined();
    });

    it('should reject invalid combinations', () => {
      const result = mathEngine.checkValidCombination([2, '+', 3, 7]);
      expect(result.isValid).toBe(false);
    });

    it('should handle different order combinations', () => {
      const result = mathEngine.checkValidCombination([5, 2, '+', 3]);
      expect(result.isValid).toBe(true);
    });
  });

  describe('calculateScore', () => {
    it('should calculate higher scores for harder difficulties', () => {
      const elementaryExpr = {
        id: 'test1',
        operand1: 2,
        operation: MathOperation.ADD,
        operand2: 3,
        result: 5,
        difficulty: DifficultyLevel.ELEMENTARY,
        isCorrect: true
      };

      const hellExpr = {
        id: 'test2',
        operand1: 2,
        operation: MathOperation.ADD,
        operand2: 3,
        result: 5,
        difficulty: DifficultyLevel.HELL,
        isCorrect: true
      };

      const elementaryScore = mathEngine.calculateScore(elementaryExpr);
      const hellScore = mathEngine.calculateScore(hellExpr);

      expect(hellScore).toBeGreaterThan(elementaryScore);
    });

    it('should apply combo multiplier correctly', () => {
      const expression = {
        id: 'test',
        operand1: 2,
        operation: MathOperation.ADD,
        operand2: 3,
        result: 5,
        difficulty: DifficultyLevel.ELEMENTARY,
        isCorrect: true
      };

      const baseScore = mathEngine.calculateScore(expression, 1);
      const comboScore = mathEngine.calculateScore(expression, 3);

      expect(comboScore).toBe(baseScore * 3);
    });
  });

  describe('getOperationDisplay', () => {
    it('should return correct display text for operations', () => {
      expect(mathEngine.getOperationDisplay(MathOperation.ADD)).toBe('+');
      expect(mathEngine.getOperationDisplay(MathOperation.MULTIPLY)).toBe('×');
      expect(mathEngine.getOperationDisplay(MathOperation.DIVIDE)).toBe('÷');
      expect(mathEngine.getOperationDisplay(MathOperation.SQRT)).toBe('√');
    });
  });
});
