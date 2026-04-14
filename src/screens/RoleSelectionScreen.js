/**
 * RoleSelectionScreen.js
 *
 * Displays the roles available to the user within the selected institute
 * and handles context selection when a role is tapped.
 *
 * Navigation params:
 *   route.params.institute — the institute object chosen on the previous screen
 *
 * Flow:
 * - Each role card shows the role name, a short description, and an icon.
 * - Tapping a card calls the selectContext API, saves the scoped token,
 *   and resets the navigation stack to Dashboard.
 * - If the API call fails, an inline error banner is shown.
 * - The "Change Institute" pill navigates back to InstituteSelectionScreen.
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import AppSafeArea from '../components/AppSafeArea';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  ArrowLeftIcon,
  MapPinIcon,
  AlertCircleIcon,
  ChevronRightIcon,
  ROLE_ICON_MAP,
  DefaultRoleIcon,
} from '../components/SvgIcons';

import { selectContext } from '../services/api';
import { saveContextData, getUser } from '../utils/storage';
import { useLogout } from '../hooks/useLogout';
import { openSupportEmail } from '../utils/openSupportEmail';
import styles from '../styles/RoleSelection.styles';

// Theme tokens
import { useThemeTokens } from '../theme';
import { baseColors } from '../theme/colors';

// ─── Role metadata map ────────────────────────────────────────────────────────
// Maps API role_name values to a human-readable description and an accent colour
// used for the icon and any role-specific visual treatment.
const ROLE_META = {
  'Super Admin':     { desc: 'Full platform access',          color: baseColors.roleGreen  },
  'Admin':           { desc: 'Full system access',            color: baseColors.roleGreen  },
  'Administrator':   { desc: 'Full system access',            color: baseColors.roleGreen  },
  'Institute Admin': { desc: 'Manage institute operations',   color: baseColors.roleBlue   },
  'Principal':       { desc: 'Institute oversight',           color: baseColors.roleBlue   },
  'Trainer':         { desc: 'Classes & course management',   color: baseColors.rolePurple },
  'Teacher':         { desc: 'Class & grading',               color: baseColors.rolePurple },
  'Student':         { desc: 'Academics & activities',        color: baseColors.rolePink   },
  'Parent':          { desc: 'Track child progress',          color: baseColors.roleOrange },
  'Staff':           { desc: 'Staff operations',              color: baseColors.roleAmber  },
};

/**
 * Returns the metadata (desc, color) for a role name.
 * Tries with and without leading/trailing whitespace before falling back
 * to a safe default, so minor API inconsistencies don't break the UI.
 */
function getRoleMeta(roleName) {
  return (
    ROLE_META[roleName] ||
    ROLE_META[roleName?.trim()] ||
    { desc: 'Access your dashboard', color: baseColors.roleGray }
  );
}

/**
 * Looks up the correct icon component for a role name from ROLE_ICON_MAP.
 * Falls back to DefaultRoleIcon for unrecognised or null role names.
 */
