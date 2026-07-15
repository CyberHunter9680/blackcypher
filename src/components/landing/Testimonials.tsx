import { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { Card, Avatar } from '../ui';
import { SectionReveal, RevealItem } from '../shared';
import { cn } from '../../lib/utils';
import { FeedbackModal } from './FeedbackModal';

/* ── Marquee keyframe injected once ── */
const marqueeCSS = `
@keyframes marquee-left {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee-left 32s linear infinite;
}
.marquee-track:hover {
  animation-play-state: paused;
}
`;

interface Feedback {
  id: number;
  uid: string;
  name: string;
  rating: number;
  message: string;
  submitted_at: string;
}

export function Testimonials() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  useEffect(() => {
    const fetchPublishedFeedbacks = async () => {
      try {
        const res = await fetch('/api/feedback?published=true');
        if (res.ok) {
          const data = await res.json();
          setFeedbacks(Array.isArray(data) ? data : []);
        } else {
          setFeedbacks([]);
        }
      } catch {
        setFeedbacks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPublishedFeedbacks();
  }, []);

  // Duplicate list for seamless marquee loop (need at least 2 copies)
  const doubled = feedbacks.length > 0
    ? [...feedbacks, ...feedbacks]
    : [];

  return (
    <section className="relative py-24 md:py-32">
      <style>{marqueeCSS}</style>

      <div className="max-w-7xl mx-auto px-6">
        <SectionReveal>
          <RevealItem className="text-center mb-16">
            <span className="text-caption font-medium text-accent-cyan uppercase tracking-widest">Testimonials</span>
            <h2 className="font-heading text-3xl md:text-display-sm font-bold text-white mt-3 mb-4">
              Trusted by security professionals
            </h2>
            <p className="text-body-lg text-slate-400 max-w-2xl mx-auto">
              Hear from the operators who advanced their careers with Black Cypher SpecOps.
            </p>
          </RevealItem>
        </SectionReveal>
      </div>

      {/* Testimonials Marquee */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
        </div>
      ) : feedbacks.length === 0 ? (
        /* Empty state — no fake data */
        <div className="max-w-2xl mx-auto px-6 text-center py-8">
          <div className="glass rounded-2xl p-10 border border-white/[0.06]">
            <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 text-sm font-mono">
              No testimonials yet. Be the first to share your experience!
            </p>
          </div>
        </div>
      ) : (
        /* Full-width scroll track with side fade masks */
        <div
          className="relative overflow-hidden w-full"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          }}
        >
          <div className="marquee-track py-4">
            {doubled.map((feedback, idx) => (
              <div
                key={`${feedback.id}-${idx}`}
                className="flex-shrink-0 w-80 mx-3"
              >
                <Card variant="glass" hover className="p-6 h-full flex flex-col">
                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'w-4 h-4',
                          i < feedback.rating
                            ? 'fill-accent-cyan text-accent-cyan'
                            : 'text-slate-700'
                        )}
                      />
                    ))}
                  </div>

                  {/* Message */}
                  <p className="text-body text-slate-300 mb-6 flex-1 leading-relaxed line-clamp-4">
                    &ldquo;{feedback.message}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                    <Avatar name={feedback.name} size="sm" />
                    <div>
                      <div className="text-body-sm font-medium text-white">{feedback.name}</div>
                      <div className="text-caption text-slate-500">
                        {new Date(feedback.submitted_at).toLocaleDateString('en-IN', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA: Share your feedback */}
      <div className="max-w-7xl mx-auto px-6 mt-12 text-center">
        <SectionReveal>
          <RevealItem>
            <p className="text-slate-500 text-sm mb-4 font-mono">
              Completed a course or training? Share your experience.
            </p>
            <button
              onClick={() => setFeedbackModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-accent-cyan/30 bg-accent-cyan/5 text-accent-cyan text-sm font-semibold hover:bg-accent-cyan/15 hover:border-accent-cyan/60 transition-all duration-300 font-mono uppercase tracking-wider shadow-[0_0_20px_rgba(34,211,238,0.06)] hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]"
            >
              <MessageSquare className="w-4 h-4" />
              Share Your Experience
            </button>
          </RevealItem>
        </SectionReveal>
      </div>

      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
      />
    </section>
  );
}
