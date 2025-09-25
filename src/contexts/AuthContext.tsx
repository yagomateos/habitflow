import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginData, RegisterData, UserSession } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType extends AuthState {
  login: (data: LoginData) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  getCurrentUserId: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulamos una base de datos local con localStorage
class AuthService {
  private static USERS_KEY = 'habitflow_users';
  private static SESSION_KEY = 'habitflow_session';

  static getUsers(): Record<string, User> {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : {};
  }

  static saveUsers(users: Record<string, User>): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  static getSession(): UserSession | null {
    const session = localStorage.getItem(this.SESSION_KEY);
    if (!session) return null;
    
    const parsedSession = JSON.parse(session);
    if (new Date(parsedSession.expiresAt) < new Date()) {
      this.clearSession();
      return null;
    }
    
    return parsedSession;
  }

  static saveSession(session: UserSession): void {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
  }

  static clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }

  static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  static generateToken(): string {
    return Math.random().toString(36).substr(2, 15);
  }

  static async login(email: string, password: string): Promise<User | null> {
    const users = this.getUsers();
    const user = Object.values(users).find(u => u.email === email);
    
    if (!user) return null;
    
    // En una app real, aquí verificarías el password con hash
    // Por simplicidad, asumimos que el password es correcto
    return user;
  }

  static async register(data: RegisterData): Promise<User | null> {
    const users = this.getUsers();
    
    // Verificar si el usuario ya existe
    const existingUser = Object.values(users).find(u => 
      u.email === data.email || u.username === data.username
    );
    
    if (existingUser) return null;

    const newUser: User = {
      id: this.generateId(),
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

    users[newUser.id] = newUser;
    this.saveUsers(users);
    
    return newUser;
  }

  static updateUser(userId: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const user = users[userId];
    
    if (!user) return null;
    
    const updatedUser = { ...user, ...updates };
    users[userId] = updatedUser;
    this.saveUsers(users);
    
    // Actualizar también la sesión
    const session = this.getSession();
    if (session && session.user.id === userId) {
      this.saveSession({ ...session, user: updatedUser });
    }
    
    return updatedUser;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });
  
  const { toast } = useToast();

  useEffect(() => {
    // Verificar si hay una sesión activa al cargar
    const session = AuthService.getSession();
    if (session) {
      setAuthState({
        user: session.user,
        isAuthenticated: true,
        isLoading: false
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (data: LoginData): Promise<boolean> => {
    try {
      const user = await AuthService.login(data.email, data.password);
      
      if (!user) {
        toast({
          title: "Error de autenticación",
          description: "Email o contraseña incorrectos",
          variant: "destructive"
        });
        return false;
      }

      // Crear sesión (expira en 30 días)
      const session: UserSession = {
        user,
        token: AuthService.generateToken(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };

      AuthService.saveSession(session);
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false
      });

      toast({
        title: "¡Bienvenido de vuelta!",
        description: `Hola ${user.firstName}, que tengas un día productivo.`
      });

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

      const user = await AuthService.register(data);
      
      if (!user) {
        toast({
          title: "Error",
          description: "El usuario o email ya existe",
          variant: "destructive"
        });
        return false;
      }

      // Crear sesión automáticamente después del registro
      const session: UserSession = {
        user,
        token: AuthService.generateToken(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };

      AuthService.saveSession(session);
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false
      });

      toast({
        title: "¡Cuenta creada!",
        description: `Bienvenido ${user.firstName}, tu cuenta ha sido creada exitosamente.`
      });

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

  const logout = () => {
    AuthService.clearSession();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });

    toast({
      title: "Sesión cerrada",
      description: "Hasta la próxima, sigue construyendo buenos hábitos."
    });
  };

  const updateUser = (updates: Partial<User>) => {
    if (!authState.user) return;
    
    const updatedUser = AuthService.updateUser(authState.user.id, updates);
    if (updatedUser) {
      setAuthState(prev => ({
        ...prev,
        user: updatedUser
      }));
    }
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
