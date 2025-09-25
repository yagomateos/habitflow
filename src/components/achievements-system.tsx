import { useState, useEffect } from 'react';
import { Trophy, Star, Flame, Target, Award, Crown, Zap, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Habit } from '@/types/habit';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'completion' | 'consistency' | 'milestone' | 'special';
  requirement: {
    type: 'streak' | 'total_completions' | 'perfect_days' | 'habit_count' | 'category_master';
    value: number;
    category?: string;
  };
  reward: {
    points: number;
    badge: string;
    title?: string;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked?: boolean;
  unlockedAt?: string;
}

const ACHIEVEMENTS: Achievement[] = [
  // Streak Achievements
  {
    id: 'first_streak',
    title: 'Primeros Pasos',
    description: 'Completa un hábito 3 días seguidos',
    icon: '🔥',
    category: 'streak',
    requirement: { type: 'streak', value: 3 },
    reward: { points: 50, badge: '🔥', title: 'Principiante Constante' },
    rarity: 'common'
  },
  {
    id: 'week_warrior',
    title: 'Guerrero de la Semana',
    description: 'Mantén una racha de 7 días',
    icon: '⚔️',
    category: 'streak',
    requirement: { type: 'streak', value: 7 },
    reward: { points: 100, badge: '⚔️', title: 'Guerrero Semanal' },
    rarity: 'common'
  },
  {
    id: 'month_master',
    title: 'Maestro del Mes',
    description: 'Alcanza una racha de 30 días',
    icon: '👑',
    category: 'streak',
    requirement: { type: 'streak', value: 30 },
    reward: { points: 500, badge: '👑', title: 'Maestro de la Constancia' },
    rarity: 'epic'
  },
  {
    id: 'legendary_streak',
    title: 'Leyenda Viviente',
    description: 'Mantén una racha de 100 días',
    icon: '🌟',
    category: 'streak',
    requirement: { type: 'streak', value: 100 },
    reward: { points: 2000, badge: '🌟', title: 'Leyenda de los Hábitos' },
    rarity: 'legendary'
  },

  // Completion Achievements
  {
    id: 'century_club',
    title: 'Club de los 100',
    description: 'Completa 100 hábitos en total',
    icon: '💯',
    category: 'completion',
    requirement: { type: 'total_completions', value: 100 },
    reward: { points: 200, badge: '💯', title: 'Centurión de Hábitos' },
    rarity: 'rare'
  },
  {
    id: 'thousand_strong',
    title: 'Mil Victorias',
    description: 'Completa 1000 hábitos en total',
    icon: '🚀',
    category: 'completion',
    requirement: { type: 'total_completions', value: 1000 },
    reward: { points: 1000, badge: '🚀', title: 'Maestro de las Mil Victorias' },
    rarity: 'legendary'
  },

  // Perfect Days
  {
    id: 'perfect_week',
    title: 'Semana Perfecta',
    description: 'Completa todos tus hábitos 7 días seguidos',
    icon: '✨',
    category: 'consistency',
    requirement: { type: 'perfect_days', value: 7 },
    reward: { points: 300, badge: '✨', title: 'Perfeccionista Semanal' },
    rarity: 'rare'
  },
  {
    id: 'perfect_month',
    title: 'Mes Impecable',
    description: 'Completa todos tus hábitos 30 días seguidos',
    icon: '💎',
    category: 'consistency',
    requirement: { type: 'perfect_days', value: 30 },
    reward: { points: 1500, badge: '💎', title: 'Diamante de la Consistencia' },
    rarity: 'legendary'
  },

  // Category Masters
  {
    id: 'health_guru',
    title: 'Gurú de la Salud',
    description: 'Completa 50 hábitos de salud',
    icon: '❤️',
    category: 'milestone',
    requirement: { type: 'category_master', value: 50, category: 'health' },
    reward: { points: 250, badge: '❤️', title: 'Gurú del Bienestar' },
    rarity: 'rare'
  },
  {
    id: 'fitness_beast',
    title: 'Bestia del Fitness',
    description: 'Completa 50 hábitos de fitness',
    icon: '💪',
    category: 'milestone',
    requirement: { type: 'category_master', value: 50, category: 'fitness' },
    reward: { points: 250, badge: '💪', title: 'Titán del Fitness' },
    rarity: 'rare'
  },
  {
    id: 'productivity_ninja',
    title: 'Ninja de la Productividad',
    description: 'Completa 50 hábitos de productividad',
    icon: '⚡',
    category: 'milestone',
    requirement: { type: 'category_master', value: 50, category: 'productivity' },
    reward: { points: 250, badge: '⚡', title: 'Ninja Productivo' },
    rarity: 'rare'
  },

  // Special Achievements
  {
    id: 'early_bird',
    title: 'Madrugador',
    description: 'Completa hábitos antes de las 7 AM durante 10 días',
    icon: '🌅',
    category: 'special',
    requirement: { type: 'total_completions', value: 10 }, // Simplificado
    reward: { points: 150, badge: '🌅', title: 'Guerrero del Amanecer' },
    rarity: 'rare'
  },
  {
    id: 'night_owl',
    title: 'Búho Nocturno',
    description: 'Completa hábitos después de las 10 PM durante 10 días',
    icon: '🦉',
    category: 'special',
    requirement: { type: 'total_completions', value: 10 }, // Simplificado
    reward: { points: 150, badge: '🦉', title: 'Señor de la Noche' },
    rarity: 'rare'
  }
];

interface AchievementsSystemProps {
  habits: Habit[];
  className?: string;
}

