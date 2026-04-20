/**
 * HomeScreen.styles.ts
 *
 * Styles and theme color maps for the Home (auth entry) screen.
 * This screen handles login, phone/OTP entry, email/password entry,
 * and the "Join" (social auth) flow.
 *
 * Exports:
 *  - lightTheme / darkTheme  — runtime color objects consumed by the component
 *                              to apply the correct palette based on the active color scheme.
 *  - styles (default)        — static StyleSheet used across both themes.
 *
 * Tablet overrides follow each base style with a "Tablet" suffix.
 */

import { StyleSheet, Platform } from 'react-native';
import spacing    from '../theme/spacing';
import typography from '../theme/typography';
import { lightColors, darkColors } from '../theme/colors';

// ── Theme Color Map type ──────────────────────────────────────────────────────

export interface HomeTheme {
  scrollBg: string;
  iconButtonBg: string;
  iconColor: string;
  appTitle: string;
  taglineBlack: string;
  taglineOrange: string;
  taglinePurple: string;
  taglineGray: string;
  taglineBlackBold: string;
  taglineBlue: string;
  inputBg: string;
  inputText: string;
  inputBorder: string;
  dividerLine: string;
  dividerText: string;
  joinButtonBg: string;
  joinButtonBorder: string;
  joinButtonText: string;
  joinButtonIcon: string;
  bottomTaglineTitle: string;
  bottomTaglineSubtitle: string;
  setupCardBg: string;
  setupCardTop: string;
  setupCardLink: string;
  footerText: string;
  footerLink: string;
  statusBar: 'dark-content' | 'light-content';
}

// ── Theme Color Maps ──────────────────────────────────────────────────────────
//
// These objects map semantic UI roles (e.g. "inputBg", "joinButtonText") to
// the correct raw color values for each theme. The component selects one at
// runtime based on the user's system preference or in-app setting.

/**
 * Light theme color map.
 * Falls back to a hardcoded value for any token that may not yet exist
 * in the colors file (e.g. taglineBlue).
 */
export const lightTheme: HomeTheme = {
  scrollBg:             lightColors.pageBg,
  iconButtonBg:         lightColors.iconButtonBg,
  iconColor:            lightColors.iconColor,
  appTitle:             lightColors.appTitle,
  taglineBlack:         lightColors.taglineBlack,
  taglineOrange:        lightColors.taglineOrange,
  taglinePurple:        lightColors.taglinePurple,
  taglineGray:          lightColors.taglineGray,
  taglineBlackBold:     lightColors.taglineBlackBold,
  taglineBlue:          lightColors.taglineBlue    ?? '#007AFF', // fallback if token is missing
  inputBg:              lightColors.inputBg,
  inputText:            '#1A1A1A',                               // hardcoded — no light token needed
  inputBorder:          lightColors.inputBorder,
  dividerLine:          lightColors.dividerLine,
  dividerText:          lightColors.dividerText,
  joinButtonBg:         lightColors.joinButtonBg,
  joinButtonBorder:     lightColors.joinButtonBorder,
  joinButtonText:       lightColors.joinButtonText,
  joinButtonIcon:       lightColors.joinButtonIcon,
  bottomTaglineTitle:   lightColors.bottomTaglineTitle,
  bottomTaglineSubtitle:lightColors.bottomTaglineSubtitle,
  setupCardBg:          lightColors.setupCardBg,
  setupCardTop:         lightColors.setupCardTop,
  setupCardLink:        lightColors.setupCardLink,
  footerText:           lightColors.footerText,
  footerLink:           lightColors.footerLink,
  statusBar:            lightColors.statusBar as 'dark-content' | 'light-content',
};

/**
 * Dark theme color map.
 * Uses the appTitle color for input text since it already adapts
 * to the dark background in the colors file.
 */
