import { useState, useEffect } from 'react';
import { TrendingUp, Target, Calendar, Flame, Award, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HabitStats } from '@/types/habit';
import { cn } from '@/lib/utils';

interface PremiumStatsPanelProps {
  stats: HabitStats;
}

interface AnimatedProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  label: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: [string, string];
  delay?: number;
}

const AnimatedProgressRing = ({
  progress,
  size = 120,
  strokeWidth = 8,
  className,
  label,
  value,
  icon,
  gradient,
  delay = 0
}: AnimatedProgressRingProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, delay);

    return () => clearTimeout(timer);
  }, [progress, delay]);

  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center text-center group", className)}>
      <div className="relative mb-3">
        <svg
          className="transform -rotate-90 transition-all duration-1000 ease-out"
          width={size}
          height={size}
        >
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-muted/10"
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id={`gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={gradient[0]} />
              <stop offset="100%" stopColor={gradient[1]} />
            </linearGradient>
          </defs>

          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#gradient-${label})`}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))',
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="mb-1 text-muted-foreground group-hover:text-primary transition-colors duration-300">
            {icon}
          </div>
          <div className="text-2xl font-bold text-foreground group-hover:scale-110 transition-transform duration-300">
            {value}
          </div>
        </div>
      </div>

      <div className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
        {label}
      </div>
    </div>
  );
};

const StatCard = ({
  icon,
  title,
  value,
  subtitle,
  trend,
  className
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}) => (
  <Card className={cn(
    "relative overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
    "border-0 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm",
    className
  )}>
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    <CardContent className="p-4 relative">
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300">
          {icon}
        </div>
        {trend && (
          <Badge
            variant={trend === 'up' ? 'default' : trend === 'down' ? 'destructive' : 'secondary'}
            className="text-xs"
          >
            <TrendingUp className={cn(
              "h-3 w-3 mr-1",
              trend === 'down' && "rotate-180"
            )} />
            {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}
          </Badge>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
          {value}
        </div>
        <div className="text-sm text-muted-foreground font-medium">
          {title}
        </div>
        {subtitle && (
          <div className="text-xs text-muted-foreground">
            {subtitle}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

export const PremiumStatsPanel = ({ stats }: PremiumStatsPanelProps) => {
  const completionRate = stats.totalHabits > 0 ? (stats.completedToday / stats.totalHabits) * 100 : 0;
  const streakRate = stats.totalHabits > 0 ? (stats.currentStreaks / (stats.totalHabits * 7)) * 100 : 0;

  // Get motivational message
  const getMotivationalMessage = () => {
    if (completionRate === 100) return "¡Increíble! Has completado todos tus hábitos hoy 🎉";
    if (completionRate >= 80) return "¡Excelente progreso! Estás en racha 🔥";
    if (completionRate >= 60) return "¡Muy bien! Sigue así 💪";
    if (completionRate >= 40) return "Buen comienzo, puedes mejorar 📈";
    if (stats.completedToday > 0) return "¡Has comenzado bien el día! 🌟";
    return "¡Es hora de comenzar con tus hábitos! ⚡";
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Header with greeting */}
      <Card className="border-0 bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {getTimeGreeting()} 👋
              </h2>
              <p className="text-muted-foreground text-lg">
                {getMotivationalMessage()}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-lg px-3 py-1">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date().toLocaleDateString('es-ES', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main stats with progress rings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm p-6">
          <div className="text-center">
            <AnimatedProgressRing
              progress={completionRate}
              label="Completado Hoy"
              value={`${Math.round(completionRate)}%`}
              icon={<Target className="h-6 w-6" />}
              gradient={['#10b981', '#059669']}
              delay={200}
            />
            <div className="mt-3 text-sm text-muted-foreground">
              {stats.completedToday} de {stats.totalHabits} hábitos
            </div>
          </div>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm p-6">
          <div className="text-center">
            <AnimatedProgressRing
              progress={stats.weeklyCompletion}
              label="Progreso Semanal"
              value={`${stats.weeklyCompletion}%`}
              icon={<BarChart3 className="h-6 w-6" />}
              gradient={['#3b82f6', '#1d4ed8']}
              delay={400}
            />
          </div>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm p-6">
          <div className="text-center">
            <AnimatedProgressRing
              progress={stats.monthlyCompletion}
              label="Progreso Mensual"
              value={`${stats.monthlyCompletion}%`}
              icon={<Award className="h-6 w-6" />}
              gradient={['#8b5cf6', '#7c3aed']}
              delay={600}
            />
          </div>
        </Card>
      </div>

      {/* Detailed stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Target className="h-5 w-5" />}
          title="Total de Hábitos"
          value={stats.totalHabits}
          subtitle="Hábitos activos"
          trend="neutral"
        />

        <StatCard
          icon={<Flame className="h-5 w-5" />}
          title="Rachas Activas"
          value={stats.currentStreaks}
          subtitle="Días consecutivos"
          trend={stats.currentStreaks > 0 ? 'up' : 'neutral'}
        />

        <StatCard
          icon={<Calendar className="h-5 w-5" />}
          title="Esta Semana"
          value={`${stats.weeklyCompletion}%`}
          subtitle="Completado"
          trend={stats.weeklyCompletion >= 70 ? 'up' : stats.weeklyCompletion >= 40 ? 'neutral' : 'down'}
        />

        <StatCard
          icon={<Award className="h-5 w-5" />}
          title="Este Mes"
          value={`${stats.monthlyCompletion}%`}
          subtitle="Completado"
          trend={stats.monthlyCompletion >= 70 ? 'up' : stats.monthlyCompletion >= 40 ? 'neutral' : 'down'}
        />
      </div>

      {/* Achievement banner */}
      {completionRate === 100 && (
        <Card className="border-0 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 backdrop-blur-sm animate-pulse">
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Award className="h-5 w-5" />
              <span className="font-semibold">
                ¡Día perfecto! Has completado todos tus hábitos
              </span>
              <Award className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};