import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

interface AntiPiracyContainerProps {
  children: React.ReactNode;
  active?: boolean;
}

export const AntiPiracyContainer: React.FC<AntiPiracyContainerProps> = ({ 
  children, 
  active = true 
}) => {
  const [showWarning, setShowWarning] = useState(false);
  const [warningType, setWarningType] = useState('');

  useEffect(() => {
    if (!active) return;

    // 1. Disable Right Click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerWarning('RIGHT_CLICK_DISABLED');
    };

    // 2. Disable Selection & Copy
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerWarning('COPY_RESTRICTED');
    };

    const handleSelectStart = (e: Event) => {
      e.preventDefault();
    };

    // 3. Disable Print / Printscreen
    const handleBeforePrint = (e: Event) => {
      e.preventDefault();
      triggerWarning('PRINT_BLOCKED');
    };

    // 4. Disable hotkeys
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S, Ctrl+P, Ctrl+U, Ctrl+C, Ctrl+Shift+I, F12
      const isCtrl = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      if (
        (isCtrl && key === 's') || // Save
        (isCtrl && key === 'p') || // Print
        (isCtrl && key === 'u') || // Source
        (isCtrl && key === 'c') || // Copy
        e.key === 'F12' || // DevTools
        (isCtrl && e.shiftKey && key === 'i') || // Inspect
        (isCtrl && e.shiftKey && key === 'j') || // Console
        (isCtrl && e.shiftKey && key === 'c')    // Inspect Element selection
      ) {
        e.preventDefault();
        e.stopPropagation();
        triggerWarning('KEYBOARD_SHORTCUT_BLOCKED');
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('selectstart', handleSelectStart);
    window.addEventListener('beforeprint', handleBeforePrint);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('selectstart', handleSelectStart);
      window.removeEventListener('beforeprint', handleBeforePrint);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [active]);

  const triggerWarning = (type: string) => {
    setWarningType(type);
    setShowWarning(true);
    // Auto hide warning after 2.5s
    const timer = setTimeout(() => setShowWarning(false), 2500);
    return () => clearTimeout(timer);
  };

  return (
    <div className="relative min-h-full select-none">
      {children}

      {/* Warning Overlay banner */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-3 bg-red-950/90 border border-red-500/50 backdrop-blur px-6 py-4 rounded-xl shadow-glow-violet max-w-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" />
            </div>
            <div>
              <h4 className="text-body-sm font-heading font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> SECURITY RESTRICTION
              </h4>
              <p className="text-[11px] text-red-200 mt-0.5">
                {warningType === 'RIGHT_CLICK_DISABLED' && 'Right-click menu is locked for safety.'}
                {warningType === 'COPY_RESTRICTED' && 'Intellectual property copying is locked.'}
                {warningType === 'PRINT_BLOCKED' && 'Printing is disabled on this terminal.'}
                {warningType === 'KEYBOARD_SHORTCUT_BLOCKED' && 'Developer bypass keys are blocked.'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
