import { useState } from 'react';
import { Plus, X, Sparkles, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Habit, CATEGORY_CONFIG, CategoryType } from '@/types/habit';
import { cn } from '@/lib/utils';

interface HabitTemplate {
  id: string;
  name: string;
  description: string;
  category: CategoryType;
  frequency: 'daily' | 'weekly';
  target: number;
  icon: string;
  popular?: boolean;
}

const HABIT_TEMPLATES: HabitTemplate[] = [
  // Health Templates
  {
    id: 'water-8-glasses',
    name: 'Beber 8 vasos de agua',
    description: 'Mantente hidratado bebiendo 8 vasos de agua al día',
    category: 'health',
    frequency: 'daily',
    target: 1,
    icon: '💧',
    popular: true
  },
  {
    id: 'sleep-8-hours',
    name: 'Dormir 8 horas',
    description: 'Descanso adecuado para mejor rendimiento',
    category: 'health',
    frequency: 'daily',
    target: 1,
    icon: '😴',
    popular: true
  },
  {
    id: 'meditation',
    name: 'Meditar 10 minutos',
    description: 'Práctica diaria de mindfulness y relajación',
    category: 'health',
    frequency: 'daily',
    target: 1,
    icon: '🧘‍♀️'
  },
  {
    id: 'vitamins',
    name: 'Tomar vitaminas',
    description: 'Suplementos diarios para mejor salud',
    category: 'health',
    frequency: 'daily',
    target: 1,
    icon: '💊'
  },

  // Fitness Templates
  {
    id: 'exercise-30min',
    name: 'Ejercicio 30 minutos',
    description: 'Actividad física diaria para mantenerte en forma',
    category: 'fitness',
    frequency: 'daily',
    target: 1,
    icon: '🏋️‍♀️',
    popular: true
  },
  {
    id: 'walk-10k-steps',
    name: 'Caminar 10,000 pasos',
    description: 'Meta diaria de pasos para actividad cardiovascular',
    category: 'fitness',
    frequency: 'daily',
    target: 1,
    icon: '🚶‍♀️'
  },
  {
    id: 'yoga',
    name: 'Practicar yoga',
    description: 'Sesión de yoga para flexibilidad y relajación',
    category: 'fitness',
    frequency: 'daily',
    target: 1,
    icon: '🧘‍♂️'
  },
  {
    id: 'gym',
    name: 'Ir al gimnasio',
    description: 'Entrenamiento en el gimnasio 3 veces por semana',
    category: 'fitness',
    frequency: 'weekly',
    target: 3,
    icon: '💪'
  },

  // Productivity Templates
  {
    id: 'read-20-pages',
    name: 'Leer 20 páginas',
    description: 'Lectura diaria para crecimiento personal',
    category: 'productivity',
    frequency: 'daily',
    target: 1,
    icon: '📚',
    popular: true
  },
  {
    id: 'no-social-media',
    name: 'Evitar redes sociales',
    description: 'Desintoxicación digital para mejor concentración',
    category: 'productivity',
    frequency: 'daily',
    target: 1,
    icon: '📱'
  },
  {
    id: 'write-journal',
    name: 'Escribir en diario',
    description: 'Reflexión diaria y registro de pensamientos',
    category: 'productivity',
    frequency: 'daily',
    target: 1,
    icon: '📝'
  },
  {
    id: 'learn-skill',
    name: 'Aprender nueva habilidad',
    description: 'Dedica tiempo al desarrollo personal',
    category: 'productivity',
    frequency: 'daily',
    target: 1,
    icon: '🎯'
  },

  // Personal Templates
  {
    id: 'call-family',
    name: 'Llamar a familia',
    description: 'Mantener contacto con seres queridos',
    category: 'personal',
    frequency: 'weekly',
    target: 2,
    icon: '👥'
  },
  {
    id: 'gratitude',
    name: 'Practicar gratitud',
    description: 'Escribir 3 cosas por las que estás agradecido',
    category: 'personal',
    frequency: 'daily',
    target: 1,
    icon: '🙏',
    popular: true
  },
  {
    id: 'clean-space',
    name: 'Ordenar espacio personal',
    description: 'Mantener el entorno limpio y organizado',
    category: 'personal',
    frequency: 'daily',
    target: 1,
    icon: '🧹'
  },
  {
    id: 'hobby-time',
    name: 'Tiempo para hobby',
    description: 'Dedica tiempo a actividades que disfrutas',
    category: 'personal',
    frequency: 'weekly',
    target: 3,
    icon: '🎨'
  }
];

interface AddHabitDialogProps {
  onAddHabit: (habitData: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'completedDates'>) => void;
  editingHabit?: Habit | null;
  onUpdateHabit?: (id: string, updates: Partial<Habit>) => void;
  onClose?: () => void;
}

