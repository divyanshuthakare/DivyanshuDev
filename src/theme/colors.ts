/**
 * colors.ts
 *
 * Central color palette for the app.
 * Organized into four exports:
 *   - baseColors:   mode-independent raw values (always the same regardless of theme)
 *   - lightColors:  token values for light mode
 *   - darkColors:   token values for dark mode
 *   - inverseColors: swapped palette (light gets dark values, dark gets light values),
 *                    useful for overlays or components that need to invert the current theme
 */

// ─── Base Colors Type ─────────────────────────────────────────────────────────
export interface BaseColors {
  // Brand colors
  blue:          string;
  blueDark:      string;
  blueHighlight: string;
  // Semantic / status colors
  green:         string;
  greenLight:    string;
  greenBlue:     string;
  red:           string;
  redBg:         string;
  orange:        string;
  orangeLight:   string;
  amber:         string;
  purple:        string;
  purpleLight:   string;
  purpleDark:    string;
  pink:          string;
  brown:         string;
  // India flag colors
  saffron:       string;
  navyBlue:      string;
  // Base neutrals
  white:         string;
  black:         string;
  transparent:   string;
  // Default input placeholder color
  placeholder:   string;
  // Stat card background colors
  statBg1:       string;
  statBg2:       string;
  statBg3:       string;
  statBg4:       string;
  // Stat card count text colors
  statCount1:    string;
  statCount2:    string;
  statCount3:    string;
  statCount4:    string;
  // Error banner colors
  errorText:     string;
  errorBannerBg: string;
  // Search result highlight colors
  hlLight:       string;
  hlDark:        string;
  hlLightBg:     string;
  hlDarkBg:      string;
  // Role badge / meta label colors
  roleGreen:     string;
  roleBlue:      string;
  rolePurple:    string;
  rolePink:      string;
  roleOrange:    string;
  roleAmber:     string;
  roleGray:      string;
  // Shadow colors
  shadowDark:    string;
  shadow2D:      string;
}

// ─── Mode Colors Type ─────────────────────────────────────────────────────────
export interface ModeColors {
  // Background surfaces
  pageBg:          string;
  headerBg:        string;
  cardBg:          string;
  inputBg:         string;
  setupCardBg:     string;
  iconButtonBg:    string;
  authCardBg:      string;
  instCardBg:      string;
  pillBg:          string;
  arrowBg:         string;
  statCardDarkBg:  string;
  // Text colors
  appTitle:              string;
  textPrimary:           string;
  textSecondary:         string;
  textTertiary:          string;
  textMuted:             string;
  taglineBlack:          string;
  taglineOrange:         string;
  taglinePurple:         string;
  taglineGray:           string;
  taglineBlackBold:      string;
  taglineBlue?:          string;
  dividerText:           string;
  bottomTaglineTitle:    string;
  bottomTaglineSubtitle: string;
  setupCardTop:          string;
  setupCardLink:         string;
  footerText:            string;
  footerLink:            string;
  welcomeTitle:          string;
  welcomeSub:            string;
  logoText:              string;
  greetingTitle:         string;
  locationText:          string;
  instituteType:         string;
  // Border colors
  inputBorder:     string;
  cardBorder:      string;
  instBorder:      string;
  pillBorder:      string;
  arrowBorder:     string;
  joinButtonBorder:string;
  dividerLine:     string;
  avatarBorder:    string;
  // Join button
  joinButtonBg:    string;
  joinButtonText:  string;
  joinButtonIcon:  string;
  // Avatar colors
  avatarBg:        string;
  avatarText:      string;
  // Icon colors
  iconColor:       string;
  arrowIcon:       string;
  instArrowIcon:   string;
  // Retry / action button background
  retryBg:         string;
  // StatusBar style string
  statusBar:       'default' | 'light-content' | 'dark-content';
  // Dark-mode-only alternate input colors (optional, present only in darkColors)
  inputBgAlt?:     string;
  inputBdrAlt?:    string;
}

