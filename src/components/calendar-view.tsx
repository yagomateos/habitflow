import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Habit } from '@/types/habit';
import { CATEGORY_CONFIG } from '@/types/habit';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  habits: Habit[];
  onDateSelect?: (date: string) => void;
  selectedDate?: string;
}

export const CalendarView = ({ habits, onDateSelect, selectedDate }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  const monthStart = useMemo(() => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  }, [currentDate]);

  const monthEnd = useMemo(() => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  }, [currentDate]);

  const calendarStart = useMemo(() => {
    const start = new Date(monthStart);
    const dayOfWeek = start.getDay();
    start.setDate(start.getDate() - dayOfWeek);
    return start;
  }, [monthStart]);

  const calendarEnd = useMemo(() => {
    const end = new Date(monthEnd);
    const dayOfWeek = end.getDay();
    end.setDate(end.getDate() + (6 - dayOfWeek));
    return end;
  }, [monthEnd]);

  const calendarDays = useMemo(() => {
    const days = [];
    const current = new Date(calendarStart);

    while (current <= calendarEnd) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  }, [calendarStart, calendarEnd]);

  const getDateCompletions = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return habits.filter(habit => habit.completedDates.includes(dateStr));
  };

  const getCompletionRate = (date: Date) => {
    const completions = getDateCompletions(date);
    return habits.length > 0 ? (completions.length / habits.length) * 100 : 0;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isToday = (date: Date) => {
    return date.toISOString().split('T')[0] === today;
  };

  const isSelected = (date: Date) => {
    return selectedDate === date.toISOString().split('T')[0];
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const CompletionIndicator = ({ date }: { date: Date }) => {
    const completions = getDateCompletions(date);
    const rate = getCompletionRate(date);

    if (completions.length === 0) {
      return <Circle className="h-2 w-2 text-muted-foreground/30" />;
    }

    if (rate === 100) {
      return (
        <div className="relative">
          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
          <div className="absolute inset-0 animate-ping">
            <CheckCircle2 className="h-3 w-3 text-emerald-500 opacity-30" />
          </div>
        </div>
      );
    }

    return (
      <div className="flex gap-0.5">
        {completions.slice(0, 3).map((habit, index) => {
          const categoryConfig = CATEGORY_CONFIG[habit.category];
          return (
            <div
              key={habit.id}
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                categoryConfig.color === 'health' && "bg-emerald-500",
                categoryConfig.color === 'fitness' && "bg-blue-500",
                categoryConfig.color === 'productivity' && "bg-violet-500",
                categoryConfig.color === 'personal' && "bg-pink-500"
              )}
            />
          );
        })}
        {completions.length > 3 && (
          <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
        )}
      </div>
    );
  };

  const MonthlyStats = () => {
    const monthlyStats = useMemo(() => {
      const daysInMonth = monthEnd.getDate();
      let totalCompletions = 0;
      let perfectDays = 0;

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const completions = getDateCompletions(date);
        totalCompletions += completions.length;

        if (completions.length === habits.length && habits.length > 0) {
          perfectDays++;
        }
      }

      const averageCompletion = habits.length > 0 ? (totalCompletions / (daysInMonth * habits.length)) * 100 : 0;

      return {
        totalCompletions,
        perfectDays,
        averageCompletion: Math.round(averageCompletion)
      };
    }, [currentDate, habits, monthEnd]);

    return (
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-600">{monthlyStats.perfectDays}</div>
          <div className="text-xs text-muted-foreground">Días perfectos</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{monthlyStats.totalCompletions}</div>
          <div className="text-xs text-muted-foreground">Total completados</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-violet-600">{monthlyStats.averageCompletion}%</div>
          <div className="text-xs text-muted-foreground">Promedio mensual</div>
        </div>
      </div>
    );
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Calendario de Hábitos
          </CardTitle>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="h-8 w-8 p-0 hover:scale-105 transition-transform"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Badge variant="outline" className="px-3 py-1 font-semibold">
              {currentDate.toLocaleDateString('es-ES', {
                month: 'long',
                year: 'numeric'
              })}
            </Badge>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="h-8 w-8 p-0 hover:scale-105 transition-transform"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <MonthlyStats />
      </CardHeader>

      <CardContent className="p-4 pt-0">
        {/* Calendar Grid */}
        <div className="space-y-2">
          {/* Week headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              const dateStr = date.toISOString().split('T')[0];
              const completions = getDateCompletions(date);
              const rate = getCompletionRate(date);

              return (
                <button
                  key={index}
                  onClick={() => onDateSelect?.(dateStr)}
                  className={cn(
                    "relative p-2 rounded-lg text-sm transition-all duration-200",
                    "hover:scale-105 hover:shadow-md group",
                    "flex flex-col items-center justify-center gap-1 min-h-[50px]",

                    // Base styling
                    "bg-muted/30 hover:bg-muted/50",

                    // Current month styling
                    isCurrentMonth(date)
                      ? "text-foreground"
                      : "text-muted-foreground/50",

                    // Today styling
                    isToday(date) &&
                      "ring-2 ring-primary bg-primary/10 text-primary font-bold",

                    // Selected styling
                    isSelected(date) &&
                      "bg-primary/20 ring-2 ring-primary/50",

                    // Completion styling
                    rate === 100 && isCurrentMonth(date) &&
                      "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",

                    rate > 0 && rate < 100 && isCurrentMonth(date) &&
                      "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                  )}
                >
                  <span className="leading-none">
                    {date.getDate()}
                  </span>

                  <CompletionIndicator date={date} />

                  {/* Completion percentage tooltip */}
                  {rate > 0 && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                      <div className="bg-popover text-popover-foreground px-2 py-1 rounded text-xs shadow-lg border">
                        {Math.round(rate)}% completado
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-border/50">
          <div className="flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-1">
              <Circle className="h-2 w-2 text-muted-foreground/30" />
              <span className="text-muted-foreground">Sin completar</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-muted-foreground">Parcial</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              <span className="text-muted-foreground">Completado</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};