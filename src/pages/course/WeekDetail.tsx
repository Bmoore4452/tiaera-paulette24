import { Link, useParams } from 'react-router-dom';
import { BookOpen, Check, ChevronRight, Lightbulb, Lock, MessagesSquare, NotebookPen, PencilLine, Sparkles } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import Reveal from '../../components/Reveal';
import { Crumbs, ProgressBar } from '../../components/course/ui';
import { useCourseProgress } from '../../components/course/CourseProgress';
import CourseMissing from './CourseMissing';
import { getCourse, getWeek, isInteractive } from '../../data/course';

export default function WeekDetail() {
  const { courseId, weekId } = useParams();
  const course = getCourse(courseId);
  const week = getWeek(course, weekId);
  const { isComplete, weekProgress, isWeekUnlocked, isTeachingPointUnlocked } = useCourseProgress();

  if (!course || !week) return <CourseMissing />;
  const { done, total } = weekProgress(course, week);
  const nextWeek = getWeek(course, `week-${week.number + 1}`);
  const unlocked = isWeekUnlocked(course, week);
  const teachingPoints = week.teachingPoints ?? [];
  const teachingDoneCount = teachingPoints.filter((p) => isComplete(course.id, week.id, 'teaching', p.id)).length;

  return (
    <PageTransition>
      <section className="container-x pt-32 pb-10 md:pt-40">
        <Crumbs
          items={[
            { label: 'Courses', to: '/courses' },
            { label: course.title, to: `/courses/${course.id}` },
            { label: `Week ${week.number}` },
          ]}
        />
        <p className="mt-6 font-serif text-6xl text-bone/25 md:text-7xl">
          {String(week.number).padStart(2, '0')}
        </p>
        <h1 className="mt-2 max-w-4xl text-balance text-5xl md:text-6xl">{week.title}</h1>
        <p className="mt-3 text-sm uppercase tracking-[0.2em] text-flame">{week.theme}</p>
        <p className="mt-6 max-w-2xl text-lg text-bone">{week.objective}</p>

        <div className="mt-8 max-w-sm">
          <ProgressBar done={done} total={total} />
          <p className="mt-2 text-xs text-bone">
            {done} of {total} items complete this week
          </p>
        </div>
      </section>

      {/* Core Teaching — Master Me style: sequenced point pages, each unlocks the next */}
      {teachingPoints.length > 0 && (
        <section className="container-x py-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-bone">
              <Lightbulb size={15} className="text-flame" /> Core Teaching · read in order
            </h2>
            <span className="text-xs text-bone/70">
              {teachingDoneCount} / {teachingPoints.length} complete
            </span>
          </div>
          <p className="mb-5 text-sm text-bone/70">
            Each teaching unlocks the next. Once all are complete, the activities, discussion, and
            journal open up.
          </p>
          <ol className="grid gap-2 md:grid-cols-2">
            {teachingPoints.map((tp, i) => {
              const done = isComplete(course.id, week.id, 'teaching', tp.id);
              const tpUnlocked = isTeachingPointUnlocked(course, week, tp.id);
              return (
                <Reveal key={tp.id} delay={i * 0.02}>
                  <Link
                    to={`/courses/${course.id}/${week.id}/teaching/${tp.id}`}
                    className={[
                      'group flex items-center justify-between gap-4 rounded-2xl border border-bone/10 bg-ink-soft/40 p-5 transition-all',
                      tpUnlocked ? 'hover:border-flame/40 hover:bg-ink-soft/70' : 'pointer-events-none opacity-50',
                    ].join(' ')}
                    aria-disabled={!tpUnlocked}
                    tabIndex={tpUnlocked ? undefined : -1}
                  >
                    <span className="flex items-center gap-4">
                      <span
                        className={[
                          'grid h-8 w-8 shrink-0 place-items-center rounded-full font-serif text-sm',
                          done
                            ? 'bg-flame text-paper'
                            : tpUnlocked
                              ? 'border border-bone/30 text-paper'
                              : 'border border-bone/15 text-bone/40',
                        ].join(' ')}
                      >
                        {done ? <Check size={14} /> : !tpUnlocked ? <Lock size={13} /> : i + 1}
                      </span>
                      <span>
                        <span className="font-serif text-lg text-paper">{tp.title}</span>
                        <span className="mt-0.5 block text-[11px] uppercase tracking-widest text-bone/60">
                          Teaching {i + 1} of {teachingPoints.length}
                        </span>
                      </span>
                    </span>
                    <ChevronRight size={18} className="shrink-0 text-bone/40 transition-colors group-hover:text-flame" />
                  </Link>
                </Reveal>
              );
            })}
          </ol>
        </section>
      )}

      {/* Topics — Time Mastery style: multiple topic pages */}
      {week.topics && week.topics.length > 0 && (
        <section className="container-x py-8">
          <h2 className="mb-5 flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-bone">
            <BookOpen size={15} className="text-flame" /> Key topics
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {week.topics.map((topic, i) => (
              <Reveal key={topic.id} delay={i * 0.02}>
                <Link
                  to={`/courses/${course.id}/${week.id}/topic/${topic.id}`}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-bone/10 bg-ink-soft/40 p-5 transition-all hover:border-flame/40 hover:bg-ink-soft/70"
                >
                  <span className="flex items-center gap-3">
                    <StatusDot done={isComplete(course.id, week.id, 'topic', topic.id)} />
                    <span className="font-serif text-lg text-paper">{topic.title}</span>
                  </span>
                  <ChevronRight size={18} className="shrink-0 text-bone/40 transition-colors group-hover:text-flame" />
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <Section
        icon={<PencilLine size={15} />}
        title="Activities"
        locked={!unlocked}
        lockedReason="Complete every Core Teaching point to unlock activities."
      >
        <div className="space-y-3">
          {week.activities.map((activity, i) => {
            const interactive = isInteractive(activity.kind);
            return (
              <Reveal key={activity.id} delay={i * 0.02}>
                <Link
                  to={`/courses/${course.id}/${week.id}/activity/${activity.id}`}
                  className={[
                    'group flex items-center justify-between gap-4 rounded-2xl border border-bone/10 bg-ink-soft/40 p-5 transition-all',
                    unlocked ? 'hover:border-flame/40 hover:bg-ink-soft/70' : 'pointer-events-none opacity-40',
                  ].join(' ')}
                  aria-disabled={!unlocked}
                  tabIndex={unlocked ? undefined : -1}
                >
                  <span className="flex items-start gap-3">
                    <StatusDot done={isComplete(course.id, week.id, 'activity', activity.id)} />
                    <span>
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-serif text-lg text-paper">{activity.title}</span>
                        {interactive && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-flame/15 px-2 py-0.5 text-[10px] uppercase tracking-widest text-flame">
                            <Sparkles size={10} /> Interactive
                          </span>
                        )}
                      </span>
                      <span className="mt-1 block text-sm text-bone">{activity.summary}</span>
                    </span>
                  </span>
                  <ChevronRight size={18} className="shrink-0 text-bone/40 transition-colors group-hover:text-flame" />
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {week.discussion && week.discussion.length > 0 && (
        <Section
          icon={<MessagesSquare size={15} />}
          title="Discussion · open threads"
          locked={!unlocked}
          lockedReason="Complete every Core Teaching point to unlock the discussion."
        >
          <div className="space-y-3">
            {week.discussion.map((d, i) => (
              <Reveal key={d.id} delay={i * 0.02}>
                <Link
                  to={`/courses/${course.id}/${week.id}/discussion/${d.id}`}
                  className={[
                    'group flex items-center justify-between gap-4 rounded-2xl border border-bone/10 bg-ink-soft/40 p-5 transition-all',
                    unlocked ? 'hover:border-flame/40 hover:bg-ink-soft/70' : 'pointer-events-none opacity-40',
                  ].join(' ')}
                  aria-disabled={!unlocked}
                  tabIndex={unlocked ? undefined : -1}
                >
                  <span className="flex items-start gap-3">
                    <StatusDot done={isComplete(course.id, week.id, 'discussion', d.id)} />
                    <span className="text-base text-paper">{d.question}</span>
                  </span>
                  <ChevronRight size={18} className="shrink-0 text-bone/40 transition-colors group-hover:text-flame" />
                </Link>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {week.journal && (
        <Section
          icon={<NotebookPen size={15} />}
          title="Journal"
          locked={!unlocked}
          lockedReason="Complete every Core Teaching point to unlock the journal."
        >
          <Link
            to={`/courses/${course.id}/${week.id}/journal/${week.journal.id}`}
            className={[
              'group flex items-center justify-between gap-4 rounded-2xl border border-bone/10 bg-ink-soft/40 p-5 transition-all',
              unlocked ? 'hover:border-flame/40 hover:bg-ink-soft/70' : 'pointer-events-none opacity-40',
            ].join(' ')}
            aria-disabled={!unlocked}
            tabIndex={unlocked ? undefined : -1}
          >
            <span className="flex items-start gap-3">
              <StatusDot done={isComplete(course.id, week.id, 'journal', week.journal.id)} />
              <span>
                <span className="font-serif text-lg text-paper">{week.journal.title}</span>
                {week.journal.intro && (
                  <span className="mt-1 block text-sm text-bone">{week.journal.intro}</span>
                )}
                {week.journal.prompts.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {week.journal.prompts.map((p) => (
                      <li key={p.id} className="flex gap-2 text-sm text-bone/70">
                        <PencilLine size={13} className="mt-0.5 shrink-0 text-flame/60" />
                        <span>{p.question}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </span>
            </span>
            <ChevronRight size={18} className="shrink-0 text-bone/40 transition-colors group-hover:text-flame" />
          </Link>
        </Section>
      )}

      <section className="container-x py-12">
        <div className="flex items-center justify-between gap-4 border-t border-bone/10 pt-6">
          {week.number > 1 ? (
            <Link
              to={`/courses/${course.id}/week-${week.number - 1}`}
              className="text-sm text-bone transition-colors hover:text-paper"
            >
              ← Week {week.number - 1}
            </Link>
          ) : (
            <Link to={`/courses/${course.id}`} className="text-sm text-bone transition-colors hover:text-paper">
              ← All weeks
            </Link>
          )}
          {nextWeek && (
            <Link
              to={`/courses/${course.id}/${nextWeek.id}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-flame transition-colors hover:text-paper"
            >
              Week {nextWeek.number}: {nextWeek.theme} <ChevronRight size={16} />
            </Link>
          )}
        </div>
      </section>
    </PageTransition>
  );
}

function Section({
  icon,
  title,
  locked,
  lockedReason,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  locked: boolean;
  lockedReason: string;
  children: React.ReactNode;
}) {
  return (
    <section className="container-x py-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-bone">
          <span className="text-flame">{icon}</span> {title}
        </h2>
        {locked && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-bone/20 px-3 py-1 text-[10px] uppercase tracking-widest text-bone">
            <Lock size={10} /> Locked
          </span>
        )}
      </div>
      {locked && <p className="mb-4 text-sm text-bone/60">{lockedReason}</p>}
      {children}
    </section>
  );
}

function StatusDot({ done }: { done: boolean }) {
  return done ? (
    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-flame text-paper">
      <Check size={12} />
    </span>
  ) : (
    <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full border border-bone/30" />
  );
}
