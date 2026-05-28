import { Link } from 'react-router-dom';
import { ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import Reveal from '../../components/Reveal';
import { ProgressBar } from '../../components/course/ui';
import { courses, useCourseProgress } from '../../components/course/CourseProgress';

/** `/courses` — top-level course picker. */
export default function CoursesIndex() {
  const { courseProgress, resetAll } = useCourseProgress();

  return (
    <PageTransition>
      <section className="container-x pt-36 pb-12 md:pt-44">
        <p className="eyebrow">Courses · preview</p>
        <h1 className="mt-6 max-w-4xl text-balance text-6xl md:text-7xl xl:text-8xl">
          Two masterclasses. <span className="italic text-flame">One classroom.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-balance text-lg text-bone md:text-xl">
          Both masterclasses are digitized as a working preview: read each week's teaching,
          do the interactive activities, and (for Master Me) share with the cohort in the
          open discussion threads. Your work saves to this device.
        </p>
      </section>

      <section className="container-x py-10">
        <div className="grid gap-6 md:grid-cols-2">
          {courses.map((c, i) => {
            const { done, total } = courseProgress(c);
            return (
              <Reveal key={c.id} delay={i * 0.04}>
                <Link
                  to={`/courses/${c.id}`}
                  className="group flex h-full flex-col rounded-3xl border border-bone/10 bg-ink-soft/40 p-8 transition-all duration-500 hover:border-flame/40 hover:bg-ink-soft/70"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-bone">
                    {c.weeks.length}-week masterclass
                  </p>
                  <h2 className="mt-4 text-balance text-4xl text-paper md:text-5xl">{c.title}</h2>
                  <p className="mt-2 text-sm uppercase tracking-[0.18em] text-flame/80">{c.subtitle}</p>
                  <p className="mt-5 flex-1 text-bone">{c.overview}</p>
                  <div className="mt-6">
                    <ProgressBar done={done} total={total} />
                    <div className="mt-2.5 flex items-center justify-between text-xs text-bone">
                      <span>
                        {done} / {total} items
                      </span>
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

      <section className="container-x py-12">
        <div className="flex items-center gap-3 rounded-2xl border border-bone/10 bg-ink-soft/30 p-5 text-sm text-bone">
          <Sparkles size={16} className="shrink-0 text-flame" />
          <p>
            This is a preview build. All progress and saved work lives on this device only —
            no accounts yet. The production version will sync across devices and let students
            share discussions with the real cohort.
          </p>
        </div>
      </section>

      <section className="container-x pb-24">
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Reset all of your progress across every course?')) resetAll();
          }}
          className="inline-flex items-center gap-2 text-xs text-bone/50 transition-colors hover:text-flame"
        >
          <RotateCcw size={13} /> Reset all progress
        </button>
      </section>
    </PageTransition>
  );
}
