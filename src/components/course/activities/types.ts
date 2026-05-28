import type { Activity } from '../../../data/course';

export type ActivityProps = {
  activity: Activity;
  courseId: string;
  weekId: string;
};

/** Namespaced localStorage key for an activity's saved work. */
export function workKey(courseId: string, weekId: string, activityId: string): string {
  return `course:work:${courseId}:${weekId}:${activityId}`;
}
