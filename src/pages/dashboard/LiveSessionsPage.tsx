import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, Calendar, ChevronLeft, ChevronRight, RotateCcw, Lock, ExternalLink, Zap, Shield } from 'lucide-react';
import { type LiveSession } from '../../data/coursesData';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';
import { CheckoutModal } from '../../components/subscription';

const doubtExtensions = [
  {
    id: 'm-1',
    name: '1-Month Crisis Clearance',
    price: 1999,
    duration: '1 month',
    desc: 'Perfect for urgent debugging. 4 weekends (8 sessions) of dedicated 1-on-1 expert troubleshooting.',
    popular: false,
    badge: 'Crisis Support'
  },
  {
    id: 'm-2',
    name: '2-Month Operations Extension',
    price: 3499,
    duration: '2 months',
    desc: 'Our recommended baseline. 8 weekends (16 sessions) of comprehensive exploit analysis and sandbox debugging support.',
    popular: true,
    badge: 'Most Popular'
  },
  {
    id: 'm-3',
    name: '3-Month Strategic Retainer',
    price: 4999,
    duration: '3 months',
    desc: 'Unrestricted cyber backup. 12 weekends (24 sessions) of continuous advanced roadmap mentorship and live guidance.',
    popular: false,
    badge: 'Maximum Value'
  }
];

type SessionTab = 'upcoming' | 'completed';

