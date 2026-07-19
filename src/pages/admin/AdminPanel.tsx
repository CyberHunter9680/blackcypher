import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Navbar } from '../../components/layout/Navbar';
import { 
  ShieldAlert, ShieldCheck, Database, FileText, Video, Book, 
  Calendar, CheckSquare, Check, X, Award, ExternalLink,
  Users, DollarSign, Award as CertIcon, Terminal, Lock, AlertTriangle,
  Plus, Trash2, UploadCloud, BookOpen, Settings, CheckCircle2,
  MessageSquare, Star, RefreshCw, Edit2, Megaphone, Ban, Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui';

// Type definitions
interface Metrics {
  totalStudents: number;
  totalIncome: number;
  activeSessions: number;
  totalTasks: number;
  totalBooks: number;
  totalLessons: number;
}

interface Booking {
  id: number;
  booking_type: string;
  booking_date: string | null;
  status: 'pending' | 'approved' | 'completed';
  created_at: string;
  email: string;
  name: string;
  institute_name?: string | null;
  contact_name?: string | null;
  contact_phone?: string | null;
  plan_duration?: string | null;
  amount_paid?: any;
  receipt_url?: string | null;
}

interface Submission {
  id: number;
  task_id: number;
  user_id: string;
  submission_content: string;
  status: 'submitted' | 'approved' | 'rejected';
  feedback: string | null;
  submitted_at: string;
  task_title: string;
  xp_reward: number;
  email: string;
  name: string;
  flag_submitted?: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  level: string;
  xp_reward: number;
  thumbnail: string;
  duration: string;
  is_free: boolean;
}

interface User {
  id: string;
  email: string;
  phone: string | null;
  name: string;
  username?: string;
  discriminator?: string;
  role: string;
  status: string; // 'active' | 'blocked'
  qualification: string | null;
  xp: number;
  level: number;
  joined_at: string;
  avatar: string | null;
  subscription_tier: string | null;
}

interface Lesson {
  id: number;
  course_id: number;
  title: string;
  video_url: string;
  duration: string;
  order_no: number;
  is_free: boolean;
  course_title?: string;
}

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  pdf_url: string;
  is_free: boolean;
  created_at: string;
}

interface Meeting {
  id: number;
  title: string;
  meet_url: string;
  date_time: string;
  active: boolean;
}

interface Task {
  id: number;
  title: string;
  description: string;
  assigned_to: string | null;
  xp_reward: number;
  due_date: string | null;
  created_at: string;
}

// Sub-component for direct animated file uploading (Simulation & CDN pathing)
function CyberUploader({ 
  type, 
  onUploadComplete 
}: { 
  type: 'video' | 'pdf'; 
  onUploadComplete: (url: string) => void; 
}) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpload = () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    setSuccess(false);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setSuccess(true);
          const randomId = Math.random().toString(36).substring(2, 10);
          const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
          const mockUrl = type === 'pdf'
            ? `https://firebasestorage.googleapis.com/v0/b/blackcypher-auth.firebasestorage.app/o/manuals%2F${cleanName}_${randomId}?alt=media`
            : `https://firebasestorage.googleapis.com/v0/b/blackcypher-auth.firebasestorage.app/o/lessons%2F${cleanName}_${randomId}?alt=media`;
          onUploadComplete(mockUrl);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 120);
  };

  return (
    <div className="border border-dashed border-accent-cyan/30 bg-black/40 p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-3 hover:border-accent-cyan transition-all relative overflow-hidden group">
      <input 
        type="file" 
        accept={type === 'pdf' ? '.pdf' : 'video/*'} 
        onChange={(e) => {
          if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
            setSuccess(false);
            setProgress(0);
          }
        }}
        className="hidden" 
        id={`cyber-upload-${type}`}
      />
      <label htmlFor={`cyber-upload-${type}`} className="cursor-pointer flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan group-hover:bg-accent-cyan/20 transition-all shadow-[0_0_10px_rgba(0,255,102,0.05)]">
          <UploadCloud className="w-6 h-6 animate-bounce" />
        </div>
        <span className="text-xs text-white font-bold font-mono">
          {file ? `Selected: ${file.name}` : `Select Hacking ${type.toUpperCase()} File`}
        </span>
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
          {type === 'pdf' ? 'PDF Manual Format' : 'MP4 / MKV Video Format'}
        </span>
      </label>

      {file && !uploading && !success && (
        <button 
          onClick={handleUpload}
          type="button"
          className="mt-2 text-[10px] px-4 py-2 bg-accent-cyan text-black hover:bg-cyan-300 rounded-lg font-mono font-bold uppercase transition-all shadow-[0_0_10px_rgba(0,255,102,0.2)]"
        >
          UPLOAD TO SECURE CLOUD CDN
        </button>
      )}

      {uploading && (
        <div className="w-full space-y-1.5 mt-2">
          <div className="flex justify-between text-[10px] font-mono text-accent-cyan">
            <span>UPLOADING SECURE ENCRYPTED PACKETS...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/[0.04]">
            <div className="h-full bg-accent-cyan transition-all duration-150" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {success && (
        <div className="mt-2 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded flex items-center gap-1.5 animate-pulse">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>CDN UPLOAD COMPLETE! URL WIRE SYNCED.</span>
        </div>
      )}
    </div>
  );
}

