import { useState, useEffect } from 'react';
import { Video, Calendar, ShieldCheck, Lock, Clock } from 'lucide-react';
import { Card, Button } from '../ui';
import { useAuth } from '../../hooks/useAuth';

interface Meeting {
  id: number;
  title: string;
  meet_url: string;
  date_time: string;
}



export function DoubtMeetings() {
  const { subscription } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const isPro = subscription?.tier === 'pro';

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await fetch('/api/meetings');
        if (res.ok) {
          const data = await res.json();
          setMeetings(data);
        }
      } catch (err) {
        console.error('Failed to load meetings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();

    // Update time every minute (countdown shows minutes, not seconds)
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Helper to format remaining time or check if live
  const getMeetingStatus = (dateTimeStr: string) => {
    const meetTime = new Date(dateTimeStr);
    const diffMs = meetTime.getTime() - currentTime.getTime();
    
    // meeting lasts for 2 hours (7200000 ms)
    const durationMs = 2 * 60 * 60 * 1000; 
    
    if (diffMs <= 0 && Math.abs(diffMs) < durationMs) {
      return { isLive: true, text: 'LIVE NOW' };
    } else if (diffMs > 0) {
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      let timeString = '';
      if (diffHrs > 24) {
        timeString = `${Math.floor(diffHrs / 24)}d remaining`;
      } else if (diffHrs > 0) {
        timeString = `Starts in ${diffHrs}h ${diffMins}m`;
      } else {
        timeString = `Starts in ${diffMins}m`;
      }
      return { isLive: false, text: timeString };
    } else {
      return { isLive: false, text: 'Concluded' };
    }
  };

  if (loading) {
    return (
      <Card variant="glass" className="p-5 font-mono text-[11px] text-slate-500 animate-pulse text-center">
        ⚡ FETCHING LIVE MEET LINK STATUS...
      </Card>
    );
  }

  return (
    <Card variant="glass" className="p-5 relative overflow-hidden">
      <div className="flex items-center gap-3 mb-4 select-none">
        <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
          <Video className="w-5 h-5 text-accent-cyan" />
        </div>
        <div>
          <h3 className="text-body-sm font-semibold text-white uppercase tracking-wider">Live Classes & Doubt Meets</h3>
          <p className="text-caption text-slate-500">Live Mentor Schedules</p>
        </div>
      </div>

      {!isPro ? (
        <div className="space-y-4 pt-2 select-none">
          <div className="p-3 bg-red-950/40 border border-red-500/20 rounded-lg text-caption text-red-300 flex items-start gap-2.5">
            <Lock className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span>
              <strong>CLEARANCE LEVEL INSUFFICIENT</strong><br/>
              Live Saturday & Sunday doubt clearing sessions are reserved exclusively for Pro Operators. Upgrade to participate in weekend Q&A video sessions.
            </span>
          </div>
          <a href="/subscription">
            <Button variant="primary" glow="violet" className="w-full bg-accent-violet text-white font-semibold text-caption py-2 uppercase tracking-wider">
              Upgrade to Pro Plan
            </Button>
          </a>
        </div>
      ) : (
        <div className="space-y-3 font-mono">
          {meetings.length === 0 ? (
            <p className="text-[10px] text-slate-500 text-center py-4">No live sessions scheduled currently.</p>
          ) : (
            meetings.map((m) => {
              const date = new Date(m.date_time);
              const formattedDate = date.toLocaleDateString('en-IN', { weekday: 'long', hour: '2-digit', minute: '2-digit' });
              const status = getMeetingStatus(m.date_time);
              
              return (
                <div 
                  key={m.id} 
                  className={`p-3 bg-surface-900 border rounded-lg space-y-3 transition-all duration-300 ${
                    status.isLive 
                      ? 'border-accent-emerald bg-emerald-500/[0.02] shadow-[0_0_15px_rgba(16,185,129,0.05)] animate-pulse' 
                      : 'border-white/[0.04]'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="text-[11px] font-bold text-white uppercase tracking-wide leading-tight">{m.title}</h4>
                      <span className="text-[10px] text-accent-cyan flex items-center gap-1 mt-1.5">
                        <Calendar className="w-3.5 h-3.5" /> {formattedDate}
                      </span>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      {status.isLive ? (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[8px] text-accent-emerald font-bold uppercase animate-pulse select-none">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Live Now
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-[8px] text-slate-400 font-bold uppercase select-none">
                          <Clock className="w-2.5 h-2.5" /> {status.text}
                        </span>
                      )}
                    </div>
                  </div>

                  <a href={m.meet_url} target="_blank" rel="noopener noreferrer">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`w-full gap-1.5 font-bold uppercase tracking-wider text-[10px] ${
                        status.isLive 
                          ? 'border-accent-emerald hover:bg-emerald-500/10 text-accent-emerald hover:text-white' 
                          : 'border-white/[0.08]'
                      }`}
                    >
                      <ShieldCheck className={`w-3.5 h-3.5 ${status.isLive ? 'text-accent-emerald animate-bounce' : 'text-slate-500'}`} /> 
                      {status.isLive ? 'JOIN LIVE CLASS NOW' : 'LAUNCH MEETING LINK'}
                    </Button>
                  </a>
                </div>
              );
            })
          )}
        </div>
      )}
    </Card>
  );
}

