import { useState, useEffect } from 'react';
import { Quote, RefreshCw, Heart, Star, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MotivationalQuote {
  id: number;
  text: string;
  author: string;
  category: 'success' | 'perseverance' | 'growth' | 'mindset' | 'health';
  tags: string[];
}

const MOTIVATIONAL_QUOTES: MotivationalQuote[] = [
  {
    id: 1,
    text: "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
    author: "Robert Collier",
    category: "perseverance",
    tags: ["consistencia", "esfuerzo", "progreso"]
  },
  {
    id: 2,
    text: "No importa qué tan lento vayas, siempre y cuando no te detengas.",
    author: "Confucio",
    category: "perseverance",
    tags: ["progreso", "paciencia", "constancia"]
  },
  {
    id: 3,
    text: "Los hábitos son los intereses compuestos de la automejora.",
    author: "James Clear",
    category: "growth",
    tags: ["hábitos", "crecimiento", "mejora"]
  },
  {
    id: 4,
    text: "Tu futuro se crea por lo que haces hoy, no mañana.",
    author: "Robert Kiyosaki",
    category: "mindset",
    tags: ["presente", "acción", "futuro"]
  },
  {
    id: 5,
    text: "La disciplina es hacer lo que necesitas hacer, incluso cuando no quieres hacerlo.",
    author: "Anónimo",
    category: "mindset",
    tags: ["disciplina", "voluntad", "compromiso"]
  },
  {
    id: 6,
    text: "Cada día es una nueva oportunidad para cambiar tu vida.",
    author: "Anónimo",
    category: "growth",
    tags: ["oportunidad", "cambio", "renovación"]
  },
  {
    id: 7,
    text: "La motivación te hace empezar, el hábito te hace continuar.",
    author: "Jim Ryun",
    category: "perseverance",
    tags: ["motivación", "hábitos", "continuidad"]
  },
  {
    id: 8,
    text: "Un pequeño paso cada día conduce a grandes cambios en un año.",
    author: "Anónimo",
    category: "growth",
    tags: ["progreso", "tiempo", "transformación"]
  },
  {
    id: 9,
    text: "La excelencia no es un acto, sino un hábito.",
    author: "Aristóteles",
    category: "success",
    tags: ["excelencia", "hábitos", "constancia"]
  },
  {
    id: 10,
    text: "El viaje de mil millas comienza con un solo paso.",
    author: "Lao Tzu",
    category: "mindset",
    tags: ["inicio", "viaje", "primer paso"]
  },
  {
    id: 11,
    text: "Tu salud es tu riqueza. Inviértela sabiamente.",
    author: "Anónimo",
    category: "health",
    tags: ["salud", "inversión", "bienestar"]
  },
  {
    id: 12,
    text: "No se trata de ser perfecto, se trata de ser consistente.",
    author: "Anónimo",
    category: "perseverance",
    tags: ["consistencia", "perfección", "progreso"]
  },
  {
    id: 13,
    text: "El único mal entrenamiento es el que no hiciste.",
    author: "Anónimo",
    category: "health",
    tags: ["ejercicio", "compromiso", "acción"]
  },
  {
    id: 14,
    text: "Planta hoy los hábitos que quieres cosechar mañana.",
    author: "Anónimo",
    category: "growth",
    tags: ["siembra", "futuro", "hábitos"]
  },
  {
    id: 15,
    text: "La magia sucede cuando no te rindes.",
    author: "Anónimo",
    category: "perseverance",
    tags: ["perseverancia", "magia", "no rendirse"]
  }
];

const CATEGORY_CONFIG = {
  success: { color: 'bg-yellow-500', icon: '🏆', label: 'Éxito' },
  perseverance: { color: 'bg-orange-500', icon: '💪', label: 'Perseverancia' },
  growth: { color: 'bg-green-500', icon: '🌱', label: 'Crecimiento' },
  mindset: { color: 'bg-purple-500', icon: '🧠', label: 'Mentalidad' },
  health: { color: 'bg-blue-500', icon: '❤️', label: 'Salud' }
};

interface MotivationalQuotesProps {
  className?: string;
}

export const MotivationalQuotes = ({ className }: MotivationalQuotesProps) => {
  const [currentQuote, setCurrentQuote] = useState<MotivationalQuote | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liked, setLiked] = useState(false);

  const getDailyQuote = () => {
    // Usar la fecha actual como seed para que sea consistente durante el día
    const today = new Date().toDateString();
    const hash = today.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const index = Math.abs(hash) % MOTIVATIONAL_QUOTES.length;
    return MOTIVATIONAL_QUOTES[index];
  };

  const refreshQuote = () => {
    setIsRefreshing(true);
    setLiked(false);
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
      setCurrentQuote(MOTIVATIONAL_QUOTES[randomIndex]);
      setIsRefreshing(false);
    }, 500);
  };

  useEffect(() => {
    setCurrentQuote(getDailyQuote());
    
    // Verificar si ya se marcó como favorita hoy
    const today = new Date().toDateString();
    const likedToday = localStorage.getItem(`quote-liked-${today}`);
    setLiked(!!likedToday);
  }, []);

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    
    const today = new Date().toDateString();
    if (newLiked) {
      localStorage.setItem(`quote-liked-${today}`, 'true');
    } else {
      localStorage.removeItem(`quote-liked-${today}`);
    }
  };

  if (!currentQuote) return null;

  const categoryConfig = CATEGORY_CONFIG[currentQuote.category];

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-500 hover:shadow-xl group",
      "bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-sm",
      "border-0 shadow-lg hover:scale-[1.02]",
      className
    )}>
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-50" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
      
      <CardContent className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Quote className="h-5 w-5 text-primary" />
            <Badge variant="secondary" className="text-xs font-medium">
              <span className="mr-1">{categoryConfig.icon}</span>
              {categoryConfig.label}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn(
                "h-8 w-8 p-0 transition-all duration-300 hover:scale-110",
                liked && "text-red-500 hover:text-red-600"
              )}
            >
              <Heart className={cn(
                "h-4 w-4 transition-all duration-300",
                liked && "fill-current scale-110"
              )} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshQuote}
              disabled={isRefreshing}
              className="h-8 w-8 p-0 transition-all duration-300 hover:scale-110"
            >
              <RefreshCw className={cn(
                "h-4 w-4 transition-all duration-500",
                isRefreshing && "animate-spin"
              )} />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <blockquote className={cn(
            "text-lg font-medium leading-relaxed text-foreground/90 transition-all duration-300",
            "group-hover:text-foreground relative"
          )}>
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary/60 mt-1 flex-shrink-0" />
              <span className="italic">"{currentQuote.text}"</span>
            </div>
          </blockquote>
          
          <div className="flex items-center justify-between">
            <cite className="text-sm font-semibold text-muted-foreground not-italic">
              — {currentQuote.author}
            </cite>
            
            <div className="flex items-center gap-1">
              {currentQuote.tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Indicador de estrella para cita del día */}
        <div className="absolute top-4 left-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
          <Star className="h-8 w-8 text-primary" />
        </div>
      </CardContent>
    </Card>
  );
};
