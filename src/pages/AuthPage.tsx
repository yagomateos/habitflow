import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Sparkles } from 'lucide-react';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold">HabitFlow</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-md">
              Transforma tu vida un hábito a la vez. Construye rutinas que perduran.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <div className="text-2xl">📊</div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Seguimiento Inteligente</h3>
                <p className="text-sm text-muted-foreground">
                  Visualiza tu progreso con estadísticas detalladas y gráficos motivadores.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-green-500/10">
                <div className="text-2xl">🎯</div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Metas Personalizadas</h3>
                <p className="text-sm text-muted-foreground">
                  Define objetivos únicos y recibe recordatorios personalizados.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <div className="text-2xl">🏆</div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Sistema de Logros</h3>
                <p className="text-sm text-muted-foreground">
                  Desbloquea logros y mantén la motivación con desafíos semanales.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <div className="text-2xl">🔄</div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Sincronización Automática</h3>
                <p className="text-sm text-muted-foreground">
                  Tus datos seguros y sincronizados en todos tus dispositivos.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              "Los hábitos son la base del éxito. Cada pequeña acción diaria te acerca a la persona que quieres ser."
            </p>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="w-full">
          {isLogin ? (
            <LoginForm onToggleMode={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onToggleMode={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
}
