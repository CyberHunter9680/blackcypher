import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass';
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = false, children, ...props }, ref) => {
    const variants = {
      default: 'surface-card',
      elevated: 'surface-elevated shadow-elevated',
      glass: 'glass',
    };

    return (
      <div
        ref={ref}
        className={cn(
          variants[variant],
          hover && 'glass-hover cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
