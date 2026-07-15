import { Award, ShieldCheck, QrCode, Hash } from 'lucide-react';
import { SectionReveal, RevealItem } from '../shared';

export function CertificateShowcase() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <SectionReveal>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <RevealItem>
              <span className="text-caption font-medium text-accent-emerald uppercase tracking-widest">Certificates</span>
              <h2 className="font-heading text-3xl md:text-display-sm font-bold text-white mt-3 mb-4">
                Verifiable proof of your expertise
              </h2>
              <p className="text-body-lg text-slate-400 mb-8">
                Every certificate is cryptographically verified with a unique hash, QR code verification, and tamper-proof design. Recognized by industry leaders.
              </p>

              <div className="space-y-4">
                {[
                  { icon: ShieldCheck, label: 'Cryptographic Verification', desc: 'SHA-256 hash embedded in every certificate' },
                  { icon: QrCode, label: 'QR Code Verification', desc: 'Instant verification via secure QR scan' },
                  { icon: Hash, label: 'Unique Hash ID', desc: 'Blockchain-anchored proof of completion' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent-emerald/10 border border-accent-emerald/20 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-accent-emerald" />
                    </div>
                    <div>
                      <div className="text-body-sm font-semibold text-white">{item.label}</div>
                      <div className="text-caption text-slate-400">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </RevealItem>

            <RevealItem>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-accent-emerald/10 to-accent-cyan/10 rounded-3xl blur-3xl" />
                <div className="relative surface-card p-8 rounded-3xl">
                  <div className="border border-white/[0.08] rounded-2xl p-6 bg-surface-900/50">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-accent-emerald" />
                        <span className="text-caption font-medium text-accent-emerald">VERIFIED</span>
                      </div>
                      <span className="text-caption text-slate-500">0x7a3f...4f6a</span>
                    </div>
                    <h3 className="font-heading text-heading font-bold text-white mb-1">
                      Offensive Security Fundamentals
                    </h3>
                    <p className="text-body-sm text-slate-400 mb-6">Awarded to Alex Mercer</p>
                    <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                      <span className="text-caption text-slate-500">Aug 15, 2025</span>
                      <span className="text-caption font-medium text-accent-emerald">Grade: A+</span>
                    </div>
                  </div>
                </div>
              </div>
            </RevealItem>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
