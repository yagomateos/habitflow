import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginData, RegisterData } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType extends AuthState {
  login: (data: LoginData) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  getCurrentUserId: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to convert Supabase user to our User type
function supabaseUserToUser(supabaseUser: SupabaseUser, profile?: any): User {
  return {
    id: supabaseUser.id,
    username: profile?.username || supabaseUser.email?.split('@')[0] || 'user',
    email: supabaseUser.email!,
    firstName: profile?.first_name || 'Usuario',
    lastName: profile?.last_name || 'Demo',
    avatar: supabaseUser.user_metadata?.avatar_url,
    createdAt: supabaseUser.created_at!,
    personalGoals: profile?.personal_goals || {
      dailyHabits: 3,
      weeklyGoals: [],
      monthlyTargets: []
    },
    preferences: profile?.preferences || {
      notifications: true,
      theme: 'system',
      reminderTime: '09:00',
      weekStartsOn: 'monday'
    },
    stats: profile?.stats || {
      totalHabitsCreated: 0,
      longestStreak: 0,
      totalCompletions: 0,
      joinDate: supabaseUser.created_at!
    }
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const user = supabaseUserToUser(session.user);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const user = supabaseUserToUser(session.user);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (data: LoginData): Promise<boolean> => {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast({
          title: "Error de autenticación",
          description: "Email o contraseña incorrectos",
          variant: "destructive"
        });
        return false;
      }

      if (authData.user) {
        const user = supabaseUserToUser(authData.user);
        toast({
          title: "¡Bienvenido de vuelta!",
          description: `Hola ${user.firstName}, que tengas un día productivo.`
        });
      }

      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al iniciar sesión",
        variant: "destructive"
      });
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      if (data.password !== data.confirmPassword) {
        toast({
          title: "Error",
          description: "Las contraseñas no coinciden",
          variant: "destructive"
        });
        return false;
      }

      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
            first_name: data.firstName,
            last_name: data.lastName,
          }
        }
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

      if (authData.user) {
        toast({
          title: "¡Cuenta creada!",
          description: `Bienvenido ${data.firstName}, revisa tu email para confirmar tu cuenta.`
        });
      }

      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al crear la cuenta",
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (!error) {
      toast({
        title: "Sesión cerrada",
        description: "Hasta la próxima, sigue construyendo buenos hábitos."
      });
    }
  };

  const updateUser = (updates: Partial<User>) => {
    // This will be handled by Supabase profiles table in the future
    if (!authState.user) return;

    setAuthState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...updates } : null
    }));
  };

  const getCurrentUserId = (): string | null => {
    return authState.user?.id || null;
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    updateUser,
    getCurrentUserId
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
