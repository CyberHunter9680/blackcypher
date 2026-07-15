import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  subscribeToAuth, 
  signOut as fbSignOut, 
  signInWithGoogle as fbSignInWithGoogle,
  signInWithGithub as fbSignInWithGithub,
  signInAsAdmin as fbSignInAsAdmin,
  signInWithEmail as fbSignInWithEmail,
  signInWithCredentials as fbSignInWithCredentials,
  sendOtp as fbSendOtp,
  verifyOtp as fbVerifyOtp,
  AuthUser 
} from '../lib/firebase';
import { useInactivityLogout } from './useInactivityLogout';
import { InactivityWarningModal } from '../components/shared/InactivityWarningModal';

export interface DBUserProfile {
  id: string;
  email: string;
  username: string | null;
  phone: string | null;
  name: string;
  role: 'student' | 'admin';
  status: 'active' | 'blocked'; // account status
  avatar: string | null;
  qualification: string | null;
  age: number | null;
  gender: string | null;
  current_course: string | null;
  referral_source: string | null;
  xp: number;
  level: number;
  dob: string | null;
  joined_at: string;
}

export interface UserSubscription {
  tier: 'free' | 'pro';
  meet_plan_expiry: string | null;
  active_training_plan: 'none' | '1_week' | '1_month' | '2_month' | '3_month';
  training_plan_expiry: string | null;
}

interface AuthContextType {
  firebaseUser: AuthUser | null;
  dbUser: DBUserProfile | null;
  subscription: UserSubscription | null;
  loading: boolean;
  registrationRequired: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  loginAsAdmin: () => Promise<void>;
  loginWithEmail: (email: string) => Promise<void>;
  loginAsAdminWithCredentials: (email: string, passcode: string) => Promise<void>;
  loginWithCredentials: (usernameOrEmail: string, password: string) => Promise<void>;
  registerWithCredentials: (username: string, email: string, password: string, name: string) => Promise<void>;
  sendPhoneOtp: (phoneNumber: string, recaptchaId: string) => Promise<any>;
  verifyPhoneOtp: (otpCode: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  completeRegistration: (profileData: Partial<DBUserProfile>) => Promise<void>;
  updateUserProfile: (profileData: Partial<DBUserProfile>) => Promise<void>;
  upgradeToPro: (plan?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<AuthUser | null>(null);
  const [dbUser, setDbUser] = useState<DBUserProfile | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [registrationRequired, setRegistrationRequired] = useState(false);
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);

  // Sync Firebase State with Neon DB
  const syncWithDatabase = async (fbUser: AuthUser | null) => {
    if (!fbUser) {
      setDbUser(null);
      setSubscription(null);
      setRegistrationRequired(false);
      setLoading(false);
      return;
    }

    try {
      // API call to backend Vercel Serverless Function to fetch profile
      const response = await fetch(`/api/users?uid=${fbUser.uid}`);
      if (response.ok) {
        const data = await response.json();
        if (data.exists) {
          // Check if account is blocked
          if (data.user.status === 'blocked') {
            await fbSignOut();
            setDbUser(null);
            setFirebaseUser(null);
            setSubscription(null);
            setLoading(false);
            alert('Your account has been temporarily suspended by an administrator. Please contact support.');
            return;
          }
          setDbUser(data.user);
          setSubscription(data.subscription);
          // Admin users never need to complete registration
          const isAdmin = data.user.role === 'admin';
          setRegistrationRequired(!isAdmin && !data.user.qualification);
        } else {
          // Admin users never need to complete registration
          const isAdmin = fbUser.uid === 'mock-admin-888' || fbUser.role === 'admin';
          setRegistrationRequired(!isAdmin);
          // Set initial partial user
          setDbUser({
            id: fbUser.uid,
            email: fbUser.email || '',
            phone: fbUser.phoneNumber,
            name: fbUser.displayName || 'Operator',
            role: fbUser.uid === 'mock-admin-888' ? 'admin' : 'student',
            status: 'active',
            avatar: fbUser.photoURL,
            qualification: null,
            age: null,
            gender: null,
            current_course: null,
            referral_source: null,
            xp: 0,
            level: 1,
            dob: null,
            joined_at: new Date().toISOString()
          });
          setSubscription({
            tier: 'free',
            meet_plan_expiry: null,
            active_training_plan: 'none',
            training_plan_expiry: null
          });
        }
      } else {
        throw new Error('Failed to fetch user from DB backend.');
      }
    } catch (error) {
      console.error('Error syncing user with database:', error);
      // Fallback: create mock profile for local/offline testing
      // We set qualification to a placeholder so the registration modal does NOT loop
      setDbUser({
        id: fbUser.uid,
        email: fbUser.email || 'hacker@blackcypher.org',
        phone: fbUser.phoneNumber,
        name: fbUser.displayName || 'Alex Mercer',
        role: fbUser.uid === 'mock-admin-888' ? 'admin' : 'student',
        status: 'active',
        avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        qualification: 'Student',  // Set default so registration modal doesn't show in offline mode
        age: 21,
        gender: 'male',
        current_course: 'Cybersecurity',
        referral_source: 'youtube',
        xp: 12450,
        level: 12,
        dob: null,
        joined_at: new Date().toISOString()
      });
      setSubscription({
        tier: 'free',
        meet_plan_expiry: null,
        active_training_plan: 'none',
        training_plan_expiry: null
      });
      setRegistrationRequired(false);  // Don't show modal in offline/mock mode
    } finally {
      setLoading(false);
    }
  };

  // Inactivity logout handlers
  const handleInactivityLogout = useCallback(async () => {
    setShowInactivityWarning(false);
    await fbSignOut();
    setFirebaseUser(null);
    setDbUser(null);
    setSubscription(null);
    setRegistrationRequired(false);
    setLoading(false);
  }, []);

  const handleInactivityWarn = useCallback(() => {
    setShowInactivityWarning(true);
  }, []);

  const handleResetWarning = useCallback(() => {
    setShowInactivityWarning(false);
  }, []);

  const { resetTimers } = useInactivityLogout({
    onLogout: handleInactivityLogout,
    onWarn: handleInactivityWarn,
    onResetWarning: handleResetWarning,
    isLoggedIn: !!firebaseUser,
  });

  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (user) => {
      setLoading(true);
      setFirebaseUser(user);
      await syncWithDatabase(user);
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const fbUser = await fbSignInWithGoogle();
      await syncWithDatabase(fbUser);
    } catch (error) {
      console.error('Google Sign In Error:', error);
      setLoading(false);
      throw error;
    }
  };

