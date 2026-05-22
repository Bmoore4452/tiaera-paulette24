import { Link } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import { useCourseProgress } from './CourseProgress';
import { getWeek, weekSteps, type Step, type Week } from '../../data/course';

/** Thin progress bar with optional count label. */
export function ProgressBar({
  done,
  total,
  className,
}: {
  done: number;
  total: number;
  className?: string;
}) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className={className}>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-bone/15">
        <div
          className="h-full rounded-full bg-flame transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function Crumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-bone/70">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {item.to ? (
            <Link to={item.to} className="transition-colors hover:text-flame">
              {item.label}
            </Link>
          ) : (
            <span className="text-bone">{item.label}</span>
          )}
          {i < items.length - 1 && <span className="text-bone/30">/</span>}
        </span>
      ))}
    </nav>
  );
}

/** Mark-complete toggle button. */
export function CompleteToggle({
  weekId,
  kind,
  id,
}: {
  weekId: string;
  kind: 'topic' | 'activity';
  id: string;
}) {
  const { isComplete, toggle } = useCourseProgress();
  const done = isComplete(weekId, kind, id);
  return (
    <button
      type="button"
      onClick={() => toggle(weekId, kind, id)}
      className={[
        'inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all',
        done
          ? 'bg-flame text-paper hover:bg-flame-deep'
          : 'border border-bone/30 text-paper hover:border-flame/60',
      ].join(' ')}
    >
      {done ? <Check size={16} /> : <Circle size={16} />}
      {done ? 'Completed' : 'Mark complete'}
    </button>
  );
}

function stepHref(step: Step): string {
  return `/course/${step.weekId}/${step.kind}/${step.id}`;
}

/** Previous / next navigation across the topics + activities of a week. */
export function StepNav({ week, currentId }: { week: Week; currentId: string }) {
  const steps = weekSteps(week);
  const idx = steps.findIndex((s) => s.id === currentId);
  const prev = idx > 0 ? steps[idx - 1] : null;
  const next = idx >= 0 && idx < steps.length - 1 ? steps[idx + 1] : null;

  // When at the end of a week, point "next" to the following week's overview.
  const nextWeek = getWeek(`week-${week.number + 1}`);

  return (
    <div className="mt-12 flex items-center justify-between gap-4 border-t border-bone/10 pt-6">
      {prev ? (
        <Link
          to={stepHref(prev)}
          className="group inline-flex max-w-[45%] items-center gap-2 text-sm text-bone transition-colors hover:text-paper"
        >
          <ChevronLeft size={16} className="shrink-0" />
          <span className="truncate">{prev.title}</span>
        </Link>
      ) : (
        <Link to={`/course/${week.id}`} className="inline-flex items-center gap-2 text-sm text-bone hover:text-paper">
          <ChevronLeft size={16} /> Week overview
        </Link>
      )}

      {next ? (
        <Link
          to={stepHref(next)}
          className="group inline-flex max-w-[45%] items-center gap-2 text-right text-sm text-bone transition-colors hover:text-paper"
        >
          <span className="truncate">{next.title}</span>
          <ChevronRight size={16} className="shrink-0" />
        </Link>
      ) : nextWeek ? (
        <Link
          to={`/course/${nextWeek.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-flame hover:text-paper"
        >
          Week {nextWeek.number}: {nextWeek.theme} <ChevronRight size={16} />
        </Link>
      ) : (
        <Link to="/course" className="inline-flex items-center gap-2 text-sm font-medium text-flame hover:text-paper">
          Finish <ChevronRight size={16} />
        </Link>
      )}
    </div>
  );
}

/** Small autosave reassurance line for activity pages. */
export function AutosaveNote() {
  return (
    <p className="mt-2 inline-flex items-center gap-2 text-xs text-bone/60">
      <span className="h-1.5 w-1.5 rounded-full bg-flame" />
      Your work saves automatically on this device.
    </p>
  );
}
