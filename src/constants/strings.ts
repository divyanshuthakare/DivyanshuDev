/**
 * strings.js
 *
 * Central store for all user-facing text in the app.
 *
 * Keeping strings in one place makes it easy to:
 * - Maintain consistency across screens.
 * - Prepare for future localisation by swapping this file per locale.
 * - Update copy without hunting through individual screen files.
 *
 * Structure mirrors the screen/feature hierarchy so it's easy to find
 * the right string for a given context.
 *
 * Note on dynamic strings:
 * Several entries include inline comments showing how to interpolate
 * values at the call site (e.g. template literals or adjacent <Text> nodes).
 */

export const strings = {

  // ─── App-wide / Branding ──────────────────────────────────────────────────
  app: {
    name:          'MentrixOS',
    namePrefix:    'Mentrix',        // rendered in one colour
    nameSuffix:    'OS',             // rendered in accent colour (#0073FF)
    supportEmail:  'support@schoolcoreos.com',
  },

  // ─── Home Screen ─────────────────────────────────────────────────────────
  homeScreen: {

    // Tagline section — multi-part animated text rendered across two lines.
    // Each part may be styled in a different colour.
    tagline: {
      line1: {
        mentrixOS:  'MentrixOS = ',
        mentor:     'Mentor',
        plusMatrix: ' + Matrix + ',
        metrics:    'Metrics',
      },
      line2: {
        combinedInto:    ' combined into one ',
        operatingSystem: 'Operating System',
        forYourInstitute: ' for your institute',
      },
    },

    // Phone / OTP flow
    countryCode:       '+91',
    otpLabel:          'Enter 6-digit code',
    resendPrompt:      "Didn't get Code?",
    resendLink:        'Resend Code',

    // Input field placeholders
    placeholders: {
      phoneOrEmail: 'Phone or Email',
      password:     'Password',
    },

    // Button labels
    buttons: {
      sendCode:      'Send Code',
      usePassword:   'Use Password',
      continue:      'Continue',
      forgotPassword:'Forgot Password',
      back:          '← Back',
      joinInstitute: 'Join Institute',
      setupInstitute:'Setup Institute',
    },

    // OR divider between login options
    divider: {
      or: 'OR',
    },

    // Card prompting users who haven't set up an institute yet
    setupCard: {
      prompt:    "Don't have an institute yet?",
      linkLabel: 'Setup Institute',
    },

    // Tagline shown at the bottom of the home screen
    bottomTagline: {
      title:    'Easy-to-Use, End-to-End',
      subtitle: 'Smart AI SaaS for Your Institute',
    },

    // Legal footer
    footer: {
      prefix:    'By continuing, you agree to our',
      linkLabel: 'Terms & Privacy Policy',
    },

    // Inline error messages shown in the auth flow
    errors: {
      noTokenReceived:       'No token received. Please try again.',
      loginFailed:           'Login failed. Please check your credentials.',
    },
  },

  // ─── Institute Selection Screen ──────────────────────────────────────────
  instituteSelectionScreen: {

    // Greeting at the top of the screen.
    // Dynamic usage: `Hi, ${firstName}!`
    greeting: {
      hi:       'Hi,',
      subtitle: 'Select your institute to access your personalized\ndashboard',
    },

    // Search bar
    search: {
      placeholder: 'Search your institute...',
    },

    // Fallback values for institute card fields that may be missing from the API
    card: {
      locationNotAvailable: 'Location not available',
      typeFallback:         'Type',
    },

    // Loading spinner label
    loading: {
      text: 'Loading institutes…',
    },

    // Shown when the filtered list returns no results
    empty: {
      noInstitutesFound: 'No institutes found. Try a different search.',
    },

    // Error state retry button
    retry: {
      button: 'Retry',
    },

    // Footer help text.
    // Dynamic usage: append `support@schoolcoreos.com` as a tappable <Text>.
    footer: {
      cantFindPrompt: "Can't find your Institute? Contact your institute administrator\nor email us at",
      supportEmail:   'support@schoolcoreos.com',
    },

    // Inline error messages
    errors: {
      noRolesAssigned:         'No roles assigned to this institute.',
      failedToLoadInstitutes:  'Failed to load institutes',
      contextSelectionFailed:  'Context selection failed',
    },
  },

  // ─── Role Selection Screen ───────────────────────────────────────────────
  roleSelectionScreen: {

    // Pill button that navigates back to institute selection
    changeInstitute: 'Change Institute',

    // Screen heading and subtitle.
    // Dynamic subtitle usage: `Select how you'd like to access ${institute.institute_name}`
    heading:  'Choose Your Role',
    subtitlePrefix: "Select how you'd like to access",

    // Footer help text — same pattern as institute selection
    footer: {
      cantFindRole:  "Can't find your role? Contact your institute administrator\nor email us at",
      supportEmail:  'support@schoolcoreos.com',
    },

    // Inline error banner
    errors: {
      contextSelectionFailed: 'Context selection failed',
    },
  },

  // ─── Role Meta Descriptions ──────────────────────────────────────────────
  // Short descriptions shown beneath each role name on the role selection screen.
  // Keys match the role_name values returned by the API.
  roleMeta: {
    superAdmin:       'Full platform access',
    admin:            'Full system access',
    administrator:    'Full system access',
    instituteAdmin:   'Manage institute operations',
    principal:        'Institute oversight',
    trainer:          'Classes & course management',
    teacher:          'Class & grading',
    student:          'Academics & activities',
    parent:           'Track child progress',
    staff:            'Staff operations',
    defaultRole:      'Access your dashboard',  // fallback for unrecognised roles
  },

  // ─── Dashboard Screen ────────────────────────────────────────────────────
  dashboardScreen: {

    // Welcome heading — dynamic.
    // Usage: `Welcome to MentrixOS\n${userName}`
    welcomePrefix: 'Welcome to MentrixOS',

    // Stat cards — static seed data displayed while real data is loading
    // or for the super admin overview.
    stats: {
      activeInstitutes: {
        count:       '08',
        label:       'Active Institutes',
        description: 'Institutes actively operating and using the platform.',
      },
      inactiveInstitutes: {
        count:       '05',
        label:       'Inactive Institutes',
        description: 'Institutes currently inactive in system.',
      },
      totalModules: {
        count:       '15+',
        label:       'Total Modules',
        description: 'Features enabling workflows.',
      },
      totalUsers: {
        count:       '50+',
        label:       'Total Users',
        description: 'Registered users across institutes.',
      },
    },
  },

  // ─── Logout (useLogout hook / alert) ─────────────────────────────────────
  logout: {
    alertTitle:    'Logout',
    alertMessage:  'Are you sure you want to logout?',
    cancelButton:  'Cancel',
    confirmButton: 'Logout',
  },

  // ─── No Mail App Alert (openSupportEmail util) ────────────────────────────
  // Shown when the device has no mail app configured.
  // Dynamic: append the support email address at the call site.
  mailAlert: {
    noMailAppTitle:      'No Mail App Found',
    noMailAppMessage:    'Please email us directly at',
    unableToOpenTitle:   'Unable to Open Mail',
    unableToOpenMessage: 'Please email us directly at',
    okButton:            'OK',
  },

};

export default strings;