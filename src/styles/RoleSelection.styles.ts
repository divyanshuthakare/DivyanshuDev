/**
 * RoleSelection.styles.js
 *
 * Stylesheet for the Role Selection screen where a user picks their
 * role within a chosen institution (e.g. Teacher, Student, Admin).
 *
 * Covers the header, avatar, scroll content, the "change institute" pill,
 * the selected-institute summary card, the role list, individual role cards,
 * and the footer hint.
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

  // Root SafeAreaView — fills the entire screen
  safe: { flex: 1 },

  // ── Header ────────────────────────────────────────────────────────────────

  // Top navigation bar. Elevation is set to 0 to avoid a visible shadow line
  // between the header and the scroll content on this screen.
  header: {
    height:           HEADER_H,
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'space-between',
    paddingHorizontal: spacing.sp18,
    elevation:         0,
  },

  // Tablet: taller header and wider horizontal padding
  headerTablet: {
    height:           spacing.headerTablet,
    paddingHorizontal: spacing.sp36,
  },

  // Left side of the header — holds the logo image and app name
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sp14 },

  // Logo image + text grouped in a horizontal row
  logoRow:    { flexDirection: 'row', alignItems: 'center', gap: spacing.sp8 },

  // Small logo image shown in the header (phone size)
  logoImg:    { width: spacing.sp26, height: spacing.sp26 },

  // Tablet: slightly larger logo
  logoImgTablet: { width: spacing.sp34, height: spacing.sp34 },

  // App name text next to the logo
  logoText: {
    fontSize:      typography.fs16,
    fontWeight:    typography.fw700,
    letterSpacing: typography.ls_neg03,
  },

  // Tablet: larger app name text
  logoTextTablet: { fontSize: typography.fs20 },

  // ── Avatar ────────────────────────────────────────────────────────────────

  // Circular avatar in the top-right of the header.
  // Displays the user's initials when no profile image is available.
  avatar: {
    width:         spacing.avatar34,
    height:        spacing.avatar34,
    borderRadius:  spacing.br17,  // half of 34 for a perfect circle
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

  // Initials text inside the avatar circle
  avatarText: {
    fontSize:      typography.fs12,
    fontWeight:    typography.fw700,
    letterSpacing: typography.ls_05,
  },

  // Tablet: slightly larger initials
  avatarTextTablet: { fontSize: typography.fs15 },

  // ── Scroll content ────────────────────────────────────────────────────────

  // contentContainerStyle for the main ScrollView (phone).
  // Centres all children and adds padding so content clears the bottom bar.
  scroll: {
    paddingHorizontal: spacing.sp20,
    paddingTop:        spacing.sp24,
    paddingBottom:     spacing.sp40 ?? 40, // fallback in case the spacing token is undefined
    alignItems:       'center',
  },

  // Tablet: removes horizontal padding (handled by centeredContent instead)
  // and stretches children to fill the full width.
  scrollTablet: {
    paddingHorizontal: spacing.sp0,
    paddingTop:        spacing.sp36,
    paddingBottom:     spacing.sp60,
    alignItems:       'stretch',
  },

  // ── Tablet centred wrapper ────────────────────────────────────────────────

  // On tablets, all content is wrapped in this view to cap the layout width
  // and keep it centred on wide displays.
  centeredContent: {
    width:            '100%',
    maxWidth:          spacing.maxWidthRole,
    alignSelf:        'center',
    paddingHorizontal: spacing.sp32,
    alignItems:       'center',
  },

  // ── Change institute pill ─────────────────────────────────────────────────

  // Tappable pill button that lets the user go back and pick a different
  // institution. The elevated shadow helps it stand out as an action.
  changePill: {
    flexDirection:    'row',
    alignItems:      'center',
    gap:              spacing.sp8,
    paddingHorizontal: spacing.sp20,
    paddingVertical:   spacing.sp10,
    borderRadius:     spacing.br24,   // fully rounded pill shape
    borderWidth:      spacing.bw15,
    marginBottom:     spacing.sp20,
    shadowColor:     '#2D2D2D',
    shadowOffset:    { width: spacing.sp0, height: spacing.sp2 },
    shadowOpacity:   0.10,
    shadowRadius:    spacing.sp6,
    elevation:       4,
  },

  // Tablet: wider padding; alignSelf centres the pill without stretching it
  changePillTablet: {
    paddingHorizontal: spacing.sp26,
    paddingVertical:   spacing.sp13 ?? 13, // fallback in case the token is missing
    alignSelf:        'center',
  },

  // Text label inside the pill (e.g. "Change Institute")
  changePillText: { fontSize: typography.fs14, fontWeight: typography.fw500 },

  // Tablet: larger pill label
  changePillTextTablet: { fontSize: typography.fs16 },

  // ── Selected institute summary card ───────────────────────────────────────

  // Card displayed at the top of the role list showing which institution
  // the user has already selected (logo + name + location + verified badge).
  instCard: {
    width:         '100%',
    flexDirection: 'row',
    alignItems:   'center',
    gap:           spacing.sp14,
    borderWidth:   spacing.bw15,
    borderRadius:  spacing.br14,
    padding:       spacing.sp14,
    marginBottom:  spacing.sp28,
  },

  // Tablet: more padding, larger radius, and more space below the card
  instCardTablet: {
    padding:      spacing.sp20,
    borderRadius: spacing.br18,
    marginBottom: spacing.sp36,
  },

  // Circular institution logo inside the selected institute card
  instLogo: {
    width:           spacing.sp48,
    height:          spacing.sp48,
    borderRadius:    spacing.br24,
    backgroundColor:'#F5F5F5', // neutral placeholder while image loads
  },

  // Tablet: larger institution logo
  instLogoTablet: {
    width:        spacing.sp60,
    height:       spacing.sp60,
    borderRadius: spacing.br30,
  },

  // Text info column (name + location) inside the selected institute card
  instInfo: { flex: 1, minWidth: spacing.sp0, gap: spacing.sp3 },

  // Institution name — primary text in the selected institute card
  instName: {
    fontSize:      typography.fs15,
    fontWeight:    typography.fw700,
    letterSpacing: typography.ls_neg02,
  },

  // Tablet: larger institution name
  instNameTablet: { fontSize: typography.fs18 },

  // Row wrapping the location icon + location text
  instLocRow: { flexDirection: 'row', alignItems: 'center' },

  // Location text — flex: 1 so it truncates gracefully if too long
  instLoc: { fontSize: typography.fs13, flex: 1 },

  // Tablet: slightly larger location text
  instLocTablet: { fontSize: typography.fs14_5 },

  // ── Verified badge ────────────────────────────────────────────────────────

  // Small checkmark or shield icon indicating the institution is verified.
  // flexShrink: 0 prevents it from being squished when the name is long.
  verifiedBadge: {
    width:     spacing.sp28,
    height:    spacing.sp28,
    flexShrink: 0,
  },

  // Tablet: larger verified badge
  verifiedBadgeTablet: {
    width:  spacing.sp34,
    height: spacing.sp34,
  },

  // ── Title block ───────────────────────────────────────────────────────────

  // Section heading area above the role list — contains title + subtitle
  titleBlock: { alignItems: 'center', marginBottom: spacing.sp24, width: '100%' },

  // Tablet: more space below the title block
  titleBlockTablet: { marginBottom: spacing.sp32 },

  // Main heading on the role selection screen (e.g. "Choose your role")
  title: {
    fontSize:      typography.fs24,
    fontWeight:    typography.fw800,
    letterSpacing: typography.ls_neg05,
    marginBottom:  spacing.sp6,
    textAlign:    'center',
  },

  // Tablet: larger heading
  titleTablet: { fontSize: typography.fs32 },

  // Supporting subtitle below the heading
  subtitle: {
    fontSize:   typography.fs13_5,
    textAlign: 'center',
    lineHeight: typography.lh20,
  },

  // Tablet: larger subtitle with more generous line height
  subtitleTablet: { fontSize: typography.fs16, lineHeight: typography.lh24 },

  // ── Error banner ──────────────────────────────────────────────────────────

  // Inline error banner shown at the top of the role list when role
  // assignment fails or roles cannot be fetched.
  errorBanner: {
    flexDirection:    'row',
    alignItems:      'center',
    gap:              spacing.sp6,
    backgroundColor: '#FEF2F2', // light red background to signal an error state
    borderRadius:     spacing.br8,
    paddingHorizontal: spacing.sp14,
    paddingVertical:   spacing.sp10,
    marginBottom:     spacing.sp16,
    width:           '100%',
  },

  // Error message text inside the banner — flex: 1 allows it to wrap naturally
  errorText: { color: '#EF4444', fontSize: typography.fs13, flex: 1 },

  // ── Role list ─────────────────────────────────────────────────────────────

  // Vertical list container holding all available role cards
  roleList: { width: '100%', gap: spacing.sp12 },

  // Tablet: wider gap between role cards
  roleListTablet: { gap: spacing.sp16 },

  // ── Role card ─────────────────────────────────────────────────────────────

  // Individual tappable card representing a single role (e.g. "Student").
  // Elevated shadow distinguishes each card from the background.
  roleCard: {
    flexDirection: 'row',
    alignItems:   'center',
    borderRadius:  spacing.br14,
    padding:       spacing.sp14,
    gap:           spacing.sp14,
    borderWidth:   spacing.bw1,
    shadowColor:  '#1A2B4A',
    shadowOffset: { width: spacing.sp0, height: spacing.sp2 },
    shadowOpacity: 0.08,
    shadowRadius:  spacing.sp6,
    elevation:     3,
  },

  // Tablet: more padding, larger radius, wider gap between card elements
  roleCardTablet: {
    padding:      spacing.sp20,
    borderRadius: spacing.br18,
    gap:          spacing.sp18,
  },

  // ── Role icon wrap ────────────────────────────────────────────────────────

  // Rounded square container for the role icon (e.g. graduation cap, briefcase).
  // flexShrink: 0 prevents it from collapsing when the card is narrow.
  roleIconWrap: {
    width:         spacing.sp44,
    height:        spacing.sp44,
    borderRadius:  spacing.br12,
    alignItems:   'center',
    justifyContent:'center',
    flexShrink:    0,
  },

  // Tablet: larger icon container
  roleIconWrapTablet: {
    width:        spacing.sp54,
    height:       spacing.sp54,
    borderRadius: spacing.br15,
  },

  // ── Role text ─────────────────────────────────────────────────────────────

  // Text column next to the icon — holds role label + description
  roleTextWrap: { flex: 1, minWidth: spacing.sp0, gap: spacing.sp2 },

  // Bold role name (e.g. "Student", "Teacher")
  roleLabel: {
    fontSize:      typography.fs14_5,
    fontWeight:    typography.fw600,
    letterSpacing: typography.ls_neg02,
  },

  // Tablet: larger role label
  roleLabelTablet: { fontSize: typography.fs17 },

  // Short description below the role name
  roleDesc: { fontSize: typography.fs12, lineHeight: typography.lh16 },

  // Tablet: larger description with more generous line height
  roleDescTablet: { fontSize: typography.fs14, lineHeight: typography.lh20 },

  // ── Role arrow button ─────────────────────────────────────────────────────

  // Small outlined arrow button on the right side of each role card.
  // flexShrink: 0 prevents it from being squeezed when the label is long.
  roleArrow: {
    width:         spacing.sp30 ?? 30,  // fallback in case the token is missing
    height:        spacing.sp30 ?? 30,
    borderRadius:  spacing.br8,
    borderWidth:   spacing.bw1,
    alignItems:   'center',
    justifyContent:'center',
    flexShrink:    0,
  },

  // Tablet: larger arrow button for a bigger tap target
  roleArrowTablet: {
    width:        spacing.sp38,
    height:       spacing.sp38,
    borderRadius: spacing.br11,
  },

  // ── Footer hint ───────────────────────────────────────────────────────────

  // Small informational text displayed below the role list —
  // typically explains access permissions or contact info for role issues.
  footerHint: {
    fontSize:       typography.fs11_25,
    textAlign:     'center',
    lineHeight:     typography.lh20,
    marginTop:      spacing.sp32,
    paddingHorizontal: spacing.sp8,
  },

  // Tablet: more top margin and slightly larger text
  footerHintTablet: {
    marginTop: spacing.sp48,
    fontSize:  typography.fs13,
  },
});

export default styles;