import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '../ui';
import { FloatingOrb, GridBackground } from '../shared';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <GridBackground />
      <FloatingOrb color="cyan" size={500} className="top-20 -left-40" />
      <FloatingOrb color="violet" size={400} className="bottom-20 -right-40" />
      <FloatingOrb color="emerald" size={300} className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Animated network nodes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.circle
              key={i}
              cx={`${10 + (i * 4.5) % 90}%`}
              cy={`${10 + (i * 7.3) % 80}%`}
              r="2"
              fill="#22D3EE"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.line
              key={`l-${i}`}
              x1={`${10 + (i * 8) % 80}%`}
              y1={`${15 + (i * 6) % 70}%`}
              x2={`${20 + (i * 9) % 70}%`}
              y2={`${25 + (i * 5) % 60}%`}
              stroke="#22D3EE"
              strokeWidth="0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-cyan/[0.08] border border-accent-cyan/20 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
            <span className="text-caption text-accent-cyan font-medium">Now enrolling for Q3 2026 cohort</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-4xl sm:text-5xl md:text-display-lg font-bold text-white mb-6 tracking-tight"
        >
          Master the Art of
          <br />
          <span className="text-gradient-cyan">Cyber Defense</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-body-lg text-slate-400 max-w-2xl mx-auto mb-10"
        >
          Enterprise-grade cybersecurity training with hands-on labs, real-world scenarios, and industry-recognized certifications. Built for the next generation of security professionals.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/subscription">
            <Button variant="primary" size="lg" glow="cyan">
              Start Learning Free
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            onClick={() => document.getElementById('roadmap-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Play className="w-4 h-4" />
            Explore Roadmap
          </Button>
        </motion.div>


      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-900 to-transparent" />
    </section>
  );
}
