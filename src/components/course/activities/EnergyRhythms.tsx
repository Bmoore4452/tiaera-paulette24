import type { ActivityProps } from './types';
import { useWork, ClearWork } from './Shared';
import { Labeled, Panel, TextArea } from '../fields';

const CHRONOTYPES = [
  { id: 'lion', label: 'Lion', tag: 'Early riser', desc: 'Peaks early — sharpest in the morning, fades by evening.' },
  { id: 'bear', label: 'Bear', tag: 'Sun-driven', desc: "Energy follows the sun — strong late morning into early afternoon." },
  { id: 'wolf', label: 'Wolf', tag: 'Night owl', desc: 'Slow to start, peaks in the late afternoon and evening.' },
  { id: 'dolphin', label: 'Dolphin', tag: 'Light sleeper', desc: 'Irregular rhythm; alert in bursts, often a late-morning window.' },
];

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 6:00 → 22:00
type Level = 'low' | 'med' | 'high';
const ORDER: Level[] = ['low', 'med', 'high'];
const HEIGHT: Record<Level, string> = { low: '28%', med: '62%', high: '100%' };
const COLOR: Record<Level, string> = { low: '#3f3b3e', med: '#8a8589', high: '#F2052C' };

type State = { chronotype: string | null; energy: Record<number, Level>; peakTasks: string };

function hourLabel(h: number) {
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display}${h < 12 ? 'a' : 'p'}`;
}

export default function EnergyRhythms({ activity, courseId, weekId }: ActivityProps) {
  const [state, setState, reset] = useWork<State>(courseId, weekId, activity.id, {
    chronotype: null,
    energy: {},
    peakTasks: '',
  });

  const levelAt = (h: number): Level => state.energy[h] ?? 'med';
  const cycle = (h: number) =>
    setState((p) => {
      const current = p.energy[h] ?? 'med';
      const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
      return { ...p, energy: { ...p.energy, [h]: next } };
    });

  const peaks = HOURS.filter((h) => levelAt(h) === 'high');

  return (
    <div className="space-y-8">
      <Panel title="1 · What's your chronotype?">
        <p className="mb-4 text-sm text-bone">
          Your chronotype is the natural shape of your daily energy. Pick the one that sounds most
          like you — there's no wrong answer.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {CHRONOTYPES.map((c) => {
            const active = state.chronotype === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setState((p) => ({ ...p, chronotype: c.id }))}
                className={[
                  'rounded-2xl border p-4 text-left transition-all',
                  active ? 'border-flame bg-flame/10' : 'border-bone/15 hover:border-bone/40',
                ].join(' ')}
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-xl text-paper">{c.label}</span>
                  <span className="text-[10px] uppercase tracking-widest text-bone">{c.tag}</span>
                </div>
                <p className="mt-2 text-sm text-bone">{c.desc}</p>
              </button>
            );
          })}
        </div>
      </Panel>

      <Panel title="2 · Map your energy across the day">
        <p className="mb-5 text-sm text-bone">
          Tap each hour to cycle it through{' '}
          <span className="text-bone/50">low</span> → <span className="text-paper">medium</span> →{' '}
          <span className="text-flame">high</span>. Be honest about when you actually feel sharp.
        </p>
        <div className="flex h-40 items-end gap-1">
          {HOURS.map((h) => {
            const lvl = levelAt(h);
            return (
              <button
                key={h}
                type="button"
                onClick={() => cycle(h)}
                className="group flex h-full flex-1 flex-col justify-end"
                title={`${hourLabel(h)} — ${lvl}`}
              >
                <span
                  className="w-full rounded-t-sm transition-all group-hover:opacity-80"
                  style={{ height: HEIGHT[lvl], backgroundColor: COLOR[lvl] }}
                />
              </button>
            );
          })}
        </div>
        <div className="mt-1.5 flex gap-1">
          {HOURS.map((h) => (
            <span key={h} className="flex-1 text-center text-[9px] text-bone/50">
              {h % 2 === 0 ? hourLabel(h) : ''}
            </span>
          ))}
        </div>
      </Panel>

      <Panel title="3 · Align your hardest work with your peaks">
        {peaks.length > 0 ? (
          <p className="mb-4 text-sm text-bone">
            Your peak windows:{' '}
            <span className="text-flame">{peaks.map(hourLabel).join(', ')}</span>. Protect these for
            your most demanding, high-stakes work.
          </p>
        ) : (
          <p className="mb-4 text-sm text-bone/60">
            Mark some hours as high-energy above to see your peak windows here.
          </p>
        )}
        <Labeled label="Which hard tasks will you move into your peak windows?">
          <TextArea
            value={state.peakTasks}
            onChange={(e) => setState((p) => ({ ...p, peakTasks: e.target.value }))}
            placeholder="Name the demanding work that deserves your best energy."
          />
        </Labeled>
      </Panel>

      <ClearWork onClear={reset} />
    </div>
  );
}
