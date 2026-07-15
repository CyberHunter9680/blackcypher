import React, { useState } from 'react';
import { Shield, ChevronLeft, ChevronRight, Lock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SecurePDFViewerProps {
  title: string;
  author?: string;
  totalChapters?: number;
  sampleContent?: string[]; // Array of strings representing pages or page content
}

export const SecurePDFViewer: React.FC<SecurePDFViewerProps> = ({ 
  title, 
  author = 'Black Cypher Team',
  sampleContent = [
    "BLACK CYPHER CORE COMMANDS & EXPLOITATION PROTOCOLS\n\nWelcome operator. This secure workbook is encrypted with your profile signature. Distributing this material is a violation of international cyber laws and your access rights will be terminated immediately.\n\nChapter 1: Network Penetration Fundamentals\nPenetration testing is the practice of testing a computer system, network or web application to find security vulnerabilities that an attacker could exploit. The primary objective is to identify security weaknesses. \n\nTools:\n1. Nmap (Network Mapper): Host discovery and port scanning.\n2. Wireshark: Protocol analysis and packet capture.\n3. Metasploit: Exploit verification and vulnerability assessment.",
    "Chapter 2: Active Information Gathering\nEnumeration is defined as the process of extracting user names, machine names, network resources, shares and services from a system. In this phase, the attacker establishes an active connection to the target system and performs directed queries to gain more information.\n\nPort Scanning Status:\n- TCP Port 21: FTP (File Transfer Protocol)\n- TCP Port 22: SSH (Secure Shell)\n- TCP Port 80: HTTP (Web Server)\n- TCP Port 443: HTTPS (Encrypted Web Server)\n\nWe utilize advanced scripting languages to crawl and probe these open gates.",
    "Chapter 3: Privilege Escalation Protocols\nOnce access has been established, the next phase is to escalate privileges from a standard user to superuser (root/Administrator) privileges. \n\nLinux Vectors:\n- SUID executables misconfigurations.\n- Kernel exploits (e.g. Dirty COW).\n- Cron jobs running with elevated root permissions.\n- Sudo rights hijack.",
    "Chapter 4: Maintaining Access & Clearing Logs\nTo persist inside a system, backdoors are installed. A backdoor bypasses normal authentication mechanisms. Examples include shell scripts triggered on boot or modified ssh keys.\n\nClearing Footprints:\n- Editing /var/log/auth.log\n- Deleting bash history (~/.bash_history)\n- Utilizing stealth shell executors."
  ]
}) => {
  const { dbUser, subscription } = useAuth();
  const [currentPage, setCurrentPage] = useState(0);

  // If free user and page > 1, show locked paywall!
  const isLocked = subscription?.tier !== 'pro' && currentPage >= 2;

  const handleNext = () => {
    if (currentPage < sampleContent.length - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Generate dynamic watermark string
  const watermarkText = dbUser ? `${dbUser.email} | IP: 192.168.1.42 | ${new Date().toLocaleDateString()}` : 'SECURE SESSION | BLACK CYPHER';

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-surface-950 border border-white/[0.08] rounded-xl overflow-hidden shadow-elevated">
      {/* Top Controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface-900 border-b border-white/[0.06] select-none">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent-cyan" />
          <span className="text-body-sm font-semibold text-white truncate max-w-xs md:max-w-md">
            {title} <span className="text-xs text-slate-500 font-normal">by {author}</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className="p-1 rounded bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] text-slate-400 hover:text-white disabled:opacity-40 disabled:hover:bg-white/[0.04]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-caption text-slate-400">
            Page {currentPage + 1} / {sampleContent.length}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === sampleContent.length - 1}
            className="p-1 rounded bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] text-slate-400 hover:text-white disabled:opacity-40 disabled:hover:bg-white/[0.04]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative p-6 md:p-10 min-h-[400px] flex items-center justify-center bg-surface-900/60 font-mono text-body-sm leading-relaxed text-slate-300 overflow-hidden">
        
        {/* Dynamic Watermark Background Grid */}
        <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-3 gap-6 p-4 rotate-12 opacity-[0.04] pointer-events-none select-none select-none">
          {Array.from({ length: 12 }).map((_, idx) => (
            <div key={idx} className="text-center text-[10px] text-accent-cyan tracking-wider font-bold whitespace-nowrap">
              {watermarkText}
            </div>
          ))}
        </div>

        {/* Dynamic Overlay Watermark at Cursor Location/Random */}
        <div className="absolute top-1/3 left-1/4 -rotate-12 text-[15px] font-bold text-accent-cyan opacity-[0.025] tracking-widest pointer-events-none select-none select-none">
          {watermarkText}
        </div>
        <div className="absolute bottom-1/3 right-1/4 -rotate-12 text-[15px] font-bold text-accent-cyan opacity-[0.025] tracking-widest pointer-events-none select-none select-none">
          {watermarkText}
        </div>

        {/* Document Body */}
        <div className={`w-full max-w-2xl bg-surface-950/80 border border-white/[0.04] p-6 rounded-lg whitespace-pre-wrap select-none ${isLocked ? 'blur-sm pointer-events-none' : ''}`}>
          {sampleContent[currentPage]}
        </div>

        {/* Secure Locked Paywall */}
        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-950/95 backdrop-blur px-6 py-8 text-center select-none z-10 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-accent-violet/10 border border-accent-violet/30 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-accent-violet animate-pulse" />
            </div>
            <h4 className="font-heading text-heading-sm font-bold text-white uppercase tracking-widest">
              Operator Clearance Required
            </h4>
            <p className="text-body-sm text-slate-400 max-w-md mt-2 mb-6">
              You have hit the limit for the free subscriber tier. Purchase the **Operator (Pro) subscription** to read the full books, view interactive roadmap, courses, and join live doubt clearing sessions.
            </p>
            <a href="/subscription">
              <button className="bg-accent-violet hover:bg-violet-600 text-white font-semibold px-6 py-3 rounded-lg shadow-glow-violet hover:scale-105 transition-all text-body-sm flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Upgrade to Pro Plan
              </button>
            </a>
          </div>
        )}
      </div>

      {/* Footer warning bar */}
      <div className="flex justify-between items-center px-4 py-2.5 bg-surface-950 border-t border-white/[0.06] text-[10px] text-slate-500 select-none">
        <div className="flex items-center gap-1.5 text-red-500/80 font-bold uppercase tracking-wider">
          <AlertTriangle className="w-3.5 h-3.5" /> Strictly Confidential
        </div>
        <div>
          ID: {dbUser?.id || 'ANONYMOUS'}
        </div>
      </div>
    </div>
  );
};
