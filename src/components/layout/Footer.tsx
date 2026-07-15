import { Link } from 'react-router-dom';
import { Shield, Github, Twitter, Linkedin, Mail, ArrowRight, Terminal, Lock, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const footerLinks = {
  Platform: [
    { label: 'Courses', path: '/dashboard' },
    { label: 'Pricing', path: '/subscription' },
    { label: 'Certificates', path: '/certificate' },
  ],
  Resources: [
    { label: 'Documentation', path: '/docs' },
    { label: 'Blog', path: '/blog' },
    { label: 'Community', path: '/community' },
  ],
  Company: [
    { label: 'About Us', path: '/about' },
    { label: 'Careers', path: '/careers' },
    { label: 'Contact', path: '/contact' },
  ],
  Legal: [
    { label: 'Privacy', path: '/privacy' },
    { label: 'Terms', path: '/terms' },
    { label: 'Disclaimer', path: '/disclaimer' },
  ],
};

const socialLinks = [
  { Icon: Github, href: 'https://github.com', label: 'GitHub' },
  { Icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { Icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
];

export function Footer() {
  return (
    <footer className="relative bg-[#050912] border-t border-white/[0.05] overflow-hidden">
      {/* Decorative cyber grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
      
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-cyan/40 to-transparent" />
      
      {/* Background glows */}
      <div className="absolute bottom-0 left-1/4 w-96 h-64 bg-accent-cyan/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-64 bg-accent-violet/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-8">

        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-10 mb-14">
          
          {/* Brand column */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center group-hover:bg-accent-cyan/20 transition-all group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <Shield className="w-4.5 h-4.5 text-accent-cyan" />
              </div>
              <span className="font-heading font-bold text-xl text-white tracking-tight">
                Black<span className="text-accent-cyan">Cypher</span>
              </span>
            </Link>
            
            <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-xs font-sans">
              State-of-the-art cybersecurity training. Master ethical hacking, penetration testing, and defensive security under expert guidance.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: Cpu, label: '8+ Courses', color: 'text-accent-cyan' },
                { icon: Lock, label: 'CEH Prep', color: 'text-accent-violet' },
                { icon: Terminal, label: 'Live Labs', color: 'text-accent-emerald' },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] text-center">
                  <Icon className={`w-3.5 h-3.5 ${color}`} />
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </div>

            {/* Newsletter */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-600" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 outline-none focus:border-accent-cyan/40 transition-all font-mono"
                />
              </div>
              <button className="px-3 py-2 bg-accent-cyan text-surface-950 rounded-lg hover:bg-cyan-300 transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[10px] text-slate-600 mt-1.5 font-mono">Get alerts on new courses & updates</p>
          </div>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[10px] font-mono font-bold text-slate-400 mb-4 uppercase tracking-widest">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-slate-500 hover:text-accent-cyan transition-colors flex items-center gap-1.5 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-accent-cyan transition-colors shrink-0" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider with cyber decoration */}
        <div className="relative mb-8">
          <div className="border-t border-white/[0.05]" />
          <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-[#050912] px-4">
            <div className="flex items-center gap-2 text-accent-cyan/40">
              <div className="w-8 h-[1px] bg-accent-cyan/20" />
              <Shield className="w-4 h-4" />
              <div className="w-8 h-[1px] bg-accent-cyan/20" />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-[11px] text-slate-600 font-mono">
              © 2026 Black Cypher. All rights reserved.
            </p>
            <span className="hidden md:block text-slate-700">·</span>
            <p className="text-[11px] text-slate-600 font-mono flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-accent-cyan/50" />
              Secured with Firebase + Neon Postgres
            </p>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-2">
            {socialLinks.map(({ Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ y: -2 }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-accent-cyan border border-white/[0.05] hover:border-accent-cyan/25 hover:bg-accent-cyan/5 transition-all duration-200"
              >
                <Icon className="w-3.5 h-3.5" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
