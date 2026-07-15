import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Shield, Phone, Mail, KeyRound, ArrowLeft, RefreshCw, 
  CheckCircle, Lock, Zap, Eye, EyeOff, User, Terminal, Github 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = 'credentials' | 'register' | 'options' | 'email' | 'phone' | 'otp';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { 
    loginWithGoogle, 
    loginWithGithub,
    loginWithEmail, 
    sendPhoneOtp, 
    verifyPhoneOtp,
    loginWithCredentials,
    registerWithCredentials
  } = useAuth();

  // Login credentials states
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Registration credentials states
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regName, setRegName] = useState('');

  // Legacy/OTP states
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const [step, setStep] = useState<AuthStep>('credentials');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Check if running in mock mode (no Firebase config)
  const isMockMode = !import.meta.env.VITE_FIREBASE_API_KEY;

  // Clear states on close or open
  useEffect(() => {
    if (!isOpen) {
      setUsernameOrEmail('');
      setPassword('');
      setRegUsername('');
      setRegEmail('');
      setRegPassword('');
      setRegName('');
      setEmail('');
      setPhoneNumber('');
      setOtpCode('');
      setStep('credentials');
      setError('');
      setMessage('');
      setShowPassword(false);
    }
  }, [isOpen]);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail || !password) {
      setError('Please fill in all security fields.');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await loginWithCredentials(usernameOrEmail.trim(), password);
      setMessage('Access granted. Initializing session...');
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Credentials authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialsRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regUsername || !regEmail || !regPassword || !regName) {
      setError('Please fill in all operator registry fields.');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await registerWithCredentials(
        regUsername.trim(),
        regEmail.trim(),
        regPassword,
        regName.trim()
      );
      setMessage('Operator registered. Access granted.');
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Credentials registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGithub();
      onClose();
    } catch (err: any) {
      setError(err.message || 'GitHub authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Invalid email format.');
      return;
    }
    if (trimmed === 'admin@blackcypher.org') {
      setError('Admin access is restricted. Use the secure /admin terminal.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await loginWithEmail(trimmed);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Email authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      setError('Please enter your phone number.');
      return;
    }
    
    let formattedPhone = phoneNumber.trim();
    if (/^\d{10}$/.test(formattedPhone)) {
      formattedPhone = `+91${formattedPhone}`;
    } else if (/^\d{12}$/.test(formattedPhone) && formattedPhone.startsWith('91')) {
      formattedPhone = `+${formattedPhone}`;
    } else if (!formattedPhone.startsWith('+')) {
      formattedPhone = `+${formattedPhone}`;
    }
    
    setPhoneNumber(formattedPhone);
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await sendPhoneOtp(formattedPhone, 'recaptcha-container');
      setStep('otp');
      setMessage(`Verification code requested successfully for ${formattedPhone}`);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please check the number format.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpCode.trim();
    if (code.length !== 6) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await verifyPhoneOtp(code);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const goBack = () => {
    setError('');
    setMessage('');
    if (step === 'otp') {
      setStep('phone');
    } else if (step === 'email' || step === 'phone') {
      setStep('options');
    } else {
      setStep('credentials');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Recaptcha container hidden */}
          <div id="recaptcha-container" className="hidden"></div>

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.94, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.94, y: 20, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-[420px] bg-gradient-to-b from-[#080d1c] to-[#060b17] border border-white/[0.08] rounded-2xl p-8 shadow-2xl z-10 overflow-hidden"
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-accent-cyan/70 to-transparent" />
            
            {/* Ambient Background Glows */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent-violet/10 rounded-full blur-3xl pointer-events-none" />

            {/* Subtle grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.018)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.018)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/[0.06]"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Logo and Header */}
            <div className="flex flex-col items-center text-center mb-6 mt-1">
              <div className="relative mb-3">
                <div className="w-12 h-12 rounded-xl bg-accent-cyan/[0.08] border border-accent-cyan/20 flex items-center justify-center shadow-[0_0_28px_rgba(6,182,212,0.18)]">
                  <Shield className="w-6 h-6 text-accent-cyan" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#060b17] border border-emerald-500/40 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>
              <h3 className="font-heading text-lg font-bold text-white tracking-tight">
                Black<span className="text-accent-cyan">Cypher</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Secure operator authentication portal</p>
              <div className="flex items-center gap-1.5 mt-2 px-3 py-0.5 rounded-full bg-emerald-500/[0.06] border border-emerald-500/15">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-[0.15em]">System Online · Encrypted</span>
                <Lock className="w-2.5 h-2.5 text-emerald-400/60" />
              </div>
            </div>

            {/* Alert/Messages */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mb-4 p-3 bg-red-500/[0.08] border border-red-500/20 text-red-400 text-xs rounded-xl font-mono"
                >
                  <span className="font-bold text-[9px] uppercase tracking-widest text-red-500 block mb-1">SYSTEM ALERT</span>
                  {error}
                </motion.div>
              )}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mb-4 p-3 bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-xs rounded-xl font-mono flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  {message}
                </motion.div>
              )}
              {isMockMode && step !== 'credentials' && step !== 'register' && step !== 'options' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-4 p-3 bg-amber-500/5 border border-amber-500/20 text-amber-400 text-[10px] rounded-xl font-mono text-center"
                >
                  ⚡ DEV MODE: Use phone verification code <span className="text-white font-bold">123456</span> to bypass authentication
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step Content */}
            <div className="min-h-[220px] flex flex-col justify-center">
              {/* Credentials Sign-In (Primary Flow) */}
              {step === 'credentials' && (
                <motion.form
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onSubmit={handleCredentialsLogin}
                  className="space-y-4 w-full"
                >
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider font-mono">
                      Operator Identifier
                    </label>
                    <div className="relative">
                      <Terminal className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                      <input
                        type="text"
                        required
                        autoFocus
                        placeholder="username or email"
                        value={usernameOrEmail}
                        onChange={(e) => setUsernameOrEmail(e.target.value)}
                        className="w-full bg-black/40 border border-white/[0.09] focus:border-accent-cyan/60 rounded-xl pl-11 pr-4 py-3 text-white text-sm outline-none transition-all placeholder:text-slate-600 font-mono"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                        Access Key (Password)
                      </label>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/40 border border-white/[0.09] focus:border-accent-cyan/60 rounded-xl pl-11 pr-10 py-3 text-white text-sm outline-none transition-all placeholder:text-slate-600 font-mono"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => !prev)}
                        className="absolute right-3.5 top-3.5 text-slate-500 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-accent-cyan hover:bg-cyan-300 text-black font-bold text-[11px] uppercase tracking-wider py-3.5 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(6,182,212,0.25)] disabled:opacity-50"
                  >
                    {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                    Unlock Terminal
                  </button>

                  <div className="flex flex-col gap-2 pt-3 text-center">
                    <p className="text-[10.5px] font-mono text-slate-400">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setError('');
                          setMessage('');
                          setStep('register');
                        }}
                        className="text-accent-cyan hover:text-cyan-300 font-bold underline"
                      >
                        Create Operator Profile
                      </button>
                    </p>
                    <div className="flex items-center gap-3 my-4">
                      <div className="h-px bg-white/[0.08] flex-1" />
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">OR</span>
                      <div className="h-px bg-white/[0.08] flex-1" />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {/* Google */}
                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="flex flex-col items-center justify-center gap-1.5 py-2.5 border border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.03] text-slate-400 hover:text-white rounded-xl text-[10px] uppercase font-mono transition-all duration-200"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" className="shrink-0">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        <span>Google</span>
                      </button>

                      {/* GitHub */}
                      <button
                        type="button"
                        onClick={handleGithubLogin}
                        disabled={loading}
                        className="flex flex-col items-center justify-center gap-1.5 py-2.5 border border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.03] text-slate-400 hover:text-white rounded-xl text-[10px] uppercase font-mono transition-all duration-200"
                      >
                        <Github className="w-4 h-4 text-white shrink-0" />
                        <span>GitHub</span>
                      </button>

                      {/* Phone */}
                      <button
                        type="button"
                        onClick={() => {
                          setError('');
                          setMessage('');
                          setStep('phone');
                        }}
                        disabled={loading}
                        className="flex flex-col items-center justify-center gap-1.5 py-2.5 border border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.03] text-slate-400 hover:text-white rounded-xl text-[10px] uppercase font-mono transition-all duration-200"
                      >
                        <Phone className="w-4 h-4 text-accent-violet shrink-0" />
                        <span>Phone</span>
                      </button>
                    </div>
                  </div>
                </motion.form>
              )}

              {/* Credentials Registration Flow */}
              {step === 'register' && (
                <motion.form
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onSubmit={handleCredentialsRegister}
                  className="space-y-3.5 w-full"
                >
                  <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex items-center gap-1.5 text-[10px] font-mono text-slate-500 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-3 h-3" /> Return to Login
                  </button>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider font-mono">
                      Full Operator Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="Alex Mercer"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full bg-black/40 border border-white/[0.09] focus:border-accent-cyan/60 rounded-xl pl-9 pr-4 py-2 text-white text-xs outline-none transition-all placeholder:text-slate-600 font-mono"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider font-mono">
                      Codename (Username)
                    </label>
                    <div className="relative">
                      <Terminal className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. hack_nexus"
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        className="w-full bg-black/40 border border-white/[0.09] focus:border-accent-cyan/60 rounded-xl pl-9 pr-4 py-2 text-white text-xs outline-none transition-all placeholder:text-slate-600 font-mono"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider font-mono">
                      Secure Email Link
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                      <input
                        type="email"
                        required
                        placeholder="operator@blackcypher.org"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full bg-black/40 border border-white/[0.09] focus:border-accent-cyan/60 rounded-xl pl-9 pr-4 py-2 text-white text-xs outline-none transition-all placeholder:text-slate-600 font-mono"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider font-mono">
                      Access Passphrase (Password)
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="min 6 characters"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full bg-black/40 border border-white/[0.09] focus:border-accent-cyan/60 rounded-xl pl-9 pr-9 py-2 text-white text-xs outline-none transition-all placeholder:text-slate-600 font-mono"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => !prev)}
                        className="absolute right-3 top-2.5 text-slate-500 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-accent-cyan hover:bg-cyan-300 text-black font-bold text-[11px] uppercase tracking-wider py-3 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(6,182,212,0.25)] disabled:opacity-50"
                  >
                    {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                    Register Operator
                  </button>
                </motion.form>
              )}

              {/* Legacy Options Menu */}
              {step === 'options' && (
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  className="space-y-3"
                >
                  <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex items-center gap-1.5 text-[10px] font-mono text-slate-500 hover:text-white transition-colors mb-1"
                  >
                    <ArrowLeft className="w-3 h-3" /> Return to Login
                  </button>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-px bg-white/[0.05]" />
                    <span className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">Access Protocols</span>
                    <div className="flex-1 h-px bg-white/[0.05]" />
                  </div>

                  {/* Google */}
                  <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 border border-white/[0.08] hover:border-white/[0.18] hover:bg-white/[0.04] text-white py-3 px-4 rounded-xl text-[11px] uppercase tracking-wider font-semibold transition-all duration-200 disabled:opacity-50"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" className="shrink-0">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>

                  {/* Email */}
                  <button
                    onClick={() => setStep('email')}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 border border-white/[0.08] hover:border-accent-cyan/30 hover:bg-accent-cyan/[0.03] text-white py-3 px-4 rounded-xl text-[11px] uppercase tracking-wider font-semibold transition-all duration-200"
                  >
                    <Mail className="w-4 h-4 text-accent-cyan shrink-0" />
                    Continue with Email Link
                  </button>

                  {/* Phone */}
                  <button
                    onClick={() => setStep('phone')}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 border border-white/[0.08] hover:border-accent-violet/30 hover:bg-accent-violet/[0.03] text-white py-3 px-4 rounded-xl text-[11px] uppercase tracking-wider font-semibold transition-all duration-200"
                  >
                    <Phone className="w-4 h-4 text-accent-violet shrink-0" />
                    OTP via Phone Number
                  </button>
                </motion.div>
              )}

              {/* Email Form */}
              {step === 'email' && (
                <motion.form
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleEmailLogin}
                  className="space-y-4 w-full"
                >
                  <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex items-center gap-1.5 text-[10px] font-mono text-slate-500 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-3 h-3" /> Return to Menu
                  </button>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-2 uppercase tracking-wider font-mono">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                      <input
                        type="email"
                        required
                        autoFocus
                        placeholder="operator@blackcypher.org"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/40 border border-white/[0.09] focus:border-accent-cyan/60 rounded-xl pl-11 pr-4 py-3 text-white text-sm outline-none transition-all placeholder:text-slate-600 font-mono"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-accent-cyan hover:bg-cyan-300 text-black font-bold text-[11px] uppercase tracking-wider py-3.5 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(6,182,212,0.25)] disabled:opacity-50"
                  >
                    {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                    Initialize Connection
                  </button>
                </motion.form>
              )}

              {/* Phone Form */}
              {step === 'phone' && (
                <motion.form
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleSendOtp}
                  className="space-y-4 w-full"
                >
                  <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex items-center gap-1.5 text-[10px] font-mono text-slate-500 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-3 h-3" /> Return to Menu
                  </button>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-2 uppercase tracking-wider font-mono">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                      <input
                        type="tel"
                        required
                        autoFocus
                        placeholder="+91 98765 43210"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full bg-black/40 border border-white/[0.09] focus:border-accent-violet/60 rounded-xl pl-11 pr-4 py-3 text-white text-sm outline-none transition-all placeholder:text-slate-600 font-mono"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-accent-violet hover:bg-violet-400 text-white font-bold text-[11px] uppercase tracking-wider py-3.5 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(139,92,246,0.25)] disabled:opacity-50"
                  >
                    {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Phone className="w-3.5 h-3.5" />}
                    Request Secure Code
                  </button>
                </motion.form>
              )}

              {/* OTP Code Form */}
              {step === 'otp' && (
                <motion.form
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleVerifyOtp}
                  className="space-y-4 w-full"
                >
                  <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex items-center gap-1.5 text-[10px] font-mono text-slate-500 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-3 h-3" /> Return to Phone Entry
                  </button>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-2 uppercase tracking-wider font-mono text-center">
                      Enter 6-digit Verification Code
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                      <input
                        type="text"
                        required
                        autoFocus
                        maxLength={6}
                        pattern="[0-9]*"
                        inputMode="numeric"
                        placeholder="123456"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-black/40 border border-white/[0.09] focus:border-accent-emerald/60 rounded-xl pl-11 pr-4 py-3 text-white text-sm outline-none transition-all placeholder:text-slate-600 font-mono tracking-[1em] text-center"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpCode.length !== 6}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[11px] uppercase tracking-wider py-3.5 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.25)] disabled:opacity-50"
                  >
                    {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                    Confirm Code & Enter
                  </button>
                </motion.form>
              )}
            </div>

            <div className="pt-4 text-center">
              <p className="text-[10px] text-slate-600 font-mono">
                By accessing this terminal, you authorize connection protocols and accept the{' '}
                <a href="/terms" className="text-accent-cyan/60 hover:text-accent-cyan underline">Terms</a>
                {' & '}
                <a href="/privacy" className="text-accent-cyan/60 hover:text-accent-cyan underline">Privacy Policy</a>.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
