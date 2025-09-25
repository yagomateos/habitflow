import { useState } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { HabitCard } from '@/components/habit-card';
import { Habit, CATEGORY_CONFIG, CategoryType } from '@/types/habit';
import { cn } from '@/lib/utils';

interface HabitsListProps {
  habits: Habit[];
  onToggleComplete: (id: string) => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (id: string) => void;
  isHabitCompletedToday: (habit: Habit) => boolean;
}

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'completed' | 'pending' | CategoryType;

export const HabitsList = ({ 
  habits, 
  onToggleComplete, 
  onEditHabit, 
  onDeleteHabit,
  isHabitCompletedToday 
}: HabitsListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Filter habits based on search and filter criteria
  const filteredHabits = habits.filter(habit => {
    // Search filter
    const matchesSearch = habit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         habit.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category/status filter
    let matchesFilter = true;
    switch (filter) {
      case 'completed':
        matchesFilter = isHabitCompletedToday(habit);
        break;
      case 'pending':
        matchesFilter = !isHabitCompletedToday(habit);
        break;
      case 'all':
        matchesFilter = true;
        break;
      default:
        matchesFilter = habit.category === filter;
    }

    return matchesSearch && matchesFilter;
  });

  // Get category counts for badges
  const getCategoryCount = (category: CategoryType) => {
    return habits.filter(h => h.category === category).length;
  };

  const getStatusCount = (status: 'completed' | 'pending') => {
    return habits.filter(h => status === 'completed' ? isHabitCompletedToday(h) : !isHabitCompletedToday(h)).length;
  };

  if (habits.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
          <Grid className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">¡Comienza tu viaje!</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Crea tu primer hábito y comienza a construir rutinas positivas que transformarán tu día a día.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with search and filters */}
      <div className="space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar hábitos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters and view toggle */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-wrap gap-2">
            {/* All */}
            <Badge
              variant={filter === 'all' ? 'default' : 'secondary'}
              className="cursor-pointer transition-smooth hover:scale-105"
              onClick={() => setFilter('all')}
            >
              Todos ({habits.length})
            </Badge>

            {/* Status filters */}
            <Badge
              variant={filter === 'completed' ? 'default' : 'secondary'}
              className="cursor-pointer transition-smooth hover:scale-105 bg-success/10 text-success hover:bg-success hover:text-white"
              onClick={() => setFilter('completed')}
            >
              Completados ({getStatusCount('completed')})
            </Badge>

            <Badge
              variant={filter === 'pending' ? 'default' : 'secondary'}
              className="cursor-pointer transition-smooth hover:scale-105"
              onClick={() => setFilter('pending')}
            >
              Pendientes ({getStatusCount('pending')})
            </Badge>

            {/* Category filters */}
            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
              const count = getCategoryCount(key as CategoryType);
              if (count === 0) return null;
              
              return (
                <Badge
                  key={key}
                  variant={filter === key ? 'default' : 'secondary'}
                  className={cn(
                    "cursor-pointer transition-smooth hover:scale-105",
                    filter === key && `bg-${config.color} hover:bg-${config.color}/90`
                  )}
                  onClick={() => setFilter(key as CategoryType)}
                >
                  {config.icon} {config.name} ({count})
                </Badge>
              );
            })}
          </div>

          {/* View mode toggle */}
          <div className="flex gap-1 bg-muted/30 p-1 rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 px-3"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 px-3"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredHabits.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
            <Search className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2">No se encontraron hábitos</h3>
          <p className="text-muted-foreground">
            Intenta ajustar los filtros o buscar con otros términos.
          </p>
        </div>
      ) : (
        <div className={cn(
          "grid gap-4 animate-fade-in",
          viewMode === 'grid' 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
            : "grid-cols-1"
        )}>
          {filteredHabits.map((habit, index) => (
            <div
              key={habit.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <HabitCard
                habit={habit}
                isCompleted={isHabitCompletedToday(habit)}
                onToggleComplete={onToggleComplete}
                onEdit={onEditHabit}
                onDelete={onDeleteHabit}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};