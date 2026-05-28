import { Link, useParams } from 'react-router-dom';
import { NotebookPen, Trash2 } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import { AutosaveNote, CompleteToggle, Crumbs, StepNav } from '../../components/course/ui';
import { Labeled, TextArea } from '../../components/course/fields';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useCourseProgress } from '../../components/course/CourseProgress';
import CourseMissing from './CourseMissing';
import { getCourse, getWeek } from '../../data/course';

/**
 * Renders a week's journal page — a worksheet that mirrors the prompts in the
 * printed Master Me Journal PDF. Saves the student's responses per-prompt.
 */
export default function JournalPage() {
  const { courseId, weekId, journalId } = useParams();
  const course = getCourse(courseId);
  const week = getWeek(course, weekId);
  const { isWeekUnlocked } = useCourseProgress();

  const storageKey = `journal:${courseId}:${weekId}:${journalId}`;
  const [answers, setAnswers, reset] = useLocalStorage<Record<string, string>>(storageKey, {});

  if (!course || !week || !week.journal || week.journal.id !== journalId) return <CourseMissing />;
  const journal = week.journal;
  const unlocked = isWeekUnlocked(course, week);

  return (
    <PageTransition>
      <div className="container-x max-w-3xl pt-32 pb-20 md:pt-40">
        <Crumbs
          items={[
            { label: 'Courses', to: '/courses' },
            { label: course.title, to: `/courses/${course.id}` },
            { label: `Week ${week.number}`, to: `/courses/${course.id}/${week.id}` },
            { label: 'Journal' },
          ]}
        />

        <p className="mt-6 text-sm uppercase tracking-[0.2em] text-flame">{week.theme}</p>
        <h1 className="mt-3 flex items-center gap-3 text-balance text-4xl md:text-5xl">
          <NotebookPen size={28} className="shrink-0 text-flame" /> {journal.title}
        </h1>
        {journal.intro && (
          <p className="mt-5 max-w-2xl text-lg italic text-bone">{journal.intro}</p>
        )}
        <AutosaveNote />

        {!unlocked ? (
          <div className="mt-10 rounded-3xl border border-bone/15 bg-ink-soft/40 p-8 text-center">
            <p className="text-bone">Complete every Core Teaching point to open this journal.</p>
            <Link to={`/courses/${course.id}/${week.id}`} className="btn-primary mt-6">
              Back to week
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-10 space-y-6">
              {journal.prompts.map((prompt, i) => (
                <div key={prompt.id} className="rounded-2xl border border-bone/10 bg-ink-soft/40 p-5 md:p-6">
                  <Labeled label={`Prompt ${i + 1}`}>
                    <p className="mb-3 text-paper">{prompt.question}</p>
                    <TextArea
                      value={answers[prompt.id] ?? ''}
                      onChange={(e) => setAnswers((prev) => ({ ...prev, [prompt.id]: e.target.value }))}
                      placeholder="Write your response…"
                      className="min-h-[150px]"
                    />
                  </Labeled>
                </div>
              ))}
            </div>

            <div className="mt-10 flex items-center justify-between gap-4">
              <CompleteToggle courseId={course.id} weekId={week.id} kind="journal" id={journal.id} />
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Clear your journal responses for this week? This cannot be undone.')) reset();
                }}
                className="inline-flex items-center gap-2 text-xs text-bone/50 transition-colors hover:text-flame"
              >
                <Trash2 size={13} /> Clear journal
              </button>
            </div>
          </>
        )}

        <StepNav course={course} week={week} currentId={journal.id} />
      </div>
    </PageTransition>
  );
}
