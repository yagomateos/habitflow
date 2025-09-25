import React from 'react';
import { TrendingUp, Target, Calendar, Flame } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface HabitNowStatsProps {
  totalHabits: number;
  completedToday: number;
  completionRate: number;
  longestStreak: number;
  currentStreak: number;
  weeklyProgress: number;
}

export const HabitNowStats: React.FC<HabitNowStatsProps> = ({
  totalHabits = 0,
  completedToday = 0,
  completionRate = 0,
  longestStreak = 0,
  currentStreak = 0,
  weeklyProgress = 0
}) => {
  // Sanitize values to avoid NaN and undefined
  const safeCompletionRate = isNaN(completionRate) ? 0 : completionRate;
  const safeCurrentStreak = isNaN(currentStreak) || currentStreak === undefined ? 0 : currentStreak;
  const safeWeeklyProgress = isNaN(weeklyProgress) ? 0 : weeklyProgress;
  const safeCompletedToday = isNaN(completedToday) ? 0 : completedToday;
  const safeTotalHabits = isNaN(totalHabits) ? 0 : totalHabits;

  const stats = [
    {
      label: 'Completados hoy',
      value: `${safeCompletedToday}/${safeTotalHabits}`,
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      label: 'Tasa de éxito',
      value: `${Math.round(safeCompletionRate)}%`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      label: 'Racha actual',
      value: `${safeCurrentStreak} días`,
      icon: Flame,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      label: 'Esta semana',
      value: `${Math.round(safeWeeklyProgress)}%`,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="habit-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-lg font-bold leading-none">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
