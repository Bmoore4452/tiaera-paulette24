import type { ActivityProps } from './types';
import { useWork, ClearWork } from './Shared';
import { AddButton, Labeled, Panel, RemoveButton, Segmented, TextArea, TextInput } from '../fields';

type Frequency = 'never' | 'sometimes' | 'often' | 'always';

const FREQUENCIES: { value: Frequency; label: string }[] = [
  { value: 'never', label: 'Never' },
  { value: 'sometimes', label: 'Sometimes' },
  { value: 'often', label: 'Often' },
  { value: 'always', label: 'Always' },
];

const PRESETS = [
  { id: 'procrastination', name: 'Procrastination' },
  { id: 'perfectionism', name: 'Perfectionism' },
  { id: 'avoidance', name: 'Avoidance' },
  { id: 'shutdown', name: 'Emotional shutdown' },
  { id: 'inconsistency', name: 'Inconsistency' },
  { id: 'people-pleasing', name: 'People-pleasing' },
  { id: 'self-talk', name: 'Negative self-talk' },
];

type ItemState = { frequency: Frequency; cost: string; replacement: string };
type Custom = { id: string; name: string } & ItemState;
type State = {
  items: Record<string, ItemState>;
  custom: Custom[];
};

const uid = () => Math.random().toString(36).slice(2, 9);
const emptyItem = (): ItemState => ({ frequency: 'sometimes', cost: '', replacement: '' });

export default function SabotageAssessment({ activity, courseId, weekId }: ActivityProps) {
  const init: State = {
    items: Object.fromEntries(PRESETS.map((p) => [p.id, emptyItem()])),
    custom: [],
  };
  const [state, setState, reset] = useWork<State>(courseId, weekId, activity.id, init);

  const itemFor = (id: string): ItemState => state.items[id] ?? emptyItem();
  const updateItem = (id: string, patch: Partial<ItemState>) =>
    setState((p) => ({ ...p, items: { ...p.items, [id]: { ...emptyItem(), ...p.items[id], ...patch } } }));
  const updateCustom = (id: string, patch: Partial<Custom>) =>
    setState((p) => ({ ...p, custom: p.custom.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
  const addCustom = () =>
    setState((p) => ({ ...p, custom: [...p.custom, { id: uid(), name: '', ...emptyItem() }] }));
  const removeCustom = (id: string) =>
    setState((p) => ({ ...p, custom: p.custom.filter((c) => c.id !== id) }));

  // The "top 3" — anything rated "often" or "always" deserves a real replacement plan.
  const allWithFrequency = [
    ...PRESETS.map((p) => ({ id: p.id, name: p.name, state: itemFor(p.id) })),
    ...state.custom.map((c) => ({ id: c.id, name: c.name, state: c as ItemState })),
  ].filter((x) => x.name.trim());
  const high = allWithFrequency.filter((x) => x.state.frequency === 'often' || x.state.frequency === 'always');

  return (
    <div className="space-y-8">
      <Panel title="1 · How often does each show up for you?">
        <p className="mb-5 text-sm text-bone">
          Be honest — no one sees this but you.
        </p>
        <div className="space-y-3">
          {PRESETS.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-bone/10 bg-ink/30 px-4 py-3">
              <span className="font-serif text-lg text-paper">{p.name}</span>
              <Segmented value={itemFor(p.id).frequency} size="sm" options={FREQUENCIES} onChange={(v) => updateItem(p.id, { frequency: v })} />
            </div>
          ))}
        </div>
        {state.custom.length > 0 && (
          <div className="mt-5 space-y-3">
            {state.custom.map((c) => (
              <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-flame/30 bg-flame/5 px-4 py-3">
                <TextInput
                  value={c.name}
                  onChange={(e) => updateCustom(c.id, { name: e.target.value })}
                  placeholder="Your own pattern…"
                  className="max-w-xs flex-1"
                />
                <div className="flex items-center gap-2">
                  <Segmented value={c.frequency} size="sm" options={FREQUENCIES} onChange={(v) => updateCustom(c.id, { frequency: v })} />
                  <RemoveButton onClick={() => removeCustom(c.id)} />
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-5">
          <AddButton onClick={addCustom}>Add a pattern of your own</AddButton>
        </div>
      </Panel>

      <Panel title="2 · The ones to do something about">
        {high.length === 0 ? (
          <p className="text-sm text-bone/60">
            Mark something "often" or "always" above and it'll show up here for a replacement plan.
          </p>
        ) : (
          <div className="space-y-5">
            {high.map((x) => (
              <div key={x.id} className="rounded-2xl border border-bone/10 bg-ink/30 p-5">
                <p className="font-serif text-lg text-flame">{x.name}</p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Labeled label="What it actually costs me">
                    <TextArea
                      value={x.state.cost}
                      onChange={(e) =>
                        PRESETS.some((p) => p.id === x.id)
                          ? updateItem(x.id, { cost: e.target.value })
                          : updateCustom(x.id, { cost: e.target.value })
                      }
                      placeholder="The opportunities, relationships, peace, or progress it's taken from you."
                    />
                  </Labeled>
                  <Labeled label="The replacement behavior I'll practice">
                    <TextArea
                      value={x.state.replacement}
                      onChange={(e) =>
                        PRESETS.some((p) => p.id === x.id)
                          ? updateItem(x.id, { replacement: e.target.value })
                          : updateCustom(x.id, { replacement: e.target.value })
                      }
                      placeholder="Specific, small, doable. What will you do instead when the urge hits?"
                    />
                  </Labeled>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <ClearWork onClear={reset} />
    </div>
  );
}
