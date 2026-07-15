import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, CheckCircle2, ShieldAlert, Check, School } from 'lucide-react';
import { Button } from '../ui';
import { useAuth } from '../../hooks/useAuth';

// Extend window interface to support Razorpay SDK global object
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  planName: string;
  price: number;
  interval: string;
  onSuccess?: (receiptUrl?: string) => void;
}

// Plans classified as campus/institutional bookings
const CAMPUS_PLAN_KEYWORDS = ['Bootcamp', 'Campus', 'Vanguard', 'Sovereign', 'Intensive'];

function getBookingType(planName: string): 'session_school' | 'training_individual' {
  if (CAMPUS_PLAN_KEYWORDS.some(k => planName.includes(k))) return 'session_school';
  return 'training_individual';
}

function getPlanKey(planName: string): string {
  const lower = planName.toLowerCase();
  if (lower.includes('1 month') || lower.includes('1-month')) return 'training_1m';
  if (lower.includes('2 month') || lower.includes('2-month')) return 'training_2m';
  if (lower.includes('3 month') || lower.includes('3-month')) return 'training_3m';
  if (lower.includes('1 week') || lower.includes('1-week') || lower.includes('bootcamp')) return 'training_1w';
  return 'pro';
}

export function CheckoutModal({ open, onClose, planName, price, interval, onSuccess }: CheckoutModalProps) {
  const { dbUser, upgradeToPro } = useAuth();
  const [step, setStep] = useState<'form' | 'processing' | 'success' | 'failed'>('form');
  const [errorMessage, setErrorMessage] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [instituteName, setInstituteName] = useState('');
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);

  const bookingType = getBookingType(planName);
  const isInstitutional = bookingType === 'session_school';

  // Dynamically load Razorpay SDK
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ('Razorpay' in window) { resolve(true); return; }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Sync phone from dbUser on open
  useEffect(() => {
    if (dbUser?.phone) setPhoneInput(dbUser.phone);
  }, [dbUser]);

  // ─── Persist booking + upgrade subscription in DB ───────────────────────────
  const persistToDatabase = async (): Promise<string | null> => {
    if (!dbUser) return null;
    let url: string | null = null;

    try {
      const bookingRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: dbUser.id,
          booking_type: bookingType,
          institute_name: isInstitutional ? instituteName : null,
          contact_name: dbUser.name || 'Operator',
          contact_phone: phoneInput || dbUser.phone || '0000000000',
          plan_duration: interval,
          amount_paid: price,
          booking_date: new Date().toISOString(),
        }),
      });

      if (bookingRes.ok) {
        const data = await bookingRes.json();
        url = data.receipt_url || null;
      }
    } catch (err) {
      console.warn('[Checkout] Booking insert failed:', err);
    }

    try {
      const planKey = getPlanKey(planName);
      await upgradeToPro(planKey);
    } catch (err) {
      console.warn('[Checkout] Subscription upgrade failed:', err);
    }

    return url;
  };

  // ─── Razorpay live payment ───────────────────────────────────────────────────
  const handleRazorpayPayment = async () => {
    if (isInstitutional && !instituteName.trim()) {
      setErrorMessage('Please enter your institution / organisation name.');
      return;
    }
    setStep('processing');
    setErrorMessage('');

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      setStep('failed');
      setErrorMessage('Razorpay secure script failed to load. Ensure you have an active network connection.');
      return;
    }

    const amountInPaise = Math.round(price * 100);
    const razorpayKey = (import.meta.env.VITE_RAZORPAY_KEY_ID as string) || 'rzp_test_Tz08p8xszf9LzB';

    const options = {
      key: razorpayKey,
      amount: amountInPaise,
      currency: 'INR',
      name: 'Black Cypher SpecOps',
      description: `Tactical Upgrade: ${planName} Access`,
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=128&auto=format&fit=crop',
      handler: async function (response: any) {
        console.log('Razorpay Payment Success:', response);
        const url = await persistToDatabase();
        setReceiptUrl(url);
        setStep('success');
        if (onSuccess) onSuccess(url || undefined);
      },
      prefill: {
        name: dbUser?.name || 'Operator Recruit',
        email: dbUser?.email || 'recruit@blackcypher.org',
        contact: phoneInput || dbUser?.phone || '9999999999',
      },
      notes: {
        platform: 'Black Cypher Academy',
        plan: planName,
        billing_interval: interval,
        user_uid: dbUser?.id || 'guest',
      },
      theme: { color: '#06b6d4' },
      modal: { ondismiss: function () { setStep('form'); } },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        setStep('failed');
        setErrorMessage(resp.error.description || 'Secure transaction declined by credit gateway.');
      });
      rzp.open();
    } catch (err: any) {
      console.error('Error opening Razorpay:', err);
      setStep('failed');
      setErrorMessage('Could not initialize transaction with Razorpay gateways.');
    }
  };

  // ─── Simulated / offline payment ────────────────────────────────────────────
  const handleSimulatedPayment = async () => {
    if (isInstitutional && !instituteName.trim()) {
      setErrorMessage('Please enter your institution / organisation name.');
      return;
    }
    setStep('processing');
    await new Promise(r => setTimeout(r, 1500));
    const url = await persistToDatabase();
    setReceiptUrl(url);
    setStep('success');
    if (onSuccess) onSuccess(url || undefined);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep('form');
      setErrorMessage('');
      setReceiptUrl(null);
      setInstituteName('');
    }, 300);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-50"
            onClick={handleClose}
          />

          {/* Checkout viewport */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-surface-900 border border-accent-cyan/20 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)] select-none">
              {/* Scanline indicator */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-cyan via-accent-violet to-accent-emerald" />

              <button onClick={handleClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>

              {/* ── STEP 1: PAYMENT FORM ─────────────────────────────────── */}
              {step === 'form' && (
                <div className="font-mono text-xs">
                  <h2 className="font-heading text-xl font-bold text-white uppercase tracking-wider mb-1">
                    Secure Command Billing
                  </h2>
                  <p className="text-slate-400 mb-5 font-sans">
                    Clearance Tier: <span className="text-accent-cyan font-bold font-mono">{planName}</span>
                  </p>

                  {/* Pricing summary */}
                  <div className="bg-black/40 border border-white/[0.06] rounded-xl p-4 mb-5 space-y-3">
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Rate Structure:</span>
                      <span className="text-white">₹{price.toLocaleString()} INR / {interval}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400 border-t border-white/[0.04] pt-3">
                      <span>Security Clearance Level:</span>
                      <span className="text-accent-cyan font-bold text-sm">₹{price.toLocaleString()} INR</span>
                    </div>
                    <div className="text-[10px] text-slate-500 text-right font-sans italic">* Native INR gateway active</div>
                  </div>

                  {/* Operator fields */}
                  <div className="space-y-3 mb-5">
                    {isInstitutional && (
                      <div>
                        <label className="text-[10px] uppercase text-slate-500 mb-1.5 flex items-center gap-1.5">
                          <School className="w-3 h-3" /> Institution / Organisation Name <span className="text-red-400 ml-0.5">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Stanford Technical Institute"
                          value={instituteName}
                          onChange={e => setInstituteName(e.target.value)}
                          className="w-full bg-black/60 border border-white/[0.08] rounded-xl p-2.5 text-white focus:outline-none focus:border-accent-cyan"
                        />
                      </div>
                    )}
                    <div>
                      <label className="text-[10px] uppercase text-slate-500 mb-1.5 block">Operator Name</label>
                      <input
                        type="text"
                        readOnly
                        value={dbUser?.name || 'Recruit Operator'}
                        className="w-full bg-black/60 border border-white/[0.08] rounded-xl p-2.5 text-white/60 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-slate-500 mb-1.5 block">Operator Contact Phone</label>
                      <input
                        type="tel"
                        placeholder="e.g. +91 98765 43210"
                        value={phoneInput}
                        onChange={e => setPhoneInput(e.target.value)}
                        className="w-full bg-black/60 border border-white/[0.08] rounded-xl p-2.5 text-white focus:outline-none focus:border-accent-cyan"
                      />
                    </div>
                  </div>

                  {errorMessage && (
                    <p className="text-red-400 text-[10px] mb-3 font-sans border border-red-500/20 bg-red-500/5 rounded-lg p-2">
                      {errorMessage}
                    </p>
                  )}

                  {/* Payment triggers */}
                  <div className="space-y-2">
                    <Button
                      variant="primary"
                      size="lg"
                      glow="cyan"
                      className="w-full uppercase font-bold tracking-wider text-xs py-3 bg-gradient-to-r from-accent-cyan to-cyan-500 flex items-center justify-center gap-2"
                      onClick={handleRazorpayPayment}
                    >
                      <Lock className="w-4 h-4 shrink-0" />
                      Pay with Razorpay (₹{price.toLocaleString()})
                    </Button>

                    <button
                      onClick={handleSimulatedPayment}
                      className="w-full text-center text-[10px] text-slate-500 hover:text-slate-300 transition-colors uppercase pt-2 tracking-widest font-bold"
                    >
                      [ Launch Offline Simulated Handshake ]
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-600 text-center mt-4 font-sans">
                    Secured by 256-bit SSL encryption. Handshake keys encrypted via Razorpay PCI-DSS standards.
                  </p>
                </div>
              )}

              {/* ── STEP 2: PROCESSING ───────────────────────────────────── */}
              {step === 'processing' && (
                <div className="py-12 text-center font-mono">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-10 h-10 border-2 border-accent-cyan border-t-transparent rounded-full mx-auto mb-6"
                  />
                  <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-1">Establishing Gateways</h3>
                  <p className="text-slate-500 text-[10px] uppercase tracking-wide">
                    Contacting Secure APIs & Logging Receipt...
                  </p>
                </div>
              )}

              {/* ── STEP 3: FAILED ───────────────────────────────────────── */}
              {step === 'failed' && (
                <div className="py-8 text-center font-mono">
                  <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4 animate-bounce" />
                  <h3 className="text-red-500 text-sm font-bold uppercase tracking-widest mb-2">Transaction Declined</h3>
                  <p className="text-slate-400 text-xs mb-6 px-4 leading-relaxed font-sans">
                    {errorMessage || 'Your billing request was terminated by the security gate.'}
                  </p>
                  <div className="space-y-3">
                    <Button variant="primary" size="sm" glow="cyan" className="w-full uppercase" onClick={() => setStep('form')}>
                      Retry Secure Channel
                    </Button>
                    <button onClick={handleClose} className="text-slate-500 hover:text-white text-[10px] uppercase font-bold tracking-widest block w-full mt-2">
                      Dismiss Terminal
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 4: SUCCESS ──────────────────────────────────────── */}
              {step === 'success' && (
                <div className="py-8 text-center font-mono">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  >
                    <CheckCircle2 className="w-12 h-12 text-accent-emerald mx-auto mb-4" />
                  </motion.div>
                  <h3 className="font-heading text-lg font-bold text-white uppercase tracking-wide mb-1">
                    Security Clearance Cleared
                  </h3>
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-6">
                    Manifest Reference Generated
                  </p>

                  <div className="bg-black/30 border border-white/[0.04] p-4 rounded-xl text-left text-[11px] mb-6 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Service Plan:</span>
                      <span className="text-accent-emerald font-bold">{planName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status:</span>
                      <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> SECURE & ACTIVE
                      </span>
                    </div>
                    {receiptUrl && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Receipt:</span>
                        <a
                          href={receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent-cyan hover:underline font-bold truncate max-w-[160px]"
                        >
                          View Invoice ↗
                        </a>
                      </div>
                    )}
                  </div>

                  <p className="text-slate-400 text-xs mb-6 leading-relaxed font-sans">
                    Welcome to the pro operational ranks. All locked textbooks, video lessons, and sandbox environments are now active.
                  </p>

                  <Button variant="primary" size="md" glow="cyan" className="w-full uppercase font-bold" onClick={handleClose}>
                    Initialize Study Terminal
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
