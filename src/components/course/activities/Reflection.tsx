import { MessagesSquare } from 'lucide-react';
import type { ActivityProps } from './types';
import { useWork, ClearWork } from './Shared';
import { Labeled, TextArea } from '../fields';

/** Generic worksheet for reflection & discussion activities — one field per prompt. */
export default function Reflection({ activity, courseId, weekId }: ActivityProps) {
  const prompts = activity.prompts ?? [activity.summary];
  const [answers, setAnswers, reset] = useWork<Record<number, string>>(courseId, weekId, activity.id, {});

  return (
    <div className="space-y-6">
      {activity.kind === 'discussion' && (
        <div className="flex items-start gap-3 rounded-2xl border border-flame/25 bg-flame/5 p-4 text-sm text-bone">
          <MessagesSquare size={18} className="mt-0.5 shrink-0 text-flame" />
          <p>
            This is a group discussion in the live cohort. Capture your own thoughts here first so
            you come ready to share.
          </p>
        </div>
      )}

      {prompts.map((prompt, i) => (
        <Labeled key={i} label={`Prompt ${i + 1}`}>
          <p className="mb-3 text-paper">{prompt}</p>
          <TextArea
            value={answers[i] ?? ''}
            onChange={(e) => setAnswers((prev) => ({ ...prev, [i]: e.target.value }))}
            placeholder="Write your response…"
          />
        </Labeled>
      ))}

      <ClearWork onClear={reset} />
    </div>
  );
}
