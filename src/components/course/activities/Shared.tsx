import { Trash2 } from 'lucide-react';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { workKey } from './types';

/** Per-activity persisted work, keyed and namespaced consistently. */
export function useWork<T>(courseId: string, weekId: string, activityId: string, initial: T) {
  return useLocalStorage<T>(workKey(courseId, weekId, activityId), initial);
}

export function ClearWork({ onClear }: { onClear: () => void }) {
  return (
    <div className="mt-10 flex justify-end">
      <button
        type="button"
        onClick={() => {
          if (window.confirm('Clear your work on this activity? This cannot be undone.')) onClear();
        }}
        className="inline-flex items-center gap-2 text-xs text-bone/50 transition-colors hover:text-flame"
      >
        <Trash2 size={13} /> Clear this worksheet
      </button>
    </div>
  );
}