function RoleIcon({ roleName, color, size }) {
  const Icon = ROLE_ICON_MAP[roleName] || ROLE_ICON_MAP[roleName?.trim()] || DefaultRoleIcon;
  return <Icon size={size} color={color} />;
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function RoleSelectionScreen() {
  const navigation               = useNavigation();
  const { params }               = useRoute();
  const { isDark, theme, c, base } = useThemeTokens();
  const logout                   = useLogout();

  const { width } = useWindowDimensions();
  const isTablet  = width >= 768;

  // The institute chosen on the previous screen, passed via navigation params
  const institute = params.institute;

  const [userInitials, setUserInitials] = useState('U');
  // Tracks which role card is currently loading (prevents double-taps)
  const [selectingId,  setSelectingId]  = useState(null);
  const [error,        setError]        = useState(null);

  // Derive the user's initials for the avatar in the header
  useEffect(() => {
    getUser().then(user => {
      if (user?.full_name) {
        const parts    = user.full_name.trim().split(' ');
        const initials = parts.length >= 2
          ? parts[0][0] + parts[1][0]
          : parts[0].slice(0, 2);
        setUserInitials(initials.toUpperCase());
      }
    });
  }, []);

  // ── Colour tokens — no hardcoded values ───────────────────────────────────
  const pageBg        = c.pageBg;
  const instCardBg    = c.instCardBg;
  const instBorder    = c.instBorder;
  const nameTxt       = c.textPrimary;
  const subTxt        = c.textSecondary;
  const pillBg        = c.pillBg;
  const pillBorder    = c.pillBorder;
  const cardBg        = c.cardBg;
  const cardBorder    = c.cardBorder;
  const arrowBg       = c.arrowBg;
  const arrowBdr      = c.arrowBorder;
  const arrowIconColor = c.arrowIcon;

  /**
   * Called when the user taps a role card.
   * Requests a scoped access token from the API for the selected
   * institute + role combination, persists it, and navigates to Dashboard.
   */
  const handleRoleSelect = useCallback(async (role) => {
    try {
      setSelectingId(role.role_id);
      setError(null);
      const data = await selectContext(
        institute.tenant_id,
        institute.institute_id,
        role.role_id,
      );
      await saveContextData(data.access_token, institute, role);
      // Reset the stack so the user lands cleanly on Dashboard
      navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
    } catch (err) {
      setError(err?.message || 'Context selection failed');
    } finally {
      setSelectingId(null);
    }
  }, [navigation, institute]);

  // Use the institute's image or fall back to a generic avatar placeholder
  const FALLBACK = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
  const imgUri   = institute.image_url?.startsWith('http')
    ? institute.image_url
    : FALLBACK;

  // ── Scrollable content ────────────────────────────────────────────────────
  // Extracted into a variable so it can be wrapped differently on tablet
  // (centred container) vs phone (full-width).
  const content = (
    <>
      {/* ── "Change Institute" back pill ───────────────────────────────── */}
      <TouchableOpacity
        style={[
          styles.changePill,
          { backgroundColor: pillBg, borderColor: pillBorder },
          isTablet && styles.changePillTablet,
        ]}
        activeOpacity={0.75}
        onPress={() => navigation.goBack()}
      >
        <ArrowLeftIcon size={isTablet ? 20 : 16} color={nameTxt} />
        <Text style={[
          styles.changePillText,
          { color: nameTxt },
          isTablet && styles.changePillTextTablet,
        ]}>
          Change Institute
        </Text>
      </TouchableOpacity>

      {/* ── Selected institute summary card ────────────────────────────── */}
      <View style={[
        styles.instCard,
        { backgroundColor: instCardBg, borderColor: instBorder },
        isTablet && styles.instCardTablet,
      ]}>
        <Image
          source={{ uri: imgUri }}
          style={[styles.instLogo, isTablet && styles.instLogoTablet]}
          defaultSource={{ uri: FALLBACK }}
        />
        <View style={styles.instInfo}>
          <Text
            style={[
              styles.instName,
              { color: nameTxt },
              isTablet && styles.instNameTablet,
            ]}
            numberOfLines={1}
          >
            {institute.institute_name}
          </Text>
          <View style={styles.instLocRow}>
            <MapPinIcon
              size={isTablet ? 13 : 11}
              color={subTxt}
              style={{ marginRight: 3 }}
            />
            <Text
              style={[
                styles.instLoc,
                { color: subTxt },
                isTablet && styles.instLocTablet,
              ]}
              numberOfLines={1}
            >
              {institute.institute_location}
            </Text>
          </View>
        </View>

        {/* Verified badge — shown when the institute is verified */}
        <Image
          source={require('../assets/images/verified.png')}
          style={[
            styles.verifiedBadge,
            isTablet && styles.verifiedBadgeTablet,
          ]}
          resizeMode="contain"
        />
      </View>

      {/* ── Heading block ──────────────────────────────────────────────── */}
      <View style={[styles.titleBlock, isTablet && styles.titleBlockTablet]}>
        <Text style={[
          styles.title,
          { color: nameTxt },
          isTablet && styles.titleTablet,
        ]}>
          Choose Your Role
        </Text>
        <Text style={[
          styles.subtitle,
          { color: subTxt },
          isTablet && styles.subtitleTablet,
        ]}>
          {`Select how you'd like to access ${institute.institute_name}`}
        </Text>
      </View>

      {/* ── Inline error banner — only visible after a failed API call ─── */}
      {error ? (
        <View style={styles.errorBanner}>
          <AlertCircleIcon size={14} color={base.red} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* ── Role list ──────────────────────────────────────────────────── */}
      <View style={[styles.roleList, isTablet && styles.roleListTablet]}>
        {(institute.roles || []).map(role => {
          const meta    = getRoleMeta(role.role_name);
          const loading = selectingId === role.role_id;

          return (
            <TouchableOpacity
              key={String(role.role_id)}
              style={[
                styles.roleCard,
                { backgroundColor: cardBg, borderColor: cardBorder },
                isTablet && styles.roleCardTablet,
              ]}
              activeOpacity={0.75}
              onPress={() => handleRoleSelect(role)}
              // Block all cards while any one is loading
              disabled={selectingId !== null}
            >
              {/* Role icon with a coloured background tinted to the role accent */}
              <View style={[
                styles.roleIconWrap,
                isTablet && styles.roleIconWrapTablet,
              ]}>
                <RoleIcon
                  roleName={role.role_name}
                  color={meta.color}
                  size={isTablet ? 26 : 20}
                />
              </View>

              {/* Role name and short description */}
              <View style={styles.roleTextWrap}>
                <Text style={[
                  styles.roleLabel,
                  { color: nameTxt },
                  isTablet && styles.roleLabelTablet,
                ]}>
                  {role.role_name}
                </Text>
                <Text style={[
                  styles.roleDesc,
                  { color: subTxt },
                  isTablet && styles.roleDescTablet,
                ]}>
                  {meta.desc}
                </Text>
              </View>

              {/* Arrow button — shows spinner while this card is loading */}
              <View style={[
                styles.roleArrow,
                { backgroundColor: arrowBg, borderColor: arrowBdr },
                isTablet && styles.roleArrowTablet,
              ]}>
                {loading
                  ? <ActivityIndicator size="small" color={meta.color} />
                  : <ChevronRightIcon size={isTablet ? 20 : 16} color={arrowIconColor} />
                }
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Footer help text ───────────────────────────────────────────── */}
      <Text style={[
        styles.footerHint,
        { color: subTxt },
        isTablet && styles.footerHintTablet,
      ]}>
        Can't find your role? Contact your institute administrator{'\n'}
        or email us at{' '}
        <Text style={{ color: base.blue }} onPress={openSupportEmail}>
          support@schoolcoreos.com
        </Text>
      </Text>
    </>
  );

  return (
    <AppSafeArea style={[styles.safe, { backgroundColor: pageBg }]}>
      <StatusBar
        barStyle={c.statusBar}
        backgroundColor={pageBg}
      />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <View style={[
        styles.header,
        { backgroundColor: pageBg },
        isTablet && styles.headerTablet,
      ]}>
        <View style={styles.headerLeft}>
          <View style={styles.logoRow}>
            <Image
              source={
                isDark
                  ? require('../assets/images/logo-dark.png')
                  : require('../assets/images/logo.png')
              }
              style={[styles.logoImg, isTablet && styles.logoImgTablet]}
              resizeMode="contain"
            />
            <Text style={[
              styles.logoText,
              { color: c.logoText },
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

      {/* ── Scrollable body ──────────────────────────────────────────────── */}
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          isTablet && styles.scrollTablet,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/*
          On tablet, wrap content in a centred max-width container.
          On phone, render it directly inside the ScrollView.
        */}
        {isTablet ? (
          <View style={styles.centeredContent}>{content}</View>
        ) : (
          content
        )}
      </ScrollView>
    </AppSafeArea>
  );
}