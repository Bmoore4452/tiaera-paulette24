import { useParams } from 'react-router-dom';
import { Lock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageTransition from '../../components/layout/PageTransition';
import { Crumbs, CompleteToggle, StepNav, AutosaveNote } from '../../components/course/ui';
import { activityComponent } from '../../components/course/activities';
import { useCourseProgress } from '../../components/course/CourseProgress';
import CourseMissing from './CourseMissing';
import { getActivity, getCourse, getWeek, isInteractive } from '../../data/course';

export default function ActivityPage() {
  const { courseId, weekId, activityId } = useParams();
  const course = getCourse(courseId);
  const week = getWeek(course, weekId);
  const activity = getActivity(week, activityId);
  const { isWeekUnlocked } = useCourseProgress();

  if (!course || !week || !activity) return <CourseMissing />;
  const unlocked = isWeekUnlocked(course, week);

  if (!unlocked) {
    return (
      <PageTransition>
        <div className="container-x max-w-3xl pt-32 pb-20 md:pt-40">
          <Crumbs
            items={[
              { label: 'Courses', to: '/courses' },
              { label: course.title, to: `/courses/${course.id}` },
              { label: `Week ${week.number}`, to: `/courses/${course.id}/${week.id}` },
              { label: 'Locked' },
            ]}
          />
          <div className="mt-10 rounded-3xl border border-bone/15 bg-ink-soft/40 p-8 text-center">
            <Lock size={28} className="mx-auto text-flame" />
            <h1 className="mt-5 text-balance text-3xl md:text-4xl">Finish the Core Teaching first</h1>
            <p className="mt-4 text-bone">
              Each week's activities open after you've worked through every teaching point in order.
            </p>
            <Link to={`/courses/${course.id}/${week.id}`} className="btn-primary mt-8">
              Back to week overview
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  const Body = activityComponent(activity.kind);
  const interactive = isInteractive(activity.kind);

  return (
    <PageTransition>
      <div className="container-x max-w-3xl pt-32 pb-20 md:pt-40">
        <Crumbs
          items={[
            { label: 'Courses', to: '/courses' },
            { label: course.title, to: `/courses/${course.id}` },
            { label: `Week ${week.number}`, to: `/courses/${course.id}/${week.id}` },
            { label: 'Activity' },
          ]}
        />

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-sm uppercase tracking-[0.2em] text-flame">{week.theme}</span>
          <span className="inline-flex items-center gap-1 rounded-full border border-bone/20 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-bone">
            {interactive ? (
              <>
                <Sparkles size={10} className="text-flame" /> Interactive activity
              </>
            ) : (
              'Worksheet'
            )}
          </span>
        </div>

        <h1 className="mt-3 text-balance text-4xl md:text-5xl">{activity.title}</h1>
        <p className="mt-4 text-lg text-bone">{activity.summary}</p>
        <AutosaveNote />

        <div className="mt-10">
          <Body activity={activity} courseId={course.id} weekId={week.id} />
        </div>

        <div className="mt-10">
          <CompleteToggle courseId={course.id} weekId={week.id} kind="activity" id={activity.id} />
        </div>

        <StepNav course={course} week={week} currentId={activity.id} />
      </div>
    </PageTransition>
  );
}
