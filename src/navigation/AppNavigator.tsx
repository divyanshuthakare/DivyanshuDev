/**
 * AppNavigator.tsx
 *
 * Defines the main navigation stack for the app.
 * All screens are registered here, and the initial route is determined
 * by reading the last active screen from persistent storage — this lets
 * the app resume where the user left off after a restart.
 *
 * Headers are hidden globally; each screen manages its own header UI.
 * Transitions use a slide-from-right animation by default.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen               from '../screens/HomeScreen';
import InstituteSelectionScreen from '../screens/InstituteSelectionScreen';
import RoleSelectionScreen      from '../screens/RoleSelectionScreen';
import DashboardScreen          from '../screens/DashboardScreen';

import { getInitialRouteSync } from '../utils/storage';
import { Institute } from '../services/api';

// ─── Navigation param types ───────────────────────────────────────────────────
export type RootStackParamList = {
  Home: undefined;
  InstituteSelection: { identifier: string };
  RoleSelection: { institute: Institute };
  Dashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator(): React.ReactElement {
  // Read the last visited screen synchronously so the navigator can start
  // on the correct screen without a flicker or an extra redirect.
  const initialRoute = getInitialRouteSync() as keyof RootStackParamList;

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      // Hide the default header on every screen — each screen renders its own.
      // Slide animation gives the stack a consistent left-to-right feel.
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="Home"               component={HomeScreen} />
      <Stack.Screen name="InstituteSelection" component={InstituteSelectionScreen} />
      <Stack.Screen name="RoleSelection"      component={RoleSelectionScreen} />
      <Stack.Screen name="Dashboard"          component={DashboardScreen} />
    </Stack.Navigator>
  );
}