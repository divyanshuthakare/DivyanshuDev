/**
 * storage.ts
 *
 * Wrapper around react-native-mmkv for all persistent storage needs.
 * Provides typed helpers for strings, objects, auth data, theme preference,
 * and navigation state. MMKV is initialized lazily on first access so the
 * module can be imported anywhere without side-effects at load time.
 */

import { MMKV } from 'react-native-mmkv';

// The MMKV instance is created once and reused for the app's lifetime.
// Using a named storage id allows multiple isolated stores if needed in future.
let _storage: MMKV | null = null;

// Lazy accessor — initializes the MMKV instance on first call.
function s(): MMKV {
  if (!_storage) {
    _storage = new MMKV({ id: 'app-storage' });
  }
  return _storage;
}

// Exported for the rare cases where a file needs direct MMKV access
// (e.g., reading synchronously in a non-async context).
export { s as getStorage };

// ─── Storage Keys ─────────────────────────────────────────────────────────────
// Centralizing key strings avoids typos and makes it easy to audit
// what the app persists.
export const STORAGE_KEYS = {
  PRE_CONTEXT_TOKEN : 'pre_context_token',
  ACCESS_TOKEN      : 'access_token',
  USER              : 'user',
  SELECTED_INSTITUTE: 'selectedInstitute',
  SELECTED_ROLE     : 'selectedRole',
  THEME             : 'theme',
  LAST_SCREEN       : 'last_screen',
  IS_LOGGED_IN      : 'isLoggedIn',
} as const;

// ─── Generic helpers ──────────────────────────────────────────────────────────
// These are async by signature to match the common storage interface pattern
// used throughout the app, even though MMKV operations are synchronous.

// Persists a plain string value.
export async function storeString(key: string, value: string): Promise<void> {
  s().set(key, value);
}

// Retrieves a string value, or null if the key does not exist.
export async function getString(key: string): Promise<string | null> {
  return s().getString(key) ?? null;
}

// Serializes an object to JSON and stores it as a string.
export async function storeObject(key: string, value: unknown): Promise<void> {
  s().set(key, JSON.stringify(value));
}

// Retrieves and deserializes a JSON-stored object.
// Returns null if the key is missing or the stored value is not valid JSON.
export async function getObject<T = unknown>(key: string): Promise<T | null> {
  const raw = s().getString(key);
  if (!raw) return null;
  try   { return JSON.parse(raw) as T; }
  catch { return null; }
}

// Removes a single key from storage.
export async function removeKey(key: string): Promise<void> {
  s().delete(key);
}

// ─── Theme ────────────────────────────────────────────────────────────────────

export type ThemePreference = 'dark' | 'light' | 'system';

// Returns the saved theme preference: 'dark', 'light', or 'system'.
// Defaults to 'system' when no value has been stored yet.
export async function getTheme(): Promise<ThemePreference> {
  const t = s().getString(STORAGE_KEYS.THEME);
  if (t === 'dark')  return 'dark';
  if (t === 'light') return 'light';
  return 'system';
}

// Persists the user's theme choice. Pass 'dark', 'light', or 'system'.
export async function saveTheme(theme: ThemePreference | string): Promise<void> {
  s().set(STORAGE_KEYS.THEME, theme);
}

// ─── Last Screen ──────────────────────────────────────────────────────────────

// Screens that are considered valid navigation targets when restoring state.
const VALID_SCREENS: string[] = ['Home', 'InstituteSelection', 'RoleSelection', 'Dashboard'];

// Only these screens will be used when restoring the user to their last
// position after a cold start. Other valid screens always fall back to
// InstituteSelection.
const RESTORABLE_SCREENS: string[] = ['InstituteSelection', 'Dashboard'];

// Saves the most recently visited screen name so it can be restored on next launch.
export async function saveLastScreen(screen: string): Promise<void> {
  s().set(STORAGE_KEYS.LAST_SCREEN, screen);
}

// Synchronous variant of saveLastScreen, used in navigation event listeners
// where an async call could cause timing issues.
export function saveLastScreenSync(screen: string): void {
  if (screen) s().set(STORAGE_KEYS.LAST_SCREEN, screen);
}

// Returns the last visited screen if it is in VALID_SCREENS, otherwise 'Home'.
export async function getLastScreen(): Promise<string> {
  const screen = s().getString(STORAGE_KEYS.LAST_SCREEN);
  return screen && VALID_SCREENS.includes(screen) ? screen : 'Home';
}

