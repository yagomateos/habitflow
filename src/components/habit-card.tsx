import { useState } from 'react';
import { Check, Flame, Target, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProgressCircle } from '@/components/ui/progress-circle';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Habit } from '@/types/habit';
import { CATEGORY_CONFIG } from '@/types/habit';
import { cn } from '@/lib/utils';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onToggleComplete: (id: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

export const HabitCard = ({ 
  habit, 
  isCompleted, 
  onToggleComplete, 
  onEdit, 
  onDelete 
}: HabitCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const categoryConfig = CATEGORY_CONFIG[habit.category];
  
  // Calculate completion percentage for this week
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

  const handleToggleComplete = () => {
    setIsAnimating(true);
    onToggleComplete(habit.id);
    
    // Reset animation after completion
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <Card className={cn(
      "glass-card transition-smooth hover:scale-[1.02] group",
      isCompleted && "animate-success-pulse"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-3 h-3 rounded-full",
              `bg-${categoryConfig.color}`
            )} />
            <div>
              <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                {habit.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {habit.description}
              </p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
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

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Completion Button */}
            <Button
              variant={isCompleted ? "default" : "outline"}
              size="sm"
              onClick={handleToggleComplete}
              className={cn(
                "transition-all duration-300",
                isCompleted && "bg-success hover:bg-success/90 text-white",
                isAnimating && "animate-bounce"
              )}
            >
              <Check className={cn(
                "h-4 w-4 transition-transform duration-300",
                isCompleted ? "scale-100" : "scale-0"
              )} />
              {!isCompleted && <span className="ml-1">Marcar</span>}
            </Button>

            {/* Category Badge */}
            <Badge variant="secondary" className="text-xs">
              {categoryConfig.icon} {categoryConfig.name}
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            {/* Streak Counter */}
            {habit.streak > 0 && (
              <div className="flex items-center gap-1 text-sm">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="font-semibold text-orange-600">
                  {habit.streak}
                </span>
              </div>
            )}

            {/* Weekly Progress Circle */}
            <ProgressCircle progress={weekProgress} size="sm">
              <span className="text-xs font-semibold text-muted-foreground">
                {completedThisWeek}
              </span>
            </ProgressCircle>
          </div>
        </div>

        {/* Goal Progress Bar */}
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Meta semanal</span>
            <span>{completedThisWeek}/{habit.goal.target}</span>
          </div>
          <div className="w-full bg-muted/50 rounded-full h-1.5">
            <div 
              className={cn(
                "h-1.5 rounded-full transition-all duration-700 animate-progress",
                `bg-${categoryConfig.color}`
              )}
              style={{ 
                width: `${Math.min((completedThisWeek / habit.goal.target) * 100, 100)}%` 
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};