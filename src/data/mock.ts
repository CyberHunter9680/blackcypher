import type {
  Course,
  User,
  Achievement,
  Certificate,
  LeaderboardEntry,
  ActivityItem,
  Testimonial,
  PricingTier,
  HeatmapData,
} from '../types';

export const mockUser: User = {
  id: '1',
  name: 'Alex Mercer',
  email: 'alex@nulltrace.io',
  avatar: '',
  xp: 12450,
  level: 12,
  streak: 23,
  coursesCompleted: 8,
  certificates: 3,
  rank: 42,
  subscription: 'pro',
  joinedAt: '2025-06-15',
};

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Offensive Security Fundamentals',
    description: 'Master the art of ethical hacking and penetration testing with hands-on labs and real-world scenarios.',
    category: 'Offensive Security',
    level: 'intermediate',
    duration: '40h',
    modules: [
      {
        id: 'm1',
        title: 'Reconnaissance & Enumeration',
        order: 1,
        lessons: [
          { id: 'l1', title: 'Introduction to Recon', duration: '12m', type: 'video', completed: true, locked: false },
          { id: 'l2', title: 'Passive Information Gathering', duration: '18m', type: 'video', completed: true, locked: false },
          { id: 'l3', title: 'Active Enumeration Techniques', duration: '25m', type: 'lab', completed: false, locked: false },
          { id: 'l4', title: 'OSINT Tools Deep Dive', duration: '20m', type: 'video', completed: false, locked: false },
        ],
      },
      {
        id: 'm2',
        title: 'Vulnerability Assessment',
        order: 2,
        lessons: [
          { id: 'l5', title: 'Scanning with Nmap', duration: '22m', type: 'video', completed: false, locked: false },
          { id: 'l6', title: 'Nessus & OpenVAS', duration: '18m', type: 'video', completed: false, locked: false },
          { id: 'l7', title: 'Vulnerability Lab', duration: '45m', type: 'lab', completed: false, locked: true },
        ],
      },
      {
        id: 'm3',
        title: 'Exploitation Techniques',
        order: 3,
        lessons: [
          { id: 'l8', title: 'Exploit Development Basics', duration: '30m', type: 'video', completed: false, locked: true },
          { id: 'l9', title: 'Metasploit Framework', duration: '25m', type: 'video', completed: false, locked: true },
          { id: 'l10', title: 'Web Application Exploits', duration: '35m', type: 'lab', completed: false, locked: true },
        ],
      },
    ],
    thumbnail: '',
    xp: 2500,
    enrolled: 4230,
    rating: 4.9,
    instructor: { name: 'Sarah Chen', avatar: '', title: 'Principal Security Researcher' },
    tags: ['pentesting', 'ethical-hacking', 'oscp'],
  },
  {
    id: '2',
    title: 'Cloud Security Architecture',
    description: 'Design and implement secure cloud infrastructure across AWS, Azure, and GCP.',
    category: 'Cloud Security',
    level: 'advanced',
    duration: '35h',
    modules: [],
    thumbnail: '',
    xp: 2000,
    enrolled: 2890,
    rating: 4.8,
    instructor: { name: 'James Walker', avatar: '', title: 'Cloud Security Architect' },
    tags: ['aws', 'azure', 'cloud', 'devsecops'],
  },
  {
    id: '3',
    title: 'Network Defense & SOC Operations',
    description: 'Learn to detect, respond to, and prevent cyber threats in enterprise environments.',
    category: 'Defense',
    level: 'intermediate',
    duration: '30h',
    modules: [],
    thumbnail: '',
    xp: 1800,
    enrolled: 3560,
    rating: 4.7,
    instructor: { name: 'Maria Rodriguez', avatar: '', title: 'SOC Director' },
    tags: ['soc', 'siem', 'incident-response', 'blue-team'],
  },
  {
    id: '4',
    title: 'Secure Code Development',
    description: 'Write bulletproof code by understanding and preventing common vulnerability classes.',
    category: 'AppSec',
    level: 'beginner',
    duration: '25h',
    modules: [],
    thumbnail: '',
    xp: 1500,
    enrolled: 5120,
    rating: 4.8,
    instructor: { name: 'David Kim', avatar: '', title: 'Application Security Lead' },
    tags: ['secure-coding', 'owasp', 'appsec'],
  },
  {
    id: '5',
    title: 'Malware Analysis & Reverse Engineering',
    description: 'Dissect malicious software and understand attack vectors through static and dynamic analysis.',
    category: 'Malware Analysis',
    level: 'advanced',
    duration: '45h',
    modules: [],
    thumbnail: '',
    xp: 3000,
    enrolled: 1890,
    rating: 4.9,
    instructor: { name: 'Elena Volkov', avatar: '', title: 'Malware Researcher' },
    tags: ['malware', 'reverse-engineering', 'ida', 'ghidra'],
  },
  {
    id: '6',
    title: 'Zero Trust Architecture',
    description: 'Implement zero trust security models for modern enterprise networks.',
    category: 'Architecture',
    level: 'advanced',
    duration: '20h',
    modules: [],
    thumbnail: '',
    xp: 1600,
    enrolled: 2340,
    rating: 4.6,
    instructor: { name: 'Ryan O\'Brien', avatar: '', title: 'Security Architect' },
    tags: ['zero-trust', 'architecture', 'identity'],
  },
];

