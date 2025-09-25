import { useState, useEffect } from 'react';
import { Trophy, Target, Calendar, Clock, Star, Award, Zap, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'weekly' | 'monthly';
  category: 'fitness' | 'productivity' | 'health' | 'personal' | 'all';
  target: number;
  unit: string;
  icon: string;
  reward: {
    points: number;
    badge?: string;
    title?: string;
  };
  startDate: string;
  endDate: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const WEEKLY_CHALLENGES: Omit<Challenge, 'id' | 'startDate' | 'endDate'>[] = [
  {
    title: "Racha de 7 días",
    description: "Completa al menos un hábito durante 7 días consecutivos",
    type: "weekly",
    category: "all",
    target: 7,
    unit: "días",
    icon: "🔥",
    reward: { points: 100, badge: "🔥", title: "Guerrero de la Constancia" },
    difficulty: "easy"
  },
  {
    title: "Multitarea Pro",
    description: "Completa 3 hábitos diferentes en un solo día, 5 veces esta semana",
    type: "weekly",
    category: "all",
    target: 5,
    unit: "días",
    icon: "⚡",
    reward: { points: 150, badge: "⚡", title: "Multitarea Master" },
    difficulty: "medium"
  },
  {
    title: "Madrugador Activo",
    description: "Completa un hábito de fitness antes de las 8 AM, 5 días",
    type: "weekly",
    category: "fitness",
    target: 5,
    unit: "días",
    icon: "🌅",
    reward: { points: 120, badge: "🌅", title: "Gladiador Matutino" },
    difficulty: "medium"
  },
  {
    title: "Zen Master",
    description: "Medita o practica mindfulness durante 5 días seguidos",
    type: "weekly",
    category: "health",
    target: 5,
    unit: "sesiones",
    icon: "🧘",
    reward: { points: 100, badge: "🧘", title: "Maestro Zen" },
    difficulty: "easy"
  },
  {
    title: "Productividad Extrema",
    description: "Completa todos tus hábitos de productividad durante 4 días",
    type: "weekly",
    category: "productivity",
    target: 4,
    unit: "días",
    icon: "🚀",
    reward: { points: 180, badge: "🚀", title: "Productividad Nuclear" },
    difficulty: "hard"
  }
];

const MONTHLY_CHALLENGES: Omit<Challenge, 'id' | 'startDate' | 'endDate'>[] = [
  {
    title: "Transformación Total",
    description: "Completa al menos un hábito cada día del mes",
    type: "monthly",
    category: "all",
    target: 30,
    unit: "días",
    icon: "👑",
    reward: { points: 500, badge: "👑", title: "Rey de los Hábitos" },
    difficulty: "hard"
  },
  {
    title: "Atleta Consistente",
    description: "Ejercítate al menos 20 días este mes",
    type: "monthly",
    category: "fitness",
    target: 20,
    unit: "entrenamientos",
    icon: "💪",
    reward: { points: 300, badge: "💪", title: "Máquina Fitness" },
    difficulty: "medium"
  },
  {
    title: "Lector Voraz",
    description: "Lee al menos 15 días este mes",
    type: "monthly",
    category: "productivity",
    target: 15,
    unit: "días",
    icon: "📚",
    reward: { points: 250, badge: "📚", title: "Devorador de Libros" },
    difficulty: "medium"
  },
  {
    title: "Superhéroe de la Salud",
    description: "Completa hábitos de salud durante 25 días",
    type: "monthly",
    category: "health",
    target: 25,
    unit: "días",
    icon: "🦸",
    reward: { points: 400, badge: "🦸", title: "Superhéroe de la Salud" },
    difficulty: "hard"
  },
  {
    title: "Equilibrio Perfecto",
    description: "Completa al menos un hábito de cada categoría 10 días",
    type: "monthly",
    category: "all",
    target: 10,
    unit: "días",
    icon: "⚖️",
    reward: { points: 350, badge: "⚖️", title: "Maestro del Equilibrio" },
    difficulty: "hard"
  }
];

interface ChallengeProgress {
  challengeId: string;
  progress: number;
  completed: boolean;
  startedAt: string;
}

interface ChallengesSystemProps {
  habits: any[]; // Usar la interfaz Habit real
  className?: string;
}

export const ChallengesSystem = ({ habits, className }: ChallengesSystemProps) => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [progress, setProgress] = useState<ChallengeProgress[]>([]);

  const generateWeekId = (date: Date) => {
    const year = date.getFullYear();
    const week = getWeekNumber(date);
    return `${year}-W${week}`;
  };

  const generateMonthId = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}-M${month.toString().padStart(2, '0')}`;
  };

  const getWeekNumber = (date: Date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  const getWeekDates = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    return { start: startOfWeek, end: endOfWeek };
  };

  const getMonthDates = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);
    
    return { start: startOfMonth, end: endOfMonth };
  };

  const generateCurrentChallenges = () => {
    const now = new Date();
    const weekDates = getWeekDates();
    const monthDates = getMonthDates();
    
    const weeklyChallenges = WEEKLY_CHALLENGES.map((challenge, index) => ({
      ...challenge,
      id: `weekly-${generateWeekId(now)}-${index}`,
      startDate: weekDates.start.toISOString(),
      endDate: weekDates.end.toISOString()
    }));

    const monthlyChallenges = MONTHLY_CHALLENGES.map((challenge, index) => ({
      ...challenge,
      id: `monthly-${generateMonthId(now)}-${index}`,
      startDate: monthDates.start.toISOString(),
      endDate: monthDates.end.toISOString()
    }));

    return [...weeklyChallenges, ...monthlyChallenges];
  };

  const calculateProgress = (challenge: Challenge): number => {
    // Esta es una implementación simplificada
    // En una app real, calcularías basado en los datos reales de hábitos
    const savedProgress = progress.find(p => p.challengeId === challenge.id);
    return savedProgress?.progress || Math.floor(Math.random() * challenge.target);
  };

  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'hard': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
    }
  };

  const getDifficultyLabel = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Medio';
      case 'hard': return 'Difícil';
    }
  };

  const handleJoinChallenge = (challengeId: string) => {
    const newProgress: ChallengeProgress = {
      challengeId,
      progress: 0,
      completed: false,
      startedAt: new Date().toISOString()
    };
    
    setProgress(prev => [...prev.filter(p => p.challengeId !== challengeId), newProgress]);
  };

  useEffect(() => {
    setChallenges(generateCurrentChallenges());
    
    // Cargar progreso guardado
    const savedProgress = localStorage.getItem('challenges-progress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  useEffect(() => {
    // Guardar progreso
    localStorage.setItem('challenges-progress', JSON.stringify(progress));
  }, [progress]);

  const ChallengeCard = ({ challenge }: { challenge: Challenge }) => {
    const currentProgress = calculateProgress(challenge);
    const progressPercentage = (currentProgress / challenge.target) * 100;
    const isCompleted = currentProgress >= challenge.target;
    const userProgress = progress.find(p => p.challengeId === challenge.id);
    const hasJoined = !!userProgress;

    return (
      <Card className={cn(
        "group transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        "bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm border-0",
        isCompleted && "ring-2 ring-primary/20 bg-gradient-to-br from-primary/5 to-primary/10"
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{challenge.icon}</div>
              <div>
                <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {challenge.title}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {challenge.type === 'weekly' ? 'Semanal' : 'Mensual'}
                  </Badge>
                  <Badge 
                    variant="secondary" 
                    className={cn("text-xs", getDifficultyColor(challenge.difficulty))}
                  >
                    {getDifficultyLabel(challenge.difficulty)}
                  </Badge>
                </div>
              </div>
            </div>
            
            {isCompleted && (
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {challenge.description}
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Progreso</span>
              <span className="text-muted-foreground">
                {currentProgress} / {challenge.target} {challenge.unit}
              </span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-2"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">+{challenge.reward.points} puntos</span>
              {challenge.reward.badge && (
                <span className="text-sm">{challenge.reward.badge}</span>
              )}
            </div>

            {!hasJoined ? (
              <Button 
                size="sm" 
                onClick={() => handleJoinChallenge(challenge.id)}
                className="hover:scale-105 transition-transform"
              >
                <Zap className="h-4 w-4 mr-1" />
                Unirse
              </Button>
            ) : (
              <Badge variant={isCompleted ? "default" : "secondary"}>
                {isCompleted ? "¡Completado!" : "En progreso"}
              </Badge>
            )}
          </div>

          {challenge.reward.title && (
            <div className="pt-2 border-t border-border/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Award className="h-3 w-3" />
                <span>Título: "{challenge.reward.title}"</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const weeklyData = challenges.filter(c => c.type === 'weekly');
  const monthlyData = challenges.filter(c => c.type === 'monthly');

  return (
    <div className={className}>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'weekly' | 'monthly')}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Desafíos Activos</h2>
            <p className="text-muted-foreground">
              Completa desafíos para ganar puntos y títulos exclusivos
            </p>
          </div>
          
          <TabsList className="bg-muted/30">
            <TabsTrigger value="weekly" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Semanales
            </TabsTrigger>
            <TabsTrigger value="monthly" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Mensuales
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="weekly" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weeklyData.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {monthlyData.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
