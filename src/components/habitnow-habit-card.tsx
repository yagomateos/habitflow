import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Check, MoreHorizontal, Edit, Trash2, Flame, TrendingUp } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Habit } from "@/types/habit";

interface HabitNowHabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onToggleComplete: (habitId: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

const CATEGORY_CONFIG = {
  health: { icon: '💚', name: 'Salud', color: 'emerald' },
  fitness: { icon: '💪', name: 'Fitness', color: 'blue' },
  productivity: { icon: '🎯', name: 'Productividad', color: 'violet' },
  personal: { icon: '🌱', name: 'Personal', color: 'pink' }
} as const;

export const HabitNowHabitCard: React.FC<HabitNowHabitCardProps> = ({
  habit,
  isCompleted,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const categoryConfig = CATEGORY_CONFIG[habit.category];

  const handleToggleComplete = () => {
    if (!isCompleted) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
    onToggleComplete(habit.id);
  };

  // Calculate weekly progress
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const completedThisWeek = habit.completions?.filter(completion => {
    const completionDate = new Date(completion);
    return completionDate >= startOfWeek;
  }).length || 0;

  const weekProgress = Math.min((completedThisWeek / 7) * 100, 100);

  return (
    <Card className={cn(
      "habit-card group relative overflow-hidden",
      isCompleted && "habit-completed",
      !isCompleted && "habit-pending",
      isAnimating && "animate-pulse"
    )}>
      <CardContent className="p-4">
        {/* Header with title and actions */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Category icon */}
            <div className="text-lg flex-shrink-0">
              {categoryConfig.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-semibold text-base leading-tight mb-1",
                isCompleted && "line-through text-muted-foreground"
              )}>
                {habit.name}
              </h3>
              
              {habit.description && (
                <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                  {habit.description}
                </p>
              )}
              
              {/* Category badge */}
              <Badge variant="secondary" className="text-xs">
                {categoryConfig.name}
              </Badge>
            </div>
          </div>

          {/* Actions menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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

        {/* Progress and stats */}
        <div className="space-y-3">
          {/* Streak indicator */}
          {habit.streak > 0 && (
            <div className="streak-counter">
              <Flame className="h-4 w-4" />
              <span>{habit.streak} días</span>
            </div>
          )}

          {/* Weekly progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Esta semana</span>
              <span className="font-medium">{completedThisWeek}/7</span>
            </div>
            <div className="progress-bar-habitnow">
              <div 
                className={cn(
                  "progress-fill",
                  categoryConfig.color === 'emerald' && "bg-emerald-500",
                  categoryConfig.color === 'blue' && "bg-blue-500",
                  categoryConfig.color === 'violet' && "bg-violet-500",
                  categoryConfig.color === 'pink' && "bg-pink-500"
                )}
                style={{ width: `${weekProgress}%` }}
              />
            </div>
          </div>

          {/* Completion button */}
          <Button
            onClick={handleToggleComplete}
            variant={isCompleted ? "default" : "outline"}
            size="sm"
            className={cn(
              "w-full transition-all duration-200",
              isCompleted && "bg-green-500 hover:bg-green-600 text-white"
            )}
          >
            <Check className={cn(
              "h-4 w-4 mr-2 transition-transform duration-200",
              isCompleted ? "scale-100" : "scale-0"
            )} />
            {isCompleted ? "Completado hoy" : "Marcar como completado"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
