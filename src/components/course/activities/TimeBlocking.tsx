import { useState } from 'react';
import { Copy } from 'lucide-react';
import type { ActivityProps } from './types';
import { useWork, ClearWork } from './Shared';
import { Panel } from '../fields';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 6:00 → 21:00

const CATEGORIES = [
  { id: 'deep', label: 'Deep work', color: '#F2052C' },
  { id: 'admin', label: 'Admin / shallow', color: '#a78bfa' },
  { id: 'meeting', label: 'Meetings', color: '#fbbf24' },
  { id: 'break', label: 'Break', color: '#60a5fa' },
  { id: 'exercise', label: 'Movement', color: '#34d399' },
  { id: 'personal', label: 'Personal', color: '#f472b6' },
  { id: 'meal', label: 'Meals', color: '#fb923c' },
];

type Blocks = Record<number, Record<number, string>>; // dayIndex -> hour -> category
type State = { blocks: Blocks };

function hourLabel(h: number) {
  const am = h < 12;
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display} ${am ? 'AM' : 'PM'}`;
}

export default function TimeBlocking({ activity, weekId }: ActivityProps) {
  const [state, setState, reset] = useWork<State>(weekId, activity.id, { blocks: {} });
  const [day, setDay] = useState(0);
  const [brush, setBrush] = useState(CATEGORIES[0].id);

  const colorOf = (id: string) => CATEGORIES.find((c) => c.id === id)?.color;
  const dayBlocks = state.blocks[day] ?? {};

  function paint(hour: number) {
    setState((prev) => {
      const current = { ...(prev.blocks[day] ?? {}) };
      if (current[hour] === brush) delete current[hour];
      else current[hour] = brush;
      return { blocks: { ...prev.blocks, [day]: current } };
    });
  }

  function copyToAll() {
    setState((prev) => {
      const source = prev.blocks[day] ?? {};
      const next: Blocks = {};
      DAYS.forEach((_, di) => {
        next[di] = { ...source };
      });
      return { blocks: next };
    });
  }

  const deepBlocksThisWeek = Object.values(state.blocks).reduce(
    (sum, d) => sum + Object.values(d).filter((c) => c === 'deep').length,
    0,
  );

  return (
    <div className="space-y-8">
      <Panel title="Build your week, one block at a time">
        <p className="mb-5 text-sm text-bone">
          Pick a day, choose a category, and click the hours to block them out. Click an hour again
          to clear it. Build one strong day, then{' '}
          <span className="text-paper">copy it across the week</span> and adjust.
        </p>

        {/* day tabs */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {DAYS.map((d, i) => {
            const count = Object.keys(state.blocks[i] ?? {}).length;
            return (
              <button
                key={d}
                type="button"
                onClick={() => setDay(i)}
                className={[
                  'rounded-full px-3.5 py-1.5 text-sm transition-colors',
                  day === i ? 'bg-paper text-ink' : 'border border-bone/20 text-bone hover:text-paper',
                ].join(' ')}
              >
                {d}
                {count > 0 && <span className={day === i ? 'text-ink/50' : 'text-flame'}> ·{count}</span>}
              </button>
            );
          })}
        </div>

        {/* brush */}
        <div className="mb-5 flex flex-wrap gap-2">
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

        {/* hour grid */}
        <div className="space-y-1">
          {HOURS.map((h) => {
            const cat = dayBlocks[h];
            return (
              <button
                key={h}
                type="button"
                onClick={() => paint(h)}
                className="flex w-full items-center gap-3 rounded-lg border border-bone/10 px-3 py-2 text-left transition-colors hover:border-bone/30"
                style={cat ? { backgroundColor: `${colorOf(cat)}22`, borderColor: colorOf(cat) } : undefined}
              >
                <span className="w-14 shrink-0 text-xs text-bone">{hourLabel(h)}</span>
                <span className="flex-1 text-sm" style={{ color: cat ? colorOf(cat) : undefined }}>
                  {cat ? CATEGORIES.find((c) => c.id === cat)?.label : <span className="text-bone/30">—</span>}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={copyToAll}
            className="inline-flex items-center gap-2 rounded-full border border-bone/25 px-4 py-2 text-sm text-bone transition-colors hover:border-flame/60 hover:text-paper"
          >
            <Copy size={14} /> Copy {DAYS[day]} to every day
          </button>
          <p className="text-sm text-bone">
            <span className="font-serif text-xl text-flame">{deepBlocksThisWeek}h</span> of deep work
            scheduled this week
          </p>
        </div>
      </Panel>

      <ClearWork onClear={reset} />
    </div>
  );
}
