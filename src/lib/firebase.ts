import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  signInWithPopup, 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  ConfirmationResult
} from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Check if valid config exists
const hasConfig = !!import.meta.env.VITE_FIREBASE_API_KEY;

let app;
let auth: any;
let googleProvider: any;
let githubProvider: any;
export let analytics: any;

if (hasConfig) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  githubProvider = new GithubAuthProvider();
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Firebase Analytics initialization failed:', error);
  }
} else {
  console.log('Firebase credentials not found. Black Cypher is running in development-mock mode for Authentication.');
}

// Custom Auth State to bridge real Firebase and Mock modes
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  role: 'student' | 'admin';
}

// Memory store for mock authentication
const SESSION_KEY = 'bc_mock_auth_session';

function saveMockSession(user: AuthUser | null) {
  if (user) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    sessionStorage.removeItem(SESSION_KEY);
  }
}

function loadMockSession(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

// Initialize from session storage so page refreshes don't log out the user
let mockUserStore: AuthUser | null = loadMockSession();
const authListeners = new Set<(user: AuthUser | null) => void>();

// Real or Mock Google Sign-In
export async function signInWithGoogle(): Promise<AuthUser> {
  if (hasConfig && auth) {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL,
      role: 'student', // default, server-side resolves admin
    };
  } else {
    // Elegant mock login
    const mockUser: AuthUser = {
      uid: 'mock-user-123',
      email: 'hacker@blackcypher.org',
      displayName: 'Elite Operator',
      phoneNumber: '+919876543210',
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      role: 'student',
    };
    mockUserStore = mockUser;
    saveMockSession(mockUser);
    notifyListeners();
    return mockUser;
  }
}

// Real or Mock GitHub Sign-In
export async function signInWithGithub(): Promise<AuthUser> {
  if (hasConfig && auth) {
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL,
      role: 'student',
    };
  } else {
    // Elegant mock login
    const mockUser: AuthUser = {
      uid: 'mock-github-789',
      email: 'git_operator@blackcypher.org',
      displayName: 'Git SecOps',
      phoneNumber: null,
      photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=git_operator',
      role: 'student',
    };
    mockUserStore = mockUser;
    saveMockSession(mockUser);
    notifyListeners();
    return mockUser;
  }
}

// Real or Mock Email Sign-In
export async function signInWithEmail(email: string): Promise<AuthUser> {
  // Direct email login (mock mode or simple custom sign-in)
  // Standardize UID from email using btoa to make it persistent for that email
  let encoded = 'mock-user-email';
  try {
    encoded = btoa(email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 15);
  } catch (e) {
    encoded = String(Date.now());
  }
  const uid = `mock-email-${encoded}`;
  const mockUser: AuthUser = {
    uid,
    email,
    displayName: email.split('@')[0],
    phoneNumber: null,
    photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
    role: email === 'admin@blackcypher.org' ? 'admin' : 'student',
  };
  mockUserStore = mockUser;
  saveMockSession(mockUser);
  notifyListeners();
  return mockUser;
}

// Real database backed credentials login session helper
export async function signInWithCredentials(
  uid: string,
  email: string,
  displayName: string,
  role: 'student' | 'admin' = 'student'
): Promise<AuthUser> {
  const user: AuthUser = {
    uid,
    email,
    displayName,
    phoneNumber: null,
    photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${displayName}`,
    role,
  };
  mockUserStore = user;
  saveMockSession(user);
  notifyListeners();
  return user;
}

// Admin Mock login helper for local testing
export async function signInAsAdmin(): Promise<AuthUser> {
  const mockAdmin: AuthUser = {
    uid: 'mock-admin-888',
    email: 'admin@blackcypher.org',
    displayName: 'Head Master Admin',
    phoneNumber: '+919999999999',
    photoURL: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200',
    role: 'admin',
  };
  mockUserStore = mockAdmin;
  saveMockSession(mockAdmin);
  notifyListeners();
  return mockAdmin;
}

// Phone Number OTP Setup
let confirmationResultStore: ConfirmationResult | null = null;

export async function sendOtp(phoneNumber: string, elementId: string): Promise<any> {
  if (hasConfig && auth) {
    const verifier = new RecaptchaVerifier(auth, elementId, {
      size: 'invisible',
    });
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
    confirmationResultStore = confirmationResult;
    return confirmationResult;
  } else {
    console.log(`Mock OTP Sent to ${phoneNumber}. (Use verification code "123456" to login)`);
    return { mock: true, phoneNumber };
  }
}

export async function verifyOtp(code: string): Promise<AuthUser> {
  if (hasConfig && auth && confirmationResultStore) {
    const result = await confirmationResultStore.confirm(code);
    const user = result.user;
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'Operator',
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL,
      role: 'student',
    };
  } else {
    if (code === '123456') {
      const mockUser: AuthUser = {
        uid: 'mock-phone-456',
        email: null,
        displayName: 'Phone Operator',
        phoneNumber: '+918888888888',
        photoURL: null,
        role: 'student',
      };
      mockUserStore = mockUser;
      saveMockSession(mockUser);
      notifyListeners();
      return mockUser;
    } else {
      throw new Error('Invalid OTP Code entered.');
    }
  }
}

// Sign out
export async function signOut(): Promise<void> {
  if (hasConfig && auth) {
    await fbSignOut(auth);
  } else {
    mockUserStore = null;
    saveMockSession(null);
    notifyListeners();
  }
}

// Auth State Subscriber
export function subscribeToAuth(callback: (user: AuthUser | null) => void): () => void {
  if (hasConfig && auth) {
    return onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        callback({
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName,
          phoneNumber: fbUser.phoneNumber,
          photoURL: fbUser.photoURL,
          role: 'student', // React hook resolves real role from backend DB
        });
      } else {
        callback(null);
      }
    });
  } else {
    authListeners.add(callback);
    // Send current initial state
    callback(mockUserStore);
    return () => {
      authListeners.delete(callback);
    };
  }
}

function notifyListeners() {
  for (const listener of authListeners) {
    listener(mockUserStore);
  }
}