// ─── Mode-independent raw values ─────────────────────────────────────────────
// These colors do not change between light and dark mode.
// Use them directly when a value must stay constant across themes.
export const baseColors: BaseColors = {
  // Brand colors
  blue:          '#0073FF',
  blueDark:      '#007AFF',
  blueHighlight: '#4DA3FF',

  // Semantic / status colors
  green:         '#1B6B5A',      // used as sendCodeButton background
  greenLight:    '#16A34A',
  greenBlue:     '#138808',      // India flag middle stripe
  red:           '#EF4444',
  redBg:         '#FEF2F2',
  orange:        '#F76C1D',
  orangeLight:   '#EA580C',
  amber:         '#F59E0B',
  purple:        '#7440F5',
  purpleLight:   '#8B5CF6',
  purpleDark:    '#7C3AED',
  pink:          '#E91E8C',
  brown:         '#E07B39',

  // India flag colors
  saffron:       '#FF9933',
  navyBlue:      '#000080',

  // Base neutrals
  white:         '#FFFFFF',
  black:         '#000000',
  transparent:   'transparent',

  // Default input placeholder color
  placeholder:   '#6B7280',

  // Stat card background colors — fixed regardless of theme
  statBg1:       '#DBEAFE',   // Active Institutes
  statBg2:       '#DCFCE7',   // Inactive Institutes
  statBg3:       '#FFEDD5',   // Total Modules
  statBg4:       '#EDE9FE',   // Total Users

  // Stat card count text colors — fixed regardless of theme
  statCount1:    '#2563EB',
  statCount2:    '#16A34A',
  statCount3:    '#EA580C',
  statCount4:    '#7C3AED',

  // Error banner colors
  errorText:     '#EF4444',
  errorBannerBg: '#FEF2F2',

  // Search result highlight colors for light and dark modes
  hlLight:       '#0073FF',
  hlDark:        '#4DA3FF',
  hlLightBg:     'rgba(0,115,255,0.08)',
  hlDarkBg:      'rgba(77,163,255,0.15)',

  // Role badge / meta label colors
  roleGreen:     '#27AE60',
  roleBlue:      '#2D84C8',
  rolePurple:    '#8B5CF6',
  rolePink:      '#E91E8C',
  roleOrange:    '#E07B39',
  roleAmber:     '#F59E0B',
  roleGray:      '#6B7280',

  // Shadow colors used in elevation styles
  shadowDark:    '#1A2B4A',
  shadow2D:      '#2D2D2D',
};

// ─── Light Mode ──────────────────────────────────────────────────────────────
// All semantic color tokens for light mode.
// Consume these via useThemeTokens() → c, not directly.
export const lightColors: ModeColors = {
  // Background surfaces
  pageBg:          '#F2F2F2',
  headerBg:        '#F2F2F2',
  cardBg:          '#FFFFFF',
  inputBg:         '#FFFFFF',
  setupCardBg:     '#FFFFFF',
  iconButtonBg:    '#FFFFFF',
  authCardBg:      'transparent',
  instCardBg:      '#E0ECFF',
  pillBg:          '#EFEFF3',
  arrowBg:         '#F7FAFC',
  statCardDarkBg:  '#1C1C1E',

  // Text colors
  appTitle:              '#000000',
  textPrimary:           '#07305D',
  textSecondary:         '#787878',
  textTertiary:          '#6B7280',
  textMuted:             '#808182',
  taglineBlack:          '#000000',
  taglineOrange:         '#F76C1D',
  taglinePurple:         '#7440F5',
  taglineGray:           '#58698C',
  taglineBlackBold:      '#000000',
  taglineBlue:           '#007AFF',
  dividerText:           '#07305D',
  bottomTaglineTitle:    '#000000',
  bottomTaglineSubtitle: '#77818C',
  setupCardTop:          '#6B7280',
  setupCardLink:         '#0073FF',
  footerText:            '#808182',
  footerLink:            '#0073FF',
  welcomeTitle:          '#1E3A5F',
  welcomeSub:            '#4B5563',
  logoText:              '#1E3A5F',
  greetingTitle:         '#07305D',
  locationText:          '#787878',
  instituteType:         '#6E6E73',

  // Border colors
  inputBorder:     '#D0D5DD',
  cardBorder:      '#EBEBEB',
  instBorder:      '#C2D8F0',
  pillBorder:      '#E2E2E7',
  arrowBorder:     '#e6e4e4',
  joinButtonBorder:'#D0D5DD',
  dividerLine:     '#000000',
  avatarBorder:    '#E2E2E7',

  // Join button (outlined style in light mode)
  joinButtonBg:    '#FFFFFF',
  joinButtonText:  '#000000',
  joinButtonIcon:  '#000000',

  // Avatar colors
  avatarBg:        '#FFFFFF',
  avatarText:      '#07305D',

  // Icon colors
  iconColor:       '#1A1A2E',
  arrowIcon:       '#1A2B4A',
  instArrowIcon:   '#07305D',

  // Retry / action button background
  retryBg:         '#0073FF',

  // React Native StatusBar style string for this mode
  statusBar:       'dark-content',
};

