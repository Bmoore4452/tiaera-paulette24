import { Star } from 'lucide-react';
import type { ActivityProps } from './types';
import { useWork, ClearWork } from './Shared';
import { AddButton, Labeled, Panel, RemoveButton, TextArea, TextInput } from '../fields';

type Task = { id: string; text: string; vital: boolean };
type State = { tasks: Task[]; protect: string };

const uid = () => Math.random().toString(36).slice(2, 9);
const blank = (): Task => ({ id: uid(), text: '', vital: false });

export default function Pareto({ activity, weekId }: ActivityProps) {
  const [state, setState, reset] = useWork<State>(weekId, activity.id, {
    tasks: [blank(), blank(), blank()],
    protect: '',
  });

  const update = (id: string, patch: Partial<Task>) =>
    setState((p) => ({ ...p, tasks: p.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));
  const add = () => setState((p) => ({ ...p, tasks: [...p.tasks, blank()] }));
  const remove = (id: string) =>
    setState((p) => ({ ...p, tasks: p.tasks.length > 1 ? p.tasks.filter((t) => t.id !== id) : p.tasks }));

  const named = state.tasks.filter((t) => t.text.trim());
  const vital = named.filter((t) => t.vital);
  const vitalPct = named.length === 0 ? 0 : Math.round((vital.length / named.length) * 100);

  return (
    <div className="space-y-8">
      <Panel title="1 · List your tasks & goals, then star the vital few">
        <p className="mb-5 text-sm text-bone">
          Brain-dump the tasks and goals on your plate. Then star the{' '}
          <span className="text-flame">few</span> that drive most of your real results — the 20% that
          produces 80%.
        </p>
        <div className="space-y-2.5">
          {state.tasks.map((t) => (
            <div key={t.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => update(t.id, { vital: !t.vital })}
                aria-label={t.vital ? 'Unmark vital' : 'Mark as vital'}
                className={[
                  'grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition-colors',
                  t.vital ? 'border-flame bg-flame/15 text-flame' : 'border-bone/20 text-bone/40 hover:text-bone',
                ].join(' ')}
              >
                <Star size={17} fill={t.vital ? '#F2052C' : 'none'} />
              </button>
              <TextInput
                value={t.text}
                onChange={(e) => update(t.id, { text: e.target.value })}
                placeholder="A task or goal…"
                className="flex-1"
              />
              <RemoveButton onClick={() => remove(t.id)} />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <AddButton onClick={add}>Add a task</AddButton>
        </div>
      </Panel>

      <Panel title="2 · The split">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-flame">Vital few · {vital.length}</span>
          <span className="text-bone">Trivial many · {named.length - vital.length}</span>
        </div>
        <div className="flex h-3 overflow-hidden rounded-full bg-bone/10">
          <div className="h-full bg-flame transition-all duration-500" style={{ width: `${vitalPct}%` }} />
        </div>
        <p className="mt-3 text-sm text-bone">
          {named.length === 0
            ? 'Add and star tasks to see your split.'
            : `Your vital few are ${vitalPct}% of your list. These deserve the lion's share of your time and best energy.`}
        </p>

        {vital.length > 0 && (
          <ul className="mt-5 space-y-2">
            {vital.map((t) => (
              <li key={t.id} className="flex items-center gap-2.5 text-paper">
                <Star size={14} className="shrink-0 text-flame" fill="#F2052C" />
                {t.text}
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="3 · Protect what matters">
        <Labeled label="How will you protect your vital few this week?">
          <TextArea
            value={state.protect}
            onChange={(e) => setState((p) => ({ ...p, protect: e.target.value }))}
            placeholder="What will you say no to, delegate, or stop doing to make room?"
          />
        </Labeled>
      </Panel>

      <ClearWork onClear={reset} />
    </div>
  );
}
