import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Send, CheckCircle2, MessageSquare, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const { dbUser } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState<'form' | 'submitting' | 'success' | 'error'>('form');
  const [errorMsg, setErrorMsg] = useState('');

  const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
  const ratingColors = ['', 'text-red-400', 'text-orange-400', 'text-yellow-400', 'text-emerald-400', 'text-accent-cyan'];

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep('form');
      setRating(0);
      setHoveredRating(0);
      setMessage('');
      setErrorMsg('');
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbUser) return;
    if (rating === 0) { setErrorMsg('Please select a star rating.'); return; }
    if (!message.trim()) { setErrorMsg('Please write a brief feedback message.'); return; }

    setStep('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: dbUser.id,
          name: dbUser.name || 'Anonymous Operator',
          rating,
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStep('success');
      } else {
        setErrorMsg(data.error || 'Submission failed. Please try again.');
        setStep('error');
      }
    } catch {
      setErrorMsg('Network error. Please check your connection.');
      setStep('error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg bg-surface-900 border border-accent-cyan/20 rounded-2xl relative overflow-hidden shadow-[0_0_60px_rgba(34,211,238,0.12)]">
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-cyan via-accent-violet to-accent-emerald" />

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-8">

                {/* Not logged in guard */}
                {!dbUser ? (
                  <div className="py-8 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-7 h-7 text-accent-violet" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-white mb-2">Sign In Required</h3>
                    <p className="text-slate-400 text-sm mb-6">
                      Please sign in to your Black Cypher account to submit feedback.
                    </p>
                    <Button variant="primary" glow="cyan" onClick={handleClose} className="w-full">
                      Go to Login
                    </Button>
                  </div>
                ) : step === 'success' ? (
                  /* ── SUCCESS STATE ── */
                  <div className="py-8 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    >
                      <CheckCircle2 className="w-16 h-16 text-accent-emerald mx-auto mb-5" />
                    </motion.div>
                    <h3 className="font-heading text-2xl font-bold text-white mb-2">Feedback Received!</h3>
                    <p className="text-slate-400 text-sm mb-2">
                      Thank you for your feedback, <span className="text-accent-cyan font-semibold">{dbUser.name?.split(' ')[0]}</span>!
                    </p>
                    <p className="text-slate-500 text-xs mb-8 font-mono">
                      Your review will appear on the platform after admin approval.
                    </p>

                    {/* Stars display */}
                    <div className="flex justify-center gap-1 mb-6">
                      {[1,2,3,4,5].map(s => (
                        <Star
                          key={s}
                          className={`w-6 h-6 ${s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-700'}`}
                        />
                      ))}
                    </div>

                    <Button variant="outline" onClick={handleClose} className="w-full">
                      Close
                    </Button>
                  </div>
                ) : (
                  /* ── FORM STATE ── */
                  <form onSubmit={handleSubmit}>
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-heading text-xl font-bold text-white">Share Your Experience</h3>
                        <p className="text-slate-500 text-xs mt-0.5 font-mono">Help others discover Black Cypher SpecOps</p>
                      </div>
                    </div>

                    {/* Star Rating Picker */}
                    <div className="mb-6">
                      <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-3">
                        Your Rating <span className="text-red-400">*</span>
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => setRating(star)}
                            className="transition-transform hover:scale-110 focus:outline-none"
                          >
                            <Star
                              className={`w-9 h-9 transition-all duration-150 ${
                                star <= (hoveredRating || rating)
                                  ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.5)]'
                                  : 'text-slate-700 hover:text-yellow-400/50'
                              }`}
                            />
                          </button>
                        ))}
                        {(hoveredRating || rating) > 0 && (
                          <span className={`text-sm font-semibold font-mono ml-2 ${ratingColors[hoveredRating || rating]}`}>
                            {ratingLabels[hoveredRating || rating]}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Message */}
                    <div className="mb-6">
                      <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Your Feedback <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Tell us about your experience — what did you learn, what stood out, how did we help?"
                        rows={4}
                        maxLength={500}
                        className="w-full bg-black/40 border border-white/[0.08] focus:border-accent-cyan/50 rounded-xl p-3 text-white text-sm placeholder:text-slate-600 outline-none resize-none transition-all focus:bg-black/60 font-sans leading-relaxed"
                      />
                      <div className="text-right text-[10px] text-slate-600 mt-1 font-mono">
                        {message.length}/500 characters
                      </div>
                    </div>

                    {/* Submitting as */}
                    <div className="flex items-center gap-2 mb-5 p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                      <div className="w-7 h-7 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center shrink-0">
                        <span className="text-[11px] font-bold text-accent-cyan">
                          {(dbUser.name || 'A').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">{dbUser.name || 'Anonymous Operator'}</div>
                        <div className="text-[10px] text-slate-500 font-mono">Submitting as verified user</div>
                      </div>
                    </div>

                    {/* Error */}
                    {errorMsg && (
                      <p className="text-red-400 text-xs mb-4 font-mono bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">
                        {errorMsg}
                      </p>
                    )}

                    {/* Submit */}
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      glow="cyan"
                      disabled={step === 'submitting'}
                      className="w-full flex items-center justify-center gap-2 uppercase font-bold tracking-wider text-sm"
                    >
                      {step === 'submitting' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Feedback
                        </>
                      )}
                    </Button>

                    <p className="text-[10px] text-slate-600 text-center mt-3 font-mono">
                      Feedback is reviewed by admin before publishing to the platform.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