export const darkTheme: HomeTheme = {
  scrollBg:             darkColors.pageBg,
  iconButtonBg:         darkColors.iconButtonBg,
  iconColor:            darkColors.iconColor,
  appTitle:             darkColors.appTitle,
  taglineBlack:         darkColors.taglineBlack,
  taglineOrange:        darkColors.taglineOrange,
  taglinePurple:        darkColors.taglinePurple,
  taglineGray:          darkColors.taglineGray,
  taglineBlackBold:     darkColors.taglineBlackBold,
  taglineBlue:          darkColors.taglineBlue    ?? '#007AFF', // fallback if token is missing
  inputBg:              darkColors.inputBg,
  inputText:            darkColors.appTitle,                    // reuses appTitle for legible input text on dark bg
  inputBorder:          darkColors.inputBorder,
  dividerLine:          darkColors.dividerLine,
  dividerText:          darkColors.dividerText,
  joinButtonBg:         darkColors.joinButtonBg,
  joinButtonBorder:     darkColors.joinButtonBorder,
  joinButtonText:       darkColors.joinButtonText,
  joinButtonIcon:       darkColors.joinButtonIcon,
  bottomTaglineTitle:   darkColors.bottomTaglineTitle,
  bottomTaglineSubtitle:darkColors.bottomTaglineSubtitle,
  setupCardBg:          darkColors.setupCardBg,
  setupCardTop:         darkColors.setupCardTop,
  setupCardLink:        darkColors.setupCardLink,
  footerText:           darkColors.footerText,
  footerLink:           darkColors.footerLink,
  statusBar:            darkColors.statusBar as 'dark-content' | 'light-content',
};

