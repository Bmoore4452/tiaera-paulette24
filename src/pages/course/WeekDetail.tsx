import { Link, useParams } from 'react-router-dom';
import { BookOpen, Check, ChevronRight, PencilLine, Sparkles } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import Reveal from '../../components/Reveal';
import { Crumbs, ProgressBar } from '../../components/course/ui';
import { useCourseProgress } from '../../components/course/CourseProgress';
import CourseMissing from './CourseMissing';
import { getWeek, isInteractive } from '../../data/course';

export default function WeekDetail() {
  const { weekId } = useParams();
  const week = getWeek(weekId);
  const { isComplete, weekProgress } = useCourseProgress();

  if (!week) return <CourseMissing />;
  const { done, total } = weekProgress(week);
  const nextWeek = getWeek(`week-${week.number + 1}`);

  return (
    <PageTransition>
      <section className="container-x pt-32 pb-10 md:pt-40">
        <Crumbs
          items={[
            { label: 'Course', to: '/course' },
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

      <section className="container-x py-8">
        <h2 className="mb-5 flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-bone">
          <BookOpen size={15} className="text-flame" /> Key topics
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {week.topics.map((topic, i) => (
            <Reveal key={topic.id} delay={i * 0.02}>
              <Link
                to={`/course/${week.id}/topic/${topic.id}`}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-bone/10 bg-ink-soft/40 p-5 transition-all hover:border-flame/40 hover:bg-ink-soft/70"
              >
                <span className="flex items-center gap-3">
                  <StatusDot done={isComplete(week.id, 'topic', topic.id)} />
                  <span className="font-serif text-lg text-paper">{topic.title}</span>
                </span>
                <ChevronRight size={18} className="shrink-0 text-bone/40 transition-colors group-hover:text-flame" />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x py-8">
        <h2 className="mb-5 flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-bone">
          <PencilLine size={15} className="text-flame" /> Activities
        </h2>
        <div className="space-y-3">
          {week.activities.map((activity, i) => {
            const interactive = isInteractive(activity.kind);
            return (
              <Reveal key={activity.id} delay={i * 0.02}>
                <Link
                  to={`/course/${week.id}/activity/${activity.id}`}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-bone/10 bg-ink-soft/40 p-5 transition-all hover:border-flame/40 hover:bg-ink-soft/70"
                >
                  <span className="flex items-start gap-3">
                    <StatusDot done={isComplete(week.id, 'activity', activity.id)} />
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
      </section>

      <section className="container-x py-12">
        <div className="flex items-center justify-between gap-4 border-t border-bone/10 pt-6">
          {week.number > 1 ? (
            <Link
              to={`/course/week-${week.number - 1}`}
              className="text-sm text-bone transition-colors hover:text-paper"
            >
              ← Week {week.number - 1}
            </Link>
          ) : (
            <Link to="/course" className="text-sm text-bone transition-colors hover:text-paper">
              ← All weeks
            </Link>
          )}
          {nextWeek && (
            <Link
              to={`/course/${nextWeek.id}`}
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

function StatusDot({ done }: { done: boolean }) {
  return done ? (
    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-flame text-paper">
      <Check size={12} />
    </span>
  ) : (
    <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full border border-bone/30" />
  );
}