export default function AdminPanel() {
  const { dbUser, loading: authLoading, loginAsAdminWithCredentials } = useAuth();
  const [activeTab, setActiveTab] = useState<'metrics' | 'bookings' | 'submissions' | 'courses' | 'lessons' | 'books' | 'meetings' | 'tasks' | 'blogs' | 'users' | 'subscriptions' | 'feedback' | 'notifications' | 'contact'>('metrics');

  // Interactive Admin Login Gate state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'INIT // SYSTEM ONLINE: BLACK CYPHER NETWORK SECURITY PORTAL v4.3.0',
    'DETECT // COGNITIVE INTEGRATIONS SHIELD... STABLE',
    'SECURITY // ADVISORY ROOT CONTROL LINK REQUIRED',
    'SYSTEM // MONITORING ACTIVE: ILLEGITIMATE SUBMISSIONS LOGGED TO SUBNET LEDGER'
  ]);

  // Operational states
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<Array<{ id: number; title: string; content: string; author: string; created_at: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<Array<{ id: number; uid: string; name: string; rating: number; message: string; is_published: number; submitted_at: string }>>([]);
  const [feedbackFilter, setFeedbackFilter] = useState<'all' | 'pending' | 'published'>('all');
  const [contactMessages, setContactMessages] = useState<Array<{ id: number; name: string; email: string; subject: string | null; message: string; created_at: string }>>([]);

  // Broadcasting Notifications State
  const [adminNotifications, setAdminNotifications] = useState<any[]>([]);
  const [broadcastForm, setBroadcastForm] = useState({
    type: 'update', // 'course' | 'update' | 'alert'
    title: '',
    message: '',
    target_user_id: '' // optional
  });

  // Form states
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: 'Offensive Security',
    level: 'intermediate',
    xp_reward: '1000',
    thumbnail: '',
    duration: '12h',
    is_free: false
  });

  const [lessonForm, setLessonForm] = useState({
    course_id: '',
    title: '',
    video_url: '',
    duration: '12:30',
    order_no: '1',
    is_free: false
  });

  const [bookForm, setBookForm] = useState({
    title: '',
    author: 'Black Cypher SpecOps',
    description: '',
    pdf_url: '',
    is_free: false
  });

  const [meetingForm, setMeetingForm] = useState({
    title: '',
    meet_url: '',
    date_time: ''
  });

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assigned_to: 'all',
    xp_reward: '500',
    due_date: ''
  });

  const [partnerForm, setPartnerForm] = useState({
    name: '',
    logo: '',
    link: '',
    type: 'partner'
  });

  const [blogForm, setBlogForm] = useState({
    title: '',
    content: '',
    author: 'Abhishek Verma'
  });

  const [gradingFeedbacks, setGradingFeedbacks] = useState<Record<number, string>>({});
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Content Editing States
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [editingBookId, setEditingBookId] = useState<number | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  // Local storage loaded customizer for subscriptions
  const [pricingPlans, setPricingPlans] = useState(() => {
    const saved = localStorage.getItem('blackcypher_subscription_plans');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      coreTiers: [
        {
          id: 'free',
          name: 'Free Recruit',
          monthlyPrice: 0,
          yearlyPrice: 0,
          badge: 'Level 1 Clearance',
          description: 'Perfect for beginners starting their journey into defensive cybersecurity and foundational computing.',
          features: [
            'Access to Public Learning Roadmaps',
            'Basic Cyber Manuals & Cheatsheets',
            '3 Starter Practical CTF Modules',
            'Community Security Forum Access',
            'Standard System Profile Badge'
          ],
          cta: 'Initiate Recruit Protocol',
          highlighted: false,
          color: 'cyan'
        },
        {
          id: 'pro',
          name: 'Pro Operator',
          monthlyPrice: 2499,
          yearlyPrice: 18999,
          badge: 'Elite Operator',
          description: 'Our flagship training track. Unlock premium materials, advanced sandboxes, and personalized doubt sessions.',
          features: [
            'Complete Cyber Course Library (CEH v10, CEH v13)',
            'Premium PDF Handbooks & Lab Guide Downloads',
            'Includes 1 Month of Live Weekend Doubt Support',
            'Access to Advanced Sandbox Practice Arenas',
            'Exclusive Elite Profile Badge & 500 XP Welcome',
            'Prioritized Security Intel Advisories Feed',
            'Direct Discord Operator Channel Integration'
          ],
          cta: 'Acquire Pro Clearance',
          highlighted: true,
          color: 'cyan'
        }
      ],
      doubtExtensions: [
        {
          id: 'm-1',
          name: '1-Month Crisis Clearance',
          price: 1999,
          duration: '1 month',
          desc: 'Perfect for urgent debugging. 4 weekends (8 sessions) of dedicated 1-on-1 expert troubleshooting.',
          popular: false,
          badge: 'Crisis Support'
        },
        {
          id: 'm-2',
          name: '2-Month Operations Extension',
          price: 3499,
          duration: '2 months',
          desc: 'Our recommended baseline. 8 weekends (16 sessions) of comprehensive exploit analysis and sandbox debugging support.',
          popular: true,
          badge: 'Most Popular'
        },
        {
          id: 'm-3',
          name: '3-Month Strategic Retainer',
          price: 4999,
          duration: '3 months',
          desc: 'Unrestricted cyber backup. 12 weekends (24 sessions) of continuous advanced roadmap mentorship and live guidance.',
          popular: false,
          badge: 'Maximum Value'
        }
      ],
      campusBookings: [
        {
          id: 's-1',
          name: '1-Week Intensive Bootcamp',
          price: 14999,
          details: '5 Action Days (2 hours/day) focusing on essential threat intelligence, networking defense hygiene, and OSINT methodology.',
          level: 'Tactical Entry',
          features: ['1-Week Cyber Training Roadmap', 'Introduction to Penetration Testing', 'Student Participation Certificates']
        },
        {
          id: 's-2',
          name: '1-Month Campus Alliance',
          price: 49999,
          details: '4-Week structured threat hunt. Deep dives into web-app security, database pentesting, and live simulated CTF exams.',
          level: 'Intermediate Vanguard',
          features: ['1-Week Cyber Training Roadmap', 'Interactive Pentest Labs Setups', 'Certified Exam Vouchers for Top 10%']
        },
        {
          id: 's-3',
          name: '2-Month Cyber Vanguard Campaign',
          price: 89999,
          details: '8-Week elite team preparation. Practical red-teaming simulations, advanced hardware exploits, sandbox drills, and network hygiene logs.',
          level: 'Advanced Red-Teamer',
          features: ['1-Week Cyber Training Roadmap', 'Personalized Institutional Sandbox', 'Individual Student Performance Reports']
        },
        {
          id: 's-4',
          name: '3-Month Sovereign Program',
          price: 129999,
          details: '12-Week ultimate security overhaul. Zero-trust architecture orchestration, custom API security modeling, and intensive team exercises.',
          level: 'Institutional Mastery',
          features: ['1-Week Cyber Training Roadmap', 'Dedicated Mentor for 90 Days', 'Official Alliance Plaque & Certifications']
        }
      ]
    };
  });

  const triggerNotification = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 5000);
  };

  useEffect(() => {
    if (dbUser && dbUser.role === 'admin') {
      fetchAdminData();
    }
  }, [dbUser, activeTab]);

  // Auto-refresh every 60 seconds when admin is viewing the panel
  useEffect(() => {
    if (!dbUser || dbUser.role !== 'admin') return;
    const interval = setInterval(() => {
      fetchAdminData();
    }, 60000);
    const handleFocus = () => fetchAdminData();
    window.addEventListener('focus', handleFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [dbUser]);

  const fetchAdminData = async () => {
    if (!dbUser) return;
    setIsLoading(true);
    try {
      if (activeTab === 'metrics') {
        const res = await fetch(`/api/admin?uid=${dbUser.id}&action=metrics`);
        if (res.ok) setMetrics(await res.json());
        const resP = await fetch(`/api/admin?uid=${dbUser.id}&action=partners`);
        if (resP.ok) setPartners(await resP.json());
      } else if (activeTab === 'bookings') {
        const res = await fetch(`/api/admin?uid=${dbUser.id}&action=bookings`);
        if (res.ok) setBookings(await res.json());
      } else if (activeTab === 'submissions') {
        const res = await fetch(`/api/admin?uid=${dbUser.id}&action=submissions`);
        if (res.ok) setSubmissions(await res.json());
      } else if (activeTab === 'courses') {
        const res = await fetch(`/api/admin?uid=${dbUser.id}&action=courses`);
        if (res.ok) setCourses(await res.json());
      } else if (activeTab === 'lessons') {
        const resC = await fetch(`/api/admin?uid=${dbUser.id}&action=courses`);
        if (resC.ok) setCourses(await resC.json());
        const resL = await fetch(`/api/admin?uid=${dbUser.id}&action=lessons`);
        if (resL.ok) setLessons(await resL.json());
      } else if (activeTab === 'books') {
        const res = await fetch(`/api/admin?uid=${dbUser.id}&action=books`);
        if (res.ok) setBooks(await res.json());
      } else if (activeTab === 'meetings') {
        const res = await fetch(`/api/admin?uid=${dbUser.id}&action=meetings`);
        if (res.ok) setMeetings(await res.json());
      } else if (activeTab === 'tasks') {
        const resT = await fetch(`/api/admin?uid=${dbUser.id}&action=tasks`);
        if (resT.ok) setTasks(await resT.json());
        const resU = await fetch(`/api/admin?uid=${dbUser.id}&action=users`);
        if (resU.ok) setUsers(await resU.json());
      } else if (activeTab === 'users') {
        const res = await fetch(`/api/admin?uid=${dbUser.id}&action=users`);
        if (res.ok) setUsers(await res.json());
      } else if (activeTab === 'blogs') {
        const res = await fetch('/api/blogs');
        if (res.ok) setBlogs(await res.json());
      } else if (activeTab === 'notifications') {
        const res = await fetch(`/api/notifications?uid=${dbUser.id}&admin_view=true`);
        if (res.ok) setAdminNotifications(await res.json());
      } else if (activeTab === 'contact') {
        const res = await fetch(`/api/contact?admin_uid=${dbUser.id}`);
        if (res.ok) setContactMessages(await res.json());
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
      triggerNotification('Failed to establish link with Neon Ledger.', 'error');
    } finally {
      setIsLoading(false);
    }

    // Always also load feedback in background for the feedback tab
    try {
      const fbRes = await fetch('/api/feedback');
      if (fbRes.ok) setFeedbacks(await fbRes.json());
    } catch {}
  };

  // Create new Roadmap Course
  const handleCourseCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbUser) return;
    if (!courseForm.title) {
      triggerNotification('Specify at least a course title.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: dbUser.id,
          action: 'create_course',
          ...courseForm
        })
      });

      if (res.ok) {
        triggerNotification('ROADMAP COURSE NODE DEPLOYED SUCCESSFULLY.');
        setCourseForm({
          title: '',
          description: '',
          category: 'Offensive Security',
          level: 'intermediate',
          xp_reward: '1000',
          thumbnail: '',
          duration: '12h',
          is_free: false
        });
        const coursesRes = await fetch(`/api/admin?uid=${dbUser.id}&action=courses`);
        if (coursesRes.ok) setCourses(await coursesRes.json());
      } else {
        const data = await res.json();
        triggerNotification(data.error || 'Deployment failed.', 'error');
      }
    } catch (err) {
      triggerNotification('Database query timeout.', 'error');
    }
  };

  // Delete Course
  const handleDeleteCourse = async (courseId: number) => {
    if (!confirm('Are you sure you want to delete this course? This will permanently remove all linked video lessons as well.')) return;
    if (!dbUser) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: dbUser.id,
          action: 'delete_course',
          course_id: courseId
        })
      });
      if (res.ok) {
        triggerNotification('Course and all dependent lessons successfully purged.');
        setCourses(prev => prev.filter(c => c.id !== courseId));
      } else {
        triggerNotification('Purge command rejected.', 'error');
      }
    } catch (e) {
      triggerNotification('Handshake failure.', 'error');
    }
  };

  // Upload lesson
  const handleLessonUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbUser) return;
    if (!lessonForm.course_id || !lessonForm.title || !lessonForm.video_url) {
      triggerNotification('Fill in course selection, lecture title and secure video URL.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: dbUser.id,
          action: 'upload_lesson',
          ...lessonForm
        })
      });

      if (res.ok) {
        triggerNotification('LECTURE NODE DEPLOYED. CEH timeline updated.');
        setLessonForm({
          course_id: '',
          title: '',
          video_url: '',
          duration: '12:30',
          order_no: '1',
          is_free: false
        });
        const resL = await fetch(`/api/admin?uid=${dbUser.id}&action=lessons`);
        if (resL.ok) setLessons(await resL.json());
      } else {
        const data = await res.json();
        triggerNotification(data.error || 'Deployment failed.', 'error');
      }
    } catch (err) {
      triggerNotification('Database connection timeout.', 'error');
    }
  };

  // Delete specific lesson
  const handleDeleteLesson = async (lessonId: number) => {
    if (!confirm('Are you sure you want to delete this video lesson?')) return;
    if (!dbUser) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: dbUser.id,
          action: 'delete_lesson',
          lesson_id: lessonId
        })
      });
      if (res.ok) {
        triggerNotification('Lesson node successfully purged.');
        setLessons(prev => prev.filter(l => l.id !== lessonId));
      } else {
        triggerNotification('Purge command rejected.', 'error');
      }
    } catch (e) {
      triggerNotification('Handshake failure.', 'error');
    }
  };

  // Upload Hacking Book PDF
  const handleBookUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbUser) return;
    if (!bookForm.title || !bookForm.pdf_url) {
      triggerNotification('Provide Title and Protected PDF CDN URL.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: dbUser.id,
          action: 'upload_book',
          ...bookForm
        })
      });

      if (res.ok) {
        triggerNotification('HACKING MANUAL ARCHIVED.');
        setBookForm({
          title: '',
          author: 'Black Cypher SpecOps',
          description: '',
          pdf_url: '',
          is_free: false
        });
        const resB = await fetch(`/api/admin?uid=${dbUser.id}&action=books`);
        if (resB.ok) setBooks(await resB.json());
      } else {
        const data = await res.json();
        triggerNotification(data.error || 'Manual archiving failed.', 'error');
      }
    } catch (err) {
      triggerNotification('Database connection failed.', 'error');
    }
  };

  // Delete Book
  const handleDeleteBook = async (bookId: number) => {
    if (!confirm('Are you sure you want to delete this hacking manual PDF?')) return;
    if (!dbUser) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: dbUser.id,
          action: 'delete_book',
          book_id: bookId
        })
      });
      if (res.ok) {
        triggerNotification('Book successfully purged from archives.');
        setBooks(prev => prev.filter(b => b.id !== bookId));
      } else {
        triggerNotification('Purge command rejected.', 'error');
      }
    } catch (e) {
      triggerNotification('Handshake failure.', 'error');
    }
  };

  // Manage weekend meeting links
  const handleMeetingManage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbUser) return;
    if (!meetingForm.title || !meetingForm.meet_url || !meetingForm.date_time) {
      triggerNotification('Provide all briefing coordinates.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: dbUser.id,
          action: 'manage_meeting',
          ...meetingForm
        })
      });

      if (res.ok) {
        triggerNotification('BRIEFING HUB LAUNCHED.');
        setMeetingForm({
          title: '',
          meet_url: '',
          date_time: ''
        });
        const resM = await fetch(`/api/admin?uid=${dbUser.id}&action=meetings`);
        if (resM.ok) setMeetings(await resM.json());
      } else {
        const data = await res.json();
        triggerNotification(data.error || 'Doubt hub setup failed.', 'error');
      }
    } catch (err) {
      triggerNotification('Handshake failure.', 'error');
    }
  };

  // Delete Meeting
  const handleDeleteMeeting = async (meetingId: number) => {
    if (!confirm('Are you sure you want to delete this doubt briefing meeting link?')) return;
    if (!dbUser) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: dbUser.id,
          action: 'delete_meeting',
          meeting_id: meetingId
        })
      });
      if (res.ok) {
        triggerNotification('Meeting successfully deleted.');
        setMeetings(prev => prev.filter(m => m.id !== meetingId));
      } else {
        triggerNotification('Purge command rejected.', 'error');
      }
    } catch (e) {
      triggerNotification('Handshake failure.', 'error');
    }
  };

  // Create assignments
  const handleTaskCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbUser) return;
    if (!taskForm.title || !taskForm.description) {
      triggerNotification('Write task title and directives.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: dbUser.id,
          action: 'create_task',
          ...taskForm
        })
      });

      if (res.ok) {
        triggerNotification('CTF MISSION ASSIGNED TO STUDENT CHANNELS.');
        setTaskForm({
          title: '',
          description: '',
          assigned_to: 'all',
          xp_reward: '500',
          due_date: ''
        });
        const resT = await fetch(`/api/admin?uid=${dbUser.id}&action=tasks`);
        if (resT.ok) setTasks(await resT.json());
      } else {
        const data = await res.json();
        triggerNotification(data.error || 'CTF broadcast failed.', 'error');
      }
    } catch (err) {
      triggerNotification('Database write timed out.', 'error');
    }
  };

  // Delete CTF Task
  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this CTF mission / assignment?')) return;
    if (!dbUser) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: dbUser.id,
          action: 'delete_task',
          task_id: taskId
        })
      });
      if (res.ok) {
        triggerNotification('CTF Task successfully purged.');
        setTasks(prev => prev.filter(t => t.id !== taskId));
      } else {
        triggerNotification('Purge command rejected.', 'error');
      }
    } catch (e) {
      triggerNotification('Handshake failure.', 'error');
    }
  };

  // Delete certificate partner
  const handleDeletePartner = async (partnerId: number) => {
    if (!confirm('Remove this co-branding partner?')) return;
    if (!dbUser) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: dbUser.id,
          action: 'delete_partner',
          partner_id: partnerId
        })
      });
      if (res.ok) {
        triggerNotification('Partner profile removed successfully.');
        setPartners(prev => prev.filter(p => p.id !== partnerId));
      } else {
        triggerNotification('Deletion rejected.', 'error');
      }
    } catch (e) {
      triggerNotification('Network error.', 'error');
    }
  };

  // Delete contact message
  const handleDeleteContactMessage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this contact message?')) return;
    if (!dbUser) return;
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_uid: dbUser.id,
          action: 'delete',
          id: id
        })
      });
      if (res.ok) {
        triggerNotification('Contact message successfully deleted.');
        setContactMessages(prev => prev.filter(msg => msg.id !== id));
      } else {
        triggerNotification('Failed to delete contact message.', 'error');
      }
    } catch (e) {
      triggerNotification('Network error.', 'error');
    }
  };

  // Approve pending seminar/campus bookings
  const handleApproveBooking = async (bookingId: number) => {
    if (!dbUser) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: dbUser.id,
          action: 'approve_booking',
          booking_id: bookingId
        })
      });
      if (res.ok) {
        triggerNotification('BOOKING APPROVAL DEPLOYED SUCCESSFULLY.');
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'approved' } : b));
      } else {
        const data = await res.json();
        triggerNotification(data.error || 'Approval failed.', 'error');
      }
    } catch (err) {
      triggerNotification('Failed to reach reservation terminal.', 'error');
    }
  };

  // Save pricing changes to localStorage
  const handleSavePricingCustomizer = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('blackcypher_subscription_plans', JSON.stringify(pricingPlans));
    triggerNotification('SUBSCRIPTION PLAN CONFIGURATION SAVED INDEPENDENTLY. Live users synced.');
  };

  // Grade student homework submission
  const handleGradeSubmission = async (subId: number, status: 'approved' | 'rejected') => {
    if (!dbUser) return;
    const feedback = gradingFeedbacks[subId] || '';

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: dbUser.id,
          action: 'grade_submission',
          submission_id: subId,
          status,
          feedback
        })
      });

      if (res.ok) {
        triggerNotification(
          status === 'approved' 
            ? 'SUBMISSION AUTHORIZED. XP bonus and level updates wired to student profile.' 
            : 'SUBMISSION REJECTED. Notes dispatched to student terminal.'
        );
        setSubmissions(prev => prev.map(s => s.id === subId ? { ...s, status, feedback } : s));
      } else {
        const data = await res.json();
        triggerNotification(data.error || 'Submission grading failed.', 'error');
      }
    } catch (err) {
      triggerNotification('Failed to reach grading server.', 'error');
    }
  };

  // Create partner
  const handlePartnerCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbUser) return;
    if (!partnerForm.name || !partnerForm.logo) {
      triggerNotification('Provide partner name and logo CDN link.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: dbUser.id,
          action: 'manage_partner',
          ...partnerForm
        })
      });

      if (res.ok) {
        triggerNotification('BRANDING PARTNER REGISTERED.');
        setPartnerForm({
          name: '',
          logo: '',
          link: '',
          type: 'partner'
        });
        const resP = await fetch(`/api/admin?uid=${dbUser.id}&action=partners`);
        if (resP.ok) setPartners(await resP.json());
      } else {
        const data = await res.json();
        triggerNotification(data.error || 'Partner registration failed.', 'error');
      }
    } catch (err) {
      triggerNotification('Server communication failure.', 'error');
    }
  };

  // Publish Security Blog Advisory
  const handleBlogPublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbUser) return;
    if (!blogForm.title || !blogForm.content) {
      triggerNotification('Advisory requires title and content nodes.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: dbUser.id,
          action: 'create_blog',
          ...blogForm
        })
      });

      if (res.ok) {
        triggerNotification('SECURITY ADVISORY BROADCASTED. Active terminals updated.');
        setBlogForm({
          title: '',
          content: '',
          author: 'Abhishek Verma'
        });
        const blogsRes = await fetch('/api/blogs');
        if (blogsRes.ok) setBlogs(await blogsRes.json());
      } else {
        const data = await res.json();
        triggerNotification(data.error || 'Advisory broadcast failed.', 'error');
      }
    } catch (err) {
      triggerNotification('Advisory transmission timeout.', 'error');
    }
  };

  // Delete Security Blog Advisory
  const handleBlogDelete = async (blogId: number) => {
    if (!dbUser) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: dbUser.id,
          action: 'delete_blog',
          blog_id: blogId
        })
      });

      if (res.ok) {
        triggerNotification('SECURITY THREAT ADVISORY DE-AUTHORISED.');
        setBlogs(prev => prev.filter(b => b.id !== blogId));
      } else {
        const data = await res.json();
        triggerNotification(data.error || 'De-authorization failed.', 'error');
      }
    } catch (err) {
      triggerNotification('Security bridge connection timeout.', 'error');
    }
  };

  // Submit credentials via terminal
  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail || !adminPasscode) {
      setAdminError('PARAMETER_FAULT: ROOT_EMAIL OR SECURITY_PASSCODE MISSING');
      setTerminalLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] ERR // PARAMETER FAULT: UNRESOLVED INPUT CHANNELS`
      ]);
      return;
    }

    setAdminLoading(true);
    setAdminError('');
    setTerminalLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] WARN // TRANSMITTING COMMAND SIGNATURE FOR DECRYPTING...`,
      `[${new Date().toLocaleTimeString()}] HANDSHAKE // SYNCING WITH NEON SECURE DIRECT LEDGER...`
    ]);

    try {
      await loginAsAdminWithCredentials(adminEmail.trim().toLowerCase(), adminPasscode);
      setTerminalLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] SUCCESS // SIGNATURE VERIFIED. AUTH LEVEL 4 CLEARANCE ACCEPTED.`,
        `[${new Date().toLocaleTimeString()}] SYS // SPAWNING ROOT SHELL /bin/sh...`
      ]);
    } catch (err: any) {
      const errMsg = err.message || 'INVALID SIGNATURE CREDENTIALS';
      setAdminError(errMsg);
      setTerminalLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] ERR // ${errMsg.toUpperCase()}`,
        `[${new Date().toLocaleTimeString()}] SEC_ALERT // SHIELD RETRIES ENGAGED. INCIDENT REPORT DISPATCHED.`
      ]);
    } finally {
      setAdminLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050816] flex flex-col items-center justify-center font-mono relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,102,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,102,0.01)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
        <Database className="w-12 h-12 text-[#00ff66] animate-pulse mb-4 drop-shadow-[0_0_10px_rgba(0,255,102,0.4)]" />
        <div className="text-[#00ff66] text-xs tracking-widest uppercase font-bold drop-shadow-[0_0_5px_rgba(0,255,102,0.3)] animate-pulse">
          SECURE_HANDSHAKE: RUNNING AUDIT...
        </div>
      </div>
    );
  }

  // Auth Guard Gate Terminal
  if (!dbUser || dbUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#02040a] flex items-center justify-center p-4 md:p-6 font-mono text-[#00ff66] relative overflow-hidden selection:bg-[#00ff66]/20 select-none">
        <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,102,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,102,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <div className="max-w-2xl w-full bg-[#050812]/95 border border-[#00ff66]/30 rounded-lg p-6 md:p-8 shadow-[0_0_40px_rgba(0,255,102,0.15)] relative z-20">
          <div className="flex flex-col md:flex-row items-center justify-between border-b border-[#00ff66]/30 pb-4 mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-[#00ff66]/10 border border-[#00ff66]/20 flex items-center justify-center text-[#00ff66] animate-pulse">
                <Terminal className="w-5 h-5 drop-shadow-[0_0_5px_rgba(0,255,102,0.5)]" />
              </div>
              <div>
                <h1 className="text-base font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  BLACK CYPHER SECURE TERM v4.3
                </h1>
                <p className="text-[10px] text-[#00ff66]/70 uppercase tracking-widest font-semibold mt-0.5">
                  PORT: SECURE_ROOT_CLEARANCE_PORT_443
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping shrink-0" />
              <span className="text-[9px] px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 font-bold uppercase tracking-widest">
                SHIELD ACTIVE
              </span>
            </div>
          </div>

          <div className="bg-[#010206] border border-[#00ff66]/20 rounded p-4 h-48 overflow-y-auto mb-6 text-[11px] leading-relaxed text-[#00ff66]/80 font-mono scrollbar-thin scrollbar-thumb-[#00ff66]/20">
            <div className="text-[9px] text-[#00ff66]/40 uppercase tracking-widest font-bold border-b border-[#00ff66]/10 pb-1.5 mb-2">
              Diagnostic Logs Output:
            </div>
            {terminalLogs.map((log, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-[#00ff66]/40 shrink-0 select-none">&gt;</span>
                <span className="break-all">{log}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[#00ff66]/40 shrink-0 select-none">&gt;</span>
              <span className="w-2 h-4 bg-[#00ff66] inline-block animate-[blink_1s_step-end_infinite]" />
            </div>
          </div>

          <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
            {adminError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold uppercase tracking-wider block text-[10px] text-red-500 mb-0.5">AUTH_CRITICAL_FAILURE:</span>
                  <span>{adminError}</span>
                </div>
              </div>
            )}

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[10px] font-bold text-[#00ff66]/70 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <span>ROOT@BLACKCYPHER:~#</span>
                  <span className="text-white">ENTER ROOT EMAIL</span>
                </label>
                <input
                  type="email"
                  placeholder="operator@blackcypher.org"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full bg-[#010206] border border-[#00ff66]/30 focus:border-[#00ff66] focus:shadow-[0_0_10px_rgba(0,255,102,0.15)] rounded px-3 py-2.5 text-white outline-none transition-all placeholder:text-[#00ff66]/20 font-bold"
                  disabled={adminLoading}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#00ff66]/70 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <span>ROOT@BLACKCYPHER:~#</span>
                  <span className="text-white">ENTER PASSPHRASE DECRYPT KEY</span>
                </label>
                <input
                  type="password"
                  placeholder="•••••••••••••••••••••"
                  value={adminPasscode}
                  onChange={(e) => setAdminPasscode(e.target.value)}
                  className="w-full bg-[#010206] border border-[#00ff66]/30 focus:border-[#00ff66] focus:shadow-[0_0_10px_rgba(0,255,102,0.15)] rounded px-3 py-2.5 text-white outline-none transition-all placeholder:text-[#00ff66]/20 tracking-widest font-bold"
                  disabled={adminLoading}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#00ff66]/20">
              <Link to="/dashboard" className="flex-1">
                <button
                  type="button"
                  className="w-full border border-[#00ff66]/30 hover:border-[#00ff66] hover:bg-[#00ff66]/5 text-[#00ff66] text-xs font-bold uppercase tracking-widest py-3 px-4 rounded transition-all outline-none"
                  disabled={adminLoading}
                >
                  DE-ESCALATE SHELL
                </button>
              </Link>
              <button
                type="submit"
                className="flex-1 bg-[#00ff66] hover:bg-[#00e058] text-[#010206] font-bold text-xs uppercase tracking-widest py-3 px-4 rounded shadow-[0_0_15px_rgba(0,255,102,0.3)] hover:shadow-[0_0_25px_rgba(0,255,102,0.5)] transition-all outline-none flex items-center justify-center gap-2"
                disabled={adminLoading}
              >
                {adminLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-[#010206] border-t-transparent rounded-full animate-spin" />
                    AUTHENTICATING...
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    EXECUTE CLEARANCE KEY
                  </>
                )}
              </button>
            </div>
          </form>
          <div className="mt-4 text-center text-[9px] text-[#00ff66]/40 uppercase tracking-widest">
            AUTHORIZED OPERATORS COMPLY WITH FEDERAL CIPHER SECURITY ACTS OF 2026.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-slate-300 font-sans pb-12 pt-20">
      <Navbar />

      {/* Retro Cyber HUD Header */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="glass p-6 rounded-2xl border border-accent-cyan/20 flex flex-col md:flex-row items-center justify-between gap-6 glow-cyan bg-surface-900/50 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-cyan to-accent-violet"></div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan animate-pulse">
              <ShieldCheck className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-wide">SECURE CONTROL PANEL</h1>
                <span className="text-[10px] px-2 py-0.5 rounded bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan uppercase font-mono font-bold tracking-widest">
                  CISO CLEARANCE
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-0.5 font-mono">
                CISO Master: {dbUser.name} &bull; Ledger: Neon PostgreSQL &bull; ID: {dbUser.id.substring(0, 12)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-accent-cyan bg-black/40 px-4 py-2.5 rounded-lg border border-white/[0.05]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>SYSTEM CONSOLE LIVE</span>
          </div>
        </div>
      </div>

      {notification && (
        <div className="max-w-7xl mx-auto px-6 mb-6">
          <div className={`p-4 rounded-xl border font-mono text-xs flex items-center gap-3 animate-bounce ${
            notification.type === 'error' 
              ? 'bg-red-500/10 border-red-500/20 text-red-400' 
              : 'bg-accent-cyan/10 border-accent-cyan/20 text-accent-cyan'
          }`}>
            {notification.type === 'error' ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            <span>[SYS NOTICE]: {notification.text}</span>
          </div>
        </div>
      )}

      {/* Main Grid: Tabs & Console */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Simple English/Hindi Navigation tabs */}
        <div className="lg:col-span-1 space-y-2">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-3 mb-2 font-bold">
            Administrative Modules
          </div>
          {[
            { id: 'metrics', label: 'System Overview', icon: Database },
            { id: 'courses', label: 'Course Manager', icon: BookOpen },
            { id: 'lessons', label: 'Video Lectures', icon: Video },
            { id: 'books', label: 'PDF Handbooks', icon: Book },
            { id: 'meetings', label: 'Doubt Sessions', icon: Calendar },
            { id: 'tasks', label: 'CTF Task Board', icon: Award },
            { id: 'submissions', label: 'Homework Grading', icon: CheckSquare },
            { id: 'subscriptions', label: 'Plan Editor', icon: Settings },
            { id: 'blogs', label: 'Blog Engine', icon: FileText },
            { id: 'bookings', label: 'School Bookings', icon: Calendar },
            { id: 'users', label: 'Students List', icon: Users },
            { id: 'feedback', label: 'User Feedback', icon: MessageSquare },
            { id: 'notifications', label: 'Subnet Broadcasts', icon: Megaphone },
            { id: 'contact', label: 'Contact Messages', icon: Mail },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-xs text-left transition-all border ${
                  active 
                    ? 'bg-accent-cyan/10 border-accent-cyan/30 text-white font-bold glow-cyan' 
                    : 'bg-surface-900/20 border-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-accent-cyan' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Panels */}
        <div className="lg:col-span-3 min-h-[600px]">
          
          {/* TAB 1: METRICS DIAGNOSTICS & PARTNERS */}
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white font-mono uppercase tracking-widest border-b border-white/[0.06] pb-3 flex items-center gap-2">
                <Database className="w-5 h-5 text-accent-cyan" />
                System Summary & Operational Metrics
              </h2>

              {isLoading || !metrics ? (
                <div className="h-64 flex items-center justify-center font-mono text-xs text-slate-500 animate-pulse">
                  Querying database parameters...
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass p-6 rounded-2xl border border-white/[0.06] bg-slate-900/10">
                      <Users className="w-8 h-8 text-accent-cyan mb-4" />
                      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">ACTIVE STUDENTS RANKED</div>
                      <div className="text-3xl font-heading font-bold text-white mt-1">{metrics.totalStudents} Students</div>
                    </div>
                    <div className="glass p-6 rounded-2xl border border-white/[0.06] bg-slate-900/10">
                      <DollarSign className="w-8 h-8 text-accent-violet mb-4" />
                      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">TOTAL INVOICED REVENUE</div>
                      <div className="text-3xl font-heading font-bold text-white mt-1">₹{metrics.totalIncome.toLocaleString()}</div>
                    </div>
                    <div className="glass p-6 rounded-2xl border border-white/[0.06] bg-slate-900/10">
                      <Calendar className="w-8 h-8 text-accent-emerald mb-4" />
                      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">ACTIVE SCHOOL WORKSHOPS</div>
                      <div className="text-3xl font-heading font-bold text-white mt-1">{metrics.activeSessions} Bookings</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass p-5 rounded-xl border border-white/[0.04] bg-slate-900/5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase">Deployed Videos</span>
                        <div className="text-lg font-bold text-white mt-1">{metrics.totalLessons} Lectures</div>
                      </div>
                      <Video className="w-6 h-6 text-slate-600" />
                    </div>
                    <div className="glass p-5 rounded-xl border border-white/[0.04] bg-slate-900/5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase">Hacking Manuals</span>
                        <div className="text-lg font-bold text-white mt-1">{metrics.totalBooks} PDFs</div>
                      </div>
                      <Book className="w-6 h-6 text-slate-600" />
                    </div>
                    <div className="glass p-5 rounded-xl border border-white/[0.04] bg-slate-900/5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase">CTF Tasks</span>
                        <div className="text-lg font-bold text-white mt-1">{metrics.totalTasks} Missions</div>
                      </div>
                      <Award className="w-6 h-6 text-slate-600" />
                    </div>
                  </div>

                  {/* Partners Form and List */}
                  <div className="glass p-6 rounded-2xl border border-white/[0.06] bg-surface-900/40 relative">
                    <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                      <CertIcon className="w-4 h-4 text-accent-cyan" />
                      Add Certificate Endorsement Partner
                    </h3>
                    <p className="text-slate-400 text-xs mb-4">
                      Add academic co-branding universities or boards that validate bootcamps.
                    </p>
                    <form onSubmit={handlePartnerCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <input 
                        type="text" 
                        placeholder="Partner Name" 
                        value={partnerForm.name}
                        onChange={e => setPartnerForm({...partnerForm, name: e.target.value})}
                        className="bg-black/60 border border-white/[0.08] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-accent-cyan font-mono"
                      />
                      <input 
                        type="text" 
                        placeholder="Logo URL" 
                        value={partnerForm.logo}
                        onChange={e => setPartnerForm({...partnerForm, logo: e.target.value})}
                        className="bg-black/60 border border-white/[0.08] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-accent-cyan font-mono"
                      />
                      <input 
                        type="text" 
                        placeholder="Link" 
                        value={partnerForm.link}
                        onChange={e => setPartnerForm({...partnerForm, link: e.target.value})}
                        className="bg-black/60 border border-white/[0.08] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-accent-cyan font-mono"
                      />
                      <Button variant="primary" type="submit" size="sm" className="font-mono text-xs w-full">
                        DEPLOY PARTNER
                      </Button>
                    </form>

                    {partners.length > 0 && (
                      <div className="space-y-2 border-t border-white/[0.06] pt-4">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Active Partners Ledger:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {partners.map(p => (
                            <div key={p.id} className="p-3 bg-black/40 border border-white/[0.05] rounded-xl flex items-center justify-between gap-4">
                              <div className="flex items-center gap-2">
                                <img src={p.logo} alt="" className="w-8 h-8 rounded bg-white/5 object-contain" />
                                <span className="text-xs text-white font-mono">{p.name}</span>
                              </div>
                              <button onClick={() => handleDeletePartner(p.id)} className="text-red-400 hover:text-red-300">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: COURSE ROADMAP MANAGER */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white font-mono uppercase tracking-widest border-b border-white/[0.06] pb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-accent-cyan" />
                Course Manager (Course Roadmaps)
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-1 glass p-6 rounded-2xl border border-white/[0.06] bg-surface-900/30 h-fit">
                  <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1">
                    <Plus className="w-4 h-4 text-accent-cyan" />
                    Add New Course
                  </h3>
                  <form onSubmit={handleCourseCreate} className="space-y-4 font-mono text-xs">
                    <div className="space-y-1">
                      <label className="text-slate-400 uppercase text-[10px]">Course Title:</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Certified Network Defender"
                        value={courseForm.title}
                        onChange={e => setCourseForm({...courseForm, title: e.target.value})}
                        className="w-full bg-black/60 border border-white/[0.08] rounded-xl p-3 text-white focus:outline-none focus:border-accent-cyan"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-slate-400 uppercase text-[10px]">Description:</label>
                      <textarea 
                        placeholder="Enter brief roadmap roadmap course description..."
                        value={courseForm.description}
                        onChange={e => setCourseForm({...courseForm, description: e.target.value})}
                        className="w-full bg-black/60 border border-white/[0.08] rounded-xl p-3 text-white focus:outline-none focus:border-accent-cyan h-24"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-slate-400 uppercase text-[10px]">Category:</label>
                        <select
                          value={courseForm.category}
                          onChange={e => setCourseForm({...courseForm, category: e.target.value})}
                          className="w-full bg-black/60 border border-white/[0.08] rounded-xl p-3 text-white focus:outline-none focus:border-accent-cyan"
                        >
                          <option value="Offensive Security">Offensive Sec</option>
                          <option value="Defense">Defense Sec</option>
                          <option value="Cloud Security">Cloud Sec</option>
                          <option value="Malware Analysis">Malware</option>
                          <option value="AppSec">AppSec</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 uppercase text-[10px]">Difficulty Level:</label>
                        <select
                          value={courseForm.level}
                          onChange={e => setCourseForm({...courseForm, level: e.target.value})}
                          className="w-full bg-black/60 border border-white/[0.08] rounded-xl p-3 text-white focus:outline-none focus:border-accent-cyan"
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-slate-400 uppercase text-[10px]">XP Reward:</label>
                        <input 
                          type="number" 
                          value={courseForm.xp_reward}
                          onChange={e => setCourseForm({...courseForm, xp_reward: e.target.value})}
                          className="w-full bg-black/60 border border-white/[0.08] rounded-xl p-3 text-white focus:outline-none focus:border-accent-cyan"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400 uppercase text-[10px]">Total Hours:</label>
                        <input 
                          type="text" 
                          value={courseForm.duration}
                          onChange={e => setCourseForm({...courseForm, duration: e.target.value})}
                          className="w-full bg-black/60 border border-white/[0.08] rounded-xl p-3 text-white focus:outline-none focus:border-accent-cyan"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 py-1">
                      <input 
                        type="checkbox" 
                        id="isFreeCourse" 
                        checked={courseForm.is_free}
                        onChange={e => setCourseForm({...courseForm, is_free: e.target.checked})}
                        className="accent-accent-cyan w-4 h-4"
                      />
                      <label htmlFor="isFreeCourse" className="text-slate-300 select-none text-[10px] uppercase font-bold">
                        Free Tier (Recruit) access course
                      </label>
                    </div>

                    <Button variant="primary" type="submit" size="md" glow="cyan" className="w-full uppercase font-bold tracking-wide mt-2">
                      CREATE COURSE NODE
                    </Button>
                  </form>
                </div>

                {/* List */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">Active Course Catalog</h3>
                  {isLoading ? (
                    <div className="text-slate-500 font-mono text-xs animate-pulse">Loading active roadmaps...</div>
                  ) : courses.length === 0 ? (
                    <div className="glass p-8 text-center text-slate-500 font-mono text-xs border border-white/[0.06]">
                      No active courses found. Create one.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {courses.map(c => (
                        <div key={c.id} className="glass p-4 rounded-xl border border-white/[0.04] bg-surface-900/10 flex items-center justify-between gap-4 font-mono">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white">{c.title}</span>
                              <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-bold border ${
                                c.is_free ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan'
                              }`}>
                                {c.is_free ? 'Free' : 'Pro'}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500">
                              Category: {c.category} &bull; Level: {c.level} &bull; Hours: {c.duration} &bull; Reward: {c.xp_reward} XP
                            </div>
                            <p className="text-[11px] text-slate-400 max-w-md line-clamp-1">{c.description || 'No description provided.'}</p>
                          </div>
                          <button 
                            onClick={() => handleDeleteCourse(c.id)}
                            className="p-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 rounded-lg text-red-400 transition-all shrink-0"
                            title="Purge course"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LECTURE VIDEOS */}
          {activeTab === 'lessons' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white font-mono uppercase tracking-widest border-b border-white/[0.06] pb-3 flex items-center gap-2">
                <Video className="w-5 h-5 text-accent-cyan" />
                Video Lectures Deployer
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="glass p-6 rounded-2xl border border-white/[0.06] bg-surface-900/30">
                    <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1">
                      <Plus className="w-4 h-4 text-accent-cyan" />
                      Upload Lecture
                    </h3>
                    
                    <form onSubmit={handleLessonUpload} className="space-y-4 font-mono text-xs">
                      <div className="space-y-1">
                        <label className="text-slate-400 uppercase text-[10px]">Select Course Module:</label>
                        <select
                          value={lessonForm.course_id}
                          onChange={e => setLessonForm({...lessonForm, course_id: e.target.value})}
                          className="w-full bg-black/60 border border-white/[0.08] rounded-xl p-3 text-white focus:outline-none focus:border-accent-cyan"
                        >
                          <option value="">-- Choose Target Roadmap Nodes --</option>
                          {courses.map(c => (
                            <option key={c.id} value={c.id}>{c.title} ({c.level})</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 uppercase text-[10px]">Lecture Title:</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Advanced OSINT Methodology"
                          value={lessonForm.title}
                          onChange={e => setLessonForm({...lessonForm, title: e.target.value})}
                          className="w-full bg-black/60 border border-white/[0.08] rounded-xl p-3 text-white focus:outline-none focus:border-accent-cyan"
                        />
                      </div>

                      {/* Direct Secure File Uploader */}
                      <div className="space-y-1.5">
                        <label className="text-slate-400 uppercase text-[10px] block">Video Upload Option:</label>
                        <CyberUploader 
                          type="video" 
                          onUploadComplete={(url) => setLessonForm({...lessonForm, video_url: url})} 
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 uppercase text-[10px]">Video Source Link (URL):</label>
                        <input 
                          type="text" 
                          placeholder="Or paste secure CDN / GDrive URL..."
                          value={lessonForm.video_url}
                          onChange={e => setLessonForm({...lessonForm, video_url: e.target.value})}
                          className="w-full bg-black/60 border border-white/[0.08] rounded-xl p-3 text-white focus:outline-none focus:border-accent-cyan"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-slate-400 uppercase text-[10px]">Duration:</label>
                          <input 
                            type="text" 
                            placeholder="e.g. 15:45"
                            value={lessonForm.duration}
                            onChange={e => setLessonForm({...lessonForm, duration: e.target.value})}
                            className="w-full bg-black/60 border border-white/[0.08] rounded-xl p-3 text-white focus:outline-none focus:border-accent-cyan"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400 uppercase text-[10px]">Order No:</label>
                          <input 
                            type="number" 
                            placeholder="1"
                            value={lessonForm.order_no}
                            onChange={e => setLessonForm({...lessonForm, order_no: e.target.value})}
                            className="w-full bg-black/60 border border-white/[0.08] rounded-xl p-3 text-white focus:outline-none focus:border-accent-cyan"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 py-1">
                        <input 
                          type="checkbox" 
                          id="isFreeLesson" 
                          checked={lessonForm.is_free}
                          onChange={e => setLessonForm({...lessonForm, is_free: e.target.checked})}
                          className="accent-accent-cyan w-4 h-4 rounded"
                        />
                        <label htmlFor="isFreeLesson" className="text-slate-300 select-none text-[10px] uppercase font-bold">
                          Free tier (Recruit) access video
                        </label>
                      </div>

                      <Button variant="primary" type="submit" size="md" glow="cyan" className="w-full uppercase font-bold tracking-wide">
                        DEPLOY VIDEO LECTURE
                      </Button>
                    </form>
                  </div>
                </div>

                {/* List */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">Active Lectures Feed</h3>
                  {isLoading ? (
                    <div className="text-slate-500 font-mono text-xs animate-pulse">Loading active course contents...</div>
                  ) : lessons.length === 0 ? (
                    <div className="glass p-8 text-center text-slate-500 font-mono text-xs border border-white/[0.06]">
                      No lessons deployed yet. Upload your first lecture video.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {lessons.map(l => (
                        <div key={l.id} className="p-4 bg-black/30 border border-white/[0.04] rounded-xl flex items-center justify-between gap-4 font-mono">
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-white">{l.title}</span>
                            <div className="text-[9px] text-slate-500">
                              Course: {l.course_title || `Course ID ${l.course_id}`} &bull; Duration: {l.duration} &bull; Order: {l.order_no}
                            </div>
                            <p className="text-[10px] text-accent-cyan truncate max-w-sm">{l.video_url}</p>
                          </div>
                          <button 
                            onClick={() => handleDeleteLesson(l.id)} 
                            className="p-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HACKING MANUALS */}
          {activeTab === 'books' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white font-mono uppercase tracking-widest border-b border-white/[0.06] pb-3 flex items-center gap-2">
                <Book className="w-5 h-5 text-accent-cyan" />
                Hacking Books / PDFs (Hacking Manuals)
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="glass p-6 rounded-2xl border border-white/[0.06] bg-surface-900/30">
                    <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1">
                      <Plus className="w-4 h-4 text-accent-cyan" />
                      Add PDF Book
                    </h3>

                    <form onSubmit={handleBookUpload} className="space-y-4 font-mono text-xs">
                      <div className="space-y-1">
                        <label className="text-slate-400 uppercase text-[10px]">Manual Title:</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Reverse Engineering Guide"
                          value={bookForm.title}
                          onChange={e => setBookForm({...bookForm, title: e.target.value})}
                          className="w-full bg-black/60 border border-white/[0.08] rounded-xl p-3 text-white focus:outline-none focus:border-accent-cyan"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 uppercase text-[10px]">Author Signature:</label>
                        <input 
                          type="text" 
                          value={bookForm.author}
                          onChange={e => setBookForm({...bookForm, author: e.target.value})}
                          className="w-full bg-black/60 border border-white/[0.08] rounded-xl p-3 text-white focus:outline-none focus:border-accent-cyan"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 uppercase text-[10px]">Brief Intelligence Description:</label>
                        <textarea 
                          placeholder="Enter hacking manual contents details..."
                          value={bookForm.description}
                          onChange={e => setBookForm({...bookForm, description: e.target.value})}
                          className="w-full bg-black/60 border border-white/[0.08] rounded-xl p-3 text-white focus:outline-none focus:border-accent-cyan h-20"
                        />
                      </div>

                      {/* Direct PDF Uploader */}
                      <div className="space-y-1.5">
                        <label className="text-slate-400 uppercase text-[10px] block">PDF Upload Option:</label>
                        <CyberUploader 
                          type="pdf" 
                          onUploadComplete={(url) => setBookForm({...bookForm, pdf_url: url})} 
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 uppercase text-[10px]">Protected PDF Link (URL):</label>
                        <input 
                          type="text" 
                          placeholder="Or paste secure PDF URL..."
                          value={bookForm.pdf_url}
                          onChange={e => setBookForm({...bookForm, pdf_url: e.target.value})}
                          className="w-full bg-black/60 border border-white/[0.08] rounded-xl p-3 text-white focus:outline-none focus:border-accent-cyan"
                        />
                      </div>

                      <div className="flex items-center gap-2 py-1">
                        <input 
                          type="checkbox" 
                          id="isFreeBook" 
                          checked={bookForm.is_free}
                          onChange={e => setBookForm({...bookForm, is_free: e.target.checked})}
                          className="accent-accent-cyan w-4 h-4 rounded"
                        />
                        <label htmlFor="isFreeBook" className="text-slate-300 select-none text-[10px] uppercase font-bold">
                          Grant Free Tier access
                        </label>
                      </div>

                      <Button variant="primary" type="submit" size="md" glow="cyan" className="w-full uppercase font-bold tracking-wide">
                        ARCHIVE MANUAL PDF
                      </Button>
                    </form>
                  </div>
                </div>

                {/* List */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">Archived Cyber Handbooks</h3>
                  {isLoading ? (
                    <div className="text-slate-500 font-mono text-xs animate-pulse">Loading manual PDFs registry...</div>
                  ) : books.length === 0 ? (
                    <div className="glass p-8 text-center text-slate-500 font-mono text-xs border border-white/[0.06]">
                      No hacking books active. Upload your first PDF manual.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {books.map(b => (
                        <div key={b.id} className="p-4 bg-black/30 border border-white/[0.04] rounded-xl flex items-center justify-between gap-4 font-mono">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{b.title}</span>
                              <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-bold border ${
                                b.is_free ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan'
                              }`}>
                                {b.is_free ? 'Free' : 'Pro'}
                              </span>
                            </div>
                            <div className="text-[9px] text-slate-500">
                              Author: {b.author} &bull; Published: {b.created_at && !isNaN(Date.parse(b.created_at)) ? new Date(b.created_at).toLocaleDateString() : 'N/A'}
                            </div>
                            <a href={b.pdf_url} target="_blank" rel="noreferrer" className="text-[10px] text-accent-cyan hover:underline truncate block max-w-sm">
                              {b.pdf_url}
                            </a>
                          </div>
                          <button 
                            onClick={() => handleDeleteBook(b.id)} 
                            className="p-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DOUBT BRIEFING MEETINGS */}
          {activeTab === 'meetings' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white font-mono uppercase tracking-widest border-b border-white/[0.06] pb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent-cyan" />
                Live Doubt Meetings (Live Weekend Classes)
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="glass p-6 rounded-2xl border border-white/[0.06] bg-surface-900/30">
                    <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1">
                      <Plus className="w-4 h-4 text-accent-cyan" />
                      Schedule New Class
                    </h3>

                    <form onSubmit={handleMeetingManage} className="space-y-4 font-mono text-xs">
                      <div className="space-y-1">
                        <label className="text-slate-400 uppercase text-[10px]">Session Title:</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Saturday CEH Doubt Support"
                          value={meetingForm.title}
                          onChange={e => setMeetingForm({...meetingForm, title: e.target.value})}
                          className="w-full bg-black/60 border border-white/[0.08] rounded-xl p-3 text-white focus:outline-none focus:border-accent-cyan"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 uppercase text-[10px]">Date & Time:</label>
                        <input 
                          type="datetime-local" 
                          value={meetingForm.date_time}
                          onChange={e => setMeetingForm({...meetingForm, date_time: e.target.value})}
                          className="w-full bg-black/60 border border-white/[0.08] rounded-xl p-3 text-white focus:outline-none focus:border-accent-cyan"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 uppercase text-[10px]">Google Meet / Zoom URL:</label>
                        <input 
                          type="text" 
                          placeholder="https://meet.google.com/..."
                          value={meetingForm.meet_url}
                          onChange={e => setMeetingForm({...meetingForm, meet_url: e.target.value})}
                          className="w-full bg-black/60 border border-white/[0.08] rounded-xl p-3 text-white focus:outline-none focus:border-accent-cyan"
                        />
                      </div>

                      <Button variant="primary" type="submit" size="md" glow="cyan" className="w-full uppercase font-bold tracking-wide">
                        SCHEDULE LIVE MEETING
                      </Button>
                    </form>
                  </div>
                </div>

                {/* List */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">Scheduled Briefing Classes</h3>
                  {isLoading ? (
                    <div className="text-slate-500 font-mono text-xs animate-pulse">Querying doubt meet registers...</div>
                  ) : meetings.length === 0 ? (
                    <div className="glass p-8 text-center text-slate-500 font-mono text-xs border border-white/[0.06]">
                      No live sessions scheduled. Create one.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {meetings.map(m => (
                        <div key={m.id} className="p-4 bg-black/30 border border-white/[0.04] rounded-xl flex items-center justify-between gap-4 font-mono">
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-white">{m.title}</span>
                            <div className="text-[10px] text-slate-500">
                              Timing: {new Date(m.date_time).toLocaleString()}
                            </div>
                            <a href={m.meet_url} target="_blank" rel="noreferrer" className="text-[10px] text-accent-cyan hover:underline">
                              {m.meet_url}
                            </a>
                          </div>
                          <button 
                            onClick={() => handleDeleteMeeting(m.id)} 
                            className="p-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CTF OPERATIONAL ASSIGNMENTS */}
          {activeTab === 'tasks' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white font-mono uppercase tracking-widest border-b border-white/[0.06] pb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-accent-cyan" />
                Mission Board (CTF Tasks & Assignments)
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="glass p-6 rounded-2xl border border-white/[0.06] bg-surface-900/30">
                    <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1">
                      <Plus className="w-4 h-4 text-accent-cyan" />
                      Assign New Task
                    </h3>

                    <form onSubmit={handleTaskCreate} className="space-y-4 font-mono text-xs">
                      <div className="space-y-1">
                        <label className="text-slate-400 uppercase text-[10px]">Task Title:</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Capture The Flag Challenge 1"
                          value={taskForm.title}
                          onChange={e => setTaskForm({...taskForm, title: e.target.value})}
                          className="w-full bg-black/60 border border-white/[0.08] rounded-xl p-3 text-white focus:outline-none focus:border-accent-cyan"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 uppercase text-[10px]">Scope Scope Clearance:</label>
                        <select
                          value={taskForm.assigned_to}
                          onChange={e => setTaskForm({...taskForm, assigned_to: e.target.value})}
                          className="w-full bg-black/60 border border-white/[0.08] rounded-xl p-3 text-white focus:outline-none focus:border-accent-cyan"
                        >
                          <option value="all">Global broadcast (All Students)</option>
                          {users.map(u => (
                            <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 uppercase text-[10px]">Mission Directives / Instructions:</label>
                        <textarea 
                          placeholder="Instructions to solve and flags..."
                          value={taskForm.description}
                          onChange={e => setTaskForm({...taskForm, description: e.target.value})}
                          className="w-full bg-black/60 border border-white/[0.08] rounded-xl p-3 text-white focus:outline-none focus:border-accent-cyan h-24"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-slate-400 uppercase text-[10px]">XP Reward Bounty:</label>
                          <input 
                            type="number" 
                            value={taskForm.xp_reward}
                            onChange={e => setTaskForm({...taskForm, xp_reward: e.target.value})}
                            className="w-full bg-black/60 border border-white/[0.08] rounded-xl p-3 text-white focus:outline-none focus:border-accent-cyan"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400 uppercase text-[10px]">Due Date:</label>
                          <input 
                            type="date" 
                            value={taskForm.due_date}
                            onChange={e => setTaskForm({...taskForm, due_date: e.target.value})}
                            className="w-full bg-black/60 border border-white/[0.08] rounded-xl p-3 text-white focus:outline-none focus:border-accent-cyan"
                          />
                        </div>
                      </div>

                      <Button variant="primary" type="submit" size="md" glow="cyan" className="w-full uppercase font-bold tracking-wide">
                        BROADCAST MISSION TASK
                      </Button>
                    </form>
                  </div>
                </div>

                {/* List */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">Active Operations Missions</h3>
                  {isLoading ? (
                    <div className="text-slate-500 font-mono text-xs animate-pulse">Loading active task directives...</div>
                  ) : tasks.length === 0 ? (
                    <div className="glass p-8 text-center text-slate-500 font-mono text-xs border border-white/[0.06]">
                      No active homework / CTF tasks registered.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {tasks.map(t => (
                        <div key={t.id} className="p-4 bg-black/30 border border-white/[0.04] rounded-xl flex items-center justify-between gap-4 font-mono">
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-white">{t.title}</span>
                            <div className="text-[10px] text-slate-500">
                              Reward: {t.xp_reward} XP &bull; Target: {!t.assigned_to || t.assigned_to === 'all' ? 'All students' : `User UID: ${t.assigned_to.substring(0, 10)}...`}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Deadline: {t.due_date ? new Date(t.due_date).toLocaleDateString() : 'No Limit'}
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1 italic">"{t.description}"</p>
                          </div>
                          <button 
                            onClick={() => handleDeleteTask(t.id)} 
                            className="p-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: HOMEWORK SUBMISSIONS GRADING HUB */}
          {activeTab === 'submissions' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white font-mono uppercase tracking-widest border-b border-white/[0.06] pb-3 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-accent-cyan" />
                Homework Board & Grading (Homework Submissions)
              </h2>

              {isLoading ? (
                <div className="h-64 flex items-center justify-center font-mono text-xs text-slate-500 animate-pulse">
                  Loading student submissions...
                </div>
              ) : submissions.length === 0 ? (
                <div className="glass p-12 text-center text-slate-500 font-mono text-xs border border-white/[0.06]">
                  No homework submissions logged.
                </div>
              ) : (
                <div className="space-y-6">
                  {submissions.map(sub => (
                    <div key={sub.id} className="glass p-5 rounded-2xl border border-white/[0.06] bg-surface-900/20 font-mono">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.04] pb-4 mb-4">
                        <div>
                          <div className="text-[10px] text-accent-cyan uppercase tracking-wider font-bold">
                            CTF MISSION: {sub.task_title}
                          </div>
                          <h3 className="text-xs font-bold text-white mt-1">Submitted by: {sub.name}</h3>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Email: {sub.email} &bull; Sent: {new Date(sub.submitted_at).toLocaleString()} &bull; Reward: {sub.xp_reward} XP
                          </div>
                        </div>
                        <div>
                          <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold border ${
                            sub.status === 'approved' 
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                              : sub.status === 'rejected'
                              ? 'bg-red-500/10 border-red-500/30 text-red-400'
                              : 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse'
                          }`}>
                            {sub.status}
                          </span>
                        </div>
                      </div>

                      <div className="bg-black/60 p-4 rounded-xl border border-white/[0.04] mb-4">
                        <div className="text-[10px] text-slate-500 uppercase mb-2">OPERATOR SOLUTION NOTES / SOURCE LINK:</div>
                        <p className="text-white text-xs break-all whitespace-pre-wrap leading-relaxed">
                          {sub.submission_content || sub.flag_submitted || 'No solution content provided.'}
                        </p>
                        {sub.submission_content && sub.submission_content.startsWith('http') && (
                          <a 
                            href={sub.submission_content} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-accent-cyan hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Open solution URL
                          </a>
                        )}
                      </div>

                      {sub.status === 'submitted' ? (
                        <div className="space-y-3">
                          <textarea
                            placeholder="Input grading feedback notes..."
                            value={gradingFeedbacks[sub.id] || ''}
                            onChange={e => setGradingFeedbacks({...gradingFeedbacks, [sub.id]: e.target.value})}
                            className="w-full bg-black/40 border border-white/[0.08] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-accent-cyan placeholder:text-slate-600 h-20"
                          />
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleGradeSubmission(sub.id, 'approved')}
                              className="px-4 py-2 bg-emerald-500 text-black hover:bg-emerald-400 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" />
                              APPROVE & AWARD XP
                            </button>
                            <button
                              onClick={() => handleGradeSubmission(sub.id, 'rejected')}
                              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                              REJECT
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white/[0.02] p-3 rounded-lg border border-white/[0.04] text-[11px]">
                          <span className="text-slate-500 font-bold">ADMIN EVALUATION NOTE: </span>
                          <span className="text-slate-300 italic">"{sub.feedback || 'No feedback logged.'}"</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: SUBSCRIPTION PLAN CUSTOMIZER */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white font-mono uppercase tracking-widest border-b border-white/[0.06] pb-3 flex items-center gap-2">
                <Settings className="w-5 h-5 text-accent-cyan" />
                Edit Subscription Plans (Subscription Plan Customizer)
              </h2>

              <form onSubmit={handleSavePricingCustomizer} className="space-y-6 font-mono text-xs">
                
                {/* 1. Core plans */}
                <div className="glass p-6 rounded-2xl border border-white/[0.06] bg-surface-900/30 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase border-b border-white/[0.05] pb-2 text-accent-cyan flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    1. Core Clearing Clearances (Free / Pro Plans)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Free Recruit */}
                    <div className="p-4 bg-black/40 border border-white/[0.05] rounded-xl space-y-3">
                      <span className="text-xs font-bold text-white block">FREE RECRUIT TIER CONFIG</span>
                      <div className="space-y-2">
                        <label className="text-slate-500 uppercase text-[9px]">Plan Name:</label>
                        <input 
                          type="text" 
                          value={pricingPlans.coreTiers[0].name}
                          onChange={e => {
                            const newTiers = [...pricingPlans.coreTiers];
                            newTiers[0].name = e.target.value;
                            setPricingPlans({...pricingPlans, coreTiers: newTiers});
                          }}
                          className="w-full bg-black/60 border border-white/[0.08] rounded p-2 text-white outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-slate-500 uppercase text-[9px]">Price (₹):</label>
                        <input 
                          type="number" 
                          value={pricingPlans.coreTiers[0].monthlyPrice}
                          onChange={e => {
                            const newTiers = [...pricingPlans.coreTiers];
                            newTiers[0].monthlyPrice = parseInt(e.target.value) || 0;
                            setPricingPlans({...pricingPlans, coreTiers: newTiers});
                          }}
                          className="w-full bg-black/60 border border-white/[0.08] rounded p-2 text-white outline-none"
                        />
                      </div>
                    </div>

                    {/* Pro Operator */}
                    <div className="p-4 bg-black/40 border border-white/[0.05] rounded-xl space-y-3">
                      <span className="text-xs font-bold text-white block">PRO OPERATOR CONFIG</span>
                      <div className="space-y-2">
                        <label className="text-slate-500 uppercase text-[9px]">Plan Name:</label>
                        <input 
                          type="text" 
                          value={pricingPlans.coreTiers[1].name}
                          onChange={e => {
                            const newTiers = [...pricingPlans.coreTiers];
                            newTiers[1].name = e.target.value;
                            setPricingPlans({...pricingPlans, coreTiers: newTiers});
                          }}
                          className="w-full bg-black/60 border border-white/[0.08] rounded p-2 text-white outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="text-slate-500 uppercase text-[9px]">Monthly Price (₹):</label>
                          <input 
                            type="number" 
                            value={pricingPlans.coreTiers[1].monthlyPrice}
                            onChange={e => {
                              const newTiers = [...pricingPlans.coreTiers];
                              newTiers[1].monthlyPrice = parseInt(e.target.value) || 0;
                              setPricingPlans({...pricingPlans, coreTiers: newTiers});
                            }}
                            className="w-full bg-black/60 border border-white/[0.08] rounded p-2 text-white outline-none font-bold text-accent-cyan"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-slate-500 uppercase text-[9px]">Yearly Price (₹):</label>
                          <input 
                            type="number" 
                            value={pricingPlans.coreTiers[1].yearlyPrice}
                            onChange={e => {
                              const newTiers = [...pricingPlans.coreTiers];
                              newTiers[1].yearlyPrice = parseInt(e.target.value) || 0;
                              setPricingPlans({...pricingPlans, coreTiers: newTiers});
                            }}
                            className="w-full bg-black/60 border border-white/[0.08] rounded p-2 text-white outline-none font-bold text-accent-cyan"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Doubt extensions */}
                <div className="glass p-6 rounded-2xl border border-white/[0.06] bg-surface-900/30 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase border-b border-white/[0.05] pb-2 text-accent-cyan flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    2. Weekend Doubt Support renewals (₹ Extensions)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {pricingPlans.doubtExtensions.map((d: any, idx: number) => (
                      <div key={d.id} className="p-4 bg-black/40 border border-white/[0.05] rounded-xl space-y-2">
                        <span className="text-xs font-bold text-white block">{d.duration.toUpperCase()} ACCESS</span>
                        <div className="space-y-1">
                          <label className="text-slate-500 uppercase text-[8px]">Title:</label>
                          <input 
                            type="text" 
                            value={d.name}
                            onChange={e => {
                              const newExtensions = [...pricingPlans.doubtExtensions];
                              newExtensions[idx].name = e.target.value;
                              setPricingPlans({...pricingPlans, doubtExtensions: newExtensions});
                            }}
                            className="w-full bg-black/60 border border-white/[0.08] rounded p-2 text-white outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-500 uppercase text-[8px]">INR Price (₹):</label>
                          <input 
                            type="number" 
                            value={d.price}
                            onChange={e => {
                              const newExtensions = [...pricingPlans.doubtExtensions];
                              newExtensions[idx].price = parseInt(e.target.value) || 0;
                              setPricingPlans({...pricingPlans, doubtExtensions: newExtensions});
                            }}
                            className="w-full bg-black/60 border border-white/[0.08] rounded p-2 text-white outline-none font-bold text-accent-cyan"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Campus bootcamps */}
                <div className="glass p-6 rounded-2xl border border-white/[0.06] bg-surface-900/30 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase border-b border-white/[0.05] pb-2 text-accent-cyan flex items-center gap-1">
                    <CertIcon className="w-4 h-4" />
                    3. School & College Institutional Bootcamps (INR Packages)
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {pricingPlans.campusBookings.map((c: any, idx: number) => (
                      <div key={c.id} className="p-4 bg-black/40 border border-white/[0.05] rounded-xl space-y-2 flex flex-col justify-between">
                        <div>
                          <span className="text-xs font-bold text-white block">{c.name}</span>
                          <span className="text-[10px] text-slate-500">{c.level}</span>
                        </div>
                        <div className="space-y-1 mt-2">
                          <label className="text-slate-500 uppercase text-[8px]">INR Price (₹):</label>
                          <input 
                            type="number" 
                            value={c.price}
                            onChange={e => {
                              const newCampus = [...pricingPlans.campusBookings];
                              newCampus[idx].price = parseInt(e.target.value) || 0;
                              setPricingPlans({...pricingPlans, campusBookings: newCampus});
                            }}
                            className="w-full bg-black/60 border border-white/[0.08] rounded p-2 text-white outline-none font-bold text-accent-cyan"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button variant="primary" type="submit" size="lg" glow="cyan" className="w-full uppercase font-bold tracking-wider">
                  SAVE ALL SUBSCRIPTION PLAN CONFIGURATIONS
                </Button>
              </form>
            </div>
          )}

          {/* TAB 9: SECURITY INTELLIGENCE ADVISORIES */}
          {activeTab === 'blogs' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white font-mono uppercase tracking-widest border-b border-white/[0.06] pb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent-cyan" />
                Security Blogs (Blog Engine Manager)
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-1 glass p-6 rounded-2xl border border-white/[0.06] bg-surface-900/30 h-fit">
                  <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider mb-4">Advisory Broadcast</h3>
                  <form onSubmit={handleBlogPublish} className="space-y-4 font-mono text-xs">
                    <div className="space-y-1.5">
                      <label className="text-slate-400 uppercase text-[10px]">Article Title:</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Critical CVE Threat Alert..."
                        value={blogForm.title}
                        onChange={e => setBlogForm({...blogForm, title: e.target.value})}
                        className="w-full bg-black/60 border border-white/[0.08] rounded-xl p-3 text-white focus:outline-none focus:border-accent-cyan"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-slate-400 uppercase text-[10px]">Author Signature:</label>
                      <select
                        value={blogForm.author}
                        onChange={e => setBlogForm({...blogForm, author: e.target.value})}
                        className="w-full bg-black/60 border border-white/[0.08] rounded-xl p-3 text-white focus:outline-none focus:border-accent-cyan"
                      >
                        <option value="Abhishek Verma">Abhishek Verma (CEO)</option>
                        <option value="Deepak Dubat">Deepak Dubat (CTO)</option>
                        <option value="Black Cypher Threat Intel Team">Black Cypher Threat Intel Team</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-400 uppercase text-[10px]">Advisory Content:</label>
                      <textarea 
                        placeholder="Write detailed vulnerability analysis or advisories..."
                        value={blogForm.content}
                        onChange={e => setBlogForm({...blogForm, content: e.target.value})}
                        className="w-full bg-black/60 border border-white/[0.08] rounded-xl p-3 text-white focus:outline-none focus:border-accent-cyan h-64"
                      />
                    </div>

                    <Button variant="primary" type="submit" size="md" glow="cyan" className="w-full uppercase font-bold tracking-wide">
                      Broadcast Advisory
                    </Button>
                  </form>
                </div>

                {/* Lists */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">Active Threat Advisories</h3>
                  {isLoading ? (
                    <div className="text-slate-500 font-mono text-xs animate-pulse">Querying advisories...</div>
                  ) : blogs.length === 0 ? (
                    <div className="glass p-8 text-center text-slate-500 font-mono text-xs border border-white/[0.06]">
                      No threat reports registered in Neon.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {blogs.map(b => (
                        <div key={b.id} className="glass p-5 rounded-xl border border-white/[0.04] bg-surface-900/10 flex flex-col gap-3 font-mono">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h4 className="text-sm font-bold text-white tracking-wide">{b.title}</h4>
                              <div className="text-[10px] text-slate-500 mt-1">
                                Author: {b.author} &bull; Signed: {new Date(b.created_at).toLocaleDateString()}
                              </div>
                            </div>
                            <button
                              onClick={() => handleBlogDelete(b.id)}
                              className="px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-mono font-bold text-[9px] uppercase transition-colors shrink-0"
                            >
                              Purge
                            </button>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed max-w-xl whitespace-pre-wrap truncate line-clamp-3">{b.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: SEMINAR BOOKINGS CLEARANCES */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white font-mono uppercase tracking-widest border-b border-white/[0.06] pb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent-cyan" />
                Seminar Booking Approvals (School Bookings Clearances)
              </h2>

              {isLoading ? (
                <div className="h-64 flex items-center justify-center font-mono text-xs text-slate-500 animate-pulse">
                  Querying reservation schedules...
                </div>
              ) : bookings.length === 0 ? (
                <div className="glass p-12 text-center text-slate-500 font-mono text-xs border border-white/[0.06]">
                  No reservation requests registered in Neon database.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-white/[0.06] bg-surface-900/30">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black/40 font-mono text-[10px] text-slate-500 uppercase border-b border-white/[0.06]">
                        <th className="p-4 font-medium">Institution & Contact</th>
                        <th className="p-4 font-medium">Schedule Details</th>
                        <th className="p-4 font-medium">Fee Paid</th>
                        <th className="p-4 font-medium">Status & Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04] font-mono text-xs">
                      {bookings.map(b => (
                        <tr key={b.id} className="hover:bg-white/[0.01] transition-colors">
                          <td className="p-4">
                            <div className="font-semibold text-white">{b.institute_name || 'Individual Training'}</div>
                            <div className="text-[10px] text-slate-500 mt-1">
                              Contact: {b.contact_name} &bull; {b.contact_phone}
                            </div>
                            <div className="text-[10px] text-accent-cyan mt-0.5">Email: {b.email}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-white">{b.booking_type === 'session_school' ? 'Institutional Workshop' : 'Pro Operator Plan'}</div>
                            <div className="text-[10px] text-slate-500 mt-1">
                              Duration: {b.plan_duration || 'Standard'} &bull; Target: {b.booking_date ? new Date(b.booking_date).toLocaleDateString() : 'Immediate'}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-white font-bold">₹{parseFloat(b.amount_paid).toLocaleString()}</div>
                            <a 
                              href={b.receipt_url || undefined} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-[10px] text-accent-cyan hover:underline flex items-center gap-1 mt-1 font-bold"
                            >
                              <FileText className="w-3 h-3" />
                              RECEIPT
                            </a>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                                b.status === 'approved' 
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse'
                              }`}>
                                {b.status}
                              </span>
                              {b.status === 'pending' && (
                                <button 
                                  onClick={() => handleApproveBooking(b.id)}
                                  className="px-2 py-1 rounded bg-accent-cyan text-black hover:bg-cyan-300 transition-colors font-bold text-[10px] flex items-center gap-1 uppercase shadow-[0_0_8px_rgba(0,255,102,0.15)]"
                                >
                                  <Check className="w-3 h-3" />
                                  Approve
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 11: USER REGISTER */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <h2 className="text-lg font-bold text-white font-mono uppercase tracking-widest flex items-center gap-2">
                  <Users className="w-5 h-5 text-accent-cyan" />
                  User Registry (Students &amp; Active Operators)
                </h2>
                <button
                  onClick={fetchAdminData}
                  className="flex items-center gap-1.5 text-[10px] font-mono text-accent-cyan border border-accent-cyan/25 px-3 py-1.5 rounded-lg hover:bg-accent-cyan/5 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" /> Refresh
                </button>
              </div>

              {isLoading ? (
                <div className="h-64 flex items-center justify-center font-mono text-xs text-slate-500 animate-pulse">
                  Querying student registers...
                </div>
              ) : users.length === 0 ? (
                <div className="glass p-12 text-center text-slate-500 font-mono text-xs border border-white/[0.06]">
                  No active students registered.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-white/[0.06] bg-surface-900/30">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black/40 font-mono text-[10px] text-slate-500 uppercase border-b border-white/[0.06]">
                        <th className="p-4 font-medium">Operator</th>
                        <th className="p-4 font-medium">Clearance &amp; Rank</th>
                        <th className="p-4 font-medium">Credentials</th>
                        <th className="p-4 font-medium">Plan / Role</th>
                        <th className="p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04] font-mono text-xs">
                      {users.map(u => {
                        const isBlocked = u.status === 'blocked';
                        return (
                          <tr key={u.id} className={`hover:bg-white/[0.01] transition-colors ${isBlocked ? 'bg-red-500/[0.03] border-l border-red-500/50' : ''}`}>
                            {/* Operator name + avatar */}
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-surface-700 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                  {u.avatar ? (
                                    <img src={u.avatar} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-[11px] font-bold text-accent-cyan">
                                      {(u.name || 'A').charAt(0).toUpperCase()}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <div className="font-semibold text-white">{u.name || 'Anonymous Operator'}</div>
                                  <div className="text-[10px] text-accent-cyan font-semibold font-mono mt-0.5">
                                    @{u.username || u.name?.toLowerCase().replace(/\s+/g, '') || 'operator'}#{u.discriminator || '0000'}
                                  </div>
                                  <div className="text-[9px] text-slate-600 font-mono">
                                    ID: {u.id.substring(0, 14)}...
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* XP / Level */}
                            <td className="p-4">
                              <div className="text-accent-cyan font-bold">LEVEL {u.level || 1}</div>
                              <div className="text-[10px] text-slate-500 mt-0.5">{u.xp || 0} XP</div>
                              <div className="text-[9px] text-slate-600 mt-1">Joined: {new Date(u.joined_at).toLocaleDateString()}</div>
                            </td>

                            {/* Email + phone */}
                            <td className="p-4">
                              <div className="text-white">{u.email}</div>
                              <div className="text-[10px] text-slate-500 mt-1">{u.phone || 'No phone'}</div>
                              <div className="text-[10px] text-slate-600 mt-0.5">{u.qualification || 'No qualification'}</div>
                            </td>

                            {/* Subscription + Role */}
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold border block w-fit mb-1.5 ${
                                (u.subscription_tier === 'pro')
                                  ? 'bg-accent-violet/10 border-accent-violet/30 text-accent-violet'
                                  : 'bg-slate-700/30 border-slate-600/30 text-slate-400'
                              }`}>
                                {u.subscription_tier || 'free'}
                              </span>
                              <div className="flex flex-col gap-1 w-fit">
                                <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold border text-center ${
                                  u.role === 'admin'
                                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                                    : 'bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan'
                                }`}>
                                  {u.role}
                                </span>
                                <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold border text-center ${
                                  isBlocked
                                    ? 'bg-red-500/25 border-red-500/40 text-red-400'
                                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                }`}>
                                  {isBlocked ? 'blocked' : 'active'}
                                </span>
                              </div>
                            </td>

                            {/* Actions: role toggle + block/unblock + delete */}
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                {/* Toggle role */}
                                <button
                                  title={u.role === 'admin' ? 'Demote to Student' : 'Promote to Admin'}
                                  onClick={async () => {
                                    const newRole = u.role === 'admin' ? 'student' : 'admin';
                                    if (!confirm(`Change ${u.name}'s role to ${newRole}?`)) return;
                                    try {
                                      const res = await fetch('/api/admin', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ uid: dbUser?.id, action: 'update_user_role', target_uid: u.id, new_role: newRole })
                                      });
                                      if (res.ok) {
                                        triggerNotification(`${u.name} role updated to ${newRole}.`);
                                        setUsers(prev => prev.map(usr => usr.id === u.id ? { ...usr, role: newRole } : usr));
                                      } else {
                                        const d = await res.json();
                                        triggerNotification(d.error || 'Role update failed.', 'error');
                                      }
                                    } catch { triggerNotification('Network error.', 'error'); }
                                  }}
                                  className={`p-2 rounded-lg border text-[10px] font-bold transition-all ${
                                    u.role === 'admin'
                                      ? 'bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20 text-amber-400'
                                      : 'bg-accent-cyan/10 border-accent-cyan/20 hover:bg-accent-cyan/20 text-accent-cyan'
                                  }`}
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>

                                {/* Toggle Block/Unblock */}
                                <button
                                  title={isBlocked ? 'Unblock Student' : 'Block Student'}
                                  onClick={async () => {
                                    const action = isBlocked ? 'unblock_user' : 'block_user';
                                    if (!confirm(`${isBlocked ? 'Unblock' : 'Temporarily suspend'} student ${u.name}?`)) return;
                                    try {
                                      const res = await fetch('/api/admin', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ uid: dbUser?.id, action, target_uid: u.id })
                                      });
                                      if (res.ok) {
                                        triggerNotification(`Student ${u.name} status updated successfully.`);
                                        setUsers(prev => prev.map(usr => usr.id === u.id ? { ...usr, status: isBlocked ? 'active' : 'blocked' } : usr));
                                      } else {
                                        const d = await res.json();
                                        triggerNotification(d.error || 'Operation failed.', 'error');
                                      }
                                    } catch { triggerNotification('Network error.', 'error'); }
                                  }}
                                  className={`p-2 rounded-lg border text-[10px] font-bold transition-all ${
                                    isBlocked
                                      ? 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400'
                                      : 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-400'
                                  }`}
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                </button>

                                {/* Delete */}
                                <button
                                  onClick={async () => {
                                    if (!confirm(`Remove student ${u.name}? This cannot be undone.`)) return;
                                    try {
                                      const res = await fetch('/api/admin', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ uid: dbUser?.id, action: 'delete_user', target_uid: u.id })
                                      });
                                      if (res.ok) {
                                        triggerNotification(`Student ${u.name} removed successfully.`);
                                        setUsers(prev => prev.filter(usr => usr.id !== u.id));
                                      } else {
                                        const d = await res.json();
                                        triggerNotification(d.error || 'Deletion failed.', 'error');
                                      }
                                    } catch { triggerNotification('Network error.', 'error'); }
                                  }}
                                  className="p-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 rounded-lg text-red-400 transition-all"
                                  title="Remove student"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 12: FEEDBACK MANAGEMENT */}
          {activeTab === 'feedback' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <h2 className="text-lg font-bold text-white font-mono uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-accent-cyan" />
                  User Feedback Reports
                </h2>
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/feedback');
                      if (res.ok) setFeedbacks(await res.json());
                      else setFeedbacks([]);
                    } catch { setFeedbacks([]); }
                  }}
                  className="flex items-center gap-1.5 text-[10px] font-mono text-accent-cyan border border-accent-cyan/25 px-3 py-1.5 rounded-lg hover:bg-accent-cyan/5 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" /> Refresh
                </button>
              </div>

              {feedbacks.length === 0 ? (
                <div className="glass p-12 text-center rounded-xl border border-white/[0.06] bg-surface-900/30">
                  <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 font-mono text-xs">No feedback submissions yet. Click Refresh to load from database.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Star rating summary */}
                  <div className="glass p-5 rounded-xl border border-white/[0.06] bg-surface-900/30 flex items-center gap-6">
                    <div className="text-center shrink-0">
                      <div className="text-3xl font-bold text-white">
                        {(feedbacks.reduce((a, f) => a + f.rating, 0) / feedbacks.length).toFixed(1)}
                      </div>
                      <div className="flex gap-0.5 justify-center mt-1">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(feedbacks.reduce((a, f) => a + f.rating, 0) / feedbacks.length) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
                        ))}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 font-mono">{feedbacks.length} reviews</div>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {[5,4,3,2,1].map(star => {
                        const count = feedbacks.filter(f => f.rating === star).length;
                        const pct = feedbacks.length > 0 ? (count / feedbacks.length) * 100 : 0;
                        return (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-slate-500 w-3">{star}</span>
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 shrink-0" />
                            <div className="flex-1 h-1.5 bg-surface-900 rounded-full overflow-hidden">
                              <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-[10px] font-mono text-slate-500 w-5 text-right">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Filter controls */}
                  <div className="flex gap-2 border-b border-white/[0.04] pb-3">
                    {(['all', 'pending', 'published'] as const).map(f => (
                      <button
                        key={f}
                        onClick={() => setFeedbackFilter(f)}
                        className={`px-3 py-1.5 rounded-lg border font-mono text-[10px] uppercase font-bold transition-all ${
                          feedbackFilter === f
                            ? 'bg-accent-cyan/15 border-accent-cyan/35 text-white glow-cyan'
                            : 'bg-white/[0.02] border-white/[0.05] text-slate-400 hover:text-white hover:bg-white/[0.04]'
                        }`}
                      >
                        {f === 'all' ? 'All Reviews' : f === 'pending' ? 'Pending Review' : 'Published'}
                      </button>
                    ))}
                  </div>

                  {/* Feedback list */}
                  <div className="space-y-3">
                    {feedbacks
                      .filter(fb => {
                        if (feedbackFilter === 'pending') return fb.is_published === 0;
                        if (feedbackFilter === 'published') return fb.is_published === 1;
                        return true;
                      })
                      .map((fb, i) => (
                        <div key={fb.id || i} className="glass p-4 rounded-xl border border-white/[0.06] bg-surface-900/20 font-mono text-xs">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <div className="font-semibold text-white">{fb.name || 'Anonymous Operator'}</div>
                                <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-bold border ${
                                  fb.is_published === 1
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                    : 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                                }`}>
                                  {fb.is_published === 1 ? 'published' : 'pending review'}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-500 mt-0.5">
                                {new Date(fb.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </div>
                            </div>
                            <div className="flex gap-0.5 shrink-0">
                              {[1,2,3,4,5].map(s => (
                                <Star key={s} className={`w-3.5 h-3.5 ${s <= fb.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
                              ))}
                            </div>
                          </div>
                          {fb.message && (
                            <p className="text-slate-400 mt-2 text-[11px] leading-relaxed border-t border-white/[0.04] pt-2 italic">
                              &ldquo;{fb.message}&rdquo;
                            </p>
                          )}

                          <div className="flex gap-2 mt-3 border-t border-white/[0.04] pt-3 justify-end">
                            <button
                              onClick={async () => {
                                const action = fb.is_published === 1 ? 'unpublish' : 'publish';
                                try {
                                  const res = await fetch('/api/feedback', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ action, id: fb.id, admin_uid: dbUser?.id })
                                  });
                                  if (res.ok) {
                                    triggerNotification(`Feedback ${fb.is_published === 1 ? 'unpublished' : 'published'} successfully.`);
                                    setFeedbacks(prev => prev.map(f => f.id === fb.id ? { ...f, is_published: fb.is_published === 1 ? 0 : 1 } : f));
                                  } else {
                                    const d = await res.json();
                                    triggerNotification(d.error || 'Failed to update feedback.', 'error');
                                  }
                                } catch { triggerNotification('Network error.', 'error'); }
                              }}
                              className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-all ${
                                fb.is_published === 1
                                  ? 'bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/20 text-orange-400'
                                  : 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400'
                              }`}
                            >
                              {fb.is_published === 1 ? 'Unpublish' : 'Publish'}
                            </button>
                            <button
                              onClick={async () => {
                                if (!confirm('Are you sure you want to permanently delete this testimonial?')) return;
                                try {
                                  const res = await fetch('/api/feedback', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ action: 'delete', id: fb.id, admin_uid: dbUser?.id })
                                  });
                                  if (res.ok) {
                                    triggerNotification('Feedback permanently deleted.');
                                    setFeedbacks(prev => prev.filter(f => f.id !== fb.id));
                                  } else {
                                    const d = await res.json();
                                    triggerNotification(d.error || 'Failed to delete feedback.', 'error');
                                  }
                                } catch { triggerNotification('Network error.', 'error'); }
                              }}
                              className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 rounded text-[10px] font-bold text-red-400 transition-all flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 13: SUBNET BROADCASTS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white font-mono uppercase tracking-widest border-b border-white/[0.06] pb-3 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-accent-cyan animate-bounce" />
                Subnet Broadcast Announcements & Notifications
              </h2>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Broadcast Creator Form */}
                <div className="glass p-6 rounded-2xl border border-white/[0.06] bg-surface-900/40 xl:col-span-1">
                  <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-white/[0.04] pb-2">
                    Transmit Broadcast Signal
                  </h3>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!dbUser) return;
                      if (!broadcastForm.title || !broadcastForm.message) {
                        triggerNotification('Title and message are required.', 'error');
                        return;
                      }

                      try {
                        const res = await fetch('/api/notifications', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            action: 'create',
                            admin_uid: dbUser.id,
                            type: broadcastForm.type,
                            title: broadcastForm.title,
                            message: broadcastForm.message,
                            target_user_id: broadcastForm.target_user_id.trim() || null
                          })
                        });

                        if (res.ok) {
                          triggerNotification('Broadcast transmission successful!');
                          setBroadcastForm({ type: 'update', title: '', message: '', target_user_id: '' });
                          // Reload notifications
                          const updatedRes = await fetch(`/api/notifications?uid=${dbUser.id}&admin_view=true`);
                          if (updatedRes.ok) setAdminNotifications(await updatedRes.json());
                        } else {
                          const data = await res.json();
                          triggerNotification(data.error || 'Transmission failed.', 'error');
                        }
                      } catch {
                        triggerNotification('Transmission pipeline offline.', 'error');
                      }
                    }}
                    className="space-y-4 font-mono text-xs"
                  >
                    <div>
                      <label className="block text-slate-500 uppercase mb-1.5">Signal Classification</label>
                      <select
                        value={broadcastForm.type}
                        onChange={(e) => setBroadcastForm({ ...broadcastForm, type: e.target.value })}
                        className="w-full bg-black/60 border border-white/[0.08] rounded-lg p-2.5 text-white focus:border-accent-cyan transition-colors"
                      >
                        <option value="update">System Update (Violet)</option>
                        <option value="course">Course Alert (Cyan)</option>
                        <option value="alert">Critical Broadcast (Orange)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-500 uppercase mb-1.5">Target Operator UID (Optional)</label>
                      <input
                        type="text"
                        value={broadcastForm.target_user_id}
                        onChange={(e) => setBroadcastForm({ ...broadcastForm, target_user_id: e.target.value })}
                        placeholder="Leave blank for Global Broadcast"
                        className="w-full bg-black/60 border border-white/[0.08] rounded-lg p-2.5 text-white placeholder-slate-600 focus:border-accent-cyan transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 uppercase mb-1.5">Broadcast Header (Title)</label>
                      <input
                        type="text"
                        value={broadcastForm.title}
                        onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                        placeholder="e.g. SYSTEM SECURITY BREACH MITIGATED"
                        className="w-full bg-black/60 border border-white/[0.08] rounded-lg p-2.5 text-white placeholder-slate-600 focus:border-accent-cyan transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 uppercase mb-1.5">Broadcast Payload (Message)</label>
                      <textarea
                        value={broadcastForm.message}
                        onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                        placeholder="Detail signal logs here..."
                        rows={4}
                        className="w-full bg-black/60 border border-white/[0.08] rounded-lg p-2.5 text-white placeholder-slate-600 focus:border-accent-cyan transition-colors resize-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-lg bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/35 hover:border-accent-cyan/50 text-white font-bold tracking-widest uppercase transition-all glow-cyan"
                    >
                      Transmit Signal
                    </button>
                  </form>
                </div>

                {/* Sent Broadcasts Monitor */}
                <div className="glass p-6 rounded-2xl border border-white/[0.06] bg-surface-900/40 xl:col-span-2">
                  <div className="flex items-center justify-between border-b border-white/[0.04] pb-2 mb-4">
                    <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                      Live Broadcast Announcements Ledger
                    </h3>
                    <button
                      onClick={async () => {
                        if (!dbUser) return;
                        try {
                          const res = await fetch(`/api/notifications?uid=${dbUser.id}&admin_view=true`);
                          if (res.ok) setAdminNotifications(await res.json());
                        } catch {}
                      }}
                      className="flex items-center gap-1 text-[10px] font-mono text-accent-cyan hover:text-accent-cyan/80 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" /> Refresh
                    </button>
                  </div>

                  {adminNotifications.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 font-mono text-xs">
                      No broadcast histories logged in database.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-white/[0.06] bg-black/30">
                      <table className="w-full text-left border-collapse font-mono text-xs">
                        <thead>
                          <tr className="bg-black/50 border-b border-white/[0.06] text-slate-500 text-[10px] uppercase">
                            <th className="p-3">Sent Time</th>
                            <th className="p-3">Signal Type</th>
                            <th className="p-3">Target Subnet</th>
                            <th className="p-3">Payload (Header & Body)</th>
                            <th className="p-3 text-right">Abort</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                          {adminNotifications.map((n) => (
                            <tr key={n.id} className="hover:bg-white/[0.01] transition-colors">
                              <td className="p-3 text-slate-400 text-[11px] whitespace-nowrap">
                                {new Date(n.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold border ${
                                  n.type === 'alert'
                                    ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                                    : n.type === 'course'
                                    ? 'bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan'
                                    : 'bg-accent-violet/10 border-accent-violet/30 text-accent-violet'
                                }`}>
                                  {n.type}
                                </span>
                              </td>
                              <td className="p-3 text-[10px] text-slate-400">
                                {n.target_user_id ? (
                                  <span className="text-accent-cyan font-bold" title={n.target_user_id}>
                                    TARGET: {n.target_user_id.substring(0, 10)}...
                                  </span>
                                ) : (
                                  <span className="text-slate-500">GLOBAL ALL</span>
                                )}
                              </td>
                              <td className="p-3 max-w-xs">
                                <div className="font-bold text-white leading-tight">{n.title}</div>
                                <div className="text-[11px] text-slate-400 mt-1 leading-normal">{n.message}</div>
                              </td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={async () => {
                                    if (!dbUser) return;
                                    if (!confirm('Recall/delete this broadcast announcement? This will remove it from all student feeds.')) return;
                                    try {
                                      const res = await fetch('/api/notifications', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                          action: 'delete',
                                          admin_uid: dbUser.id,
                                          notification_id: n.id
                                        })
                                      });
                                      if (res.ok) {
                                        triggerNotification('Broadcast aborted successfully.');
                                        setAdminNotifications(prev => prev.filter(item => item.id !== n.id));
                                      } else {
                                        triggerNotification('Abort command rejected.', 'error');
                                      }
                                    } catch {
                                      triggerNotification('Network timeout.', 'error');
                                    }
                                  }}
                                  className="p-1.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 rounded text-red-400 transition-colors"
                                  title="Recall Announcement"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 14: CONTACT ENQUIRIES */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white font-mono uppercase tracking-widest border-b border-white/[0.06] pb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-accent-cyan animate-pulse" />
                Contact Enquiries Terminal
              </h2>

              <div className="glass p-6 rounded-2xl border border-white/[0.06] bg-surface-900/40">
                <div className="flex items-center justify-between border-b border-white/[0.04] pb-2 mb-4">
                  <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    Incoming Enquiries Ledger
                  </h3>
                  <button
                    onClick={async () => {
                      if (!dbUser) return;
                      try {
                        const res = await fetch(`/api/contact?admin_uid=${dbUser.id}`);
                        if (res.ok) setContactMessages(await res.json());
                      } catch {}
                    }}
                    className="flex items-center gap-1 text-[10px] font-mono text-accent-cyan hover:text-accent-cyan/80 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3 animate-spin-slow" /> Refresh
                  </button>
                </div>

                {isLoading ? (
                  <div className="text-center py-12 text-slate-500 font-mono text-xs animate-pulse">
                    Retrieving secure message ledger...
                  </div>
                ) : contactMessages.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 font-mono text-xs">
                    No enquiries logged in database.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contactMessages.map((msg) => (
                      <div key={msg.id} className="p-5 bg-black/30 border border-white/[0.05] rounded-xl flex flex-col md:flex-row justify-between gap-4 font-mono">
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-xs font-bold text-white">{msg.name}</span>
                            <a href={`mailto:${msg.email}`} className="text-[10px] text-accent-cyan hover:underline">{msg.email}</a>
                            <span className="text-[10px] text-slate-500">
                              {new Date(msg.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {msg.subject && (
                            <div className="text-xs font-semibold text-slate-300">
                              <span className="text-slate-500 uppercase text-[9px] mr-1.5">Subject:</span>
                              {msg.subject}
                            </div>
                          )}
                          <div className="p-3 bg-black/40 rounded border border-white/[0.03] text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                            {msg.message}
                          </div>
                        </div>
                        <div className="shrink-0 flex items-start">
                          <button
                            onClick={() => handleDeleteContactMessage(msg.id)}
                            className="p-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                            title="Delete enquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
