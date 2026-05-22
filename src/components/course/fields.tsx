import { Plus, X } from 'lucide-react';
import type { ReactNode, TextareaHTMLAttributes, InputHTMLAttributes } from 'react';

/** Shared, site-themed form primitives used across every interactive activity. */

const baseField =
  'w-full rounded-xl border border-bone/15 bg-ink/60 px-4 py-3 text-paper placeholder:text-bone/40 outline-none transition-colors focus:border-flame/70 focus:bg-ink/80';

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${baseField} text-sm ${props.className ?? ''}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`${baseField} min-h-[120px] resize-y text-sm leading-relaxed ${props.className ?? ''}`}
    />
  );
}

export function Labeled({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-bone">
        {label}
      </span>
      {hint && <span className="-mt-1 mb-2 block text-xs text-bone/60">{hint}</span>}
      {children}
    </label>
  );
}

export function AddButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-bone/25 px-4 py-2 text-sm text-bone transition-colors hover:border-flame/60 hover:text-paper"
    >
      <Plus size={15} /> {children}
    </button>
  );
}

export function RemoveButton({ onClick, label = 'Remove' }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-bone/50 transition-colors hover:bg-flame/15 hover:text-flame"
    >
      <X size={15} />
    </button>
  );
}

export type SegmentOption<T extends string> = { value: T; label: string };

/** Compact segmented control for picking one of a small set of options. */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  size = 'md',
}: {
  value: T | null;
  options: SegmentOption<T>[];
  onChange: (v: T) => void;
  size?: 'sm' | 'md';
}) {
  return (
    <div className="inline-flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={[
              'rounded-full border transition-colors',
              size === 'sm' ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm',
              active
                ? 'border-flame bg-flame text-paper'
                : 'border-bone/20 text-bone hover:border-bone/50 hover:text-paper',
            ].join(' ')}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/** A bordered card section inside an activity. */
export function Panel({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-bone/10 bg-ink-soft/40 p-5 md:p-6 ${className ?? ''}`}>
      {title && <p className="mb-4 font-serif text-xl text-paper">{title}</p>}
      {children}
    </div>
  );
}
