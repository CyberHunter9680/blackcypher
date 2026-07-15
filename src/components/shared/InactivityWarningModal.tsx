import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ShieldAlert, RefreshCw } from 'lucide-react';

interface InactivityWarningModalProps {
  isVisible: boolean;
  onStayLoggedIn: () => void;
  onLogoutNow: () => void;
}

export const InactivityWarningModal: React.FC<InactivityWarningModalProps> = ({
  isVisible,
  onStayLoggedIn,
  onLogoutNow,
}) => {
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (!isVisible) {
      setCountdown(60);
      return;
    }

    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible]);

  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (countdown / 60) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-sm bg-gradient-to-b from-[#0c0f1e] to-[#080b17] border border-orange-500/30 rounded-2xl p-7 shadow-[0_0_60px_rgba(249,115,22,0.15)] z-10 overflow-hidden"
          >
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/80 to-transparent" />

            {/* Ambient glow */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Icon + timer ring */}
            <div className="flex flex-col items-center mb-5">
              <div className="relative w-20 h-20 flex items-center justify-center mb-3">
                {/* SVG countdown ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 64 64">
                  <circle
                    cx="32" cy="32" r={radius}
                    fill="none"
                    stroke="rgba(249,115,22,0.15)"
                    strokeWidth="4"
                  />
                  <circle
                    cx="32" cy="32" r={radius}
                    fill="none"
                    stroke={countdown <= 10 ? '#ef4444' : '#f97316'}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className={`flex flex-col items-center ${countdown <= 10 ? 'text-red-400' : 'text-orange-400'}`}>
                  <span className="text-2xl font-bold font-mono leading-none">{countdown}</span>
                  <span className="text-[8px] uppercase tracking-wider opacity-70">sec</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <ShieldAlert className="w-4 h-4 text-orange-400" />
                <h3 className="font-heading text-lg font-bold text-white">Session Expiring</h3>
              </div>
              <p className="text-center text-sm text-slate-400 leading-relaxed">
                You've been inactive for <span className="text-white font-semibold">20 minutes</span>.<br />
                You will be automatically logged out.
              </p>
            </div>

            {/* Inactivity bar */}
            <div className="mb-5 bg-surface-900 border border-white/[0.06] rounded-lg p-3 flex items-center gap-3">
              <Clock className="w-4 h-4 text-orange-400 shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>Auto-logout in</span>
                  <span className={countdown <= 10 ? 'text-red-400 font-bold' : 'text-orange-400'}>{countdown}s</span>
                </div>
                <div className="w-full h-1.5 bg-surface-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${countdown <= 10 ? 'bg-red-500' : 'bg-orange-500'}`}
                    style={{ width: `${(countdown / 60) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onLogoutNow}
                className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-slate-400 text-sm font-medium hover:text-white hover:border-white/20 transition-all"
              >
                Logout Now
              </button>
              <button
                onClick={onStayLoggedIn}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black text-sm font-bold transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Stay Logged In
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
