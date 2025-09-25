import { cn } from "@/lib/utils";

interface ProgressCircleProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
}

const sizeConfig = {
  sm: { width: 40, height: 40, strokeWidth: 3 },
  md: { width: 60, height: 60, strokeWidth: 4 },
  lg: { width: 80, height: 80, strokeWidth: 5 }
};

export const ProgressCircle = ({ 
  progress, 
  size = 'md', 
  strokeWidth, 
  className,
  children 
}: ProgressCircleProps) => {
  const config = sizeConfig[size];
  const finalStrokeWidth = strokeWidth || config.strokeWidth;
  const radius = (config.width - finalStrokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={config.width}
        height={config.height}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={config.width / 2}
          cy={config.height / 2}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth={finalStrokeWidth}
          fill="transparent"
          className="opacity-20"
        />
        
        {/* Progress circle */}
        <circle
          cx={config.width / 2}
          cy={config.height / 2}
          r={radius}
          stroke="hsl(var(--primary))"
          strokeWidth={finalStrokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
          style={{
            filter: 'drop-shadow(0 0 6px hsl(var(--primary) / 0.3))'
          }}
        />
      </svg>
      
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};