import { useState, useEffect, useRef } from 'react';
import { Bell, X, Megaphone, BookOpen, Zap, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';

interface Notification {
  id: string;
  type: 'course' | 'update' | 'alert';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const typeConfig = {
  course: { icon: BookOpen, color: 'text-accent-cyan', bg: 'bg-accent-cyan/10' },
  update: { icon: Zap, color: 'text-accent-violet', bg: 'bg-accent-violet/10' },
  alert: { icon: Megaphone, color: 'text-orange-400', bg: 'bg-orange-400/10' },
};

export function NotificationBell() {
  const { dbUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    if (!dbUser?.id) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/notifications?uid=${dbUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [dbUser?.id]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = async () => {
    if (!dbUser?.id) return;
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_all_read', uid: dbUser.id })
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error('Error marking all read:', err);
    }
  };

  const markRead = async (id: string) => {
    if (!dbUser?.id) return;
    // Optimistic UI update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_read', uid: dbUser.id, notification_id: id })
      });
    } catch (err) {
      console.error('Error marking read:', err);
    }
  };

  const dismiss = async (id: string) => {
    if (!dbUser?.id) return;
    // Optimistic UI update
    setNotifications(prev => prev.filter(n => n.id !== id));
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'dismiss', uid: dbUser.id, notification_id: id })
      });
    } catch (err) {
      console.error('Error dismissing notification:', err);
    }
  };


  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'relative w-9 h-9 rounded-lg flex items-center justify-center transition-all border',
          open
            ? 'bg-accent-cyan/10 border-accent-cyan/25 text-accent-cyan'
            : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.05]'
        )}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-11 w-[340px] rounded-2xl border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden z-50"
            style={{ background: 'linear-gradient(to bottom, #0c1220, #080e1a)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-accent-cyan" />
                <span className="text-sm font-semibold text-white">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[9px] font-mono bg-accent-cyan/15 text-accent-cyan px-1.5 py-0.5 rounded-full border border-accent-cyan/20">{unreadCount} new</span>
                )}
              </div>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-[10px] font-mono text-accent-cyan/70 hover:text-accent-cyan transition-colors">
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification list */}
            <div className="max-h-[360px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
                  <Bell className="w-8 h-8 text-slate-600" />
                  <p className="text-sm text-slate-500 font-mono">No notifications</p>
                </div>
              ) : (
                notifications.map((notif) => {
                  const { icon: Icon, color, bg } = typeConfig[notif.type];
                  return (
                    <div
                      key={notif.id}
                      onClick={() => markRead(notif.id)}
                      className={cn(
                        'flex items-start gap-3 px-4 py-3.5 border-b border-white/[0.04] cursor-pointer transition-colors',
                        notif.read ? 'opacity-60 hover:opacity-80' : 'hover:bg-white/[0.03]'
                      )}
                    >
                      <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0 mt-0.5`}>
                        <Icon className={`w-4 h-4 ${color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-white leading-tight">{notif.title}</p>
                          {!notif.read && <span className="w-2 h-2 rounded-full bg-accent-cyan shrink-0 mt-1" />}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">{notif.message}</p>
                        <p className="text-[10px] text-slate-600 font-mono mt-1">{notif.time}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); dismiss(notif.id); }}
                        className="text-slate-600 hover:text-slate-400 transition-colors p-0.5 shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-white/[0.06]">
              <button className="w-full flex items-center justify-center gap-1.5 text-[11px] font-mono text-accent-cyan/70 hover:text-accent-cyan transition-colors">
                View all notifications <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
