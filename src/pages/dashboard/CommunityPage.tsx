import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Hash, ChevronRight, Users, Clock, Image, X, Smile, Shield, Search,
  Heart, MessageCircle, Plus, Filter, MessageSquare, Check, CheckCheck,
  CornerUpLeft, Edit2, Trash2, MoreVertical
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';

type SidebarTab = 'feed' | 'messages';

const getDiscriminator = (id: string): string => {
  if (!id) return '0000';
  let hash = 0;
  const idStr = String(id);
  for (let i = 0; i < idStr.length; i++) {
    hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const code = Math.abs(hash % 9000) + 1000;
  return `${code}`;
};

interface UserProfileModalProps {
  userId: string;
  onClose: () => void;
  onStartChat: (user: SearchedUser) => void;
}

function UserProfileModal({ userId, onClose, onStartChat }: UserProfileModalProps) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/users?uid=${userId}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data.user);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const colors = [
    'from-cyan-500 to-blue-600',
    'from-violet-500 to-purple-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-rose-500',
    'from-pink-500 to-violet-500'
  ];
  const getAvatarColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash % colors.length);
    return colors[idx];
  };

  const getRoleBadge = (role: string, subscriptionTier: string | null) => {
    if (role === 'admin') return { label: '🛡️ Root Admin', class: 'bg-red-500/20 border-red-500/40 text-red-400' };
    if (subscriptionTier === 'pro') return { label: '⚡ Pro Operator', class: 'bg-accent-violet/20 border-accent-violet/40 text-accent-violet' };
    return { label: '🛡️ Cyber Recruit', class: 'bg-slate-700/30 border-slate-600/30 text-slate-400' };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      <motion.div
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 30, opacity: 0 }}
        className="relative w-full max-w-sm bg-surface-850 border border-white/[0.08] rounded-3xl p-6 z-10 overflow-hidden shadow-2xl"
      >
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-accent-cyan/10 blur-[60px]" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-accent-violet/10 blur-[60px]" />

        <div className="flex justify-end mb-2">
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center font-mono gap-3">
            <Shield className="w-8 h-8 text-accent-cyan animate-pulse animate-spin shrink-0" />
            <span className="text-xs text-accent-cyan tracking-widest uppercase">Retrieving Credentials...</span>
          </div>
        ) : !profile ? (
          <div className="h-64 flex flex-col items-center justify-center font-mono text-xs text-slate-500">
            Failed to download user credentials.
          </div>
        ) : (
          <div className="flex flex-col items-center text-center font-mono relative z-10">
            <div className="relative group mb-4">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-accent-cyan to-accent-violet opacity-75 blur-sm group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <div className="relative w-24 h-24 rounded-full bg-surface-800 border-2 border-surface-900 overflow-hidden flex items-center justify-center shadow-2xl">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${getAvatarColor(profile.name || '')} flex items-center justify-center text-white text-3xl font-bold`}>
                    {(profile.name || 'O').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            <h3 className="text-xl font-bold text-white tracking-wide">{profile.name || 'Anonymous Operator'}</h3>
            <span className="text-xs text-accent-cyan font-bold mt-1">
              @{profile.username || 'unknown'}#{profile.discriminator || '0000'}
            </span>

            <div className="mt-3">
              {(() => {
                const badge = getRoleBadge(profile.role, profile.subscription_tier);
                return (
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badge.class}`}>
                    {badge.label}
                  </span>
                );
              })()}
            </div>

            <div className="w-full mt-6 space-y-2 bg-black/30 border border-white/[0.04] p-4 rounded-2xl">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 uppercase">Clearance Rank</span>
                <span className="text-white font-bold text-accent-cyan">LEVEL {profile.level || 1}</span>
              </div>
              <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.02]">
                <div 
                  className="h-full bg-gradient-to-r from-accent-cyan to-blue-500 rounded-full" 
                  style={{ width: `${Math.min(((profile.xp || 0) % 100), 100)}%` }} 
                />
              </div>
              <div className="flex justify-between items-center text-[9px] text-slate-500">
                <span>{(profile.xp || 0).toLocaleString()} XP Accumulated</span>
                <span>{(100 - ((profile.xp || 0) % 100))} XP to Next Level</span>
              </div>
            </div>

            <div className="w-full mt-4 text-[10px] text-slate-500 text-left space-y-2.5 px-1">
              <div className="flex justify-between">
                <span>Qualifications:</span>
                <span className="text-slate-300 font-semibold">{profile.qualification || 'Not Declared'}</span>
              </div>
              <div className="flex justify-between">
                <span>Account Status:</span>
                <span className="text-emerald-400 font-bold uppercase">{profile.status || 'Active'}</span>
              </div>
              <div className="flex justify-between">
                <span>Joined Subnet:</span>
                <span className="text-slate-300 font-semibold">{new Date(profile.joined_at).toLocaleDateString()}</span>
              </div>
            </div>

            <button
              onClick={() => onStartChat({
                id: profile.id,
                username: profile.username || 'unknown',
                name: profile.name || 'Anonymous Operator',
                role: profile.role || 'student',
                avatar: profile.avatar
              })}
              className="mt-6 w-full py-2.5 rounded-xl bg-accent-cyan hover:bg-cyan-300 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,255,102,0.15)] hover:shadow-[0_0_20px_rgba(0,255,102,0.25)]"
            >
              SEND SECURE TRANSMISSION
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ── Post Card ────────────────────────────────────────────────────────────────
function PostCard({ post, onLikeUpdated, onVisitProfile }: { post: any; onLikeUpdated: () => void; onVisitProfile: (uid: string) => void }) {
  const { dbUser } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(Number(post.likes || 0));
  const [commentCount, setCommentCount] = useState<number>(Number(post.comment_count || 0));
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [comments, setComments] = useState<any[]>([]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/forum?id=${post.id}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  useEffect(() => {
    if (showReply) {
      fetchComments();
    }
  }, [showReply]);

  const handleLike = async () => {
    if (liked) return; // Prevent double liking in UI session
    try {
      const res = await fetch('/api/forum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'like_post',
          post_id: post.id
        })
      });
      if (res.ok) {
        setLiked(true);
        setLikeCount((prev: number) => prev + 1);
        onLikeUpdated();
      }
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleCreateComment = async () => {
    if (!replyText.trim() || !dbUser) return;
    try {
      const res = await fetch('/api/forum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_comment',
          uid: dbUser.id,
          post_id: post.id,
          content: replyText,
          author_name: dbUser.name || 'Anonymous Operator',
          author_avatar: dbUser.avatar || ''
        })
      });
      if (res.ok) {
        setReplyText('');
        fetchComments();
        setCommentCount((prev: number) => prev + 1);
      }
    } catch (err) {
      console.error('Error creating comment:', err);
    }
  };

  const timeAgo = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const hrs = Math.floor(diff / 3.6e6);
    if (hrs < 1) return 'Just now';
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const colors = ['from-cyan-500 to-blue-600', 'from-violet-500 to-purple-600', 'from-emerald-500 to-teal-600', 'from-orange-500 to-rose-500', 'from-pink-500 to-violet-500'];
  const avatarColor = colors[(post.id || 0) % colors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-800 border border-white/[0.07] rounded-2xl p-5 hover:border-white/[0.12] transition-all"
    >
      {/* Author */}
      <div className="flex items-start gap-3 mb-4">
        <button
          onClick={() => onVisitProfile(post.userId)}
          className="w-9 h-9 rounded-full overflow-hidden shrink-0 hover:scale-105 active:scale-95 transition-transform duration-150 cursor-pointer shadow-glow"
        >
          {post.authorAvatar ? (
            <img src={post.authorAvatar} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-bold text-sm`}>
              {post.author.charAt(0)}
            </div>
          )}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onVisitProfile(post.userId)}
              className="text-sm font-semibold text-white hover:text-accent-cyan hover:underline transition-all text-left cursor-pointer"
            >
              {post.author}
            </button>
            <span className="text-[10px] text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-1.5 py-0.5 rounded-full font-mono">
              LVL {post.authorLevel}
            </span>
            {post.tag && (
              <span className="text-[10px] text-slate-400 bg-surface-700 px-2 py-0.5 rounded-full border border-white/[0.06]">
                #{post.tag}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">{timeAgo(post.timestamp)}</p>
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-slate-300 leading-relaxed mb-4">{post.content}</p>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-3 border-t border-white/[0.05]">
        <button
          onClick={handleLike}
          className={cn(
            'flex items-center gap-1.5 text-xs font-medium transition-colors',
            liked ? 'text-red-400' : 'text-slate-500 hover:text-red-400'
          )}
        >
          <Heart className={cn('w-4 h-4', liked && 'fill-red-400')} />
          {likeCount}
        </button>
        <button
          onClick={() => setShowReply(!showReply)}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-white transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          {commentCount} comments
        </button>
        <button className="ml-auto text-[11px] text-slate-600 hover:text-slate-400 transition-colors">Share</button>
      </div>

      {/* Reply input & Comments */}
      <AnimatePresence>
        {showReply && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {comments.length > 0 && (
              <div className="space-y-2 mt-3 pt-3 border-t border-white/[0.05] max-h-48 overflow-y-auto pr-1">
                {comments.map((c: any) => (
                  <div key={c.id} className="text-xs bg-surface-700/40 p-2.5 rounded-lg border border-white/[0.03]">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-white">{c.author_name}</span>
                      <span className="text-slate-500 font-mono">{timeAgo(c.created_at)}</span>
                    </div>
                    <p className="text-slate-300">{c.content}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.05]">
              <input
                type="text"
                placeholder="Write a comment..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleCreateComment(); }}
                className="flex-1 bg-surface-700 border border-white/[0.08] focus:border-accent-cyan/50 rounded-lg px-3 py-2 text-sm text-white outline-none transition-all placeholder:text-slate-600"
              />
              <button
                onClick={handleCreateComment}
                disabled={!replyText.trim()}
                className="w-8 h-8 rounded-lg bg-accent-cyan hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed text-black flex items-center justify-center transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Create Post Modal ────────────────────────────────────────────────────────
function CreatePostModal({ onClose, onPostCreated }: { onClose: () => void; onPostCreated: () => void }) {
  const { dbUser } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handlePost = async () => {
    if (!content.trim() || !dbUser) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/forum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_post',
          uid: dbUser.id,
          title: title.trim() || content.slice(0, 60),
          content,
          category: tag || 'General',
          author_name: dbUser.name || 'Anonymous Operator',
          author_avatar: dbUser.avatar || ''
        })
      });
      if (res.ok) {
        onPostCreated();
        onClose();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to post. Please try again.');
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Network error. Make sure the API server is running.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        className="relative w-full max-w-lg bg-surface-800 border border-white/[0.08] rounded-2xl p-6 z-10"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-lg font-bold text-white">Create Post</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title input */}
        <input
          type="text"
          placeholder="Post title (optional)"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full bg-surface-700 border border-white/[0.08] focus:border-accent-cyan/40 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all placeholder:text-slate-600 mb-3"
        />

        <textarea
          placeholder="Share something with the community..."
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={5}
          className="w-full bg-surface-700 border border-white/[0.08] focus:border-accent-cyan/40 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-slate-600 resize-none mb-4"
        />

        <div className="flex items-center gap-2 mb-4">
          <Hash className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Category (e.g. CEH, OSINT, General...)"
            value={tag}
            onChange={e => setTag(e.target.value)}
            className="flex-1 bg-surface-700 border border-white/[0.08] focus:border-accent-cyan/40 rounded-lg px-3 py-2 text-sm text-white outline-none transition-all placeholder:text-slate-600"
          />
        </div>

        {error && (
          <p className="text-red-400 text-xs mb-4 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 font-mono">
            ⚠ {error}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-lg bg-surface-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <Image className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-lg bg-surface-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <Smile className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-xl border border-white/[0.08] text-slate-400 text-sm hover:text-white transition-colors">
              Cancel
            </button>
            <button
              disabled={!content.trim() || submitting}
              onClick={handlePost}
              className="px-5 py-2 rounded-xl bg-accent-cyan text-black font-semibold text-sm hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {submitting ? (
                <><span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" /> Posting...</>
              ) : 'Post'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Simple Messages Sidebar ──────────────────────────────────────────────────
interface ChatThread {
  id: string;
  name: string;
  username: string;
  avatar: string | null;
  role: string;
  lastMsg: string;
  time: string;
  unread: number;
  online: boolean;
  discriminator?: string;
}

interface Message {
  id: number;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
  is_read: number;
  reply_to_id?: number | null;
  is_edited?: number;
}

interface SearchedUser {
  id: string;
  username: string;
  name: string;
  role: string;
  avatar: string | null;
  discriminator?: string;
}

function MessagesPanel({ 
  onUnreadUpdated, 
  initialChatUser, 
  onClearInitialChatUser, 
  onVisitProfile 
}: { 
  onUnreadUpdated: (count: number) => void;
  initialChatUser: SearchedUser | null;
  onClearInitialChatUser: () => void;
  onVisitProfile: (uid: string) => void;
}) {
  const { dbUser } = useAuth();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [loadingThreads, setLoadingThreads] = useState(false);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [activeChatUser, setActiveChatUser] = useState<SearchedUser | ChatThread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [message, setMessage] = useState('');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchedUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Message options states
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialChatUser) {
      setSelectedChat(initialChatUser.id);
      setActiveChatUser(initialChatUser);
      onClearInitialChatUser();
    }
  }, [initialChatUser]);

  const colors = [
    'from-cyan-500 to-blue-600',
    'from-violet-500 to-purple-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-rose-500',
    'from-pink-500 to-violet-500'
  ];

  const getAvatarColor = (name: string) => {
    const sum = (name || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[sum % colors.length];
  };

  const formatTime = (ts: string) => {
    if (!ts) return '';
    const date = new Date(ts);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString([], { day: '2-digit', month: 'short' });
  };

  const fetchThreads = async () => {
    if (!dbUser || !dbUser.id) return;
    try {
      const res = await fetch(`/api/chat?uid=${dbUser.id}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setThreads(data);
          const sum = data.reduce((acc: number, t: any) => acc + (t.unread || 0), 0);
          onUnreadUpdated(sum);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async (otherId: string) => {
    if (!dbUser || !dbUser.id) return;
    try {
      const res = await fetch(`/api/chat?uid=${dbUser.id}&chat_with=${otherId}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setMessages(data);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch threads on load
  useEffect(() => {
    if (!dbUser) return;
    setLoadingThreads(true);
    fetchThreads().finally(() => setLoadingThreads(false));

    const interval = setInterval(fetchThreads, 6000);
    return () => clearInterval(interval);
  }, [dbUser]);

  // Fetch messages when chat is selected
  useEffect(() => {
    if (!selectedChat || !dbUser) return;
    setLoadingMessages(true);
    // Reset options on chat switch
    setReplyingTo(null);
    setEditingMessage(null);
    setActiveMenuId(null);
    setMessage('');

    fetchMessages(selectedChat).finally(() => setLoadingMessages(false));

    const interval = setInterval(() => {
      fetchMessages(selectedChat);
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedChat, dbUser]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Search debounce
  useEffect(() => {
    if (!searchQuery.trim() || !dbUser || !dbUser.id) {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/chat?uid=${dbUser.id}&search=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setSearchResults(data);
          } else {
            setSearchResults([]);
          }
        }
      } catch (err) {
        console.error(err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, dbUser]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!message.trim() || !selectedChat || !dbUser) return;

    const msgText = message.trim();
    setMessage('');

    if (editingMessage) {
      const currentEditing = editingMessage;
      setEditingMessage(null);
      try {
        const res = await fetch(`/api/chat?uid=${dbUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message_id: currentEditing.id,
            message: msgText
          })
        });
        if (res.ok) {
          fetchMessages(selectedChat);
        }
      } catch (err) {
        console.error(err);
      }
      return;
    }

    const replyId = replyingTo ? replyingTo.id : null;
    setReplyingTo(null);

    try {
      const res = await fetch(`/api/chat?uid=${dbUser.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiver_id: selectedChat,
          message: msgText,
          reply_to_id: replyId
        })
      });
      if (res.ok) {
        fetchMessages(selectedChat);
        fetchThreads();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (!dbUser || !selectedChat) return;
    try {
      const res = await fetch(`/api/chat?uid=${dbUser.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message_id: messageId
        })
      });
      if (res.ok) {
        fetchMessages(selectedChat);
        fetchThreads();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startChat = (user: SearchedUser) => {
    setActiveChatUser(user);
    setSelectedChat(user.id);
    setSearchQuery('');
    setSearchResults([]);
    setMessages([]);
  };

  const openThread = (thread: ChatThread) => {
    setActiveChatUser(thread);
    setSelectedChat(thread.id);
    setThreads(prev => prev.map(t => t.id === thread.id ? { ...t, unread: 0 } : t));
  };

  if (selectedChat && activeChatUser) {
    return (
      <div className="flex flex-col h-[600px]">
        {/* Chat header */}
        <div className="flex items-center gap-3 p-4 border-b border-white/[0.06] bg-gradient-to-r from-surface-850 to-surface-800">
          <button 
            onClick={() => { setSelectedChat(null); setActiveChatUser(null); }} 
            className="text-slate-400 hover:text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onVisitProfile(activeChatUser.id)}
              className="w-9 h-9 rounded-full overflow-hidden shrink-0 hover:scale-105 active:scale-95 transition-transform duration-150 cursor-pointer shadow-glow"
            >
              {activeChatUser.avatar ? (
                <img src={activeChatUser.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${getAvatarColor(activeChatUser.name || '')} flex items-center justify-center text-white text-sm font-bold shadow-glow`}>
                  {(activeChatUser.name || 'O').charAt(0).toUpperCase()}
                </div>
              )}
            </button>
            <div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onVisitProfile(activeChatUser.id)}
                  className="text-sm font-semibold text-white hover:text-accent-cyan hover:underline transition-all text-left cursor-pointer"
                >
                  {activeChatUser.name || activeChatUser.username}
                </button>
                <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-mono scale-90">
                  {activeChatUser.role || 'operator'}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono">@{activeChatUser.username || 'operator'}#{(activeChatUser as any).discriminator || getDiscriminator(activeChatUser.id)}</p>
            </div>
          </div>
        </div>

        {/* Messages list */}
        <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-black/10">
          {loadingMessages ? (
            <div className="text-center py-12 text-slate-600 font-mono text-xs animate-pulse">
              Deciphering message logs...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-slate-600 font-mono text-xs">
              Establish a link. Send a secure transmission below.
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender_id === dbUser?.id;
              const hasBeenSeen = msg.is_read === 1;
              const isDeleted = msg.message.startsWith('🚫 This message was deleted');
              const parentMsg = msg.reply_to_id ? messages.find(m => m.id === msg.reply_to_id) : null;

              return (
                <div key={msg.id} className={`flex group items-center gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                  {isMe && !isDeleted && (
                    <div className="relative opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0">
                      <button
                        type="button"
                        onClick={() => setActiveMenuId(activeMenuId === msg.id ? null : msg.id)}
                        className="w-6 h-6 rounded-full hover:bg-white/10 text-slate-500 hover:text-white flex items-center justify-center transition-colors"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                      {activeMenuId === msg.id && (
                        <div className="absolute bottom-7 right-0 z-20 w-28 bg-surface-800 border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden py-1">
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingTo(msg);
                              setEditingMessage(null);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 hover:bg-white/[0.05] text-left text-xs font-mono text-slate-300 flex items-center gap-1.5"
                          >
                            <CornerUpLeft className="w-3 h-3 text-accent-cyan" /> Reply
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingMessage(msg);
                              setMessage(msg.message);
                              setReplyingTo(null);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 hover:bg-white/[0.05] text-left text-xs font-mono text-slate-300 flex items-center gap-1.5"
                          >
                            <Edit2 className="w-3 h-3 text-accent-cyan" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleDeleteMessage(msg.id);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 hover:bg-white/[0.05] text-left text-xs font-mono text-red-400 hover:text-red-300 flex items-center gap-1.5"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className={`relative max-w-[75%] rounded-2xl px-4 py-2.5 text-sm font-mono leading-relaxed ${
                    isMe 
                      ? 'bg-accent-cyan text-black font-semibold rounded-tr-sm shadow-glow-cyan' 
                      : 'bg-surface-700 text-slate-300 rounded-tl-sm border border-white/[0.04]'
                  }`}>
                    {/* Quoted parent message reply rendering inside bubble */}
                    {parentMsg && (
                      <div className={`mb-1.5 p-2 rounded-lg border-l-4 text-xs font-mono select-none text-left ${
                        isMe 
                          ? 'bg-black/10 border-accent-cyan/60 text-black/80' 
                          : 'bg-white/5 border-accent-cyan/60 text-slate-400'
                      }`}>
                        <div className="font-bold text-[10px] uppercase">
                          {parentMsg.sender_id === dbUser?.id ? 'You' : (activeChatUser.name || 'Operator')}
                        </div>
                        <p className="truncate opacity-80 mt-0.5">{parentMsg.message}</p>
                      </div>
                    )}

                    <p className={`break-words ${isDeleted ? 'italic opacity-60 font-sans' : ''}`}>{msg.message}</p>
                    
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className={`text-[9px] font-mono ${isMe ? 'text-black/60' : 'text-slate-500'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {msg.is_edited === 1 && ' (edited)'}
                      </span>
                      {isMe && (
                        hasBeenSeen ? (
                          <CheckCheck className="w-3.5 h-3.5 text-blue-600 font-bold shrink-0" />
                        ) : (
                          <CheckCheck className="w-3.5 h-3.5 text-black/40 font-bold shrink-0" />
                        )
                      )}
                    </div>
                  </div>

                  {!isMe && !isDeleted && (
                    <div className="relative opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0">
                      <button
                        type="button"
                        onClick={() => setActiveMenuId(activeMenuId === msg.id ? null : msg.id)}
                        className="w-6 h-6 rounded-full hover:bg-white/10 text-slate-500 hover:text-white flex items-center justify-center transition-colors"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                      {activeMenuId === msg.id && (
                        <div className="absolute bottom-7 left-0 z-20 w-28 bg-surface-800 border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden py-1">
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingTo(msg);
                              setEditingMessage(null);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 hover:bg-white/[0.05] text-left text-xs font-mono text-slate-300 flex items-center gap-1.5"
                          >
                            <CornerUpLeft className="w-3 h-3 text-accent-cyan" /> Reply
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply/Edit Preview Overlay Bar */}
        {(replyingTo || editingMessage) && (
          <div className="px-4 py-2 bg-surface-800 border-t border-white/[0.06] flex items-center justify-between animate-fade-in font-mono text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              {replyingTo ? (
                <>
                  <CornerUpLeft className="w-3.5 h-3.5 text-accent-cyan animate-pulse" />
                  <span>
                    Replying to <strong className="text-white">{replyingTo.sender_id === dbUser?.id ? 'You' : (activeChatUser.name || 'Operator')}</strong>: 
                    <span className="italic opacity-85 ml-1">"{replyingTo.message.length > 40 ? replyingTo.message.slice(0, 40) + '...' : replyingTo.message}"</span>
                  </span>
                </>
              ) : (
                <>
                  <Edit2 className="w-3.5 h-3.5 text-accent-cyan animate-pulse" />
                  <span>
                    Editing Message: 
                    <span className="italic opacity-85 ml-1">"{editingMessage!.message.length > 40 ? editingMessage!.message.slice(0, 40) + '...' : editingMessage!.message}"</span>
                  </span>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setReplyingTo(null);
                if (editingMessage) {
                  setEditingMessage(null);
                  setMessage('');
                }
              }}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Message Input Form */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-white/[0.06] bg-surface-850 flex gap-2">
          <input
            type="text"
            placeholder={editingMessage ? "Edit message..." : "Send secure transmission..."}
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="flex-1 bg-surface-700 border border-white/[0.08] focus:border-accent-cyan/40 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all placeholder:text-slate-600 font-mono"
          />
          <button 
            type="submit" 
            disabled={!message.trim()}
            className="w-10 h-10 rounded-xl bg-accent-cyan text-black flex items-center justify-center hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-glow-cyan"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px]">
      {/* Search Input Header */}
      <div className="p-4 border-b border-white/[0.06] bg-surface-850">
        <div className="relative">
          <input
            type="text"
            placeholder="Search operators by username..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-surface-700 border border-white/[0.08] focus:border-accent-cyan/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white outline-none transition-all placeholder:text-slate-600 font-mono"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          {searchQuery && (
            <button 
              onClick={() => { setSearchQuery(''); setSearchResults([]); }}
              className="absolute right-3 top-3 text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results / Threads List */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/[0.05]">
        {searchQuery.trim() !== '' ? (
          /* Search results view */
          isSearching ? (
            <div className="text-center py-12 text-slate-600 font-mono text-xs animate-pulse">
              Scanning database records...
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-12 text-slate-600 font-mono text-xs">
              No matching operator profiles found.
            </div>
          ) : (
            searchResults.map(user => (
              <div
                key={user.id}
                className="w-full flex items-center gap-3 px-4 py-3.5 border-l-2 border-transparent hover:border-l-accent-cyan/80 hover:bg-white/[0.02] transition-all text-left"
              >
                <button
                  type="button"
                  onClick={() => onVisitProfile(user.id)}
                  className="w-9 h-9 rounded-full overflow-hidden shrink-0 hover:scale-105 active:scale-95 transition-transform duration-150 cursor-pointer shadow-glow"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getAvatarColor(user.name || '')} flex items-center justify-center text-white text-sm font-bold shadow-glow`}>
                      {(user.name || 'O').charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => startChat(user)}
                  className="flex-1 text-left min-w-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white truncate">{user.name || user.username}</span>
                    <span className="text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-slate-400 font-mono">
                      {user.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">@{user.username}#{user.discriminator || getDiscriminator(user.id)}</p>
                </button>
                <button
                  type="button"
                  onClick={() => startChat(user)}
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))
          )
        ) : (
          /* Active Threads list */
          loadingThreads ? (
            <div className="text-center py-12 text-slate-600 font-mono text-xs animate-pulse">
              Loading active chat logs...
            </div>
          ) : threads.length === 0 ? (
            <div className="text-center py-16 text-slate-600 font-mono text-xs px-4">
              <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-30 text-accent-cyan" />
              No active link logs. Use the search field above to find registered operator usernames and initialize connection.
            </div>
          ) : (
            threads.map(thread => (
              <div
                key={thread.id}
                className="w-full flex items-center gap-3 px-4 py-3.5 border-l-2 border-transparent hover:border-l-accent-cyan/80 hover:bg-white/[0.02] transition-all text-left"
              >
                <button
                  type="button"
                  onClick={() => onVisitProfile(thread.id)}
                  className="relative shrink-0 hover:scale-105 active:scale-95 transition-transform duration-150 cursor-pointer w-9 h-9 rounded-full overflow-hidden"
                >
                  {thread.avatar ? (
                    <img src={thread.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getAvatarColor(thread.name)} flex items-center justify-center text-white text-sm font-bold shadow-glow`}>
                      {thread.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {thread.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-accent-emerald border-2 border-surface-800 z-10" />}
                </button>
                <button
                  type="button"
                  onClick={() => openThread(thread)}
                  className="flex-1 text-left min-w-0"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-white truncate">{thread.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0">{formatTime(thread.time)}</span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 font-mono">@{thread.username}#{thread.discriminator || getDiscriminator(thread.id)}</p>
                  <p className="text-[12px] text-slate-400 truncate font-mono mt-0.5">{thread.lastMsg}</p>
                </button>
                {thread.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-accent-cyan text-black text-[9px] font-bold flex items-center justify-center shrink-0 shadow-glow-cyan">
                    {thread.unread}
                  </span>
                )}
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}

// ── Community Page ───────────────────────────────────────────────────────────
export default function CommunityPage() {
  const { dbUser } = useAuth();
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('feed');
  const [showCreate, setShowCreate] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUnread, setTotalUnread] = useState(0);

  // Poll for total unread messages in the background
  useEffect(() => {
    if (!dbUser || !dbUser.id) return;
    const updateUnread = async () => {
      try {
        const res = await fetch(`/api/chat?uid=${dbUser.id}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const sum = data.reduce((acc: number, t: any) => acc + (t.unread || 0), 0);
            setTotalUnread(sum);
          }
        }
      } catch {}
    };
    updateUnread();
    const interval = setInterval(updateUnread, 10000);
    return () => clearInterval(interval);
  }, [dbUser]);

  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [initialChatUser, setInitialChatUser] = useState<SearchedUser | null>(null);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/forum');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error('Error fetching forum posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const mappedPosts = posts.map(p => ({
    id: p.id,
    title: p.title,
    content: p.content,
    author: p.author_name || 'Anonymous Operator',
    authorLevel: p.user_id === 'mock-admin-888' ? 99 : 5,
    tag: p.category || 'General',
    timestamp: p.created_at || new Date().toISOString(),
    likes: p.likes || 0,
    comments: parseInt(p.comment_count || '0', 10),
    liked: false,
    userId: p.user_id,
    authorAvatar: p.author_avatar
  }));

  return (
    <div className="min-h-screen bg-surface-900 pt-16 flex">
      <aside className={cn(
        "w-[240px] shrink-0 bg-surface-850 border-r border-white/[0.06] flex flex-col fixed left-0 bottom-0 overflow-y-auto z-30 transition-all",
        dbUser?.role === 'admin' ? "top-[108px]" : "top-16"
      )}>
        {/* Create button */}
        <div className="p-3">
          <button
            onClick={() => setShowCreate(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-surface-700 border border-white/[0.08] hover:bg-surface-600 hover:border-white/20 text-slate-300 hover:text-white text-sm font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            Create
          </button>
        </div>

        <div className="px-2 py-1 space-y-0.5">
          <button
            onClick={() => setSidebarTab('feed')}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
              sidebarTab === 'feed'
                ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20'
                : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
            )}
          >
            <Hash className="w-4 h-4" />
            Feed
          </button>
          <button
            onClick={() => setSidebarTab('messages')}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
              sidebarTab === 'messages'
                ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20'
                : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
            )}
          >
            <MessageSquare className="w-4 h-4" />
            Messages
            {/* Unread badge */}
            {totalUnread > 0 && (
              <span className="ml-auto w-5 h-5 rounded-full bg-accent-cyan text-black text-[9px] font-bold flex items-center justify-center shadow-glow-cyan animate-pulse">
                {totalUnread}
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 ml-[240px] p-6 max-w-[900px]">
        {loading ? (
          <div className="min-h-[50vh] flex items-center justify-center font-mono select-none">
            <div className="text-center space-y-4">
              <Shield className="w-12 h-12 text-accent-cyan animate-spin mx-auto" />
              <p className="text-body-sm font-bold text-accent-cyan uppercase tracking-widest">
                CONNECTING TO COMMNET FEED...
              </p>
            </div>
          </div>
        ) : sidebarTab === 'messages' ? (
          <div className="bg-surface-850/60 backdrop-blur-md border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl flex flex-col transition-all">
            <div className="px-5 py-4 border-b border-white/[0.06] bg-gradient-to-r from-surface-800 to-surface-850">
              <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-accent-cyan" />
                Messages
              </h2>
            </div>
            <MessagesPanel 
              onUnreadUpdated={setTotalUnread} 
              initialChatUser={initialChatUser}
              onClearInitialChatUser={() => setInitialChatUser(null)}
              onVisitProfile={setSelectedProfileId}
            />
          </div>
        ) : (
          <>
            {/* Feed */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">Feed</h2>
              <button className="w-8 h-8 rounded-lg bg-surface-700 border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <Filter className="w-3.5 h-3.5" />
              </button>
            </div>

            {mappedPosts.length === 0 ? (
              <div className="text-center py-16 bg-surface-800 border border-white/[0.06] rounded-2xl">
                <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">Oops! No posts found!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {mappedPosts.map(post => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    onLikeUpdated={fetchPosts} 
                    onVisitProfile={setSelectedProfileId}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreate && (
          <CreatePostModal
            onClose={() => setShowCreate(false)}
            onPostCreated={fetchPosts}
          />
        )}
      </AnimatePresence>

      {/* User Profile Modal Overlay */}
      <AnimatePresence>
        {selectedProfileId && (
          <UserProfileModal
            userId={selectedProfileId}
            onClose={() => setSelectedProfileId(null)}
            onStartChat={(user) => {
              setInitialChatUser(user);
              setSidebarTab('messages');
              setSelectedProfileId(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