function formatTime(time: string) {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Group sessions by date
function groupByDate(sessions: any[]) {
  const groups: Record<string, any[]> = {};
  sessions.forEach(s => {
    if (!groups[s.date]) groups[s.date] = [];
    groups[s.date].push(s);
  });
  return groups;
}

// ── Pro Lock Screen ──────────────────────────────────────────────────────────
interface ProLockScreenProps {
  onSelectPlan: (name: string, price: number, interval: string) => void;
}

function ProLockScreen({ onSelectPlan }: ProLockScreenProps) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-4xl mx-auto px-6"
      >
        {/* Lock icon */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="w-20 h-20 rounded-full bg-accent-violet/10 border-2 border-accent-violet/30 flex items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.2)]">
            <Lock className="w-8 h-8 text-accent-violet" />
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-accent-violet/10 animate-ping opacity-30" />
        </div>

        <h2 className="font-heading text-2xl font-bold text-white mb-2">
          Pro Doubt Support Required
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-10 max-w-lg mx-auto">
          Live doubt-clearing sessions (Saturday & Sunday) are exclusively available for Pro operators. Purchase a doubt support renewals/extensions package below to unlock direct live access.
        </p>

        {/* Extensions Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
          {doubtExtensions.map((tier) => (
            <div 
              key={tier.id}
              className={cn(
                "p-6 rounded-2xl flex flex-col justify-between h-full border backdrop-blur-sm transition-all duration-300 bg-[#0c0822]/65",
                tier.popular 
                  ? "border-accent-violet/35 shadow-[0_0_25px_rgba(139,92,246,0.08)] bg-[#0f0a2d]/70"
                  : "border-white/[0.06] hover:border-white/[0.12]"
              )}
            >
              <div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider">Support Extension</span>
                  {tier.popular && <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold bg-accent-violet/15 text-accent-violet border border-accent-violet/25 uppercase tracking-wider">Best Value</span>}
                </div>
                <h4 className="font-heading text-xs font-bold text-white mt-3 leading-snug">{tier.name}</h4>
                <p className="text-[11px] text-slate-400 mt-2 min-h-[50px] leading-relaxed">{tier.desc}</p>
                
                <div className="my-6 flex items-baseline gap-0.5">
                  <span className="font-sans text-lg font-medium text-white mr-0.5 select-none">₹</span>
                  <span className="text-2xl font-black text-white">{tier.price.toLocaleString()}</span>
                  <span className="text-[9px] font-mono font-semibold text-slate-500 uppercase">/ {tier.duration}</span>
                </div>
              </div>

              <button 
                onClick={() => onSelectPlan(tier.name, tier.price, tier.duration)}
                className={cn(
                  "w-full font-mono text-[9px] uppercase py-2 font-bold tracking-wider rounded-xl transition-all border",
                  tier.popular
                    ? "bg-accent-violet border-accent-violet text-white hover:bg-violet-500"
                    : "bg-transparent border-white/20 text-slate-300 hover:border-white/40 hover:bg-white/5"
                )}
              >
                Initialize Extension
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ── Live Sessions Page ───────────────────────────────────────────────────────
export default function LiveSessionsPage() {
  const { subscription } = useAuth();
  const isPro = subscription?.tier === 'pro';

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({ name: '', price: 0, interval: '' });

  const handleSelectPlan = (name: string, price: number, interval: string) => {
    setSelectedPlan({ name, price, interval });
    setCheckoutOpen(true);
  };

  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SessionTab>('upcoming');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch('/api/meetings');
        if (res.ok) {
          const data = await res.json();
          setSessions(data);
        }
      } catch (err) {
        console.error('Error fetching sessions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  const mappedSessions = sessions.map(m => {
    const start = new Date(m.date_time);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    
    const formatDateString = (d: Date) => {
      return d.toISOString().split('T')[0];
    };
    
    const formatTimeString = (d: Date) => {
      return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    };

    const isCompleted = start.getTime() < Date.now();

    return {
      id: String(m.id),
      title: m.title,
      meet_url: m.meet_url,
      date: formatDateString(start),
      start_time: formatTimeString(start),
      end_time: formatTimeString(end),
      is_completed: isCompleted,
      type: m.meet_url.includes('zoom') ? 'Zoom Webinar' : 'Google Meet',
      instructor: 'Aryan Mehta',
      is_free: true
    };
  });

  // Filter sessions
  const filtered = mappedSessions.filter(s => {
    const isCompleted = s.is_completed;
    if (activeTab === 'upcoming' && isCompleted) return false;
    if (activeTab === 'completed' && !isCompleted) return false;
    if (startDate && s.date < startDate) return false;
    if (endDate && s.date > endDate) return false;
    return true;
  });

  const grouped = groupByDate(filtered);
  const sortedDates = Object.keys(grouped).sort((a, b) => 
    activeTab === 'upcoming' ? a.localeCompare(b) : b.localeCompare(a)
  );

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center font-mono select-none">
        <div className="text-center space-y-4">
          <Shield className="w-12 h-12 text-accent-cyan animate-spin mx-auto" />
          <p className="text-body-sm font-bold text-accent-cyan uppercase tracking-widest">
            SYNCHRONIZING LIVE MEETING FEED...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-900 pt-20 pb-16">
      <div className="max-w-[900px] mx-auto px-6">

        {/* Page header */}
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold text-white">Live Sessions</h1>
        </div>

        {/* Main card */}
        <div className="bg-surface-800 border border-white/[0.08] rounded-2xl overflow-hidden">
          
          {/* Tabs - Only show if user is Pro */}
          {isPro && (
            <div className="flex border-b border-white/[0.06]">
              {(['upcoming', 'completed'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setPage(1); }}
                  className={cn(
                    'relative px-6 py-4 text-sm font-medium transition-colors capitalize',
                    activeTab === tab ? 'text-accent-cyan' : 'text-slate-400 hover:text-white'
                  )}
                >
                  {tab === 'upcoming' ? 'Upcoming' : 'Completed'}
                  {activeTab === tab && (
                    <motion.span
                      layoutId="session-tab"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-accent-cyan rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Content */}
          {!isPro ? (
            <ProLockScreen onSelectPlan={handleSelectPlan} />
          ) : (
            <div className="p-6">
              {/* Date filter */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="bg-surface-700 border border-white/[0.08] focus:border-accent-cyan/50 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none transition-all flex-1 max-w-[160px]"
                    placeholder="Start date"
                  />
                  <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="bg-surface-700 border border-white/[0.08] focus:border-accent-cyan/50 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none transition-all flex-1 max-w-[160px]"
                    placeholder="End date"
                  />
                </div>
                <button
                  onClick={resetFilters}
                  className="w-9 h-9 rounded-lg bg-surface-700 border border-white/[0.08] hover:border-white/20 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Sessions list */}
              {sortedDates.length === 0 ? (
                <div className="text-center py-16">
                  <Video className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm font-medium">
                    {activeTab === 'upcoming' ? 'No upcoming sessions scheduled.' : 'No completed sessions found.'}
                  </p>
                  <p className="text-slate-600 text-xs mt-1">Check back later or adjust your date filter.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedDates.map(date => (
                    <div key={date}>
                      {/* Date separator */}
                      <div className="bg-surface-700/50 rounded-lg px-3 py-2 mb-3">
                        <span className="text-[12px] font-semibold text-slate-300 font-mono">{formatDate(date)}</span>
                      </div>

                      {/* Sessions for this date */}
                      {grouped[date].map(session => (
                        <motion.div
                          key={session.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-start gap-5 p-4 rounded-xl hover:bg-surface-700/30 transition-colors group"
                        >
                          {/* Time */}
                          <div className="text-sm font-mono text-slate-300 shrink-0 min-w-[140px]">
                            {formatTime(session.start_time)} – {formatTime(session.end_time)}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-white mb-0.5">{session.title}</h4>
                            <div className="flex items-center gap-3 text-[11px] text-slate-500">
                              <span>({session.type})</span>
                              <span>•</span>
                              <span>{session.instructor}</span>
                              {session.is_free && (
                                <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[9px] font-bold uppercase">FREE</span>
                              )}
                            </div>
                          </div>

                          {/* Join button for upcoming */}
                          {activeTab === 'upcoming' && (
                            <a href={session.meet_url} target="_blank" rel="noopener noreferrer">
                              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-accent-cyan/30 text-accent-cyan text-[11px] font-semibold hover:bg-accent-cyan/10 transition-all shrink-0 opacity-0 group-hover:opacity-100">
                                <ExternalLink className="w-3 h-3" />
                                Join
                              </button>
                            </a>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-white/[0.06] mb-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 rounded-lg border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-slate-400 font-mono px-2">{page}</span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-8 h-8 rounded-lg border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Doubt Support Extensions Renewal Section */}
              <div className="mt-12 border-t border-white/[0.06] pt-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div>
                    <h3 className="font-heading text-base font-bold text-white tracking-wide">Doubt Support Renewals & Extensions</h3>
                    <p className="text-[11px] text-slate-400 mt-1">Need to extend your active weekend Q&A debugging access? Initialize a renewals package below.</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-accent-violet/10 text-accent-violet border border-accent-violet/20 uppercase">Live Extensions Active</span>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {doubtExtensions.map((tier) => (
                    <div 
                      key={tier.id}
                      className="p-5 rounded-xl border border-white/[0.06] hover:border-accent-violet/25 bg-[#070512]/40 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <span className="text-[8px] font-mono text-slate-500 font-bold uppercase tracking-wider">{tier.badge || 'Extension'}</span>
                        </div>
                        <h4 className="font-heading text-xs font-bold text-white mt-2 leading-snug">{tier.name}</h4>
                        
                        <div className="my-4 flex items-baseline gap-0.5">
                          <span className="font-sans text-xs font-medium text-white mr-0.5 select-none">₹</span>
                          <span className="text-lg font-black text-white font-mono">{tier.price.toLocaleString()}</span>
                          <span className="text-[8px] font-mono font-semibold text-slate-500 uppercase">/ {tier.duration}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleSelectPlan(tier.name, tier.price, tier.duration)}
                        className="w-full font-mono text-[9px] uppercase py-2 font-bold tracking-wider rounded-lg border border-accent-violet/25 text-accent-violet hover:bg-accent-violet hover:text-white transition-all"
                      >
                        Initialize Extension
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        planName={selectedPlan.name}
        price={selectedPlan.price}
        interval={selectedPlan.interval}
      />
    </div>
  );
}
