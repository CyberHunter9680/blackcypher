import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Award, BookOpen, Terminal, CheckCircle2, Zap, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface RoadmapNode {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  description: string;
  isFree: boolean;
  type: 'core' | 'offensive' | 'defensive' | 'advanced';
  xp: number;
}

const typeConfig = {
  core: { label: 'Core', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', glow: 'rgba(59,130,246,0.15)' },
  offensive: { label: 'Offensive', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', glow: 'rgba(239,68,68,0.15)' },
  defensive: { label: 'Defensive', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', glow: 'rgba(16,185,129,0.15)' },
  advanced: { label: 'Expert', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', glow: 'rgba(139,92,246,0.15)' },
};

const levelColors: Record<string, string> = {
  Beginner: 'text-emerald-400',
  Intermediate: 'text-accent-cyan',
  Advanced: 'text-orange-400',
  Expert: 'text-violet-400',
};

export const RoadmapComponent: React.FC = () => {
  const { subscription } = useAuth();
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);

  const isPro = subscription?.tier === 'pro';

  const roadmapNodes: RoadmapNode[] = [
    { id: '1', title: 'Cyber Sec Fundamentals', level: 'Beginner', description: 'Understand basic networking, internet protocols, bash commands and security models.', isFree: true, type: 'core', xp: 500 },
    { id: '2', title: 'OSINT & Reconnaissance', level: 'Beginner', description: 'Master passive reconnaissance, Google dorking, harvesting data via public APIs.', isFree: true, type: 'core', xp: 800 },
    { id: '3', title: 'Ethical Hacking (CEH)', level: 'Intermediate', description: 'CEH v9/v10/v13 modules: scanning ports, exploiting system flaws, professional reporting.', isFree: false, type: 'offensive', xp: 2000 },
    { id: '4', title: 'Web App Pentesting', level: 'Intermediate', description: 'OWASP Top 10: SQL Injection, XSS, CSRF, SSRF exploitation and secure patching.', isFree: false, type: 'offensive', xp: 2500 },
    { id: '5', title: 'Network Defense (SOC)', level: 'Intermediate', description: 'Firewalls, SIEM log analysis, threat detection and incident response workflows.', isFree: false, type: 'defensive', xp: 2200 },
    { id: '6', title: 'Linux Privilege Escalation', level: 'Advanced', description: 'Sudo hijacking, SUID exploitation, cron vulnerabilities and kernel privesc techniques.', isFree: false, type: 'offensive', xp: 3500 },
    { id: '7', title: 'Active Directory Hijacking', level: 'Advanced', description: 'Kerberos exploitation, Golden Ticket attacks, lateral movement and domain dominance.', isFree: false, type: 'offensive', xp: 4000 },
    { id: '8', title: 'Reverse Engineering', level: 'Expert', description: 'Binary analysis with IDA Pro & Ghidra, assembly-level code review and patch automation.', isFree: false, type: 'advanced', xp: 5000 },
  ];

  // Group nodes by level for vertical tree layout
  const groups = {
    Beginner: roadmapNodes.filter(n => n.level === 'Beginner'),
    Intermediate: roadmapNodes.filter(n => n.level === 'Intermediate'),
    Advanced: roadmapNodes.filter(n => n.level === 'Advanced'),
    Expert: roadmapNodes.filter(n => n.level === 'Expert'),
  };

  return (
    <div className="w-full bg-surface-900 border border-white/[0.04] rounded-2xl p-6 md:p-8">
      <div className="text-center mb-10 select-none">
        <span className="text-caption font-semibold text-accent-cyan uppercase tracking-widest">Interactive Pathway</span>
        <h3 className="font-heading text-heading font-bold text-white mt-2">
          Cyber Security Training Roadmap
        </h3>
        <p className="text-body-sm text-slate-400 mt-1 max-w-xl mx-auto">
          Navigate from terminal recruit to cybersecurity commander. Click any node to explore.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Visual Tree Map */}
        <div className="lg:col-span-2 space-y-4 relative">
          {/* Vertical connector line */}
          <div className="absolute left-[21px] top-8 bottom-8 w-[2px] bg-gradient-to-b from-accent-cyan/40 via-accent-violet/30 to-accent-violet/10 rounded-full pointer-events-none" />

          {Object.entries(groups).map(([levelName, nodes]) => (
            <div key={levelName} className="relative pl-12">
              {/* Level label with dot */}
              <div className="absolute left-0 top-2 flex items-center gap-2">
                <div className={`w-[10px] h-[10px] rounded-full border-2 border-surface-900 z-10 ${
                  levelName === 'Beginner' ? 'bg-accent-emerald' :
                  levelName === 'Intermediate' ? 'bg-accent-cyan' :
                  levelName === 'Advanced' ? 'bg-orange-400' : 'bg-accent-violet'
                }`} />
              </div>
              <div className={`text-[9px] font-mono font-bold uppercase tracking-widest mb-2 ${levelColors[levelName]}`}>
                — {levelName}
              </div>

              {/* Node cards for this level */}
              <div className="grid sm:grid-cols-2 gap-3">
                {nodes.map((node, idx) => {
                  const isNodeLocked = !node.isFree && !isPro;
                  const isSelected = selectedNode?.id === node.id;
                  const cfg = typeConfig[node.type];

                  return (
                    <motion.div
                      key={node.id}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      onClick={() => setSelectedNode(node)}
                      className={`cursor-pointer p-3.5 rounded-xl border transition-all relative overflow-hidden ${
                        isSelected
                          ? 'border-accent-cyan/50 bg-accent-cyan/5'
                          : isNodeLocked
                          ? 'border-white/[0.04] bg-surface-950/50 opacity-60 hover:opacity-90'
                          : 'border-white/[0.07] bg-surface-850 hover:border-accent-cyan/30'
                      }`}
                      style={isSelected ? { boxShadow: `0 0 20px ${cfg.glow}` } : undefined}
                    >
                      {/* Locked overlay stripe */}
                      {isNodeLocked && (
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_6px,rgba(255,255,255,0.01)_6px,rgba(255,255,255,0.01)_12px)] pointer-events-none" />
                      )}

                      <div className="flex items-start justify-between mb-2">
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.border} ${cfg.color}`}>
                          {cfg.label}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[9px] font-mono ${cfg.color}`}>+{node.xp} XP</span>
                          {isNodeLocked ? (
                            <Lock className="w-3.5 h-3.5 text-slate-600" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5 text-accent-cyan" />
                          )}
                        </div>
                      </div>

                      <h4 className="font-heading text-[13px] font-bold text-white leading-tight">
                        {node.title}
                      </h4>

                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-[10px] font-mono ${levelColors[node.level]}`}>{node.level}</span>
                        <span className="text-[9px] text-accent-cyan font-mono flex items-center gap-0.5">
                          Details <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        <div className="bg-surface-950/80 border border-white/[0.06] rounded-xl p-5 font-mono flex flex-col justify-between min-h-[380px]">
          {selectedNode ? (
            <div className="space-y-4 flex-1">
              {/* Terminal header */}
              <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
                <Terminal className="w-4 h-4 text-accent-cyan" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Node Details</span>
                <span className="ml-auto w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
              </div>

              {/* Node info */}
              <div>
                <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${typeConfig[selectedNode.type].color}`}>
                  {typeConfig[selectedNode.type].label} Track
                </div>
                <h4 className="font-heading text-body-md font-bold text-white leading-tight">{selectedNode.title}</h4>
                <div className={`text-[10px] mt-1 ${levelColors[selectedNode.level]}`}>{selectedNode.level} Level</div>
              </div>

              {/* Description */}
              <p className="text-[11px] text-slate-400 leading-relaxed bg-surface-900/50 p-3 rounded-lg border border-white/[0.04]">
                <span className="text-accent-cyan font-bold">&gt; </span>
                {selectedNode.description}
              </p>

              {/* Metadata */}
              <div className="space-y-2 text-caption">
                {[
                  { label: 'XP REWARD', value: `+${selectedNode.xp} XP`, color: 'text-accent-cyan' },
                  { label: 'ACCESS', value: selectedNode.isFree || isPro ? '✓ GRANTED' : '✗ PRO REQUIRED', color: selectedNode.isFree || isPro ? 'text-accent-emerald' : 'text-red-400' },
                  { label: 'NODE ID', value: `BC-NODE-${selectedNode.id.padStart(3, '0')}`, color: 'text-slate-400' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex justify-between items-center p-2 rounded-lg bg-surface-900/30">
                    <span className="text-slate-600">{label}</span>
                    <span className={`font-bold ${color}`}>{value}</span>
                  </div>
                ))}
              </div>

              {!selectedNode.isFree && !isPro && (
                <div className="p-2.5 bg-red-950/40 border border-red-500/20 rounded-lg text-[10px] text-red-300 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  This track requires Pro Operator clearance. Upgrade to unlock all 6 premium nodes.
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-full my-auto text-slate-500 space-y-3">
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                <Shield className="w-10 h-10 text-slate-600" />
              </motion.div>
              <p className="text-caption uppercase tracking-wider font-bold">Awaiting Node Selection</p>
              <p className="text-[10px] text-slate-600 max-w-[200px]">Click any training node to extract study files and XP details.</p>
            </div>
          )}

          {/* CTA */}
          {selectedNode && (
            <div className="pt-4 border-t border-white/[0.06] mt-4">
              {selectedNode.isFree || isPro ? (
                <a href="/dashboard">
                  <button className="w-full bg-gradient-to-r from-accent-cyan to-cyan-600 hover:from-cyan-400 hover:to-accent-cyan text-black font-semibold text-caption tracking-wider uppercase py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> Initialize Training
                  </button>
                </a>
              ) : (
                <a href="/subscription">
                  <button className="w-full bg-gradient-to-r from-accent-violet to-violet-700 hover:from-violet-500 hover:to-accent-violet text-white font-semibold text-caption tracking-wider uppercase py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> Upgrade to Pro
                  </button>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
