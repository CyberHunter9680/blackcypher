import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Footer } from '../../components/layout';
import { SectionReveal, RevealItem } from '../../components/shared';
import { FileText, Search, Shield, User, Calendar, ArrowRight, Database } from 'lucide-react';

interface Blog {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
}

export default function BlogHubPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/blogs');
      if (res.ok) {
        setBlogs(await res.json());
      }
    } catch (err) {
      console.error('Error fetching security intelligence blogs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to extract category tags or dynamically assign them based on content/title keywords
  const getTagsForBlog = (blog: Blog): string[] => {
    const tags = ['INTEL'];
    const text = (blog.title + ' ' + blog.content).toUpperCase();
    if (text.includes('ZERO-DAY') || text.includes('VULNERABILITY') || text.includes('CVE')) {
      tags.push('ZERO-DAY');
    }
    if (text.includes('OSINT') || text.includes('RECON')) {
      tags.push('OSINT');
    }
    if (text.includes('REVERSE') || text.includes('EXPLOIT') || text.includes('REVERSING')) {
      tags.push('RED-TEAM');
    }
    if (text.includes('MALWARE') || text.includes('PHISHING') || text.includes('CEH')) {
      tags.push('CEH-STUDY');
    }
    if (tags.length === 1) {
      tags.push('SEC-OPS');
    }
    return tags;
  };

  // Filter blogs based on search text and selected tag
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          blog.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTag === 'ALL') return matchesSearch;
    const blogTags = getTagsForBlog(blog);
    return matchesSearch && blogTags.includes(selectedTag);
  });

  const allTags = ['ALL', 'ZERO-DAY', 'OSINT', 'RED-TEAM', 'CEH-STUDY', 'SEC-OPS', 'INTEL'];

  return (
    <div className="min-h-screen bg-surface-950 text-white relative overflow-hidden font-sans">
      {/* Immersive Background Aesthetics */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.03),transparent_60%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      
      {/* Decorative cyber grid lines */}
      <div className="absolute top-0 right-1/4 w-[1px] h-full bg-cyan-500/[0.02] border-r border-dashed border-cyan-500/[0.01] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[1px] h-full bg-violet-500/[0.02] border-r border-dashed border-violet-500/[0.01] pointer-events-none" />

      <Navbar />

      <main className="relative pt-32 pb-24 px-6 max-w-6xl mx-auto">
        <SectionReveal>
          {/* Header Banner */}
          <RevealItem className="text-center mb-16">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)] animate-pulse">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-widest uppercase flex items-center justify-center gap-2">
              <Shield className="w-3.5 h-3.5" /> SECURITY INTELLIGENCE FEED
            </span>
            <h1 className="font-heading text-3xl md:text-5xl font-extrabold text-white mt-3 tracking-tight">
              Threat Advisories & Advises
            </h1>
            <p className="text-slate-400 mt-3 font-mono text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
              Operational vulnerability disclosures, network forensics documentation, and defensive strategy reports curated by Black Cypher SpecOps command staff.
            </p>
          </RevealItem>

          {/* Filtering Section */}
          <RevealItem className="mb-12 space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search Field */}
              <div className="w-full md:max-w-md relative font-mono text-xs">
                <input 
                  type="text" 
                  placeholder="DECRYPT & FILTER TERM..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-900/60 border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:glow-cyan placeholder:text-slate-600 transition-all duration-300"
                />
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              </div>

              {/* Tag filters */}
              <div className="flex flex-wrap gap-2 justify-center">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold transition-all duration-300 border ${
                      selectedTag === tag 
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 glow-cyan font-extrabold' 
                        : 'bg-surface-900/20 border-white/[0.04] text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </RevealItem>

          {/* Blogs Grid */}
          <RevealItem>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 font-mono text-slate-500 space-y-4">
                <Database className="w-10 h-10 text-cyan-500 animate-pulse" />
                <span className="text-xs uppercase tracking-widest animate-pulse">Establishing Secure Ledger Handshake...</span>
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="glass p-16 text-center rounded-2xl border border-white/[0.06] bg-surface-900/20 max-w-2xl mx-auto">
                <Shield className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="font-heading text-lg font-bold text-white uppercase tracking-wider mb-2">Zero Advisories Resolved</h3>
                <p className="text-slate-400 font-mono text-xs leading-relaxed">
                  No active files matched query parameters on current clearance level. Check syntax or widen tags.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredBlogs.map(blog => {
                  const tags = getTagsForBlog(blog);
                  return (
                    <div 
                      key={blog.id} 
                      className="group relative flex flex-col justify-between glass p-6 rounded-2xl border border-white/[0.06] bg-surface-900/40 backdrop-blur-md hover:border-cyan-500/30 hover:glow-cyan transition-all duration-500 overflow-hidden"
                    >
                      {/* Interactive neon accent header line */}
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                      
                      <div>
                        {/* Tags & Metadata */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                          <div className="flex gap-1.5">
                            {tags.map(t => (
                              <span 
                                key={t} 
                                className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase font-bold tracking-widest border ${
                                  t === 'ZERO-DAY' 
                                    ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                                    : t === 'RED-TEAM'
                                    ? 'bg-violet-500/10 border-violet-500/30 text-violet-400'
                                    : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                                }`}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                          <span className="text-[9px] font-mono text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(blog.created_at).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-heading text-lg font-bold text-white group-hover:text-cyan-400 transition-colors duration-300 tracking-wide line-clamp-2">
                          {blog.title}
                        </h3>

                        {/* Snippet (First 150 chars) */}
                        <p className="text-xs text-slate-400 font-mono mt-3 leading-relaxed line-clamp-3 bg-black/20 p-3 rounded-lg border border-white/[0.02]">
                          {blog.content.replace(/[#*`_]/g, '')}
                        </p>
                      </div>

                      {/* Author Signature & CTA */}
                      <div className="flex items-center justify-between border-t border-white/[0.04] pt-4 mt-6">
                        <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
                          <div className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                            <User className="w-3. h-3" />
                          </div>
                          <span>Signed: <span className="text-white font-semibold">{blog.author}</span></span>
                        </div>

                        <Link to={`/blog/${blog.id}`}>
                          <button className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-mono text-[10px] uppercase font-bold tracking-widest border border-cyan-500/20 hover:border-cyan-500/40 bg-cyan-500/5 hover:bg-cyan-500/10 px-3 py-1.5 rounded-lg transition-all duration-300">
                            Read report
                            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </RevealItem>
        </SectionReveal>
      </main>

      <Footer />
    </div>
  );
}
