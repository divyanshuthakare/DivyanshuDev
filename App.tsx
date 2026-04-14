/**
 * App.tsx
 *
 * Root component of the application.
 * Sets up the navigation container, theme provider, and safe area context.
 * Also tracks the currently active screen and persists it to storage
 * so the app can resume on the correct screen after a restart.
 */

import React, { useRef } from 'react';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { saveLastScreenSync } from './src/utils/storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/contexts/ThemeContext';

export default function App() {
  // Ref to the navigation container — used to read the current route name
  const navigationRef = useRef<NavigationContainerRef<any>>(null);

  /**
   * Called every time the navigation state changes.
   * Reads the active route name and saves it synchronously so we can
   * restore the user's last screen on the next app launch.
   */
  function handleStateChange() {
    if (!navigationRef.current) return;

    const currentRoute =
      navigationRef.current.getCurrentRoute()?.name;

    if (currentRoute) {
      saveLastScreenSync(currentRoute);
    }
  }

  return (
    // SafeAreaProvider ensures insets (notch, home indicator) are available
    // to all child components via useSafeAreaInsets.
    <SafeAreaProvider>
      {/* ThemeProvider makes dark/light theme state available app-wide */}
      <ThemeProvider>
        <NavigationContainer
          ref={navigationRef}
          onStateChange={handleStateChange}
        >
          {/* AppNavigator defines the screen stack and initial route */}
          <AppNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}