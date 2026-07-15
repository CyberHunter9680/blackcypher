import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Instagram, Globe, Mail, Shield, Zap } from 'lucide-react';
import { SectionReveal, RevealItem } from '../shared';

const teamMembers = [
  {
    name: 'Abhishek Sharma',
    role: 'Founder & CEO | Cyber Security Trainer',
    experience: '2+ Years',
    avatar: '/abhishek_sharma.jpg',
    bio: 'Cyber Security Researcher, Full Stack Developer, and Cyber Security Trainer with expertise in Ethical Hacking, Web Application Security, Digital Forensics, and Secure Development. Conducted cybersecurity awareness sessions in schools and colleges while mentoring aspiring professionals through structured training programs and live workshops.',
    skills: [
      'Ethical Hacking',
      'Web Security',
      'Digital Forensics',
      'Full Stack Dev',
      'OSINT',
      'Penetration Testing',
      'Cyber Awareness',
      'Incident Response'
    ],
    social: {
      email: 'mailto:cyberabhisharma@gmail.com',
      linkedin: 'https://www.linkedin.com/in/abhi-sharma7766',
      instagram: 'https://www.instagram.com/abhi_sharma_28_10?igsh=OGhyNzNlZGl4cHVy',
      github: undefined as string | undefined,
      twitter: undefined as string | undefined,
      portfolio: undefined as string | undefined,
    },
    color: 'cyan' as const,
    statusLabel: 'Lead Instructor',
    rank: 'OMEGA-1',
    accentHex: '#06b6d4',
  },
  {
    name: 'Deepak Dubat',
    role: 'CO-Founder | Security Architect',
    experience: '1+ Years',
    avatar: 'https://github.com/DeepakDubat.png',
    bio: 'Cyber Security Enthusiast and Software Developer with expertise in Vulnerability Assessment and Penetration Testing (VAPT), Network Security, and Secure Application Development. Experienced in designing behavioral biometric security systems and full-stack platforms, while actively applying red and blue teaming skills to solve real-world InfoSec challenges.',
    skills: [
      'Ethical Hacking',
      'Web Security',
      'Penetration Testing',
      'Cyber Awareness',
      'OSINT',
      'Web Developer'
    ],
    social: {
      email: 'mailto:dubatdeepak3731@gmail.com',
      github: undefined as string | undefined,
      linkedin: 'https://www.linkedin.com/in/deepakdubat',
      instagram: 'https://www.instagram.com/deepak_dubat/',
      portfolio: undefined as string | undefined,
      twitter: undefined as string | undefined,
    },
    color: 'violet' as const,
    statusLabel: 'Security Architect',
    rank: 'OMEGA-1',
    accentHex: '#8b5cf6',
  },
];

const cv = {
  cyan: {
    border: 'rgba(6,182,212,0.22)',
    borderHover: 'rgba(6,182,212,0.48)',
    glow: '0 0 50px rgba(6,182,212,0.10)',
    glowHover: '0 0 70px rgba(6,182,212,0.20)',
    badge: 'bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan',
    skill: 'bg-accent-cyan/[0.06] border-accent-cyan/20 text-accent-cyan/80 hover:bg-accent-cyan/12 hover:border-accent-cyan/40',
    social: 'hover:text-accent-cyan hover:border-accent-cyan/40 hover:bg-accent-cyan/5',
    status: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20',
    rank: 'bg-accent-cyan/5 border-accent-cyan/15 text-accent-cyan',
    accent: 'text-accent-cyan',
    scanline: 'from-accent-cyan/0 via-accent-cyan/[0.04] to-accent-cyan/0',
    topLine: 'linear-gradient(to right, transparent, #06b6d490, transparent)',
    nameGrad: 'text-accent-cyan',
  },
  violet: {
    border: 'rgba(139,92,246,0.22)',
    borderHover: 'rgba(139,92,246,0.48)',
    glow: '0 0 50px rgba(139,92,246,0.10)',
    glowHover: '0 0 70px rgba(139,92,246,0.20)',
    badge: 'bg-accent-violet/10 border-accent-violet/30 text-accent-violet',
    skill: 'bg-accent-violet/[0.06] border-accent-violet/20 text-accent-violet/80 hover:bg-accent-violet/12 hover:border-accent-violet/40',
    social: 'hover:text-accent-violet hover:border-accent-violet/40 hover:bg-accent-violet/5',
    status: 'bg-accent-violet/10 text-accent-violet border-accent-violet/20',
    rank: 'bg-accent-violet/5 border-accent-violet/15 text-accent-violet',
    accent: 'text-accent-violet',
    scanline: 'from-accent-violet/0 via-accent-violet/[0.04] to-accent-violet/0',
    topLine: 'linear-gradient(to right, transparent, #8b5cf690, transparent)',
    nameGrad: 'text-accent-violet',
  },
};

