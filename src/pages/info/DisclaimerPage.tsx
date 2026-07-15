import { Navbar, Footer } from '../../components/layout';
import { SectionReveal, RevealItem } from '../../components/shared';
import { AlertTriangle, ShieldAlert, FileWarning } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-surface-950 text-white relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(239,68,68,0.02),transparent_60%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
      
      <Navbar />

      <main className="relative pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <SectionReveal>
          <RevealItem className="text-center mb-16">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono text-red-400 font-bold tracking-widest uppercase">Operational Hazard Warning</span>
            <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-white mt-2 tracking-tight">
              Liability Disclaimer
            </h1>

          </RevealItem>

          <RevealItem className="space-y-8 text-slate-300 leading-relaxed font-sans text-sm md:text-base">
            <div className="surface-card p-6 md:p-8 rounded-2xl border border-red-500/10 space-y-6 bg-surface-900/40 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-[3px] bg-red-500" />
              <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2 border-b border-white/[0.06] pb-3">
                <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
                1. Educational Limitation & Study Framework
              </h2>
              <p>
                All textbooks, custom vulnerability walkthroughs, network capture logs, proof-of-concept exploits, and sandbox topologies hosted on <span className="text-white font-semibold">Black Cypher</span> are configured and delivered strictly for cybersecurity educational, diagnostic research, and system-defensive training.
              </p>
              <p>
                We do not sponsor, advocate, or facilitate illegal threat activities or unauthorized intrusion attempts.
              </p>
            </div>

            <div className="surface-card p-6 md:p-8 rounded-2xl border border-white/[0.06] space-y-6 bg-surface-900/40 backdrop-blur-md">
              <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2 border-b border-white/[0.06] pb-3">
                <FileWarning className="w-5 h-5 text-red-400 shrink-0" />
                2. Explicit Waiver of Liability
              </h2>
              <p>
                Under no circumstances shall the active directors, developers, instructors, or partners of Black Cypher (including Abhishek Verma and Deepak Dubat) be held liable or legally responsible for any direct, indirect, consequential, or punitive damages arising from the use or misuse of the skills, tools, or configurations learned on this platform.
              </p>
              <p>
                The user alone holds full legal responsibility and liability for their actions, exploits, and operations across external networks.
              </p>
            </div>

            <div className="surface-card p-6 md:p-8 rounded-2xl border border-white/[0.06] space-y-6 bg-surface-900/40 backdrop-blur-md text-xs text-slate-500 font-mono">
              <p>
                CRITICAL WARNING: Attacking foreign networks, databases, or systems without direct, written authorization from the owner is classified as a federal crime under the Computer Fraud and Abuse Act (CFAA) and equivalent international statutes. Keep your operations confined to authorized sandboxes and local testing decks.
              </p>
            </div>
          </RevealItem>
        </SectionReveal>
      </main>

      <Footer />
    </div>
  );
}
