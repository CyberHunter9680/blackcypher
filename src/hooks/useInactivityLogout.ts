import { useEffect, useRef, useCallback } from 'react';

const INACTIVITY_TIMEOUT_MS = 20 * 60 * 1000; // 20 minutes
const WARNING_BEFORE_MS = 60 * 1000;           // Show warning 1 min before logout

interface UseInactivityLogoutOptions {
  onLogout: () => void;
  onWarn: () => void;
  onResetWarning: () => void;
  isLoggedIn: boolean;
}

export function useInactivityLogout({
  onLogout,
  onWarn,
  onResetWarning,
  isLoggedIn,
}: UseInactivityLogoutOptions) {
  const logoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    if (warnTimer.current) clearTimeout(warnTimer.current);
  }, []);

  const resetTimers = useCallback(() => {
    clearTimers();
    onResetWarning();

    if (!isLoggedIn) return;

    // Warn 1 min before auto-logout
    warnTimer.current = setTimeout(() => {
      onWarn();
    }, INACTIVITY_TIMEOUT_MS - WARNING_BEFORE_MS);

    // Auto-logout after full inactivity period
    logoutTimer.current = setTimeout(() => {
      onLogout();
    }, INACTIVITY_TIMEOUT_MS);
  }, [isLoggedIn, onLogout, onWarn, onResetWarning, clearTimers]);

  useEffect(() => {
    if (!isLoggedIn) {
      clearTimers();
      return;
    }

    const activityEvents = [
      'mousemove', 'mousedown', 'keydown',
      'touchstart', 'scroll', 'wheel', 'click',
    ];

    const handleActivity = () => resetTimers();

    // Start timers immediately on login
    resetTimers();

    // Attach activity listeners
    activityEvents.forEach(event =>
      window.addEventListener(event, handleActivity, { passive: true })
    );

    return () => {
      clearTimers();
      activityEvents.forEach(event =>
        window.removeEventListener(event, handleActivity)
      );
    };
  }, [isLoggedIn, resetTimers, clearTimers]);

  return { resetTimers };
}