export function AboutTeam() {
  return (
    <section className="relative py-24 md:py-36 border-t border-white/[0.04] overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(139,92,246,0.035),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none opacity-70" />

      <div className="max-w-6xl mx-auto px-6">
        <SectionReveal>
          {/* ── Header ── */}
          <RevealItem className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-cyan/20 bg-accent-cyan/5 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
              <span className="text-[11px] font-mono font-semibold text-accent-cyan uppercase tracking-[0.2em]">
                Leadership
              </span>
            </div>
            <h2 className="font-heading text-3xl md:text-[2.7rem] font-bold text-white mt-2 mb-4 leading-tight">
              Command Operational{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-violet">
                Directors
              </span>
            </h2>
            <p className="text-body-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
              Meet the security practitioners and system architects guiding your cybersecurity career pathways.
            </p>
          </RevealItem>

          {/* ── Cards ── */}
          <div className="grid md:grid-cols-2 gap-7">
            {teamMembers.map((member) => {
              const c = cv[member.color];
              return (
                <RevealItem key={member.name}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="relative h-full rounded-2xl overflow-hidden group"
                    style={{
                      background: 'linear-gradient(145deg, rgba(12,14,22,0.95), rgba(8,10,18,0.98))',
                      border: `1px solid ${c.border}`,
                      boxShadow: c.glow,
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = c.borderHover;
                      (e.currentTarget as HTMLElement).style.boxShadow = c.glowHover;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = c.border;
                      (e.currentTarget as HTMLElement).style.boxShadow = c.glow;
                    }}
                  >
                    {/* Top accent line */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[1.5px] z-10"
                      style={{ background: c.topLine }}
                    />

                    {/* Animated scanline */}
                    <motion.div
                      animate={{ y: ['-100%', '200%'] }}
                      transition={{ duration: 5, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
                      className={`absolute inset-x-0 h-28 bg-gradient-to-b ${c.scanline} pointer-events-none z-0`}
                    />

                    <div className="relative z-10 p-7 flex flex-col gap-5 h-full">

                      {/* ── Avatar + Identity ── */}
                      <div className="flex items-start gap-5">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <div
                            className="w-[86px] h-[86px] rounded-2xl overflow-hidden"
                            style={{
                              border: `2px solid ${c.border}`,
                              boxShadow: `0 0 20px ${member.accentHex}28`,
                            }}
                          >
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-full h-full object-cover grayscale contrast-[1.15] group-hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                          </div>
                          {/* Live chip */}
                          <div className="absolute -bottom-1 -right-1 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#090b14] border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[8px] font-mono text-emerald-400 font-bold">LIVE</span>
                          </div>
                        </div>

                        {/* Name + role */}
                        <div className="flex-1 min-w-0">
                          {/* Rank pill */}
                          {member.rank && (
                            <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider mb-2 ${c.rank}`}>
                              <Zap className="w-2.5 h-2.5" />
                              {member.rank}
                            </span>
                          )}

                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <h3 className={`font-heading text-[1.1rem] font-bold tracking-wide leading-tight ${c.nameGrad}`}>
                              {member.name}
                            </h3>
                            {member.experience && (
                              <span className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded border uppercase shrink-0 ${c.badge}`}>
                                EXP: {member.experience}
                              </span>
                            )}
                          </div>

                          <p className={`text-[9.5px] font-mono font-semibold mt-1 uppercase tracking-wide leading-snug ${c.accent} opacity-75`}>
                            {member.role}
                          </p>

                          <span className={`inline-flex items-center gap-1 mt-2 text-[9px] font-mono px-2 py-0.5 rounded-full border ${c.status}`}>
                            <Shield className="w-2.5 h-2.5" />
                            {member.statusLabel}
                          </span>
                        </div>
                      </div>

                      {/* ── Bio ── */}
                      <p className="text-[12.5px] text-slate-400 leading-relaxed border-t border-white/[0.05] pt-5">
                        {member.bio}
                      </p>

                      {/* ── Skill tags ── */}
                      <div className="flex flex-wrap gap-1.5">
                        {member.skills.map(skill => (
                          <span
                            key={skill}
                            className={`text-[9px] font-mono font-semibold px-2.5 py-1 rounded-lg border uppercase tracking-wide transition-all duration-200 ${c.skill}`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* ── Social ── */}
                      <div className="flex items-center gap-2 pt-3 border-t border-white/[0.05] mt-auto">
                        <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mr-1">Connect:</span>
                        {[
                          member.social.email ? { Icon: Mail, href: member.social.email, label: 'Email' } : null,
                          member.social.github ? { Icon: Github, href: member.social.github, label: 'GitHub' } : null,
                          member.social.linkedin ? { Icon: Linkedin, href: member.social.linkedin, label: 'LinkedIn' } : null,
                          member.social.twitter ? { Icon: Twitter, href: member.social.twitter, label: 'Twitter' } : null,
                          member.social.instagram ? { Icon: Instagram, href: member.social.instagram, label: 'Instagram' } : null,
                          member.social.portfolio ? { Icon: Globe, href: member.social.portfolio, label: 'Portfolio' } : null,
                        ].filter((s): s is { Icon: any; href: string; label: string } => s !== null).map(({ Icon, href, label }) => (
                          <motion.a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={label}
                            whileHover={{ y: -2, scale: 1.1 }}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 border border-white/[0.06] transition-all duration-200 ${c.social}`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </RevealItem>
              );
            })}
          </div>

          {/* ── Bottom live strip ── */}
          <RevealItem className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-white/[0.07] bg-white/[0.015]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">
                Both instructors actively mentoring — Q3 2026
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </RevealItem>

        </SectionReveal>
      </div>
    </section>
  );
}