  const loginWithGithub = async () => {
    setLoading(true);
    try {
      const fbUser = await fbSignInWithGithub();
      await syncWithDatabase(fbUser);
    } catch (error) {
      console.error('GitHub Sign In Error:', error);
      setLoading(false);
      throw error;
    }
  };

  const loginAsAdmin = async () => {
    setLoading(true);
    try {
      const fbUser = await fbSignInAsAdmin();
      await syncWithDatabase(fbUser);
    } catch (error) {
      console.error('Admin Sign In Error:', error);
      setLoading(false);
      throw error;
    }
  };

  const loginWithEmail = async (email: string) => {
    setLoading(true);
    try {
      const fbUser = await fbSignInWithEmail(email);
      await syncWithDatabase(fbUser);
    } catch (error) {
      console.error('Email Sign In Error:', error);
      setLoading(false);
      throw error;
    }
  };

  const loginAsAdminWithCredentials = async (email: string, passcode: string) => {
    setLoading(true);
    try {
      if (email.trim() === 'admin@blackcypher.org' && passcode === 'CYPHER-SEC-2026') {
        const fbUser = await fbSignInAsAdmin();
        await syncWithDatabase(fbUser);
      } else {
        throw new Error('AUTHENTICATION ERROR: INVALID ADVISORY ACCESS CODE');
      }
    } catch (error) {
      console.error('Admin Credential Auth Error:', error);
      setLoading(false);
      throw error;
    }
  };

