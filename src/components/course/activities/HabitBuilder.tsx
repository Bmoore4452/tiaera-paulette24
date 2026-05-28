import type { ActivityProps } from './types';
import { useWork, ClearWork } from './Shared';
import { Labeled, Panel, TextInput } from '../fields';

const DAYS = Array.from({ length: 30 }, (_, i) => i + 1);

type State = {
  name: string;
  cue: string;
  duration: string;
  reward: string;
  why: string;
  days: Record<number, boolean>;
};

export default function HabitBuilder({ activity, courseId, weekId }: ActivityProps) {
  const [state, setState, reset] = useWork<State>(courseId, weekId, activity.id, {
    name: '',
    cue: '',
    duration: '',
    reward: '',
    why: '',
    days: {},
  });

  const toggleDay = (n: number) =>
    setState((p) => ({ ...p, days: { ...p.days, [n]: !p.days[n] } }));

  const completed = DAYS.filter((d) => state.days[d]).length;
  const currentStreak = computeStreak(state.days);
  const longestStreak = computeLongestStreak(state.days);

  return (
    <div className="space-y-8">
      <Panel title="1 · Define the habit (small, specific, doable)">
        <div className="space-y-4">
          <Labeled label="The habit, in one sentence">
            <TextInput
              value={state.name}
              onChange={(e) => setState((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Read 10 pages before bed. Walk for 15 minutes after lunch."
            />
          </Labeled>
          <div className="grid gap-4 sm:grid-cols-2">
            <Labeled label="Cue · when does it happen?">
              <TextInput
                value={state.cue}
                onChange={(e) => setState((p) => ({ ...p, cue: e.target.value }))}
                placeholder="e.g. After morning coffee."
              />
            </Labeled>
            <Labeled label="How long does it take?">
              <TextInput
                value={state.duration}
                onChange={(e) => setState((p) => ({ ...p, duration: e.target.value }))}
                placeholder="e.g. 10 minutes."
              />
            </Labeled>
            <Labeled label="Reward · how do you mark the win?">
              <TextInput
                value={state.reward}
                onChange={(e) => setState((p) => ({ ...p, reward: e.target.value }))}
                placeholder="e.g. Tea after. A small check off this grid."
              />
            </Labeled>
            <Labeled label="Why it matters to you">
              <TextInput
                value={state.why}
                onChange={(e) => setState((p) => ({ ...p, why: e.target.value }))}
                placeholder="The bigger reason in one phrase."
              />
            </Labeled>
          </div>
        </div>
      </Panel>

      <Panel title="2 · 30 days of practice">
        <p className="mb-5 text-sm text-bone">
          Tap a day when you've done the habit. Missing a day is fine — just don't miss two in a row.
        </p>
        <div className="grid grid-cols-6 gap-2 sm:grid-cols-10">
          {DAYS.map((d) => {
            const done = !!state.days[d];
            return (
              <button
                key={d}
                type="button"
                onClick={() => toggleDay(d)}
                className={[
                  'aspect-square rounded-lg text-sm font-medium transition-all',
                  done
                    ? 'bg-flame text-paper'
                    : 'border border-bone/15 text-bone hover:border-flame/50 hover:text-paper',
                ].join(' ')}
                aria-pressed={done}
                aria-label={`Day ${d}${done ? ' — done' : ''}`}
              >
                {d}
              </button>
            );
          })}
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <Stat label="Days done" value={`${completed}/30`} />
          <Stat label="Current streak" value={`${currentStreak}d`} />
          <Stat label="Longest streak" value={`${longestStreak}d`} />
        </div>
      </Panel>

      <ClearWork onClear={reset} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-bone/10 bg-ink/30 p-4">
      <p className="font-serif text-3xl text-paper">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-widest text-bone">{label}</p>
    </div>
  );
}

function computeStreak(days: Record<number, boolean>): number {
  // Counts consecutive completed days ending at the highest day marked done.
  let max = 0;
  for (let i = 30; i >= 1; i--) {
    if (days[i]) {
      let run = 0;
      for (let j = i; j >= 1 && days[j]; j--) run++;
      max = Math.max(max, run);
      break;
    }
  }
  return max;
}

function computeLongestStreak(days: Record<number, boolean>): number {
  let longest = 0;
  let current = 0;
  for (let i = 1; i <= 30; i++) {
    if (days[i]) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }
  return longest;
}
