import { motion } from 'framer-motion';
import { Zap, Flame, Trophy, BookOpen } from 'lucide-react';
import { Card, Progress } from '../ui';
import { useAuth } from '../../hooks/useAuth';
import { formatNumber, getXPForLevel } from '../../lib/utils';

export function StatsOverview() {
  const { dbUser } = useAuth();

  const xp = dbUser?.xp ?? 0;
  const level = dbUser?.level ?? 1;
  // streak and rank not in DB yet — show 0 by default
  const streak = 0;
  const coursesCompleted = 0;

  const stats = [
    { icon: Zap, label: 'Total XP', value: formatNumber(xp), color: 'text-accent-cyan' },
    { icon: Flame, label: 'Day Streak', value: `${streak} days`, color: 'text-orange-400' },
    { icon: Trophy, label: 'Level', value: `Lvl ${level}`, color: 'text-accent-violet' },
    { icon: BookOpen, label: 'Courses Done', value: `${coursesCompleted}`, color: 'text-accent-emerald' },
  ];

  const currentLevelXP = getXPForLevel(level);
  const nextLevelXP = getXPForLevel(level + 1);
  const levelProgress = xp > 0 ? Math.min(100, ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100) : 0;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <Card variant="glass" className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-caption text-slate-500">{stat.label}</span>
              </div>
              <div className="font-heading text-heading-lg font-bold text-white">{stat.value}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card variant="glass" className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent-cyan" />
            <span className="text-body-sm font-medium text-white">Level {level}</span>
          </div>
          <span className="text-caption text-slate-500">
            {formatNumber(xp)} / {formatNumber(nextLevelXP)} XP
          </span>
        </div>
        <Progress value={Math.max(0, Math.min(100, levelProgress))} variant="cyan" size="md" />
      </Card>
    </div>
  );
}
