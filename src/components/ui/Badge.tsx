import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'violet' | 'emerald' | 'neutral';
  className?: string;
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  const variants = {
    cyan: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20',
    violet: 'bg-accent-violet/10 text-accent-violet border-accent-violet/20',
    emerald: 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20',
    neutral: 'bg-white/5 text-slate-300 border-white/10',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-medium border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