// ─── Auth helpers ─────────────────────────────────────────────────────────────

// Synchronous login check. Considers the user logged in if any auth token
// or the explicit isLoggedIn flag is present. Used during cold-start
// navigation setup where async operations are not practical.
export function isLoggedInSync(): boolean {
  const flag        = s().getBoolean(STORAGE_KEYS.IS_LOGGED_IN);
  const preToken    = s().getString(STORAGE_KEYS.PRE_CONTEXT_TOKEN);
  const accessToken = s().getString(STORAGE_KEYS.ACCESS_TOKEN);
  return !!(flag || preToken || accessToken);
}

// Determines the initial route for the app navigator on cold start.
// Logged-out users always land on Home. Logged-in users are sent to their
// last restorable screen, or InstituteSelection if that screen is not in
// the RESTORABLE_SCREENS list.
export function getInitialRouteSync(): string {
  try {
    const loggedIn = isLoggedInSync();

    // Log cold-start state in development to help debug navigation issues.
    if (__DEV__) {
      const raw = s().getString(STORAGE_KEYS.LAST_SCREEN);
      console.log('[AppNavigator] cold-start check →', { loggedIn, lastScreen: raw });
    }

    if (!loggedIn) return 'Home';

    const lastScreen = s().getString(STORAGE_KEYS.LAST_SCREEN);
    if (lastScreen && RESTORABLE_SCREENS.includes(lastScreen)) {
      return lastScreen;
    }

    // Default logged-in landing screen when no restorable screen is found.
    return 'InstituteSelection';
  } catch (e) {
    // If anything goes wrong reading storage, fall back safely to Home.
    console.warn('[AppNavigator] getInitialRouteSync error:', e);
    return 'Home';
  }
}

// Async variant of isLoggedInSync for use in non-startup contexts.
export async function isLoggedIn(): Promise<boolean> {
  return isLoggedInSync();
}

// ─── User types ───────────────────────────────────────────────────────────────
export interface StoredUser {
  full_name?: string;
  email?: string;
  [key: string]: unknown;
}

// Persists login data after a successful authentication response.
// Stores the pre-context token and basic user info; the full access token
// and context data (institute, role) are saved separately after context selection.
export async function saveLoginData(preContextToken: string, user: StoredUser): Promise<void> {
  s().set(STORAGE_KEYS.PRE_CONTEXT_TOKEN, preContextToken || '');
  s().set(STORAGE_KEYS.IS_LOGGED_IN, true);
  if (user && typeof user === 'object') {
    s().set(STORAGE_KEYS.USER, JSON.stringify(user));
  }
}

// ─── Save context data ────────────────────────────────────────────────────────

// Saves the full session context once the user has selected an institute and role.
// Called after context selection is complete, before navigating to the Dashboard.
export async function saveContextData(
  accessToken: string,
  institute: object,
  role: object,
): Promise<void> {
  s().set(STORAGE_KEYS.ACCESS_TOKEN,       accessToken || '');
  s().set(STORAGE_KEYS.SELECTED_INSTITUTE, JSON.stringify(institute || {}));
  s().set(STORAGE_KEYS.SELECTED_ROLE,      JSON.stringify(role      || {}));
  s().set(STORAGE_KEYS.IS_LOGGED_IN,       true);
}

// ─── Clear auth data (logout) ─────────────────────────────────────────────────

// Wipes all stored auth and session data. Called on logout.
// Deletes every key defined in STORAGE_KEYS so nothing sensitive is left behind.
export async function clearAuthData(): Promise<void> {
  Object.values(STORAGE_KEYS).forEach((key: string) => s().delete(key));
}

// ─── Getters ──────────────────────────────────────────────────────────────────

// Returns the stored user object, or null if not found.
export async function getUser(): Promise<StoredUser | null> {
  return getObject<StoredUser>(STORAGE_KEYS.USER);
}

// Returns the stored selected institute object, or null if not found.
export async function getSelectedInstitute(): Promise<unknown | null> {
  return getObject(STORAGE_KEYS.SELECTED_INSTITUTE);
}

// Returns the stored selected role object, or null if not found.
export async function getSelectedRole(): Promise<unknown | null> {
  return getObject(STORAGE_KEYS.SELECTED_ROLE);
}