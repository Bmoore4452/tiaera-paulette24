import { ArrowRight } from 'lucide-react';
import type { ActivityProps } from './types';
import { useWork, ClearWork } from './Shared';
import { AddButton, Labeled, Panel, RemoveButton, TextArea, TextInput } from '../fields';

type ListKey = 'keep' | 'start' | 'stop';
type State = {
  keep: string[];
  start: string[];
  stop: string[];
  m30: string;
  m60: string;
  m90: string;
  partner: string;
  vision: string;
};

const COLUMNS: { key: ListKey; title: string; hint: string; accent: string }[] = [
  { key: 'keep', title: 'Keep', hint: 'Practices that worked — protect them.', accent: '#34d399' },
  { key: 'start', title: 'Start', hint: 'New habits to bring in.', accent: '#F2052C' },
  { key: 'stop', title: 'Stop', hint: 'What no longer serves you.', accent: '#9ca3af' },
];

export default function MasteryRoadmap({ activity, courseId, weekId }: ActivityProps) {
  const [state, setState, reset] = useWork<State>(courseId, weekId, activity.id, {
    keep: [''],
    start: [''],
    stop: [''],
    m30: '',
    m60: '',
    m90: '',
    partner: '',
    vision: '',
  });

  const updateList = (key: ListKey, i: number, value: string) =>
    setState((p) => ({ ...p, [key]: p[key].map((v, idx) => (idx === i ? value : v)) }));
  const addItem = (key: ListKey) => setState((p) => ({ ...p, [key]: [...p[key], ''] }));
  const removeItem = (key: ListKey, i: number) =>
    setState((p) => ({ ...p, [key]: p[key].length > 1 ? p[key].filter((_, idx) => idx !== i) : p[key] }));

  return (
    <div className="space-y-8">
      <Panel title="1 · Keep · Start · Stop">
        <div className="grid gap-5 md:grid-cols-3">
          {COLUMNS.map((col) => (
            <div key={col.key}>
              <div className="mb-1 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: col.accent }} />
                <span className="font-serif text-lg text-paper">{col.title}</span>
              </div>
              <p className="mb-3 text-xs text-bone/60">{col.hint}</p>
              <div className="space-y-2">
                {state[col.key].map((value, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <TextInput
                      value={value}
                      onChange={(e) => updateList(col.key, i, e.target.value)}
                      placeholder="…"
                      className="flex-1"
                    />
                    <RemoveButton onClick={() => removeItem(col.key, i)} />
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <AddButton onClick={() => addItem(col.key)}>Add</AddButton>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="2 · Your 30 / 60 / 90-day milestones">
        <div className="space-y-4">
          <Labeled label="In 30 days">
            <TextInput value={state.m30} onChange={(e) => setState((p) => ({ ...p, m30: e.target.value }))} placeholder="What will be true in a month?" />
          </Labeled>
          <Labeled label="In 60 days">
            <TextInput value={state.m60} onChange={(e) => setState((p) => ({ ...p, m60: e.target.value }))} placeholder="And two months out?" />
          </Labeled>
          <Labeled label="In 90 days">
            <TextInput value={state.m90} onChange={(e) => setState((p) => ({ ...p, m90: e.target.value }))} placeholder="Where do you want to be in a quarter?" />
          </Labeled>
        </div>
      </Panel>

      <Panel title="3 · Stay accountable">
        <Labeled label="Who's your accountability partner, and how will you check in?">
          <TextInput
            value={state.partner}
            onChange={(e) => setState((p) => ({ ...p, partner: e.target.value }))}
            placeholder="e.g. Weekly Sunday text with a cohort friend"
          />
        </Labeled>
      </Panel>

      <div className="rounded-2xl border border-flame/30 bg-flame/5 p-5 md:p-6">
        <p className="mb-1 flex items-center gap-2 font-serif text-xl text-paper">
          <ArrowRight size={18} className="text-flame" /> Your long-term vision
        </p>
        <p className="mb-4 text-sm text-bone">
          When you've truly mastered your time, what does your life look like? Write it in the
          present tense, as if it's already real.
        </p>
        <TextArea
          value={state.vision}
          onChange={(e) => setState((p) => ({ ...p, vision: e.target.value }))}
          placeholder="I spend my best hours on…"
          className="min-h-[140px]"
        />
      </div>

      <ClearWork onClear={reset} />
    </div>
  );
}
