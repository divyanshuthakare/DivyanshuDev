
// Centralized typography scale for the app.
// Covers font sizes, font weights, line heights, and letter spacing.
// All text style values should reference tokens from this file to keep
// typography consistent and easy to update across screens.

const typography = {
  // ── Font Sizes ────────────────────────────────────────────────────────────
  // Values in sp (scale-independent pixels). Fractional sizes exist where
  // the design calls for a very specific size between the standard steps.
  fs10: 10,
  fs11: 11,
  fs11_25: 11.25,   // footerHint in InstituteSelection & RoleSelection
  fs12: 12,
  fs12_5: 12.5,     // cardType label in InstituteSelection
  fs13: 13,
  fs13_5: 13.5,     // taglineLine2, greetingSubtitle, subtitle in RoleSelection
  fs14: 14,
  fs14_5: 14.5,     // cardName, roleLabel, searchInput on mobile
  fs15: 15,
  fs15_5: 15.5,     // statLabel on tablet
  fs16: 16,
  fs16_5: 16.5,     // cardName on tablet in InstituteSelection
  fs17: 17,
  fs18: 18,
  fs20: 20,
  fs22: 22,
  fs24: 24,
  fs28: 28,
  fs30: 30,
  fs32: 32,
  fs36: 36,

  // ── Font Weights ──────────────────────────────────────────────────────────
  // Typed as strings because React Native's fontWeight prop expects a string.
  fw400: '400',   // regular
  fw500: '500',   // medium
  fw600: '600',   // semi-bold
  fw700: '700',   // bold
  fw800: '800',   // extra-bold

  // ── Line Heights ──────────────────────────────────────────────────────────
  lh16: 16,
  lh17: 17,
  lh18: 18,
  lh20: 20,
  lh24: 24,
  lh34: 34,
  lh44: 44,

  // ── Letter Spacing ────────────────────────────────────────────────────────
  // Negative values tighten tracking (used for headings);
  // positive values open it up (used for labels and caps text).
  ls_neg05: -0.5,
  ls_neg03: -0.3,
  ls_neg02: -0.2,
  ls_zero:  0,
  ls_02:    0.2,
  ls_05:    0.5,
  ls_1:     1,
};

export default typography;