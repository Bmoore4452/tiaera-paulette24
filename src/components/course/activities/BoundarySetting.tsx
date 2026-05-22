import type { ActivityProps } from './types';
import { useWork, ClearWork } from './Shared';
import { AddButton, Labeled, Panel, RemoveButton, TextArea, TextInput } from '../fields';

const SUGGESTIONS = ['Work', 'Family', 'Friends', 'Social media', 'Phone & email', 'Saying yes too fast'];

type Row = { id: string; area: string; current: string; boundary: string; script: string };
type State = { rows: Row[] };

const uid = () => Math.random().toString(36).slice(2, 9);
const blank = (area = ''): Row => ({ id: uid(), area, current: '', boundary: '', script: '' });

export default function BoundarySetting({ activity, weekId }: ActivityProps) {
  const [state, setState, reset] = useWork<State>(weekId, activity.id, { rows: [blank()] });

  const update = (id: string, patch: Partial<Row>) =>
    setState((p) => ({ rows: p.rows.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));
  const add = (area = '') => setState((p) => ({ rows: [...p.rows, blank(area)] }));
  const remove = (id: string) =>
    setState((p) => ({ rows: p.rows.length > 1 ? p.rows.filter((r) => r.id !== id) : p.rows }));

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-sm text-bone">Need a starting point? Add a common area:</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="rounded-full border border-bone/20 px-3 py-1.5 text-sm text-bone transition-colors hover:border-flame/60 hover:text-paper"
            >
              + {s}
            </button>
          ))}
        </div>
      </div>

      {state.rows.map((row, i) => (
        <Panel key={row.id}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="font-serif text-lg text-flame">Boundary {i + 1}</span>
            <RemoveButton onClick={() => remove(row.id)} />
          </div>
          <div className="space-y-4">
            <Labeled label="Area of life">
              <TextInput
                value={row.area}
                onChange={(e) => update(row.id, { area: e.target.value })}
                placeholder="e.g. Work, Family, Social media"
              />
            </Labeled>
            <Labeled label="What's happening now">
              <TextArea
                value={row.current}
                onChange={(e) => update(row.id, { current: e.target.value })}
                placeholder="Where is your time or energy leaking here?"
              />
            </Labeled>
            <Labeled label="The boundary I'm setting">
              <TextArea
                value={row.boundary}
                onChange={(e) => update(row.id, { boundary: e.target.value })}
                placeholder="Be specific and concrete."
              />
            </Labeled>
            <Labeled label="My script — the words I'll use">
              <TextArea
                value={row.script}
                onChange={(e) => update(row.id, { script: e.target.value })}
                placeholder={`e.g. "That doesn't work for me right now, but thank you for thinking of me."`}
              />
            </Labeled>
          </div>
        </Panel>
      ))}

      <AddButton onClick={() => add()}>Add another boundary</AddButton>

      <ClearWork onClear={reset} />
    </div>
  );
}
