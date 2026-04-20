/**
 * DashboardScreen.tsx
 *
 * Main dashboard shown after a user selects their institute and role.
 * Displays a personalised welcome heading and a 2-column grid of
 * stat cards summarising platform-wide activity.
 *
 * Features:
 * - Reads the authenticated user's name from storage and derives initials
 *   for the avatar.
 * - Sticky header with hamburger menu, logo, and avatar.
 * - Tapping the avatar opens the logout confirmation flow.
 * - Stat card background colours are fixed (from baseColors) in light mode
 *   and unified (from theme token) in dark mode.
 * - Fully responsive — adjusts sizes and spacing for tablet layouts.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  ImageStyle,
  useWindowDimensions,
} from 'react-native';
import AppSafeArea from '../components/AppSafeArea';
import { useNavigation } from '@react-navigation/native';

import { getUser, saveLastScreen } from '../utils/storage';
import { MenuIcon } from '../components/SvgIcons';
import { useLogout } from '../hooks/useLogout';
import styles from '../styles/DashboardScreen.styles';

// Theme tokens
import { useThemeTokens } from '../theme';
import { baseColors } from '../theme/colors';
import spacing from '../theme/spacing';

// ─── Stat card data ───────────────────────────────────────────────────────────

interface StatItem {
  id: number;
  count: string;
  label: string;
  description: string;
  bg: string;
  countColor: string;
}

// Static seed data for the overview cards. Each card has its own background
// and count colour defined in baseColors so they stay visually distinct.
const STATS: StatItem[] = [
  {
    id: 1,
    count: '08',
    label: 'Active Institutes',
    description: 'Institutes actively operating and using the platform.',
    bg: baseColors.statBg1,
    countColor: baseColors.statCount1,
  },
  {
    id: 2,
    count: '05',
    label: 'Inactive Institutes',
    description: 'Institutes currently inactive in system.',
    bg: baseColors.statBg2,
    countColor: baseColors.statCount2,
  },
  {
    id: 3,
    count: '15+',
    label: 'Total Modules',
    description: 'Features enabling workflows.',
    bg: baseColors.statBg3,
    countColor: baseColors.statCount3,
  },
  {
    id: 4,
    count: '50+',
    label: 'Total Users',
    description: 'Registered users across institutes.',
    bg: baseColors.statBg4,
    countColor: baseColors.statCount4,
  },
];

// ─── DashboardScreen ──────────────────────────────────────────────────────────
export default function DashboardScreen(): React.ReactElement {
  const navigation = useNavigation();
  const { isDark, theme, c, base } = useThemeTokens();
  const logout = useLogout();

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const [userName, setUserName] = useState<string>('User');
  const [userInitials, setUserInitials] = useState<string>('U');

  // Persist this as the last active screen for resume-on-launch
  useEffect(() => {
    saveLastScreen('Dashboard');
  }, []);

  // Load the authenticated user's display name and derive avatar initials
  useEffect(() => {
    (async (): Promise<void> => {
      const user = await getUser();
      if (user?.full_name) {
        setUserName(user.full_name);
        const parts = user.full_name.trim().split(' ');
        // Use first letters of first and last name, or first two chars for single names
        const initials = parts.length >= 2
          ? parts[0][0] + parts[1][0]
          : parts[0].slice(0, 2);
        setUserInitials(initials.toUpperCase());
      }
    })();
  }, []);

  // ── Colour tokens ────────────────────────────────────────────────────────
  // In dark mode the header uses the raised inputBg surface; in light mode
  // the slightly elevated cardBg to distinguish it from the page background.
  const pageBg = c.pageBg;
  const headerBg = isDark ? c.inputBg : c.cardBg;
  // Shadow is transparent in dark mode since elevated surfaces are handled
  // by background colour contrast, not shadow.
  const shadowClr = isDark ? base.transparent : base.shadowDark;
  const titleClr = c.welcomeTitle;
  const subClr = c.welcomeSub;

  return (
    <AppSafeArea style={[styles.safe, { backgroundColor: pageBg }]}>
      <StatusBar
        barStyle={c.statusBar}
        backgroundColor={headerBg}
      />

      {/* ── Sticky Header ───────────────────────────────────────────────── */}
      <View style={[
        styles.header,
        { backgroundColor: headerBg, shadowColor: shadowClr },
        isTablet && styles.headerTablet,
      ]}>
        <View style={styles.headerLeft}>

          {/* Hamburger menu button — opens side/drawer menu (not yet implemented) */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => console.log('Menu pressed')}
            style={{
              width: isTablet ? spacing.sp44 : spacing.sp36,
              height: isTablet ? spacing.sp44 : spacing.sp36,
              borderRadius: isTablet ? spacing.br12 : spacing.br10,
              backgroundColor: c.iconButtonBg,
              borderWidth: spacing.bw1,
              borderColor: c.cardBorder,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: isDark ? base.transparent : base.shadowDark,
              shadowOffset: { width: spacing.sp0, height: spacing.bw1 },
              shadowOpacity: 0.08,
              shadowRadius: spacing.sp4,
              elevation: 2,
            }}
          >
            <MenuIcon
              size={isTablet ? spacing.icon20 : spacing.sp17}
              color={isDark ? base.white : c.iconColor}
            />
          </TouchableOpacity>

          {/* App logo + wordmark */}
          <View style={styles.logoRow}>

            <Image
              key={isDark ? 'dark' : 'light'}   
              source={
                isDark
                  ? require('../assets/images/logo-dark.png')
                  : require('../assets/images/logo.png')
              }
              style={[styles.logoImg, isTablet && styles.logoImgTablet] as ImageStyle[]}
              resizeMode="contain"
            />

            <Text style={[
              styles.logoText,
              { color: titleClr },
              isTablet && styles.logoTextTablet,
            ]}>
              Mentrix<Text style={{ color: base.blue }}>OS</Text>
            </Text>
          </View>
        </View>

        {/* Avatar — tapping triggers the logout confirmation */}
        <TouchableOpacity
          style={[
            styles.avatar,
            { backgroundColor: theme.avatarBg, borderColor: theme.avatarBorder },
            isTablet && styles.avatarTablet,
          ]}
          activeOpacity={0.75}
          onPress={logout}
        >
          <Text style={[
            styles.avatarText,
            { color: theme.avatarText },
            isTablet && styles.avatarTextTablet,
          ]}>
            {userInitials}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Scrollable Content ───────────────────────────────────────────── */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isTablet && styles.scrollContentTablet,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Personalised welcome heading */}
        <Text style={[
          styles.welcomeTitle,
          { color: titleClr },
          isTablet && styles.welcomeTitleTablet,
        ]}>
          Welcome to MentrixOS{'\n'}
          {/* User name rendered in brand blue */}
          <Text style={{ color: base.blue }}>{userName}</Text>
        </Text>

        {/* ── Stats grid — 2 columns ──────────────────────────────────── */}
        <View style={[styles.statsGrid, isTablet && styles.statsGridTablet]}>
          {STATS.map((stat: StatItem) => (
            <View
              key={stat.id}
              style={[
                styles.statCard,
                {
                  // In dark mode all cards share a single muted surface colour;
                  // in light mode each card has its own distinct background.
                  backgroundColor: isDark ? c.statCardDarkBg : stat.bg,
                  shadowColor: isDark ? base.transparent : 'rgba(0,0,0,0.07)',
                },
                isTablet && styles.statCardTablet,
              ]}
            >
              {/* Large count number in the card's accent colour */}
              <Text style={[
                styles.statCount,
                { color: stat.countColor },
                isTablet && styles.statCountTablet,
              ]}>
                {stat.count}
              </Text>

              {/* Label */}
              <Text style={[
                styles.statLabel,
                { color: c.textPrimary },
                isTablet && styles.statLabelTablet,
              ]}>
                {stat.label}
              </Text>

              {/* Short description */}
              <Text style={[
                styles.statDesc,
                { color: subClr },
                isTablet && styles.statDescTablet,
              ]}>
                {stat.description}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </AppSafeArea>
  );
}