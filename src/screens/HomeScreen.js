/**
 * HomeScreen.js
 *
 * Entry screen of the app — handles both phone (OTP) and email/password login.
 *
 * Auth flow states:
 *   'default'  → unified input shown, no method chosen yet
 *   'phone'    → user typed digits; shows country code + phone input + Send Code
 *   'otp'      → OTP boxes visible after Send Code is tapped
 *   'email'    → user typed an @-sign; shows two buttons (Send Code / Use Password)
 *   'password' → password input + Continue button
 *
 * On successful login the screen navigates to InstituteSelection.
 * Layout is responsive — phone and tablet get slightly different layouts and
 * font sizes. Phone landscape hides the bottom tagline block to save space.
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  ActivityIndicator,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import AppSafeArea from '../components/AppSafeArea';
import { useNavigation } from '@react-navigation/native';

import {
  AlertTriangleIcon,
  SunIcon,
  MoonIcon,
  EyeIcon,
  EyeOffIcon,
  ChevronRightIcon,
  QrcodeScanIcon,
} from '../components/SvgIcons';

import styles from '../styles/HomeScreen.styles';
import { loginWithEmail } from '../services/api';
import { saveLoginData } from '../utils/storage';

// Theme tokens
import { useThemeTokens } from '../theme';
import { baseColors } from '../theme/colors';
import spacing from '../theme/spacing';

// ─── IndiaFlag ────────────────────────────────────────────────────────────────
/**
 * Renders a simplified Indian tricolour flag beside the country code (+91).
 * Uses coloured view stripes and a circular approximation of the Ashoka Chakra.
 * @param {{ size: number }} props
 */
function IndiaFlag({ size = 22 }) {
  const w      = size * 1.45;
  const h      = size;
  const stripe = h / 3;  // height of each horizontal stripe
  return (
    <View
      style={{
        width:        w,
        height:       h,
        borderRadius: spacing.br2,
        overflow:     'hidden',
        borderWidth:  spacing.bw05,
        borderColor:  '#cccccc',
      }}
    >
      {/* Top saffron stripe */}
      <View style={{ height: stripe, backgroundColor: baseColors.saffron }} />

      {/* White stripe with a circular Ashoka Chakra approximation */}
      <View
        style={{
          height:          stripe,
          backgroundColor: baseColors.white,
          alignItems:      'center',
          justifyContent:  'center',
        }}
      >
        <View
          style={{
            width:        stripe * 0.6,
            height:       stripe * 0.6,
            borderRadius: stripe * 0.3,
            borderWidth:  spacing.bw08,
            borderColor:  baseColors.navyBlue,
          }}
        />
      </View>

      {/* Bottom green stripe */}
      <View style={{ height: stripe, backgroundColor: baseColors.greenBlue }} />
    </View>
  );
}

