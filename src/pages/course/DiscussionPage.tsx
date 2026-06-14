import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MessageCircle, MessagesSquare, Send } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import { AutosaveNote, CompleteToggle, Crumbs, StepNav } from '../../components/course/ui';
import { Labeled, TextArea } from '../../components/course/fields';
import { Byline, ProfileForm } from '../../components/course/ProfileForm';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useProfile, type Profile } from '../../hooks/useProfile';
import CourseMissing from './CourseMissing';
import { getCourse, getDiscussion, getWeek } from '../../data/course';
import { useCourseProgress } from '../../components/course/CourseProgress';

type Comment = {
  id: string;
  author: Profile;
  body: string;
  createdAt: string;
};
type Post = {
  id: string;
  author: Profile;
  body: string;
  createdAt: string;
  comments: Comment[];
};
type Thread = { posts: Post[] };

const uid = () => Math.random().toString(36).slice(2, 10);

export default function DiscussionPage() {
  const { courseId, weekId, discussionId } = useParams();
  const course = getCourse(courseId);
  const week = getWeek(course, weekId);
  const question = getDiscussion(week, discussionId);
  const { isWeekUnlocked } = useCourseProgress();

  // Thread storage is intentionally NOT user-scoped — it simulates a shared,
  // class-wide discussion. (In production this becomes a Supabase table.)
  const threadKey = `discussion:${courseId}:${weekId}:${discussionId}`;
  const [thread, setThread] = useLocalStorage<Thread>(threadKey, { posts: [] });
  const { profile, hasProfile } = useProfile();
  const [draft, setDraft] = useState('');

  if (!course || !week || !question) return <CourseMissing />;
  const unlocked = isWeekUnlocked(course, week);

  function submitPost() {
    const body = draft.trim();
    if (!body || !hasProfile) return;
    const post: Post = {
      id: uid(),
      author: profile,
      body,
      createdAt: new Date().toISOString(),
      comments: [],
    };
    setThread((prev) => ({ posts: [post, ...prev.posts] }));
    setDraft('');
  }

  function addComment(postId: string, body: string) {
    if (!body.trim() || !hasProfile) return;
    setThread((prev) => ({
      posts: prev.posts.map((p) =>
        p.id !== postId
          ? p
          : {
              ...p,
              comments: [
                ...p.comments,
                { id: uid(), author: profile, body: body.trim(), createdAt: new Date().toISOString() },
              ],
            },
      ),
    }));
  }

  return (
    <PageTransition>
      <div className="container-x max-w-3xl pt-32 pb-20 md:pt-40">
        <Crumbs
          items={[
            { label: 'Courses', to: '/courses' },
            { label: course.title, to: `/courses/${course.id}` },
            { label: `Week ${week.number}`, to: `/courses/${course.id}/${week.id}` },
            { label: 'Discussion' },
          ]}
        />

        <p className="mt-6 text-sm uppercase tracking-[0.2em] text-flame">{week.theme}</p>
        <h1 className="mt-3 text-balance font-serif text-3xl text-paper md:text-4xl">{question.question}</h1>
        <div className="mt-3 grid gap-3 md:grid-cols-2 md:items-center sm:gap-5">
        <p className="mt-4 inline-flex items-center gap-2 text-sm text-bone">
          <MessagesSquare size={15} className="text-flame " /> Open thread · the cohort can read and respond
        </p>
        <AutosaveNote />
        </div>

        {!unlocked ? (
          <div className="mt-10 rounded-3xl border border-bone/15 bg-ink-soft/40 p-8 text-center">
            <p className="text-bone">Complete every Core Teaching point to join this discussion.</p>
            <Link to={`/courses/${course.id}/${week.id}`} className="btn-primary mt-6">
              Back to week
            </Link>
          </div>
        ) : (
          <>
            <section className="mt-10">
              {hasProfile ? (
                <div className="rounded-2xl border border-bone/10 bg-ink-soft/40 p-5 md:p-6">
                  <Labeled label="Your response">
                    <TextArea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Share your honest answer — short or long, whatever feels true."
                    />
                  </Labeled>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-xs text-bone/60">
                      Posting as <span className="text-paper">{profile.name}</span>
                      <span className="text-bone/50"> · {profile.pronouns}</span>
                    </p>
                    <button
                      type="button"
                      onClick={submitPost}
                      disabled={draft.trim().length === 0}
                      className="btn-primary disabled:opacity-50"
                    >
                      <Send size={15} /> Post to the discussion
                    </button>
                  </div>
                </div>
              ) : (
                <ProfileForm />
              )}
            </section>

            <section className="mt-10 space-y-5">
              <p className="text-sm uppercase tracking-[0.18em] text-bone">
                {thread.posts.length === 0
                  ? 'No posts yet'
                  : `${thread.posts.length} ${thread.posts.length === 1 ? 'response' : 'responses'}`}
              </p>
              {thread.posts.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-bone/15 p-8 text-center text-sm text-bone/60">
                  Be the first to share. Your post will start the thread.
                </p>
              ) : (
                thread.posts.map((post) => (
                  <PostCard key={post.id} post={post} onComment={(body) => addComment(post.id, body)} canComment={hasProfile} />
                ))
              )}
            </section>

            <div className="mt-10">
              <CompleteToggle courseId={course.id} weekId={week.id} kind="discussion" id={question.id} />
            </div>
          </>
        )}

        <StepNav course={course} week={week} currentId={question.id} />
      </div>
    </PageTransition>
  );
}

function PostCard({ post, onComment, canComment }: { post: Post; onComment: (body: string) => void; canComment: boolean }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  return (
    <article className="rounded-2xl border border-bone/10 bg-ink-soft/40 p-5 md:p-6">
      <Byline profile={post.author} createdAt={post.createdAt} />
      <p className="mt-3 whitespace-pre-wrap text-paper">{post.body}</p>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-bone/10 pt-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 text-xs text-bone transition-colors hover:text-paper"
        >
          <MessageCircle size={13} />
          {post.comments.length === 0
            ? 'Add a comment'
            : `${post.comments.length} ${post.comments.length === 1 ? 'comment' : 'comments'}`}
        </button>
      </div>

      {open && (
        <div className="mt-3 space-y-3">
          {post.comments.map((c) => (
            <div key={c.id} className="rounded-xl border border-bone/10 bg-ink/40 p-4">
              <Byline profile={c.author} createdAt={c.createdAt} />
              <p className="mt-2 whitespace-pre-wrap text-sm text-bone">{c.body}</p>
            </div>
          ))}
          {canComment ? (
            <div className="flex items-end gap-2">
              <TextArea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Add a thoughtful comment…"
                className="min-h-[64px]"
              />
              <button
                type="button"
                onClick={() => {
                  onComment(draft);
                  setDraft('');
                }}
                disabled={draft.trim().length === 0}
                className="btn-primary shrink-0 disabled:opacity-50"
              >
                <Send size={14} />
              </button>
            </div>
          ) : (
            <p className="text-xs text-bone/60">Set your discussion identity above to comment.</p>
          )}
        </div>
      )}
    </article>
  );
}
