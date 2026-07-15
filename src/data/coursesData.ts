// Extended courses data with is_free flag
export interface CourseData {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  instructor: string;
  instructorTitle: string;
  modules_count: number;
  is_free: boolean;
  category: string;
  color: string; // gradient color for thumbnail
  icon: string;  // emoji icon for thumbnail
  rating: number;
  enrolled: number;
  xp: number;
}

export const allCoursesData: CourseData[] = [
  // ── FREE COURSES (pehle) ──
  {
    id: 'free-1',
    title: 'Cyber Security Fundamentals',
    description: 'Networking basics, internet protocols, CIA triad, bash commands and security models. Perfect starting point.',
    level: 'beginner',
    duration: '12h',
    instructor: 'Aryan Mehta',
    instructorTitle: 'Senior Security Analyst',
    modules_count: 6,
    is_free: true,
    category: 'Core',
    color: 'from-emerald-500 to-teal-600',
    icon: '🛡️',
    rating: 4.8,
    enrolled: 12500,
    xp: 500,
  },
  {
    id: 'free-2',
    title: 'OSINT & Reconnaissance',
    description: 'Master passive reconnaissance, Google dorking, and data harvesting via public APIs. Free for all operators.',
    level: 'beginner',
    duration: '8h',
    instructor: 'Priya Sharma',
    instructorTitle: 'OSINT Researcher',
    modules_count: 5,
    is_free: true,
    category: 'Core',
    color: 'from-blue-500 to-indigo-600',
    icon: '🔍',
    rating: 4.7,
    enrolled: 9800,
    xp: 800,
  },
  {
    id: 'free-3',
    title: 'Networking Fundamentals',
    description: 'TCP/IP, DNS, HTTP, firewalls — learn how the internet really works from first principles.',
    level: 'beginner',
    duration: '10h',
    instructor: 'Rohan Kapoor',
    instructorTitle: 'Network Security Engineer',
    modules_count: 7,
    is_free: true,
    category: 'Core',
    color: 'from-sky-500 to-cyan-600',
    icon: '🌐',
    rating: 4.6,
    enrolled: 15200,
    xp: 600,
  },

  // ── PAID COURSES (baad mein) ──
  {
    id: 'paid-1',
    title: 'Ethical Hacking (CEH v13)',
    description: 'Complete CEH v13 modules — scanning, exploitation, reporting. Industry-recognized certification prep.',
    level: 'intermediate',
    duration: '40h',
    instructor: 'Sarah Chen',
    instructorTitle: 'Principal Security Researcher',
    modules_count: 12,
    is_free: false,
    category: 'Offensive',
    color: 'from-red-500 to-rose-600',
    icon: '💻',
    rating: 4.9,
    enrolled: 4230,
    xp: 2000,
  },
  {
    id: 'paid-2',
    title: 'Web App Pentesting (OWASP)',
    description: 'OWASP Top 10: SQL Injection, XSS, CSRF, SSRF exploitation and secure patching techniques.',
    level: 'intermediate',
    duration: '35h',
    instructor: 'David Kim',
    instructorTitle: 'Application Security Lead',
    modules_count: 10,
    is_free: false,
    category: 'Offensive',
    color: 'from-orange-500 to-amber-600',
    icon: '🕷️',
    rating: 4.8,
    enrolled: 5120,
    xp: 2500,
  },
  {
    id: 'paid-3',
    title: 'Network Defense & SOC',
    description: 'Firewalls, SIEM log analysis, threat detection and incident response workflows for blue teams.',
    level: 'intermediate',
    duration: '30h',
    instructor: 'Maria Rodriguez',
    instructorTitle: 'SOC Director',
    modules_count: 9,
    is_free: false,
    category: 'Defensive',
    color: 'from-violet-500 to-purple-600',
    icon: '🔐',
    rating: 4.7,
    enrolled: 3560,
    xp: 2200,
  },
  {
    id: 'paid-4',
    title: 'Linux Privilege Escalation',
    description: 'Sudo hijacking, SUID exploitation, cron vulnerabilities and kernel privesc techniques.',
    level: 'advanced',
    duration: '20h',
    instructor: 'James Walker',
    instructorTitle: 'Red Team Operator',
    modules_count: 8,
    is_free: false,
    category: 'Offensive',
    color: 'from-yellow-500 to-orange-500',
    icon: '🐧',
    rating: 4.9,
    enrolled: 2890,
    xp: 3500,
  },
  {
    id: 'paid-5',
    title: 'Active Directory Hijacking',
    description: 'Kerberos exploitation, Golden Ticket attacks, lateral movement and domain dominance techniques.',
    level: 'advanced',
    duration: '25h',
    instructor: 'Elena Volkov',
    instructorTitle: 'Malware Researcher',
    modules_count: 10,
    is_free: false,
    category: 'Offensive',
    color: 'from-pink-500 to-rose-600',
    icon: '🏛️',
    rating: 4.8,
    enrolled: 1890,
    xp: 4000,
  },
  {
    id: 'paid-6',
    title: 'Reverse Engineering & Malware',
    description: 'Binary analysis with IDA Pro & Ghidra, assembly-level code review and patch automation.',
    level: 'advanced',
    duration: '45h',
    instructor: 'Ryan O\'Brien',
    instructorTitle: 'Security Architect',
    modules_count: 14,
    is_free: false,
    category: 'Advanced',
    color: 'from-slate-500 to-gray-600',
    icon: '⚙️',
    rating: 4.9,
    enrolled: 1340,
    xp: 5000,
  },
  {
    id: 'paid-7',
    title: 'Cloud Security (AWS/GCP/Azure)',
    description: 'Design and implement secure cloud infrastructure, IAM, S3 misconfigs, and cloud-native threats.',
    level: 'intermediate',
    duration: '32h',
    instructor: 'Arjun Nair',
    instructorTitle: 'Cloud Security Architect',
    modules_count: 11,
    is_free: false,
    category: 'Cloud',
    color: 'from-cyan-500 to-blue-600',
    icon: '☁️',
    rating: 4.7,
    enrolled: 3100,
    xp: 2800,
  },
  {
    id: 'paid-8',
    title: 'Bug Bounty Hunting',
    description: 'Real-world bug bounty methodology, platform reports, responsible disclosure and earning payouts.',
    level: 'intermediate',
    duration: '18h',
    instructor: 'Vikram Singh',
    instructorTitle: 'Bug Bounty Hunter — Top 50',
    modules_count: 7,
    is_free: false,
    category: 'Offensive',
    color: 'from-green-500 to-emerald-600',
    icon: '🐛',
    rating: 4.8,
    enrolled: 4500,
    xp: 2000,
  },
  {
    id: 'paid-9',
    title: 'Cryptography & Blockchain Security',
    description: 'AES, RSA, hash functions, blockchain vulnerabilities and smart contract auditing fundamentals.',
    level: 'advanced',
    duration: '22h',
    instructor: 'Ananya Gupta',
    instructorTitle: 'Cryptography Engineer',
    modules_count: 9,
    is_free: false,
    category: 'Advanced',
    color: 'from-indigo-500 to-violet-600',
    icon: '🔑',
    rating: 4.6,
    enrolled: 1700,
    xp: 3200,
  },
];

