import { useState } from 'react';
import { Calendar, TrendingUp, Sparkles } from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';
import { StatsDashboard } from '@/components/stats-dashboard';
import { HabitsList } from '@/components/habits-list';
import { AddHabitDialog } from '@/components/add-habit-dialog';
import { Button } from '@/components/ui/button';
import { Habit } from '@/types/habit';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Index = () => {
  const { 
    habits, 
    loading, 
    addHabit, 
    updateHabit, 
    deleteHabit, 
    toggleHabitCompletion, 
    getHabitStats, 
    isHabitCompletedToday 
  } = useHabits();
  
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const { toast } = useToast();

  const stats = getHabitStats();

  const handleAddHabit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'completedDates'>) => {
    addHabit(habitData);
    toast({
      title: "¡Hábito creado!",
      description: `"${habitData.name}" ha sido añadido a tu lista.`,
    });
  };

  const handleUpdateHabit = (id: string, updates: Partial<Habit>) => {
    updateHabit(id, updates);
    setEditingHabit(null);
    toast({
      title: "Hábito actualizado",
      description: "Los cambios han sido guardados exitosamente.",
    });
  };

  const handleDeleteHabit = (id: string) => {
    const habit = habits.find(h => h.id === id);
    deleteHabit(id);
    toast({
      title: "Hábito eliminado",
      description: `"${habit?.name}" ha sido eliminado de tu lista.`,
      variant: "destructive",
    });
  };

  const handleToggleCompletion = (id: string) => {
    const habit = habits.find(h => h.id === id);
    const wasCompleted = isHabitCompletedToday(habit!);
    
    toggleHabitCompletion(id);
    
    if (!wasCompleted) {
      toast({
        title: "¡Excelente trabajo! 🎉",
        description: `Has completado "${habit?.name}". ¡Sigue así!`,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Mis Hábitos
              </h1>
              <p className="text-muted-foreground mt-2">
                Construye rutinas positivas, un día a la vez
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="transition-smooth hover:scale-105">
                <Calendar className="h-4 w-4 mr-2" />
                Calendario
              </Button>
              
              <Button variant="outline" size="sm" className="transition-smooth hover:scale-105">
                <TrendingUp className="h-4 w-4 mr-2" />
                Estadísticas
              </Button>
              
              <AddHabitDialog 
                onAddHabit={handleAddHabit}
                editingHabit={editingHabit}
                onUpdateHabit={handleUpdateHabit}
                onClose={() => setEditingHabit(null)}
              />
            </div>
          </div>
        </header>

        {/* Stats Dashboard */}
        <StatsDashboard stats={stats} />

        {/* Habits List */}
        <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Tus Hábitos</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
          </div>
          
          <HabitsList
            habits={habits}
            onToggleComplete={handleToggleCompletion}
            onEditHabit={setEditingHabit}
            onDeleteHabit={handleDeleteHabit}
            isHabitCompletedToday={isHabitCompletedToday}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