// ─── HomeScreen ───────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const navigation                         = useNavigation();
  const { isDark: isDarkMode, theme, toggleTheme, c, base } = useThemeTokens();
  const { width, height: screenHeight }    = useWindowDimensions();

  // Breakpoint flags
  const isTablet         = width >= 768;
  const isLandscape      = width > screenHeight;
  const isPhoneLandscape = !isTablet && isLandscape;

  // ── Auth state ──────────────────────────────────────────────────────────────
  const [inputValue,   setInputValue]   = useState('');      // shared phone/email field
  const [flowState,    setFlowState]    = useState('default');
  const [otp,          setOtp]          = useState(['', '', '', '', '', '']); // 6-digit array
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);   // eye icon toggle
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError,   setLoginError]   = useState(null);

  // Refs for OTP boxes — used to auto-advance focus as digits are entered
  const otpRefs = useRef([null, null, null, null, null, null]);

  // ── Derived booleans — makes JSX conditionals more readable ────────────────
  const isDefault  = flowState === 'default';
  const isPhone    = flowState === 'phone';
  const isOtp      = flowState === 'otp';
  const isEmail    = flowState === 'email';
  const isPassword = flowState === 'password';

  // True when the OR divider and Join button should be hidden
  const hideOrJoin = isOtp || isPassword;

  // ── Handlers ────────────────────────────────────────────────────────────────

  /**
   * Fires on every keystroke in the main input field.
   * - Strips non-numeric characters when the user is typing a phone number.
   * - Transitions the flow state between 'default', 'phone', and 'email'
   *   based on what the user has typed.
   */
  const handleInputChange = useCallback((text) => {
    setLoginError(null);

    const hasAtSymbol = text.includes('@');
    let sanitised = text;
    // If it looks like a phone number, keep only digits
    if (!hasAtSymbol && /^[0-9]/.test(text)) {
      sanitised = text.replace(/[^0-9]/g, '');
    }

    setInputValue(sanitised);

    // Clear the flow if the field is emptied
    if (sanitised.length === 0) {
      setFlowState('default');
      setOtp(['', '', '', '', '', '']);
      setPassword('');
      return;
    }

    const looksLikePhone = /^[0-9]+$/.test(sanitised);
    const hasAt          = sanitised.includes('@');

    // Derive the new flow state without overwriting 'email' if already there
    setFlowState(prev => {
      if (looksLikePhone)   return 'phone';
      if (hasAt)            return 'email';
      if (prev === 'email') return 'email';
      return 'default';
    });
  }, []);

  /**
   * Handles a single OTP digit change.
   * Strips non-numeric input and advances focus to the next box automatically.
   */
  const handleOtpChange = useCallback((value, index) => {
    const cleaned = value.replace(/[^0-9]/g, '').slice(-1);
    setOtp(prev => {
      const next = [...prev];
      next[index] = cleaned;
      return next;
    });
    // Move to the next box when a digit was successfully entered
    if (cleaned && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }, []);

  /**
   * Handles the Backspace key inside an OTP box.
   * Clears the previous box and moves focus back when the current box is empty.
   */
  const handleOtpKeyPress = useCallback((key, index) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      setOtp(prev => {
        const next = [...prev];
        next[index - 1] = '';
        return next;
      });
      otpRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  /**
   * Transitions to the OTP state and focuses the first box after a short delay
   * to allow the OTP input row to render first.
   */
  const handleSendCode = useCallback(() => {
    setFlowState('otp');
    setTimeout(() => otpRefs.current[0]?.focus(), 150);
  }, []);

  /**
   * Clears the current OTP entry and refocuses the first box so the user
   * can type in the new code they received.
   */
  const handleResend = useCallback(() => {
    setOtp(['', '', '', '', '', '']);
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  }, []);

  /**
   * Switches from the email flow to the password flow.
   */
  const handleUsePassword = useCallback(() => {
    setLoginError(null);
    setFlowState('password');
  }, []);

  /**
   * Navigates back one step in the auth flow:
   * - From OTP → back to phone or email (depending on input type)
   * - From password → back to email
   */
  const handleBack = useCallback(() => {
    setLoginError(null);
    if (isOtp) {
      setFlowState(inputValue.includes('@') ? 'email' : 'phone');
      setOtp(['', '', '', '', '', '']);
    } else if (isPassword) {
      setFlowState('email');
      setPassword('');
    }
  }, [isOtp, isPassword, inputValue]);

  /**
   * Advances to InstituteSelection after a completed OTP entry.
   * Does nothing if the user hasn't filled all 6 boxes.
   */
  const handleOtpContinue = useCallback(() => {
    const filled = otp.every(d => d !== '');
    if (!filled) return;
    navigation.navigate('InstituteSelection', { identifier: inputValue.trim() });
  }, [otp, navigation, inputValue]);

  /**
   * Submits the email + password credentials to the API.
   * On success: saves the token and user data, then navigates to InstituteSelection.
   * On failure: shows an inline error message.
   *
   * Supports multiple token field names returned by different API responses
   * (pre_context_token, token, access_token).
   */
  const handlePasswordContinue = useCallback(async () => {
    if (!password.trim()) return;
    try {
      setLoginLoading(true);
      setLoginError(null);

      const data = await loginWithEmail({
        email:    inputValue.trim(),
        password: password.trim(),
      });

      // Normalise the token field — API may return it under different keys
      const token =
        data.pre_context_token ||
        data.token              ||
        data.access_token       ||
        '';

      if (!token) throw new Error('No token received. Please try again.');

      await saveLoginData(token, data.user || {});
      navigation.navigate('InstituteSelection', { identifier: inputValue.trim() });
    } catch (err) {
      setLoginError(err?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoginLoading(false);
    }
  }, [inputValue, password, navigation]);

  /**
   * Renders the top-right icon buttons (notifications + theme toggle).
   * Extracted as a function so the same buttons can be rendered in two
   * different positions: absolute on tablet, inline on phone.
   */
  const renderTopButtons = () => (
    <View style={styles.topRow}>
      <TouchableOpacity
        style={[styles.iconButton, { backgroundColor: theme.iconButtonBg }]}
        activeOpacity={0.7}
      >
        <AlertTriangleIcon size={isTablet ? spacing.icon24 : spacing.icon20} color={theme.iconColor} />
      </TouchableOpacity>

      {/* Theme toggle: shows sun when dark, moon when light */}
      <TouchableOpacity
        style={[styles.iconButton, { backgroundColor: theme.iconButtonBg }]}
        activeOpacity={0.7}
        onPress={toggleTheme}
      >
        {isDarkMode
          ? <SunIcon  size={isTablet ? spacing.icon24 : spacing.icon20} color={theme.iconColor} />
          : <MoonIcon size={isTablet ? spacing.icon24 : spacing.icon20} color={theme.iconColor} />
        }
      </TouchableOpacity>
    </View>
  );

  // Card background token — used for the tablet login card wrapper
  const cardBg = c.cardBg;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <AppSafeArea style={[styles.safeArea, { backgroundColor: theme.scrollBg }]}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.scrollBg} />

      {/* On tablet the top buttons are absolutely positioned top-right */}
      {isTablet && (
        <View style={[
          styles.tabletTopButtons,
          width >= 1024 && styles.tabletTopButtonsIpad,
        ]}>
          {renderTopButtons()}
        </View>
      )}

      {/* KeyboardAvoidingView shifts the layout up when the keyboard appears */}
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            isTablet && { minHeight: screenHeight },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          <View style={[
            styles.outerPad,
            isTablet && styles.outerPadTablet,
            isTablet && {
              // Extra top padding on tablet adjusts for landscape vs portrait
              // and for larger iPads vs smaller Android tablets.
              paddingTop: isLandscape
                ? (width >= 1024 ? spacing.sp44 : spacing.sp36)
                : (width >= 1024 ? 120 : 95),
            },
          ]}>

            {/* Phone layout: top buttons sit inline above the logo */}
            {!isTablet && renderTopButtons()}

            {/*
              On tablet: the login form is wrapped in a card with a shadow.
              On phone: the wrapper is transparent — the content fills the screen.
            */}
            <View
              style={[
                isTablet && {
                  alignSelf:         'center',
                  width:             '100%',
                  maxWidth:          spacing.maxWidthHome,
                  backgroundColor:   cardBg,
                  borderRadius:      spacing.br18,
                  paddingHorizontal: spacing.sp32,
                  paddingTop:        spacing.sp28,
                  paddingBottom:     spacing.sp28,
                  shadowColor:       base.black,
                  shadowOffset:      { width: spacing.sp0, height: spacing.sp2 },
                  shadowOpacity:     isDarkMode ? 0.4 : 0.08,
                  shadowRadius:      spacing.sp12,
                  elevation:         4,
                },
              ]}
            >

              {/* ── Logo section ──────────────────────────────────────── */}
              <View style={styles.logoSection}>
                <Image
                  source={
                    isDarkMode
                      ? require('../assets/images/logo-dark.png')
                      : require('../assets/images/logo.png')
                  }
                  style={[styles.logoImage, isTablet && styles.logoImageTablet]}
                />
                <Text
                  style={[
                    styles.appTitle,
                    { color: theme.appTitle },
                    isTablet && styles.appTitleTablet,
                  ]}
                >
                  Mentrix<Text style={styles.appTitleBlue}>OS</Text>
                </Text>
              </View>

              {/* ── Tagline — two lines with multi-colour segments ──────── */}
              <View style={styles.taglineSection}>
                <Text style={[styles.taglineLine1, isTablet && styles.taglineLine1Tablet]}>
                  <Text style={{ color: theme.taglineBlack,     fontWeight: '700' }}>MentrixOS = </Text>
                  <Text style={{ color: theme.taglineOrange,    fontWeight: '700' }}>Mentor</Text>
                  <Text style={{ color: theme.taglineBlack,     fontWeight: '700' }}> + Matrix + </Text>
                  <Text style={{ color: theme.taglinePurple,    fontWeight: '700' }}>Metrics</Text>
                </Text>
                <Text style={[styles.taglineLine2, isTablet && styles.taglineLine2Tablet]}>
                  <Text style={{ color: theme.taglineGray }}> combined into one </Text>
                  <Text style={{ color: theme.taglineBlackBold, fontWeight: '700' }}>Operating System</Text>
                  <Text style={{ color: theme.taglineGray }}> for your institute</Text>
                </Text>
              </View>

              {/* ── Auth Card — renders different UI per flowState ──────── */}
              <View
                style={[
                  styles.authCard,
                  isTablet && [
                    styles.authCardTablet,
                    { backgroundColor: base.transparent, padding: spacing.sp0, marginVertical: spacing.sp0 },
                  ],
                ]}
              >

                {/* ── OTP state: phone display + 6 digit boxes ──────────── */}
                {isOtp && (
                  <>
                    {/* Show the locked-in phone number at the top */}
                    <View style={styles.phoneRow}>
                      <View style={[
                        styles.countryCodeBox,
                        { backgroundColor: theme.inputBg, borderColor: theme.inputBorder },
                      ]}>
                        <IndiaFlag size={spacing.icon20} />
                        <Text style={[styles.countryCodeText, { color: theme.inputText }]}>+91</Text>
                      </View>
                      <View style={[
                        styles.phoneNumberBox,
                        { backgroundColor: theme.inputBg, borderColor: theme.inputBorder },
                      ]}>
                        <Text style={[styles.phoneNumberText, { color: theme.inputText }]}>
                          {inputValue}
                        </Text>
                      </View>
                    </View>

                    <Text style={[styles.otpLabel, { color: theme.setupCardLink }]}>
                      Enter 6-digit code
                    </Text>

                    {/* 6 individual OTP input boxes */}
                    <View style={styles.otpRow}>
                      {otp.map((digit, index) => (
                        <TextInput
                          key={index}
                          ref={ref => { otpRefs.current[index] = ref; }}
                          style={[
                            styles.otpBox,
                            {
                              backgroundColor: theme.inputBg,
                              borderColor:     theme.inputBorder,
                              color:           theme.inputText,
                            },
                            isTablet && styles.otpBoxTablet,
                          ]}
                          value={digit}
                          onChangeText={value => handleOtpChange(value, index)}
                          onKeyPress={({ nativeEvent }) => handleOtpKeyPress(nativeEvent.key, index)}
                          keyboardType="phone-pad"
                          maxLength={1}
                          textAlign="center"
                          selectTextOnFocus
                        />
                      ))}
                    </View>

                    {/* Resend code prompt */}
                    <View style={styles.resendRow}>
                      <Text style={[styles.resendText, { color: theme.bottomTaglineSubtitle }]}>
                        Didn't get Code?{' '}
                      </Text>
                      <TouchableOpacity activeOpacity={0.7} onPress={handleResend}>
                        <Text style={[styles.resendLink, { color: theme.setupCardLink }]}>
                          Resend Code
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={styles.sendCodeButton}
                      activeOpacity={0.8}
                      onPress={handleOtpContinue}
                    >
                      <Text style={[styles.sendCodeButtonText, isTablet && styles.sendCodeButtonTextTablet]}>
                        Continue
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.backLinkRow}
                      activeOpacity={0.7}
                      onPress={handleBack}
                    >
                      <Text style={[styles.backLinkText, { color: theme.setupCardTop }]}>
                        ← Back
                      </Text>
                    </TouchableOpacity>
                  </>
                )}

                {/* ── Phone state: country code box + editable phone input ── */}
                {isPhone && (
                  <>
                    <View style={styles.phoneRow}>
                      <View style={[
                        styles.countryCodeBox,
                        { backgroundColor: theme.inputBg, borderColor: theme.inputBorder },
                      ]}>
                        <IndiaFlag size={spacing.icon20} />
                        <Text style={[styles.countryCodeText, { color: theme.inputText }]}>+91</Text>
                      </View>
                      <TextInput
                        style={[
                          styles.phoneNumberInput,
                          {
                            backgroundColor: theme.inputBg,
                            borderColor:     theme.inputBorder,
                            color:           theme.inputText,
                          },
                          isTablet && styles.unifiedInputTablet,
                        ]}
                        placeholder=""
                        placeholderTextColor={base.placeholder}
                        value={inputValue}
                        onChangeText={handleInputChange}
                        keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'default'}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoFocus
                      />
                    </View>

                    <TouchableOpacity
                      style={styles.sendCodeButton}
                      activeOpacity={0.8}
                      onPress={handleSendCode}
                    >
                      <Text style={[styles.sendCodeButtonText, isTablet && styles.sendCodeButtonTextTablet]}>
                        Send Code
                      </Text>
                    </TouchableOpacity>
                  </>
                )}

                {/* ── Default / Email / Password: unified single-line input ── */}
                {/* Shared across all three states; changes keyboard type for email */}
                {(isDefault || isEmail || isPassword) && (
                  <TextInput
                    style={[
                      styles.unifiedInput,
                      {
                        backgroundColor: theme.inputBg,
                        borderColor:     theme.inputBorder,
                        color:           theme.inputText,
                      },
                      isTablet && styles.unifiedInputTablet,
                    ]}
                    placeholder="Phone or Email"
                    placeholderTextColor={base.placeholder}
                    value={inputValue}
                    onChangeText={handleInputChange}
                    keyboardType={isEmail ? 'email-address' : 'default'}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                )}

                {/* ── Email state: two action buttons side by side ─────────── */}
                {isEmail && (
                  <View style={styles.emailButtonsRow}>
                    <TouchableOpacity
                      style={[styles.sendCodeButton, styles.emailButtonHalf]}
                      activeOpacity={0.8}
                      onPress={handleSendCode}
                    >
                      <Text style={[styles.sendCodeButtonText, isTablet && styles.sendCodeButtonTextTablet]}>
                        Send Code
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.sendCodeButton, styles.emailButtonHalf]}
                      activeOpacity={0.8}
                      onPress={handleUsePassword}
                    >
                      <Text style={[styles.sendCodeButtonText, isTablet && styles.sendCodeButtonTextTablet]}>
                        Use Password
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* ── Password state: secure input + Continue ──────────────── */}
                {isPassword && (
                  <>
                    {/* Password input with eye toggle to show/hide */}
                    <View style={styles.passwordInputWrapper}>
                      <TextInput
                        style={[
                          styles.passwordInput,
                          {
                            backgroundColor: theme.inputBg,
                            color:           theme.inputText,
                            borderColor:     theme.inputBorder,
                          },
                          isTablet && styles.passwordInputTablet,
                        ]}
                        placeholder="Password"
                        placeholderTextColor={base.placeholder}
                        value={password}
                        onChangeText={text => {
                          setPassword(text);
                          setLoginError(null);
                        }}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoFocus
                      />
                      <TouchableOpacity
                        style={styles.passwordEyeButton}
                        activeOpacity={0.7}
                        onPress={() => setShowPassword(prev => !prev)}
                      >
                        {showPassword
                          ? <EyeOffIcon size={isTablet ? spacing.icon24 : spacing.icon20} color={base.placeholder} />
                          : <EyeIcon    size={isTablet ? spacing.icon24 : spacing.icon20} color={base.placeholder} />
                        }
                      </TouchableOpacity>
                    </View>

                    {/* Forgot password link — placeholder for future implementation */}
                    <TouchableOpacity activeOpacity={0.7} style={styles.forgotPasswordRow}>
                      <Text style={[styles.forgotPasswordText, { color: theme.setupCardLink }]}>
                        Forgot Password
                      </Text>
                    </TouchableOpacity>

                    {/* Continue button — shows a spinner while the API request is in flight */}
                    <TouchableOpacity
                      style={[styles.sendCodeButton, { marginTop: spacing.sp14, opacity: loginLoading ? 0.7 : 1 }]}
                      activeOpacity={0.8}
                      onPress={handlePasswordContinue}
                      disabled={loginLoading}
                    >
                      {loginLoading
                        ? <ActivityIndicator color={base.white} />
                        : <Text style={[styles.sendCodeButtonText, isTablet && styles.sendCodeButtonTextTablet]}>
                            Continue
                          </Text>
                      }
                    </TouchableOpacity>

                    {/* Inline error message shown after a failed login attempt */}
                    {loginError ? (
                      <Text style={[styles.loginError, isTablet && styles.loginErrorTablet]}>
                        {loginError}
                      </Text>
                    ) : null}

                    <TouchableOpacity
                      style={styles.backLinkRow}
                      activeOpacity={0.7}
                      onPress={handleBack}
                    >
                      <Text style={[styles.backLinkText, { color: theme.setupCardTop }]}>
                        ← Back
                      </Text>
                    </TouchableOpacity>
                  </>
                )}

              </View>{/* /authCard */}

              {/* ── OR divider + Join Institute button ─────────────────────── */}
              {/* Hidden during OTP and password flows to keep the UI clean */}
              {!hideOrJoin && (
                <View style={[
                  styles.orJoinWrapper,
                  isTablet && { paddingHorizontal: spacing.sp0 },
                ]}>
                  <View style={styles.dividerRow}>
                    <View style={[styles.dividerLine, { backgroundColor: theme.dividerLine }]} />
                    <Text style={[styles.dividerText, { color: theme.dividerText }]}>OR</Text>
                    <View style={[styles.dividerLine, { backgroundColor: theme.dividerLine }]} />
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.joinButton,
                      { backgroundColor: theme.joinButtonBg, borderColor: theme.joinButtonBorder },
                    ]}
                    activeOpacity={0.7}
                  >
                    <QrcodeScanIcon
                      size={isTablet ? spacing.icon24 : spacing.icon20}
                      color={theme.joinButtonIcon}
                      style={styles.joinButtonIcon}
                    />
                    <Text style={[
                      styles.joinButtonText,
                      { color: theme.joinButtonText },
                      isTablet && styles.joinButtonTextTablet,
                    ]}>
                      Join Institute
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

            </View>{/* /tablet login card wrapper */}

            {/* ── Bottom tagline — hidden on phone landscape to save space ── */}
            {!isPhoneLandscape && (
              <View style={[
                styles.taglineBlock,
                isTablet && { alignSelf: 'center', width: '100%', maxWidth: spacing.maxWidthHome },
                isTablet && isLandscape && { minHeight: 40 },
              ]}>
                <Text style={[
                  styles.bottomTaglineTitle,
                  { color: theme.bottomTaglineTitle },
                  isTablet && styles.bottomTaglineTitleTablet,
                ]}>
                  Easy-to-Use, End-to-End
                </Text>
                <Text style={[
                  styles.bottomTaglineSubtitle,
                  { color: theme.bottomTaglineSubtitle },
                  isTablet && styles.bottomTaglineSubtitleTablet,
                ]}>
                  Smart AI SaaS for Your Institute
                </Text>
              </View>
            )}

            {/* ── Setup card — prompts users who haven't set up an institute ── */}
            <TouchableOpacity
              style={[
                styles.setupCard,
                { backgroundColor: theme.setupCardBg },
                isTablet && { alignSelf: 'center', width: '100%', maxWidth: spacing.maxWidthHome },
              ]}
              activeOpacity={0.8}
            >
              <Text style={[styles.setupCardTop, { color: theme.setupCardTop }]}>
                Don't have an institute yet?
              </Text>
              <View style={styles.setupCardLinkRow}>
                <Text style={[styles.setupCardLink, { color: theme.setupCardLink }]}>
                  Setup Institute
                </Text>
                <ChevronRightIcon size={spacing.icon18} color={theme.setupCardLink} />
              </View>
            </TouchableOpacity>

            {/* ── Legal footer ────────────────────────────────────────────── */}
            <View style={[
              styles.footer,
              isTablet && { alignSelf: 'center', width: '100%', maxWidth: spacing.maxWidthHome },
            ]}>
              <Text style={[styles.footerText, { color: theme.footerText }]}>
                By continuing, you agree to our
              </Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={[styles.footerLink, { color: theme.footerLink }]}>
                  Terms & Privacy Policy
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppSafeArea>
  );
}