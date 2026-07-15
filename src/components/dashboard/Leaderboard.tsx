import { useState, useEffect } from 'react';
import { Card, Avatar } from '../ui';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';
import { Trophy } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  name: string;
  xp: number;
  level: number;
  avatar?: string | null;
}

export function Leaderboard() {
  const { dbUser } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('/api/content?action=leaderboard');
        if (res.ok) {
          const data = await res.json();
          setEntries(data.slice(0, 10));
        }
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <Card variant="glass" className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-accent-violet" />
          <h3 className="text-body-sm font-semibold text-white">Leaderboard</h3>
        </div>
        <span className="text-caption text-accent-cyan">Top 10</span>
      </div>

      {loading && (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-10 bg-white/[0.03] rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {!loading && entries.length === 0 && (
        <div className="text-center py-8">
          <Trophy className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-caption text-slate-500 font-mono">No operators ranked yet</p>
          <p className="text-[10px] text-slate-600 mt-1">Be the first to earn XP!</p>
        </div>
      )}

      {!loading && entries.length > 0 && (
        <div className="space-y-1">
          {entries.map((entry, index) => {
            const rank = index + 1;
            const isCurrentUser = entry.id === dbUser?.id;
            return (
              <div
                key={entry.id}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors',
                  isCurrentUser ? 'bg-accent-cyan/[0.06] border border-accent-cyan/10' : 'hover:bg-white/[0.02]'
                )}
              >
                <span className={cn(
                  'w-6 text-center text-caption font-bold',
                  rank <= 3 ? 'text-accent-cyan' : 'text-slate-500'
                )}>
                  {rank}
                </span>
                <Avatar name={entry.name} size="sm" src={entry.avatar || undefined} />
                <div className="flex-1 min-w-0">
                  <div className="text-body-sm font-medium text-white truncate">
                    {entry.name}
                    {isCurrentUser && <span className="text-accent-cyan ml-1.5">(You)</span>}
                  </div>
                  <div className="text-caption text-slate-500">Level {entry.level}</div>
                </div>
                <div className="text-body-sm font-medium text-slate-300">
                  {entry.xp.toLocaleString()} XP
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
