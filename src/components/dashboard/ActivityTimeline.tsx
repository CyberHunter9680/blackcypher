import { BookOpen, Award, Flame, Trophy, CheckCircle2, Clock } from 'lucide-react';
import { Card } from '../ui';
import { formatDate } from '../../lib/utils';
import type { ActivityItem } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const iconMap: Record<ActivityItem['type'], React.ElementType> = {
  lesson_completed: CheckCircle2,
  course_completed: BookOpen,
  achievement_earned: Award,
  streak_milestone: Flame,
  certificate_earned: Trophy,
};

const colorMap: Record<ActivityItem['type'], string> = {
  lesson_completed: 'text-accent-cyan',
  course_completed: 'text-accent-emerald',
  achievement_earned: 'text-accent-violet',
  streak_milestone: 'text-orange-400',
  certificate_earned: 'text-accent-cyan',
};

export function ActivityTimeline() {
  const { dbUser } = useAuth();

  // No real activity API yet — show empty state with join date info
  const activities: ActivityItem[] = [];

  return (
    <Card variant="glass" className="p-5">
      <h3 className="text-body-sm font-semibold text-white mb-4">Recent Activity</h3>

      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
          <Clock className="w-8 h-8 text-slate-600" />
          <p className="text-caption text-slate-500 font-mono">No activity yet</p>
          {dbUser?.joined_at && (
            <p className="text-[10px] text-slate-600 font-mono">
              Joined: {formatDate(dbUser.joined_at)}
            </p>
          )}
          <p className="text-[10px] text-slate-600 max-w-[200px]">
            Complete lessons, tasks, and courses to see your activity here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, i) => {
            const Icon = iconMap[activity.type];
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="relative">
                  <Icon className={`w-4 h-4 ${colorMap[activity.type]} mt-0.5`} />
                  {i < activities.length - 1 && (
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 w-px h-6 bg-white/[0.06]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-body-sm font-medium text-white">{activity.title}</div>
                  <div className="text-caption text-slate-500">{activity.description}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-caption text-accent-cyan">+{activity.xp} XP</div>
                  <div className="text-caption text-slate-600">{formatDate(activity.timestamp)}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
