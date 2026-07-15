import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { mockNotifications } from '../../data/coursesData';
import { cn } from '../../lib/utils';

type DashTab = 'all-courses' | 'my-courses' | 'live-sessions' | 'community';

interface DashboardNavbarProps {
  activeTab: DashTab;
  onTabChange: (tab: DashTab) => void;
  onOpenProfile?: () => void;
}

const navTabs: { id: DashTab; label: string; icon: string }[] = [
  { id: 'all-courses', label: 'All Courses', icon: '📚' },
  { id: 'my-courses', label: 'My Courses', icon: '🎯' },
  { id: 'live-sessions', label: 'Live Sessions', icon: '📹' },
  { id: 'community', label: 'Community', icon: '👥' },
];

// ── Notification Dropdown ────────────────────────────────────────────────────
function NotificationDropdown() {
  const { dbUser } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const unreadCount = notifications.filter(n => !n.read).length;

  const fetchNotifications = async () => {
    if (!dbUser || !dbUser.id) return;
    try {
      const res = await fetch(`/api/notifications?uid=${dbUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [dbUser]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = async () => {
    if (!dbUser || !dbUser.id) return;
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_all_read', uid: dbUser.id })
      });
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  const markSingleRead = async (notificationId: string) => {
    if (!dbUser || !dbUser.id) return;
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_read', uid: dbUser.id, notification_id: notificationId })
      });
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  };

  const typeIcon = (type: string) => {
    if (type === 'session') return '📹';
    if (type === 'achievement') return '🏆';
    if (type === 'course') return '📚';
    return '🔔';
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative w-10 h-10 rounded-full bg-surface-800 border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all"
      >
        <Bell className="w-4.5 h-4.5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent-cyan text-black text-[9px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 w-[340px] bg-surface-800 border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <span className="text-sm font-semibold text-white">Notifications</span>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-[11px] text-accent-cyan hover:text-cyan-300 transition-colors">
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications list */}
            <div className="max-h-[380px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-10 text-center text-slate-500 text-sm">No notifications</div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => !n.read && markSingleRead(n.id)}
                    className={cn(
                      'px-4 py-3.5 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors cursor-pointer',
                      !n.read && 'bg-accent-cyan/[0.03]'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl shrink-0 mt-0.5">{typeIcon(n.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[13px] font-semibold text-white leading-tight">{n.title}</p>
                          {!n.read && <span className="w-2 h-2 rounded-full bg-accent-cyan shrink-0 mt-1" />}
                        </div>
                        <p className="text-[12px] text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                        <p className="text-[10px] text-slate-600 mt-1 font-mono">
                          {n.time || (n.created_at ? new Date(n.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Profile Dropdown ─────────────────────────────────────────────────────────
function ProfileDropdown({ onOpenProfile }: { onOpenProfile?: () => void }) {
  const { dbUser, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
  };

  const handleOpenProfile = () => {
    setOpen(false);
    onOpenProfile?.();
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-surface-800 border border-white/[0.08] flex items-center justify-center overflow-hidden hover:border-accent-cyan/40 transition-all"
      >
        {dbUser?.avatar ? (
          <img src={dbUser.avatar} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <User className="w-5 h-5 text-slate-400" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 w-[260px] bg-surface-800 border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            {/* User info */}
            <div className="px-4 py-4 border-b border-white/[0.06] flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-surface-700 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                {dbUser?.avatar ? (
                  <img src={dbUser.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{dbUser?.name || 'Operator'}</p>
                <p className="text-[11px] text-slate-500 truncate">{dbUser?.email || ''}</p>
              </div>
            </div>

            {/* Menu items */}
            <div className="py-2">
              <button
                onClick={handleOpenProfile}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/[0.04] hover:text-white transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-surface-700 flex items-center justify-center">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
                View profile
              </button>
              <button
                onClick={handleOpenProfile}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/[0.04] hover:text-white transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-surface-700 flex items-center justify-center">
                  <Settings className="w-4 h-4 text-slate-400" />
                </div>
                My account
              </button>
              <div className="my-1 border-t border-white/[0.06]" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/[0.08] hover:text-red-300 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                  <LogOut className="w-4 h-4 text-red-400" />
                </div>
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Dashboard Navbar ────────────────────────────────────────────────────
export function DashboardNavbar({ activeTab, onTabChange, onOpenProfile }: DashboardNavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-900/95 backdrop-blur-xl border-b border-white/[0.06] h-16">
      <div className="h-full max-w-[1400px] mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
            <span className="text-accent-cyan text-sm font-bold">BC</span>
          </div>
          <span className="font-heading font-semibold text-lg text-white hidden sm:block">
            Black<span className="text-accent-cyan">Cypher</span>
          </span>
        </Link>

        {/* Center navigation tabs */}
        <nav className="flex items-center gap-1">
          {navTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'relative flex flex-col items-center gap-0.5 px-4 py-2 rounded-lg transition-all text-xs font-medium',
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-slate-500 hover:text-slate-300'
              )}
            >
              <span className="text-base">{tab.icon}</span>
              <span className="hidden sm:block whitespace-nowrap">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute -bottom-[1px] left-2 right-2 h-0.5 bg-accent-cyan rounded-full"
                />
              )}
            </button>
          ))}
        </nav>

        {/* Right — Bell + Profile */}
        <div className="flex items-center gap-2 shrink-0">
          <NotificationDropdown />
          <ProfileDropdown onOpenProfile={onOpenProfile} />
        </div>
      </div>
    </header>
  );
}
