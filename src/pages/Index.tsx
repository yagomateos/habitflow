import { useState } from 'react';
import { Calendar, Sparkles } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useHabits } from '@/hooks/useHabits';
import { PremiumStatsPanel } from '@/components/premium-stats-panel';
import { EnhancedHabitCard } from '@/components/enhanced-habit-card';
import { CalendarView } from '@/components/calendar-view';
import { ThemeToggle } from '@/components/theme-toggle';
import { ConfettiCelebration, AchievementNotification, useAchievements } from '@/components/confetti-celebration';
import { AddHabitDialog } from '@/components/add-habit-dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    reorderHabits,
    getHabitStats,
    isHabitCompletedToday
  } = useHabits();

  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [activeTab, setActiveTab] = useState('habits');
  const { toast } = useToast();
  const {
    currentAchievement,
    showConfetti,
    triggerAchievement,
    clearAchievement
  } = useAchievements();

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

    if (!wasCompleted && habit) {
      const newStreak = habit.streak + 1;

      toast({
        title: "¡Excelente trabajo! 🎉",
        description: `Has completado "${habit.name}". ¡Sigue así!`,
      });

      // Trigger achievements based on streaks
      if (newStreak === 7) {
        triggerAchievement({
          title: "¡Primera semana completa!",
          description: `Has completado "${habit.name}" por 7 días seguidos`,
          icon: "🔥"
        });
      } else if (newStreak === 30) {
        triggerAchievement({
          title: "¡Un mes de constancia!",
          description: `${habit.name}: 30 días consecutivos completados`,
          icon: "🏆"
        });
      } else if (newStreak === 100) {
        triggerAchievement({
          title: "¡Leyenda de hábitos!",
          description: `¡Increíble! 100 días completando ${habit.name}`,
          icon: "👑"
        });
      }

      // Check if all habits are completed today
      const completedToday = stats.completedToday + 1;
      if (completedToday === habits.length && habits.length > 1) {
        triggerAchievement({
          title: "¡Día perfecto!",
          description: "Has completado todos tus hábitos hoy",
          icon: "✨"
        });
      }
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
      {/* Confetti and achievement notifications */}
      <ConfettiCelebration trigger={showConfetti} />
      {currentAchievement && (
        <AchievementNotification
          isVisible={true}
          title={currentAchievement.title}
          description={currentAchievement.description}
          icon={currentAchievement.icon}
          onClose={clearAchievement}
        />
      )}

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Premium Header */}
        <header className="mb-8 animate-in slide-in-from-top duration-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-2">
                HabitFlow Pro
              </h1>
              <p className="text-muted-foreground text-lg">
                Tu compañero inteligente para construir mejores rutinas ✨
              </p>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <AddHabitDialog
                onAddHabit={handleAddHabit}
                editingHabit={editingHabit}
                onUpdateHabit={handleUpdateHabit}
                onClose={() => setEditingHabit(null)}
              />
            </div>
          </div>
        </header>

        {/* Premium Stats Dashboard */}
        <div className="animate-in slide-in-from-bottom duration-700 delay-200">
          <PremiumStatsPanel stats={stats} />
        </div>

        {/* Main Content Tabs */}
        <div className="animate-in fade-in duration-700 delay-500">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px] mx-auto bg-muted/30 backdrop-blur-sm">
              <TabsTrigger value="habits" className="flex items-center gap-2 data-[state=active]:bg-background/80">
                <Sparkles className="h-4 w-4" />
                Mis Hábitos
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2 data-[state=active]:bg-background/80">
                <Calendar className="h-4 w-4" />
                Calendario
              </TabsTrigger>
            </TabsList>

            {/* Habits View */}
            <TabsContent value="habits" className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Tus Hábitos de Hoy</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-border via-border/50 to-transparent" />
              </div>

              {habits.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mb-4 text-6xl">🌱</div>
                  <h3 className="text-xl font-semibold mb-2">¡Comienza tu viaje!</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Crea tu primer hábito y comienza a construir rutinas positivas que transformarán tu día a día.
                  </p>
                  <Button onClick={() => setEditingHabit({} as Habit)} size="lg" className="animate-pulse">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Crear mi primer hábito
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {habits.map((habit, index) => (
                    <div
                      key={habit.id}
                      className="animate-in slide-in-from-bottom duration-500"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <EnhancedHabitCard
                        habit={habit}
                        isCompleted={isHabitCompletedToday(habit)}
                        onToggleComplete={handleToggleCompletion}
                        onEdit={setEditingHabit}
                        onDelete={handleDeleteHabit}
                      />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Calendar View */}
            <TabsContent value="calendar" className="space-y-6">
              <CalendarView
                habits={habits}
                onDateSelect={(date) => console.log('Selected date:', date)}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Motivational Footer */}
        <footer className="mt-16 text-center animate-in fade-in duration-1000 delay-1000">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 backdrop-blur-sm">
            <p className="text-muted-foreground italic">
              "El éxito es la suma de pequeños esfuerzos repetidos día tras día."
            </p>
            <p className="text-xs text-muted-foreground/70 mt-2">
              — Robert Collier
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
