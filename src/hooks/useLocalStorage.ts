import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Persisted state, backed by localStorage. POC persistence layer — swap for
 * Supabase later by replacing the read/write here. Keys are namespaced under
 * `tp24:` so course data is easy to find and clear.
 *
 * Instances that share a key stay in sync: a write from one component (e.g.
 * saving the discussion profile in `ProfileForm`) immediately updates every
 * other hook reading the same key (e.g. `DiscussionPage`), without a refresh.
 */

// Module-level pub/sub so all hooks bound to a key react to one another's writes.
type Listener = (value: unknown) => void;
const listeners = new Map<string, Set<Listener>>();

function subscribe(storageKey: string, fn: Listener) {
  let set = listeners.get(storageKey);
  if (!set) {
    set = new Set();
    listeners.set(storageKey, set);
  }
  set.add(fn);
  return () => {
    set!.delete(fn);
  };
}

function broadcast(storageKey: string, value: unknown, except: Listener) {
  const set = listeners.get(storageKey);
  if (!set) return;
  for (const fn of set) if (fn !== except) fn(value);
}

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

  // Stable per-instance listener so we can exclude ourselves when broadcasting.
  const onPeerChange = useRef<Listener>((next) => setValue(next as T)).current;

  useEffect(() => subscribe(storageKey, onPeerChange), [storageKey, onPeerChange]);

  const setStored = useCallback(
    (update: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next = typeof update === 'function' ? (update as (prev: T) => T)(prev) : update;
        try {
          window.localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          /* storage full or unavailable — POC tolerates silently */
        }
        broadcast(storageKey, next, onPeerChange);
        return next;
      });
    },
    [storageKey, onPeerChange],
  );

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      /* ignore */
    }
    setValue(initial);
    broadcast(storageKey, initial, onPeerChange);
    // initial intentionally excluded — treated as a stable default
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, onPeerChange]);

  return [value, setStored, reset] as const;
}
