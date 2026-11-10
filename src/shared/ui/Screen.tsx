import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

import { spacing, useTheme } from '@/shared/theme';

import { AppText } from './AppText';

export interface ScreenProps {
  title: string;
  subtitle?: string;
  scrollable?: boolean;
  children?: ReactNode;
}

export function Screen({ title, subtitle, scrollable = true, children }: ScreenProps) {
  const { colors } = useTheme();

  const header = (
    <View style={styles.header}>
      <AppText variant="display" accessibilityRole="header">
        {title}
      </AppText>
      {subtitle ? (
        <AppText color="mute" style={styles.subtitle}>
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: colors.background }]}>
      {scrollable ? (
        <KeyboardAwareScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="automatic"
          bottomOffset={20}
        >
          {header}
          {children}
        </KeyboardAwareScrollView>
      ) : (
        <View style={[styles.content, { flex: 1 }]}>
          {header}
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    paddingHorizontal: spacing.m, // using aliases m=16, l=20, xl=24
    paddingTop: spacing.s,
    paddingBottom: 110,
  },
  header: { marginBottom: spacing.lg },
  subtitle: { textTransform: 'capitalize' },
});
