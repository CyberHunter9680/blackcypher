import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquarePlus, CheckCircle2, X } from 'lucide-react';
import { Card, Button } from '../ui';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';

export function FeedbackWidget() {
  const { dbUser } = useAuth();
  const [dismissed, setDismissed] = useState(() => {
    if (!dbUser) return true;
    return localStorage.getItem(`bc_feedback_${dbUser.id}`) === 'submitted' ||
           localStorage.getItem(`bc_feedback_${dbUser.id}`) === 'dismissed';
  });
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!dbUser || dismissed) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    setLoading(true);

    try {
      // Try to POST to feedback API — will work when DB is connected
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: dbUser.id,
          name: dbUser.name,
          rating,
          message,
          submitted_at: new Date().toISOString(),
        }),
      }).catch(() => {}); // Silent fail in mock mode
    } finally {
      setLoading(false);
    }

    localStorage.setItem(`bc_feedback_${dbUser.id}`, 'submitted');
    setSubmitted(true);
    setTimeout(() => setDismissed(true), 3000);
  };

  const handleDismiss = () => {
    localStorage.setItem(`bc_feedback_${dbUser.id}`, 'dismissed');
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <Card variant="glass" className="p-5 border-accent-cyan/10 relative overflow-hidden">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-accent-cyan/60 via-accent-violet/40 to-transparent" />

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center gap-3 py-4"
            >
              <CheckCircle2 className="w-10 h-10 text-accent-emerald" />
              <h3 className="font-heading font-bold text-white">Thank you!</h3>
              <p className="text-sm text-slate-400">Your feedback helps us improve Black Cypher.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
                    <MessageSquarePlus className="w-4 h-4 text-accent-cyan" />
                  </div>
                  <div>
                    <h3 className="text-body-sm font-semibold text-white">Share Your Feedback</h3>
                    <p className="text-[10px] text-slate-500 font-mono">One-time · Helps us improve</p>
                  </div>
                </div>
                <button type="button" onClick={handleDismiss} className="text-slate-600 hover:text-slate-400 transition-colors p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Star rating */}
              <div className="mb-3">
                <p className="text-[10px] font-mono text-slate-500 mb-2 uppercase tracking-wider">How would you rate Black Cypher?</p>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={cn(
                          'w-7 h-7 transition-colors',
                          star <= (hoverRating || rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-slate-600'
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <textarea
                placeholder="What can we improve? (optional)"
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={3}
                className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-accent-cyan/30 rounded-xl px-3 py-2.5 text-white text-sm outline-none transition-all placeholder:text-slate-600 font-sans resize-none mb-3"
              />

              <Button
                type="submit"
                variant="primary"
                glow="cyan"
                size="sm"
                loading={loading}
                disabled={rating === 0}
                className="w-full justify-center"
              >
                Submit Feedback
              </Button>
            </form>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
