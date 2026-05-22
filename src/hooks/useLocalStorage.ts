import { useCallback, useEffect, useState } from 'react';

/**
 * Persisted state, backed by localStorage. POC persistence layer — swap for
 * Supabase later by replacing the read/write here. Keys are namespaced under
 * `tp24:` so course data is easy to find and clear.
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const storageKey = `tp24:${key}`;

  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initial;
    try {
      const raw = window.localStorage.getItem(storageKey);
      return raw !== null ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      /* storage full or unavailable — POC tolerates silently */
    }
  }, [storageKey, value]);

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      /* ignore */
    }
    setValue(initial);
    // initial intentionally excluded — treated as a stable default
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  return [value, setValue, reset] as const;
}