interface UserProgress {
  totalPoints: number;
  unlockedAchievements: string[];
  currentLevel: number;
}

export const AchievementsSystem = ({ habits, className }: AchievementsSystemProps) => {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalPoints: 0,
    unlockedAchievements: [],
    currentLevel: 1
  });

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50 dark:bg-gray-900/20';
      case 'rare': return 'border-blue-300 bg-blue-50 dark:bg-blue-900/20';
      case 'epic': return 'border-purple-300 bg-purple-50 dark:bg-purple-900/20';
      case 'legendary': return 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20';
    }
  };

  const getRarityLabel = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'Común';
      case 'rare': return 'Raro';
      case 'epic': return 'Épico';
      case 'legendary': return 'Legendario';
    }
  };

  const calculateProgress = (achievement: Achievement): number => {
    // Aquí calcularías el progreso real basado en los hábitos
    // Por ahora, uso valores simulados
    const completions = habits.reduce((acc, habit) => acc + habit.completedDates.length, 0);
    const maxStreak = Math.max(...habits.map(h => h.streak));
    
    switch (achievement.requirement.type) {
      case 'total_completions':
        return Math.min((completions / achievement.requirement.value) * 100, 100);
      case 'streak':
        return Math.min((maxStreak / achievement.requirement.value) * 100, 100);
      case 'habit_count':
        return Math.min((habits.length / achievement.requirement.value) * 100, 100);
      default:
        return Math.random() * 100; // Simulado
    }
  };

  const isUnlocked = (achievementId: string): boolean => {
    return userProgress.unlockedAchievements.includes(achievementId);
  };

  const getCurrentLevel = (): number => {
    return Math.floor(userProgress.totalPoints / 1000) + 1;
  };

  const getPointsToNextLevel = (): number => {
    const currentLevel = getCurrentLevel();
    const pointsForNextLevel = currentLevel * 1000;
    return pointsForNextLevel - userProgress.totalPoints;
  };

  useEffect(() => {
    // Cargar progreso del usuario
    const savedProgress = localStorage.getItem('user-achievements-progress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, []);

  useEffect(() => {
    // Guardar progreso
    localStorage.setItem('user-achievements-progress', JSON.stringify(userProgress));
  }, [userProgress]);

  const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
    const progress = calculateProgress(achievement);
    const unlocked = isUnlocked(achievement.id);

    return (
      <Card className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
        getRarityColor(achievement.rarity),
        unlocked && "ring-2 ring-primary/30",
        className
      )}>
        {unlocked && (
          <div className="absolute top-2 right-2">
            <Badge variant="default" className="bg-green-500 text-white">
              ✓ Desbloqueado
            </Badge>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className={cn(
              "text-3xl transition-all duration-300",
              !unlocked && "grayscale opacity-50"
            )}>
              {achievement.icon}
            </div>
            
            <div className="flex-1">
              <CardTitle className={cn(
                "text-lg font-semibold transition-colors",
                unlocked ? "text-foreground" : "text-muted-foreground"
              )}>
                {achievement.title}
              </CardTitle>
              
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {getRarityLabel(achievement.rarity)}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Trophy className="h-3 w-3" />
                  {achievement.reward.points} pts
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className={cn(
            "text-sm leading-relaxed",
            unlocked ? "text-foreground/80" : "text-muted-foreground"
          )}>
            {achievement.description}
          </p>

          {!unlocked && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Progreso</span>
                <span className="text-muted-foreground">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {achievement.reward.title && (
            <div className="pt-2 border-t border-border/50">
              <div className="flex items-center gap-2 text-xs">
                <Crown className="h-3 w-3 text-yellow-500" />
                <span className={cn(
                  "font-medium",
                  unlocked ? "text-yellow-600 dark:text-yellow-400" : "text-muted-foreground"
                )}>
                  Título: "{achievement.reward.title}"
                </span>
              </div>
            </div>
          )}

          {unlocked && (
            <div className="pt-2 border-t border-border/50">
              <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                <Star className="h-3 w-3" />
                <span>¡Logro desbloqueado!</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const groupedAchievements = ACHIEVEMENTS.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);

  const categoryLabels = {
    streak: 'Rachas',
    completion: 'Completaciones',
    consistency: 'Consistencia',
    milestone: 'Hitos',
    special: 'Especiales'
  };

  const categoryIcons = {
    streak: <Flame className="h-5 w-5" />,
    completion: <Target className="h-5 w-5" />,
    consistency: <Zap className="h-5 w-5" />,
    milestone: <Award className="h-5 w-5" />,
    special: <Star className="h-5 w-5" />
  };

  return (
    <div className={className}>
      {/* Progress Overview */}
      <Card className="mb-8 border-0 bg-gradient-to-br from-primary/10 to-primary/5">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {userProgress.totalPoints}
              </div>
              <div className="text-sm text-muted-foreground">Puntos Totales</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                Nivel {getCurrentLevel()}
              </div>
              <div className="text-sm text-muted-foreground">
                {getPointsToNextLevel()} pts para nivel {getCurrentLevel() + 1}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {userProgress.unlockedAchievements.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Logros Desbloqueados
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements by Category */}
      <div className="space-y-8">
        {Object.entries(groupedAchievements).map(([category, achievements]) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-4">
              {categoryIcons[category as keyof typeof categoryIcons]}
              <h3 className="text-xl font-semibold">
                {categoryLabels[category as keyof typeof categoryLabels]}
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-border via-border/50 to-transparent" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
