/**
 * InstituteSelection.styles.js
 *
 * Stylesheet for the Institute Selection screen where users pick
 * their educational institution from a searchable list.
 *
 * Covers the header, avatar, loading/error states, searchable list,
 * individual institute cards, and the footer hint section.
 *
 * Tablet overrides follow each base style with a "Tablet" suffix
 * and are applied conditionally in the component via isTablet checks.
 */

import { StyleSheet, Platform } from 'react-native';
import spacing    from '../theme/spacing';
import typography from '../theme/typography';

// Header height differs between iOS and Android due to status bar behavior.
const HEADER_H = Platform.OS === 'ios' ? spacing.headerPhone : spacing.headerAndroid;

const styles = StyleSheet.create({

  // ── Root ──────────────────────────────────────────────────────────────────

  // Root SafeAreaView — fills the entire screen
  safe: { flex: 1 },

  // ── Header ────────────────────────────────────────────────────────────────

  // Top navigation bar. Elevation and shadow are intentionally removed (set to 0)
  // so the header blends seamlessly into the list content below it.
  header: {
    height:           HEADER_H,
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'space-between',
    paddingHorizontal: spacing.sp18,
    elevation:         0,
    shadowOpacity:     0,
  },

  // Tablet: taller header, wider padding, and a small top margin to
  // account for the larger status bar area on iPads.
  headerTablet: {
    height:           spacing.headerTablet,
    paddingHorizontal: spacing.sp36,
    marginTop:         spacing.sp10,
  },

  // Left cluster: logo image + screen title text
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sp8 },

  // Small logo icon inside the header (phone size)
  headerLogo: { width: spacing.sp28, height: spacing.sp28 },

  // Tablet: slightly larger logo to maintain visual weight in the bigger header
  headerLogoTablet: { width: spacing.sp36, height: spacing.sp36 },

  // Screen title shown next to the logo in the header
  headerTitle: {
    fontSize:      typography.fs17,
    fontWeight:    typography.fw700,
    letterSpacing: typography.ls_neg03,
  },

  // Tablet: larger header title
  headerTitleTablet: { fontSize: typography.fs22 },

  // ── Avatar ────────────────────────────────────────────────────────────────

  // Circular user avatar displayed in the top-right of the header.
  // Shows user initials when no profile image is set.
  avatar: {
    width:         spacing.avatar36,
    height:        spacing.avatar36,
    borderRadius:  spacing.br18,  // half of 36 to produce a perfect circle
    borderWidth:   spacing.bw15,
    alignItems:   'center',
    justifyContent:'center',
  },

  // Tablet: larger avatar to match the taller header
  avatarTablet: {
    width:        spacing.avatar44,
    height:       spacing.avatar44,
    borderRadius: spacing.br22,
  },

  // Initials text rendered inside the avatar circle
  avatarText: { fontSize: typography.fs13, fontWeight: typography.fw700 },

  // Tablet: slightly larger initials
  avatarTextTablet: { fontSize: typography.fs15 },

  // ── Loading / Error states ────────────────────────────────────────────────

  // Full-screen centred container used while the institute list is loading
  // or when a fetch error occurs.
  centered: {
    flex:             1,
    alignItems:      'center',
    justifyContent:  'center',
    gap:              spacing.sp12,
    paddingHorizontal: spacing.sp24,
  },

  // Text shown below the activity indicator during loading
  loadingText: { fontSize: typography.fs14, marginTop: spacing.sp8 },

  // Error message text shown when the institute list fails to load
  errorText: {
    fontSize:   typography.fs15,
    textAlign: 'center',
    fontWeight: typography.fw500,
    marginTop:  spacing.sp8,
  },

  // "Retry" button shown below the error message
  retryBtn: {
    marginTop:        spacing.sp8,
    paddingHorizontal: spacing.sp28,
    paddingVertical:   spacing.sp10,
    backgroundColor:  '#0073FF',
    borderRadius:     spacing.br10,
  },

  // Label text inside the retry button
  retryText: { color: '#FFF', fontSize: typography.fs14, fontWeight: typography.fw600 },

  // ── List ──────────────────────────────────────────────────────────────────

  // contentContainerStyle for the institute FlatList — adds horizontal
  // padding and bottom padding so the last card is not clipped.
  listContent: { paddingHorizontal: spacing.sp16, paddingBottom: spacing.sp32 },

  // Tablet: horizontal padding is removed so the tabletContainer handles it instead
  listContentTablet: { paddingHorizontal: spacing.sp0 },

  // ── Tablet centred container ──────────────────────────────────────────────

  // On tablets, the list content is wrapped in this container to cap its
  // maximum width and centre it on wide displays.
  tabletContainer: {
    maxWidth:        spacing.maxWidthInst,
    width:          '100%',
    alignSelf:      'center',
    paddingHorizontal: spacing.sp24,
  },

  // ── Greeting block ────────────────────────────────────────────────────────

  // Top section above the search bar — displays a welcome message
  // and a brief instruction to the user.
  greetingBlock: {
    alignItems:      'center',
    paddingTop:       spacing.sp32,
    paddingBottom:    spacing.sp20,
    paddingHorizontal: spacing.sp8,
  },

  // Inline row for the greeting title and the hand-wave icon
  greetingRow: {
    flexDirection:  'row',
    alignItems:    'center',
    justifyContent:'center',
    gap:            spacing.sp6,
    marginBottom:   spacing.sp8,
  },

  // Main greeting heading (e.g. "Hey there!")
  greetingTitle: {
    fontSize:      typography.fs24,
    fontWeight:    typography.fw800,
    letterSpacing: typography.ls_neg05,
  },

  // Tablet: larger greeting heading
  greetingTitleTablet: { fontSize: typography.fs30 },

  // Animated hand-wave emoji image (if rendered as an asset)
  handIcon: { width: spacing.sp24, height: spacing.sp24 },

  // Supporting subtitle below the greeting title
  greetingSubtitle: {
    fontSize:   typography.fs13_5,
    textAlign: 'center',
    lineHeight: typography.lh20,
  },

  // Tablet: larger subtitle text
  greetingSubtitleTablet: { fontSize: typography.fs16 },

  // ── Search bar ────────────────────────────────────────────────────────────

  // Outer row container for the search icon + text input.
  // paddingVertical differs per platform to keep the tap target consistent.
  searchWrap: {
    flexDirection:    'row',
    alignItems:      'center',
    borderWidth:      spacing.bw15,
    borderRadius:     spacing.br10,
    paddingHorizontal: spacing.sp14,
    paddingVertical:   Platform.OS === 'ios' ? 11 : 9,
    marginBottom:     spacing.sp16,
  },

  // Tablet: slightly more padding to scale with the larger screen
  searchWrapTablet: {
    paddingHorizontal: spacing.sp12,
    paddingVertical:   spacing.sp14,
    marginBottom:      spacing.sp20,
  },

  // Text input inside the search bar — flex: 1 so it fills remaining space
  searchInput: { flex: 1, fontSize: typography.fs14_5, padding: spacing.sp0 },

  // Tablet: larger search input text
  searchInputTablet: { fontSize: typography.fs16 },

  // ── Institute card ────────────────────────────────────────────────────────

  // Row card representing a single institute in the list
  card: {
    flexDirection:  'row',
    alignItems:    'center',
    borderWidth:    spacing.bw15,
    borderRadius:   spacing.br12,
    paddingVertical:   spacing.sp10,
    paddingHorizontal: spacing.sp12,
    marginBottom:   spacing.sp10,
    gap:            spacing.sp10,
  },

  // Tablet: more padding, larger radius, and wider gap between elements
  cardTablet: {
    paddingVertical:   spacing.sp16,
    paddingHorizontal: spacing.sp18,
    borderRadius:      spacing.br16,
    gap:               spacing.sp14,
    marginBottom:      spacing.sp14,
  },

  // Institute logo/thumbnail on the left of the card
  cardLogo: {
    width:           spacing.cardLogoSize,
    height:          spacing.cardLogoSize,
    borderRadius:    spacing.br22,
    backgroundColor:'#F5F5F5', // neutral fallback while the logo image loads
  },

  // Tablet: larger logo with a more rounded border
  cardLogoTablet: {
    width:        spacing.cardLogoTablet,
    height:       spacing.cardLogoTablet,
    borderRadius: spacing.br28,
  },

  // Middle column — takes remaining horizontal space and stacks name + location
  cardInfo: { flex: 1, minWidth: spacing.sp0, gap: spacing.sp3 },

  // Institute name — primary text in the card
  cardName: {
    fontSize:      typography.fs14_5,
    fontWeight:    typography.fw700,
    letterSpacing: typography.ls_neg02,
  },

  // Tablet: slightly larger institute name
  cardNameTablet: { fontSize: typography.fs16_5 ?? 16.5 }, // fallback in case the token is missing

  // Row wrapping the location icon and the location text
  cardLocationRow: { flexDirection: 'row', alignItems: 'center' },

  // Location text — flex: 1 allows it to truncate if it is too long
  cardLocation: { fontSize: typography.fs12, flex: 1 },

  // Tablet: larger location text
  cardLocationTablet: { fontSize: typography.fs13_5 },

  // Right-aligned cluster: institution type badge + navigation arrow
  cardRight: {
    flexDirection: 'row',
    alignItems:   'center',
    gap:           spacing.sp8,
    flexShrink:    0, // prevents this cluster from shrinking and overlapping other content
  },

  // Badge text showing the institution type (e.g. "University", "School")
  cardType: {
    fontSize:   typography.fs12_5,
    fontWeight: typography.fw500,
    textAlign: 'right',
  },

  // Tablet: larger type badge
  cardTypeTablet: { fontSize: typography.fs14 },

  // Small tappable arrow button on the far right of the card
  arrowBtn: {
    width:         spacing.sp28,
    height:        spacing.sp28,
    borderRadius:  spacing.br7,
    alignItems:   'center',
    justifyContent:'center',
  },

  // Tablet: larger arrow button for easier tapping
  arrowBtnTablet: {
    width:        spacing.sp36,
    height:       spacing.sp36,
    borderRadius: spacing.br10,
  },

  // ── Empty state ───────────────────────────────────────────────────────────

  // Message shown when the search query returns no results
  emptyText: {
    textAlign:    'center',
    fontSize:     typography.fs14,
    paddingVertical: spacing.sp24,
  },

  // ── Footer hint ───────────────────────────────────────────────────────────

  // Small informational text at the bottom of the list suggesting
  // what to do if the user's institute isn't listed (e.g. contact support).
  footerHint: {
    fontSize:       typography.fs11_25,
    textAlign:     'center',
    lineHeight:     typography.lh20,
    paddingTop:     spacing.sp24,
    paddingBottom:  spacing.sp8,
    paddingHorizontal: spacing.sp16,
  },

  // Tablet override is intentionally empty — base styles scale well enough
  footerHintTablet: {},

  // Tappable email address link inside the footer hint text
  footerEmail: { fontSize: typography.fs11_25, color: '#0073FF', lineHeight: typography.lh20 },

  // ── Footer wrapper ────────────────────────────────────────────────────────

  // Pushes the footer hint to the very bottom of the scrollable area.
  // flexGrow: 1 ensures this wrapper expands to fill any remaining vertical space.
  footerWrapper: {
    flexGrow:       1,
    justifyContent:'flex-end',
    paddingBottom:  spacing.sp16,
  },
});

export default styles;