import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  glow?: 'cyan' | 'violet' | 'emerald' | 'none';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', glow = 'none', children, loading = false, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-900 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
      primary: 'bg-accent-cyan text-surface-900 hover:bg-cyan-300 focus:ring-accent-cyan',
      secondary: 'bg-surface-600 text-slate-200 hover:bg-surface-500 focus:ring-surface-500',
      ghost: 'text-slate-300 hover:text-white hover:bg-white/5',
      outline: 'border border-white/10 text-slate-200 hover:bg-white/5 hover:border-white/20',
    };

    const sizes = {
      sm: 'h-8 px-3 text-body-sm gap-1.5',
      md: 'h-10 px-5 text-body gap-2',
      lg: 'h-12 px-7 text-body-lg gap-2.5',
    };

    const glows = {
      cyan: 'glow-cyan',
      violet: 'glow-violet',
      emerald: 'glow-emerald',
      none: '',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={loading ? {} : { scale: 1.02 }}
        whileTap={loading ? {} : { scale: 0.98 }}
        className={cn(baseStyles, variants[variant], sizes[size], glows[glow], className)}
        disabled={disabled || loading}
        {...(props as any)}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Processing...</span>
          </span>
        ) : children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