// Mock enrolled courses for "My Courses" page
export interface EnrolledCourse extends CourseData {
  progress: number;        // 0-100
  last_accessed: string;  // ISO date
  completed_modules: number;
}

export const myEnrolledCourses: EnrolledCourse[] = [
  { ...allCoursesData[0], progress: 100, last_accessed: '2026-06-15', completed_modules: 6 },
  { ...allCoursesData[1], progress: 60, last_accessed: '2026-06-17', completed_modules: 3 },
  { ...allCoursesData[2], progress: 25, last_accessed: '2026-06-18', completed_modules: 2 },
  { ...allCoursesData[3], progress: 80, last_accessed: '2026-06-16', completed_modules: 10 },
];

// Mock live sessions data
export interface LiveSession {
  id: string;
  title: string;
  type: 'Zoom Webinar' | 'Google Meet' | 'Live Stream';
  date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  end_time: string;   // HH:MM
  instructor: string;
  meet_url: string;
  is_completed: boolean;
  is_free: boolean;
}

export const liveSessions: LiveSession[] = [
  {
    id: 'ls-1',
    title: 'FREE WORKSHOP — CYBER SECURITY IN THE AGE OF AI',
    type: 'Zoom Webinar',
    date: '2026-05-23',
    start_time: '18:00',
    end_time: '20:05',
    instructor: 'Aryan Mehta',
    meet_url: 'https://zoom.us/j/mock',
    is_completed: true,
    is_free: true,
  },
  {
    id: 'ls-2',
    title: 'PRO DOUBT SESSION — WEB PENTESTING Q&A',
    type: 'Google Meet',
    date: '2026-06-28',
    start_time: '19:00',
    end_time: '21:00',
    instructor: 'David Kim',
    meet_url: 'https://meet.google.com/mock',
    is_completed: false,
    is_free: false,
  },
  {
    id: 'ls-3',
    title: 'PRO SESSION — LINUX PRIVESC LIVE LAB',
    type: 'Zoom Webinar',
    date: '2026-07-05',
    start_time: '17:00',
    end_time: '19:30',
    instructor: 'James Walker',
    meet_url: 'https://zoom.us/j/mock2',
    is_completed: false,
    is_free: false,
  },
  {
    id: 'ls-4',
    title: 'FREE WORKSHOP — OSINT FOR BEGINNERS',
    type: 'Google Meet',
    date: '2026-05-10',
    start_time: '11:00',
    end_time: '13:00',
    instructor: 'Priya Sharma',
    meet_url: 'https://meet.google.com/mock2',
    is_completed: true,
    is_free: true,
  },
  {
    id: 'ls-5',
    title: 'PRO DOUBT SESSION — CEH EXAM PREP',
    type: 'Zoom Webinar',
    date: '2026-07-12',
    start_time: '20:00',
    end_time: '22:00',
    instructor: 'Sarah Chen',
    meet_url: 'https://zoom.us/j/mock3',
    is_completed: false,
    is_free: false,
  },
];

