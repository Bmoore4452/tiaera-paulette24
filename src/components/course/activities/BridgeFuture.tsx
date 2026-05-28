import { ArrowRight } from 'lucide-react';
import type { ActivityProps } from './types';
import { useWork, ClearWork } from './Shared';
import { AddButton, Labeled, Panel, RemoveButton, TextArea, TextInput } from '../fields';

type ListKey = 'leaving' | 'stepping';
type State = {
  leaving: string[];
  stepping: string[];
  leap: string;
  m1: string;
  m2: string;
  m3: string;
};

export default function BridgeFuture({ activity, courseId, weekId }: ActivityProps) {
  const [state, setState, reset] = useWork<State>(courseId, weekId, activity.id, {
    leaving: [''],
    stepping: [''],
    leap: '',
    m1: '',
    m2: '',
    m3: '',
  });

  const updateList = (key: ListKey, i: number, value: string) =>
    setState((p) => ({ ...p, [key]: p[key].map((v, idx) => (idx === i ? value : v)) }));
  const addItem = (key: ListKey) => setState((p) => ({ ...p, [key]: [...p[key], ''] }));
  const removeItem = (key: ListKey, i: number) =>
    setState((p) => ({ ...p, [key]: p[key].length > 1 ? p[key].filter((_, idx) => idx !== i) : p[key] }));

  return (
    <div className="space-y-8">
      <Panel title="1 · The bridge">
        <div className="grid gap-5 md:grid-cols-[1fr_auto_1fr] md:items-start">
          <Column title="Leaving behind" accent="#9ca3af" hint="The old patterns, identities, comforts.">
            {state.leaving.map((v, i) => (
              <Row
                key={i}
                value={v}
                onChange={(val) => updateList('leaving', i, val)}
                onRemove={() => removeItem('leaving', i)}
              />
            ))}
            <AddButton onClick={() => addItem('leaving')}>Add</AddButton>
          </Column>

          <div className="hidden md:flex md:flex-col md:items-center md:pt-12">
            <ArrowRight size={28} className="text-flame" />
            <span className="mt-1 text-[10px] uppercase tracking-widest text-bone">Leap</span>
          </div>

          <Column title="Stepping into" accent="#F2052C" hint="The new identity, work, life.">
            {state.stepping.map((v, i) => (
              <Row
                key={i}
                value={v}
                onChange={(val) => updateList('stepping', i, val)}
                onRemove={() => removeItem('stepping', i)}
              />
            ))}
            <AddButton onClick={() => addItem('stepping')}>Add</AddButton>
          </Column>
        </div>
      </Panel>

      <div className="rounded-2xl border border-flame/30 bg-flame/5 p-6 md:p-8">
        <p className="mb-3 font-serif text-xl text-paper">The leap itself</p>
        <p className="mb-4 text-sm text-bone">
          One bold sentence. What's the decisive move that bridges who you've been and who you're
          becoming?
        </p>
        <TextArea
          value={state.leap}
          onChange={(e) => setState((p) => ({ ...p, leap: e.target.value }))}
          placeholder="e.g. I'm telling my family I'm changing careers by the end of this month."
          className="min-h-[110px]"
        />
      </div>

      <Panel title="2 · 90-day action plan">
        <p className="mb-5 text-sm text-bone">
          Three concrete moves, one per month, that make the leap real.
        </p>
        <div className="space-y-4">
          <Labeled label="Month 1">
            <TextInput
              value={state.m1}
              onChange={(e) => setState((p) => ({ ...p, m1: e.target.value }))}
              placeholder="What you'll do in the first 30 days."
            />
          </Labeled>
          <Labeled label="Month 2">
            <TextInput
              value={state.m2}
              onChange={(e) => setState((p) => ({ ...p, m2: e.target.value }))}
              placeholder="What builds on month 1."
            />
          </Labeled>
          <Labeled label="Month 3">
            <TextInput
              value={state.m3}
              onChange={(e) => setState((p) => ({ ...p, m3: e.target.value }))}
              placeholder="Where the leap actually lands."
            />
          </Labeled>
        </div>
      </Panel>

      <ClearWork onClear={reset} />
    </div>
  );
}

function Column({
  title,
  accent,
  hint,
  children,
}: {
  title: string;
  accent: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accent }} />
        <span className="font-serif text-lg text-paper">{title}</span>
      </div>
      <p className="mb-3 text-xs text-bone/60">{hint}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ value, onChange, onRemove }: { value: string; onChange: (v: string) => void; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <TextInput value={value} onChange={(e) => onChange(e.target.value)} placeholder="…" className="flex-1" />
      <RemoveButton onClick={onRemove} />
    </div>
  );
}
