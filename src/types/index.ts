export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  modules: Module[];
  thumbnail: string;
  xp: number;
  enrolled: number;
  rating: number;
  instructor: Instructor;
  tags: string[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  order: number;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'lab' | 'quiz' | 'reading';
  completed: boolean;
  locked: boolean;
}

export interface Instructor {
  name: string;
  avatar: string;
  title: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  coursesCompleted: number;
  certificates: number;
  rank: number;
  subscription: SubscriptionTier;
  joinedAt: string;
}

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  highlighted: boolean;
  cta: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
  xp: number;
  category: string;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseName: string;
  userName: string;
  completedAt: string;
  hash: string;
  verificationUrl: string;
  grade: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
}

export interface ActivityItem {
  id: string;
  type: 'course_completed' | 'achievement_earned' | 'streak_milestone' | 'certificate_earned' | 'lesson_completed';
  title: string;
  description: string;
  timestamp: string;
  xp: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
}

export interface PricingTier {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  highlighted: boolean;
  cta: string;
  badge?: string;
}

export interface HeatmapData {
  date: string;
  count: number;
}
