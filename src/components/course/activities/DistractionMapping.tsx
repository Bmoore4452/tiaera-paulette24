import type { ActivityProps } from './types';
import { useWork, ClearWork } from './Shared';
import { AddButton, Labeled, Panel, RemoveButton, Segmented, TextArea, TextInput } from '../fields';

type Level = 'low' | 'med' | 'high';
const LEVELS: { value: Level; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'med', label: 'Med' },
  { value: 'high', label: 'High' },
];
const FRACTION: Record<Level, number> = { low: 0.18, med: 0.5, high: 0.82 };

type Plan = 'eliminate' | 'reduce' | 'manage';
const PLANS: { value: Plan; label: string }[] = [
  { value: 'eliminate', label: 'Eliminate' },
  { value: 'reduce', label: 'Reduce' },
  { value: 'manage', label: 'Manage' },
];

type Row = {
  id: string;
  name: string;
  source: 'external' | 'internal';
  frequency: Level;
  impact: Level;
  plan: Plan;
  notes: string;
};
type State = { rows: Row[] };

const uid = () => Math.random().toString(36).slice(2, 9);
const blank = (): Row => ({
  id: uid(),
  name: '',
  source: 'external',
  frequency: 'med',
  impact: 'med',
  plan: 'manage',
  notes: '',
});

export default function DistractionMapping({ activity, courseId, weekId }: ActivityProps) {
  const [state, setState, reset] = useWork<State>(courseId, weekId, activity.id, { rows: [blank()] });

  const update = (id: string, patch: Partial<Row>) =>
    setState((p) => ({ rows: p.rows.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));
  const add = () => setState((p) => ({ rows: [...p.rows, blank()] }));
  const remove = (id: string) =>
    setState((p) => ({ rows: p.rows.length > 1 ? p.rows.filter((r) => r.id !== id) : p.rows }));

  const plotted = state.rows.filter((r) => r.name.trim());

  return (
    <div className="space-y-8">
      {state.rows.map((row, i) => (
        <Panel key={row.id}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="font-serif text-lg text-flame">Distraction {i + 1}</span>
            <RemoveButton onClick={() => remove(row.id)} />
          </div>
          <div className="space-y-4">
            <Labeled label="What is it?">
              <TextInput
                value={row.name}
                onChange={(e) => update(row.id, { name: e.target.value })}
                placeholder="e.g. Phone notifications, drop-in coworkers, anxious spiraling"
              />
            </Labeled>
            <div className="grid gap-4 sm:grid-cols-2">
              <Labeled label="Source">
                <Segmented
                  value={row.source}
                  size="sm"
                  options={[
                    { value: 'external', label: 'External' },
                    { value: 'internal', label: 'Internal' },
                  ]}
                  onChange={(v) => update(row.id, { source: v })}
                />
              </Labeled>
              <Labeled label="Plan">
                <Segmented value={row.plan} size="sm" options={PLANS} onChange={(v) => update(row.id, { plan: v })} />
              </Labeled>
              <Labeled label="How often?">
                <Segmented
                  value={row.frequency}
                  size="sm"
                  options={LEVELS}
                  onChange={(v) => update(row.id, { frequency: v })}
                />
              </Labeled>
              <Labeled label="How much it costs you">
                <Segmented value={row.impact} size="sm" options={LEVELS} onChange={(v) => update(row.id, { impact: v })} />
              </Labeled>
            </div>
            <Labeled label="My plan to handle it">
              <TextArea
                value={row.notes}
                onChange={(e) => update(row.id, { notes: e.target.value })}
                placeholder="What specifically will you do?"
              />
            </Labeled>
          </div>
        </Panel>
      ))}

      <AddButton onClick={add}>Add another distraction</AddButton>

      <Panel title="Your distraction map">
        <p className="mb-5 text-sm text-bone">
          The top-right corner is where to focus first: frequent and costly. Tackle those before the
          rest.
        </p>
        <div className="mx-auto max-w-md">
          <div className="flex items-stretch gap-2">
            <div className="flex items-center">
              <span className="rotate-180 text-xs uppercase tracking-widest text-bone/60 [writing-mode:vertical-rl]">
                Impact →
              </span>
            </div>
            <div className="relative aspect-square flex-1 rounded-xl border border-bone/15 bg-ink/40">
              {/* quadrant guides */}
              <div className="absolute left-1/2 top-0 h-full w-px bg-bone/10" />
              <div className="absolute left-0 top-1/2 h-px w-full bg-bone/10" />
              <span className="absolute right-2 top-2 text-[10px] uppercase tracking-wider text-flame/70">
                Handle first
              </span>
              {plotted.map((r) => (
                <div
                  key={r.id}
                  className="absolute -translate-x-1/2 translate-y-1/2"
                  style={{ left: `${FRACTION[r.frequency] * 100}%`, bottom: `${FRACTION[r.impact] * 100}%` }}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span
                      className={`h-3 w-3 rounded-full ${r.source === 'external' ? 'bg-flame' : 'bg-[#60a5fa]'}`}
                    />
                    <span className="max-w-[80px] truncate rounded bg-ink/80 px-1.5 py-0.5 text-[10px] text-paper">
                      {r.name}
                    </span>
                  </div>
                </div>
              ))}
              {plotted.length === 0 && (
                <span className="absolute inset-0 grid place-items-center text-xs text-bone/40">
                  Name a distraction above to plot it
                </span>
              )}
            </div>
          </div>
          <div className="mt-2 pl-6 text-center text-xs uppercase tracking-widest text-bone/60">Frequency →</div>
          <div className="mt-4 flex justify-center gap-5 text-xs text-bone">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-flame" /> External
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#60a5fa]" /> Internal
            </span>
          </div>
        </div>
      </Panel>

      <ClearWork onClear={reset} />
    </div>
  );
}
