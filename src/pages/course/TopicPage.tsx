import { useParams } from 'react-router-dom';
import { Lightbulb } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import { Crumbs, CompleteToggle, StepNav } from '../../components/course/ui';
import CourseMissing from './CourseMissing';
import { getCourse, getTopic, getWeek } from '../../data/course';

export default function TopicPage() {
  const { courseId, weekId, topicId } = useParams();
  const course = getCourse(courseId);
  const week = getWeek(course, weekId);
  const topic = getTopic(week, topicId);

  if (!course || !week || !topic) return <CourseMissing />;

  return (
    <PageTransition>
      <article className="container-x max-w-3xl pt-32 pb-20 md:pt-40">
        <Crumbs
          items={[
            { label: 'Courses', to: '/courses' },
            { label: course.title, to: `/courses/${course.id}` },
            { label: `Week ${week.number}`, to: `/courses/${course.id}/${week.id}` },
            { label: 'Topic' },
          ]}
        />

        <p className="mt-6 text-sm uppercase tracking-[0.2em] text-flame">{week.theme}</p>
        <h1 className="mt-3 text-balance text-4xl md:text-5xl">{topic.title}</h1>

        <div className="mt-8 space-y-5">
          {topic.body.map((para, i) => (
            <p key={i} className="text-lg leading-relaxed text-bone">
              {para}
            </p>
          ))}
        </div>

        {topic.takeaways && topic.takeaways.length > 0 && (
          <div className="mt-10 rounded-2xl border border-bone/10 bg-ink-soft/40 p-6">
            <p className="mb-4 flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-bone">
              <Lightbulb size={15} className="text-flame" /> Key takeaways
            </p>
            <ul className="space-y-3">
              {topic.takeaways.map((t) => (
                <li key={t} className="flex gap-3 text-paper">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-flame" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-10">
          <CompleteToggle courseId={course.id} weekId={week.id} kind="topic" id={topic.id} />
        </div>

        <StepNav course={course} week={week} currentId={topic.id} />
      </article>
    </PageTransition>
  );
}
