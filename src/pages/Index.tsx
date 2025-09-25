import { useState } from 'react';
import { Calendar, Sparkles, Trophy, Award, Bell, BarChart3, User } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '@/hooks/useHabits';
import { useAuth } from '@/contexts/AuthContext';
import { PremiumStatsPanel } from '@/components/premium-stats-panel';
import { EnhancedHabitCard } from '@/components/enhanced-habit-card';
import { HabitNowHabitCard } from '@/components/habitnow-habit-card';
import { HabitNowStats } from '@/components/habitnow-stats';
import { CalendarView } from '@/components/calendar-view';
import { ThemeToggle } from '@/components/theme-toggle';
import { ChallengesSystem } from '@/components/challenges-system';
import { AchievementsSystem } from '@/components/achievements-system';
import { NotificationsSystem } from '@/components/notifications-system';
import { AnalyticsDashboard } from '@/components/analytics-dashboard';
import { ConfettiCelebration, AchievementNotification, useAchievements } from '@/components/confetti-celebration';
import { AddHabitDialog } from '@/components/add-habit-dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Habit } from '@/types/habit';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Index = () => {
  const { user, getCurrentUserId } = useAuth();
  const navigate = useNavigate();
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
  } = useHabits(getCurrentUserId());

  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [activeTab, setActiveTab] = useState<'habits' | 'calendar' | 'challenges' | 'achievements' | 'notifications' | 'analytics'>('habits');
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
    <div className="min-h-screen bg-background">
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

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl">
        {/* HabitNow-style Clean Header */}
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-border/50">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 leading-tight">
                HabitFlow
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                ¡Hola {user?.firstName}! Construye mejores hábitos, día a día
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/profile')}
                className="gap-2"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Perfil</span>
              </Button>
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

        {/* HabitNow-style Stats */}
        <div className="mb-6 sm:mb-8">
          <HabitNowStats
            totalHabits={habits.length}
            completedToday={stats.completedToday}
            completionRate={stats.completionRate}
            longestStreak={stats.longestStreak}
            currentStreak={stats.currentStreak}
            weeklyProgress={stats.weeklyProgress}
          />
        </div>

        {/* HabitNow-style Clean Tabs */}
        <div>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="space-y-4 sm:space-y-6">
            {/* Simplified tabs layout */}
            <div className="w-full">
              {/* Mobile Layout */}
              <div className="block lg:hidden">
                <TabsList className="grid grid-cols-3 w-full bg-muted/30 mb-2 h-auto p-1 rounded-lg">
                  <TabsTrigger value="habits" className="flex flex-col items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs py-2 px-1 rounded-md transition-all duration-200">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-[10px] leading-none">Hábitos</span>
                  </TabsTrigger>
                  <TabsTrigger value="calendar" className="flex flex-col items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs py-2 px-1 rounded-md transition-all duration-200">
                    <Calendar className="h-4 w-4" />
                    <span className="text-[10px] leading-none">Calendario</span>
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex flex-col items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs py-2 px-1 rounded-md transition-all duration-200">
                    <BarChart3 className="h-4 w-4" />
                    <span className="text-[10px] leading-none">Analíticas</span>
                  </TabsTrigger>
                </TabsList>
                <TabsList className="grid grid-cols-3 w-full bg-muted/30 h-auto p-1 rounded-lg">
                  <TabsTrigger value="challenges" className="flex flex-col items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs py-2 px-1 rounded-md transition-all duration-200">
                    <Trophy className="h-4 w-4" />
                    <span className="text-[10px] leading-none">Desafíos</span>
                  </TabsTrigger>
                  <TabsTrigger value="achievements" className="flex flex-col items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs py-2 px-1 rounded-md transition-all duration-200">
                    <Award className="h-4 w-4" />
                    <span className="text-[10px] leading-none">Logros</span>
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex flex-col items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs py-2 px-1 rounded-md transition-all duration-200">
                    <Bell className="h-4 w-4" />
                    <span className="text-[10px] leading-none">Ajustes</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Desktop Layout */}
              <TabsList className="hidden lg:grid grid-cols-6 w-full max-w-4xl mx-auto bg-muted/30 rounded-lg p-1">
                <TabsTrigger value="habits" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm rounded-md transition-all duration-200">
                  <Sparkles className="h-4 w-4" />
                  <span>Hábitos</span>
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm rounded-md transition-all duration-200">
                  <Calendar className="h-4 w-4" />
                  <span>Calendario</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm rounded-md transition-all duration-200">
                  <BarChart3 className="h-4 w-4" />
                  <span>Analíticas</span>
                </TabsTrigger>
                <TabsTrigger value="challenges" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm rounded-md transition-all duration-200">
                  <Trophy className="h-4 w-4" />
                  <span>Desafíos</span>
                </TabsTrigger>
                <TabsTrigger value="achievements" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm rounded-md transition-all duration-200">
                  <Award className="h-4 w-4" />
                  <span>Logros</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm rounded-md transition-all duration-200">
                  <Bell className="h-4 w-4" />
                  <span>Ajustes</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Habits View */}
            <TabsContent value="habits" className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <h2 className="text-lg sm:text-xl font-semibold">Tus Hábitos de Hoy</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-border via-border/50 to-transparent" />
              </div>

              {habits.length === 0 ? (
                <div className="text-center py-8 sm:py-12 px-4">
                  <div className="mb-4 text-4xl sm:text-6xl">🌱</div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">¡Comienza tu viaje!</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm sm:text-base">
                    Crea tu primer hábito y comienza a construir rutinas positivas que transformarán tu día a día.
                  </p>
                  <Button onClick={() => setEditingHabit({} as Habit)} size="lg" className="animate-pulse w-full sm:w-auto">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Crear mi primer hábito
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {habits.map((habit, index) => (
                    <div
                      key={habit.id}
                      className="animate-in slide-in-from-bottom duration-500"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <HabitNowHabitCard
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

            {/* Challenges View */}
            <TabsContent value="challenges" className="space-y-6">
              <ChallengesSystem habits={habits} />
            </TabsContent>

            {/* Achievements View */}
            <TabsContent value="achievements" className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <Award className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Sistema de Logros</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-border via-border/50 to-transparent" />
              </div>
              
              <AchievementsSystem habits={habits} />
            </TabsContent>

            {/* Analytics View */}
            <TabsContent value="analytics" className="space-y-6">
              <AnalyticsDashboard habits={habits} />
            </TabsContent>

            {/* Notifications View */}
            <TabsContent value="notifications" className="space-y-6">
              <NotificationsSystem habits={habits} />
            </TabsContent>
          </Tabs>
        </div>

        {/* HabitNow-style Simple Footer */}
        <footer className="mt-8 sm:mt-16 text-center safe-bottom">
          <div className="glass-card rounded-xl p-4 sm:p-6">
            <p className="text-muted-foreground text-sm leading-relaxed">
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
