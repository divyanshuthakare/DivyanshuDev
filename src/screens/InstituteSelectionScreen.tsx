/**
 * InstituteSelectionScreen.tsx
 *
 * Displays the list of institutes the logged-in user belongs to
 * and lets them select one to proceed.
 *
 * Flow:
 * - On mount, fetches the user's institutes from the API.
 * - If an institute has only one role, context is selected automatically
 *   and the user is sent straight to the Dashboard.
 * - If it has multiple roles, the user is sent to RoleSelectionScreen
 *   to choose the appropriate role.
 * - If it has no roles, an inline error is shown.
 *
 * Features:
 * - Search bar (shown only when there are more than 5 institutes).
 * - Inline search highlighting via the HighlightText helper.
 * - Loading, error, and empty states.
 * - Tablet-responsive layout with a centred max-width container.
 */

import React, { useCallback, useEffect, useMemo, useState, memo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ListRenderItemInfo,
  StatusBar,
  StyleProp,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import AppSafeArea from '../components/AppSafeArea';
import { useNavigation } from '@react-navigation/native';

import {
  SearchIcon,
  MapPinIcon,
  AlertCircleIcon,
  ChevronRightIcon,
} from '../components/SvgIcons';

import { fetchMyInstitutes, selectContext, Institute } from '../services/api';
import { saveContextData, getUser, saveLastScreen } from '../utils/storage';
import { useLogout } from '../hooks/useLogout';
import { openSupportEmail } from '../utils/openSupportEmail';
import styles from '../styles/InstituteSelection.styles';

// Theme tokens
import { useThemeTokens } from '../theme';
import { baseColors } from '../theme/colors';

// ─── Highlight colours ────────────────────────────────────────────────────────
// Pre-resolved from baseColors so they don't get re-read on every render.
const HL_LIGHT_COLOR = baseColors.hlLight;
const HL_DARK_COLOR  = baseColors.hlDark;
const HL_LIGHT_BG    = baseColors.hlLightBg;
const HL_DARK_BG     = baseColors.hlDarkBg;

// ─── buildSegments ────────────────────────────────────────────────────────────

interface Segment {
  value: string;
  match: boolean;
}

/**
 * Splits `text` into an array of segments, each marked with whether it
 * matches the search `query`. Used by HighlightText to apply a background
 * tint to the matching portion of an institute name.
 */
function buildSegments(text: string, query: string): Segment[] {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return [{ value: text, match: false }];

  const result: Segment[] = [];
  const lowerText  = text.toLowerCase();
  const lowerQuery = trimmedQuery.toLowerCase();
  const qLen = lowerQuery.length;
  let cursor = 0;

  while (cursor < text.length) {
    const idx = lowerText.indexOf(lowerQuery, cursor);
    if (idx === -1) {
      // No more matches — push the remaining text as a non-match
      result.push({ value: text.slice(cursor), match: false });
      break;
    }
    // Push the non-matching text before this match
    if (idx > cursor) result.push({ value: text.slice(cursor, idx), match: false });
    // Push the matching segment
    result.push({ value: text.slice(idx, idx + qLen), match: true });
    cursor = idx + qLen;
  }
  return result;
}

// ─── HighlightText ────────────────────────────────────────────────────────────

interface HighlightTextProps {
  text: string;
  query: string;
  isDark: boolean;
  textStyle: StyleProp<TextStyle>;
}

/**
 * Renders a line of text with query-matching segments highlighted in a
 * contrasting colour and background tint. Falls back to a plain <Text>
 * when there is no active search query.
 */
function HighlightText({ text, query, isDark, textStyle }: HighlightTextProps): React.ReactElement {
  // Memoised so segments are only recalculated when text or query changes.
  const segments = useMemo(() => buildSegments(text, query), [text, query]);
  const hlColor  = isDark ? HL_DARK_COLOR : HL_LIGHT_COLOR;
  const hlBg     = isDark ? HL_DARK_BG    : HL_LIGHT_BG;

  // No query — render without any highlight markup for performance
  if (!query.trim()) {
    return <Text style={textStyle} numberOfLines={1}>{text}</Text>;
  }

  return (
    <Text style={textStyle} numberOfLines={1}>
      {segments.map((seg: Segment, i: number) =>
        seg.match
          ? <Text key={i} style={{ color: hlColor, backgroundColor: hlBg }}>{seg.value}</Text>
          : <Text key={i}>{seg.value}</Text>
      )}
    </Text>
  );
}

// ─── InstituteCard ────────────────────────────────────────────────────────────
// Fallback avatar shown when the institute has no image or the image fails to load
const FALLBACK_IMG = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

interface InstituteCardProps {
  institute: Institute;
  onPress: () => void;
  isLoading: boolean;
  cardBg: string;
  cardBorder: string;
  nameTxt: string;
  subTxt: string;
  arrowBg: string;
  isDark: boolean;
  searchQuery: string;
  isTablet: boolean;
  locationText: string;
  instituteType: string;
}

/**
 * Memoised list card for a single institute.
 * Memo prevents re-renders of unchanged cards when the search query changes.
 */
const InstituteCard = memo(function InstituteCard({
  institute, onPress, isLoading,
  cardBg, cardBorder, nameTxt, subTxt, arrowBg,
  isDark, searchQuery, isTablet, locationText, instituteType,
}: InstituteCardProps): React.ReactElement {
  // Track image load errors so we can show the fallback
  const [imgError, setImgError] = useState<boolean>(false);

  const imgUri =
    !imgError && institute.image_url?.startsWith('http')
      ? institute.image_url
      : FALLBACK_IMG;

  // Read the arrow icon colour from the theme context inside the card
  const { c } = useThemeTokens();
  const arrowColor = c.instArrowIcon;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: cardBg, borderColor: cardBorder },
        isTablet && styles.cardTablet,
      ]}
      onPress={onPress}
      activeOpacity={0.75}
      // Disable all cards while one context selection request is in flight
      disabled={isLoading}
    >
      {/* Institute logo — falls back to generic avatar on error */}
      <Image
        source={{ uri: imgUri }}
        style={[styles.cardLogo, isTablet && styles.cardLogoTablet]}
        onError={() => setImgError(true)}
      />

      {/* Name and location */}
      <View style={styles.cardInfo}>
        <HighlightText
          text={institute.institute_name}
          query={searchQuery}
          isDark={isDark}
          textStyle={[
            styles.cardName,
            { color: nameTxt },
            isTablet && styles.cardNameTablet,
          ]}
        />
        <View style={styles.cardLocationRow}>
          <MapPinIcon
            size={isTablet ? 13 : 11}
            color={subTxt}
            style={{ marginRight: 3 }}
          />
          <Text
            style={[
              styles.cardLocation,
              { color: locationText },
              isTablet && styles.cardLocationTablet,
            ]}
            numberOfLines={1}
          >
            {institute.institute_location || 'Location not available'}
          </Text>
        </View>
      </View>

      {/* Type label + arrow / loading indicator */}
      <View style={styles.cardRight}>
        <Text
          style={[
            styles.cardType,
            { color: instituteType },
            isTablet && styles.cardTypeTablet,
          ]}
          numberOfLines={1}
        >
          {/* Replace underscores in the type string for cleaner display */}
          {(institute.institute_type || 'Type').replace('_', ' ')}
        </Text>
        <View style={[
          styles.arrowBtn,
          { backgroundColor: arrowBg },
          isTablet && styles.arrowBtnTablet,
        ]}>
          {isLoading
            ? <ActivityIndicator size="small" color={arrowColor} />
            : <ChevronRightIcon size={isTablet ? 20 : 16} color={arrowColor} />
          }
        </View>
      </View>
    </TouchableOpacity>
  );
});

