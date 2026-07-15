import { Shield, Cpu, GraduationCap, Terminal, Lock, BarChart3 } from 'lucide-react';
import { GlowCard } from '../ui';
import { SectionReveal, RevealItem } from '../shared';

const features = [
  {
    icon: Terminal,
    title: 'Hands-On Labs',
    description: 'Real-world scenarios in isolated sandbox environments. No simulations, no toy examples.',
    color: 'cyan' as const,
  },
  {
    icon: Shield,
    title: 'Expert-Led Courses',
    description: 'Content built by security researchers and practitioners from leading organizations.',
    color: 'violet' as const,
  },
  {
    icon: GraduationCap,
    title: 'Industry Certificates',
    description: 'Verifiable, blockchain-anchored certificates recognized by top employers.',
    color: 'emerald' as const,
  },
  {
    icon: Cpu,
    title: 'AI-Powered Learning',
    description: 'Adaptive paths that evolve with your skill level and career goals.',
    color: 'cyan' as const,
  },
  {
    icon: Lock,
    title: 'Zero-Trust Curriculum',
    description: 'From offensive security to cloud architecture, every domain covered.',
    color: 'violet' as const,
  },
  {
    icon: BarChart3,
    title: 'Progress Analytics',
    description: 'Detailed dashboards tracking XP, streaks, and skill progression.',
    color: 'emerald' as const,
  },
];

export function Features() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <SectionReveal>
          <RevealItem className="text-center mb-16">
            <span className="text-caption font-medium text-accent-cyan uppercase tracking-widest">Platform</span>
            <h2 className="font-heading text-3xl md:text-display-sm font-bold text-white mt-3 mb-4">
              Built for serious security training
            </h2>
            <p className="text-body-lg text-slate-400 max-w-2xl mx-auto">
              Every feature designed to accelerate your cybersecurity career with production-quality tools and content.
            </p>
          </RevealItem>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => (
              <RevealItem key={feature.title}>
                <GlowCard glowColor={feature.color} className="h-full">
                  <div className="p-6">
                    <div className={`w-10 h-10 rounded-xl bg-accent-${feature.color}/10 border border-accent-${feature.color}/20 flex items-center justify-center mb-4`}>
                      <feature.icon className={`w-5 h-5 text-accent-${feature.color}`} />
                    </div>
                    <h3 className="font-heading text-heading-sm font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-body-sm text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                </GlowCard>
              </RevealItem>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
