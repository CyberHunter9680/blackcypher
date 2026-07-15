import { motion } from 'framer-motion';
import { Award, ShieldCheck, Hash, Shield, Star, CheckCircle2 } from 'lucide-react';
import type { Certificate } from '../../types';
import { formatDate } from '../../lib/utils';

interface CertificateCardProps {
  certificate: Certificate;
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, rotateY: -8 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="perspective-1000"
    >
      <div className="relative rounded-3xl overflow-hidden preserve-3d"
        style={{
          background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1526 50%, #080e1a 100%)',
          boxShadow: '0 0 0 1px rgba(6,182,212,0.2), 0 0 60px rgba(6,182,212,0.06), 0 25px 60px rgba(0,0,0,0.5)'
        }}
      >
        {/* Holographic shimmer overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div
            className="absolute inset-0 animate-shimmer"
            style={{
              background: 'linear-gradient(135deg, transparent 15%, rgba(6,182,212,0.08) 35%, rgba(139,92,246,0.08) 55%, rgba(16,185,129,0.05) 75%, transparent 90%)',
              backgroundSize: '300% 300%',
            }}
          />
        </div>

        {/* Top border glow line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent-cyan/80 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-violet/40 to-transparent" />

        {/* Background grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        
        {/* Corner decorations */}
        <div className="absolute top-6 left-6 w-8 h-8 border-l-2 border-t-2 border-accent-cyan/30 rounded-tl-lg" />
        <div className="absolute top-6 right-6 w-8 h-8 border-r-2 border-t-2 border-accent-cyan/30 rounded-tr-lg" />
        <div className="absolute bottom-6 left-6 w-8 h-8 border-l-2 border-b-2 border-accent-violet/30 rounded-bl-lg" />
        <div className="absolute bottom-6 right-6 w-8 h-8 border-r-2 border-b-2 border-accent-violet/30 rounded-br-lg" />

        <div className="relative p-8 md:p-12">
          {/* Header row */}
          <div className="flex items-start justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 border border-accent-cyan/25 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                <Shield className="w-6 h-6 text-accent-cyan" />
              </div>
              <div>
                <div className="text-[11px] font-mono font-bold text-accent-cyan uppercase tracking-widest">Black Cypher</div>
                <div className="text-[10px] text-slate-500 font-mono">Security Training Institute</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-emerald/10 border border-accent-emerald/25 shadow-[0_0_12px_rgba(16,185,129,0.1)]">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent-emerald" />
              <span className="text-[10px] font-mono font-bold text-accent-emerald uppercase tracking-wider">Verified</span>
            </div>
          </div>

          {/* Main certificate content */}
          <div className="text-center mb-10">
            <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mb-4">This Certifies That</p>
            
            {/* Student name — premium large display */}
            <div className="relative inline-block mb-6">
              <h2 className="font-heading text-4xl md:text-5xl font-black text-white tracking-tight"
                style={{ textShadow: '0 0 30px rgba(6,182,212,0.3)' }}
              >
                {certificate.userName}
              </h2>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-accent-cyan/50 to-transparent" />
            </div>

            <p className="text-sm text-slate-400 font-sans mb-3">has successfully completed</p>
            
            <h3 className="font-heading text-xl md:text-2xl font-bold mb-6"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              {certificate.courseName}
            </h3>

            {/* Grade badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl border border-accent-emerald/20 bg-accent-emerald/5">
              <Star className="w-4 h-4 text-accent-emerald" />
              <div className="text-left">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Final Grade</div>
                <div className="font-heading text-xl font-black text-accent-emerald">{certificate.grade}</div>
              </div>
              <Award className="w-4 h-4 text-accent-emerald" />
            </div>
          </div>

          {/* Footer info bar */}
          <div className="flex items-center justify-between pt-6 border-t border-white/[0.06]">
            <div>
              <div className="text-[10px] font-mono text-slate-600 uppercase tracking-wider mb-0.5">Date of Issue</div>
              <div className="text-sm font-semibold text-slate-300">{formatDate(certificate.completedAt)}</div>
            </div>
            
            {/* QR placeholder */}
            <div className="w-12 h-12 rounded-lg border border-white/[0.08] bg-white/[0.02] flex items-center justify-center"
              title="QR verification code"
            >
              <div className="w-8 h-8 grid grid-cols-3 gap-px opacity-40">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className={`rounded-sm ${[0,2,4,6,8].includes(i) ? 'bg-accent-cyan' : 'bg-slate-700'}`} />
                ))}
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] font-mono text-slate-600 uppercase tracking-wider mb-0.5">Certificate ID</div>
              <div className="flex items-center gap-1.5 justify-end">
                <Hash className="w-3 h-3 text-slate-600" />
                <span className="text-[11px] font-mono text-slate-400">{certificate.hash}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
