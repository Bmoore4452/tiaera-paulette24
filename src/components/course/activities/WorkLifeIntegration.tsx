import type { ActivityProps } from './types';
import { useWork, ClearWork } from './Shared';
import { Labeled, Panel, Segmented, TextInput } from '../fields';

const DOMAINS = [
  { id: 'work', label: 'Work & purpose', color: '#F2052C' },
  { id: 'health', label: 'Health & body', color: '#34d399' },
  { id: 'relationships', label: 'Relationships', color: '#f59e0b' },
  { id: 'growth', label: 'Growth & learning', color: '#a78bfa' },
  { id: 'rest', label: 'Rest & fun', color: '#60a5fa' },
];

const RATINGS = ['1', '2', '3', '4', '5'].map((v) => ({ value: v, label: v }));

type Entry = { intention: string; anchor: string; rating: string };
type State = Record<string, Entry>;

const emptyEntry = (): Entry => ({ intention: '', anchor: '', rating: '3' });

export default function WorkLifeIntegration({ activity, weekId }: ActivityProps) {
  const init: State = Object.fromEntries(DOMAINS.map((d) => [d.id, emptyEntry()]));
  const [state, setState, reset] = useWork<State>(weekId, activity.id, init);

  const entry = (id: string): Entry => state[id] ?? emptyEntry();
  const update = (id: string, patch: Partial<Entry>) =>
    setState((p) => ({ ...p, [id]: { ...emptyEntry(), ...p[id], ...patch } }));

  return (
    <div className="space-y-8">
      <p className="text-sm text-bone">
        Integration isn't a perfect split — it's making sure no part of your life consistently
        starves the others. For each domain, set a weekly intention, anchor it to a time, and rate
        how much attention it's truly getting.
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
              <Labeled label="This week's intention">
                <TextInput
                  value={e.intention}
                  onChange={(ev) => update(d.id, { intention: ev.target.value })}
                  placeholder="One thing that would make this domain feel tended-to."
                />
              </Labeled>
              <Labeled label="When in my week">
                <TextInput
                  value={e.anchor}
                  onChange={(ev) => update(d.id, { anchor: ev.target.value })}
                  placeholder="e.g. Tue & Thu mornings, Sunday evening"
                />
              </Labeled>
              <Labeled label="Attention it's getting lately (1 = starved, 5 = thriving)">
                <Segmented value={e.rating} size="sm" options={RATINGS} onChange={(v) => update(d.id, { rating: v })} />
              </Labeled>
            </div>
          </Panel>
        );
      })}

      <Panel title="Your balance, at a glance">
        <div className="space-y-3">
          {DOMAINS.map((d) => {
            const rating = Number(entry(d.id).rating) || 0;
            return (
              <div key={d.id} className="flex items-center gap-3">
                <span className="w-32 shrink-0 text-sm text-paper">{d.label}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-bone/10">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${(rating / 5) * 100}%`, backgroundColor: d.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-sm text-bone">
          The shortest bars are where your life is asking for attention. What's one small shift that
          would lift your lowest domain by a single point this week?
        </p>
      </Panel>

      <ClearWork onClear={reset} />
    </div>
  );
}
