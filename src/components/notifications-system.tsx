import { useState, useEffect } from 'react';
import { Bell, Clock, X, Settings, Volume2, VolumeX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Habit } from '@/types/habit';

interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  dailyReminder: {
    enabled: boolean;
    time: string;
  };
  habitReminders: {
    enabled: boolean;
    frequency: 'once' | 'twice' | 'thrice';
    times: string[];
  };
  streakAlerts: {
    enabled: boolean;
    milestones: number[];
  };
  motivationalQuotes: {
    enabled: boolean;
    frequency: 'daily' | 'twice-daily';
  };
}

interface NotificationsSystemProps {
  habits: Habit[];
  className?: string;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: false,
  sound: true,
  dailyReminder: {
    enabled: true,
    time: '08:00'
  },
  habitReminders: {
    enabled: true,
    frequency: 'twice',
    times: ['10:00', '18:00']
  },
  streakAlerts: {
    enabled: true,
    milestones: [3, 7, 14, 30, 50, 100]
  },
  motivationalQuotes: {
    enabled: true,
    frequency: 'daily'
  }
};

export const NotificationsSystem = ({ habits, className }: NotificationsSystemProps) => {
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isTestingNotification, setIsTestingNotification] = useState(false);

  useEffect(() => {
    // Cargar configuración guardada
    const savedSettings = localStorage.getItem('notification-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Verificar permisos de notificación
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    // Guardar configuración
    localStorage.setItem('notification-settings', JSON.stringify(settings));
  }, [settings]);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        setSettings(prev => ({ ...prev, enabled: true }));
      }
    }
  };

  const testNotification = () => {
    if (permission === 'granted') {
      setIsTestingNotification(true);
      
      new Notification('HabitFlow Pro 🎉', {
        body: '¡Esta es una notificación de prueba! Tu sistema está funcionando correctamente.',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'test-notification'
      });

      setTimeout(() => {
        setIsTestingNotification(false);
      }, 3000);
    }
  };

  const scheduleHabitReminders = () => {
    if (!settings.enabled || !settings.habitReminders.enabled) return;

    // En una aplicación real, esto se haría con un service worker
    const now = new Date();
    settings.habitReminders.times.forEach(time => {
      const [hours, minutes] = time.split(':').map(Number);
      const reminderTime = new Date();
      reminderTime.setHours(hours, minutes, 0, 0);

      if (reminderTime > now) {
        const timeToReminder = reminderTime.getTime() - now.getTime();
        setTimeout(() => {
          if (permission === 'granted') {
            new Notification('⏰ Recordatorio de Hábitos', {
              body: '¡Es hora de trabajar en tus hábitos! No pierdas tu racha.',
              icon: '/favicon.ico',
              tag: 'habit-reminder'
            });
          }
        }, timeToReminder);
      }
    });
  };

  const updateSettings = (updates: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const updateNestedSettings = <T extends keyof NotificationSettings>(
    key: T,
    updates: Partial<NotificationSettings[T]>
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: { ...prev[key], ...updates }
    }));
  };

  useEffect(() => {
    if (settings.enabled) {
      scheduleHabitReminders();
    }
  }, [settings]);

  const getPermissionStatus = () => {
    switch (permission) {
      case 'granted':
        return { color: 'text-green-600', label: 'Activadas', icon: '✅' };
      case 'denied':
        return { color: 'text-red-600', label: 'Bloqueadas', icon: '❌' };
      default:
        return { color: 'text-yellow-600', label: 'Pendientes', icon: '⏳' };
    }
  };

  const permissionStatus = getPermissionStatus();

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Sistema de Notificaciones</h2>
          <p className="text-muted-foreground">
            Configura recordatorios inteligentes para mantener tus hábitos
          </p>
        </div>
        
        <Badge variant="outline" className={cn("px-3 py-1", permissionStatus.color)}>
          {permissionStatus.icon} {permissionStatus.label}
        </Badge>
      </div>

      {/* Permission Request */}
      {permission !== 'granted' && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Bell className="h-8 w-8 text-yellow-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                  Activa las Notificaciones
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Permite que HabitFlow Pro te envíe recordatorios para mantener tus hábitos en el camino correcto.
                </p>
              </div>
              <Button onClick={requestPermission} className="bg-yellow-600 hover:bg-yellow-700">
                <Bell className="h-4 w-4 mr-2" />
                Activar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuración General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Notificaciones</div>
                <div className="text-sm text-muted-foreground">
                  Activar/desactivar todas las notificaciones
                </div>
              </div>
              <Switch
                checked={settings.enabled}
                onCheckedChange={(checked) => updateSettings({ enabled: checked })}
                disabled={permission !== 'granted'}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Sonido</div>
                <div className="text-sm text-muted-foreground">
                  Reproducir sonido con las notificaciones
                </div>
              </div>
              <div className="flex items-center gap-2">
                {settings.sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                <Switch
                  checked={settings.sound}
                  onCheckedChange={(checked) => updateSettings({ sound: checked })}
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button
                onClick={testNotification}
                disabled={permission !== 'granted' || !settings.enabled || isTestingNotification}
                variant="outline"
                className="w-full"
              >
                {isTestingNotification ? 'Enviando...' : 'Probar Notificación'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Daily Reminder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recordatorio Diario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Recordatorio matutino</div>
                <div className="text-sm text-muted-foreground">
                  Recibe un recordatorio para revisar tus hábitos
                </div>
              </div>
              <Switch
                checked={settings.dailyReminder.enabled}
                onCheckedChange={(checked) => 
                  updateNestedSettings('dailyReminder', { enabled: checked })
                }
              />
            </div>

            {settings.dailyReminder.enabled && (
              <div>
                <label className="text-sm font-medium">Hora del recordatorio</label>
                <Select
                  value={settings.dailyReminder.time}
                  onValueChange={(value) => 
                    updateNestedSettings('dailyReminder', { time: value })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="06:00">6:00 AM</SelectItem>
                    <SelectItem value="07:00">7:00 AM</SelectItem>
                    <SelectItem value="08:00">8:00 AM</SelectItem>
                    <SelectItem value="09:00">9:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Habit Reminders */}
        <Card>
          <CardHeader>
            <CardTitle>Recordatorios de Hábitos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Recordatorios automáticos</div>
                <div className="text-sm text-muted-foreground">
                  Recibe recordatorios durante el día
                </div>
              </div>
              <Switch
                checked={settings.habitReminders.enabled}
                onCheckedChange={(checked) => 
                  updateNestedSettings('habitReminders', { enabled: checked })
                }
              />
            </div>

            {settings.habitReminders.enabled && (
              <div>
                <label className="text-sm font-medium">Frecuencia</label>
                <Select
                  value={settings.habitReminders.frequency}
                  onValueChange={(value: 'once' | 'twice' | 'thrice') => 
                    updateNestedSettings('habitReminders', { frequency: value })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">Una vez al día</SelectItem>
                    <SelectItem value="twice">Dos veces al día</SelectItem>
                    <SelectItem value="thrice">Tres veces al día</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Streak Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Alertas de Rachas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Celebrar hitos</div>
                <div className="text-sm text-muted-foreground">
                  Notificaciones especiales por rachas importantes
                </div>
              </div>
              <Switch
                checked={settings.streakAlerts.enabled}
                onCheckedChange={(checked) => 
                  updateNestedSettings('streakAlerts', { enabled: checked })
                }
              />
            </div>

            {settings.streakAlerts.enabled && (
              <div>
                <label className="text-sm font-medium mb-2 block">Hitos de celebración</label>
                <div className="flex flex-wrap gap-2">
                  {settings.streakAlerts.milestones.map((milestone) => (
                    <Badge key={milestone} variant="secondary" className="text-xs">
                      {milestone} días
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-primary mb-1">
                {habits.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Hábitos Activos
              </div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-primary mb-1">
                {Math.max(...habits.map(h => h.streak), 0)}
              </div>
              <div className="text-sm text-muted-foreground">
                Mejor Racha
              </div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-primary mb-1">
                {settings.enabled ? 'ON' : 'OFF'}
              </div>
              <div className="text-sm text-muted-foreground">
                Estado de Notificaciones
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