// ─── InstituteSelectionScreen ─────────────────────────────────────────────────
export default function InstituteSelectionScreen(): React.ReactElement {
  const navigation               = useNavigation();
  const { isDark, theme, c, base } = useThemeTokens();
  const logout                   = useLogout();

  const { width } = useWindowDimensions();
  const isTablet  = width >= 768;

  // User display info
  const [firstName,    setFirstName]    = useState<string>('User');
  const [userInitials, setUserInitials] = useState<string>('U');

  // Institute list state
  const [institutes,   setInstitutes]   = useState<Institute[]>([]);
  const [loading,      setLoading]      = useState<boolean>(true);
  const [error,        setError]        = useState<string | null>(null);

  // Search state
  const [searchQuery,  setSearchQuery]  = useState<string>('');

  // Tracks which institute card is currently processing a context selection
  const [selectingId,  setSelectingId]  = useState<string | number | null>(null);

  // Persist this screen as the last visited screen
  useEffect(() => {
    saveLastScreen('InstituteSelection');
  }, []);

  // Load the user's display name and derive initials for the avatar
  useEffect(() => {
    getUser().then(user => {
      if (user?.full_name) {
        setFirstName(user.full_name.split(' ')[0]);
        const parts    = user.full_name.trim().split(' ');
        const initials = parts.length >= 2
          ? parts[0][0] + parts[1][0]
          : parts[0].slice(0, 2);
        setUserInitials(initials.toUpperCase());
      }
    });
  }, []);

  /**
   * Fetches the institute list from the API.
   * Returns a cancellation function so in-flight requests are ignored
   * if the component unmounts before they complete (avoids setState on
   * an unmounted component).
   */
  const loadInstitutes = useCallback((): () => void => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchMyInstitutes()
      .then((data: Institute[]) => { if (!cancelled) setInstitutes(data); })
      .catch((err: Error)       => { if (!cancelled) setError(err?.message || 'Failed to load institutes'); })
      .finally(()               => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const cancel = loadInstitutes();
    return cancel;
  }, [loadInstitutes]);

  // Only show the search bar when there are enough institutes to warrant it
  const searchEnabled = useMemo(() => institutes.length > 5, [institutes.length]);

  // Filter the list in memory — no extra API calls needed for search
  const visibleInstitutes = useMemo((): Institute[] => {
    if (!searchEnabled || !searchQuery.trim()) return institutes;
    const q = searchQuery.toLowerCase();
    return institutes.filter((i: Institute) => i.institute_name.toLowerCase().includes(q));
  }, [institutes, searchEnabled, searchQuery]);

  /**
   * Handles tapping an institute card.
   * - Single role: selects context directly and navigates to Dashboard.
   * - Multiple roles: navigates to RoleSelectionScreen.
   * - No roles: shows an error.
   */
  const handleSelect = useCallback(async (institute: Institute): Promise<void> => {
    const roles = institute.roles || [];

    if (roles.length === 0) {
      setError('No roles assigned to this institute.');
      return;
    }

    // Skip the role screen if there is only one role
    if (roles.length > 1) {
      (navigation as any).navigate('RoleSelection', { institute });
      return;
    }

    const role = roles[0];
    try {
      setSelectingId(institute.institute_id);
      const data = await selectContext(
        institute.tenant_id,
        institute.institute_id,
        role.role_id,
      );
      await saveContextData(data.access_token, institute, role);
      // Reset the stack so the user can't navigate back to this screen
      navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] } as never);
    } catch (err) {
      setError((err as Error)?.message || 'Context selection failed');
    } finally {
      setSelectingId(null);
    }
  }, [navigation]);

  // ── Colour tokens — all sourced from theme, no hardcoded values ────────────
  const pageBg       = c.pageBg;
  const cardBg       = c.cardBg;
  const cardBorder   = c.cardBorder;
  const nameTxt      = c.textPrimary;
  const subTxt       = c.textSecondary;
  // Use slightly different input colours in dark mode for better contrast
  const inputBg      = isDark ? c.inputBgAlt  : c.inputBg;
  const inputBdr     = isDark ? c.inputBdrAlt : c.inputBorder;
  const arrowBg      = c.arrowBg;
  const locationText = c.locationText;
  const instituteType = c.instituteType;

  return (
    <AppSafeArea style={[styles.safe, { backgroundColor: pageBg }]}>
      <StatusBar
        barStyle={c.statusBar}
        backgroundColor={pageBg}
      />

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <View style={[
        styles.header,
        { backgroundColor: pageBg },
        isTablet && styles.headerTablet,
      ]}>
        <View style={styles.headerLeft}>
          <Image
            source={
              isDark
                ? require('../assets/images/logo-dark.png')
                : require('../assets/images/logo.png')
            }
            style={[styles.headerLogo, isTablet && styles.headerLogoTablet]}
            resizeMode="contain"
          />
          <Text style={[
            styles.headerTitle,
            { color: nameTxt },
            isTablet && styles.headerTitleTablet,
          ]}>
            Mentrix<Text style={{ color: base.blue }}>OS</Text>
          </Text>
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

      {/* ── Body: loading / error / list ───────────────────────────────── */}
      {loading ? (
        // Loading state — centred spinner with label
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={base.blue} />
          <Text style={[styles.loadingText, { color: subTxt }]}>
            Loading institutes…
          </Text>
        </View>
      ) : error ? (
        // Error state — icon, message, and Retry button
        <View style={styles.centered}>
          <AlertCircleIcon size={40} color={base.red} />
          <Text style={[styles.errorText, { color: nameTxt }]}>{error}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            activeOpacity={0.8}
            onPress={loadInstitutes}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Success state — scrollable institute list
        <FlatList<Institute>
          data={visibleInstitutes}
          keyExtractor={(item: Institute) => String(item.institute_id)}
          contentContainerStyle={[
            styles.listContent,
            isTablet && styles.listContentTablet,
            { flexGrow: 1 },
          ]}
          showsVerticalScrollIndicator={false}
          // Ensure taps on search input are not swallowed by the scroll gesture
          keyboardShouldPersistTaps="always"

          // ── Greeting + optional search bar ─────────────────────────
          ListHeaderComponent={
            <View style={isTablet ? styles.tabletContainer : undefined}>
              <View style={styles.greetingBlock}>
                <View style={styles.greetingRow}>
                  <Text style={[
                    styles.greetingTitle,
                    { color: nameTxt },
                    isTablet && styles.greetingTitleTablet,
                  ]}>
                    Hi, {firstName}!
                  </Text>
                  <Image
                    source={require('../assets/images/hand.png')}
                    style={styles.handIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={[
                  styles.greetingSubtitle,
                  { color: subTxt },
                  isTablet && styles.greetingSubtitleTablet,
                ]}>
                  Select your institute to access your personalized{'\n'}dashboard
                </Text>
              </View>

              {/* Search bar — only rendered when there are more than 5 institutes */}
              {searchEnabled && (
                <View style={[
                  styles.searchWrap,
                  { backgroundColor: inputBg, borderColor: inputBdr },
                  isTablet && styles.searchWrapTablet,
                ]}>
                  <SearchIcon size={20} color={subTxt} style={{ marginRight: 10 }} />
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search your institute..."
                    placeholderTextColor={subTxt}
                    style={[
                      styles.searchInput,
                      { color: nameTxt },
                      isTablet && styles.searchInputTablet,
                    ]}
                    returnKeyType="search"
                    clearButtonMode="while-editing"
                    underlineColorAndroid="transparent"
                  />
                </View>
              )}
            </View>
          }

          // ── Empty state ─────────────────────────────────────────────
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: subTxt }]}>
              No institutes found. Try a different search.
            </Text>
          }

          // ── Footer help text with support email link ────────────────
          ListFooterComponent={
            <View style={[isTablet ? styles.tabletContainer : undefined, styles.footerWrapper]}>
              <Text style={[
                styles.footerHint,
                { color: subTxt },
                isTablet && styles.footerHintTablet,
              ]}>
                Can't find your Institute? Contact your institute administrator{'\n'}
                or email us at{' '}
                <Text
                  style={{ color: base.blue }}
                  onPress={openSupportEmail}
                >
                  support@schoolcoreos.com
                </Text>
              </Text>
            </View>
          }

          // ── Each institute card ─────────────────────────────────────
          renderItem={({ item }: ListRenderItemInfo<Institute>) => (
            // Wrap in the tablet centred container when on a wide screen
            <View style={isTablet ? styles.tabletContainer : undefined}>
              <InstituteCard
                institute={item}
                onPress={() => handleSelect(item)}
                // Only the card that triggered the request shows a spinner
                isLoading={selectingId === item.institute_id}
                cardBg={cardBg}
                cardBorder={cardBorder}
                nameTxt={nameTxt}
                subTxt={subTxt}
                arrowBg={arrowBg}
                isDark={isDark}
                searchQuery={searchQuery}
                isTablet={isTablet}
                locationText={locationText}
                instituteType={instituteType}
              />
            </View>
          )}
        />
      )}
    </AppSafeArea>
  );
}