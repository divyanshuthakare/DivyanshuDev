/**
 * SvgIcons.js
 *
 * Centralised library of SVG icon components used across the app.
 * All icons are built with react-native-svg so they render sharply at
 * any size and respond to colour theming without importing image assets.
 *
 * Every icon component accepts:
 *   @prop {number}  size  - Width and height in dp (default varies per icon)
 *   @prop {string}  color - Stroke/fill colour (default '#000')
 *   @prop {object}  style - Optional extra style passed to the SVG element
 *
 * Role icons are collected into ROLE_ICON_MAP at the bottom of the file
 * so RoleSelectionScreen can look up the correct icon by role name.
 */

import React from 'react';
import Svg, { Path, Circle, Polyline, Line, Rect, G } from 'react-native-svg';

// ─── AlertTriangle ────────────────────────────────────────────────────────────
// Used for warning / notification buttons (e.g. the header bell icon).
export const AlertTriangleIcon = ({ size = 20, color = '#000', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    />
    <Line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Line x1="12" y1="17" x2="12.01" y2="17" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

// ─── Sun ──────────────────────────────────────────────────────────────────────
// Shown on the theme toggle button when dark mode is active.
export const SunIcon = ({ size = 20, color = '#000', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth={2} />
    <Line x1="12" y1="1"  x2="12" y2="3"  stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Line x1="12" y1="21" x2="12" y2="23" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64"  stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Line x1="1"  y1="12" x2="3"  y2="12" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Line x1="21" y1="12" x2="23" y2="12" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"  stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

// ─── Moon ─────────────────────────────────────────────────────────────────────
// Shown on the theme toggle button when light mode is active.
export const MoonIcon = ({ size = 20, color = '#000', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    />
  </Svg>
);

// ─── Eye ──────────────────────────────────────────────────────────────────────
// Shown in the password field when the text is hidden (tap to reveal).
export const EyeIcon = ({ size = 20, color = '#000', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={2} />
  </Svg>
);

// ─── EyeOff ───────────────────────────────────────────────────────────────────
// Shown in the password field when the text is visible (tap to hide).
export const EyeOffIcon = ({ size = 20, color = '#000', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    />
    <Path
      d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    />
    <Path
      d="M14.12 14.12a3 3 0 1 1-4.24-4.24"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    />
    <Line x1="1" y1="1" x2="23" y2="23" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

// ─── ChevronRight ─────────────────────────────────────────────────────────────
// Used in list rows and setup card to indicate a navigable item.
export const ChevronRightIcon = ({ size = 16, color = '#000', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Polyline
      points="9 18 15 12 9 6"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    />
  </Svg>
);

// ─── ArrowLeft ────────────────────────────────────────────────────────────────
// Used in the "Change Institute" pill and back navigation controls.
export const ArrowLeftIcon = ({ size = 16, color = '#000', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Line x1="19" y1="12" x2="5" y2="12" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Polyline points="12 19 5 12 12 5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ─── Search ───────────────────────────────────────────────────────────────────
// Used in the institute search bar.
export const SearchIcon = ({ size = 20, color = '#000', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth={2} />
    <Line x1="21" y1="21" x2="16.65" y2="16.65" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

// ─── MapPin ───────────────────────────────────────────────────────────────────
// Shown next to the institute location text in list cards.
export const MapPinIcon = ({ size = 11, color = '#000', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    />
    <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth={2} />
  </Svg>
);

// ─── AlertCircle ──────────────────────────────────────────────────────────────
// Used in inline error banners and the error state of the institute list.
export const AlertCircleIcon = ({ size = 20, color = '#000', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Line x1="12" y1="8"  x2="12" y2="12" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Line x1="12" y1="16" x2="12.01" y2="16" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

// ─── QrcodeScan ───────────────────────────────────────────────────────────────
// Used on the "Join Institute" button on the Home screen.
export const QrcodeScanIcon = ({ size = 20, color = '#000', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    {/* Corner brackets that frame the scan area */}
    <Path d="M3 7V3h4"   stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M17 3h4v4"  stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M21 17v4h-4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M7 21H3v-4"  stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    {/* Top-left QR finder block */}
    <Rect x="5"   y="5"   width="5" height="5" rx="0.5" stroke={color} strokeWidth={1.5} />
    <Rect x="6.5" y="6.5" width="2" height="2" fill={color} />
    {/* Top-right QR finder block */}
    <Rect x="14"   y="5"   width="5" height="5" rx="0.5" stroke={color} strokeWidth={1.5} />
    <Rect x="15.5" y="6.5" width="2" height="2" fill={color} />
    {/* Bottom-left QR finder block */}
    <Rect x="5"   y="14"   width="5" height="5" rx="0.5" stroke={color} strokeWidth={1.5} />
    <Rect x="6.5" y="15.5" width="2" height="2" fill={color} />
    {/* Bottom-right dot pattern (data area approximation) */}
    <Rect x="14" y="14" width="2" height="2" fill={color} />
    <Rect x="17" y="14" width="2" height="2" fill={color} />
    <Rect x="14" y="17" width="2" height="2" fill={color} />
    <Rect x="17" y="17" width="2" height="2" fill={color} />
  </Svg>
);

// ─── Role Icons ───────────────────────────────────────────────────────────────
// Each icon represents a user role and is shown in the role selection list.

// Student — graduation cap silhouette
export const StudentRoleIcon = ({ size = 22, color = '#000', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    {/* Cap brim */}
    <Path
      d="M12 3L2 8l10 5 10-5-10-5z"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    />
    {/* Side strings that drape down */}
    <Path
      d="M6 10.5v5a6 6 0 0 0 12 0v-5"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    />
    {/* Right tassel drop and its ball */}
    <Line x1="20" y1="8" x2="20" y2="14" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Circle cx="20" cy="15" r="1" fill={color} />
  </Svg>
);

// Teacher / used for the Teacher role
export const TeacherRoleIcon = ({ size = 22, color = '#000', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    {/* Chalkboard */}
    <Rect x="2" y="3" width="20" height="13" rx="2" stroke={color} strokeWidth={2} />
    {/* Writing lines on the board */}
    <Line x1="6" y1="9"  x2="14" y2="9"  stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Line x1="6" y1="13" x2="10" y2="13" stroke={color} strokeWidth={2} strokeLinecap="round" />
    {/* Easel stand legs */}
    <Path d="M8 20l4-4 4 4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Admin / Super Admin / Administrator / Institute Admin — shield with checkmark
export const AdminRoleIcon = ({ size = 22, color = '#000', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V6L12 2z"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    />
    {/* Checkmark inside the shield */}
    <Polyline
      points="9 12 11 14 15 10"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    />
  </Svg>
);

// Principal — building / institution facade
export const PrincipalRoleIcon = ({ size = 22, color = '#000', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    {/* Roof / pediment */}
    <Polyline
      points="3 10 12 3 21 10"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    />
    {/* Main body of the building */}
    <Rect x="4" y="10" width="16" height="11" rx="1" stroke={color} strokeWidth={2} />
    {/* Front door */}
    <Rect x="9" y="15" width="6" height="6" rx="0.5" stroke={color} strokeWidth={1.8} />
    {/* Left and right windows */}
    <Rect x="6"  y="12.5" width="3" height="2.5" rx="0.5" stroke={color} strokeWidth={1.5} />
    <Rect x="15" y="12.5" width="3" height="2.5" rx="0.5" stroke={color} strokeWidth={1.5} />
  </Svg>
);

// Parent — house silhouette representing home and family
export const ParentRoleIcon = ({ size = 22, color = '#000', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    />
    {/* Door */}
    <Rect x="9" y="14" width="6" height="7" rx="0.5" stroke={color} strokeWidth={1.8} />
  </Svg>
);

// Staff — briefcase
export const StaffRoleIcon = ({ size = 22, color = '#000', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    {/* Briefcase body */}
    <Rect x="2" y="7" width="20" height="14" rx="2" stroke={color} strokeWidth={2} />
    {/* Handle at the top */}
    <Path
      d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    />
    {/* Horizontal centre bar */}
    <Line x1="2" y1="14" x2="22" y2="14" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

// Trainer — dumbbell (reused for the Trainer role distinct from Teacher)
export const TrainerRoleIcon = ({ size = 22, color = '#000', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    {/* Centre bar */}
    <Line x1="8" y1="12" x2="16" y2="12" stroke={color} strokeWidth={2} strokeLinecap="round" />
    {/* Left inner and outer weight plates */}
    <Rect x="2"  y="9"  width="3" height="6" rx="1" stroke={color} strokeWidth={2} />
    <Rect x="5"  y="10" width="3" height="4" rx="0.5" stroke={color} strokeWidth={2} />
    {/* Right inner and outer weight plates */}
    <Rect x="16" y="10" width="3" height="4" rx="0.5" stroke={color} strokeWidth={2} />
    <Rect x="19" y="9"  width="3" height="6" rx="1" stroke={color} strokeWidth={2} />
  </Svg>
);

// Default — generic person silhouette for roles not explicitly mapped
export const DefaultRoleIcon = ({ size = 22, color = '#000', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={2} />
    <Path
      d="M4 20c0-4 3.58-7 8-7s8 3 8 7"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    />
  </Svg>
);

// ─── Menu (hamburger) ─────────────────────────────────────────────────────────
// Used in the Dashboard header to open the side/drawer menu.
export const MenuIcon = ({ size = 22, color = '#000', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Line x1="3" y1="6"  x2="21" y2="6"  stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Line x1="3" y1="12" x2="21" y2="12" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Line x1="3" y1="18" x2="21" y2="18" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

// ─── ROLE_ICON_MAP ────────────────────────────────────────────────────────────
// Maps API role_name strings to their corresponding icon component.
// RoleSelectionScreen uses this map to look up the correct icon per role.
// Falls back to DefaultRoleIcon for any role_name not listed here.
export const ROLE_ICON_MAP = {
  'Student':         StudentRoleIcon,
  'Teacher':         TeacherRoleIcon,
  'Trainer':         TrainerRoleIcon,
  'Admin':           AdminRoleIcon,
  'Super Admin':     AdminRoleIcon,
  'Administrator':   AdminRoleIcon,
  'Institute Admin': AdminRoleIcon,
  'Principal':       PrincipalRoleIcon,
  'Parent':          ParentRoleIcon,
  'Staff':           StaffRoleIcon,
};