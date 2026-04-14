
// Centralized spacing scale for the app.
// All margin, padding, size, and layout values should reference tokens
// from this file rather than using magic numbers inline.
// Organized into logical groups: base spacing, border widths, border radii,
// icon sizes, avatar sizes, header heights, card dimensions, and max-widths.

const spacing = {
  // ── Base Spacing Scale ────────────────────────────────────────────────────
  // Numeric values in dp. Use these for padding, margin, gap, and similar.
  sp0:   0,
  sp2:   2,
  sp3:   3,
  sp4:   4,
  sp5:   5,
  sp6:   6,
  sp7:   7,
  sp8:   8,
  sp9:   9,
  sp10:  10,
  sp11:  11,
  sp12:  12,
  sp13:  13,
  sp14:  14,
  sp15:  15,
  sp16:  16,
  sp17:  17,
  sp18:  18,
  sp20:  20,
  sp22:  22,
  sp24:  24,
  sp25:  25,
  sp26:  26,
  sp28:  28,
  sp30:  30,
  sp32:  32,
  sp34:  34,
  sp35:  35,
  sp36:  36,
  sp38:  38,
  sp40:  40,
  sp44:  44,
  sp46:  46,
  sp48:  48,
  sp52:  52,
  sp54:  54,
  sp56:  56,
  sp60:  60,
  sp64:  64,
  sp72:  72,
  sp80:  80,
  sp88:  88,
  sp960: 960,  // max content width for tablet scrollable areas

  // ── Border Widths ─────────────────────────────────────────────────────────
  bw05:  0.5,
  bw08:  0.8,
  bw1:   1,
  bw15:  1.5,
  bw2:   2,

  // ── Border Radii ─────────────────────────────────────────────────────────
  br2:   2,
  br7:   7,
  br8:   8,
  br10:  10,
  br11:  11,
  br12:  12,
  br14:  14,
  br15:  15,
  br16:  16,
  br17:  17,
  br18:  18,
  br22:  22,
  br24:  24,
  br28:  28,
  br30:  30,

  // ── Icon / Image Sizes ────────────────────────────────────────────────────
  // Used for width/height of icon and image components throughout the app.
  icon16: 16,
  icon18: 18,
  icon20: 20,
  icon24: 24,
  icon26: 26,
  icon28: 28,
  icon34: 34,
  icon36: 36,
  icon40: 40,
  icon44: 44,
  icon56: 56,
  icon64: 64,
  icon88: 88,

  // ── Avatar Sizes ──────────────────────────────────────────────────────────
  avatar34:  34,   // standard phone avatar size
  avatar36:  36,   // InstituteSelection phone avatar
  avatar44:  44,   // tablet avatar size

  // ── Header Heights ────────────────────────────────────────────────────────
  // Android vs iOS values differ slightly; Platform branching is handled
  // in individual files, not here.
  headerPhone:   56,
  headerAndroid: 60,
  headerTablet:  72,

  // ── Card / Stat Specific ──────────────────────────────────────────────────
  // Stat card widths are percentage strings so they can be passed directly
  // to React Native style props without conversion.
  statCardWidth:       '47%',
  statCardWidthTablet: '45%',
  cardLogoSize:   44,   // institute logo size on phone
  cardLogoTablet: 56,   // institute logo size on tablet

  // ── maxWidths ─────────────────────────────────────────────────────────────
  // Constrains content width on wider screens (tablets / landscape).
  maxWidthHome:    560,
  maxWidthInst:    680,
  maxWidthRole:    680,
  maxWidthDash:    960,
};

export default spacing;