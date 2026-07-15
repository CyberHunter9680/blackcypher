import { motion, type Variants } from 'framer-motion';

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export function SectionReveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={fadeInUp} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

export function FloatingOrb({ color = 'cyan', size = 300, className = '' }: { color?: 'cyan' | 'violet' | 'emerald'; size?: number; className?: string }) {
  const colors = {
    cyan: 'rgba(34, 211, 238, 0.08)',
    violet: 'rgba(139, 92, 246, 0.08)',
    emerald: 'rgba(16, 185, 129, 0.08)',
  };

  return (
    <div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${colors[color]}, transparent 70%)`,
      }}
    />
  );
}

export function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}

export function BeamLine({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute overflow-hidden pointer-events-none ${className}`}>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-accent-cyan/30 to-transparent animate-beam" />
    </div>
  );
}
