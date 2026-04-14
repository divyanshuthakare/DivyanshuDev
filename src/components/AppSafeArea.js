/**
 * AppSafeArea.js
 *
 * Thin wrapper around SafeAreaView from react-native-safe-area-context.
 * Every screen should use this instead of the built-in SafeAreaView so
 * that safe area insets (notch, status bar, home indicator) are handled
 * consistently across the app.
 *
 * Accepts the same props as SafeAreaView — style, children, and any other
 * SafeAreaView props — and merges them with the base flex:1 style.
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AppSafeArea({ style, children, ...rest }) {
  return (
    // Merge the base style (flex: 1) with any style passed by the parent screen.
    <SafeAreaView style={[styles.base, style]} {...rest}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Makes the safe area fill its parent container by default.
  base: {
    flex: 1,
  },
});