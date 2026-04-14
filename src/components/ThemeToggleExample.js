/**
 * ThemeToggleExample.js
 *
 * Drop-in UI component that gives the user manual theme controls.
 * Intended as a reference implementation — drop it into any screen to
 * expose dark/light mode switching and a "Follow System" reset option.
 *
 * Shows:
 *   - Manual dark / light pill toggle
 *   - "Follow System" reset button with an active indicator
 *   - How to read followsSystem to visually mark the active state
 *
 * Usage:
 *   import ThemeToggleExample from '../components/ThemeToggleExample';
 *   <ThemeToggleExample />
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useThemeTokens } from '../theme';

export default function ThemeToggleExample() {
  // Pull theme state and control functions from the theme hook.
  // isDark      — current dark mode flag
  // toggleTheme — flips between dark and light
  // resetToSystem — removes manual override, follows device setting
  // followsSystem — true when no manual override is active
  // c, base     — semantic colour tokens
  const { isDark, toggleTheme, resetToSystem, followsSystem, c, base } =
    useThemeTokens();

  return (
    <View style={[styles.card, { backgroundColor: c.cardBg, borderColor: c.cardBorder }]}>

      {/* ── Section label ─────────────────────────────────────────────────── */}
      <Text style={[styles.label, { color: c.textSecondary }]}>Appearance</Text>

      {/* ── Dark / Light pill toggle ──────────────────────────────────────── */}
      {/* The active pill gets the brand blue background; the inactive one is transparent. */}
      <View style={[styles.pillWrap, { backgroundColor: c.inputBg, borderColor: c.inputBorder }]}>

        {/* Light pill — highlighted when the theme is light */}
        <TouchableOpacity
          style={[
            styles.pill,
            !isDark && { backgroundColor: base.blue },
          ]}
          onPress={() => {
            // Only toggle if currently in dark mode to avoid redundant writes.
            if (isDark) toggleTheme();
          }}
          activeOpacity={0.8}
        >
          <Text style={[styles.pillText, { color: !isDark ? '#fff' : c.textSecondary }]}>
            ☀️  Light
          </Text>
        </TouchableOpacity>

        {/* Dark pill — highlighted when the theme is dark */}
        <TouchableOpacity
          style={[
            styles.pill,
            isDark && { backgroundColor: base.blue },
          ]}
          onPress={() => {
            // Only toggle if currently in light mode to avoid redundant writes.
            if (!isDark) toggleTheme();
          }}
          activeOpacity={0.8}
        >
          <Text style={[styles.pillText, { color: isDark ? '#fff' : c.textSecondary }]}>
            🌙  Dark
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Follow System button ──────────────────────────────────────────── */}
      {/* Background and border tint to blue when following the system. */}
      <TouchableOpacity
        style={[
          styles.systemRow,
          {
            backgroundColor: followsSystem ? 'rgba(0,115,255,0.10)' : c.pillBg,
            borderColor:     followsSystem ? base.blue : c.pillBorder,
          },
        ]}
        onPress={resetToSystem}
        activeOpacity={0.75}
      >
        {/* Dot indicator — blue when active, muted when inactive */}
        <View style={[styles.dot, { backgroundColor: followsSystem ? base.blue : c.textTertiary }]} />
        <Text style={[styles.systemText, { color: followsSystem ? base.blue : c.textSecondary }]}>
          {followsSystem ? 'Following system theme' : 'Use system theme'}
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  // Elevated card container for the controls
  card: {
    borderRadius:      14,
    padding:           18,
    borderWidth:       1,
    gap:               12,
    shadowColor:       '#000',
    shadowOffset:      { width: 0, height: 2 },
    shadowOpacity:     0.07,
    shadowRadius:      8,
    elevation:         3,
  },
  label: {
    fontSize:   12,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  // Outer track for the two-pill toggle
  pillWrap: {
    flexDirection: 'row',
    borderRadius:   10,
    borderWidth:    1,
    padding:        3,
    gap:            3,
  },
  // Individual pill inside the toggle
  pill: {
    flex:           1,
    paddingVertical: Platform.OS === 'ios' ? 9 : 7,
    borderRadius:   8,
    alignItems:    'center',
    justifyContent:'center',
  },
  pillText: {
    fontSize:   14,
    fontWeight: '600',
  },
  // "Follow system" row with leading dot indicator
  systemRow: {
    flexDirection:    'row',
    alignItems:      'center',
    gap:              8,
    paddingHorizontal: 14,
    paddingVertical:   10,
    borderRadius:     10,
    borderWidth:      1,
  },
  dot: {
    width:        7,
    height:       7,
    borderRadius: 4,
  },
  systemText: {
    fontSize:   13.5,
    fontWeight: '500',
  },
});