// ── Static Styles ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({

  // Root SafeAreaView wrapper
  safeArea: { flex: 1 },

  // Generic flex: 1 utility — used on wrappers that should fill remaining space
  flex1: { flex: 1 },

  // ScrollView's contentContainerStyle — flexGrow ensures the content
  // stretches to fill the screen even when it is shorter than the viewport.
  scrollContent: { flexGrow: 1 },

  // ── Outer padding wrapper (inside ScrollView) ─────────────────────────────

  // Main vertical layout container. flex: 1 is required so the content
  // stretches to fill the full available height on phone, which lets
  // the bottom tagline block anchor itself to the bottom of the screen.
  outerPad: {
    flex: 1,
    paddingHorizontal: spacing.sp24,
    paddingTop:        spacing.sp14,
    paddingBottom:     spacing.sp24,
  },

  // Tablet: wider horizontal padding to match larger screen proportions.
  // flex must remain 1 so the layout contract from the phone version holds.
  outerPadTablet: {
    flex:              1,
    paddingHorizontal: spacing.sp32,
    paddingTop:        spacing.sp20,
    paddingBottom:     spacing.sp32,
  },

  // ── Top action buttons ────────────────────────────────────────────────────

  // Phone: top-right row for theme toggle / help / other icon buttons.
  // Aligns buttons to the right and adds spacing below before the logo section.
  topRow: {
    flexDirection:  'row',
    justifyContent: 'flex-end',
    gap:             spacing.sp10,
    marginBottom:    spacing.sp20,
  },

  // Tablet: absolutely positioned so the buttons float above the content
  // without pushing the logo/tagline down.
  tabletTopButtons: {
    position:      'absolute',
    top:            spacing.sp35,
    right:          spacing.sp20,
    zIndex:         10,
    flexDirection: 'row',
    gap:            spacing.sp10,
  },

  // iPad-specific offset — iPads have a taller status bar, so we push
  // the buttons further down to avoid the notch/status bar area.
  tabletTopButtonsIpad: {
    top: spacing.sp60,
  },

  // Individual icon button (theme toggle, language picker, etc.)
  iconButton: {
    width:         spacing.sp44,
    height:        spacing.sp44,
    borderRadius:  spacing.br12,
    alignItems:    'center',
    justifyContent:'center',
    shadowColor:   '#000000',
    shadowOffset:  { width: spacing.sp0, height: spacing.sp1 },
    shadowOpacity: 0.08,
    shadowRadius:  spacing.sp4,
    elevation:     2,
  },

  // ── Logo section ──────────────────────────────────────────────────────────

  // Container for the logo image and app title text
  logoSection: {
    alignItems:   'center',
    marginBottom:  spacing.sp16,
    marginTop:     spacing.sp24,
  },

  // App logo image (phone size)
  logoImage: {
    width:       spacing.sp64,
    height:      spacing.sp64,
    resizeMode: 'contain',
  },

  // Tablet: larger logo with a small top nudge for better visual balance
  logoImageTablet: {
    width:     spacing.sp88,
    height:    spacing.sp88,
    marginTop: spacing.sp8,
  },

  // App name text displayed below the logo
  appTitle: {
    fontSize:      typography.fs32,
    fontWeight:    typography.fw700,
    marginTop:     spacing.sp12,
    letterSpacing: typography.ls_neg05,
  },

  // Tablet: larger app title
  appTitleTablet: {
    fontSize: typography.fs36,
  },

  // Colour applied to a specific word/span within the app title (brand accent blue)
  appTitleBlue: {
    color: '#0073FF',
  },

  // ── Tagline ───────────────────────────────────────────────────────────────

  // Two-line tagline block sitting below the logo section
  taglineSection: {
    alignItems:   'center',
    marginBottom:  spacing.sp22,
  },

  // First tagline line — slightly larger, acts as the primary message
  taglineLine1: {
    fontSize:     typography.fs15,
    marginBottom: spacing.sp5 ?? 5, // fallback in case the token is undefined
    textAlign:   'center',
  },
  taglineLine1Tablet: {
    fontSize: typography.fs17,
  },

  // Second tagline line — smaller supporting text
  taglineLine2: {
    fontSize:  typography.fs12,
    textAlign: 'center',
  },
  taglineLine2Tablet: {
    fontSize: typography.fs15,
  },

  // ── Auth card ─────────────────────────────────────────────────────────────

  // Rounded card wrapping login/signup form elements
  authCard: {
    borderRadius: spacing.br12,
    padding:      spacing.sp16,
    marginVertical: spacing.sp6,
  },

  // Tablet: centred with a max-width to prevent the form from stretching too wide
  authCardTablet: {
    alignSelf: 'center',
    width:     '100%',
    maxWidth:  500,
  },

  // ── Unified input ─────────────────────────────────────────────────────────

  // General-purpose single-line text input (email, username, etc.)
  unifiedInput: {
    borderWidth:      spacing.bw1,
    borderRadius:     spacing.br10,
    paddingHorizontal: spacing.sp12,
    height:            spacing.sp48,
    width:            '100%',
  },

  // Tablet: taller input and slightly larger text for easier touch targets
  unifiedInputTablet: {
    height:   spacing.sp56,
    fontSize: typography.fs16,
  },

  // ── Phone number row ──────────────────────────────────────────────────────

  // Row that holds the country-code picker and the phone number input side by side
  phoneRow: {
    flexDirection: 'row',
    gap:            spacing.sp10,
    marginBottom:   spacing.sp0,
  },

  // Country code picker box (flag + dial code)
  countryCodeBox: {
    flexDirection:    'row',
    alignItems:       'center',
    borderWidth:       spacing.bw1,
    borderRadius:      spacing.br10,
    paddingHorizontal: spacing.sp10,
    height:            spacing.sp48,
    gap:               spacing.sp6,
  },

  // Flag emoji rendered as text inside the country code picker
  flagEmoji: {
    fontSize: typography.fs20,
  },

  // Dial code text next to the flag (e.g. "+91")
  countryCodeText: {
    fontSize:   typography.fs15,
    fontWeight: typography.fw600,
  },

  // Editable phone number input — takes remaining space in the row
  phoneNumberInput: {
    flex:              1,
    borderWidth:       spacing.bw1,
    borderRadius:      spacing.br10,
    paddingHorizontal: spacing.sp12,
    height:            spacing.sp48,
    fontSize:          typography.fs15,
  },

  // Read-only display box that shows a confirmed/masked phone number
  phoneNumberBox: {
    flex:              1,
    borderWidth:       spacing.bw1,
    borderRadius:      spacing.br10,
    paddingHorizontal: spacing.sp12,
    height:            spacing.sp48,
    justifyContent:   'center',
  },

  // Text inside the read-only phone number box
  phoneNumberText: {
    fontSize: typography.fs15,
  },

  // ── OTP label ─────────────────────────────────────────────────────────────

  // "Enter OTP" label shown above the OTP digit boxes
  otpLabel: {
    fontSize:   typography.fs14,
    fontWeight: typography.fw600,
    marginTop:  spacing.sp14,
    marginBottom:spacing.sp6,
  },

  // ── Send code / Continue button ───────────────────────────────────────────

  // Primary CTA button — used for "Send OTP", "Continue", etc.
  // paddingVertical differs between platforms to account for font rendering differences.
  sendCodeButton: {
    backgroundColor: '#1B6B5A',
    borderRadius:    spacing.br12,
    paddingVertical: Platform.OS === 'ios' ? 15 : 13,
    alignItems:     'center',
    justifyContent: 'center',
    marginTop:       spacing.sp14,
    // Coloured shadow using the same hue as the button for a "glow" effect
    shadowColor:    '#1B6B5A',
    shadowOffset:   { width: spacing.sp0, height: spacing.sp2 },
    shadowOpacity:  0.25,
    shadowRadius:   spacing.sp6,
    elevation:      3,
  },

  // White label text inside the primary CTA button
  sendCodeButtonText: {
    color:      '#FFFFFF',
    fontSize:   typography.fs18,
    fontWeight: typography.fw600,
    letterSpacing: typography.ls_02,
  },

  // Tablet: slightly smaller font to prevent oversized text in the wider button
  sendCodeButtonTextTablet: {
    fontSize: typography.fs17,
  },

  // ── Email button row ──────────────────────────────────────────────────────

  // Row used on the email tab to place "Sign In" and "Register" side by side
  emailButtonsRow: {
    flexDirection: 'row',
    gap:            spacing.sp10,
    marginTop:      spacing.sp0,
  },

  // Each button takes equal width in the row
  emailButtonHalf: {
    flex:      1,
    marginTop: spacing.sp14,
  },

  // ── Password input ────────────────────────────────────────────────────────

  // Relative wrapper needed to absolutely position the eye (show/hide) button
  passwordInputWrapper: {
    position:  'relative',
    marginTop:  spacing.sp14,
  },

  // Password text input — paddingRight reserves space so text doesn't
  // run underneath the eye toggle button on the right.
  passwordInput: {
    borderRadius:      spacing.br10,
    paddingHorizontal: spacing.sp18,
    paddingVertical:   Platform.OS === 'ios' ? 10 : 8,
    paddingRight:      spacing.sp52 ?? 52, // fallback ensures the eye button area is always clear
    fontSize:          typography.fs16,
    borderWidth:       spacing.bw1,
    shadowColor:      '#000000',
    shadowOffset:     { width: spacing.sp0, height: spacing.sp1 },
    shadowOpacity:    0.05,
    shadowRadius:     spacing.sp2,
    elevation:        1,
  },

  // Tablet: larger text and taller input
  passwordInputTablet: {
    fontSize:       typography.fs17,
    paddingVertical: 16,
  },

  // Absolutely-positioned eye icon button overlaid on the right side of the password input
  passwordEyeButton: {
    position:         'absolute',
    right:             spacing.sp14,
    top:               spacing.sp0,
    bottom:            spacing.sp0,
    justifyContent:   'center',
    alignItems:       'center',
    paddingHorizontal: spacing.sp4,
  },

  // ── Login error ───────────────────────────────────────────────────────────

  // Inline error message displayed below the login form on credential failure
  loginError: {
    color:     '#EF4444',
    fontSize:   typography.fs13,
    textAlign: 'center',
    marginTop:  spacing.sp10,
    lineHeight: typography.lh18,
  },

  // Tablet: slightly larger error text
  loginErrorTablet: {
    fontSize: typography.fs15,
  },

  // ── Forgot password ───────────────────────────────────────────────────────

  // Right-aligned row for the "Forgot password?" tappable link
  forgotPasswordRow: {
    alignItems: 'flex-end',
    marginTop:   spacing.sp10,
  },

  forgotPasswordText: {
    fontSize:          typography.fs14,
    fontWeight:        typography.fw600,
    textDecorationLine:'underline',
  },

  // ── OTP digit boxes ───────────────────────────────────────────────────────

  // Container row that spaces the individual digit boxes evenly
  otpRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    marginTop:       spacing.sp6,
  },

  // Individual OTP digit input box.
  // aspectRatio: 1 makes each box perfectly square regardless of screen width.
  otpBox: {
    flex:          1,
    aspectRatio:   1,
    borderRadius:  spacing.br10,
    borderWidth:   spacing.bw1,
    fontSize:      typography.fs22,
    fontWeight:    typography.fw700,
    textAlign:    'center',
    marginHorizontal: spacing.sp3,
    shadowColor:  '#000000',
    shadowOffset: { width: spacing.sp0, height: spacing.sp1 },
    shadowOpacity: 0.04,
    shadowRadius:  spacing.sp2,
    elevation:     1,
  },

  // Tablet: fixed size instead of flex + aspectRatio, since there is enough
  // horizontal space to give each box an explicit 50x50 dimension.
  otpBoxTablet: {
    flex:             0,
    width:            50,
    height:           50,
    aspectRatio:      undefined,
    marginHorizontal: 4,
    fontSize:         typography.fs20,
  },

  // Row containing "Didn't receive a code?" text and the Resend link
  resendRow: {
    flexDirection: 'row',
    alignItems:   'center',
    marginTop:     spacing.sp16,
    marginBottom:  spacing.sp2,
  },

  // Static text in the resend row (e.g. "Didn't receive a code?")
  resendText: {
    fontSize:   typography.fs14,
    fontWeight: typography.fw400,
  },

  // Tappable "Resend" link in the resend row
  resendLink: {
    fontSize:          typography.fs14,
    fontWeight:        typography.fw600,
    textDecorationLine:'underline',
  },

  // ── OR divider ────────────────────────────────────────────────────────────

  // Horizontal padding wrapper for the divider + join button section
  orJoinWrapper: {
    paddingHorizontal: spacing.sp16,
  },

  // Row containing the two horizontal lines and the "OR" text in the middle
  dividerRow: {
    flexDirection: 'row',
    alignItems:   'center',
    marginTop:     spacing.sp14,
  },

  // Thin horizontal line on each side of the "OR" label
  dividerLine: {
    flex:   1,
    height: spacing.bw1,
  },

  // "OR" label between the two divider lines
  dividerText: {
    fontSize:      typography.fs13,
    fontWeight:    typography.fw600,
    marginHorizontal: spacing.sp14,
    letterSpacing: typography.ls_1,
  },

  // ── Join (social auth) button ─────────────────────────────────────────────

  // Outlined button used for third-party / institution login (e.g. "Join with Google")
  joinButton: {
    flexDirection:  'row',
    alignItems:    'center',
    justifyContent:'center',
    borderRadius:   spacing.br10,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    borderWidth:    spacing.bw1,
    shadowColor:   '#000000',
    shadowOffset:  { width: spacing.sp0, height: spacing.sp1 },
    shadowOpacity: 0.05,
    shadowRadius:  spacing.sp2,
    elevation:     1,
    marginTop:     spacing.sp16,
  },

  // Spacing between the icon and text label inside the join button
  joinButtonIcon: {
    marginRight: spacing.sp10,
  },

  joinButtonText: {
    fontSize:   typography.fs18,
    fontWeight: typography.fw600,
  },

  // Tablet: slightly smaller font for the join button label
  joinButtonTextTablet: {
    fontSize: typography.fs17,
  },

  // ── Bottom tagline block ──────────────────────────────────────────────────

  // Flex container that pushes the bottom tagline to the foot of the screen.
  // minHeight prevents it from collapsing when content is short.
  taglineBlock: {
    flex:           1,
    minHeight:      spacing.sp80,
    alignItems:    'center',
    justifyContent:'center',
    paddingVertical: spacing.sp16,
  },

  // Bold title line in the bottom tagline (e.g. app value proposition)
  bottomTaglineTitle: {
    fontSize:    typography.fs14,
    fontWeight:  typography.fw700,
    marginBottom: spacing.sp4,
    textAlign:  'center',
  },

  // Tablet: larger bottom tagline title
  bottomTaglineTitleTablet: {
    fontSize: typography.fs18,
  },

  // Supporting subtitle line below the tagline title
  bottomTaglineSubtitle: {
    fontSize:   typography.fs14,
    fontWeight: typography.fw600,
    textAlign: 'center',
  },

  bottomTaglineSubtitleTablet: {
    fontSize: typography.fs15,
  },

  // ── Back link ─────────────────────────────────────────────────────────────

  // Centred row for "Back to login" or similar navigation links
  backLinkRow: {
    alignItems:    'center',
    marginTop:      spacing.sp16,
    paddingVertical: spacing.sp4,
  },

  backLinkText: {
    fontSize:   typography.fs14,
    fontWeight: typography.fw500,
    textAlign: 'center',
  },

  // ── Setup card ────────────────────────────────────────────────────────────

  // Promotional or onboarding card shown on the home screen
  // (e.g. "Set up your institution — takes 2 minutes").
  // paddingVertical differs per platform for consistent visual height.
  setupCard: {
    borderRadius:   spacing.br18,
    padding:        spacing.sp18,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    marginBottom:   spacing.sp20,
    elevation:      2,
    marginTop:      spacing.sp8,
  },

  // Top descriptive text inside the setup card
  setupCardTop: {
    fontSize: typography.fs16,
    marginTop: spacing.sp4,
  },

  // Row that holds the setup card CTA link and its trailing arrow icon
  setupCardLinkRow: {
    flexDirection: 'row',
    alignItems:   'center',
  },

  // Tappable link text inside the setup card
  setupCardLink: {
    fontSize:    typography.fs16,
    fontWeight:  typography.fw600,
    marginRight: spacing.sp4,
  },

  // ── Footer ────────────────────────────────────────────────────────────────

  // Bottom-most section — typically holds "Terms of Service" and "Privacy Policy" links
  footer: {
    alignItems: 'center',
  },

  // Small muted text in the footer (e.g. copyright or disclaimer)
  footerText: {
    fontSize: typography.fs12,
    marginTop: spacing.sp12,
  },

  // Tappable link inside the footer (e.g. "Privacy Policy")
  footerLink: {
    fontSize:   typography.fs12,
    fontWeight: typography.fw500,
  },
});

export default styles;