export const mockAchievements: Achievement[] = [
  { id: '1', title: 'First Blood', description: 'Complete your first lesson', icon: 'Target', earned: true, earnedAt: '2025-06-16', xp: 50, category: 'progress' },
  { id: '2', title: 'Streak Master', description: 'Maintain a 7-day streak', icon: 'Flame', earned: true, earnedAt: '2025-06-23', xp: 200, category: 'streak' },
  { id: '3', title: 'Deep Diver', description: 'Complete an advanced course', icon: 'Dive', earned: true, earnedAt: '2025-08-10', xp: 500, category: 'course' },
  { id: '4', title: 'Certified', description: 'Earn your first certificate', icon: 'Award', earned: true, earnedAt: '2025-08-15', xp: 300, category: 'certificate' },
  { id: '5', title: 'Top 50', description: 'Reach top 50 on leaderboard', icon: 'Trophy', earned: true, earnedAt: '2025-09-01', xp: 1000, category: 'rank' },
  { id: '6', title: 'Unstoppable', description: 'Maintain a 30-day streak', icon: 'Zap', earned: false, xp: 500, category: 'streak' },
  { id: '7', title: 'Polyglot', description: 'Complete courses in 3 categories', icon: 'BookOpen', earned: false, xp: 750, category: 'course' },
  { id: '8', title: 'Elite', description: 'Reach top 10 on leaderboard', icon: 'Crown', earned: false, xp: 2000, category: 'rank' },
];

export const mockCertificate: Certificate = {
  id: 'cert-001',
  courseId: '1',
  courseName: 'Offensive Security Fundamentals',
  userName: 'Alex Mercer',
  completedAt: '2025-08-15',
  hash: '0x7a3f9b2c1d8e4f6a',
  verificationUrl: 'https://nulltrace.io/verify/0x7a3f9b2c1d8e4f6a',
  grade: 'A+',
};

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, userId: 'u1', name: 'ShadowByte', avatar: '', xp: 45200, level: 22, streak: 95 },
  { rank: 2, userId: 'u2', name: 'CipherPulse', avatar: '', xp: 41800, level: 21, streak: 78 },
  { rank: 3, userId: 'u3', name: 'NullPointer', avatar: '', xp: 38500, level: 20, streak: 62 },
  { rank: 4, userId: 'u4', name: 'RootAccess', avatar: '', xp: 35200, level: 19, streak: 45 },
  { rank: 5, userId: 'u5', name: 'ZeroDay', avatar: '', xp: 32100, level: 18, streak: 55 },
  { rank: 6, userId: 'u6', name: 'FirewallX', avatar: '', xp: 28900, level: 17, streak: 33 },
  { rank: 7, userId: 'u7', name: 'ByteStorm', avatar: '', xp: 25600, level: 16, streak: 41 },
  { rank: 8, userId: 'u8', name: 'NetPhantom', avatar: '', xp: 22300, level: 15, streak: 29 },
  { rank: 9, userId: 'u9', name: 'ShellShock', avatar: '', xp: 19100, level: 14, streak: 37 },
  { rank: 10, userId: 'u10', name: 'CryptoKnight', avatar: '', xp: 16800, level: 13, streak: 22 },
];

