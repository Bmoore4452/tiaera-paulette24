import { useState } from 'react';
import { UserCircle } from 'lucide-react';
import { Labeled, TextInput } from './fields';
import { useProfile, type Profile } from '../../hooks/useProfile';

/**
 * Inline profile form — gathers display name + pronouns before a user submits
 * their first discussion post or comment. Persists to localStorage so they
 * aren't asked again on this device.
 */
export function ProfileForm({ onReady }: { onReady?: (profile: Profile) => void }) {
  const { profile, setProfile } = useProfile();
  const [name, setName] = useState(profile.name);
  const [pronouns, setPronouns] = useState(profile.pronouns);
  const valid = name.trim().length > 0 && pronouns.trim().length > 0;

  return (
    <div className="rounded-2xl border border-flame/30 bg-flame/5 p-5 md:p-6">
      <p className="mb-1 flex items-center gap-2 font-serif text-lg text-paper">
        <UserCircle size={18} className="text-flame" /> Set your discussion identity
      </p>
      <p className="mb-5 text-sm text-bone">
        Posts and comments are signed with your name and pronouns. You can change this anytime.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Labeled label="Display name">
          <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="What should the cohort call you?" />
        </Labeled>
        <Labeled label="Pronouns">
          <TextInput value={pronouns} onChange={(e) => setPronouns(e.target.value)} placeholder="she/her, he/him, they/them…" />
        </Labeled>
      </div>
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          disabled={!valid}
          onClick={() => {
            const next: Profile = { name: name.trim(), pronouns: pronouns.trim() };
            setProfile(next);
            onReady?.(next);
          }}
          className="btn-primary disabled:opacity-50"
        >
          Save & continue
        </button>
      </div>
    </div>
  );
}

/** Compact byline used on posts and comments. */
export function Byline({ profile, createdAt }: { profile: Profile; createdAt: string }) {
  const when = formatWhen(createdAt);
  return (
    <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm">
      <span className="font-medium text-paper">{profile.name}</span>
      <span className="text-bone/60">· {profile.pronouns}</span>
      <span className="text-bone/40">· {when}</span>
    </p>
  );
}

function formatWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}
