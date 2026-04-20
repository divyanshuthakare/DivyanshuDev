/**
 * openSupportEmail.ts
 *
 * Utility for opening the device's default mail app with the support address
 * pre-filled. Falls back to an Alert with the email address if no mail app
 * is installed or the mailto link cannot be opened.
 */

import { Linking, Alert } from 'react-native';

// The support email address used across the app.
// Defined as a named export so other screens can display it without
// duplicating the string (e.g., in a "contact us" label).
export const SUPPORT_EMAIL: string = 'support@schoolcoreos.com';

/**
 * openSupportEmail()
 *
 * Attempts to open the device mail client with the support address.
 * Shows an Alert with the raw email address if:
 *   - The device has no mail app configured (canOpenURL returns false), or
 *   - Opening the URL throws an unexpected error.
 */
export async function openSupportEmail(): Promise<void> {
  const url = `mailto:${SUPPORT_EMAIL}`;

  try {
    // Check whether the device can handle a mailto link before trying to open it.
    // On iOS this requires NSAppTransportSecurity entries; on Android it depends
    // on whether a mail app is installed.
    const supported = await Linking.canOpenURL(url);

    if (!supported) {
      // No mail client available — show the address so the user can copy it manually.
      Alert.alert(
        'No Mail App Found',
        `Please email us directly at ${SUPPORT_EMAIL}`,
        [{ text: 'OK' }],
      );
      return;
    }

    // Open the default mail app with the support address pre-filled.
    await Linking.openURL(url);
  } catch (error) {
    // Catch any unexpected errors from canOpenURL or openURL and surface
    // a user-friendly message rather than letting the error propagate silently.
    Alert.alert(
      'Unable to Open Mail',
      `Please email us directly at ${SUPPORT_EMAIL}`,
      [{ text: 'OK' }],
    );
  }
}