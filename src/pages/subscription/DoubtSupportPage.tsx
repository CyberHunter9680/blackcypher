import { Navbar, Footer } from '../../components/layout';
import { SectionReveal, RevealItem } from '../../components/shared';
import { Video, Terminal, Zap, ArrowRight } from 'lucide-react';
import { Button, Badge } from '../../components/ui';

const doubtExtensions = [
  {
    id: 'm-1',
    name: '1-Month Crisis Clearance',
    price: 1999,
    duration: '1 month',
    desc: 'Perfect for urgent debugging. 4 weekends (8 sessions) of dedicated 1-on-1 expert troubleshooting.',
    popular: false,
    badge: 'Crisis Support'
  },
  {
    id: 'm-2',
    name: '2-Month Operations Extension',
    price: 3499,
    duration: '2 months',
    desc: 'Our recommended baseline. 8 weekends (16 sessions) of comprehensive exploit analysis and sandbox debugging support.',
    popular: true,
    badge: 'Most Popular'
  },
  {
    id: 'm-3',
    name: '3-Month Strategic Retainer',
    price: 4999,
    duration: '3 months',
    desc: 'Unrestricted cyber backup. 12 weekends (24 sessions) of continuous advanced roadmap mentorship and live guidance.',
    popular: false,
    badge: 'Maximum Value'
  }
];

export default function DoubtSupportPage() {
  return (
    <div className="min-h-screen bg-[#030612] text-white selection:bg-accent-cyan/30 relative">
      <Navbar />
      
      {/* Cyberpunk background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent-violet/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <main className="relative pt-32 pb-24 px-6 max-w-7xl mx-auto z-10">
        
        {/* Banner Section */}
        <SectionReveal>
          <RevealItem className="text-center mb-16">
            <span className="text-caption font-mono font-medium text-accent-violet uppercase tracking-widest bg-accent-violet/10 border border-accent-violet/25 px-3 py-1 rounded-full">
              LIVE DEBUGGING ACCESS
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mt-4 mb-4 tracking-tight">
              Pro Doubt Support Renewals & Extensions
            </h1>
            <p className="text-body-lg text-slate-400 max-w-2xl mx-auto">
              Extend or renew your Saturday & Sunday interactive debugging briefings directly. Learn the parameters of active support structures.
            </p>
          </RevealItem>
        </SectionReveal>

        {/* Diagnostic Terminal Banner */}
        <SectionReveal>
          <RevealItem className="max-w-4xl mx-auto mb-16">
            <div className="bg-[#050812]/80 border border-accent-violet/25 rounded-2xl p-6 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_20px_rgba(139,92,246,0.05)]">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-accent-violet/10 border border-accent-violet/30 flex items-center justify-center shrink-0 text-accent-violet animate-pulse mt-0.5">
                  <Terminal className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Doubt Briefing Center Parameters</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1 font-mono">
                    Every Sat & Sun | Live Google Meet Calls | debug code, trace exploit payloads, and finalize roadmaps directly with trainers. Max 15 operators per session.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 text-center shrink-0 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-white/[0.06]">
                <div className="flex-1 px-3">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Meet Length</span>
                  <span className="text-xs font-bold text-white mt-0.5 block font-mono">2+ Hours</span>
                </div>
                <div className="w-[1px] bg-white/[0.08]" />
                <div className="flex-1 px-3">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Delivery</span>
                  <span className="text-xs font-bold text-white mt-0.5 block font-mono">Direct URL</span>
                </div>
              </div>
            </div>
          </RevealItem>
        </SectionReveal>

        {/* Extensions Cards Grid */}
        <SectionReveal>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
            {doubtExtensions.map((tier) => (
              <RevealItem key={tier.id}>
                <div 
                  className={`p-6 rounded-2xl flex flex-col justify-between h-full border backdrop-blur-sm transition-all duration-300 bg-[#070512]/60 ${
                    tier.popular 
                      ? "border-accent-violet/35 shadow-[0_0_25px_rgba(139,92,246,0.08)] bg-[#09071c]/70"
                      : "border-white/[0.06] hover:border-white/[0.12]"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">Support Extension</span>
                      {tier.popular && <Badge variant="violet" className="text-[9px] uppercase font-mono tracking-wider">Best Value</Badge>}
                    </div>
                    <h4 className="font-heading text-sm font-bold text-white mt-3 leading-snug">{tier.name}</h4>
                    <p className="text-caption text-slate-400 mt-2 min-h-[50px] leading-relaxed">{tier.desc}</p>
                    
                    <div className="my-6 flex items-baseline gap-0.5">
                      <span className="font-sans text-xl font-medium text-white mr-0.5 select-none">₹</span>
                      <span className="text-3xl font-black text-white">{tier.price.toLocaleString()}</span>
                      <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase">/ {tier.duration}</span>
                    </div>
                  </div>

                  <a href="/dashboard" className="w-full">
                    <Button 
                      variant={tier.popular ? 'primary' : 'outline'}
                      size="sm"
                      glow={tier.popular ? 'violet' : 'none'}
                      className="w-full font-mono text-[10px] uppercase py-2.5 font-bold tracking-wider flex items-center justify-center gap-1"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Purchase in Dashboard
                    </Button>
                  </a>
                </div>
              </RevealItem>
            ))}
          </div>
        </SectionReveal>

        {/* Help Banner */}
        <SectionReveal>
          <RevealItem className="max-w-4xl mx-auto">
            <div className="rounded-2xl border border-white/[0.06] bg-[#070b19]/40 p-8 text-center backdrop-blur-md">
              <h3 className="font-heading text-lg font-bold text-white mb-2">How to acquire Pro Doubt Support?</h3>
              <p className="text-sm text-slate-400 max-w-xl mx-auto mb-6 leading-relaxed">
                Purchase access is restricted to authenticated operators. To initialize or extend doubt support, log in to your account, visit your Dashboard and access the Live Sessions module.
              </p>
              <a href="/dashboard">
                <Button variant="outline" className="text-xs uppercase font-mono tracking-wider gap-2">
                  Navigate to Dashboard <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </a>
            </div>
          </RevealItem>
        </SectionReveal>

      </main>

      <Footer />
    </div>
  );
}
