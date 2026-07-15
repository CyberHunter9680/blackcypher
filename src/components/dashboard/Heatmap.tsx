import { Card } from '../ui';
import { cn } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';
import { Activity } from 'lucide-react';
import { useMemo } from 'react';

export function Heatmap() {
  const { dbUser } = useAuth();

  // Generate empty 90-day grid — real activity will show once API is connected
  const heatmapData = useMemo(() => {
    const days: { date: string; count: number }[] = [];
    for (let i = 89; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({ date: d.toISOString().split('T')[0], count: 0 });
    }
    return days;
  }, []);

  const weeks: { date: string; count: number }[][] = [];
  let currentWeek: { date: string; count: number }[] = [];
  heatmapData.forEach((day, i) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || i === heatmapData.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const getColor = (count: number) => {
    if (count === 0) return 'bg-surface-600';
    if (count <= 1) return 'bg-accent-cyan/20';
    if (count <= 2) return 'bg-accent-cyan/40';
    if (count <= 3) return 'bg-accent-cyan/60';
    return 'bg-accent-cyan/80';
  };

  const totalActivity = heatmapData.reduce((sum, d) => sum + d.count, 0);

  return (
    <Card variant="glass" className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-accent-cyan" />
          <h3 className="text-body-sm font-semibold text-white">Learning Activity</h3>
        </div>
        <span className="text-caption text-slate-500">Last 90 days</span>
      </div>

      {totalActivity === 0 && (
        <p className="text-caption text-slate-600 mb-3 font-mono">
          No activity recorded yet — start a course to light up the grid!
        </p>
      )}

      <div className="flex gap-1 overflow-x-auto pb-2">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day) => (
              <div
                key={day.date}
                className={cn('w-3 h-3 rounded-[3px]', getColor(day.count))}
                title={`${day.date}: ${day.count} activities`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3">
        <span className="text-caption text-slate-500">Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div key={level} className={cn('w-3 h-3 rounded-[3px]', getColor(level))} />
        ))}
        <span className="text-caption text-slate-500">More</span>
      </div>
    </Card>
  );
}
