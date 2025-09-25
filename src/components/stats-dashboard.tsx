import { TrendingUp, Target, Calendar, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressCircle } from '@/components/ui/progress-circle';
import { HabitStats } from '@/types/habit';
import { cn } from '@/lib/utils';

interface StatsDashboardProps {
  stats: HabitStats;
}

export const StatsDashboard = ({ stats }: StatsDashboardProps) => {
  const statCards = [
    {
      title: 'Completados Hoy',
      value: `${stats.completedToday}/${stats.totalHabits}`,
      progress: stats.totalHabits > 0 ? (stats.completedToday / stats.totalHabits) * 100 : 0,
      icon: Target,
      gradient: 'gradient-productivity',
      color: 'productivity'
    },
    {
      title: 'Rachas Activas',
      value: stats.currentStreaks.toString(),
      progress: Math.min(stats.currentStreaks * 10, 100), // Visual representation
      icon: Flame,
      gradient: 'gradient-fitness',
      color: 'fitness'
    },
    {
      title: 'Esta Semana',
      value: `${stats.weeklyCompletion}%`,
      progress: stats.weeklyCompletion,
      icon: Calendar,
      gradient: 'gradient-health',
      color: 'health'
    },
    {
      title: 'Este Mes',
      value: `${stats.monthlyCompletion}%`,
      progress: stats.monthlyCompletion,
      icon: TrendingUp,
      gradient: 'gradient-personal',
      color: 'personal'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <Card 
          key={stat.title}
          className={cn(
            "glass-card transition-smooth hover:scale-105 group",
            "animate-fade-in"
          )}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <stat.icon className="h-4 w-4" />
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-card-foreground group-hover:text-primary transition-colors">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.progress.toFixed(0)}% completado
                </p>
              </div>
              
              <ProgressCircle 
                progress={stat.progress} 
                size="sm"
                className="opacity-80 group-hover:opacity-100 transition-opacity"
              >
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  `bg-${stat.color}`
                )} />
              </ProgressCircle>
            </div>

            {/* Mini progress bar */}
            <div className="mt-3 w-full bg-muted/30 rounded-full h-1">
              <div 
                className={cn(
                  "h-1 rounded-full transition-all duration-1000 animate-progress",
                  stat.gradient
                )}
                style={{ 
                  width: `${stat.progress}%`,
                  animationDelay: `${index * 200}ms`
                }}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};