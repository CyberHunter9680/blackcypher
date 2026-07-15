import { Navbar, Footer } from '../../components/layout';
import { SectionReveal, RevealItem } from '../../components/shared';
import { Shield, FileText, Scale } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface-950 text-white relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.02),transparent_60%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-cyan/30 to-transparent" />
      
      <Navbar />

      <main className="relative pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <SectionReveal>
          <RevealItem className="text-center mb-16">
            <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center mx-auto mb-4 text-accent-cyan shadow-glow-cyan/10">
              <Scale className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono text-accent-cyan font-bold tracking-widest uppercase">Legal Operations Deck</span>
            <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-white mt-2 tracking-tight">
              Terms of Service
            </h1>

          </RevealItem>

          <RevealItem className="space-y-8 text-slate-300 leading-relaxed font-sans text-sm md:text-base">
            <div className="surface-card p-6 md:p-8 rounded-2xl border border-white/[0.06] space-y-6 bg-surface-900/40 backdrop-blur-md">
              <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2 border-b border-white/[0.06] pb-3">
                <Shield className="w-5 h-5 text-accent-cyan shrink-0" />
                1. Authorization & Scope of Access
              </h2>
              <p>
                By enrolling in or purchasing subscriptions from <span className="text-white font-semibold">Black Cypher</span>, you are granted a non-exclusive, non-transferable, revocable license to access educational materials, lab sandboxes, threat roadmaps, and manual documentation. All systems are strictly for personal or institutional learning.
              </p>
              <p>
                Sharing of user accounts, OTP authentication keys, or premium manual PDFs with third parties is strictly prohibited. Violation of these policies will trigger an automatic security lock and immediate cancellation of service without a refund.
              </p>
            </div>

            <div className="surface-card p-6 md:p-8 rounded-2xl border border-white/[0.06] space-y-6 bg-surface-900/40 backdrop-blur-md">
              <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2 border-b border-white/[0.06] pb-3">
                <FileText className="w-5 h-5 text-accent-cyan shrink-0" />
                2. Ethical Hacking Code of Conduct
              </h2>
              <p>
                All offensive techniques, vulnerability scanners, exploit blueprints, and network architectures presented in courses (including CEH modules) are delivered strictly for ethical testing, research, and defensive validation.
              </p>
              <p>
                You explicitly agree never to utilize the knowledge, scripts, or systems provided by Black Cypher to target, breach, or compromise any public networks, databases, server infrastructures, or third-party devices without prior explicit written authorization from the system owners.
              </p>
            </div>

            <div className="surface-card p-6 md:p-8 rounded-2xl border border-white/[0.06] space-y-6 bg-surface-900/40 backdrop-blur-md">
              <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2 border-b border-white/[0.06] pb-3">
                <Scale className="w-5 h-5 text-accent-cyan shrink-0" />
                3. Digital Materials & Intellectual Property
              </h2>
              <p>
                All custom textbooks, vulnerability write-ups, custom pentest lab topologies, videos, and layout graphics are the sole property of Black Cypher. Course materials may be digitally watermarked with your user identification signature to trace malicious distributions.
              </p>
              <p>
                Any reverse-engineering of sandboxed learning servers, scraping of videos, or unauthorized public distribution of core cybersecurity manual assets will constitute copyright infringement and will be met with immediate legal prosecution.
              </p>
            </div>

            <div className="surface-card p-6 md:p-8 rounded-2xl border border-white/[0.06] space-y-6 bg-surface-900/40 backdrop-blur-md text-xs text-slate-500 font-mono">
              <p>
                ACKNOWLEDGEMENT: By proceeding past this page or utilizing any Black Cypher platform tools, you acknowledge that you have read, understood, and agreed to be bound by these legal rules and terms.
              </p>
            </div>
          </RevealItem>
        </SectionReveal>
      </main>

      <Footer />
    </div>
  );
}
