import { useState, useEffect } from 'react';
import { Habit, HabitStats } from '@/types/habit';

const STORAGE_KEY = 'habits-app-data';

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  // Load habits from localStorage on mount
  useEffect(() => {
    const savedHabits = localStorage.getItem(STORAGE_KEY);
    if (savedHabits) {
      try {
        setHabits(JSON.parse(savedHabits));
      } catch (error) {
        console.error('Error loading habits:', error);
      }
    }
    setLoading(false);
  }, []);

  // Save habits to localStorage whenever habits change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    }
  }, [habits, loading]);

  const addHabit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'completedDates'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      streak: 0,
      completedDates: []
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id ? { ...habit, ...updates } : habit
    ));
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
  };

  const toggleHabitCompletion = (id: string, date?: string) => {
    const today = date || new Date().toISOString().split('T')[0];
    
    setHabits(prev => prev.map(habit => {
      if (habit.id !== id) return habit;

      const isCompleted = habit.completedDates.includes(today);
      const newCompletedDates = isCompleted
        ? habit.completedDates.filter(d => d !== today)
        : [...habit.completedDates, today].sort();

      // Calculate new streak
      const newStreak = calculateStreak(newCompletedDates);

      return {
        ...habit,
        completedDates: newCompletedDates,
        streak: newStreak
      };
    }));
  };

  const calculateStreak = (completedDates: string[]): number => {
    if (completedDates.length === 0) return 0;

    const sortedDates = completedDates.sort((a, b) => b.localeCompare(a));
    const today = new Date().toISOString().split('T')[0];
    
    let streak = 0;
    let currentDate = new Date(today);

    for (let i = 0; i < sortedDates.length; i++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      
      if (sortedDates.includes(dateStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const getHabitStats = (): HabitStats => {
    const today = new Date().toISOString().split('T')[0];
    const completedToday = habits.filter(h => h.completedDates.includes(today)).length;
    
    // Weekly completion
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      return date.toISOString().split('T')[0];
    });
    
    const weeklyTotal = habits.length * 7;
    const weeklyCompleted = habits.reduce((acc, habit) => {
      return acc + weekDates.filter(date => habit.completedDates.includes(date)).length;
    }, 0);
    
    const weeklyCompletion = weeklyTotal > 0 ? (weeklyCompleted / weeklyTotal) * 100 : 0;

    // Monthly completion
    const monthStart = new Date();
    monthStart.setDate(1);
    const monthEnd = new Date();
    monthEnd.setMonth(monthEnd.getMonth() + 1, 0);
    
    const monthDays = monthEnd.getDate();
    const monthlyTotal = habits.length * monthDays;
    const monthlyCompleted = habits.reduce((acc, habit) => {
      return acc + habit.completedDates.filter(date => {
        const d = new Date(date);
        return d.getMonth() === monthStart.getMonth() && d.getFullYear() === monthStart.getFullYear();
      }).length;
    }, 0);
    
    const monthlyCompletion = monthlyTotal > 0 ? (monthlyCompleted / monthlyTotal) * 100 : 0;

    return {
      totalHabits: habits.length,
      completedToday,
      currentStreaks: habits.reduce((acc, h) => acc + h.streak, 0),
      weeklyCompletion: Math.round(weeklyCompletion),
      monthlyCompletion: Math.round(monthlyCompletion)
    };
  };

  const getHabitsByCategory = (category: string) => {
    return habits.filter(h => h.category === category);
  };

  const isHabitCompletedToday = (habit: Habit): boolean => {
    const today = new Date().toISOString().split('T')[0];
    return habit.completedDates.includes(today);
  };

  const reorderHabits = (startIndex: number, endIndex: number) => {
    setHabits(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  return {
    habits,
    loading,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    reorderHabits,
    getHabitStats,
    getHabitsByCategory,
    isHabitCompletedToday
  };
};