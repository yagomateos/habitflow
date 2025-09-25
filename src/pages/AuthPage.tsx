import { useState } from 'react';
import { Sparkles, CheckCircle, BarChart3, Target, Trophy, Shield } from 'lucide-react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Branding */}
            <div className="text-center lg:text-left space-y-8">
              {/* Logo & Title */}
              <div className="space-y-4">
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
                    HabitFlow
                  </h1>
                </div>
                <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 font-medium max-w-lg mx-auto lg:mx-0">
                  Construye hábitos que perduran
                </p>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto lg:mx-0">
                  La forma más simple y efectiva de crear rutinas saludables y alcanzar tus metas.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto lg:mx-0">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Estadísticas</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Progreso visual</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Metas</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Objetivos claros</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Trophy className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Logros</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Motivación constante</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                  <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                    <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Privacidad</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Datos seguros</p>
                  </div>
                </div>
              </div>

              {/* Social Proof */}
              <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Gratis para siempre</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Sin anuncios</span>
                </div>
              </div>
            </div>

            {/* Right Side - Auth Forms */}
            <div className="w-full max-w-md mx-auto">
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl p-8">
                {/* Auth Tabs */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-700 rounded-xl mb-6">
                  <button
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isLogin 
                        ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                    onClick={() => setIsLogin(true)}
                  >
                    Iniciar sesión
                  </button>
                  <button
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      !isLogin 
                        ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                    onClick={() => setIsLogin(false)}
                  >
                    Crear cuenta
                  </button>
                </div>

                {/* Forms */}
                {isLogin ? (
                  <LoginForm onToggleMode={() => setIsLogin(false)} />
                ) : (
                  <RegisterForm onToggleMode={() => setIsLogin(true)} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}