export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  createdAt: string;
  personalGoals: {
    dailyHabits: number;
    weeklyGoals: string[];
    monthlyTargets: string[];
  };
  preferences: {
    notifications: boolean;
    theme: 'light' | 'dark' | 'system';
    reminderTime: string;
    weekStartsOn: 'monday' | 'sunday';
  };
  stats: {
    totalHabitsCreated: number;
    longestStreak: number;
    totalCompletions: number;
    joinDate: string;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface UserSession {
  user: User;
  token: string;
  expiresAt: string;
}
