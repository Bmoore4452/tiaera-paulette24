import type { ActivityProps } from './types';
import { useWork, ClearWork } from './Shared';
import { AddButton, Labeled, Panel, RemoveButton, Segmented, TextInput } from '../fields';

type Source = 'family' | 'society' | 'culture' | 'career' | 'self' | 'other';
type Effect = 'strengthens' | 'confines' | 'both';

const SOURCES: { value: Source; label: string }[] = [
  { value: 'family', label: 'Family' },
  { value: 'society', label: 'Society' },
  { value: 'culture', label: 'Culture' },
  { value: 'career', label: 'Career' },
  { value: 'self', label: 'Self-imposed' },
  { value: 'other', label: 'Other' },
];

const EFFECTS: { value: Effect; label: string }[] = [
  { value: 'strengthens', label: 'Strengthens' },
  { value: 'confines', label: 'Confines' },
  { value: 'both', label: 'Both' },
];

const SUGGESTIONS = ['Daughter', 'Mother', 'Strong one', 'Provider', 'The fixer', 'Survivor', 'Caretaker'];

type Row = { id: string; text: string; source: Source; effect: Effect };
type State = { rows: Row[] };

const uid = () => Math.random().toString(36).slice(2, 9);
const blank = (text = ''): Row => ({ id: uid(), text, source: 'self', effect: 'both' });

export default function IdentityInventory({ activity, courseId, weekId }: ActivityProps) {
  const [state, setState, reset] = useWork<State>(courseId, weekId, activity.id, { rows: [blank()] });

  const update = (id: string, patch: Partial<Row>) =>
    setState((p) => ({ rows: p.rows.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));
  const add = (text = '') => setState((p) => ({ rows: [...p.rows, blank(text)] }));
  const remove = (id: string) =>
    setState((p) => ({ rows: p.rows.length > 1 ? p.rows.filter((r) => r.id !== id) : p.rows }));

  const named = state.rows.filter((r) => r.text.trim());
  const strengthens = named.filter((r) => r.effect === 'strengthens' || r.effect === 'both');
  const confines = named.filter((r) => r.effect === 'confines' || r.effect === 'both');

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-3 text-sm text-bone">Start with a few common labels, or add your own:</p>
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
            <span className="font-serif text-lg text-flame">Label {i + 1}</span>
            <RemoveButton onClick={() => remove(row.id)} />
          </div>
          <div className="space-y-4">
            <Labeled label="The label">
              <TextInput
                value={row.text}
                onChange={(e) => update(row.id, { text: e.target.value })}
                placeholder="e.g. The strong one, Daughter, Survivor…"
              />
            </Labeled>
            <div className="grid gap-4 sm:grid-cols-2">
              <Labeled label="Where did it come from?">
                <Segmented value={row.source} size="sm" options={SOURCES} onChange={(v) => update(row.id, { source: v })} />
              </Labeled>
              <Labeled label="How does it operate in your life?">
                <Segmented value={row.effect} size="sm" options={EFFECTS} onChange={(v) => update(row.id, { effect: v })} />
              </Labeled>
            </div>
          </div>
        </Panel>
      ))}

      <AddButton onClick={() => add()}>Add another label</AddButton>

      <Panel title="What you carry">
        <div className="grid gap-5 md:grid-cols-2">
          <Column title="Labels that strengthen you" accent="#34d399" rows={strengthens} />
          <Column title="Labels that confine you" accent="#F2052C" rows={confines} />
        </div>
        <p className="mt-5 text-sm text-bone">
          Labels in the right column don't have to disappear. The work is noticing them and choosing,
          consciously, which ones still belong to you.
        </p>
      </Panel>

      <ClearWork onClear={reset} />
    </div>
  );
}

function Column({ title, accent, rows }: { title: string; accent: string; rows: Row[] }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accent }} />
        <span className="text-sm uppercase tracking-[0.18em] text-bone">{title}</span>
      </div>
      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-bone/15 p-4 text-xs text-bone/50">
          Add labels above and tag them to see them here.
        </p>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between rounded-xl border border-bone/10 bg-ink/40 px-4 py-2.5"
            >
              <span className="text-paper">{r.text}</span>
              <span className="text-[10px] uppercase tracking-widest text-bone/60">
                {SOURCES.find((s) => s.value === r.source)?.label}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
