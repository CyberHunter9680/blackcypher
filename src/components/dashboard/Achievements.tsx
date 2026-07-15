import { motion } from 'framer-motion';
import { Target, Lock, Trophy } from 'lucide-react';
import { Card } from '../ui';
import { cn } from '../../lib/utils';

// Achievements will unlock as user progresses — shown empty by default
const achievementDefs = [
  { id: 'first_login', title: 'First Login', icon: Target, xp: 50, earned: false },
  { id: 'first_course', title: 'First Course', icon: Trophy, xp: 200, earned: false },
  { id: 'streak_7', title: '7-Day Streak', icon: Target, xp: 300, earned: false },
  { id: 'pro_upgrade', title: 'Pro Operator', icon: Trophy, xp: 500, earned: false },
];

export function Achievements() {
  const earned = achievementDefs.filter(a => a.earned).length;

  return (
    <Card variant="glass" className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-body-sm font-semibold text-white">Achievements</h3>
        <span className="text-caption text-slate-500">{earned}/{achievementDefs.length}</span>
      </div>

      {earned === 0 && (
        <p className="text-caption text-slate-600 mb-3 font-mono">
          Complete missions to unlock achievements.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        {achievementDefs.map((achievement, i) => {
          const Icon = achievement.icon;
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className={cn(
                'p-3 rounded-xl border transition-all',
                achievement.earned
                  ? 'bg-surface-700/50 border-white/[0.08]'
                  : 'bg-surface-800/30 border-white/[0.04] opacity-50'
              )}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center',
                  achievement.earned ? 'bg-accent-cyan/10 border border-accent-cyan/20' : 'bg-surface-600 border border-white/[0.06]'
                )}>
                  {achievement.earned ? (
                    <Icon className="w-4 h-4 text-accent-cyan" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-600" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-caption font-medium text-white truncate">{achievement.title}</div>
                  <div className="text-caption text-slate-500">+{achievement.xp} XP</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
