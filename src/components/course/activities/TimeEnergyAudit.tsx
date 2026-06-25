import { useMemo } from 'react';
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

// One distinct color per activity (by its position in the list). Energy is
// already encoded by the vertical axis, so color is free to identify the dot.
const PALETTE = [
  '#F2052C', // flame
  '#38bdf8', // sky
  '#a78bfa', // violet
  '#34d399', // emerald
  '#fbbf24', // amber
  '#fb7185', // rose
  '#22d3ee', // cyan
  '#c084fc', // purple
  '#4ade80', // green
  '#f97316', // orange
];

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

// Stable per-cell hash so an on-axis cluster always picks the same quadrant.
const hashKey = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};

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

  // Color is stable per activity (its index in the list), so editing one row
  // doesn't recolor the others.
  const colorOf = useMemo(() => {
    const map = new Map<string, string>();
    state.rows.forEach((r, i) => map.set(r.id, PALETTE[i % PALETTE.length]));
    return map;
  }, [state.rows]);

  // Group plotted points by their grid cell. A lone point sits at its honest
  // position. When several share a cell, fan them out into a ring — but anchor
  // that ring inside a single quadrant and clear of the center gridlines, so a
  // shared cell that lands on an axis (med time / neutral energy) doesn't put
  // dots on the line or spill across quadrants.
  const points = useMemo(() => {
    const plotted = state.rows.filter((r) => r.name.trim());
    const cells = new Map<string, Row[]>();
    for (const r of plotted) {
      const key = `${r.time}:${r.energy}`;
      const group = cells.get(key);
      if (group) group.push(r);
      else cells.set(key, [r]);
    }

    const laid: { row: Row; left: number; bottom: number }[] = [];
    for (const [key, group] of cells) {
      if (group.length === 1) {
        laid.push({
          row: group[0],
          left: TIME_X[group[0].time] * 100,
          bottom: ENERGY_Y[group[0].energy] * 100,
        });
        continue;
      }
      // On-axis values (50%) get pushed to one side, picked deterministically
      // per cell so the whole group lands in the same quadrant; off-axis values
      // keep their true 18%/82% position. Radius stays under that offset so the
      // ring never crosses back over the center line.
      const h = hashKey(key);
      const anchorLeft = group[0].time === 'med' ? (h & 1 ? 62 : 38) : TIME_X[group[0].time] * 100;
      const anchorBottom = group[0].energy === 'neutral' ? (h & 2 ? 62 : 38) : ENERGY_Y[group[0].energy] * 100;
      const radius = Math.min(8, 3 + group.length);
      group.forEach((row, i) => {
        const angle = (i / group.length) * Math.PI * 2 - Math.PI / 2;
        laid.push({
          row,
          left: clamp(anchorLeft + Math.cos(angle) * radius, 6, 94),
          bottom: clamp(anchorBottom + Math.sin(angle) * radius, 6, 94),
        });
      });
    }
    return laid;
  }, [state.rows]);

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
            <span className="flex items-center gap-2 font-serif text-lg text-flame">
              <span
                className="h-3 w-3 rounded-full ring-2 ring-ink/60"
                style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
              />
              Activity {i + 1}
            </span>
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
              {points.map(({ row, left, bottom }) => (
                <div
                  key={row.id}
                  className="absolute -translate-x-1/2 translate-y-1/2"
                  style={{ left: `${left}%`, bottom: `${bottom}%` }}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span
                      className="h-3 w-3 rounded-full ring-2 ring-ink/60"
                      style={{ backgroundColor: colorOf.get(row.id) }}
                    />
                    <span className="max-w-[90px] truncate rounded bg-ink/80 px-1.5 py-0.5 text-[10px] text-paper">
                      {row.name}
                    </span>
                  </div>
                </div>
              ))}
              {points.length === 0 && (
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