  const loginWithCredentials = async (usernameOrEmail: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', usernameOrEmail, password }),
      });
      if (res.ok) {
        const data = await res.json();
        const fbUser = await fbSignInWithCredentials(
          data.user.id,
          data.user.email,
          data.user.name,
          data.user.role
        );
        await syncWithDatabase(fbUser);
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Login failed.');
      }
    } catch (error) {
      console.error('Credentials login error:', error);
      setLoading(false);
      throw error;
    }
  };

  const registerWithCredentials = async (username: string, email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', username, email, password, name }),
      });
      if (res.ok) {
        const data = await res.json();
        const fbUser = await fbSignInWithCredentials(
          data.user.id,
          data.user.email,
          data.user.name,
          data.user.role
        );
        await syncWithDatabase(fbUser);
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Registration failed.');
      }
    } catch (error) {
      console.error('Credentials registration error:', error);
      setLoading(false);
      throw error;
    }
  };

  const sendPhoneOtp = async (phoneNumber: string, recaptchaId: string) => {
    return await fbSendOtp(phoneNumber, recaptchaId);
  };

  const verifyPhoneOtp = async (otpCode: string) => {
    setLoading(true);
    try {
      const fbUser = await fbVerifyOtp(otpCode);
      await syncWithDatabase(fbUser);
    } catch (error) {
      console.error('Verify OTP Error:', error);
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    setShowInactivityWarning(false);
    await fbSignOut();
    setFirebaseUser(null);
    setDbUser(null);
    setSubscription(null);
    setRegistrationRequired(false);
    setLoading(false);
  };

  const refreshUserProfile = async () => {
    if (firebaseUser) {
      await syncWithDatabase(firebaseUser);
    }
  };

  const completeRegistration = async (profileData: Partial<DBUserProfile>) => {
    if (!firebaseUser) return;
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          uid: firebaseUser.uid,
          email: firebaseUser.email || profileData.email || '',
          phone: firebaseUser.phoneNumber || profileData.phone || '',
          name: profileData.name || firebaseUser.displayName || 'Operator',
          avatar: profileData.avatar || firebaseUser.photoURL || '',
          ...profileData
        })
      });

      if (res.ok) {
        await refreshUserProfile();
      } else {
        throw new Error('Failed to save profile on serverless backend.');
      }
    } catch (error) {
      console.error('Registration submission error:', error);
      // Fallback mock update
      setDbUser(prev => prev ? { ...prev, ...profileData } : null);
      setRegistrationRequired(false);
    }
  };

  const updateUserProfile = async (profileData: Partial<DBUserProfile>) => {
    if (!firebaseUser || !dbUser) return;
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          uid: firebaseUser.uid,
          ...profileData
        })
      });
      if (res.ok) {
        await refreshUserProfile();
      } else {
        throw new Error('Failed to update profile.');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      setDbUser(prev => prev ? { ...prev, ...profileData } : null);
    }
  };

  const upgradeToPro = async (plan: string = 'pro') => {
    if (!firebaseUser || !dbUser) return;
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'upgrade',
          uid: firebaseUser.uid,
          tier: 'pro',
          plan
        })
      });
      if (res.ok) {
        await refreshUserProfile();
      } else {
        throw new Error('Failed to upgrade subscription.');
      }
    } catch (error) {
      console.error('Upgrade subscription error:', error);
      // Mock update
      setSubscription(prev => prev ? { ...prev, tier: 'pro', meet_plan_expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() } : null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        dbUser,
        subscription,
        loading,
        registrationRequired,
        loginWithGoogle,
        loginWithGithub,
        loginAsAdmin,
        loginWithEmail,
        loginAsAdminWithCredentials,
        loginWithCredentials,
        registerWithCredentials,
        sendPhoneOtp,
        verifyPhoneOtp,
        logout,
        refreshUserProfile,
        completeRegistration,
        updateUserProfile,
        upgradeToPro
      }}
    >
      {children}
      <InactivityWarningModal
        isVisible={showInactivityWarning}
        onStayLoggedIn={() => {
          setShowInactivityWarning(false);
          resetTimers();
        }}
        onLogoutNow={handleInactivityLogout}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
