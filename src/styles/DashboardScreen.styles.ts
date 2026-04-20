/**
 * DashboardScreen.styles.js
 *
 * Stylesheet for the main Dashboard screen.
 * Covers the top header, logo, user avatar, scrollable content area,
 * welcome title, and the stats grid with individual stat cards.
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

  // Fixed-height top bar with a subtle drop shadow to separate it from content.
  // zIndex: 10 keeps it above any absolutely-positioned children while scrolling.
  header: {
    height:            HEADER_H,
    flexDirection:    'row',
    alignItems:       'center',
    justifyContent:   'space-between',
    paddingHorizontal: spacing.sp18,
    shadowOffset:     { width: 0, height: 2 },
    shadowOpacity:    0.09,
    shadowRadius:     6,
    elevation:        4,
    zIndex:           10,
  },

  // Tablet: taller header and wider horizontal padding to match larger screen proportions.
  headerTablet: {
    height:            spacing.headerTablet,
    paddingHorizontal: spacing.sp36,
  },

  // Left cluster inside the header (logo + title grouped together)
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sp14 },

  // ── Logo ──────────────────────────────────────────────────────────────────

  // Logo image and app name sit side-by-side in a row
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sp8 },

  // Small logo image shown in the header
  logoImg: { width: spacing.sp26, height: spacing.sp26 },

  // Tablet: slightly larger logo to scale with the bigger header
  logoImgTablet: { width: spacing.sp34, height: spacing.sp34 },

  logoText: {
    fontSize:      typography.fs16,
    fontWeight:    typography.fw700,
    letterSpacing: typography.ls_neg03,
  },

  // Tablet: bumped font size for the app name next to the logo
  logoTextTablet: { fontSize: typography.fs20 },

  // ── Avatar ────────────────────────────────────────────────────────────────

  // Circular avatar shown in the top-right of the header.
  // Displays the user's initials when no profile photo is available.
  avatar: {
    width:         spacing.avatar34,
    height:        spacing.avatar34,
    borderRadius:  spacing.br17,   // half of width/height to produce a perfect circle
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

  // Tablet: slightly larger initials to fill the bigger avatar
  avatarTextTablet: { fontSize: typography.fs15 },

  // ── Scroll content ────────────────────────────────────────────────────────

  // contentContainerStyle for the main ScrollView.
  // Centres all children horizontally and adds generous bottom padding
  // so content is not clipped behind home-indicator or nav bars.
  scrollContent: {
    paddingHorizontal: spacing.sp20,
    paddingTop:        spacing.sp28,
    paddingBottom:     spacing.sp60,
    alignItems:       'center',
  },

  // Tablet: extra padding and a max-width cap so content doesn't stretch too wide
  scrollContentTablet: {
    paddingTop:        spacing.sp48,
    paddingHorizontal: spacing.sp40,
    paddingBottom:     spacing.sp80,
    maxWidth:          spacing.maxWidthDash,
    alignSelf:        'center',
    width:            '100%',
  },

  // ── Welcome title ─────────────────────────────────────────────────────────

  // Greeting message displayed at the top of the scrollable area
  welcomeTitle: {
    fontSize:    typography.fs24,
    fontWeight:  typography.fw700,
    textAlign:  'center',
    lineHeight:  typography.lh34,
    marginBottom: spacing.sp36,
    letterSpacing: typography.ls_neg03,
  },

  // Tablet: larger text and more breathing room below the title
  welcomeTitleTablet: {
    fontSize:    typography.fs32,
    marginBottom: spacing.sp48,
    lineHeight:  typography.lh44,
  },

  // ── Stats grid ────────────────────────────────────────────────────────────

  // Wrapping flex row that holds all stat cards.
  // flexWrap allows cards to reflow into multiple rows on narrow screens.
  statsGrid: {
    flexDirection: 'row',
    flexWrap:     'wrap',
    gap:           spacing.sp16,
    width:        '100%',
    justifyContent:'center',
  },

  // Tablet: slightly wider gap between cards
  statsGridTablet: {
    gap: spacing.sp20,
  },

  // ── Stat card ─────────────────────────────────────────────────────────────

  // Individual metric card (e.g. total students, active courses).
  // Width is set by the spacing token so it fills roughly half the grid on phone.
  statCard: {
    width:         spacing.statCardWidth,
    borderRadius:  spacing.br14,
    padding:       spacing.sp20,
    shadowOffset:  { width: spacing.sp0, height: spacing.sp2 },
    shadowOpacity: 0.07,
    shadowRadius:  spacing.sp8,
    elevation:     3,
  },

  // Tablet: wider card and more inner padding
  statCardTablet: {
    width:   spacing.statCardWidthTablet,
    padding: spacing.sp28,
  },

  // ── Stat count ────────────────────────────────────────────────────────────

  // Large number shown at the top of each stat card (e.g. "142")
  statCount: {
    fontSize:      typography.fs28,
    fontWeight:    typography.fw700,
    marginBottom:  spacing.sp4,
    letterSpacing: typography.ls_neg05,
  },

  // Tablet: even larger count for better visual hierarchy on bigger screens
  statCountTablet: {
    fontSize:     typography.fs36,
    marginBottom: spacing.sp6,
  },

  // ── Stat label ────────────────────────────────────────────────────────────

  // Short bold label below the count (e.g. "Students Enrolled")
  statLabel: {
    fontSize:    typography.fs13_5,
    fontWeight:  typography.fw700,
    marginBottom: spacing.sp6,
  },

  // Tablet: slightly larger label text
  statLabelTablet: {
    fontSize:    typography.fs15_5,
    marginBottom: spacing.sp8,
  },

  // ── Stat description ──────────────────────────────────────────────────────

  // Optional secondary line below the label with additional context
  statDesc: {
    fontSize:   typography.fs12,
    lineHeight: typography.lh17,
  },

  // Tablet: larger description text with more generous line height
  statDescTablet: {
    fontSize:   typography.fs13_5,
    lineHeight: typography.lh20,
  },
});

export default styles;