import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Lock, CheckCircle2, Play, FileText, FlaskConical, HelpCircle } from 'lucide-react';
import { Progress } from '../ui';
import type { Module, Lesson } from '../../types';
import { cn } from '../../lib/utils';

interface ModuleSidebarProps {
  modules: Module[];
  currentLessonId: string;
  onLessonClick: (lessonId: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const lessonIcons: Record<Lesson['type'], React.ElementType> = {
  video: Play,
  lab: FlaskConical,
  quiz: HelpCircle,
  reading: FileText,
};

export function ModuleSidebar({ modules, currentLessonId, onLessonClick, collapsed, onToggleCollapse }: ModuleSidebarProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['m1']));

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.completed).length, 0
  );

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 0 : 320 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="h-full border-r border-white/[0.06] bg-surface-800/50 overflow-hidden shrink-0"
    >
      <div className="w-80 h-full flex flex-col">
        <div className="p-4 border-b border-white/[0.06]">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-body-sm font-semibold text-white">Course Content</h2>
            <button
              onClick={onToggleCollapse}
              className="text-caption text-slate-500 hover:text-white transition-colors"
            >
              Collapse
            </button>
          </div>
          <Progress value={completedLessons} max={totalLessons} variant="cyan" size="sm" showLabel />
        </div>

        <div className="flex-1 overflow-y-auto">
          {modules.map((module) => {
            const isExpanded = expandedModules.has(module.id);
            const moduleCompleted = module.lessons.filter((l) => l.completed).length;
            const moduleTotal = module.lessons.length;

            return (
              <div key={module.id} className="border-b border-white/[0.04]">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-white/[0.02] transition-colors"
                >
                  <motion.div
                    animate={{ rotate: isExpanded ? 0 : -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </motion.div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="text-body-sm font-medium text-white truncate">
                      {module.order}. {module.title}
                    </div>
                    <div className="text-caption text-slate-500">
                      {moduleCompleted}/{moduleTotal} lessons
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      {module.lessons.map((lesson) => {
                        const Icon = lessonIcons[lesson.type];
                        const isCurrent = lesson.id === currentLessonId;

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => !lesson.locked && onLessonClick(lesson.id)}
                            disabled={lesson.locked}
                            className={cn(
                              'w-full flex items-center gap-3 px-4 py-2.5 pl-12 text-left transition-colors',
                              isCurrent
                                ? 'bg-accent-cyan/[0.06] border-l-2 border-accent-cyan'
                                : 'hover:bg-white/[0.02] border-l-2 border-transparent',
                              lesson.locked && 'opacity-40 cursor-not-allowed'
                            )}
                          >
                            {lesson.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-accent-emerald shrink-0" />
                            ) : lesson.locked ? (
                              <Lock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                            ) : (
                              <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className={cn(
                                'text-caption truncate',
                                isCurrent ? 'text-accent-cyan font-medium' : 'text-slate-300'
                              )}>
                                {lesson.title}
                              </div>
                            </div>
                            <span className="text-caption text-slate-600 shrink-0">{lesson.duration}</span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </motion.aside>
  );
}
