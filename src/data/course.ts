import timeMasteryRaw from './time-mastery.content.json';
import masterMeRaw from './master-me.content.json';

/**
 * Course content lives in per-course JSON files (so authoring/editing is independent
 * of component code, and each file maps cleanly to a future DB row shape). This
 * module gives the JSON types and selectors. Both courses share one schema; some
 * fields are optional because the two courses have different shapes:
 *
 *   Time Mastery → topic-list + activity-list per week (no teaching gate, no
 *   separate discussion or journal blocks).
 *
 *   Master Me → a single Core Teaching block per week (`teaching`) that gates
 *   activities + discussion + journal until marked complete (`gatedByTeaching`).
 */

export type ActivityKind =
  // Time Mastery interactives
  | 'time-audit'
  | 'time-blocking'
  | 'boundary-setting'
  | 'distraction-mapping'
  | 'energy-rhythms'
  | 'pareto'
  | 'work-life-integration'
  | 'mastery-roadmap'
  // Master Me interactives
  | 'identity-inventory'
  | 'time-energy-audit'
  | 'sabotage-assessment'
  | 'habit-builder'
  | 'vision-casting'
  | 'bridge-future'
  // Shared fallbacks
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

/**
 * Master Me's Core Teaching Points — an ordered list of short teaching pages.
 * Each must be marked complete to unlock the next; once all are complete, the
 * week's activities / discussion / journal unlock. Shape is identical to
 * `Topic`, but the sequencing semantics differ, so it gets its own field.
 */
export type TeachingPoint = Topic;

/** A single discussion prompt that opens its own shared thread page. */
export type DiscussionQuestion = {
  id: string;
  question: string;
};

/** The journal page for a Master Me week — fillable prompts that mirror the printed Journal PDF. */
export type Journal = {
  id: string;
  title: string;
  intro?: string;
  prompts: { id: string; question: string }[];
};

export type Week = {
  id: string;
  number: number;
  title: string;
  theme: string;
  objective: string;
  /** Time Mastery: multi-page topics (parallel, ungated). Absent on Master Me. */
  topics?: Topic[];
  /** Master Me: ordered Core Teaching pages (sequential, each gates the next). Absent on Time Mastery. */
  teachingPoints?: TeachingPoint[];
  activities: Activity[];
  /** Master Me: shared discussion threads. Absent on Time Mastery. */
  discussion?: DiscussionQuestion[];
  /** Master Me: a fillable journal. Absent on Time Mastery. */
  journal?: Journal;
};

export type Course = {
  id: string;
  title: string;
  subtitle: string;
  overview: string;
  outcomes: string[];
  /** When true, each week's activities/discussion/journal are locked until the week's `teaching` is marked complete. */
  gatedByTeaching?: boolean;
  weeks: Week[];
  closing?: {
    title: string;
    subtitle?: string;
    body: string[];
    finalTakeaway: string;
  };
};

/** Every course shipped in the POC. Ordering controls how they appear on the courses index. */
export const courses: Course[] = [
  timeMasteryRaw as unknown as Course,
  masterMeRaw as unknown as Course,
];

const INTERACTIVE_KINDS: ActivityKind[] = [
  // Time Mastery
  'time-audit',
  'time-blocking',
  'boundary-setting',
  'distraction-mapping',
  'energy-rhythms',
  'pareto',
  'work-life-integration',
  'mastery-roadmap',
  // Master Me
  'identity-inventory',
  'time-energy-audit',
  'sabotage-assessment',
  'habit-builder',
  'vision-casting',
  'bridge-future',
];

export function isInteractive(kind: ActivityKind): boolean {
  return INTERACTIVE_KINDS.includes(kind);
}

// ---------------------------------------------------------------------------
// Selectors. All take an optional id and return undefined when not found so
// route handlers can render a 404 instead of throwing.
// ---------------------------------------------------------------------------

export function getCourse(courseId: string | undefined): Course | undefined {
  return courses.find((c) => c.id === courseId);
}

export function getWeek(course: Course | undefined, weekId: string | undefined): Week | undefined {
  return course?.weeks.find((w) => w.id === weekId);
}

export function getTopic(week: Week | undefined, topicId: string | undefined): Topic | undefined {
  return week?.topics?.find((t) => t.id === topicId);
}

export function getTeachingPoint(week: Week | undefined, pointId: string | undefined): TeachingPoint | undefined {
  return week?.teachingPoints?.find((p) => p.id === pointId);
}

/** Index of a teaching point within its week (-1 if not found). */
export function teachingPointIndex(week: Week | undefined, pointId: string | undefined): number {
  return week?.teachingPoints?.findIndex((p) => p.id === pointId) ?? -1;
}

export function getActivity(week: Week | undefined, activityId: string | undefined): Activity | undefined {
  return week?.activities.find((a) => a.id === activityId);
}

export function getDiscussion(
  week: Week | undefined,
  discussionId: string | undefined,
): DiscussionQuestion | undefined {
  return week?.discussion?.find((d) => d.id === discussionId);
}

// ---------------------------------------------------------------------------
// Progress helpers. Keys are namespaced by course so progress in one course
// can't collide with another.
// ---------------------------------------------------------------------------

export type ProgressKind = 'topic' | 'activity' | 'teaching' | 'discussion' | 'journal';

export function itemKey(courseId: string, weekId: string, kind: ProgressKind, id: string): string {
  return `${courseId}:${weekId}:${kind}:${id}`;
}

/** Step type for a week's prev/next nav. Includes all the structural items in display order. */
export type Step = {
  courseId: string;
  weekId: string;
  kind: ProgressKind;
  id: string;
  title: string;
};

export function weekSteps(courseId: string, week: Week): Step[] {
  const steps: Step[] = [];
  for (const tp of week.teachingPoints ?? []) {
    steps.push({ courseId, weekId: week.id, kind: 'teaching', id: tp.id, title: tp.title });
  }
  for (const t of week.topics ?? []) {
    steps.push({ courseId, weekId: week.id, kind: 'topic', id: t.id, title: t.title });
  }
  for (const a of week.activities) {
    steps.push({ courseId, weekId: week.id, kind: 'activity', id: a.id, title: a.title });
  }
  for (const d of week.discussion ?? []) {
    steps.push({ courseId, weekId: week.id, kind: 'discussion', id: d.id, title: d.question });
  }
  if (week.journal) {
    steps.push({ courseId, weekId: week.id, kind: 'journal', id: week.journal.id, title: week.journal.title });
  }
  return steps;
}

/** Count of every trackable item in a course. */
export function courseTotalItems(course: Course): number {
  return course.weeks.reduce((sum, w) => sum + weekSteps(course.id, w).length, 0);
}
