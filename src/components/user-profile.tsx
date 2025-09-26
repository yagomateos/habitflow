import { useState } from 'react';
import { User, Settings, Target, Calendar, Bell, Moon, Sun, Monitor, LogOut, Edit3, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from 'next-themes';

export function UserProfile() {
  const { user, updateUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    email: user?.email || ''
  });

  if (!user) return null;

  const handleSave = () => {
    updateUser({
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      email: formData.email
    });
    setIsEditing(false);
  };

  const handlePreferenceChange = (key: string, value: unknown) => {
    updateUser({
      preferences: {
        ...user.preferences,
        [key]: value
      }
    });
  };

  const handleGoalChange = (key: string, value: unknown) => {
    updateUser({
      personalGoals: {
        ...user.personalGoals,
        [key]: value
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-4xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/app')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Mi Perfil</h1>
                <p className="text-muted-foreground">
                  Gestiona tu información personal y preferencias
                </p>
              </div>
            </div>
            <Button onClick={logout} variant="outline" className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </Button>
          </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-lg">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Metas</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Ajustes</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Stats</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información Personal
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className="gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  {isEditing ? 'Guardar' : 'Editar'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Usuario</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground">
                  Miembro desde: {new Date(user.createdAt).toLocaleDateString('es-ES', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Metas Personales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="dailyHabits">Hábitos diarios objetivo</Label>
                <Select
                  value={user.personalGoals.dailyHabits.toString()}
                  onValueChange={(value) => handleGoalChange('dailyHabits', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} hábito{num > 1 ? 's' : ''} por día
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium mb-2 text-blue-700 dark:text-blue-300">
                    Metas Semanales
                  </h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    {user.personalGoals.weeklyGoals.length > 0 
                      ? `${user.personalGoals.weeklyGoals.length} metas activas`
                      : 'Sin metas semanales'
                    }
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <h4 className="font-medium mb-2 text-green-700 dark:text-green-300">
                    Objetivos Mensuales
                  </h4>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {user.personalGoals.monthlyTargets.length > 0 
                      ? `${user.personalGoals.monthlyTargets.length} objetivos activos`
                      : 'Sin objetivos mensuales'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Preferencias
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Notificaciones
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Recibir recordatorios de hábitos
                  </p>
                </div>
                <Switch
                  checked={user.preferences.notifications}
                  onCheckedChange={(checked) => handlePreferenceChange('notifications', checked)}
                />
              </div>

              <div className="space-y-3">
                <Label>Tema de la aplicación</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Claro
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Oscuro
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        Sistema
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Hora de recordatorio</Label>
                <Input
                  type="time"
                  value={user.preferences.reminderTime}
                  onChange={(e) => handlePreferenceChange('reminderTime', e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label>La semana comienza en</Label>
                <Select
                  value={user.preferences.weekStartsOn}
                  onValueChange={(value) => handlePreferenceChange('weekStartsOn', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monday">Lunes</SelectItem>
                    <SelectItem value="sunday">Domingo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Estadísticas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-card">
                  <div className="text-2xl font-bold text-primary">
                    {user.stats.totalHabitsCreated}
                  </div>
                  <p className="text-sm text-muted-foreground">Hábitos creados</p>
                </div>

                <div className="p-4 rounded-lg border bg-card">
                  <div className="text-2xl font-bold text-orange-500">
                    {user.stats.longestStreak}
                  </div>
                  <p className="text-sm text-muted-foreground">Racha más larga</p>
                </div>

                <div className="p-4 rounded-lg border bg-card">
                  <div className="text-2xl font-bold text-green-500">
                    {user.stats.totalCompletions}
                  </div>
                  <p className="text-sm text-muted-foreground">Total completados</p>
                </div>

                <div className="p-4 rounded-lg border bg-card">
                  <div className="text-2xl font-bold text-blue-500">
                    {Math.floor((new Date().getTime() - new Date(user.stats.joinDate).getTime()) / (1000 * 60 * 60 * 24))}
                  </div>
                  <p className="text-sm text-muted-foreground">Días en HabitFlow</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
        </div>
      </div>
    </div>
  );
}
