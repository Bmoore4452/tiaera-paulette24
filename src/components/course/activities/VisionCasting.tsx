import type { ActivityProps } from './types';
import { useWork, ClearWork } from './Shared';
import { Labeled, Panel, TextArea, TextInput } from '../fields';

const DOMAINS = [
  { id: 'faith', label: 'Faith & spirit', color: '#a78bfa' },
  { id: 'career', label: 'Work & calling', color: '#F2052C' },
  { id: 'relationships', label: 'Relationships', color: '#f59e0b' },
  { id: 'health', label: 'Health & body', color: '#34d399' },
  { id: 'finance', label: 'Finance', color: '#60a5fa' },
  { id: 'joy', label: 'Joy & hobbies', color: '#f472b6' },
];

type Entry = { vision: string; signal: string };
type State = { domains: Record<string, Entry>; statement: string };

const emptyEntry = (): Entry => ({ vision: '', signal: '' });

export default function VisionCasting({ activity, courseId, weekId }: ActivityProps) {
  const init: State = {
    domains: Object.fromEntries(DOMAINS.map((d) => [d.id, emptyEntry()])),
    statement: '',
  };
  const [state, setState, reset] = useWork<State>(courseId, weekId, activity.id, init);

  const entry = (id: string): Entry => state.domains[id] ?? emptyEntry();
  const update = (id: string, patch: Partial<Entry>) =>
    setState((p) => ({
      ...p,
      domains: { ...p.domains, [id]: { ...emptyEntry(), ...p.domains[id], ...patch } },
    }));

  const filledDomains = DOMAINS.filter((d) => entry(d.id).vision.trim()).length;

  return (
    <div className="space-y-8">
      <p className="text-sm text-bone">
        Write your one-year vision in the present tense — as though it's already happening. For each
        area, also name <span className="text-paper">one concrete signal</span> that will let you
        know it's real. Vision without a signal is wishful thinking.
      </p>

      {DOMAINS.map((d) => {
        const e = entry(d.id);
        return (
          <Panel key={d.id}>
            <div className="mb-4 flex items-center gap-2.5">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="font-serif text-xl text-paper">{d.label}</span>
            </div>
            <div className="space-y-4">
              <Labeled label="A year from now, in this area…">
                <TextArea
                  value={e.vision}
                  onChange={(ev) => update(d.id, { vision: ev.target.value })}
                  placeholder="Write in the present tense — 'I am…', 'My week looks like…', 'I feel…'."
                />
              </Labeled>
              <Labeled label="One concrete signal that it's happening">
                <TextInput
                  value={e.signal}
                  onChange={(ev) => update(d.id, { signal: ev.target.value })}
                  placeholder="e.g. I'm paying off the second debt. We have weekly dinners again. I sleep 7 hours."
                />
              </Labeled>
            </div>
          </Panel>
        );
      })}

      <Panel title="Your expectancy statement">
        <p className="mb-4 text-sm text-bone">
          One sentence you'll repeat — in the morning, before hard moments, before the leap. Make it
          short, present-tense, and yours.
        </p>
        <TextArea
          value={state.statement}
          onChange={(e) => setState((p) => ({ ...p, statement: e.target.value }))}
          placeholder="e.g. I am becoming who I prayed I'd be — and my actions today match that woman."
          className="min-h-[110px]"
        />
        <p className="mt-3 text-xs text-bone/60">
          {filledDomains} of {DOMAINS.length} domains filled in
        </p>
      </Panel>

      <ClearWork onClear={reset} />
    </div>
  );
}
