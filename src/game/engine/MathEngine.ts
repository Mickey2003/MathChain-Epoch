import { DifficultyLevel, MathOperation, MathExpression } from '../../types/game';

export class MathEngine {
  private static instance: MathEngine;

  public static getInstance(): MathEngine {
    if (!MathEngine.instance) {
      MathEngine.instance = new MathEngine();
    }
    return MathEngine.instance;
  }

  // 根据难度获取配置
  public getDifficultyConfig(difficulty: DifficultyLevel): {
    numberRange: [number, number];
    operations: MathOperation[];
    allowNegative: boolean;
    allowDecimals: boolean;
    maxResult: number;
  } {
    switch (difficulty) {
      case DifficultyLevel.ELEMENTARY:
        return {
          numberRange: [1, 20],
          operations: [MathOperation.ADD, MathOperation.SUBTRACT, MathOperation.MULTIPLY],
          allowNegative: false,
          allowDecimals: false,
          maxResult: 100
        };
      
      case DifficultyLevel.MIDDLE:
        return {
          numberRange: [1, 50],
          operations: [MathOperation.ADD, MathOperation.SUBTRACT, MathOperation.MULTIPLY, MathOperation.DIVIDE],
          allowNegative: true,
          allowDecimals: true,
          maxResult: 500
        };
      
      case DifficultyLevel.HIGH:
        return {
          numberRange: [1, 100],
          operations: [MathOperation.ADD, MathOperation.SUBTRACT, MathOperation.MULTIPLY, MathOperation.DIVIDE, MathOperation.POWER],
          allowNegative: true,
          allowDecimals: true,
          maxResult: 1000
        };
      
      case DifficultyLevel.COLLEGE:
        return {
          numberRange: [1, 200],
          operations: [
            MathOperation.ADD, MathOperation.SUBTRACT, MathOperation.MULTIPLY, 
            MathOperation.DIVIDE, MathOperation.POWER, MathOperation.SQRT, MathOperation.LOG
          ],
          allowNegative: true,
          allowDecimals: true,
          maxResult: 5000
        };
      
      case DifficultyLevel.HELL:
        return {
          numberRange: [1, 1000],
          operations: Object.values(MathOperation),
          allowNegative: true,
          allowDecimals: true,
          maxResult: 100000
        };
      
      default:
        return this.getDifficultyConfig(DifficultyLevel.ELEMENTARY);
    }
  }

  // 生成数学表达式
  public generateExpression(difficulty: DifficultyLevel): MathExpression {
    const config = this.getDifficultyConfig(difficulty);
    const operation = config.operations[Math.floor(Math.random() * config.operations.length)];
    
    let operand1 = this.generateNumber(config.numberRange);
    let operand2 = this.generateNumber(config.numberRange);
    let result: number;

    switch (operation) {
      case MathOperation.ADD:
        result = operand1 + operand2;
        break;
      
      case MathOperation.SUBTRACT:
        result = operand1 - operand2;
        if (!config.allowNegative && result < 0) {
          [operand1, operand2] = [operand2, operand1];
          result = operand1 - operand2;
        }
        break;
      
      case MathOperation.MULTIPLY:
        // 限制乘法结果不要太大
        operand1 = Math.min(operand1, 20);
        operand2 = Math.min(operand2, 20);
        result = operand1 * operand2;
        break;
      
      case MathOperation.DIVIDE:
        // 确保整除
        result = operand1;
        operand1 = result * operand2;
        if (operand1 > config.maxResult) {
          operand2 = Math.max(1, Math.floor(config.maxResult / result));
          operand1 = result * operand2;
        }
        break;
      
      case MathOperation.POWER:
        operand2 = Math.min(operand2, 4); // 限制指数
        operand1 = Math.min(operand1, 10); // 限制底数
        result = Math.pow(operand1, operand2);
        break;
      
      case MathOperation.SQRT:
        // 生成完全平方数
        result = Math.floor(Math.sqrt(operand1));
        operand1 = result * result;
        operand2 = 0; // 平方根只需要一个操作数
        break;
      
      case MathOperation.LOG:
        // 简化对数运算
        operand1 = Math.pow(2, Math.min(operand2, 10));
        result = operand2;
        break;
      
      case MathOperation.SIN:
        // 使用特殊角度
        const angles = [0, 30, 45, 60, 90];
        operand1 = angles[Math.floor(Math.random() * angles.length)];
        result = Math.round(Math.sin(operand1 * Math.PI / 180) * 100) / 100;
        operand2 = 0;
        break;
      
      case MathOperation.COS:
        const cosAngles = [0, 30, 45, 60, 90];
        operand1 = cosAngles[Math.floor(Math.random() * cosAngles.length)];
        result = Math.round(Math.cos(operand1 * Math.PI / 180) * 100) / 100;
        operand2 = 0;
        break;
      
      default:
        result = operand1 + operand2;
    }

    return {
      id: `expr_${Date.now()}_${Math.random()}`,
      operand1,
      operation,
      operand2,
      result: Math.round(result * 100) / 100, // 保留两位小数
      difficulty,
      isCorrect: true
    };
  }

