import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

const ParticleSystem: React.FC = () => {
  const { particles, removeParticle } = useGameStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  // Canvas粒子系统（用于复杂粒子效果）
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置canvas尺寸
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 粒子类
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      color: string;
      type: string;

      constructor(x: number, y: number, type: string = 'star') {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4 - 2;
        this.life = 1;
        this.maxLife = 60 + Math.random() * 60;
        this.size = 2 + Math.random() * 4;
        this.type = type;
        
        switch (type) {
          case 'star':
            this.color = `hsl(${45 + Math.random() * 60}, 100%, 70%)`;
            break;
          case 'explosion':
            this.color = `hsl(${Math.random() * 60}, 100%, 60%)`;
            this.vx *= 2;
            this.vy *= 2;
            break;
          case 'sparkle':
            this.color = `hsl(${200 + Math.random() * 160}, 80%, 80%)`;
            this.size *= 0.5;
            break;
          default:
            this.color = '#ffffff';
        }
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1; // 重力
        this.vx *= 0.99; // 阻力
        this.life--;
        
        if (this.type === 'sparkle') {
          this.vx *= 0.95;
          this.vy *= 0.95;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        const alpha = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        
        if (this.type === 'star') {
          // 绘制星形
          ctx.fillStyle = this.color;
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5;
            const x = this.x + Math.cos(angle) * this.size;
            const y = this.y + Math.sin(angle) * this.size;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fill();
        } else if (this.type === 'explosion') {
          // 绘制爆炸粒子
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
          
          // 添加发光效果
          ctx.shadowColor = this.color;
          ctx.shadowBlur = this.size * 2;
          ctx.fill();
        } else if (this.type === 'sparkle') {
          // 绘制闪烁粒子
          ctx.strokeStyle = this.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(this.x - this.size, this.y);
          ctx.lineTo(this.x + this.size, this.y);
          ctx.moveTo(this.x, this.y - this.size);
          ctx.lineTo(this.x, this.y + this.size);
          ctx.stroke();
        }
        
        ctx.restore();
      }

      isDead() {
        return this.life <= 0;
      }
    }

    // 粒子数组
    let canvasParticles: Particle[] = [];

    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 更新和绘制粒子
      canvasParticles = canvasParticles.filter(particle => {
        particle.update();
        particle.draw(ctx);
        return !particle.isDead();
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // 暴露添加粒子的函数
    (window as any).addCanvasParticles = (x: number, y: number, count: number = 10, type: string = 'star') => {
      for (let i = 0; i < count; i++) {
        canvasParticles.push(new Particle(x, y, type));
      }
    };

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      delete (window as any).addCanvasParticles;
    };
  }, []);

  // React粒子组件（用于简单的DOM粒子）
  const ReactParticle: React.FC<{ particle: any }> = ({ particle }) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        removeParticle(particle.id);
      }, particle.duration);

      return () => clearTimeout(timer);
    }, [particle]);

    const getParticleComponent = () => {
      switch (particle.type) {
        case 'stars':
          return (
            <motion.div
              className="particle absolute pointer-events-none"
              style={{
                left: particle.x,
                top: particle.y,
                color: particle.color
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [0, -50],
                x: [0, (Math.random() - 0.5) * 100]
              }}
              transition={{ duration: particle.duration / 1000 }}
            >
              {[...Array(particle.count)].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute text-yellow-400"
                  style={{
                    left: Math.random() * 20 - 10,
                    top: Math.random() * 20 - 10
                  }}
                  animate={{
                    rotate: 360,
                    scale: [1, 1.5, 1]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                >
                  ⭐
                </motion.span>
              ))}
            </motion.div>
          );

        case 'explosion':
          return (
            <motion.div
              className="particle absolute pointer-events-none"
              style={{
                left: particle.x,
                top: particle.y
              }}
              initial={{ scale: 0 }}
              animate={{ scale: [0, 2, 0] }}
              transition={{ duration: particle.duration / 1000 }}
            >
              {[...Array(particle.count)].map((_, i) => {
                const angle = (i / particle.count) * Math.PI * 2;
                const distance = 50;
                return (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{ backgroundColor: particle.color }}
                    animate={{
                      x: Math.cos(angle) * distance,
                      y: Math.sin(angle) * distance,
                      opacity: [1, 0]
                    }}
                    transition={{ duration: particle.duration / 1000 }}
                  />
                );
              })}
            </motion.div>
          );

        case 'sparkle':
          return (
            <motion.div
              className="particle absolute pointer-events-none"
              style={{
                left: particle.x,
                top: particle.y,
                color: particle.color
              }}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0.5, 1.5, 0.5]
              }}
              transition={{ 
                duration: particle.duration / 1000,
                repeat: 3
              }}
            >
              ✨
            </motion.div>
          );

        case 'numbers':
          return (
            <motion.div
              className="particle absolute pointer-events-none font-bold text-2xl"
              style={{
                left: particle.x,
                top: particle.y,
                color: particle.color
              }}
              initial={{ opacity: 0, scale: 0.5, y: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0.5, 1.2, 1],
                y: -100
              }}
              transition={{ duration: particle.duration / 1000 }}
            >
              +{Math.floor(Math.random() * 1000)}
            </motion.div>
          );

        default:
          return null;
      }
    };

    return getParticleComponent();
  };

  return (
    <>
      {/* Canvas粒子系统 */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ mixBlendMode: 'screen' }}
      />
      
      {/* React粒子系统 */}
      <div className="fixed inset-0 pointer-events-none z-40">
        <AnimatePresence>
          {particles.map((particle) => (
            <ReactParticle key={particle.id} particle={particle} />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ParticleSystem;
