/**
 * index.ts
 *
 * Application entry point.
 * Registers the root App component with React Native's AppRegistry
 * so the native runtime knows which component to mount on launch.
 *
 * The nativeCallSyncHook guard prevents a crash in certain test or
 * web environments where the synchronous native bridge is not available.
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Guard against environments where the synchronous native call hook
// is not set up (e.g. running in a JS-only test harness).
// Cast via globalThis to avoid TS2304 "Cannot find name 'global'".
if ((globalThis as any).nativeCallSyncHook == null) {
  (globalThis as any).nativeCallSyncHook = () => {};
}

// Register the root component under the app name defined in app.json.
AppRegistry.registerComponent(appName, () => App);