import { useState, useEffect } from 'react';
import { Navbar } from '../../components/layout';
import { Card, Button, Badge } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { 
  MessageSquare, ThumbsUp, Send, Plus, Search, ChevronRight, 
  Terminal, User, Filter, ArrowLeft 
} from 'lucide-react';

interface ForumPost {
  id: number;
  title: string;
  content: string;
  category: string;
  user_id: string;
  author_name: string;
  author_avatar: string | null;
  likes: number;
  comment_count: number;
  created_at: string;
}

interface ForumComment {
  id: number;
  post_id: number;
  content: string;
  user_id: string;
  author_name: string;
  author_avatar: string | null;
  created_at: string;
}

export default function CommunityPage() {
  const { dbUser } = useAuth();
  
  // State variables
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Post/Comment form states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [commentText, setCommentText] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['All', 'General', 'Web Exploits', 'Lab Help', 'Tool Updates', 'Career Talk'];

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const catParam = categoryFilter !== 'All' ? `?category=${categoryFilter}` : '';
      const res = await fetch(`/api/forum${catParam}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      } else {
        throw new Error('API down');
      }
    } catch (err) {
      console.warn('PostgreSQL database not synced. Loading premium mock forum.');
      // Beautiful mock fallbacks
      const mockPosts: ForumPost[] = [
        {
          id: 1,
          title: 'How to bypass secure anti-debugging flags in sandbox container?',
          content: 'I have tried using standard reverse engineering bypasses on lesson 4 but anti-debugging triggers every time. Any thoughts?',
          category: 'Lab Help',
          user_id: 'user-1',
          author_name: 'CyberNinja_99',
          author_avatar: null,
          likes: 12,
          comment_count: 3,
          created_at: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          id: 2,
          title: 'Web Exploit: SQL injection vs Blind injection cheatsheet',
          content: 'Here is a comprehensive cheatsheet I drafted for sanitizing standard query triggers. Feel free to copy into your hacking manual vault.',
          category: 'Web Exploits',
          user_id: 'user-2',
          author_name: 'Elite_Operator',
          author_avatar: null,
          likes: 24,
          comment_count: 1,
          created_at: new Date(Date.now() - 3600000 * 10).toISOString()
        },
        {
          id: 3,
          title: 'What certificates hold the highest weight in industry recruitments currently?',
          content: 'Debating between focusing on CEH v13 vs other red team paths. Which ones do recruiters actually verify?',
          category: 'Career Talk',
          user_id: 'user-3',
          author_name: 'SecOps_Pro',
          author_avatar: null,
          likes: 8,
          comment_count: 0,
          created_at: new Date(Date.now() - 3600000 * 24).toISOString()
        }
      ];
      setPosts(mockPosts);
    } finally {
      setLoading(false);
    }
  };

  const fetchPostDetails = async (post: ForumPost) => {
    try {
      const res = await fetch(`/api/forum?id=${post.id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedPost(data.post);
        setComments(data.comments);
      } else {
        throw new Error('Failed');
      }
    } catch (e) {
      // Mock details
      setSelectedPost(post);
      const mockComments: ForumComment[] = [
        {
          id: 101,
          post_id: post.id,
          content: 'Try disabling standard ptrace attach checks in your local docker file. That bypassed anti-debugging filters for me!',
          user_id: 'user-4',
          author_name: 'Kernel_Hacker',
          author_avatar: null,
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 102,
          post_id: post.id,
          content: 'Excellent question. Make sure your local sandbox coordinates correspond to the target port.',
          user_id: 'admin-1',
          author_name: 'Master Admin Vimal',
          author_avatar: null,
          created_at: new Date(Date.now() - 1800000).toISOString()
        }
      ];
      setComments(mockComments);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [categoryFilter]);

  const handleLike = async (postId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch('/api/forum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'like_post',
          post_id: postId
        })
      });
      if (res.ok) {
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
        }
      }
    } catch (err) {
      // Local Mock Like Incrementation
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
      }
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      setFormError('Title and description cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    const payload = {
      action: 'create_post',
      uid: dbUser?.id || 'mock-user-123',
      title: newTitle,
      content: newContent,
      category: newCategory,
      author_name: dbUser?.name || dbUser?.email?.split('@')[0] || 'Operator',
      author_avatar: dbUser?.avatar || ''
    };

    try {
      const res = await fetch('/api/forum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        fetchPosts();
        setShowCreateModal(false);
        setNewTitle('');
        setNewContent('');
      } else {
        throw new Error('API post failed');
      }
    } catch (err) {
      // Local mock append
      const mockNewPost: ForumPost = {
        id: Date.now(),
        title: newTitle,
        content: newContent,
        category: newCategory,
        user_id: dbUser?.id || 'mock-user',
        author_name: dbUser?.name || 'Elite Operator',
        author_avatar: null,
        likes: 0,
        comment_count: 0,
        created_at: new Date().toISOString()
      };
      setPosts(prev => [mockNewPost, ...prev]);
      setShowCreateModal(false);
      setNewTitle('');
      setNewContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedPost) return;

    const payload = {
      action: 'create_comment',
      uid: dbUser?.id || 'mock-user-123',
      post_id: selectedPost.id,
      content: commentText,
      author_name: dbUser?.name || dbUser?.email?.split('@')[0] || 'Operator',
      author_avatar: dbUser?.avatar || ''
    };

    try {
      const res = await fetch('/api/forum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setComments(prev => [...prev, data.comment]);
        setCommentText('');
        // increment comment count locally
        setPosts(prev => prev.map(p => p.id === selectedPost.id ? { ...p, comment_count: p.comment_count + 1 } : p));
      } else {
        throw new Error('Error');
      }
    } catch (err) {
      // Mock append
      const mockComment: ForumComment = {
        id: Date.now(),
        post_id: selectedPost.id,
        content: commentText,
        user_id: dbUser?.id || 'mock-user-123',
        author_name: dbUser?.name || 'Elite Operator',
        author_avatar: null,
        created_at: new Date().toISOString()
      };
      setComments(prev => [...prev, mockComment]);
      setCommentText('');
      setPosts(prev => prev.map(p => p.id === selectedPost.id ? { ...p, comment_count: p.comment_count + 1 } : p));
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#05070f] text-slate-300 font-sans pb-16">
      <Navbar />

      <main className="pt-24 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR TACTICAL CONTROLS */}
        <div className="lg:col-span-1 space-y-6 select-none">
          <div className="flex items-center justify-between">
            <h2 className="text-body-sm font-bold font-mono text-white tracking-widest uppercase flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-accent-cyan" /> Category Index
            </h2>
          </div>

          <div className="space-y-1.5">
            {categories.map(cat => {
              const active = categoryFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setCategoryFilter(cat);
                    setSelectedPost(null);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-[11px] text-left transition-all border ${
                    active 
                      ? 'bg-accent-cyan/10 border-accent-cyan/30 text-white font-bold shadow-glow-cyan/5' 
                      : 'bg-surface-900/20 border-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  <span>{cat}</span>
                  {active && <ChevronRight className="w-3.5 h-3.5 text-accent-cyan" />}
                </button>
              );
            })}
          </div>

          <Button
            variant="primary"
            glow="cyan"
            onClick={() => setShowCreateModal(true)}
            className="w-full bg-accent-cyan text-black font-mono font-bold uppercase tracking-wider text-xs py-3.5 flex items-center justify-center gap-1.5 rounded-xl"
          >
            <Plus className="w-4 h-4" /> Start Discussion
          </Button>
        </div>

        {/* FORUM FEED & DETAIL PANELS */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* SEARCH BAR (renders on feed list view) */}
          {!selectedPost && (
            <div className="flex gap-2">
              <div className="flex-1 bg-surface-900/60 border border-white/[0.06] rounded-xl px-4 py-3 flex items-center gap-3">
                <Search className="w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search hacker forum threads..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs text-white placeholder:text-slate-500 w-full font-mono"
                />
              </div>
              <Button 
                variant="outline" 
                onClick={fetchPosts} 
                className="font-mono text-xs border-white/[0.06] hover:bg-white/[0.02]"
              >
                Sync
              </Button>
            </div>
          )}

          {/* DYNAMIC VIEWPORTS */}
          {selectedPost ? (
            /* VIEWPORT A: DETAILED DISCUSSION THREAD WITH COMMENTS */
            <div className="space-y-6 font-mono">
              {/* Back CTA */}
              <button
                onClick={() => setSelectedPost(null)}
                className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-all text-xs font-mono select-none"
              >
                <ArrowLeft className="w-4 h-4" /> Return to discussion feed
              </button>

              {/* Main thread post Card */}
              <Card variant="glass" className="border-accent-cyan/20 p-6 relative overflow-hidden shadow-glow-cyan/5">
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-accent-cyan to-accent-violet"></div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs text-white font-bold">{selectedPost.author_name}</div>
                      <div className="text-[9px] text-slate-500 mt-0.5">{new Date(selectedPost.created_at).toLocaleString()}</div>
                    </div>
                  </div>
                  <Badge variant="cyan" className="text-[9px] uppercase font-bold px-2 py-0.5">
                    {selectedPost.category}
                  </Badge>
                </div>

                <h1 className="text-sm font-bold text-white leading-snug mb-3 uppercase tracking-wide">
                  {selectedPost.title}
                </h1>
                
                <p className="text-xs text-slate-300 leading-relaxed bg-[#020409]/60 p-4 rounded-xl border border-white/[0.04] whitespace-pre-wrap font-sans">
                  {selectedPost.content}
                </p>

                <div className="flex gap-4 border-t border-white/[0.04] pt-4 mt-4 select-none">
                  <button 
                    onClick={(e) => handleLike(selectedPost.id, e)}
                    className="flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-accent-cyan transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{selectedPost.likes} Kudos</span>
                  </button>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{comments.length} Answers</span>
                  </div>
                </div>
              </Card>

              {/* Comments/Replies list */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest pl-1">
                  Discussion Responses ({comments.length})
                </h3>

                {comments.length === 0 ? (
                  <div className="glass p-6 text-center text-slate-500 text-xs border border-white/[0.06] rounded-xl">
                    No solutions posted yet. Share your guidance below!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {comments.map(comment => (
                      <div key={comment.id} className="glass p-4 rounded-xl border border-white/[0.04] bg-surface-900/10 font-mono">
                        <div className="flex items-center gap-2 mb-2 select-none">
                          <div className="w-6 h-6 rounded-full bg-slate-800 border border-white/[0.08] flex items-center justify-center text-slate-400">
                            <User className="w-3 h-3" />
                          </div>
                          <div>
                            <div className="text-[10px] text-white font-bold">{comment.author_name}</div>
                            <div className="text-[8px] text-slate-600 mt-0.5">{new Date(comment.created_at).toLocaleString()}</div>
                          </div>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans bg-black/35 p-3 rounded-lg border border-white/[0.02]">
                          {comment.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Write response comment form */}
              <form onSubmit={handleCreateComment} className="glass p-4 rounded-xl border border-white/[0.06] space-y-3 bg-[#03050c]/80">
                <div className="text-[10px] font-bold text-accent-cyan uppercase tracking-wider select-none">
                  Draft solution response directive
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Provide technical solution, terminal instructions or comments..."
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    className="flex-1 bg-surface-950 border border-white/[0.08] focus:border-accent-cyan rounded-lg px-3 py-2.5 text-xs text-white outline-none transition-all"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    glow="cyan"
                    disabled={!commentText.trim()}
                    className="bg-accent-cyan text-black px-4 rounded-lg flex items-center gap-1 font-bold text-xs uppercase shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" /> Post
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            /* VIEWPORT B: DISCUSSION BULLETINS BOARD FEED */
            <div className="space-y-4">
              {loading ? (
                <div className="h-64 flex items-center justify-center text-xs font-mono text-slate-500 animate-pulse">
                  DOWNLOADING COMMUNITY DISCUSSION THREADS LEDGER...
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="glass p-12 text-center text-slate-500 font-mono text-xs border border-white/[0.06] rounded-2xl bg-surface-900/10">
                  <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                  <span className="font-bold text-white uppercase tracking-wider block">No Thread Bulletins Found</span>
                  <p className="text-[10px] text-slate-600 mt-1 max-w-sm mx-auto">
                    Try refining search keys or click "Start Discussion" to host the first query bulletin under {categoryFilter}.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPosts.map(post => (
                    <div
                      key={post.id}
                      onClick={() => fetchPostDetails(post)}
                      className="glass p-5 rounded-2xl border border-white/[0.04] bg-surface-900/10 hover:border-accent-cyan/30 hover:shadow-glow-cyan/5 transition-all duration-300 cursor-pointer font-mono"
                    >
                      <div className="flex justify-between items-start gap-4 mb-2 select-none">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-800 border border-white/[0.08] flex items-center justify-center text-slate-400">
                            <User className="w-3 h-3" />
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold">{post.author_name}</span>
                          <span className="text-[9px] text-slate-600">{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        <Badge variant="neutral" className="text-[8px] uppercase font-bold py-0.5 px-2">
                          {post.category}
                        </Badge>
                      </div>

                      <h2 className="text-xs font-bold text-white uppercase leading-snug tracking-wide group-hover:text-accent-cyan transition-colors mb-2">
                        {post.title}
                      </h2>

                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-sans mb-4">
                        {post.content}
                      </p>

                      <div className="flex gap-4 border-t border-white/[0.02] pt-3 select-none">
                        <button 
                          onClick={(e) => handleLike(post.id, e)}
                          className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-accent-cyan transition-all"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>{post.likes} Kudos</span>
                        </button>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500">
                          <MessageSquare className="w-3 h-3" />
                          <span>{post.comment_count} Answers</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* COMPONENT: DIALOG POST MODAL VIEW */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-[#020409]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card variant="glass" className="w-full max-w-xl border-accent-cyan/30 p-6 shadow-glow-cyan/10 font-mono text-xs space-y-4 relative">
            <h2 className="text-body-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/[0.06] pb-3 select-none">
              <Terminal className="w-5 h-5 text-accent-cyan" /> BroadCast secure inquiry
            </h2>

            {formError && (
              <div className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] rounded-lg">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="space-y-1">
                <label className="text-slate-400 uppercase text-[9px] font-bold">Category Index:</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full bg-black/60 border border-white/[0.08] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-accent-cyan outline-none"
                >
                  {categories.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 uppercase text-[9px] font-bold">Discussion Title / Question Topic:</label>
                <input
                  type="text"
                  placeholder="e.g. anti-debugging triggers in docker container lesson"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-black/60 border border-white/[0.08] focus:border-accent-cyan rounded-xl p-3 text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 uppercase text-[9px] font-bold">Write query details / description:</label>
                <textarea
                  placeholder="Elaborate on queries, specify target sandbox port logs..."
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  className="w-full bg-black/60 border border-white/[0.08] focus:border-accent-cyan rounded-xl p-3 text-xs text-white outline-none h-32"
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-white/[0.06] select-none">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 font-mono uppercase font-bold text-xs"
                >
                  Abort
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  glow="cyan"
                  loading={isSubmitting}
                  className="flex-1 bg-accent-cyan text-black font-mono uppercase font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Broadcast
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
