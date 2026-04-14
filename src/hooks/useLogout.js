/**
 * useLogout.js
 *
 * Custom hook that encapsulates the logout flow.
 * Shows a confirmation alert and, on confirmation:
 *   1. Clears all auth-related data from MMKV storage (token, session, etc.)
 *   2. Resets the navigation stack to the Home screen so the user
 *      cannot swipe back to a protected screen after logging out.
 *
 * Returns a single `logout` function that can be bound to any button.
 *
 * Usage:
 *   const logout = useLogout();
 *   <Button onPress={logout} title="Logout" />
 */

import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { clearAuthData } from '../utils/storage';

export function useLogout() {
  const navigation = useNavigation();

  /**
   * Presents a confirmation alert.
   * If the user confirms, clears auth data and resets the nav stack to Home.
   * Wrapped in useCallback so the reference stays stable between renders,
   * avoiding unnecessary re-renders in components that receive it as a prop.
   */
  const logout = useCallback(() => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        // Cancel — dismisses the alert with no side effects
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            // Wipe all MMKV keys: token, isLoggedIn, lastScreen, etc.
            await clearAuthData();

            // Reset the navigation stack to Home.
            // Using CommonActions.reset ensures there are no screens left
            // in the history that the user could navigate back to.
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              }),
            );
          },
        },
      ],
    );
  }, [navigation]);

  return logout;
}