// Community posts
export interface CommunityPost {
  id: string;
  author: string;
  authorAvatar: string;
  authorLevel: number;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  liked: boolean;
  tag?: string;
}

export const communityPosts: CommunityPost[] = [
  {
    id: 'p1',
    author: 'ShadowByte',
    authorAvatar: '',
    authorLevel: 22,
    content: 'Just completed the CEH module on Kerberoasting! The lab environment is insane — felt like a real AD pentest. Anyone else stuck on the golden ticket section? Happy to help!',
    timestamp: '2026-06-18T08:30:00Z',
    likes: 24,
    comments: 8,
    liked: false,
    tag: 'CEH',
  },
  {
    id: 'p2',
    author: 'CipherPulse',
    authorAvatar: '',
    authorLevel: 21,
    content: 'TIP: When doing OSINT recon, always cross-reference LinkedIn + Shodan + Hunter.io for maximum dork accuracy. Posted my full methodology in the resources section 🔍',
    timestamp: '2026-06-17T20:15:00Z',
    likes: 47,
    comments: 12,
    liked: true,
    tag: 'OSINT',
  },
  {
    id: 'p3',
    author: 'NullPointer',
    authorAvatar: '',
    authorLevel: 20,
    content: 'The Saturday doubt session was 🔥🔥🔥 — Sir explained SQL injection bypass techniques that I never found anywhere else. Pro plan is 100% worth it for the live sessions alone.',
    timestamp: '2026-06-17T11:00:00Z',
    likes: 31,
    comments: 5,
    liked: false,
    tag: 'Review',
  },
  {
    id: 'p4',
    author: 'FirewallX',
    authorAvatar: '',
    authorLevel: 17,
    content: 'Anyone preparing for CEH exam in July? Let\'s form a study group. DM me or reply below. We can do mock tests together on weekends!',
    timestamp: '2026-06-16T16:45:00Z',
    likes: 18,
    comments: 21,
    liked: false,
    tag: 'Study Group',
  },
];

// Mock notifications
export interface Notification {
  id: string;
  type: 'session' | 'achievement' | 'course' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'session',
    title: '🎯 Upcoming Live Session',
    message: 'Pro Doubt Session — Web Pentesting Q&A starts in 2 hours!',
    timestamp: '2026-06-18T17:00:00Z',
    read: false,
  },
  {
    id: 'n2',
    type: 'achievement',
    title: '🏆 Achievement Unlocked!',
    message: 'You earned "Streak Master" — 7 days learning streak!',
    timestamp: '2026-06-17T09:00:00Z',
    read: false,
  },
  {
    id: 'n3',
    type: 'course',
    title: '📚 New Course Available',
    message: 'Bug Bounty Hunting course is now live! Check it out.',
    timestamp: '2026-06-16T14:00:00Z',
    read: true,
  },
  {
    id: 'n4',
    type: 'system',
    title: '✅ Profile Updated',
    message: 'Your profile changes have been saved successfully.',
    timestamp: '2026-06-15T10:30:00Z',
    read: true,
  },
];
