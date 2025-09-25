import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  size: number;
  shape: 'circle' | 'square' | 'triangle';
  gravity: number;
}

interface ConfettiCelebrationProps {
  trigger: boolean;
  duration?: number;
  particleCount?: number;
  colors?: string[];
  onComplete?: () => void;
}

const defaultColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
  '#FF9F43', '#6C5CE7', '#A29BFE', '#FD79A8', '#FDCB6E'
];

export const ConfettiCelebration = ({
  trigger,
  duration = 3000,
  particleCount = 100,
  colors = defaultColors,
  onComplete
}: ConfettiCelebrationProps) => {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);
  const [isActive, setIsActive] = useState(false);

  const createParticle = (id: number): ConfettiParticle => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    return {
      id,
      x: centerX + (Math.random() - 0.5) * 200,
      y: centerY + (Math.random() - 0.5) * 100,
      vx: (Math.random() - 0.5) * 15,
      vy: Math.random() * -20 - 10,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      shape: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as 'circle' | 'square' | 'triangle',
      gravity: 0.5 + Math.random() * 0.3
    };
  };

  const updateParticle = (particle: ConfettiParticle): ConfettiParticle => {
    return {
      ...particle,
      x: particle.x + particle.vx,
      y: particle.y + particle.vy,
      vx: particle.vx * 0.995,
      vy: particle.vy + particle.gravity,
      rotation: particle.rotation + particle.rotationSpeed
    };
  };

  useEffect(() => {
    if (!trigger) return;

    setIsActive(true);

    // Create initial particles
    const initialParticles = Array.from({ length: particleCount }, (_, i) => createParticle(i));
    setParticles(initialParticles);

    let animationFrame: number;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;

      if (elapsed > duration) {
        setParticles([]);
        setIsActive(false);
        onComplete?.();
        return;
      }

      setParticles(currentParticles =>
        currentParticles
          .map(updateParticle)
          .filter(particle =>
            particle.y < window.innerHeight + 100 &&
            particle.x > -100 &&
            particle.x < window.innerWidth + 100
          )
      );

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      setParticles([]);
      setIsActive(false);
    };
  }, [trigger, duration, particleCount, onComplete]);

  const renderParticle = (particle: ConfettiParticle) => {
    const style = {
      position: 'absolute' as const,
      left: `${particle.x}px`,
      top: `${particle.y}px`,
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      backgroundColor: particle.color,
      transform: `rotate(${particle.rotation}deg)`,
      pointerEvents: 'none' as const,
      zIndex: 9999
    };

    switch (particle.shape) {
      case 'circle':
        return (
          <div
            key={particle.id}
            style={{
              ...style,
              borderRadius: '50%'
            }}
          />
        );

      case 'square':
        return (
          <div
            key={particle.id}
            style={style}
          />
        );

      case 'triangle':
        return (
          <div
            key={particle.id}
            style={{
              ...style,
              width: 0,
              height: 0,
              backgroundColor: 'transparent',
              borderLeft: `${particle.size / 2}px solid transparent`,
              borderRight: `${particle.size / 2}px solid transparent`,
              borderBottom: `${particle.size}px solid ${particle.color}`
            }}
          />
        );

      default:
        return null;
    }
  };

  if (!isActive || particles.length === 0) return null;

  return createPortal(
    <div
      className="fixed inset-0 pointer-events-none z-[9999]"
      aria-hidden="true"
    >
      {particles.map(renderParticle)}
    </div>,
    document.body
  );
};

// Achievement notification component
interface AchievementNotificationProps {
  isVisible: boolean;
  title: string;
  description: string;
  icon?: string;
  onClose?: () => void;
}

export const AchievementNotification = ({
  isVisible,
  title,
  description,
  icon = '🏆',
  onClose
}: AchievementNotificationProps) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        onClose?.();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!shouldRender) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-[9998] animate-in slide-in-from-right-full duration-500">
      <div className={cn(
        "bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg shadow-2xl",
        "border border-yellow-300 backdrop-blur-sm",
        "transform transition-all duration-500 ease-out",
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}>
        <div className="flex items-start gap-3">
          <div className="text-2xl animate-bounce">
            {icon}
          </div>

          <div className="flex-1">
            <div className="font-bold text-lg mb-1">
              {title}
            </div>
            <div className="text-sm opacity-90">
              {description}
            </div>
          </div>

          <button
            onClick={() => {
              setShouldRender(false);
              onClose?.();
            }}
            className="text-white/70 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Sparkle effects */}
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-white rounded-full animate-ping" />
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping animation-delay-300" />
        <div className="absolute top-1/2 -left-1 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-pulse animation-delay-700" />
      </div>
    </div>,
    document.body
  );
};

// Hook for managing achievements
export const useAchievements = () => {
  const [currentAchievement, setCurrentAchievement] = useState<{
    title: string;
    description: string;
    icon?: string;
  } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const triggerAchievement = (achievement: {
    title: string;
    description: string;
    icon?: string;
    showConfetti?: boolean;
  }) => {
    setCurrentAchievement({
      title: achievement.title,
      description: achievement.description,
      icon: achievement.icon
    });

    if (achievement.showConfetti !== false) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 100);
    }
  };

  const clearAchievement = () => {
    setCurrentAchievement(null);
  };

  return {
    currentAchievement,
    showConfetti,
    triggerAchievement,
    clearAchievement
  };
};