  // 验证表达式是否正确
  public validateExpression(operand1: number, operation: MathOperation, operand2: number, result: number): boolean {
    let expectedResult: number;

    switch (operation) {
      case MathOperation.ADD:
        expectedResult = operand1 + operand2;
        break;
      case MathOperation.SUBTRACT:
        expectedResult = operand1 - operand2;
        break;
      case MathOperation.MULTIPLY:
        expectedResult = operand1 * operand2;
        break;
      case MathOperation.DIVIDE:
        expectedResult = operand2 !== 0 ? operand1 / operand2 : NaN;
        break;
      case MathOperation.POWER:
        expectedResult = Math.pow(operand1, operand2);
        break;
      case MathOperation.SQRT:
        expectedResult = Math.sqrt(operand1);
        break;
      case MathOperation.LOG:
        expectedResult = Math.log2(operand1);
        break;
      case MathOperation.SIN:
        expectedResult = Math.sin(operand1 * Math.PI / 180);
        break;
      case MathOperation.COS:
        expectedResult = Math.cos(operand1 * Math.PI / 180);
        break;
      case MathOperation.TAN:
        expectedResult = Math.tan(operand1 * Math.PI / 180);
        break;
      default:
        return false;
    }

    // 允许小的浮点数误差
    return Math.abs(expectedResult - result) < 0.01;
  }

  // 检查三个值是否能组成有效的数学表达式
  public checkValidCombination(values: (number | string)[]): { isValid: boolean; expression?: MathExpression } {
    if (values.length !== 3) return { isValid: false };

    // 尝试不同的组合顺序
    const combinations = [
      [values[0], values[1], values[2]], // a op b = c
      [values[0], values[2], values[1]], // a op c = b
      [values[1], values[0], values[2]], // b op a = c
      [values[1], values[2], values[0]], // b op c = a
      [values[2], values[0], values[1]], // c op a = b
      [values[2], values[1], values[0]]  // c op b = a
    ];

    for (const combo of combinations) {
      const [first, second, third] = combo;
      
      // 检查是否有运算符
      if (typeof second === 'string' && Object.values(MathOperation).includes(second as MathOperation)) {
        const operand1 = typeof first === 'number' ? first : parseFloat(first as string);
        const operation = second as MathOperation;
        const operand2 = typeof third === 'number' ? third : parseFloat(third as string);
        
        if (!isNaN(operand1) && !isNaN(operand2)) {
          // 计算预期结果
          let expectedResult: number;
          
          try {
            switch (operation) {
              case MathOperation.ADD:
                expectedResult = operand1 + operand2;
                break;
              case MathOperation.SUBTRACT:
                expectedResult = operand1 - operand2;
                break;
              case MathOperation.MULTIPLY:
                expectedResult = operand1 * operand2;
                break;
              case MathOperation.DIVIDE:
                if (operand2 === 0) continue;
                expectedResult = operand1 / operand2;
                break;
              case MathOperation.POWER:
                expectedResult = Math.pow(operand1, operand2);
                break;
              default:
                continue;
            }

            // 检查是否有其他值匹配结果
            const remainingValues = values.filter(v => v !== first && v !== second && v !== third);
            for (const remaining of remainingValues) {
              const resultValue = typeof remaining === 'number' ? remaining : parseFloat(remaining as string);
              if (!isNaN(resultValue) && Math.abs(expectedResult - resultValue) < 0.01) {
                return {
                  isValid: true,
                  expression: {
                    id: `match_${Date.now()}`,
                    operand1,
                    operation,
                    operand2,
                    result: resultValue,
                    difficulty: DifficultyLevel.ELEMENTARY, // 默认难度
                    isCorrect: true
                  }
                };
              }
            }
          } catch (error) {
            continue;
          }
        }
      }
    }

    return { isValid: false };
  }

  // 生成随机数
  private generateNumber(range: [number, number]): number {
    return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
  }

  // 获取运算符的显示文本
  public getOperationDisplay(operation: MathOperation): string {
    switch (operation) {
      case MathOperation.ADD: return '+';
      case MathOperation.SUBTRACT: return '-';
      case MathOperation.MULTIPLY: return '×';
      case MathOperation.DIVIDE: return '÷';
      case MathOperation.POWER: return '^';
      case MathOperation.SQRT: return '√';
      case MathOperation.LOG: return 'log₂';
      case MathOperation.SIN: return 'sin';
      case MathOperation.COS: return 'cos';
      case MathOperation.TAN: return 'tan';
      case MathOperation.INTEGRAL: return '∫';
      case MathOperation.DERIVATIVE: return 'd/dx';
      default: return operation;
    }
  }

  // 计算分数（基于难度和表达式复杂度）
  public calculateScore(expression: MathExpression, combo: number = 1): number {
    let baseScore = 100;

    // 根据难度调整基础分数
    switch (expression.difficulty) {
      case DifficultyLevel.ELEMENTARY:
        baseScore = 100;
        break;
      case DifficultyLevel.MIDDLE:
        baseScore = 200;
        break;
      case DifficultyLevel.HIGH:
        baseScore = 300;
        break;
      case DifficultyLevel.COLLEGE:
        baseScore = 500;
        break;
      case DifficultyLevel.HELL:
        baseScore = 1000;
        break;
    }

    // 根据运算符复杂度调整
    switch (expression.operation) {
      case MathOperation.ADD:
      case MathOperation.SUBTRACT:
        baseScore *= 1;
        break;
      case MathOperation.MULTIPLY:
      case MathOperation.DIVIDE:
        baseScore *= 1.5;
        break;
      case MathOperation.POWER:
      case MathOperation.SQRT:
        baseScore *= 2;
        break;
      case MathOperation.LOG:
      case MathOperation.SIN:
      case MathOperation.COS:
      case MathOperation.TAN:
        baseScore *= 3;
        break;
      default:
        baseScore *= 1;
    }

    // 连击奖励
    const comboMultiplier = Math.min(combo, 10); // 最大10倍连击
    
    return Math.round(baseScore * comboMultiplier);
  }
}
