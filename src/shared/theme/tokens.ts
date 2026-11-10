import { Platform, StyleSheet, TextStyle } from 'react-native';

export const palette = {
  // New System
  background: '#050506',
  surface: '#111113',
  surfaceElevated: '#1A1A1D',
  border: 'rgba(255,255,255,0.06)',
  textPrimary: '#FFFFFF',
  textSecondary: '#8E8E93',
  textTertiary: '#55555A',
  fillDone: '#D4D4D8',
  accentToday: '#2F6BFF',
  positive: '#34D399',
  alert: '#FF5B1F',

  // Tab bar flotante
  tabBarBg: 'rgba(21,21,23,0.85)',
  tabBarBorder: 'rgba(255,255,255,0.08)',
  tabBarIndicator: 'rgba(255,255,255,0.14)',
  shadow: '#000000',

  // Backward compatibility aliases
  bg: '#050506',
  card: '#111113',
  cardBorder: 'rgba(255,255,255,0.06)',
  line: 'rgba(255,255,255,0.06)',
  ink: '#FFFFFF',
  mute: '#8E8E93',
  subtle: '#55555A',
  surfaceHighlight: '#1A1A1D',
  electricBlue: '#2F6BFF',
  greenDelta: '#34D399',
  greenDeltaBg: '#34D399',
  hot: '#FF5B1F',
  primaryPill: '#2F6BFF',
  onPrimaryPill: '#FFFFFF',
  acc: '#2F6BFF',
  onAcc: '#FFFFFF',
  inkSecondary: '#8E8E93',
} as const;

export const radii = {
  cardBig: 28,
  tile: 24,
  pill: 999, // chip & button & heatmap
} as const;

export const radius = {
  sm: 12,
  md: 16,
  lg: 24,
  xl: radii.cardBig,
  pill: 999,
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  s: 12,
  m: 16,
  l: 20,
  xl: 24,
  xxl: 32,
  // Aliases
  sm: 12,
  md: 16,
  lg: 20,
} as const;

export const fontFamilies = {
  regular: Platform.select({ ios: 'System', default: 'Inter_400Regular' }),
  medium: Platform.select({ ios: 'System', default: 'Inter_500Medium' }),
  semiBold: Platform.select({ ios: 'System', default: 'Inter_600SemiBold' }),
  bold: Platform.select({ ios: 'System', default: 'Inter_700Bold' }),
};

const _typography = {
  display: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 56,
    fontWeight: '600' as const,
    color: palette.textPrimary,
    fontVariant: ['tabular-nums'] as any,
  },
  title: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 34,
    fontWeight: '600' as const,
    color: palette.textPrimary,
    fontVariant: ['tabular-nums'] as any,
  },
  headline: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 20,
    fontWeight: '600' as const,
    color: palette.textPrimary,
    fontVariant: ['tabular-nums'] as any,
  },
  body: {
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    fontWeight: '400' as const,
    color: palette.textPrimary,
    fontVariant: ['tabular-nums'] as any,
  },
  caption: {
    fontFamily: fontFamilies.regular,
    fontSize: 13,
    fontWeight: '400' as const,
    color: palette.textSecondary,
    fontVariant: ['tabular-nums'] as any,
  },
  overline: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 12,
    fontWeight: '600' as const,
    color: palette.textTertiary,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.2,
    fontVariant: ['tabular-nums'] as any,
  },
};

export const typography: Record<string, TextStyle> = _typography;

// Backward compatibility aliases
export const typeScale = {
  ..._typography,
  hero: _typography.display,
  bodyMedium: {
    ..._typography.body,
    fontFamily: fontFamilies.medium,
    fontWeight: '500',
  } as TextStyle,
  bodyLarge: { ..._typography.body, fontSize: 18 } as TextStyle,
  label: { ..._typography.body, fontFamily: fontFamilies.medium, fontWeight: '500' } as TextStyle,
};

export type TypeVariant = keyof typeof typeScale;

export const maxFontScale: Record<TypeVariant, number> = {
  display: 1.1,
  title: 1.2,
  headline: 1.3,
  body: 1.4,
  bodyMedium: 1.4,
  bodyLarge: 1.4,
  label: 1.4,
  caption: 1.5,
  overline: 1.5,
  hero: 1.1,
};

export const fonts = {
  ...fontFamilies,
  bodyStrong: fontFamilies.semiBold,
};

export const motion = {
  duration: {
    fast: 150,
    medium: 280,
    slow: 450,
  },
  springs: {
    smooth: { damping: 20, stiffness: 180 },
    elastic: { damping: 14, stiffness: 220 },
  },
  easing: {
    bezier: [0.22, 1, 0.36, 1] as [number, number, number, number],
  },
};

export const borders = {
  hairline: StyleSheet.hairlineWidth,
};