export const AddHabitDialog = ({
  onAddHabit,
  editingHabit,
  onUpdateHabit,
  onClose
}: AddHabitDialogProps) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('templates');
  const [formData, setFormData] = useState({
    name: editingHabit?.name || '',
    description: editingHabit?.description || '',
    category: editingHabit?.category || 'productivity' as CategoryType,
    frequency: editingHabit?.goal.frequency || 'daily' as 'daily' | 'weekly',
    target: editingHabit?.goal.target || 7
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) return;

    const habitData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category,
      color: CATEGORY_CONFIG[formData.category].color,
      goal: {
        frequency: formData.frequency,
        target: formData.target
      }
    };

    if (editingHabit && onUpdateHabit) {
      onUpdateHabit(editingHabit.id, habitData);
    } else {
      onAddHabit(habitData);
    }

    // Reset form
    setFormData({
      name: '',
      description: '',
      category: 'productivity',
      frequency: 'daily',
      target: 7
    });

    setOpen(false);
    onClose?.();
  };

  const handleTemplateSelect = (template: HabitTemplate) => {
    setFormData({
      name: template.name,
      description: template.description,
      category: template.category,
      frequency: template.frequency,
      target: template.target
    });
    setActiveTab('custom');
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      onClose?.();
      // Reset form and tab when closing
      setActiveTab('templates');
      setFormData({
        name: editingHabit?.name || '',
        description: editingHabit?.description || '',
        category: editingHabit?.category || 'productivity',
        frequency: editingHabit?.goal.frequency || 'daily',
        target: editingHabit?.goal.target || 7
      });
    }
  };

  // Auto-open when editing and switch to custom tab
  if (editingHabit && !open) {
    setOpen(true);
    setActiveTab('custom');
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!editingHabit && (
        <DialogTrigger asChild>
          <Button className="transition-smooth hover:scale-105 shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Hábito
          </Button>
        </DialogTrigger>
      )}
      
      <DialogContent className="sm:max-w-[600px] glass-card animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {editingHabit ? 'Editar Hábito' : 'Crear Nuevo Hábito'}
          </DialogTitle>
          <DialogDescription>
            {editingHabit
              ? 'Modifica los detalles de tu hábito'
              : 'Elige un template o crea tu hábito personalizado'
            }
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          {/* Tab Navigation - Only show for new habits */}
          {!editingHabit && (
            <TabsList className="grid w-full grid-cols-2 bg-muted/30">
              <TabsTrigger value="templates" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="custom" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Personalizado
              </TabsTrigger>
            </TabsList>
          )}

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            {/* Popular Templates */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-4 w-4 text-yellow-500" />
                <Label className="text-sm font-medium">Populares</Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {HABIT_TEMPLATES.filter(t => t.popular).map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={cn(
                      "p-4 rounded-lg border text-left transition-all hover:scale-[1.02] hover:shadow-md",
                      "bg-background/50 backdrop-blur-sm border-border hover:border-primary/30"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-xl">{template.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm mb-1">{template.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {template.description}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {CATEGORY_CONFIG[template.category].icon} {CATEGORY_CONFIG[template.category].name}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {template.frequency === 'daily' ? 'Diario' : `${template.target}x/semana`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* All Templates by Category */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-blue-500" />
                <Label className="text-sm font-medium">Todos los templates</Label>
              </div>

              {Object.entries(CATEGORY_CONFIG).map(([categoryKey, categoryConfig]) => {
                const categoryTemplates = HABIT_TEMPLATES.filter(t => t.category === categoryKey);
                if (categoryTemplates.length === 0) return null;

                return (
                  <div key={categoryKey} className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-sm">{categoryConfig.icon}</div>
                      <Label className="text-xs font-medium text-muted-foreground">
                        {categoryConfig.name}
                      </Label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {categoryTemplates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => handleTemplateSelect(template)}
                          className={cn(
                            "p-3 rounded-md border text-left transition-all hover:scale-[1.01]",
                            "bg-background/30 border-border/50 hover:border-primary/30 hover:bg-background/50"
                          )}
                        >
                          <div className="flex items-start gap-2">
                            <div className="text-sm">{template.icon}</div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-xs mb-1">{template.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {template.frequency === 'daily' ? 'Diario' : `${template.target}x/semana`}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Custom Form Tab */}
          <TabsContent value="custom" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <Label htmlFor="name">Nombre del hábito</Label>
                <Input
                  id="name"
                  placeholder="Ej: Beber 8 vasos de agua"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Descripción (opcional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe tu hábito o añade notas..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1 resize-none"
                  rows={3}
                />
              </div>

              {/* Category */}
              <div>
                <Label>Categoría</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: key as CategoryType }))}
                      className={cn(
                        "p-3 rounded-lg border-2 transition-all text-sm font-medium",
                        "hover:scale-105 active:scale-95",
                        formData.category === key
                          ? `border-${config.color} bg-${config.color}/10 text-${config.color}`
                          : "border-border hover:border-muted-foreground/30"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{config.icon}</span>
                        <span>{config.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="frequency">Frecuencia</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value: 'daily' | 'weekly') =>
                      setFormData(prev => ({ ...prev, frequency: value }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Diario</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="target">Meta</Label>
                  <Input
                    id="target"
                    type="number"
                    min="1"
                    max="30"
                    value={formData.target}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      target: parseInt(e.target.value) || 1
                    }))}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    `bg-${CATEGORY_CONFIG[formData.category].color}`
                  )} />
                  <span className="font-medium">{formData.name || 'Nombre del hábito'}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {CATEGORY_CONFIG[formData.category].icon} {CATEGORY_CONFIG[formData.category].name}
                </Badge>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={!formData.name.trim()}>
                  {editingHabit ? 'Actualizar' : 'Crear Hábito'}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};