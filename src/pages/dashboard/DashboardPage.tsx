import { useState } from 'react';
import { Shield, Terminal } from 'lucide-react';
import { Button, Badge, Avatar } from '../../components/ui';
import { ProfileSettings } from '../../components/dashboard';
import { DashboardNavbar } from '../../components/layout/DashboardNavbar';
import { useAuth } from '../../hooks/useAuth';
import { AuthModal } from '../../components/auth';

// Sub-pages
import AllCoursesPage from './AllCoursesPage';
import MyCoursesPage from './MyCoursesPage';
import LiveSessionsPage from './LiveSessionsPage';
import CommunityPage from './CommunityPage';

type DashTab = 'all-courses' | 'my-courses' | 'live-sessions' | 'community';

export default function DashboardPage() {
  const { dbUser, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<DashTab>('all-courses');
  const [authOpen, setAuthOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center font-mono select-none">
        <div className="text-center space-y-4">
          <Shield className="w-12 h-12 text-accent-cyan animate-spin mx-auto" />
          <p className="text-body-sm font-bold text-accent-cyan uppercase tracking-widest">
            AUTHENTICATING ACCESS CLEARANCE...
          </p>
        </div>
      </div>
    );
  }

  // Not logged in → show clearance lock screen
  if (!dbUser) {
    return (
      <div className="min-h-screen bg-surface-900 flex flex-col items-center justify-center p-6 relative overflow-hidden font-mono select-none">
        {/* Cyberpunk Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-transparent to-transparent pointer-events-none" />

        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-accent-cyan/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-[250px] h-[250px] rounded-full bg-accent-violet/5 blur-3xl pointer-events-none" />

        <div className="relative max-w-md w-full bg-surface-800/90 border border-white/[0.08] rounded-2xl p-8 shadow-elevated text-center">
          <div className="w-16 h-16 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-accent-cyan animate-pulse" />
          </div>

          <span className="text-[10px] text-accent-cyan font-bold tracking-[0.25em] uppercase block mb-2">
            Status: Unauthorized Access
          </span>
          <h2 className="font-heading text-heading-md font-bold text-white mb-3">
            Secure Clearance Required
          </h2>
          <p className="text-body-sm text-slate-400 mb-8 leading-relaxed font-sans">
            To access your courses, live sessions, and community, please initialize your secure terminal session.
          </p>

          <div className="space-y-4">
            <Button
              variant="primary"
              glow="cyan"
              onClick={() => setAuthOpen(true)}
              className="w-full bg-accent-cyan text-black font-semibold uppercase tracking-wider text-caption py-3.5"
            >
              Initialize Connection
            </Button>
            <a href="/" className="text-caption text-slate-500 hover:text-slate-400 underline block transition-colors">
              Return to Public Space
            </a>
          </div>
        </div>

        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-900">
      {/* New Dashboard Navbar */}
      <DashboardNavbar activeTab={activeTab} onTabChange={setActiveTab} onOpenProfile={() => setSettingsOpen(true)} />

      {/* Admin banner */}
      {dbUser.role === 'admin' && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-accent-cyan/10 border-b border-accent-cyan/20 py-2 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="cyan" className="uppercase text-[9px] font-bold">Admin Mode</Badge>
            <span className="text-xs text-slate-400 font-mono">Viewing as administrator</span>
          </div>
          <a href="/admin">
            <Button variant="primary" glow="cyan" className="bg-accent-cyan text-black font-semibold text-caption uppercase py-1.5 gap-1.5 font-mono h-7 px-3">
              <Terminal className="w-3.5 h-3.5" /> Admin Terminal
            </Button>
          </a>
        </div>
      )}

      {/* Page views — push content below navbar (64px) + optional admin banner (36px) */}
      <div className={dbUser.role === 'admin' ? 'pt-[100px]' : 'pt-16'}>
        {activeTab === 'all-courses' && <AllCoursesPage />}
        {activeTab === 'my-courses' && <MyCoursesPage />}
        {activeTab === 'live-sessions' && <LiveSessionsPage />}
        {activeTab === 'community' && <CommunityPage />}
      </div>

      {/* Profile settings modal */}
      <ProfileSettings isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
