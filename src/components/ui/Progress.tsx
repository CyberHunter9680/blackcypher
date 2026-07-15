import { cn } from '../../lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  variant?: 'cyan' | 'violet' | 'emerald';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function Progress({ value, max = 100, variant = 'cyan', size = 'md', showLabel = false, className }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const variants = {
    cyan: 'bg-accent-cyan',
    violet: 'bg-accent-violet',
    emerald: 'bg-accent-emerald',
  };

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between mb-1.5">
          <span className="text-caption text-slate-400">{value}/{max}</span>
          <span className="text-caption text-slate-400">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn('w-full bg-surface-600 rounded-full overflow-hidden', sizes[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', variants[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
