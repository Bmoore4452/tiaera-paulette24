import type { ActivityProps } from './types';
import { useWork, ClearWork } from './Shared';
import { AddButton, Labeled, Panel, RemoveButton, Segmented, TextInput } from '../fields';

type Time = 'low' | 'med' | 'high';
type Energy = 'drain' | 'neutral' | 'gain';

const TIMES: { value: Time; label: string }[] = [
  { value: 'low', label: 'A little' },
  { value: 'med', label: 'A fair amount' },
  { value: 'high', label: 'A lot' },
];
const ENERGIES: { value: Energy; label: string }[] = [
  { value: 'drain', label: 'Drains me' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'gain', label: 'Gives me energy' },
];

const TIME_X: Record<Time, number> = { low: 0.18, med: 0.5, high: 0.82 };
const ENERGY_Y: Record<Energy, number> = { drain: 0.18, neutral: 0.5, gain: 0.82 };
const ENERGY_COLOR: Record<Energy, string> = { drain: '#9ca3af', neutral: '#a78bfa', gain: '#F2052C' };

type Row = { id: string; name: string; time: Time; energy: Energy };
type State = { rows: Row[]; notes: string };

const uid = () => Math.random().toString(36).slice(2, 9);
const blank = (): Row => ({ id: uid(), name: '', time: 'med', energy: 'neutral' });

export default function TimeEnergyAudit({ activity, courseId, weekId }: ActivityProps) {
  const [state, setState, reset] = useWork<State>(courseId, weekId, activity.id, {
    rows: [blank(), blank(), blank()],
    notes: '',
  });

  const update = (id: string, patch: Partial<Row>) =>
    setState((p) => ({ ...p, rows: p.rows.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));
  const add = () => setState((p) => ({ ...p, rows: [...p.rows, blank()] }));
  const remove = (id: string) =>
    setState((p) => ({ ...p, rows: p.rows.length > 1 ? p.rows.filter((r) => r.id !== id) : p.rows }));

  const plotted = state.rows.filter((r) => r.name.trim());

  return (
    <div className="space-y-8">
      <p className="text-sm text-bone">
        List the things filling your week — work, scrolling, family time, errands, anything. Mark
        how much time each takes and how it leaves you feeling. The gap between time spent and
        energy returned is where life leaks out.
      </p>

      {state.rows.map((row, i) => (
        <Panel key={row.id}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="font-serif text-lg text-flame">Activity {i + 1}</span>
            <RemoveButton onClick={() => remove(row.id)} />
          </div>
          <div className="space-y-4">
            <Labeled label="What is it?">
              <TextInput
                value={row.name}
                onChange={(e) => update(row.id, { name: e.target.value })}
                placeholder="e.g. Scrolling Instagram, weekly call with mom, gym, project review meeting"
              />
            </Labeled>
            <div className="grid gap-4 sm:grid-cols-2">
              <Labeled label="Time it takes">
                <Segmented value={row.time} size="sm" options={TIMES} onChange={(v) => update(row.id, { time: v })} />
              </Labeled>
              <Labeled label="What it does to your energy">
                <Segmented value={row.energy} size="sm" options={ENERGIES} onChange={(v) => update(row.id, { energy: v })} />
              </Labeled>
            </div>
          </div>
        </Panel>
      ))}

      <AddButton onClick={add}>Add another activity</AddButton>

      <Panel title="Where your week goes vs. what it gives back">
        <p className="mb-5 text-sm text-bone">
          Top-right is what you should be doing more of. Bottom-right is what's quietly eating you
          alive — high time, low energy. That's where the audit pays off.
        </p>
        <div className="mx-auto max-w-md">
          <div className="flex items-stretch gap-2">
            <div className="flex items-center">
              <span className="rotate-180 text-xs uppercase tracking-widest text-bone/60 [writing-mode:vertical-rl]">
                Energy returned →
              </span>
            </div>
            <div className="relative aspect-square flex-1 rounded-xl border border-bone/15 bg-ink/40">
              <div className="absolute left-1/2 top-0 h-full w-px bg-bone/10" />
              <div className="absolute left-0 top-1/2 h-px w-full bg-bone/10" />
              <span className="absolute right-2 top-2 text-[10px] uppercase tracking-wider text-flame/70">
                Keep & grow
              </span>
              <span className="absolute left-2 bottom-2 text-[10px] uppercase tracking-wider text-bone/40">
                Cut or reduce
              </span>
              {plotted.map((r) => (
                <div
                  key={r.id}
                  className="absolute -translate-x-1/2 translate-y-1/2"
                  style={{ left: `${TIME_X[r.time] * 100}%`, bottom: `${ENERGY_Y[r.energy] * 100}%` }}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: ENERGY_COLOR[r.energy] }} />
                    <span className="max-w-[90px] truncate rounded bg-ink/80 px-1.5 py-0.5 text-[10px] text-paper">
                      {r.name}
                    </span>
                  </div>
                </div>
              ))}
              {plotted.length === 0 && (
                <span className="absolute inset-0 grid place-items-center text-xs text-bone/40">
                  Name an activity above to plot it
                </span>
              )}
            </div>
          </div>
          <div className="mt-2 pl-6 text-center text-xs uppercase tracking-widest text-bone/60">
            Time spent →
          </div>
        </div>
      </Panel>

      <Panel title="What this is showing you">
        <Labeled label="What pattern do you see — and what's one thing you'll act on this week?">
          <TextInput
            value={state.notes}
            onChange={(e) => setState((p) => ({ ...p, notes: e.target.value }))}
            placeholder="Where will you spend less? Where will you spend more?"
          />
        </Labeled>
      </Panel>

      <ClearWork onClear={reset} />
    </div>
  );
}
