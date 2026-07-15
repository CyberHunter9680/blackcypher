import { Navbar, Footer } from '../../components/layout';
import { SectionReveal, RevealItem } from '../../components/shared';
import { Shield, Eye, Lock } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface-950 text-white relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.02),transparent_60%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-violet/30 to-transparent" />
      
      <Navbar />

      <main className="relative pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <SectionReveal>
          <RevealItem className="text-center mb-16">
            <div className="w-12 h-12 rounded-xl bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center mx-auto mb-4 text-accent-violet shadow-glow-violet/10">
              <Eye className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono text-accent-violet font-bold tracking-widest uppercase">Privacy Operations Deck</span>
            <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-white mt-2 tracking-tight">
              Privacy Protocol
            </h1>

          </RevealItem>

          <RevealItem className="space-y-8 text-slate-300 leading-relaxed font-sans text-sm md:text-base">
            <div className="surface-card p-6 md:p-8 rounded-2xl border border-white/[0.06] space-y-6 bg-surface-900/40 backdrop-blur-md">
              <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2 border-b border-white/[0.06] pb-3">
                <Shield className="w-5 h-5 text-accent-violet shrink-0" />
                1. Data Capture & Node Parameters
              </h2>
              <p>
                We capture only the minimum critical credentials required to deliver secure services: email coordinates, Firebase OTP tokens (if logging in via phone), custom avatar configuration profiles, and student XP progress metrics.
              </p>
              <p>
                These parameters are encrypted at rest and in transit across standard database servers, guaranteeing no plaintext exposure of authentication mechanisms.
              </p>
            </div>

            <div className="surface-card p-6 md:p-8 rounded-2xl border border-white/[0.06] space-y-6 bg-surface-900/40 backdrop-blur-md">
              <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2 border-b border-white/[0.06] pb-3">
                <Lock className="w-5 h-5 text-accent-violet shrink-0" />
                2. Transaction Integrity & Payment Safes
              </h2>
              <p>
                All billing checkouts, meet renewals, and seminar booking payments are processed directly by our highly integrated, PCI-compliant payment infrastructure.
              </p>
              <p>
                Black Cypher databases never intercept, parse, or store raw credit card credentials, expiration parameters, or CVV digits. We retain only receipt ledger histories to maintain subscription logs and grant access clears.
              </p>
            </div>

            <div className="surface-card p-6 md:p-8 rounded-2xl border border-white/[0.06] space-y-6 bg-surface-900/40 backdrop-blur-md">
              <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2 border-b border-white/[0.06] pb-3">
                <Eye className="w-5 h-5 text-accent-violet shrink-0" />
                3. Secure Audits & Data Rights
              </h2>
              <p>
                You retain complete operational authority over your profile node. You can request the permanent purge of all progress history, manual downloads log lists, and billing markers at any moment by contacting our administration desk.
              </p>
              <p>
                We enforce a zero-selling data protocol. Under no circumstances will your profile logs or learning indices be shared, rented, or distributed to advertising nodes or data brokers.
              </p>
            </div>
          </RevealItem>
        </SectionReveal>
      </main>

      <Footer />
    </div>
  );
}