export const mockActivities: ActivityItem[] = [
  { id: 'a1', type: 'lesson_completed', title: 'Completed "Passive Information Gathering"', description: 'Offensive Security Fundamentals', timestamp: '2025-10-20T14:30:00Z', xp: 25 },
  { id: 'a2', type: 'streak_milestone', title: '23-day streak!', description: 'Keep the momentum going', timestamp: '2025-10-20T09:00:00Z', xp: 100 },
  { id: 'a3', type: 'achievement_earned', title: 'Earned "Top 50"', description: 'Reached top 50 on the leaderboard', timestamp: '2025-10-19T16:45:00Z', xp: 1000 },
  { id: 'a4', type: 'course_completed', title: 'Completed "Secure Code Development"', description: 'All modules and labs finished', timestamp: '2025-10-18T11:20:00Z', xp: 1500 },
  { id: 'a5', type: 'certificate_earned', title: 'Certificate earned!', description: 'Secure Code Development', timestamp: '2025-10-18T11:25:00Z', xp: 300 },
  { id: 'a6', type: 'lesson_completed', title: 'Completed "Scanning with Nmap"', description: 'Offensive Security Fundamentals', timestamp: '2025-10-17T15:10:00Z', xp: 25 },
];

export const mockTestimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Marcus Webb',
    role: 'Security Engineer',
    company: 'CrowdStrike',
    avatar: '',
    content: 'NullTrace Academy transformed my career. The hands-on labs are indistinguishable from real-world scenarios. I went from junior dev to security engineer in 6 months.',
    rating: 5,
  },
  {
    id: 't2',
    name: 'Priya Sharma',
    role: 'CISO',
    company: 'DataShield Corp',
    avatar: '',
    content: 'We enrolled our entire security team. The quality of instruction and the platform\'s analytics dashboard made tracking team progress effortless.',
    rating: 5,
  },
  {
    id: 't3',
    name: 'Jake Torres',
    role: 'Penetration Tester',
    company: 'HackerOne',
    avatar: '',
    content: 'The offensive security track is the closest thing to real engagement experience I\'ve found in an educational platform. Worth every credit.',
    rating: 5,
  },
];

export const mockPricingTiers: PricingTier[] = [
  {
    id: 'free',
    name: 'Recruit',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      'Access to Cybersecurity Roadmap',
      '3 Beginner OSINT Courses',
      'Download Free Cybersecurity Books',
      'Progress Tracking & Community Forum',
    ],
    highlighted: false,
    cta: 'Get Started',
  },
  {
    id: 'pro',
    name: 'Operator',
    monthlyPrice: 2999,
    yearlyPrice: 18999,
    features: [
      'Unlimited Premium Books PDF Access',
      'Full Course Content (CEH v10/v13)',
      'Live Weekly Doubt Clearing Sessions',
      'Hands-on Sandbox Labs & XP System',
      'Official Certificates of Completion',
    ],
    highlighted: true,
    cta: 'Start Pro Trial',
    badge: 'Most Popular',
  },
];

export const mockHeatmapData: HeatmapData[] = (() => {
  const data: HeatmapData[] = [];
  const today = new Date();
  for (let i = 89; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseActivity = isWeekend ? 0.3 : 0.7;
    const count = Math.random() < baseActivity ? Math.floor(Math.random() * 5) + 1 : 0;
    data.push({
      date: date.toISOString().split('T')[0],
      count,
    });
  }
  return data;
})();
