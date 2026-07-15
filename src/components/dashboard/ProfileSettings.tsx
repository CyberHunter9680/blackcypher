import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, User, Calendar, BookOpen, Camera, Save } from 'lucide-react';
import { Button } from '../ui';
import { useAuth } from '../../hooks/useAuth';

interface ProfileSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ isOpen, onClose }) => {
  const { dbUser, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form fields initialized with user details
  const [fullName, setFullName] = useState(dbUser?.name || '');
  const [dob, setDob] = useState(dbUser?.dob ? dbUser.dob.substring(0, 10) : '');
  const [age, setAge] = useState(dbUser?.age?.toString() || '');
  const [gender, setGender] = useState(dbUser?.gender || 'male');
  const [qualification, setQualification] = useState(dbUser?.qualification || '');
  const [currentCourse, setCurrentCourse] = useState(dbUser?.current_course || '');
  const [avatarUrl, setAvatarUrl] = useState(dbUser?.avatar || '');

  // Credentials change states
  const [username, setUsername] = useState(dbUser?.username || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  // Sync form when dbUser changes (e.g. after profile update refresh)
  useEffect(() => {
    if (dbUser) {
      setFullName(dbUser.name || '');
      setDob(dbUser.dob ? dbUser.dob.substring(0, 10) : '');
      setAge(dbUser.age?.toString() || '');
      setGender(dbUser.gender || 'male');
      setQualification(dbUser.qualification || '');
      setCurrentCourse(dbUser.current_course || '');
      setAvatarUrl(dbUser.avatar || '');
      setUsername(dbUser.username || '');
    }
  }, [dbUser]);

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) {
      setError('Name cannot be empty.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Check if credentials are being changed
      const isChangingUsername = username !== (dbUser?.username || '');
      const isChangingPassword = newPassword !== '';

      if (isChangingUsername || isChangingPassword) {
        if (!currentPassword) {
          setError('Current password is required to update security credentials.');
          setLoading(false);
          return;
        }
        if (isChangingPassword && newPassword !== confirmPassword) {
          setError('New passwords do not match.');
          setLoading(false);
          return;
        }

        const credRes = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'change_credentials',
            uid: dbUser?.id,
            newUsername: isChangingUsername ? username : undefined,
            newPassword: isChangingPassword ? newPassword : undefined,
            currentPassword
          })
        });

        if (!credRes.ok) {
          const credData = await credRes.json();
          setError(credData.error || 'Failed to update credentials.');
          setLoading(false);
          return;
        }
      }

      await updateUserProfile({
        name: fullName,
        dob: dob || null,
        age: age ? parseInt(age) : null,
        gender,
        qualification: qualification || null,
        current_course: currentCourse || null,
        avatar: avatarUrl
      });
      
      setSuccess('Profile and credentials updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            className="relative w-full max-w-lg bg-surface-800 border border-white/[0.08] rounded-2xl p-6 md:p-8 shadow-elevated z-10 overflow-y-auto max-h-[90vh]"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/[0.04]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6 border-b border-white/[0.06] pb-4">
              <div className="w-10 h-10 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-accent-cyan" />
              </div>
              <div>
                <h3 className="font-heading text-body-lg font-bold text-white uppercase tracking-wider">
                  System Settings
                </h3>
                <p className="text-[11px] text-slate-400">Configure your cyber operator profile</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-body-sm rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-accent-emerald/10 border border-accent-emerald/20 text-accent-emerald text-body-sm rounded-lg">
                {success}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              {/* Profile image edit */}
              <div className="flex items-center gap-4 bg-surface-900/50 p-4 rounded-xl border border-white/[0.04]">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-white/[0.1] bg-surface-950">
                    <img src={avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <label className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-accent-cyan flex items-center justify-center cursor-pointer shadow hover:scale-105 transition-all">
                    <Camera className="w-3.5 h-3.5 text-black" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <h4 className="text-body-sm font-semibold text-white">Avatar Matrix</h4>
                  <p className="text-caption text-slate-500">Update operator face profile</p>
                </div>
              </div>

              <div>
                <label className="block text-caption font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Operator Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-surface-900 border border-white/[0.08] focus:border-accent-cyan rounded-lg pl-10 pr-4 py-2.5 text-white text-body-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-caption font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full bg-surface-900 border border-white/[0.08] focus:border-accent-cyan rounded-lg pl-10 pr-4 py-2.5 text-white text-body-sm outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-caption font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Age
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full bg-surface-900 border border-white/[0.08] focus:border-accent-cyan rounded-lg px-4 py-2.5 text-white text-body-sm outline-none transition-all"
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
                      className={`py-2 rounded-lg border text-caption font-semibold uppercase tracking-wider transition-all ${
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

              <div>
                <label className="block text-caption font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Educational Qualification
                </label>
                <input
                  type="text"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="w-full bg-surface-900 border border-white/[0.08] focus:border-accent-cyan rounded-lg px-4 py-2.5 text-white text-body-sm outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-caption font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Current Course / Study Stream
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={currentCourse}
                    onChange={(e) => setCurrentCourse(e.target.value)}
                    className="w-full bg-surface-900 border border-white/[0.08] focus:border-accent-cyan rounded-lg pl-10 pr-4 py-2.5 text-white text-body-sm outline-none transition-all"
                  />
                </div>
              </div>

              {/* SECURITY CREDENTIALS */}
              <div className="pt-5 border-t border-white/[0.06] space-y-4">
                <h4 className="text-[11px] font-bold text-accent-cyan uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  Operator Credentials
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="New username"
                      className="w-full bg-surface-900 border border-white/[0.08] focus:border-accent-cyan rounded-lg px-4 py-2.5 text-white text-body-sm outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                      Current Password (Required to Save Changes)
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Verify current password"
                      className="w-full bg-surface-900 border border-white/[0.08] focus:border-accent-cyan rounded-lg px-4 py-2.5 text-white text-body-sm outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password"
                      className="w-full bg-surface-900 border border-white/[0.08] focus:border-accent-cyan rounded-lg px-4 py-2.5 text-white text-body-sm outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full bg-surface-900 border border-white/[0.08] focus:border-accent-cyan rounded-lg px-4 py-2.5 text-white text-body-sm outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={onClose}
                  className="px-5 border border-white/[0.06] text-slate-400 hover:text-white"
                >
                  Discard
                </Button>
                <Button
                  variant="primary"
                  glow="cyan"
                  type="submit"
                  loading={loading}
                  className="px-6 bg-accent-cyan text-black font-semibold gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Configuration
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
