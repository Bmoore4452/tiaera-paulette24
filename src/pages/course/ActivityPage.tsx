import { useParams } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import { Crumbs, CompleteToggle, StepNav, AutosaveNote } from '../../components/course/ui';
import { activityComponent } from '../../components/course/activities';
import CourseMissing from './CourseMissing';
import { getActivity, getWeek, isInteractive } from '../../data/course';

export default function ActivityPage() {
  const { weekId, activityId } = useParams();
  const week = getWeek(weekId);
  const activity = getActivity(week, activityId);

  if (!week || !activity) return <CourseMissing />;

  const Body = activityComponent(activity.kind);
  const interactive = isInteractive(activity.kind);

  return (
    <PageTransition>
      <div className="container-x max-w-3xl pt-32 pb-20 md:pt-40">
        <Crumbs
          items={[
            { label: 'Course', to: '/course' },
            { label: `Week ${week.number}`, to: `/course/${week.id}` },
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
          <Body activity={activity} weekId={week.id} />
        </div>

        <div className="mt-10">
          <CompleteToggle weekId={week.id} kind="activity" id={activity.id} />
        </div>

        <StepNav week={week} currentId={activity.id} />
      </div>
    </PageTransition>
  );
}
