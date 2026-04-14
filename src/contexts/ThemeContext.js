/**
 * ThemeContext.js
 *
 * Provides app-wide light/dark theme state via React Context.
 *
 * Key design decisions:
 * - isDark is DERIVED from a single userOverride value plus the live
 *   system colour scheme. This avoids the async race condition where
 *   setState calls from AsyncStorage were fighting with the initial
 *   Appearance value and permanently locking the app to light mode.
 * - userOverride === null  →  follow system (default on first launch)
 * - userOverride === 'dark'  →  locked dark
 * - userOverride === 'light' →  locked light
 *
 * Exports:
 * - lightThemeBase / darkThemeBase — raw colour palettes (for screens
 *   that need to reference colours outside the context).
 * - ThemeProvider — wrap the app root with this.
 * - useTheme() — hook to consume the context in any component.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Appearance, useColorScheme } from 'react-native';
import { getTheme, saveTheme } from '../utils/storage';

// ─── Base colour palettes ─────────────────────────────────────────────────────
// These are exported so individual screens can reference specific tokens
// without having to go through the context.
export const lightThemeBase = {
  scrollBg: '#F2F2F2',
  iconButtonBg: '#FFFFFF',
  iconColor: '#1A1A2E',
  appTitle: '#000000',
  taglineBlack: '#000000',
  taglineOrange: '#F76C1D',
  taglinePurple: '#7440F5',
  taglineGray: '#58698C',
  taglineBlackBold: '#000000',
  taglineBlue: '#007AFF',
  inputBg: '#FFFFFF',
  inputText: '#1A1A1A',
  inputBorder: '#D0D5DD',
  dividerLine: '#000000',
  dividerText: '#07305D',
  joinButtonBg: '#FFFFFF',
  joinButtonBorder: '#D0D5DD',
  joinButtonText: '#000000',
  joinButtonIcon: '#000000',
  bottomTaglineTitle: '#000000',
  bottomTaglineSubtitle: '#77818C',
  setupCardBg: '#FFFFFF',
  setupCardTop: '#6B7280',
  setupCardLink: '#0073FF',
  footerText: '#808182',
  footerLink: '#0073FF',
  statusBar: 'dark-content',
  // Avatar tokens
  avatarBg: '#FFFFFF',
  avatarText: '#07305D',
  avatarBorder: '#E2E2E7',
};

export const darkThemeBase = {
  scrollBg: '#101010',
  iconButtonBg: '#1C1C1E',
  iconColor: '#FFFFFF',
  appTitle: '#FFFFFF',
  taglineBlack: '#B0B0B0',
  taglineOrange: '#F76C1D',
  taglinePurple: '#0073FF',
  taglineGray: '#707070',
  taglineBlackBold: '#B0B0B0',
  taglineBlue: '#007AFF',
  inputBg: '#1C1C1E',
  inputText: '#FFFFFF',
  inputBorder: '#3A3A3C',
  dividerLine: '#4B4B4B',
  dividerText: '#C8C8C8',
  joinButtonBg: '#1C1C1E',
  joinButtonBorder: '#3A3A3C',
  joinButtonText: '#F9FAFB',
  joinButtonIcon: '#F9FAFB',
  bottomTaglineTitle: '#979797',
  bottomTaglineSubtitle: '#77818C',
  setupCardBg: '#181818',
  setupCardTop: '#D3D1D1',
  setupCardLink: '#007AFF',
  footerText: '#808182',
  footerLink: '#007AFF',
  statusBar: 'light-content',
  // Avatar tokens
  avatarBg: '#010A13',
  avatarText: '#FFFFFF',
  avatarBorder: '#3D3D3D',
};

// ─── Context definition ───────────────────────────────────────────────────────
// Default values are typed here so IDEs can provide autocomplete even before
// the provider is mounted.
const ThemeContext = createContext({
  isDark: false,
  theme: lightThemeBase,
  toggleTheme: () => {},
  setDark: (_dark) => {},
  resetToSystem: () => {},
  followsSystem: true,
});

// ─── Provider ─────────────────────────────────────────────────────────────────
export const ThemeProvider = ({ children }) => {

  /**
   * Stores the user's explicit theme preference.
   * null       →  follow system  (default on first launch)
   * 'dark'     →  locked dark
   * 'light'    →  locked light
   *
   * isDark is COMPUTED from userOverride + useColorScheme(),
   * NOT stored directly as state. This eliminates the async race condition
   * where setState(false) from storage was firing after useState(true) from
   * Appearance, permanently locking the app to light mode.
   */
  const [userOverride, setUserOverride] = useState(null);

  // useColorScheme() stays live and updates instantly when the system theme changes.
  const systemScheme = useColorScheme(); // 'dark' | 'light' | null

  // Derived: no race conditions possible since this is computed on every render.
  const isDark =
    userOverride === 'dark' ||
    (userOverride === null && systemScheme === 'dark');

  // ── Restore persisted preference on mount ─────────────────────────────────
  // Only sets userOverride if the user had previously chosen dark or light.
  // If storage returns 'system' (or has no entry), userOverride stays null
  // and the app continues to follow the device system theme.
  useEffect(() => {
    getTheme().then(saved => {
      if (saved === 'dark' || saved === 'light') {
        setUserOverride(saved);
      }
      // 'system' or missing → keep null, follow device
    });
  }, []);

  /**
   * Locks the theme to dark or light.
   * @param {boolean} dark - true for dark, false for light
   */
  const setDark = useCallback((dark) => {
    const pref = dark ? 'dark' : 'light';
    setUserOverride(pref);
    saveTheme(pref);
  }, []);

  /**
   * Toggles between dark and light.
   * Reads the current scheme from Appearance directly to avoid closing
   * over a stale isDark value.
   */
  const toggleTheme = useCallback(() => {
    const currentlyDark =
      userOverride === 'dark' ||
      (userOverride === null && Appearance.getColorScheme() === 'dark');
    const pref = currentlyDark ? 'light' : 'dark';
    setUserOverride(pref);
    saveTheme(pref);
  }, [userOverride]);

  /**
   * Removes any manual override so the app follows the system theme again.
   */
  const resetToSystem = useCallback(() => {
    setUserOverride(null);
    saveTheme('system');
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        // Expose the full colour palette for the current mode.
        theme: isDark ? darkThemeBase : lightThemeBase,
        toggleTheme,
        setDark,
        resetToSystem,
        // True only when no manual override is set.
        followsSystem: userOverride === null,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
/**
 * Convenience hook — returns the full theme context.
 * Use this in any component that needs to read or change the theme.
 */
export function useTheme() {
  return useContext(ThemeContext);
}