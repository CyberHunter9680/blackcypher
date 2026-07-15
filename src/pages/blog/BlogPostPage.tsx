import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar, Footer } from '../../components/layout';
import { SectionReveal, RevealItem } from '../../components/shared';
import { ArrowLeft, Calendar, User, Shield, Terminal, Check, Copy } from 'lucide-react';

interface Blog {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
}

// Custom simple parser to render Markdown elements beautifully
function MarkdownRenderer({ content }: { content: string }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Split content by blocks
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-6 font-sans text-slate-300 leading-relaxed text-sm md:text-base">
      {parts.map((part, index) => {
        // Render Code Block
        if (part.startsWith('```')) {
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          const lang = match ? match[1] : 'code';
          const codeText = match ? match[2].trim() : part.replace(/```/g, '').trim();

          return (
            <div key={index} className="relative rounded-xl border border-white/[0.08] bg-black/80 font-mono text-xs overflow-hidden my-6 group">
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.04] bg-white/[0.02]">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  {lang || 'TERMINAL CONSOLE'}
                </span>
                <button
                  onClick={() => handleCopy(codeText, index)}
                  className="p-1 rounded hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
                  title="Copy terminal command"
                >
                  {copiedIndex === index ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-cyan-400/90 leading-relaxed scrollbar-thin whitespace-pre select-all">
                <code>{codeText}</code>
              </pre>
            </div>
          );
        }

        // Render standard paragraph text, headings, bullet lists, blockquotes
        const lines = part.split('\n');
        return (
          <div key={index} className="space-y-4">
            {lines.map((line, lineIdx) => {
              const trimmed = line.trim();

              if (!trimmed) return null;

              // Render Headings
              if (trimmed.startsWith('###')) {
                return (
                  <h4 key={lineIdx} className="font-heading text-base md:text-lg font-bold text-white tracking-wide mt-6 border-l-2 border-cyan-500/40 pl-3">
                    {trimmed.replace(/###/g, '').trim()}
                  </h4>
                );
              }
              if (trimmed.startsWith('##')) {
                return (
                  <h3 key={lineIdx} className="font-heading text-lg md:text-xl font-bold text-white tracking-wide mt-8 flex items-center gap-2 border-b border-white/[0.06] pb-2">
                    <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
                    {trimmed.replace(/##/g, '').trim()}
                  </h3>
                );
              }
              if (trimmed.startsWith('#')) {
                return (
                  <h2 key={lineIdx} className="font-heading text-xl md:text-2xl font-black text-cyan-400 tracking-wider mt-10">
                    {trimmed.replace(/#/g, '').trim()}
                  </h2>
                );
              }

              // Render blockquotes
              if (trimmed.startsWith('>')) {
                return (
                  <blockquote key={lineIdx} className="border-l-4 border-cyan-500 bg-cyan-500/5 p-4 rounded-r-xl italic text-slate-300 my-4 text-xs md:text-sm leading-relaxed">
                    {trimmed.replace(/>/g, '').trim()}
                  </blockquote>
                );
              }

              // Render Lists
              if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
                return (
                  <ul key={lineIdx} className="list-none pl-5 my-2">
                    <li className="relative text-slate-300 pl-4 before:content-['•'] before:absolute before:left-0 before:text-cyan-400 before:font-bold">
                      {parseInlineStyles(trimmed.substring(1).trim())}
                    </li>
                  </ul>
                );
              }

              // Normal paragraph
              return (
                <p key={lineIdx} className="text-slate-300 font-sans leading-relaxed">
                  {parseInlineStyles(trimmed)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// Basic parser for **bold** and `code` inline styling
function parseInlineStyles(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="text-white font-extrabold font-heading">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={idx} className="bg-black/50 px-1.5 py-0.5 rounded text-cyan-400 font-mono text-[11px] border border-white/[0.04]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBlogDetails(id);
    }
  }, [id]);

  const fetchBlogDetails = async (blogId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/blogs?id=${blogId}`);
      if (res.ok) {
        setBlog(await res.json());
      }
    } catch (err) {
      console.error('Error fetching operational blog post:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Profile lookup details matching "Command Team Dossiers"
  const getAuthorDetails = (authorName: string) => {
    const defaultBio = {
      title: 'Operational Command Staff',
      bio: 'Instructors and threat researchers committed to producing premium cybersecurity analysis and sandboxed offensive study curriculums.',
    };

    if (authorName.includes('Abhishek Verma')) {
      return {
        title: 'Chief Executive Officer & Head of Offensive Security',
        bio: 'Abhishek Verma drives offensive program blueprints, focusing on elite threat intelligence methodologies, active red team simulations, and security diagnostics training.',
      };
    }

    if (authorName.includes('Deepak Dubat')) {
      return {
        title: 'Chief Technology Officer & Lead Infrastructure Architect',
        bio: 'Deepak Dubat is a B.Tech CSE (Cyber Security) student at Jaipur National University. Eager to gain hands-on experience, apply systems security skills, and explore DevSecOps / zero-trust paradigms.',
      };
    }

    return defaultBio;
  };

  return (
    <div className="min-h-screen bg-surface-950 text-white relative overflow-hidden font-sans">
      {/* Background radial effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.02),transparent_60%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
      
      {/* Decorative vertical lines */}
      <div className="absolute top-0 right-1/4 w-[1px] h-full bg-violet-500/[0.01] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[1px] h-full bg-cyan-500/[0.01] pointer-events-none" />

      <Navbar />

      <main className="relative pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <SectionReveal>
          {/* Back Navigation button */}
          <RevealItem className="mb-8">
            <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-cyan-400 transition-colors group">
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
              BACK TO BROADCAST FEED
            </Link>
          </RevealItem>

          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center font-mono text-xs text-slate-500 animate-pulse space-y-4">
              <Shield className="w-8 h-8 text-violet-500 animate-spin" />
              <span>DECRYPTING SECURE ADVISORY LEDGER...</span>
            </div>
          ) : !blog ? (
            <div className="glass p-12 text-center rounded-2xl border border-white/[0.06] bg-surface-900/20">
              <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h1 className="font-heading text-xl font-bold uppercase tracking-wider text-red-400">Advisory Not Located</h1>
              <p className="text-slate-400 text-xs font-mono mt-2">
                This intelligence log has either been archived, purged, or is locked above your clearance.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Heading Section */}
              <RevealItem className="border-b border-white/[0.06] pb-8">
                <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-widest uppercase flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> VERIFIED OPERATIONAL REPORT
                </span>
                <h1 className="font-heading text-2xl md:text-4xl font-extrabold text-white mt-3 tracking-tight leading-tight">
                  {blog.title}
                </h1>
                
                {/* Meta details */}
                <div className="flex flex-wrap gap-4 items-center mt-6 font-mono text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-400" />
                    <span>Signed: <span className="text-white font-semibold">{blog.author}</span></span>
                  </div>
                  <div className="hidden sm:block text-white/10">&bull;</div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-violet-400" />
                    <span>
                      {new Date(blog.created_at).toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </RevealItem>

              {/* Advisory Body */}
              <RevealItem className="bg-surface-900/20 glass p-6 md:p-8 rounded-2xl border border-white/[0.04]">
                <MarkdownRenderer content={blog.content} />
              </RevealItem>

              {/* Author Signature Info Box */}
              <RevealItem className="surface-card p-6 rounded-2xl border border-cyan-500/10 bg-surface-900/40 relative overflow-hidden my-12">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-cyan-500 to-violet-500"></div>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-mono text-base font-bold shrink-0">
                    {blog.author.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">COMMAND SIGNATORY SUMMARY</div>
                    <h4 className="font-heading text-sm font-bold text-white mt-1">{blog.author}</h4>
                    <div className="text-[10px] font-mono text-slate-500">{getAuthorDetails(blog.author).title}</div>
                    <p className="text-slate-400 font-sans text-xs mt-2 leading-relaxed">
                      {getAuthorDetails(blog.author).bio}
                    </p>
                  </div>
                </div>
              </RevealItem>
            </div>
          )}
        </SectionReveal>
      </main>

      <Footer />
    </div>
  );
}
