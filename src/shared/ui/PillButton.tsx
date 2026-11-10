import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, TouchableOpacity, type ViewStyle } from 'react-native';

import { haptics } from '@/shared/lib/haptics';
import { radius, spacing, useTheme } from '@/shared/theme';

import { AppText } from './AppText';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export interface PillButtonProps {
  label: string;
  icon?: IconName;
  onPress?: () => void;
  variant?: 'primary' | 'ghost' | 'warn';
  style?: ViewStyle;
}

export function PillButton({ label, icon, onPress, variant = 'primary', style }: PillButtonProps) {
  const { colors } = useTheme();

  const handlePress = () => {
    haptics.tap();
    onPress?.();
  };

  const getVariantStyles = () => {
    if (variant === 'warn') {
      return {
        bg: colors.hot,
        text: '#FFFFFF',
        icon: '#FFFFFF',
      };
    }
    if (variant === 'ghost') {
      return {
        bg: 'transparent',
        text: colors.ink,
        icon: colors.ink,
        border: colors.line,
      };
    }
    return {
      bg: colors.primaryPill,
      text: colors.onPrimaryPill,
      icon: colors.onPrimaryPill,
    };
  };

  const v = getVariantStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      style={[
        styles.button,
        { backgroundColor: v.bg },
        v.border ? { borderWidth: 1, borderColor: v.border } : null,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {icon ? (
        <MaterialCommunityIcons name={icon} size={20} color={v.icon} style={styles.icon} />
      ) : null}
      {label ? <AppText style={[styles.text, { color: v.text }]}>{label}</AppText> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  icon: {
    marginRight: spacing.sm,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
