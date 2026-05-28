import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Lightbulb, Lock } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import { Crumbs, CompleteToggle } from '../../components/course/ui';
import { useCourseProgress } from '../../components/course/CourseProgress';
import CourseMissing from './CourseMissing';
import { getCourse, getTeachingPoint, getWeek, teachingPointIndex } from '../../data/course';

/**
 * One Core Teaching point page. The points are sequenced — a point is locked
 * until every earlier point in its week has been marked complete.
 */
export default function TeachingPointPage() {
  const { courseId, weekId, teachingId } = useParams();
  const course = getCourse(courseId);
  const week = getWeek(course, weekId);
  const point = getTeachingPoint(week, teachingId);
  const { isComplete, isTeachingPointUnlocked } = useCourseProgress();

  if (!course || !week || !point) return <CourseMissing />;
  const points = week.teachingPoints ?? [];
  const idx = teachingPointIndex(week, point.id);
  const total = points.length;
  const unlocked = isTeachingPointUnlocked(course, week, point.id);
  const completed = isComplete(course.id, week.id, 'teaching', point.id);
  const prev = idx > 0 ? points[idx - 1] : null;
  const next = idx < total - 1 ? points[idx + 1] : null;

  return (
    <PageTransition>
      <article className="container-x max-w-3xl pt-32 pb-20 md:pt-40">
        <Crumbs
          items={[
            { label: 'Courses', to: '/courses' },
            { label: course.title, to: `/courses/${course.id}` },
            { label: `Week ${week.number}`, to: `/courses/${course.id}/${week.id}` },
            { label: `Teaching ${idx + 1} of ${total}` },
          ]}
        />

        <p className="mt-6 text-sm uppercase tracking-[0.2em] text-flame">
          {week.theme} · Teaching {idx + 1} of {total}
        </p>

        {!unlocked ? (
          <div className="mt-10 rounded-3xl border border-bone/15 bg-ink-soft/40 p-8 text-center">
            <Lock size={28} className="mx-auto text-flame" />
            <h1 className="mt-5 text-balance text-3xl md:text-4xl">Read the previous teaching first</h1>
            <p className="mt-4 text-bone">
              The Core Teaching points unlock one at a time. Finish the earlier points in this week
              before opening this one.
            </p>
            {prev && (
              <Link
                to={`/courses/${course.id}/${week.id}/teaching/${prev.id}`}
                className="btn-primary mt-8"
              >
                Go to teaching {idx} · {prev.title}
              </Link>
            )}
          </div>
        ) : (
          <>
            <h1 className="mt-3 text-balance text-4xl md:text-5xl">{point.title}</h1>

            <div className="mt-8 space-y-5">
              {point.body.map((para, i) => (
                <p key={i} className="text-lg leading-relaxed text-bone">
                  {para}
                </p>
              ))}
            </div>

            {point.takeaways && point.takeaways.length > 0 && (
              <div className="mt-10 rounded-2xl border border-bone/10 bg-ink-soft/40 p-6">
                <p className="mb-4 flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-bone">
                  <Lightbulb size={15} className="text-flame" /> Takeaways
                </p>
                <ul className="space-y-3">
                  {point.takeaways.map((t) => (
                    <li key={t} className="flex gap-3 text-paper">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-flame" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
              <CompleteToggle courseId={course.id} weekId={week.id} kind="teaching" id={point.id} />
              {completed && next && (
                <Link
                  to={`/courses/${course.id}/${week.id}/teaching/${next.id}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-flame transition-colors hover:text-paper"
                >
                  Next teaching <ChevronRight size={16} />
                </Link>
              )}
              {completed && !next && (
                <Link
                  to={`/courses/${course.id}/${week.id}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-flame transition-colors hover:text-paper"
                >
                  All teaching complete — back to week <ChevronRight size={16} />
                </Link>
              )}
            </div>
          </>
        )}

        <div className="mt-12 flex items-center justify-between gap-4 border-t border-bone/10 pt-6">
          {prev ? (
            <Link
              to={`/courses/${course.id}/${week.id}/teaching/${prev.id}`}
              className="group inline-flex max-w-[45%] items-center gap-2 text-sm text-bone transition-colors hover:text-paper"
            >
              <ChevronLeft size={16} className="shrink-0" />
              <span className="truncate">{prev.title}</span>
            </Link>
          ) : (
            <Link
              to={`/courses/${course.id}/${week.id}`}
              className="inline-flex items-center gap-2 text-sm text-bone hover:text-paper"
            >
              <ChevronLeft size={16} /> Week overview
            </Link>
          )}

          {next && (
            <Link
              to={`/courses/${course.id}/${week.id}/teaching/${next.id}`}
              className={[
                'group inline-flex max-w-[45%] items-center gap-2 text-right text-sm transition-colors',
                completed ? 'text-paper hover:text-flame' : 'text-bone/40 hover:text-bone',
              ].join(' ')}
              title={completed ? 'Next teaching' : 'Mark this complete to unlock the next teaching'}
            >
              <span className="truncate">{next.title}</span>
              <ChevronRight size={16} className="shrink-0" />
            </Link>
          )}
        </div>
      </article>
    </PageTransition>
  );
}
