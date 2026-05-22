import type { Activity } from '../../../data/course';

export type ActivityProps = {
  activity: Activity;
  weekId: string;
};

/** Namespaced localStorage key for an activity's saved work. */
export function workKey(weekId: string, activityId: string): string {
  return `course:work:${weekId}:${activityId}`;
}
