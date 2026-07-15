import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, BookOpen } from 'lucide-react';
import { Card, Badge } from '../ui';

interface CourseItem {
  id: number;
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  is_free: boolean;
}

const levelColors = {
  beginner: 'emerald' as const,
  intermediate: 'cyan' as const,
  advanced: 'violet' as const,
};

export function CourseList() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/content?action=courses');
        if (res.ok) {
          const data = await res.json();
          setCourses(data.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <Card variant="glass" className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-accent-cyan" />
          <h3 className="text-body-sm font-semibold text-white">Available Courses</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-14 bg-white/[0.03] rounded-xl animate-pulse" />
          ))}
        </div>
      </Card>
    );
  }

  if (courses.length === 0) {
    return (
      <Card variant="glass" className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-accent-cyan" />
          <h3 className="text-body-sm font-semibold text-white">Available Courses</h3>
        </div>
        <div className="text-center py-8">
          <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-caption text-slate-500 font-mono">No courses available yet</p>
          <p className="text-[10px] text-slate-600 mt-1">Admin will publish courses soon</p>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="glass" className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-accent-cyan" />
          <h3 className="text-body-sm font-semibold text-white">Available Courses</h3>
        </div>
        <span className="text-caption text-slate-500 font-mono">{courses.length} courses</span>
      </div>
      <div className="space-y-3">
        {courses.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
          >
            <Link to={`/course/${course.id}`}>
              <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.03] transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-surface-600 border border-white/[0.06] flex items-center justify-center shrink-0">
                  <span className="text-body-sm font-heading font-bold text-slate-400">
                    {course.title.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-body-sm font-medium text-white truncate group-hover:text-accent-cyan transition-colors">
                    {course.title}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={levelColors[course.level] || 'neutral'}>{course.level}</Badge>
                    {course.is_free && <Badge variant="emerald">Free</Badge>}
                    {course.duration && <span className="text-caption text-slate-500">{course.duration}</span>}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
