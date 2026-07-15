import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, PanelLeftClose, PanelLeft, ShieldCheck, CheckCircle2, BookOpen, Video, Award, Terminal } from 'lucide-react';
import { ModuleSidebar } from '../../components/course';
import { Badge, Progress } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';

// Import security controls
import { AntiPiracyContainer, SecureVideoPlayer, SecurePDFViewer, TerminalLab } from '../../components/security';


interface DBLesson {
  id: number;
  course_id: number;
  title: string;
  video_url: string;
  duration: string;
  order_no: number;
  is_free: boolean;
}

interface DBProgress {
  lesson_id: number;
  completed: boolean;
}

interface DBCourse {
  id: number;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  xp_reward: number;
  thumbnail: string;
  duration: string;
  is_free: boolean;
}

interface DBBook {
  id: number;
  title: string;
  author: string;
  description: string;
  pdf_url: string;
  is_free: boolean;
}

export default function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const { dbUser, subscription, refreshUserProfile } = useAuth();
  
  // HUD UI and Data States
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [course, setCourse] = useState<DBCourse | null>(null);
  const [lessons, setLessons] = useState<DBLesson[]>([]);
  const [progress, setProgress] = useState<DBProgress[]>([]);
  const [books, setBooks] = useState<DBBook[]>([]);
  const [currentLessonId, setCurrentLessonId] = useState<string>('');
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'video' | 'manuals' | 'terminal'>('video');
  const [loading, setLoading] = useState(true);
  const [isSubmittingProgress, setIsSubmittingProgress] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCourseDetails();
    }
    fetchHackingLibrary();
  }, [id, dbUser]);

  const fetchCourseDetails = async () => {
    setLoading(true);
    try {
      const uidParam = dbUser ? `&uid=${dbUser.id}` : '';
      const res = await fetch(`/api/content?course_id=${id}${uidParam}`);
      if (res.ok) {
        const data = await res.json();
        setCourse(data.course);
        setLessons(data.lessons);
        setProgress(data.progress);
        
        // Auto select first lesson
        if (data.lessons.length > 0) {
          setCurrentLessonId(String(data.lessons[0].id));
        }
      }
    } catch (err) {
      console.error('Failed to sync course specifics:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHackingLibrary = async () => {
    try {
      const res = await fetch('/api/content?type=books');
      if (res.ok) {
        const booksList = await res.json();
        setBooks(booksList);
        if (booksList.length > 0) {
          setSelectedBookId(booksList[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch manuals:', err);
    }
  };

  // Mark lesson completed in PostgreSQL
  const handleMarkCompleted = async () => {
    if (!dbUser || !currentLessonId || isSubmittingProgress) return;
    setIsSubmittingProgress(true);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: dbUser.id,
          lesson_id: parseInt(currentLessonId),
          completed: true
        })
      });

      if (res.ok) {
        // Refresh local progress state
        setProgress(prev => {
          const exists = prev.some(p => p.lesson_id === parseInt(currentLessonId));
          if (exists) {
            return prev.map(p => p.lesson_id === parseInt(currentLessonId) ? { ...p, completed: true } : p);
          }
          return [...prev, { lesson_id: parseInt(currentLessonId), completed: true }];
        });
        
        // Trigger live XP update across auth states
        await refreshUserProfile();
      }
    } catch (err) {
      console.error('Failed to log operational completion:', err);
    } finally {
      setIsSubmittingProgress(false);
    }
  };

  if (loading || !course) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-surface-900 font-mono text-accent-cyan tracking-wider">
        <ShieldCheck className="w-12 h-12 animate-pulse mb-3" />
        SECURE ROADMAP INTERFACE CONFIGURING...
      </div>
    );
  }

  // Map database flat lessons to ModuleSidebar hierarchy structure
  const mappedLessons = lessons.map(lesson => {
    const completed = progress.some(p => p.lesson_id === lesson.id && p.completed);
    const isPro = subscription?.tier === 'pro';
    const locked = !isPro && !lesson.is_free;

    return {
      id: String(lesson.id),
      title: lesson.title,
      duration: lesson.duration || '10:00',
      type: 'video' as const,
      completed,
      locked
    };
  });

  const virtualModules = [
    {
      id: 'm1',
      title: 'Course Curriculum',
      order: 1,
      lessons: mappedLessons
    }
  ];

  const currentLesson = lessons.find(l => String(l.id) === currentLessonId);
  const currentBook = books.find(b => b.id === selectedBookId);
  const isLessonCompleted = progress.some(p => p.lesson_id === parseInt(currentLessonId) && p.completed);

  const completedCount = progress.filter(p => p.completed).length;
  const totalCount = lessons.length;

  return (
    <AntiPiracyContainer active={true}>
      <div className="h-screen flex flex-col bg-surface-900 font-sans">
        
        {/* Anti-Scraping Tactical Header */}
        <header className="h-14 border-b border-white/[0.06] bg-surface-800/50 backdrop-blur-xl flex items-center px-4 gap-4 shrink-0 justify-between select-none">
          <div className="flex items-center gap-4 min-w-0">
            <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-body-sm font-bold text-white truncate">{course.title}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant={course.level === 'advanced' ? 'violet' : course.level === 'intermediate' ? 'cyan' : 'emerald'}>
                  {course.level}
                </Badge>
                <span className="text-caption text-slate-500 font-mono">
                  {completedCount}/{totalCount} lessons completed
                </span>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            {/* XP progress indicators */}
            <div className="text-right">
              <div className="text-caption text-slate-400 font-mono font-semibold">
                BOUNTY: {course.xp_reward} XP
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                LEVEL PROGRESS
              </div>
            </div>
            <div className="w-28">
              <Progress value={completedCount} max={totalCount} variant="cyan" size="sm" />
            </div>
          </div>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/[0.04]"
          >
            {sidebarCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </header>

        {/* Main interactive terminal area */}
        <div className="flex-1 flex overflow-hidden">
          
          <ModuleSidebar
            modules={virtualModules}
            currentLessonId={currentLessonId}
            onLessonClick={setCurrentLessonId}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          <div className="flex-1 overflow-y-auto bg-[#04060f] relative">
            
            {/* Custom Cyberpunk Sub Tab Controls */}
            <div className="max-w-4xl mx-auto px-6 pt-6 flex items-center justify-between border-b border-white/[0.04] pb-2 mb-6">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveSubTab('video')}
                  className={`flex items-center gap-1.5 pb-2 font-mono text-xs uppercase font-bold border-b-2 transition-all ${
                    activeSubTab === 'video'
                      ? 'border-accent-cyan text-white'
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  Secured Lectures
                </button>
                <button
                  onClick={() => setActiveSubTab('manuals')}
                  className={`flex items-center gap-1.5 pb-2 font-mono text-xs uppercase font-bold border-b-2 transition-all ${
                    activeSubTab === 'manuals'
                      ? 'border-accent-cyan text-white'
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Tactical Vault
                </button>
                <button
                  onClick={() => setActiveSubTab('terminal')}
                  className={`flex items-center gap-1.5 pb-2 font-mono text-xs uppercase font-bold border-b-2 transition-all ${
                    activeSubTab === 'terminal'
                      ? 'border-accent-cyan text-white'
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Terminal className="w-4 h-4" />
                  Interactive Shell
                </button>

              </div>

              <div className="text-[10px] font-mono text-accent-cyan/60 flex items-center gap-1.5 uppercase font-bold select-none">
                <ShieldCheck className="w-3.5 h-3.5" /> Core DRM Activated
              </div>
            </div>

            {/* TAB VIEWPORTS */}
            <div className="max-w-4xl mx-auto p-6 space-y-6 pt-0">
              
              {/* VIEWPORT 1: SECURED DRM VIDEO LECTURE */}
              {activeSubTab === 'video' && (
                <div className="space-y-6">
                  {currentLesson ? (
                    <>
                      <SecureVideoPlayer
                        title={currentLesson.title}
                        videoUrl={currentLesson.video_url}
                        isFreeLesson={currentLesson.is_free}
                      />
                      
                      {/* Course notes & progress triggers */}
                      <div className="glass p-6 rounded-2xl border border-white/[0.06] bg-surface-900/40 relative">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                          <div>
                            <div className="text-[10px] font-mono text-accent-cyan uppercase tracking-wider">
                              Now playing:
                            </div>
                            <h2 className="text-lg font-bold text-white mt-1">{currentLesson.title}</h2>
                            <p className="text-caption text-slate-500 mt-0.5 font-mono">
                              Timeline Module Node &bull; Duration: {currentLesson.duration || '10:00'}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            {isLessonCompleted ? (
                              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono uppercase font-bold select-none">
                                <CheckCircle2 className="w-4 h-4" /> NODE AUTHORIZED
                              </span>
                            ) : (
                              <button
                                onClick={handleMarkCompleted}
                                disabled={isSubmittingProgress}
                                className="px-4 py-2 rounded-lg bg-accent-cyan text-black hover:bg-cyan-300 disabled:opacity-40 transition-all font-mono font-bold text-xs uppercase flex items-center gap-1.5"
                              >
                                <Award className="w-4 h-4" />
                                Mark as Complete
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Interactive Lecture notes block */}
                        <div className="border-t border-white/[0.04] pt-4 mt-4">
                          <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest mb-3">
                            Directives & Training Notes
                          </h4>
                          <div className="text-slate-300 text-xs leading-relaxed font-mono whitespace-pre-wrap bg-black/40 p-4 rounded-xl border border-white/[0.04]">
                            1. Watch this video lesson and verify all cybersecurity methodologies.<br/>
                            2. Review reverse engineering directives in the Hacking Manual vault.<br/>
                            3. Draft solution flags in active CTF homework dashboard to verify rank.<br/><br/>
                            Note: Distributing lecture frames or capturing this layout is strictly prohibited by security sandboxing filters.
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="h-64 flex items-center justify-center font-mono text-xs text-slate-500 border border-white/[0.06] rounded-xl glass">
                      Please select a lecture module to begin deployment.
                    </div>
                  )}
                </div>
              )}

              {/* VIEWPORT 2: SECURED CANVAS PDF VIEWER (TACTICAL VAULT) */}
              {activeSubTab === 'manuals' && (
                <div className="space-y-6">
                  {books.length === 0 ? (
                    <div className="h-64 flex items-center justify-center font-mono text-xs text-slate-500 border border-white/[0.06] rounded-xl glass">
                      No hacking manuals found in secondary vault database.
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Selector dropdown */}
                      <div className="glass p-4 rounded-xl border border-white/[0.06] bg-surface-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs select-none">
                        <label className="text-slate-400 uppercase text-[10px] font-bold">
                          Select intelligence manual:
                        </label>
                        <select
                          value={selectedBookId || ''}
                          onChange={e => setSelectedBookId(parseInt(e.target.value))}
                          className="bg-black/60 border border-white/[0.08] rounded-lg p-2.5 text-white focus:outline-none focus:border-accent-cyan font-mono text-xs w-full md:w-80"
                        >
                          {books.map(book => (
                            <option key={book.id} value={book.id}>
                              {book.title} ({book.is_free ? 'Free' : 'Pro'})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* PDF render canvas */}
                      {currentBook ? (
                        <SecurePDFViewer
                          title={currentBook.title}
                          author={currentBook.author}
                          sampleContent={[
                            `${currentBook.title}\nAuthor: ${currentBook.author}\n\nSecurity Clearance Required: LEVEL 1\n\nIntelligence Overview:\n${currentBook.description || 'Confidential operational guidelines.'}\n\n-- PAGE 1 PROLOGUE --\nEthical hacking operations require extreme planning and systematic intelligence gathering. Our manuals detail vectors into various frameworks. Refer to corresponding CEH module timelines.`,
                            `-- PAGE 2 PROTOCOLS --\nNetwork enumeration is best automated using customized shells. Always verify target ports:\n- TCP 22 (SSH)\n- TCP 80/443 (HTTP/S)\n- TCP 3306 (MySQL)\n- TCP 5432 (PostgreSQL)\n\nIdentify firewalls and active intrusion detection filters before dispatching exploits.`,
                            `-- PAGE 3 SYSTEM PERSISTENCE --\nMaintaining access involves dropping encrypted backdoors. We recommend cron task scripting or systemd unit modifications to bypass detection sweeps.`,
                            `-- PAGE 4 LOG TAMPERING --\nCovering traces requires editing standard security logs:\n- /var/log/secure\n- /var/log/messages\n- Windows Event Log filters\n\nAlways purge command-line logs dynamically before exit protocols.`
                          ]}
                        />
                      ) : null}
                    </div>
                  )}
                </div>
              )}

              {/* VIEWPORT 3: INTERACTIVE TERMINAL HACKING SANDBOX */}
              {activeSubTab === 'terminal' && (
                <div className="space-y-6">
                  <TerminalLab />
                </div>
              )}


            </div>
          </div>
        </div>
      </div>
    </AntiPiracyContainer>
  );
}
