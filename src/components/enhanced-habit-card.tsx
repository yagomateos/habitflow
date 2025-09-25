import { useState, useRef, useEffect } from 'react';
import { Check, Flame, Target, MoreVertical, Edit, Trash2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Habit } from '@/types/habit';
import { CATEGORY_CONFIG } from '@/types/habit';
import { cn } from '@/lib/utils';

interface EnhancedHabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onToggleComplete: (id: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

export const EnhancedHabitCard = ({
  habit,
  isCompleted,
  onToggleComplete,
  onEdit,
  onDelete
}: EnhancedHabitCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const categoryConfig = CATEGORY_CONFIG[habit.category];

  // Calculate weekly progress
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  const completedThisWeek = weekDates.filter(date =>
    habit.completedDates.includes(date)
  ).length;

  const weekProgress = (completedThisWeek / 7) * 100;
  const goalProgress = Math.min((completedThisWeek / habit.goal.target) * 100, 100);

  // Handle completion with celebration
  const handleToggleComplete = () => {
    if (!isCompleted && (habit.streak + 1) % 7 === 0) {
      triggerConfetti();
    }

    setIsAnimating(true);
    onToggleComplete(habit.id);

    setTimeout(() => setIsAnimating(false), 800);
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  // Progress ring component
  const ProgressRing = ({
    progress,
    size = 60,
    strokeWidth = 4,
    children
  }: {
    progress: number;
    size?: number;
    strokeWidth?: number;
    children?: React.ReactNode;
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg
          className="transform -rotate-90 transition-all duration-700"
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
            className="text-muted/20"
          />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={cn(
              "transition-all duration-700 ease-out",
              categoryConfig.color === 'health' && "text-emerald-500",
              categoryConfig.color === 'fitness' && "text-blue-500",
              categoryConfig.color === 'productivity' && "text-violet-500",
              categoryConfig.color === 'personal' && "text-pink-500"
            )}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      </div>
    );
  };

  return (
    <Card
      ref={cardRef}
      className={cn(
        "group relative overflow-hidden transition-all duration-500 ease-out glass-card shadow-premium floating-card",
        "rounded-2xl border-l-4 border-l-transparent",
        "hover:shadow-premium-lg hover:scale-[1.03] hover:-translate-y-2",
        categoryConfig.color === 'health' && "hover:border-l-emerald-500 hover:shadow-emerald-500/20",
        categoryConfig.color === 'fitness' && "hover:border-l-blue-500 hover:shadow-blue-500/20", 
        categoryConfig.color === 'productivity' && "hover:border-l-violet-500 hover:shadow-violet-500/20",
        categoryConfig.color === 'personal' && "hover:border-l-pink-500 hover:shadow-pink-500/20",
        isCompleted && "ring-2 ring-emerald-500/30 shadow-emerald-500/20 scale-95 opacity-90",
        isAnimating && "animate-glow-pulse"
      )}
    >
      {/* Premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5 pointer-events-none"></div>
      
      {/* Category-specific hover overlay */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
        categoryConfig.color === 'health' && "bg-gradient-to-br from-emerald-500/10 via-transparent to-emerald-500/5",
        categoryConfig.color === 'fitness' && "bg-gradient-to-br from-blue-500/10 via-transparent to-blue-500/5",
        categoryConfig.color === 'productivity' && "bg-gradient-to-br from-violet-500/10 via-transparent to-violet-500/5",
        categoryConfig.color === 'personal' && "bg-gradient-to-br from-pink-500/10 via-transparent to-pink-500/5"
      )} />

      {/* Confetti overlay with premium effects */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 animate-glow-pulse rounded-2xl"></div>
          <div className="absolute inset-0 animate-shimmer-modern"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Sparkles className="h-10 w-10 text-yellow-400 animate-bounce-subtle" />
          </div>
        </div>
      )}

      <CardContent className="relative p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
            {/* Category indicator */}
            <div className={cn(
              "w-1 h-12 sm:h-16 rounded-full opacity-60 group-hover:opacity-100 transition-all duration-300 flex-shrink-0",
              categoryConfig.color === 'health' && "bg-emerald-500",
              categoryConfig.color === 'fitness' && "bg-blue-500",
              categoryConfig.color === 'productivity' && "bg-violet-500",
              categoryConfig.color === 'personal' && "bg-pink-500"
            )} />

            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-semibold text-base sm:text-lg mb-1 transition-colors duration-300 line-clamp-2",
                "group-hover:text-foreground/90",
                isCompleted && "line-through text-muted-foreground"
              )}>
                {habit.name}
              </h3>

              {habit.description && (
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-2">
                  {habit.description}
                </p>
              )}

              {/* Category badge */}
              <div>
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full",
                    "border-0 backdrop-blur-sm transition-all duration-300",
                    categoryConfig.color === 'health' && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
                    categoryConfig.color === 'fitness' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
                    categoryConfig.color === 'productivity' && "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
                    categoryConfig.color === 'personal' && "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300"
                  )}
                >
                  <span className="mr-1">{categoryConfig.icon}</span>
                  <span className="hidden sm:inline">{categoryConfig.name}</span>
                </Badge>
              </div>
            </div>
          </div>

          {/* Actions menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 w-8 p-0 rounded-full transition-all duration-300",
                  "opacity-0 group-hover:opacity-100 hover:bg-muted/50"
                )}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onEdit(habit)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(habit.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Progress section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          {/* Completion button */}
          <Button
            onClick={handleToggleComplete}
            variant={isCompleted ? "default" : "outline"}
            size="sm"
            className={cn(
              "transition-all duration-300 hover:scale-105 w-full sm:min-w-[100px] sm:w-auto",
              isCompleted
                ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                : "hover:border-primary hover:text-primary",
              isAnimating && "animate-bounce"
            )}
          >
            <Check className={cn(
              "h-4 w-4 mr-1 transition-transform duration-300",
              isCompleted ? "scale-100" : "scale-0"
            )} />
            <span className="text-xs sm:text-sm">{isCompleted ? "Completado" : "Marcar"}</span>
          </Button>

          {/* Progress ring and streak */}
          <div className="flex items-center justify-center sm:justify-end gap-3 sm:gap-4">
            {/* Streak indicator */}
            {habit.streak > 0 && (
              <div className="flex items-center gap-1">
                <Flame className={cn(
                  "h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-300",
                  habit.streak >= 7 ? "text-orange-500" : "text-orange-400"
                )} />
                <span className={cn(
                  "font-bold text-sm sm:text-lg transition-colors duration-300",
                  habit.streak >= 7 ? "text-orange-600" : "text-orange-500"
                )}>
                  {habit.streak}
                </span>
              </div>
            )}

            {/* Weekly progress ring */}
            <ProgressRing progress={weekProgress} size={44}>
              <div className="text-center">
                <div className="text-xs sm:text-sm font-bold text-foreground">
                  {completedThisWeek}
                </div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">
                  / 7
                </div>
              </div>
            </ProgressRing>
          </div>
        </div>

        {/* Goal progress */}
        <div className="mt-4 pt-4 border-t border-border/30">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground font-medium">
              Progreso semanal
            </span>
            <span className="font-semibold">
              {completedThisWeek} / {habit.goal.target}
            </span>
          </div>

          <div className="relative w-full bg-muted/30 rounded-full h-2 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700 ease-out",
                "relative overflow-hidden",
                categoryConfig.color === 'health' && "bg-gradient-to-r from-emerald-400 to-emerald-500",
                categoryConfig.color === 'fitness' && "bg-gradient-to-r from-blue-400 to-blue-500",
                categoryConfig.color === 'productivity' && "bg-gradient-to-r from-violet-400 to-violet-500",
                categoryConfig.color === 'personal' && "bg-gradient-to-r from-pink-400 to-pink-500"
              )}
              style={{
                width: `${goalProgress}%`,
                boxShadow: goalProgress > 0 ? `0 0 10px ${categoryConfig.color}33` : 'none'
              }}
            >
              {/* Subtle shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Achievement indicator */}
        {goalProgress >= 100 && (
          <div className="mt-3 flex items-center justify-center">
            <div className="flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
              <Target className="h-4 w-4" />
              ¡Meta semanal alcanzada!
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};