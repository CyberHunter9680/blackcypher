import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Play, CheckCircle2, Clock, Star, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-1.5 bg-surface-700 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={cn(
          'h-full rounded-full',
          value === 100 ? 'bg-accent-emerald' : 'bg-accent-cyan'
        )}
      />
    </div>
  );
}

// Visual Mapping Helpers for DB Courses
const getCourseColor = (category: string) => {
  const cat = category?.toLowerCase() || '';
  if (cat.includes('offensive')) return 'from-red-500 to-rose-600';
  if (cat.includes('defense') || cat.includes('defensive')) return 'from-violet-500 to-purple-600';
  if (cat.includes('cloud')) return 'from-cyan-500 to-blue-600';
  if (cat.includes('core')) return 'from-emerald-500 to-teal-600';
  return 'from-blue-500 to-indigo-600';
};

const getCourseIcon = (category: string) => {
  const cat = category?.toLowerCase() || '';
  if (cat.includes('offensive')) return '💻';
  if (cat.includes('defense') || cat.includes('defensive')) return '🔐';
  if (cat.includes('cloud')) return '☁️';
  if (cat.includes('core')) return '🛡️';
  return '🔍';
};

const getCourseRating = (id: number) => {
  return (4.5 + ((id * 3) % 5) / 10).toFixed(1);
};

export default function MyCoursesPage() {
  const { dbUser } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dbUser) return;
    const fetchMyCourses = async () => {
      try {
        const res = await fetch(`/api/content?type=my_courses&uid=${dbUser.id}`);
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
        }
      } catch (err) {
        console.error('Error fetching enrolled courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, [dbUser]);

  const enrolledCourses = courses.map(c => ({
    ...c,
    color: getCourseColor(c.category),
    icon: getCourseIcon(c.category),
    rating: getCourseRating(c.id),
    instructor: 'Aryan Mehta',
    instructorTitle: 'Senior Security Analyst'
  }));

  const completed = enrolledCourses.filter(c => c.progress === 100).length;
  const inProgress = enrolledCourses.filter(c => c.progress > 0 && c.progress < 100).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center font-mono select-none">
        <div className="text-center space-y-4">
          <Shield className="w-12 h-12 text-accent-cyan animate-spin mx-auto" />
          <p className="text-body-sm font-bold text-accent-cyan uppercase tracking-widest">
            DECRYPTING PERSONAL TRAINING PROGRESS...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-900 pt-20 pb-16">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold text-white">My Courses</h1>
          <p className="text-slate-400 text-sm mt-1">{enrolledCourses.length} enrolled • {completed} completed • {inProgress} in progress</p>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Enrolled', value: enrolledCourses.length, color: 'text-white', bg: 'bg-surface-800' },
            { label: 'In Progress', value: inProgress, color: 'text-accent-cyan', bg: 'bg-accent-cyan/5 border border-accent-cyan/10' },
            { label: 'Completed', value: completed, color: 'text-accent-emerald', bg: 'bg-accent-emerald/5 border border-accent-emerald/10' },
          ].map(stat => (
            <div key={stat.label} className={`${stat.bg} rounded-xl p-4 text-center`}>
              <p className={`text-2xl font-heading font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-[11px] text-slate-500 font-mono uppercase tracking-wider mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Enrolled courses list */}
        {enrolledCourses.length === 0 ? (
          <div className="text-center py-24 bg-surface-800 border border-white/[0.06] rounded-2xl">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-white font-semibold text-lg mb-2">No Courses Yet</h3>
            <p className="text-slate-400 text-sm mb-6">Start learning by enrolling in a course from the All Courses section.</p>
            <Link to="/dashboard" className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-cyan text-black rounded-xl font-semibold text-sm hover:bg-cyan-300 transition-colors">
              Browse Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {enrolledCourses.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, duration: 0.35 }}
                className="bg-surface-800 border border-white/[0.08] rounded-2xl p-5 hover:border-accent-cyan/20 transition-all group"
              >
                <div className="flex gap-5 items-start">
                  {/* Thumbnail */}
                  <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center shrink-0 text-3xl`}>
                    {course.icon}
                  </div>

                  {/* Main content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Link to={`/course/${course.id}`}>
                            <h3 className="text-[15px] font-semibold text-white group-hover:text-accent-cyan transition-colors truncate">
                              {course.title}
                            </h3>
                          </Link>
                          {course.progress === 100 && (
                            <CheckCircle2 className="w-4 h-4 text-accent-emerald shrink-0" />
                          )}
                        </div>
                        <p className="text-[12px] text-slate-500 mb-2">{course.instructor} • {course.instructorTitle}</p>

                        {/* Module & time info */}
                        <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono mb-3">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {course.completed_modules}/{course.modules_count} modules
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {course.duration || '30h'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            {course.rating}
                          </span>
                        </div>

                        {/* Progress */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 max-w-[280px]">
                            <ProgressBar value={course.progress} />
                          </div>
                          <span className={cn(
                            'text-[11px] font-bold font-mono',
                            course.progress === 100 ? 'text-accent-emerald' : 'text-accent-cyan'
                          )}>
                            {course.progress}%
                          </span>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <Link to={`/course/${course.id}`}>
                          <button className={cn(
                            'flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all',
                            course.progress === 100
                              ? 'bg-accent-emerald/10 border border-accent-emerald/20 text-accent-emerald hover:bg-accent-emerald/20'
                              : 'bg-accent-cyan text-black hover:bg-cyan-300'
                          )}>
                            <Play className="w-3.5 h-3.5" />
                            {course.progress === 0 ? 'Start' : course.progress === 100 ? 'Review' : 'Continue'}
                          </button>
                        </Link>
                        <span className="text-[10px] text-slate-600 font-mono">
                          Last: {new Date(course.last_accessed).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
