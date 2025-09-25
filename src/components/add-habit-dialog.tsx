import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Habit, CATEGORY_CONFIG, CategoryType } from '@/types/habit';
import { cn } from '@/lib/utils';

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

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      onClose?.();
      // Reset form when closing
      setFormData({
        name: editingHabit?.name || '',
        description: editingHabit?.description || '',
        category: editingHabit?.category || 'productivity',
        frequency: editingHabit?.goal.frequency || 'daily',
        target: editingHabit?.goal.target || 7
      });
    }
  };

  // Auto-open when editing
  if (editingHabit && !open) {
    setOpen(true);
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
      
      <DialogContent className="sm:max-w-[425px] glass-card animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {editingHabit ? 'Editar Hábito' : 'Crear Nuevo Hábito'}
          </DialogTitle>
          <DialogDescription>
            {editingHabit 
              ? 'Modifica los detalles de tu hábito'
              : 'Define un nuevo hábito para comenzar tu seguimiento'
            }
          </DialogDescription>
        </DialogHeader>

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
      </DialogContent>
    </Dialog>
  );
};