import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import {
  courses,
  courseTotalItems,
  itemKey,
  weekSteps,
  type Course,
  type ProgressKind,
  type Week,
} from '../../data/course';

type ProgressState = {
  /** Set of completed item keys, e.g. "time-mastery:week-1:topic:what-is-time-mastery". */
  completed: string[];
};

type ProgressContextValue = {
  isComplete: (courseId: string, weekId: string, kind: ProgressKind, id: string) => boolean;
  toggle: (courseId: string, weekId: string, kind: ProgressKind, id: string) => void;
  setComplete: (courseId: string, weekId: string, kind: ProgressKind, id: string, done: boolean) => void;
  weekProgress: (course: Course, week: Week) => { done: number; total: number };
  courseProgress: (course: Course) => { done: number; total: number };
  /** True when every Core Teaching point in the week is complete (or when the course doesn't require gating). */
  isWeekUnlocked: (course: Course, week: Week) => boolean;
  /** True for the first teaching point and for any later point whose predecessors are all complete. */
  isTeachingPointUnlocked: (course: Course, week: Week, pointId: string) => boolean;
  resetCourse: (courseId: string) => void;
  resetAll: () => void;
};

const Ctx = createContext<ProgressContextValue | null>(null);

export function CourseProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState, reset] = useLocalStorage<ProgressState>('course:progress', {
    completed: [],
  });

  const completedSet = useMemo(() => new Set(state.completed), [state.completed]);

  const isComplete = useCallback<ProgressContextValue['isComplete']>(
    (courseId, weekId, kind, id) => completedSet.has(itemKey(courseId, weekId, kind, id)),
    [completedSet],
  );

  const setComplete = useCallback<ProgressContextValue['setComplete']>(
    (courseId, weekId, kind, id, done) => {
      const key = itemKey(courseId, weekId, kind, id);
      setState((prev) => {
        const has = prev.completed.includes(key);
        if (done && !has) return { completed: [...prev.completed, key] };
        if (!done && has) return { completed: prev.completed.filter((k) => k !== key) };
        return prev;
      });
    },
    [setState],
  );

  const toggle = useCallback<ProgressContextValue['toggle']>(
    (courseId, weekId, kind, id) => setComplete(courseId, weekId, kind, id, !isComplete(courseId, weekId, kind, id)),
    [isComplete, setComplete],
  );

  const weekProgress = useCallback<ProgressContextValue['weekProgress']>(
    (course, week) => {
      const keys = weekSteps(course.id, week).map((s) => itemKey(course.id, s.weekId, s.kind, s.id));
      return { done: keys.filter((k) => completedSet.has(k)).length, total: keys.length };
    },
    [completedSet],
  );

  const courseProgress = useCallback<ProgressContextValue['courseProgress']>(
    (course) => {
      const total = courseTotalItems(course);
      let done = 0;
      for (const w of course.weeks) {
        for (const s of weekSteps(course.id, w)) {
          if (completedSet.has(itemKey(course.id, s.weekId, s.kind, s.id))) done++;
        }
      }
      return { done, total };
    },
    [completedSet],
  );

  const isWeekUnlocked = useCallback<ProgressContextValue['isWeekUnlocked']>(
    (course, week) => {
      if (!course.gatedByTeaching) return true;
      const points = week.teachingPoints ?? [];
      if (points.length === 0) return true;
      return points.every((p) => completedSet.has(itemKey(course.id, week.id, 'teaching', p.id)));
    },
    [completedSet],
  );

  const isTeachingPointUnlocked = useCallback<ProgressContextValue['isTeachingPointUnlocked']>(
    (course, week, pointId) => {
      const points = week.teachingPoints ?? [];
      const idx = points.findIndex((p) => p.id === pointId);
      if (idx <= 0) return true; // first (or unknown) point is always open
      return points
        .slice(0, idx)
        .every((p) => completedSet.has(itemKey(course.id, week.id, 'teaching', p.id)));
    },
    [completedSet],
  );

  const resetCourse = useCallback<ProgressContextValue['resetCourse']>(
    (courseId) => {
      setState((prev) => ({
        completed: prev.completed.filter((k) => !k.startsWith(`${courseId}:`)),
      }));
    },
    [setState],
  );

  const value: ProgressContextValue = {
    isComplete,
    toggle,
    setComplete,
    weekProgress,
    courseProgress,
    isWeekUnlocked,
    isTeachingPointUnlocked,
    resetCourse,
    resetAll: reset,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCourseProgress() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCourseProgress must be used within CourseProgressProvider');
  return ctx;
}

/** Re-export for callers needing the raw list. */
export { courses };
