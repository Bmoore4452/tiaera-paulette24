import { useState } from 'react';
import type { ActivityProps } from './types';
import { useWork, ClearWork } from './Shared';
import { Labeled, TextArea, Panel } from '../fields';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const PARTS = [
  { id: 'early', label: 'Early', time: '5–8a' },
  { id: 'morning', label: 'Morning', time: '8–11a' },
  { id: 'midday', label: 'Midday', time: '11–2p' },
  { id: 'afternoon', label: 'Afternoon', time: '2–5p' },
  { id: 'evening', label: 'Evening', time: '5–8p' },
  { id: 'night', label: 'Night', time: '8–11p' },
];
const HOURS_PER_BLOCK = 3;

const CATEGORIES = [
  { id: 'work', label: 'Work', color: '#F2052C' },
  { id: 'health', label: 'Health', color: '#34d399' },
  { id: 'family', label: 'Family', color: '#f59e0b' },
  { id: 'rest', label: 'Rest / sleep', color: '#60a5fa' },
  { id: 'chores', label: 'Chores', color: '#a78bfa' },
  { id: 'leisure', label: 'Leisure', color: '#f472b6' },
  { id: 'distraction', label: 'Distraction', color: '#9ca3af' },
];

type State = { cells: Record<string, string>; patterns: string; leaks: string };

export default function TimeAudit({ activity, weekId }: ActivityProps) {
  const [state, setState, reset] = useWork<State>(weekId, activity.id, {
    cells: {},
    patterns: '',
    leaks: '',
  });
  const [brush, setBrush] = useState<string>(CATEGORIES[0].id);

  const colorOf = (catId: string) => CATEGORIES.find((c) => c.id === catId)?.color;

  function paint(key: string) {
    setState((prev) => {
      const next = { ...prev.cells };
      if (next[key] === brush) delete next[key];
      else next[key] = brush;
      return { ...prev, cells: next };
    });
  }

  const counts = CATEGORIES.map((c) => ({
    ...c,
    blocks: Object.values(state.cells).filter((v) => v === c.id).length,
  }));
  const filled = Object.keys(state.cells).length;
  const totalBlocks = DAYS.length * PARTS.length;

  return (
    <div className="space-y-8">
      <Panel title="1 · Choose a category, then paint your week">
        <p className="mb-4 text-sm text-bone">
          Pick a category below, then click the blocks where you spent that time. Click a block
          again to clear it. Each block is roughly {HOURS_PER_BLOCK} hours — fill it in honestly,
          as the week actually went.
        </p>
        <div className="mb-6 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setBrush(c.id)}
              className={[
                'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-all',
                brush === c.id ? 'border-paper text-paper' : 'border-bone/20 text-bone hover:text-paper',
              ].join(' ')}
            >
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: c.color }} />
              {c.label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[560px]">
            <div className="grid grid-cols-[64px_repeat(7,1fr)] gap-1.5">
              <div />
              {DAYS.map((d) => (
                <div key={d} className="pb-1 text-center text-xs font-medium uppercase tracking-wider text-bone">
                  {d}
                </div>
              ))}
              {PARTS.map((part) => (
                <FragmentRow key={part.id}>
                  <div className="flex flex-col justify-center pr-1 text-right">
                    <span className="text-xs text-paper">{part.label}</span>
                    <span className="text-[10px] text-bone/50">{part.time}</span>
                  </div>
                  {DAYS.map((_, di) => {
                    const key = `${di}-${part.id}`;
                    const cat = state.cells[key];
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => paint(key)}
                        title={cat ? CATEGORIES.find((c) => c.id === cat)?.label : 'Empty'}
                        className="h-10 rounded-md border border-bone/10 transition-all hover:border-bone/40"
                        style={cat ? { backgroundColor: colorOf(cat), borderColor: 'transparent' } : undefined}
                      />
                    );
                  })}
                </FragmentRow>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-bone/50">
          {filled} of {totalBlocks} blocks logged
        </p>
      </Panel>

      <Panel title="2 · Where your week went">
        <div className="space-y-2.5">
          {counts.map((c) => {
            const pct = filled === 0 ? 0 : Math.round((c.blocks / filled) * 100);
            return (
              <div key={c.id} className="flex items-center gap-3">
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="w-28 shrink-0 text-sm text-paper">{c.label}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-bone/10">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: c.color }} />
                </div>
                <span className="w-24 shrink-0 text-right text-xs text-bone">
                  ~{c.blocks * HOURS_PER_BLOCK}h · {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel title="3 · Reflect on the patterns">
        <div className="space-y-5">
          <Labeled label="What patterns surprised you?">
            <TextArea
              value={state.patterns}
              onChange={(e) => setState((p) => ({ ...p, patterns: e.target.value }))}
              placeholder="Where did more time go than you expected? Less?"
            />
          </Labeled>
          <Labeled label="Where is your time leaking?">
            <TextArea
              value={state.leaks}
              onChange={(e) => setState((p) => ({ ...p, leaks: e.target.value }))}
              placeholder="Name one or two places you'd like to reclaim time."
            />
          </Labeled>
        </div>
      </Panel>

      <ClearWork onClear={reset} />
    </div>
  );
}

/** Grid rows are flattened into the parent grid; this just groups children semantically. */
function FragmentRow({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
