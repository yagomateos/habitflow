export interface Habit {
  id: string;
  name: string;
  description: string;
  category: 'health' | 'productivity' | 'personal' | 'fitness';
  color: string;
  streak: number;
  completedDates: string[]; // Array de fechas ISO (YYYY-MM-DD)
  createdAt: string;
  goal: {
    frequency: 'daily' | 'weekly';
    target: number;
  };
}

export interface HabitStats {
  totalHabits: number;
  completedToday: number;
  currentStreaks: number;
  weeklyCompletion: number;
  monthlyCompletion: number;
}

export type CategoryType = Habit['category'];

export const CATEGORY_CONFIG = {
  health: {
    name: 'Salud',
    color: 'health',
    gradient: 'gradient-health',
    icon: '🏥'
  },
  fitness: {
    name: 'Fitness',
    color: 'fitness', 
    gradient: 'gradient-fitness',
    icon: '💪'
  },
  productivity: {
    name: 'Productividad',
    color: 'productivity',
    gradient: 'gradient-productivity', 
    icon: '⚡'
  },
  personal: {
    name: 'Personal',
    color: 'personal',
    gradient: 'gradient-personal',
    icon: '🌟'
  }
} as const;