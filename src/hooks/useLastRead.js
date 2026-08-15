import { useCallback, useEffect, useState } from 'react';
import { STORAGE_KEYS } from '../config/constants';

/**
 * The single piece of user state the site keeps. Everything else is static.
 * Fails silently when storage is unavailable (private browsing, blocked
 * cookies) — a missing "continue where you left off" is not worth an error.
 */
export default function useLastRead() {
  const [lastRead, setLastRead] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.lastRead);
      if (raw) setLastRead(JSON.parse(raw));
    } catch {
      /* storage unavailable — feature simply stays off */
    }
  }, []);

  const remember = useCallback((chapterId) => {
    const value = { chapterId, at: Date.now() };
    setLastRead(value);
    try {
      localStorage.setItem(STORAGE_KEYS.lastRead, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }, []);

  const clear = useCallback(() => {
    setLastRead(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.lastRead);
    } catch {
      /* ignore */
    }
  }, []);

  return { lastRead, remember, clear };
}
