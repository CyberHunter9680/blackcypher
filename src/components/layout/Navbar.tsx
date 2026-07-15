import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu, X, LogOut, Terminal, LayoutDashboard } from 'lucide-react';
import { Button } from '../ui';
import { cn } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';
import { AuthModal } from '../auth';
import { NotificationBell } from './NotificationBell';

const navLinks = [
  { label: 'Courses', path: '/dashboard' },
  { label: 'Pricing', path: '/subscription' },
  { label: 'Certificate', path: '/certificate' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const location = useLocation();
  const { dbUser, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // Dynamically compute navigation links
  const activeLinks = [...navLinks];
  if (dbUser && dbUser.role === 'admin') {
    activeLinks.push({ label: 'Admin Terminal', path: '/admin' });
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-surface-900/80 backdrop-blur-xl border-b border-white/[0.06]'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center group-hover:bg-accent-cyan/20 transition-colors">
              <Shield className="w-4 h-4 text-accent-cyan" />
            </div>
            <span className="font-heading font-semibold text-lg text-white">
              Black<span className="text-accent-cyan">Cypher</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {activeLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-4 py-2 rounded-lg text-body-sm font-medium transition-all duration-200 flex items-center gap-1.5',
                  location.pathname === link.path
                    ? 'text-white bg-white/[0.06]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                )}
              >
                {link.label === 'Admin Terminal' && <Terminal className="w-3.5 h-3.5 text-accent-cyan" />}
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {dbUser ? (
              <>
                <NotificationBell />
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1.5">
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => logout()} className="text-slate-400 hover:text-red-400 flex items-center gap-1.5">
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => setAuthOpen(true)}>Sign In</Button>
                <Button variant="primary" size="sm" glow="cyan" onClick={() => setAuthOpen(true)}>Get Started</Button>
              </>
            )}
          </div>

          <button
            className="md:hidden text-slate-300 hover:text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-16 z-40 md:hidden bg-surface-900/95 backdrop-blur-xl border-b border-white/[0.06] p-4"
          >
            <div className="flex flex-col gap-1">
              {activeLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'px-4 py-3 rounded-lg text-body-sm font-medium transition-all flex items-center gap-1.5',
                    location.pathname === link.path
                      ? 'text-white bg-white/[0.06]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  )}
                >
                  {link.label === 'Admin Terminal' && <Terminal className="w-3.5 h-3.5 text-accent-cyan" />}
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-white/[0.06] mt-2 pt-3 flex flex-col gap-2">
                {dbUser ? (
                  <>
                    <Link to="/dashboard" className="w-full">
                      <Button variant="ghost" size="sm" className="w-full flex items-center justify-center gap-1.5">
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => logout()} className="w-full text-slate-400 hover:text-red-400 flex items-center justify-center gap-1.5">
                      <LogOut className="w-3.5 h-3.5" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => setAuthOpen(true)} className="w-full">Sign In</Button>
                    <Button variant="primary" size="sm" glow="cyan" onClick={() => setAuthOpen(true)} className="w-full">Get Started</Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
