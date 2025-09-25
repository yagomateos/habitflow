import { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Calendar, BarChart3, PieChart, Activity, Target, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Habit, CATEGORY_CONFIG } from '@/types/habit';

interface AnalyticsDashboardProps {
  habits: Habit[];
  className?: string;
}

interface AnalyticsData {
  totalCompletions: number;
  averageStreak: number;
  bestStreak: number;
  completionRate: number;
  categoryBreakdown: Record<string, { count: number; completions: number; percentage: number }>;
  weeklyTrends: { day: string; completions: number }[];
  monthlyTrends: { week: string; completions: number }[];
  habitPerformance: { habitId: string; name: string; rate: number; streak: number }[];
  insights: string[];
}

export const AnalyticsDashboard = ({ habits, className }: AnalyticsDashboardProps) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');

  const analyticsData = useMemo((): AnalyticsData => {
    const now = new Date();
    const totalCompletions = habits.reduce((acc, habit) => acc + habit.completedDates.length, 0);
    const totalStreaks = habits.reduce((acc, habit) => acc + habit.streak, 0);
    const averageStreak = habits.length > 0 ? totalStreaks / habits.length : 0;
    const bestStreak = Math.max(...habits.map(h => h.streak), 0);

    // Calcular tasa de completación
    const daysActive = Math.max(...habits.map(habit => {
      if (habit.completedDates.length === 0) return 0;
      const firstDate = new Date(habit.createdAt);
      const daysDiff = Math.floor((now.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
      return Math.max(daysDiff, 1);
    }), 1);

    const completionRate = habits.length > 0 ? (totalCompletions / (habits.length * daysActive)) * 100 : 0;

    // Análisis por categoría
    const categoryBreakdown = Object.keys(CATEGORY_CONFIG).reduce((acc, category) => {
      const categoryHabits = habits.filter(h => h.category === category);
      const categoryCompletions = categoryHabits.reduce((sum, h) => sum + h.completedDates.length, 0);
      
      acc[category] = {
        count: categoryHabits.length,
        completions: categoryCompletions,
        percentage: totalCompletions > 0 ? (categoryCompletions / totalCompletions) * 100 : 0
      };
      return acc;
    }, {} as Record<string, { count: number; completions: number; percentage: number }>);

    // Tendencias semanales (últimos 7 días)
    const weeklyTrends = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];
      const dayCompletions = habits.reduce((acc, habit) => 
        acc + (habit.completedDates.includes(dateStr) ? 1 : 0), 0
      );
      
      return {
        day: date.toLocaleDateString('es-ES', { weekday: 'short' }),
        completions: dayCompletions
      };
    });

    // Tendencias mensuales (últimas 4 semanas)
    const monthlyTrends = Array.from({ length: 4 }, (_, i) => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (weekStart.getDay() + (3 - i) * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const weekCompletions = habits.reduce((acc, habit) => {
        const weekDays = Array.from({ length: 7 }, (_, j) => {
          const day = new Date(weekStart);
          day.setDate(weekStart.getDate() + j);
          return day.toISOString().split('T')[0];
        });
        
        const habitWeekCompletions = weekDays.filter(day => 
          habit.completedDates.includes(day)
        ).length;
        
        return acc + habitWeekCompletions;
      }, 0);

      return {
        week: `Sem ${i + 1}`,
        completions: weekCompletions
      };
    });

    // Rendimiento por hábito
    const habitPerformance = habits.map(habit => {
      const totalPossible = daysActive;
      const completionRate = totalPossible > 0 ? (habit.completedDates.length / totalPossible) * 100 : 0;
      
      return {
        habitId: habit.id,
        name: habit.name,
        rate: completionRate,
        streak: habit.streak
      };
    }).sort((a, b) => b.rate - a.rate);

    // Generar insights
    const insights = [];
    
    if (bestStreak >= 30) {
      insights.push(`🔥 ¡Increíble! Tu mejor racha es de ${bestStreak} días. Eres un verdadero maestro de los hábitos.`);
    } else if (bestStreak >= 7) {
      insights.push(`💪 Tu mejor racha es de ${bestStreak} días. ¡Sigue así para alcanzar el mes completo!`);
    }

    if (completionRate >= 80) {
      insights.push(`⭐ Tienes una tasa de completación del ${Math.round(completionRate)}%. ¡Excelente consistencia!`);
    } else if (completionRate >= 60) {
      insights.push(`📈 Tu tasa de completación es del ${Math.round(completionRate)}%. Hay espacio para mejorar.`);
    }

    const bestCategory = Object.entries(categoryBreakdown)
      .filter(([_, data]) => data.count > 0)
      .sort((a, b) => b[1].percentage - a[1].percentage)[0];

    if (bestCategory) {
      const categoryName = CATEGORY_CONFIG[bestCategory[0] as keyof typeof CATEGORY_CONFIG].name;
      insights.push(`🎯 Tu categoría más fuerte es ${categoryName} con ${Math.round(bestCategory[1].percentage)}% de tus completaciones.`);
    }

    if (weeklyTrends.length > 0) {
      const recentTrend = weeklyTrends.slice(-3).reduce((acc, curr) => acc + curr.completions, 0);
      const earlierTrend = weeklyTrends.slice(0, 3).reduce((acc, curr) => acc + curr.completions, 0);
      
      if (recentTrend > earlierTrend) {
        insights.push(`📊 ¡Vas en una tendencia ascendente! Tus últimos días han sido más productivos.`);
      }
    }

    return {
      totalCompletions,
      averageStreak,
      bestStreak,
      completionRate,
      categoryBreakdown,
      weeklyTrends,
      monthlyTrends,
      habitPerformance,
      insights
    };
  }, [habits, timeRange]);

  const StatCard = ({ 
    icon, 
    title, 
    value, 
    subtitle, 
    trend, 
    trendValue,
    className: cardClassName 
  }: {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: number;
    className?: string;
  }) => (
    <Card className={cn("transition-all duration-300 hover:shadow-lg", cardClassName)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
          {trend && trendValue && (
            <Badge 
              variant={trend === 'up' ? 'default' : trend === 'down' ? 'destructive' : 'secondary'}
              className="text-xs"
            >
              {trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : 
               trend === 'down' ? <TrendingDown className="h-3 w-3 mr-1" /> : null}
              {trendValue}%
            </Badge>
          )}
        </div>
        
        <div className="space-y-1">
          <div className="text-2xl font-bold text-foreground">
            {value}
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            {title}
          </div>
          {subtitle && (
            <div className="text-xs text-muted-foreground">
              {subtitle}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const CategoryChart = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          Distribución por Categoría
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(analyticsData.categoryBreakdown)
          .filter(([_, data]) => data.count > 0)
          .map(([category, data]) => {
            const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
            return (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span>{config.icon}</span>
                    <span className="font-medium">{config.name}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {Math.round(data.percentage)}%
                  </span>
                </div>
                <Progress value={data.percentage} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {data.completions} completaciones de {data.count} hábitos
                </div>
              </div>
            );
          })}
      </CardContent>
    </Card>
  );

  const TrendsChart = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Tendencia Semanal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {analyticsData.weeklyTrends.map((day, index) => {
            const maxCompletions = Math.max(...analyticsData.weeklyTrends.map(d => d.completions));
            const percentage = maxCompletions > 0 ? (day.completions / maxCompletions) * 100 : 0;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{day.day}</span>
                  <span className="text-muted-foreground">
                    {day.completions} hábitos
                  </span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  const TopHabits = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Rendimiento de Hábitos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {analyticsData.habitPerformance.slice(0, 5).map((habit, index) => (
            <div key={habit.habitId} className="flex items-center gap-3">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white",
                index === 0 ? "bg-yellow-500" :
                index === 1 ? "bg-gray-400" :
                index === 2 ? "bg-orange-500" : "bg-muted"
              )}>
                {index + 1}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">
                  {habit.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  Racha: {habit.streak} días
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-semibold text-sm">
                  {Math.round(habit.rate)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  completación
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Dashboard de Analíticas</h2>
          <p className="text-muted-foreground">
            Insights detallados sobre tu progreso y patrones de hábitos
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Activity className="h-5 w-5" />}
          title="Total Completaciones"
          value={analyticsData.totalCompletions}
          subtitle="Desde el inicio"
        />
        
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          title="Tasa de Completación"
          value={`${Math.round(analyticsData.completionRate)}%`}
          subtitle="Promedio general"
          trend={analyticsData.completionRate >= 70 ? 'up' : analyticsData.completionRate >= 50 ? 'neutral' : 'down'}
          trendValue={Math.round(analyticsData.completionRate)}
        />
        
        <StatCard
          icon={<Target className="h-5 w-5" />}
          title="Mejor Racha"
          value={`${analyticsData.bestStreak} días`}
          subtitle="Récord personal"
        />
        
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          title="Racha Promedio"
          value={`${Math.round(analyticsData.averageStreak)} días`}
          subtitle="Todos los hábitos"
        />
      </div>

      {/* Charts and Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryChart />
            <TopHabits />
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrendsChart />
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Tendencias</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="text-sm font-medium mb-2">Mejor día de la semana</div>
                  <div className="text-lg font-bold text-primary">
                    {analyticsData.weeklyTrends.reduce((best, current) => 
                      current.completions > best.completions ? current : best
                    ).day}
                  </div>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm font-medium mb-2">Promedio semanal</div>
                  <div className="text-lg font-bold">
                    {Math.round(analyticsData.weeklyTrends.reduce((acc, day) => acc + day.completions, 0) / 7)} hábitos/día
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {analyticsData.insights.map((insight, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <p className="text-sm leading-relaxed">{insight}</p>
                </CardContent>
              </Card>
            ))}
            
            {analyticsData.insights.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-muted-foreground">
                    Completa más hábitos para generar insights personalizados
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
