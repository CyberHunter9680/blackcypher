import { Navbar, Footer } from '../../components/layout';
import { SectionReveal, RevealItem } from '../../components/shared';
import { Briefcase, Code, Shield, Terminal, ChevronRight, Zap, Mail } from 'lucide-react';

const openRoles = [
  {
    title: 'Cybersecurity Instructor',
    type: 'Full-Time / Remote',
    icon: Shield,
    color: 'text-accent-cyan',
    requirements: [
      'CEH, OSCP, or equivalent certification',
      '3+ years in offensive security or pentesting',
      'Ability to lead live Google Meet doubt sessions',
      'Passion for teaching and student mentorship',
    ]
  },
  {
    title: 'Full-Stack Developer',
    type: 'Contract / Remote',
    icon: Code,
    color: 'text-accent-violet',
    requirements: [
      'React + TypeScript (Vite), Node.js / serverless',
      'Experience with Firebase Auth & PostgreSQL',
      'UI/UX sensibility and attention to detail',
      'Comfortable working in a startup environment',
    ]
  },
  {
    title: 'Content Creator — Cyber',
    type: 'Freelance / Remote',
    icon: Terminal,
    color: 'text-accent-emerald',
    requirements: [
      'Ability to write technical blogs and CVE writeups',
      'Knowledge of OWASP Top 10, CTF challenges',
      'Video editing skills (optional but preferred)',
      'Consistent availability and content quality',
    ]
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-surface-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.02),transparent_60%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-emerald/30 to-transparent" />

      <Navbar />

      <main className="relative pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <SectionReveal>
          <RevealItem className="text-center mb-16">
            <div className="w-14 h-14 rounded-2xl bg-accent-emerald/10 border border-accent-emerald/20 flex items-center justify-center mx-auto mb-5 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <Briefcase className="w-7 h-7 text-accent-emerald" />
            </div>
            <span className="text-[10px] font-mono text-accent-emerald font-bold tracking-widest uppercase">Join the Team</span>
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-white mt-3 mb-4 tracking-tight">
              Careers at <span className="text-accent-emerald">Black Cypher</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              We're building the future of cybersecurity education in India. Join a team of security professionals who actually care about teaching.
            </p>
          </RevealItem>

          {/* Why join */}
          <RevealItem className="mb-14">
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { icon: Zap, title: 'Remote-First', desc: 'Work from anywhere in India. We believe great work can happen anywhere.', color: 'text-accent-cyan' },
                { icon: Shield, title: 'Real Impact', desc: 'Your work directly shapes the next generation of cybersecurity talent.', color: 'text-accent-violet' },
                { icon: Code, title: 'Grow Fast', desc: 'Small team means real ownership, faster decisions, and room to grow.', color: 'text-accent-emerald' },
              ].map(({ icon: Icon, title, desc, color }) => (
                <div key={title} className="p-5 rounded-2xl bg-surface-900/40 border border-white/[0.06] backdrop-blur-md text-center">
                  <Icon className={`w-7 h-7 ${color} mx-auto mb-3`} />
                  <h3 className="font-heading font-bold text-white mb-1.5">{title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </RevealItem>

          {/* Open roles */}
          <RevealItem>
            <h2 className="font-heading text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-accent-emerald" />
              Open Positions
            </h2>
            <div className="space-y-6">
              {openRoles.map((role) => (
                <div key={role.title} className="p-6 rounded-2xl bg-surface-900/40 border border-white/[0.06] hover:border-accent-emerald/25 backdrop-blur-md transition-all">
                  <div className="flex items-start justify-between mb-4 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                        <role.icon className={`w-5 h-5 ${role.color}`} />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-white">{role.title}</h3>
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{role.type}</span>
                      </div>
                    </div>
                    <a
                      href="mailto:admin@blackcypher.org?subject=Career Application"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-emerald text-black text-xs font-bold hover:bg-emerald-400 transition-colors shrink-0"
                    >
                      Apply <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <ul className="space-y-2">
                    {role.requirements.map(req => (
                      <li key={req} className="flex items-start gap-2 text-sm text-slate-400">
                        <ChevronRight className={`w-3.5 h-3.5 ${role.color} shrink-0 mt-0.5`} />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </RevealItem>

          {/* General apply */}
          <RevealItem className="mt-10">
            <div className="p-8 rounded-2xl bg-accent-cyan/5 border border-accent-cyan/15 text-center backdrop-blur-md">
              <Mail className="w-8 h-8 text-accent-cyan mx-auto mb-3" />
              <h3 className="font-heading text-lg font-bold text-white mb-2">Don't see your role?</h3>
              <p className="text-slate-400 text-sm mb-4 max-w-md mx-auto">
                We're always looking for passionate cybersecurity educators, developers, and community managers. Send us your portfolio.
              </p>
              <a href="mailto:admin@blackcypher.org?subject=General Application">
                <button className="px-6 py-2.5 bg-accent-cyan text-black font-bold text-sm rounded-xl hover:bg-cyan-300 transition-colors">
                  Send General Application
                </button>
              </a>
            </div>
          </RevealItem>
        </SectionReveal>
      </main>

      <Footer />
    </div>
  );
}