// ─── Dark Mode ───────────────────────────────────────────────────────────────
// All semantic color tokens for dark mode.
// Consume these via useThemeTokens() → c, not directly.
export const darkColors: ModeColors = {
  // Background surfaces
  pageBg:          '#101010',
  headerBg:        '#101010',
  cardBg:          '#181818',
  inputBg:         '#1C1C1E',
  setupCardBg:     '#181818',
  iconButtonBg:    '#1C1C1E',
  authCardBg:      'transparent',
  instCardBg:      '#181818',
  pillBg:          '#181818',
  arrowBg:         '#282828',
  statCardDarkBg:  '#1C1C1E',

  // Text colors
  appTitle:              '#FFFFFF',
  textPrimary:           '#F3F4F6',
  textSecondary:         '#B0B0B0',
  textTertiary:          '#9CA3AF',
  textMuted:             '#808182',
  taglineBlack:          '#B0B0B0',
  taglineOrange:         '#F76C1D',
  taglinePurple:         '#0073FF',
  taglineGray:           '#707070',
  taglineBlackBold:      '#B0B0B0',
  taglineBlue:           '#007AFF',
  dividerText:           '#C8C8C8',
  bottomTaglineTitle:    '#979797',
  bottomTaglineSubtitle: '#77818C',
  setupCardTop:          '#D3D1D1',
  setupCardLink:         '#007AFF',
  footerText:            '#808182',
  footerLink:            '#007AFF',
  welcomeTitle:          '#E5E7EB',
  welcomeSub:            '#9CA3AF',
  logoText:              '#E5E7EB',
  greetingTitle:         '#F3F4F6',
  locationText:          '#B0B0B0',
  instituteType:         '#B0B0B0',

  // Border colors
  inputBorder:     '#3A3A3C',
  cardBorder:      '#2D2D2D',
  instBorder:      '#2D2D2D',
  pillBorder:      '#2D2D2D',
  arrowBorder:     '#2D2D2D',
  joinButtonBorder:'#3A3A3C',
  dividerLine:     '#4B4B4B',
  avatarBorder:    '#3D3D3D',

  // Join button (filled style in dark mode)
  joinButtonBg:    '#1C1C1E',
  joinButtonText:  '#F9FAFB',
  joinButtonIcon:  '#F9FAFB',

  // Avatar colors
  avatarBg:        '#010A13',
  avatarText:      '#FFFFFF',

  // Icon colors
  iconColor:       '#FFFFFF',
  arrowIcon:       '#FFFFFF',
  instArrowIcon:   '#FFFFFF',

  // Retry / action button background
  retryBg:         '#0073FF',

  // React Native StatusBar style string for this mode
  statusBar:       'light-content',

  // Some screens (e.g. InstituteSelection) use a slightly different input
  // background in dark mode rather than the standard inputBg (#1C1C1E).
  inputBgAlt:      '#111111',
  inputBdrAlt:     '#2A2F3A',
};

// ─── Inverse Colors ───────────────────────────────────────────────────────────
// inverseColors maps each mode to the opposite palette.
// Useful when a component needs to render "against" the current theme,
// such as a dark overlay in a light-mode screen.
export interface InverseColors {
  light: ModeColors;
  dark:  ModeColors;
}

export const inverseColors: InverseColors = {
  light: darkColors,
  dark:  lightColors,
};

// ─── Default export: both palettes keyed for easy lookup ─────────────────────
interface ColorPalette {
  light:   ModeColors;
  dark:    ModeColors;
  inverse: InverseColors;
  base:    BaseColors;
}

const colorPalette: ColorPalette = {
  light:   lightColors,
  dark:    darkColors,
  inverse: inverseColors,
  base:    baseColors,
};

export default colorPalette;