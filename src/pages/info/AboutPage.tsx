import { Navbar, Footer } from '../../components/layout';
import { SectionReveal, RevealItem } from '../../components/shared';
import { Shield, Target, Users, Zap, Award, Globe, BookOpen, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const values = [
  { icon: Shield, title: 'Ethical Practice', desc: 'Every technique taught is framed within the bounds of ethical hacking and authorized security research.', color: 'text-accent-cyan' },
  { icon: Target, title: 'Mission-Focused', desc: 'We train operators who think like attackers to build better defenses — not to break the law.', color: 'text-accent-violet' },
  { icon: Zap, title: 'Live & Practical', desc: 'Real lab environments, real exploits, real feedback. No theory-only classrooms.', color: 'text-orange-400' },
  { icon: Lock, title: 'Security-First', desc: 'All platform data is encrypted, credentials are protected, and no student data is ever sold.', color: 'text-accent-emerald' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.03),transparent_60%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-cyan/30 to-transparent" />

      <Navbar />

      <main className="relative pt-32 pb-24 px-6 max-w-5xl mx-auto">
        <SectionReveal>
          <RevealItem className="text-center mb-20">
            <div className="w-14 h-14 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center mx-auto mb-5 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
              <Globe className="w-7 h-7 text-accent-cyan" />
            </div>
            <span className="text-[10px] font-mono text-accent-cyan font-bold tracking-widest uppercase">Our Story</span>
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-white mt-3 mb-4 tracking-tight">
              About <span className="text-accent-cyan">Black Cypher</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Founded by cybersecurity practitioners who believe every developer, student, and professional deserves access to world-class offensive security training.
            </p>
          </RevealItem>

          {/* Mission statement */}
          <RevealItem className="mb-16">
            <div className="bg-surface-900/40 border border-white/[0.06] rounded-2xl p-8 md:p-12 backdrop-blur-md text-center relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-accent-cyan/60 to-transparent" />
              <BookOpen className="w-8 h-8 text-accent-cyan mx-auto mb-4 opacity-60" />
              <h2 className="font-heading text-2xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-slate-300 text-lg leading-relaxed max-w-3xl mx-auto">
                To democratize cybersecurity education across India and beyond — delivering CEH-level training, live doubt sessions, and hands-on lab environments that prepare students for real-world penetration testing and security operations.
              </p>
            </div>
          </RevealItem>

          {/* Values */}
          <RevealItem>
            <h2 className="font-heading text-2xl font-bold text-white text-center mb-8">Core Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-surface-900/40 border border-white/[0.06] backdrop-blur-md flex gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                    <v.icon className={`w-5 h-5 ${v.color}`} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-white mb-1">{v.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{v.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </RevealItem>
        </SectionReveal>
      </main>

      <Footer />
    </div>
  );
}
