import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { t } from '@/shared/i18n';
import { spacing, useTheme } from '@/shared/theme';

import { AppText } from './AppText';

export interface BootStatusProps {
  error?: Error | null;
}

/** Pantalla mostrada mientras se cargan fuentes/migraciones, o si fallan. */
export function BootStatus({ error }: BootStatusProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[styles.root, { backgroundColor: colors.bg }]}
      accessibilityLiveRegion="polite"
      accessible
    >
      {error ? (
        <>
          <AppText variant="title" accessibilityRole="header">
            {t.boot.errorTitle}
          </AppText>
          <AppText color="mute" style={styles.body}>
            {t.boot.errorBody(error.message)}
          </AppText>
        </>
      ) : (
        <>
          <ActivityIndicator color={colors.acc} accessibilityLabel={t.boot.loading} />
          <AppText color="mute" style={styles.body}>
            {t.boot.loading}
          </AppText>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  body: { marginTop: spacing.md, textAlign: 'center' },
});
