import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { radius, spacing, useTheme } from '@/shared/theme';

export interface CardProps extends ViewProps {
  children: ReactNode;
  variant?: 'default' | 'outlined' | 'dashed';
}

export function Card({ children, style, variant = 'default', ...rest }: CardProps) {
  const { colors } = useTheme();

  const getBorderStyle = () => {
    if (variant === 'dashed') {
      return {
        borderStyle: 'dashed' as const,
        borderColor: colors.mute,
        borderWidth: 1.5,
      };
    }
    if (variant === 'outlined') {
      return {
        borderColor: colors.line,
        borderWidth: 1,
      };
    }
    return {
      borderColor: colors.cardBorder,
      borderWidth: 1,
    };
  };

  return (
    <View
      style={[styles.card, { backgroundColor: colors.card }, getBorderStyle(), style]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
});
