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
function supabaseUserToUser(supabaseUser: SupabaseUser, profile?: unknown): User {
  const userProfile = profile as Record<string, unknown> | undefined;

  return {
    id: supabaseUser.id,
    username: (userProfile?.username as string) || supabaseUser.email?.split('@')[0] || 'user',
    email: supabaseUser.email!,
    firstName: (userProfile?.first_name as string) || 'Usuario',
    lastName: (userProfile?.last_name as string) || 'Demo',
    avatar: supabaseUser.user_metadata?.avatar_url,
    createdAt: supabaseUser.created_at!,
    personalGoals: (userProfile?.personal_goals as User['personalGoals']) || {
      dailyHabits: 3,
      weeklyGoals: [],
      monthlyTargets: []
    },
    preferences: (userProfile?.preferences as User['preferences']) || {
      notifications: true,
      theme: 'system',
      reminderTime: '09:00',
      weekStartsOn: 'monday'
    },
    stats: (userProfile?.stats as User['stats']) || {
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
      console.error('Error en login Supabase:', error);

      // Fallback: verificar si es usuario demo
      if (data.email === 'demo@habitflow.com' && data.password === 'demo') {
        const demoUser: User = {
          id: 'demo-user-1',
          username: 'demo',
          email: 'demo@habitflow.com',
          firstName: 'Usuario',
          lastName: 'Demo',
          createdAt: new Date().toISOString(),
          personalGoals: {
            dailyHabits: 3,
            weeklyGoals: [],
            monthlyTargets: []
          },
          preferences: {
            notifications: true,
            theme: 'system',
            reminderTime: '09:00',
            weekStartsOn: 'monday'
          },
          stats: {
            totalHabitsCreated: 0,
            longestStreak: 0,
            totalCompletions: 0,
            joinDate: new Date().toISOString()
          }
        };

        setAuthState({
          user: demoUser,
          isAuthenticated: true,
          isLoading: false
        });

        toast({
          title: "¡Bienvenido de vuelta!",
          description: `Hola ${demoUser.firstName}, que tengas un día productivo.`
        });

        return true;
      }

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
          emailRedirectTo: `${window.location.origin}`,
          data: {
            username: data.username,
            first_name: data.firstName,
            last_name: data.lastName,
          }
        }
      });

      // Log para debugging
      console.log('Registro Supabase:', {
        user: authData.user?.email,
        confirmed: authData.user?.email_confirmed_at,
        error: error?.message
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
        // Crear sesión automáticamente sin esperar confirmación de email
        const user = supabaseUserToUser(authData.user);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });

        toast({
          title: "¡Cuenta creada!",
          description: `Bienvenido ${user.firstName}, ya puedes empezar a usar la aplicación.`
        });
      }

      return true;
    } catch (error) {
      console.error('Error en registro Supabase:', error);

      // Fallback: crear usuario localmente si Supabase falla
      try {
        const fallbackUser: User = {
          id: Math.random().toString(36).substring(7),
          username: data.username,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          createdAt: new Date().toISOString(),
          personalGoals: {
            dailyHabits: 3,
            weeklyGoals: [],
            monthlyTargets: []
          },
          preferences: {
            notifications: true,
            theme: 'system',
            reminderTime: '09:00',
            weekStartsOn: 'monday'
          },
          stats: {
            totalHabitsCreated: 0,
            longestStreak: 0,
            totalCompletions: 0,
            joinDate: new Date().toISOString()
          }
        };

        setAuthState({
          user: fallbackUser,
          isAuthenticated: true,
          isLoading: false
        });

        toast({
          title: "¡Cuenta creada!",
          description: `Bienvenido ${data.firstName}, tu cuenta se ha creado exitosamente.`
        });

        return true;
      } catch (fallbackError) {
        toast({
          title: "Error",
          description: "Hubo un problema al crear la cuenta",
          variant: "destructive"
        });
        return false;
      }
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