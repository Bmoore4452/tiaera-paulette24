import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { course, itemKey, totalItems, type Week } from '../../data/course';

type ProgressState = {
  /** Set of completed item keys, e.g. "week-1:topic:what-is-time-mastery". */
  completed: string[];
};

type ProgressContextValue = {
  isComplete: (weekId: string, kind: 'topic' | 'activity', id: string) => boolean;
  toggle: (weekId: string, kind: 'topic' | 'activity', id: string) => void;
  setComplete: (weekId: string, kind: 'topic' | 'activity', id: string, done: boolean) => void;
  completedCount: number;
  totalCount: number;
  weekProgress: (week: Week) => { done: number; total: number };
  resetAll: () => void;
};

const Ctx = createContext<ProgressContextValue | null>(null);

export function CourseProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState, reset] = useLocalStorage<ProgressState>('course:progress', {
    completed: [],
  });

  const completedSet = useMemo(() => new Set(state.completed), [state.completed]);

  const isComplete = useCallback(
    (weekId: string, kind: 'topic' | 'activity', id: string) =>
      completedSet.has(itemKey(weekId, kind, id)),
    [completedSet],
  );

  const setComplete = useCallback(
    (weekId: string, kind: 'topic' | 'activity', id: string, done: boolean) => {
      const key = itemKey(weekId, kind, id);
      setState((prev) => {
        const has = prev.completed.includes(key);
        if (done && !has) return { completed: [...prev.completed, key] };
        if (!done && has) return { completed: prev.completed.filter((k) => k !== key) };
        return prev;
      });
    },
    [setState],
  );

  const toggle = useCallback(
    (weekId: string, kind: 'topic' | 'activity', id: string) => {
      setComplete(weekId, kind, id, !isComplete(weekId, kind, id));
    },
    [isComplete, setComplete],
  );

  const weekProgress = useCallback(
    (week: Week) => {
      const items = [
        ...week.topics.map((t) => itemKey(week.id, 'topic', t.id)),
        ...week.activities.map((a) => itemKey(week.id, 'activity', a.id)),
      ];
      return { done: items.filter((k) => completedSet.has(k)).length, total: items.length };
    },
    [completedSet],
  );

  const value: ProgressContextValue = {
    isComplete,
    toggle,
    setComplete,
    completedCount: state.completed.length,
    totalCount: totalItems,
    weekProgress,
    resetAll: reset,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCourseProgress() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCourseProgress must be used within CourseProgressProvider');
  return ctx;
}

/** Convenience: total weeks, for headers etc. */
export const totalWeeks = course.weeks.length;
