import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Check, Lock, RotateCcw } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import Reveal from '../../components/Reveal';
import { Crumbs, ProgressBar } from '../../components/course/ui';
import { useCourseProgress } from '../../components/course/CourseProgress';
import CourseMissing from './CourseMissing';
import { getCourse } from '../../data/course';

/** `/courses/:courseId` — single masterclass home, listing its weeks. */
export default function CoursePage() {
  const { courseId } = useParams();
  const course = getCourse(courseId);
  const { courseProgress, weekProgress, isWeekUnlocked, resetCourse } = useCourseProgress();

  if (!course) return <CourseMissing />;
  const { done, total } = courseProgress(course);

  return (
    <PageTransition>
      <section className="container-x pt-32 pb-10 md:pt-40">
        <Crumbs items={[{ label: 'Courses', to: '/courses' }, { label: course.title }]} />
        <p className="mt-6 eyebrow">{course.title}</p>
        <h1 className="mt-6 max-w-4xl text-balance text-6xl md:text-7xl">
          {course.subtitle.split('.')[0]}
          {course.subtitle.includes('.') && <span className="text-flame">.</span>}
        </h1>
        <p className="mt-8 max-w-2xl text-balance text-lg text-bone md:text-xl">{course.overview}</p>

        <div className="mt-10 max-w-md">
          <div className="flex items-center justify-between text-sm">
            <span className="text-bone">Your progress</span>
            <span className="text-paper">
              {done} / {total} completed
            </span>
          </div>
          <ProgressBar done={done} total={total} className="mt-3" />
        </div>
      </section>

      <section className="container-x py-10">
        <div className="grid gap-5 sm:grid-cols-2">
          {course.weeks.map((week, i) => {
            const { done: wd, total: wt } = weekProgress(course, week);
            const unlocked = isWeekUnlocked(course, week);
            const complete = wd === wt;
            return (
              <Reveal key={week.id} delay={i * 0.03}>
                <Link
                  to={`/courses/${course.id}/${week.id}`}
                  className="group flex h-full flex-col rounded-3xl border border-bone/10 bg-ink-soft/40 p-7 transition-all duration-500 hover:border-flame/40 hover:bg-ink-soft/70"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-serif text-5xl text-bone/30 transition-colors group-hover:text-flame/60">
                      {String(week.number).padStart(2, '0')}
                    </span>
                    {complete ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-flame/15 px-2.5 py-1 text-[10px] uppercase tracking-widest text-flame">
                        <Check size={11} /> Done
                      </span>
                    ) : course.gatedByTeaching && !unlocked ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-bone/20 px-2.5 py-1 text-[10px] uppercase tracking-widest text-bone">
                        <Lock size={11} /> Teaching first
                      </span>
                    ) : null}
                  </div>
                  <h2 className="mt-4 text-2xl text-paper md:text-3xl">{week.title}</h2>
                  <p className="mt-1 text-sm uppercase tracking-[0.18em] text-flame/80">{week.theme}</p>
                  <p className="mt-4 flex-1 text-sm text-bone">{week.objective}</p>
                  <div className="mt-6">
                    <ProgressBar done={wd} total={wt} />
                    <div className="mt-2.5 flex items-center justify-between text-xs text-bone">
                      <span>{itemSummary(week)}</span>
                      <span className="inline-flex items-center gap-1 text-paper transition-colors group-hover:text-flame">
                        Open <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="container-x py-16">
        <div className="rounded-3xl border border-bone/10 bg-ink-soft/50 p-8 md:p-12">
          <p className="eyebrow">By the end</p>
          <ul className="mt-8 grid gap-4 text-lg text-paper md:grid-cols-3">
            {course.outcomes.map((o) => (
              <li key={o} className="flex gap-3">
                <Check size={18} className="mt-1 shrink-0 text-flame" />
                <span className="text-base text-bone">{o}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {course.closing && (
        <section className="container-x py-12">
          <div className="rounded-3xl border border-flame/30 bg-flame/5 p-8 md:p-12">
            <p className="text-sm uppercase tracking-[0.22em] text-flame">{course.closing.title}</p>
            {course.closing.subtitle && (
              <h2 className="mt-3 text-balance text-3xl text-paper md:text-4xl">
                {course.closing.subtitle}
              </h2>
            )}
            <p className="mt-6 max-w-2xl text-bone">"{course.closing.finalTakeaway}"</p>
          </div>
        </section>
      )}

      <section className="container-x pb-24">
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Reset your progress in "${course.title}"?`)) resetCourse(course.id);
          }}
          className="inline-flex items-center gap-2 text-xs text-bone/50 transition-colors hover:text-flame"
        >
          <RotateCcw size={13} /> Reset progress in this course
        </button>
      </section>
    </PageTransition>
  );
}

function itemSummary(week: { topics?: { id: string }[]; activities: { id: string }[]; discussion?: unknown[]; journal?: unknown }): string {
  const parts: string[] = [];
  if (week.topics?.length) parts.push(`${week.topics.length} topics`);
  if (week.activities.length) parts.push(`${week.activities.length} activities`);
  if (week.discussion?.length) parts.push(`${week.discussion.length} discussions`);
  if (week.journal) parts.push('journal');
  return parts.join(' · ');
}
