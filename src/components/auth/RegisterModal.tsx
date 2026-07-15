import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, BookOpen, GraduationCap, Users, Heart, Camera } from 'lucide-react';
import { Button } from '../ui';
import { useAuth } from '../../hooks/useAuth';

export const RegisterModal: React.FC = () => {
  const { registrationRequired, completeRegistration, logout, dbUser } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [fullName, setFullName] = useState(dbUser?.name || '');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [qualification, setQualification] = useState('');
  const [currentCourse, setCurrentCourse] = useState('');
  const [referralSource, setReferralSource] = useState('youtube');
  const [avatarUrl, setAvatarUrl] = useState(
    dbUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!fullName) {
        setError('Please enter your full name.');
        return;
      }
      if (!dob) {
        setError('Please enter your date of birth.');
        return;
      }
      if (!age || parseInt(age) < 10 || parseInt(age) > 100) {
        setError('Please enter a valid age.');
        return;
      }
    }
    if (step === 2) {
      if (!qualification) {
        setError('Please enter your educational qualification.');
        return;
      }
      if (!currentCourse) {
        setError('Please specify your current study stream/course.');
        return;
      }
    }
    setError('');
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await completeRegistration({
        name: fullName,
        dob,
        age: parseInt(age),
        gender,
        qualification,
        current_course: currentCourse,
        referral_source: referralSource,
        avatar: avatarUrl,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to complete profile registration.');
    } finally {
      setLoading(false);
    }
  };

  if (!registrationRequired) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-mesh-gradient opacity-40 pointer-events-none" />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-xl bg-surface-800 border border-white/[0.08] rounded-2xl p-6 md:p-10 shadow-elevated z-10"
      >
        <div className="flex justify-between items-center mb-8 border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-accent-cyan" />
            </div>
            <div>
              <h3 className="font-heading text-body-lg font-bold text-white uppercase tracking-wider">
                Profile Registration
              </h3>
              <p className="text-[11px] text-slate-400">Step {step} of 3: Initialize security clearance</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="text-body-sm font-medium text-red-400 hover:text-red-300 underline transition-all"
          >
            Cancel & Exit
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-body-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* STEP 1: PERSONAL INFORMATION */}
          {step === 1 && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="space-y-5"
            >
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full border border-white/[0.08] bg-surface-900 overflow-hidden shadow-glow-cyan">
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-accent-cyan flex items-center justify-center cursor-pointer shadow hover:scale-105 transition-all">
                    <Camera className="w-4 h-4 text-black" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <span className="text-caption text-slate-500 mt-2">Upload Profile Photo</span>
              </div>

              <div>
                <label className="block text-caption font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Mercer"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-surface-900 border border-white/[0.08] focus:border-accent-cyan rounded-lg px-4 py-3 text-white text-body-sm outline-none transition-all"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-caption font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-surface-900 border border-white/[0.08] focus:border-accent-cyan rounded-lg px-4 py-3 text-white text-body-sm outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-caption font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Age
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 21"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full bg-surface-900 border border-white/[0.08] focus:border-accent-cyan rounded-lg px-4 py-3 text-white text-body-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-caption font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Gender
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['male', 'female', 'other'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-2.5 rounded-lg border text-caption font-semibold uppercase tracking-wider transition-all ${
                        gender === g
                          ? 'bg-accent-cyan/10 border-accent-cyan text-accent-cyan'
                          : 'bg-surface-900 border-white/[0.06] text-slate-400 hover:border-white/[0.1]'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: PROFESSIONAL BACKGROUND */}
          {step === 2 && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="space-y-5"
            >
              <div>
                <label className="block text-caption font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Educational Qualification
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="e.g. Matric / Intermediate / B.Tech / BCA"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full bg-surface-900 border border-white/[0.08] focus:border-accent-cyan rounded-lg pl-11 pr-4 py-3 text-white text-body-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-caption font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Current Course / Stream of Study
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="e.g. Computer Science Engineering, Cyber Security"
                    value={currentCourse}
                    onChange={(e) => setCurrentCourse(e.target.value)}
                    className="w-full bg-surface-900 border border-white/[0.08] focus:border-accent-cyan rounded-lg pl-11 pr-4 py-3 text-white text-body-sm outline-none transition-all"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: PLATFORM SOURCE & CONFIRMATION */}
          {step === 3 && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="space-y-5"
            >
              <div>
                <label className="block text-caption font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Where did you hear about Black Cypher?
                </label>
                <div className="relative">
                  <Users className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <select
                    value={referralSource}
                    onChange={(e) => setReferralSource(e.target.value)}
                    className="w-full bg-surface-900 border border-white/[0.08] focus:border-accent-cyan rounded-lg pl-11 pr-4 py-3 text-white text-body-sm outline-none transition-all appearance-none"
                  >
                    <option value="youtube">YouTube</option>
                    <option value="google">Google Search</option>
                    <option value="friend">Friend / Colleague</option>
                    <option value="college">School / College Seminar</option>
                    <option value="social">Social Media (LinkedIn/Insta)</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-accent-cyan/5 border border-accent-cyan/20 rounded-xl space-y-2 mt-6">
                <div className="flex gap-2 text-accent-cyan font-heading font-semibold text-body-sm">
                  <Heart className="w-4 h-4" /> Code of Conduct
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  By completing registration, you agree to access educational roadmaps, books, and courses for positive learning. Any hacking knowledge obtained must strictly be used within ethical boundaries.
                </p>
              </div>
            </motion.div>
          )}

          {/* Navigation Controls */}
          <div className="flex gap-3 justify-end mt-8 border-t border-white/[0.06] pt-5">
            {step > 1 && (
              <Button
                variant="ghost"
                type="button"
                onClick={handlePrev}
                className="px-6 border border-white/[0.06] text-slate-400 hover:text-white"
              >
                Previous
              </Button>
            )}

            {step < 3 ? (
              <Button
                variant="primary"
                glow="cyan"
                type="button"
                onClick={handleNext}
                className="px-8 bg-accent-cyan text-black font-semibold"
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="primary"
                glow="emerald"
                type="submit"
                loading={loading}
                className="px-8 bg-accent-emerald text-black font-semibold"
              >
                Complete Access Setup
              </Button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};
