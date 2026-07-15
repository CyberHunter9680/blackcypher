import { type HTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlowCardProps extends HTMLAttributes<HTMLDivElement> {
  glowColor?: 'cyan' | 'violet' | 'emerald';
}

export const GlowCard = forwardRef<HTMLDivElement, GlowCardProps>(
  ({ className, glowColor = 'cyan', children, ...props }, ref) => {
    const glowColors = {
      cyan: 'rgba(34, 211, 238, 0.06)',
      violet: 'rgba(139, 92, 246, 0.06)',
      emerald: 'rgba(16, 185, 129, 0.06)',
    };

    const borderColors = {
      cyan: 'rgba(34, 211, 238, 0.15)',
      violet: 'rgba(139, 92, 246, 0.15)',
      emerald: 'rgba(16, 185, 129, 0.15)',
    };

    return (
      <motion.div
        ref={ref}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'relative rounded-2xl p-px overflow-hidden',
          className
        )}
        style={{
          background: `linear-gradient(135deg, ${borderColors[glowColor]}, transparent 50%)`,
        }}
        {...(props as any)}
      >
        <div
          className="rounded-2xl h-full"
          style={{
            background: `radial-gradient(ellipse at top left, ${glowColors[glowColor]}, #0B1120 70%)`,
          }}
        >
          {children}
        </div>
      </motion.div>
    );
  }
);

GlowCard.displayName = 'GlowCard';
