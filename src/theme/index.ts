/**
 * index.ts  (theme/index.ts)
 *
 * Main entry point for the theme system.
 * Re-exports all raw color palettes, spacing, and typography tokens so
 * consumers only need a single import path.
 * Also provides the useThemeTokens() hook, which is the recommended way
 * for screens and components to access the current theme.
 */

export {
  default as colors,
  lightColors,
  darkColors,
  inverseColors,
  baseColors,
} from './colors';
export type { BaseColors, ModeColors, InverseColors } from './colors';

export { default as spacing } from './spacing';
export type { Spacing } from './spacing';

export { default as typography } from './typography';
export type { Typography } from './typography';

import { lightColors, darkColors, baseColors } from './colors';
import type { ModeColors, BaseColors } from './colors';
import type { ThemeBase } from '../contexts/ThemeContext';

// ─── Return type for useThemeTokens ──────────────────────────────────────────
export interface ThemeTokens {
  isDark:        boolean;
  theme:         ThemeBase;
  toggleTheme:   () => void;
  setDark:       (dark: boolean) => void;
  resetToSystem: () => void;
  followsSystem: boolean;
  c:             ModeColors;
  inv:           ModeColors;
  base:          BaseColors;
}

// ThemeContext is loaded lazily to avoid a circular dependency.
// (ThemeContext itself imports from this file, so requiring it at module
// load time would create a cycle.)
let _useThemeContext: (() => ReturnType<typeof import('../contexts/ThemeContext').useTheme>) | null = null;

function getUseTheme(): () => ReturnType<typeof import('../contexts/ThemeContext').useTheme> {
  if (!_useThemeContext) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    _useThemeContext = require('../contexts/ThemeContext').useTheme;
  }
  return _useThemeContext!;
}

/**
 * useThemeTokens()
 *
 * The single hook screens should use to access theme values.
 * Wraps ThemeContext and derives the correct color palette for the
 * current mode so individual components don't need to branch on isDark.
 *
 * Returned values:
 *   isDark        - true when dark mode is active
 *   theme         - legacy token object (avatarBg, avatarText, avatarBorder, …)
 *                   kept for backward compatibility with older screens
 *   toggleTheme   - flips between dark and light; persisted across restarts
 *   setDark       - setDark(true | false) for explicit mode override
 *   resetToSystem - removes any manual override and follows the device setting
 *   followsSystem - true when no user override is active
 *   c             - full color palette for the active mode (use this most often)
 *   inv           - inverse palette; useful for overlay text or reversed elements
 *   base          - mode-independent raw values (brand blues, reds, stat colors…)
 */
export function useThemeTokens(): ThemeTokens {
  const useTheme = getUseTheme();

  // Pull everything from ThemeContext
  const { isDark, theme, toggleTheme, setDark, resetToSystem, followsSystem } =
    useTheme();

  // Resolve the active and inverse palettes based on the current mode
  const c:   ModeColors = isDark ? darkColors  : lightColors;
  const inv: ModeColors = isDark ? lightColors : darkColors;

  return {
    isDark,
    theme,          // legacy ThemeBase tokens
    toggleTheme,
    setDark,
    resetToSystem,
    followsSystem,
    c,              // current-mode color palette
    inv,            // inverse palette
    base: baseColors,
  };
}