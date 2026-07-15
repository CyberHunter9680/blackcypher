import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Send, CheckCircle2, AlertTriangle, Clock, ChevronDown, ChevronUp, Award } from 'lucide-react';
import { Card, Button, Badge } from '../ui';
import { useAuth } from '../../hooks/useAuth';

interface Task {
  id: number;
  title: string;
  description: string;
  xp_reward: number;
  due_date: string;
}

interface Submission {
  task_id: number;
  submission_content: string;
  status: 'submitted' | 'approved' | 'rejected';
  feedback: string | null;
}

export function TaskList() {
  const { dbUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [submissions, setSubmissions] = useState<Record<number, Submission>>({});
  const [loading, setLoading] = useState(true);
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
  const [solutions, setSolutions] = useState<Record<number, string>>({});
  const [submitLoading, setSubmitLoading] = useState<number | null>(null);
  const [error, setError] = useState('');

  const fetchTasksData = async () => {
    if (!dbUser) return;
    try {
      const res = await fetch(`/api/tasks?uid=${dbUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks);
        
        // Convert submissions array to a keyed object
        const subsMap: Record<number, Submission> = {};
        data.submissions.forEach((s: Submission) => {
          subsMap[s.task_id] = s;
        });
        setSubmissions(subsMap);
      }
    } catch (err) {
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksData();
  }, [dbUser]);

  const handleSubmit = async (taskId: number) => {
    const solution = solutions[taskId] || '';
    if (!solution.trim() || !dbUser) return;
    setSubmitLoading(taskId);
    setError('');
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: dbUser.id,
          task_id: taskId,
          submission_content: solution
        })
      });

      if (res.ok) {
        const data = await res.json();
        // Update local submissions map
        setSubmissions(prev => ({
          ...prev,
          [taskId]: data.submission
        }));
        setSolutions(prev => ({ ...prev, [taskId]: '' }));
        setExpandedTaskId(null);
      } else {
        throw new Error('Failed to post solution.');
      }
    } catch (err: any) {
      setError(err.message || 'Transmission failed.');
    } finally {
      setSubmitLoading(null);
    }
  };

  if (loading) {
    return (
      <Card variant="glass" className="p-5 font-mono text-caption text-slate-500 animate-pulse text-center">
        ⚡ ESTABLISHING SECURE CONNECTION TO TASK BOARD...
      </Card>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card variant="glass" className="p-5 text-center text-slate-500 select-none">
        <Terminal className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-body-sm font-semibold uppercase tracking-wider">No Tasks Assigned</p>
        <p className="text-[10px] text-slate-600 mt-1">Excellent job! All clearance protocols are currently cleared.</p>
      </Card>
    );
  }

  return (
    <Card variant="glass" className="p-5">
      <div className="flex items-center gap-2 mb-4 select-none">
        <Terminal className="w-4 h-4 text-accent-cyan" />
        <h3 className="text-body-sm font-semibold text-white uppercase tracking-wider">Hacking Mission Board</h3>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-3 font-mono">
        {tasks.map((task) => {
          const isExpanded = expandedTaskId === task.id;
          const sub = submissions[task.id];
          const status = sub?.status || 'unsubmitted';

          return (
            <div
              key={task.id}
              className={`rounded-xl border transition-all ${
                isExpanded 
                  ? 'bg-surface-950/40 border-accent-cyan shadow-glow-cyan/5' 
                  : 'bg-surface-900/40 border-white/[0.04] hover:border-white/[0.08]'
              }`}
            >
              {/* Header Header */}
              <div
                onClick={() => {
                  setExpandedTaskId(isExpanded ? null : task.id);
                  if (!isExpanded && sub?.submission_content) {
                    setSolutions(prev => ({ ...prev, [task.id]: sub.submission_content || '' }));
                  }
                }}
                className="p-4 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-white uppercase tracking-wide truncate">
                      {task.title}
                    </span>
                    <Badge 
                      variant={
                        status === 'approved' 
                          ? 'emerald' 
                          : status === 'submitted' 
                          ? 'cyan' 
                          : 'neutral'
                      }
                      className="text-[9px] uppercase font-semibold py-0.5"
                    >
                      {status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-slate-500 mt-1">
                    <span className="flex items-center gap-1 font-bold text-accent-violet">
                      <Award className="w-3 h-3" /> {task.xp_reward} XP
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Due: {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </div>

              {/* Collapsible Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-white/[0.04]"
                  >
                    <div className="p-4 space-y-4 text-caption">
                      <p className="text-slate-400 leading-relaxed font-sans text-body-sm bg-surface-950/80 p-3 rounded-lg border border-white/[0.04]">
                        {task.description}
                      </p>

                      {/* Feedback display */}
                      {sub?.feedback && (
                        <div className="p-3 bg-accent-violet/10 border border-accent-violet/30 rounded-lg text-slate-300">
                          <span className="font-bold text-accent-violet block uppercase tracking-wider mb-1 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> Instructor Directive
                          </span>
                          <p className="font-sans text-[11px] leading-relaxed">{sub.feedback}</p>
                        </div>
                      )}

                      {/* Solution Submit Input */}
                      {status !== 'approved' && (
                        <div className="space-y-2">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Upload Submission Code / Git URL / Report Link
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="e.g. https://github.com/operator/ctf-exploit or flag{md5_value}"
                              value={solutions[task.id] || ''}
                              onChange={(e) => setSolutions(prev => ({ ...prev, [task.id]: e.target.value }))}
                              disabled={submitLoading === task.id}
                              className="flex-1 bg-surface-950 border border-white/[0.08] focus:border-accent-cyan rounded-lg px-3 py-2 text-white outline-none transition-all"
                            />
                            <Button
                              variant="primary"
                              glow="cyan"
                              onClick={() => handleSubmit(task.id)}
                              loading={submitLoading === task.id}
                              disabled={!(solutions[task.id] || '').trim()}
                              className="bg-accent-cyan text-black font-semibold uppercase tracking-wider px-4 flex items-center gap-1 shrink-0"
                            >
                              <Send className="w-3.5 h-3.5" /> Submit
                            </Button>
                          </div>
                        </div>
                      )}

                      {status === 'approved' && (
                        <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 shrink-0 text-accent-emerald" />
                          <span>Mission completed. Dynamic reward XP allocated successfully.</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
