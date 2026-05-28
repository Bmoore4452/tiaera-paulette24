import { useLocalStorage } from './useLocalStorage';

/** Author identity for discussion posts/comments — collected inline on first post. */
export type Profile = {
  name: string;
  pronouns: string;
};

const EMPTY: Profile = { name: '', pronouns: '' };

export function useProfile() {
  const [profile, setProfile, reset] = useLocalStorage<Profile>('profile', EMPTY);
  const hasProfile = profile.name.trim().length > 0 && profile.pronouns.trim().length > 0;
  return { profile, setProfile, reset, hasProfile };
}
