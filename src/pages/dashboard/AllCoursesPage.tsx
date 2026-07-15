import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Lock, Star, Users, Clock, Filter, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

const LEVEL_TABS = ['All', 'Beginner', 'Intermediate', 'Advanced'] as const;
const CATEGORY_TABS = ['All', 'Core', 'Offensive', 'Defensive', 'Cloud', 'Advanced'] as const;

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

const getCourseEnrolled = (id: number) => {
  return (id * 1234 + 1500) % 8000 + 1200;
};

// Course card component
function CourseCard({ course, isPro, index }: { course: any; isPro: boolean; index: number }) {
  const isLocked = !course.is_free && !isPro;
  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className={cn(
        'relative bg-surface-800 border rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 h-full',
        isLocked
          ? 'border-white/[0.06] hover:border-white/[0.1]'
          : 'border-white/[0.08] hover:border-accent-cyan/30 hover:-translate-y-1'
      )}
    >
      {/* Thumbnail */}
      <div className={`relative h-36 bg-gradient-to-br ${course.color} flex items-center justify-center overflow-hidden`}>
        <span className="text-5xl opacity-80 group-hover:scale-110 transition-transform duration-300">{course.icon}</span>

        {/* Free badge */}
        {course.is_free && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-500/90 text-black text-[10px] font-bold uppercase tracking-wider">
            FREE
          </span>
        )}

        {/* Lock icon for paid */}
        {isLocked && (
          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 border border-white/20 backdrop-blur-sm flex items-center justify-center">
            <Lock className="w-3.5 h-3.5 text-white" />
          </div>
        )}

        {/* Level badge */}
        <span className={cn(
          'absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider',
          course.level === 'beginner' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
          course.level === 'intermediate' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
          'bg-violet-500/20 text-violet-300 border border-violet-500/30'
        )}>
          {course.level}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className={cn(
          'text-[13px] font-semibold leading-tight mb-2 line-clamp-2',
          isLocked ? 'text-slate-400' : 'text-white group-hover:text-accent-cyan transition-colors'
        )}>
          {course.title}
        </h3>

        <p className="text-[11px] text-slate-500 line-clamp-2 mb-3 leading-relaxed">
          {course.description}
        </p>

        <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono">
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            {course.rating}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {course.enrolled.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {course.duration}
          </span>
        </div>

        <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between">
          <span className="text-[11px] text-slate-500">{course.instructor}</span>
          {isLocked ? (
            <span className="text-[10px] text-accent-violet font-semibold bg-accent-violet/10 border border-accent-violet/20 px-2 py-0.5 rounded-full">
              PRO
            </span>
          ) : (
            <span className="text-[10px] text-accent-cyan font-semibold">
              +{course.xp} XP
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (isLocked) {
    return <Link to="/subscription" className="block h-full">{cardContent}</Link>;
  }
  return <Link to={`/course/${course.id}`} className="block h-full">{cardContent}</Link>;
}

// ── All Courses Page ─────────────────────────────────────────────────────────
export default function AllCoursesPage() {
  const { subscription } = useAuth();
  const isPro = subscription?.tier === 'pro';

  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<typeof LEVEL_TABS[number]>('All');
  const [categoryFilter, setCategoryFilter] = useState<typeof CATEGORY_TABS[number]>('All');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/content');
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const mappedCourses = courses.map(c => ({
    ...c,
    color: getCourseColor(c.category),
    icon: getCourseIcon(c.category),
    rating: getCourseRating(c.id),
    enrolled: getCourseEnrolled(c.id),
    instructor: 'Aryan Mehta',
    xp: c.xp_reward || 1000
  }));

  // Filter courses
  const filtered = mappedCourses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    const matchLevel = levelFilter === 'All' || c.level === levelFilter.toLowerCase();
    const matchCategory = categoryFilter === 'All' || c.category.toLowerCase().includes(categoryFilter === 'Core' ? 'offensive' : categoryFilter.toLowerCase());
    return matchSearch && matchLevel && matchCategory;
  });

  // Separate free and paid
  const freeCourses = filtered.filter(c => c.is_free);
  const paidCourses = filtered.filter(c => !c.is_free);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center font-mono select-none">
        <div className="text-center space-y-4">
          <Shield className="w-12 h-12 text-accent-cyan animate-spin mx-auto" />
          <p className="text-body-sm font-bold text-accent-cyan uppercase tracking-widest">
            LOADING SECURE COURSE DIRECTORY...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-900 pt-20 pb-16">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Page header */}
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold text-white">Courses</h1>
          <p className="text-slate-400 text-sm mt-1">{courses.length} courses available • {courses.filter(c => c.is_free).length} free</p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-surface-800 border border-white/[0.08] focus:border-accent-cyan/50 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm outline-none transition-all placeholder:text-slate-600"
            />
          </div>

          {/* Level tabs */}
          <div className="flex items-center gap-1 bg-surface-800 border border-white/[0.06] rounded-xl p-1">
            {LEVEL_TABS.map(l => (
              <button
                key={l}
                onClick={() => setLevelFilter(l)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  levelFilter === l ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20' : 'text-slate-400 hover:text-white'
                )}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          {CATEGORY_TABS.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                'px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-all border',
                categoryFilter === cat
                  ? 'bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan'
                  : 'border-white/[0.08] text-slate-500 hover:text-white hover:border-white/20'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── FREE COURSES SECTION ── */}
        {freeCourses.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-emerald-400 font-semibold text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Free Courses
              </span>
              <span className="text-slate-600 text-[11px] font-mono">{freeCourses.length} courses • No subscription required</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {freeCourses.map((course, i) => (
                <CourseCard key={course.id} course={course} isPro={isPro} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* ── PAID COURSES SECTION ── */}
        {paidCourses.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-accent-violet font-semibold text-sm flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Pro Courses
              </span>
              <span className="text-slate-600 text-[11px] font-mono">
                {isPro ? `${paidCourses.length} courses unlocked` : `${paidCourses.length} courses • Pro plan required`}
              </span>
              {!isPro && (
                <a href="/subscription" className="ml-auto text-[11px] text-accent-cyan font-semibold hover:text-cyan-300 transition-colors">
                  Upgrade to Pro →
                </a>
              )}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paidCourses.map((course, i) => (
                <CourseCard key={course.id} course={course} isPro={isPro} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-white font-semibold">No courses found</p>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
