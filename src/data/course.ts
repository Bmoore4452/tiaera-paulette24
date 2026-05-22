import raw from './course.content.json';

/**
 * Course content lives in `course.content.json` so it can be edited without
 * touching component code (and later serialized to a DB / Supabase row shape).
 * This module gives it types and a few selectors.
 */

/** Interactive activities get a bespoke UI; reflection/discussion render the generic worksheet. */
export type ActivityKind =
  | 'time-audit'
  | 'time-blocking'
  | 'boundary-setting'
  | 'distraction-mapping'
  | 'energy-rhythms'
  | 'pareto'
  | 'work-life-integration'
  | 'mastery-roadmap'
  | 'reflection'
  | 'discussion';

export type Activity = {
  id: string;
  title: string;
  kind: ActivityKind;
  summary: string;
  /** Prompts for generic reflection / discussion activities. */
  prompts?: string[];
};

export type Topic = {
  id: string;
  title: string;
  body: string[];
  takeaways?: string[];
};

export type Week = {
  id: string;
  number: number;
  title: string;
  theme: string;
  objective: string;
  topics: Topic[];
  activities: Activity[];
};

export type Course = {
  title: string;
  subtitle: string;
  overview: string;
  outcomes: string[];
  weeks: Week[];
};

export const course = raw as Course;

const INTERACTIVE_KINDS: ActivityKind[] = [
  'time-audit',
  'time-blocking',
  'boundary-setting',
  'distraction-mapping',
  'energy-rhythms',
  'pareto',
  'work-life-integration',
  'mastery-roadmap',
];

export function isInteractive(kind: ActivityKind): boolean {
  return INTERACTIVE_KINDS.includes(kind);
}

export function getWeek(weekId: string | undefined): Week | undefined {
  return course.weeks.find((w) => w.id === weekId);
}

export function getTopic(week: Week | undefined, topicId: string | undefined): Topic | undefined {
  return week?.topics.find((t) => t.id === topicId);
}

export function getActivity(week: Week | undefined, activityId: string | undefined): Activity | undefined {
  return week?.activities.find((a) => a.id === activityId);
}

/** Flat list of every step in the course, in order — used for prev/next navigation. */
export type Step = {
  weekId: string;
  kind: 'topic' | 'activity';
  id: string;
  title: string;
};

export function weekSteps(week: Week): Step[] {
  return [
    ...week.topics.map((t): Step => ({ weekId: week.id, kind: 'topic', id: t.id, title: t.title })),
    ...week.activities.map((a): Step => ({ weekId: week.id, kind: 'activity', id: a.id, title: a.title })),
  ];
}

/** Total number of trackable items (topics + activities) across the course. */
export const totalItems = course.weeks.reduce(
  (sum, w) => sum + w.topics.length + w.activities.length,
  0,
);

export function itemKey(weekId: string, kind: 'topic' | 'activity', id: string): string {
  return `${weekId}:${kind}:${id}`;
}
