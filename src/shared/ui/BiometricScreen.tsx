import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/shared/theme';

import { AppText } from './AppText';
import { PillButton } from './PillButton';

interface Props {
  onRetry: () => void;
}

export function BiometricScreen({ onRetry }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.iconBadge}>
        <Ionicons name="lock-closed" size={48} color={colors.electricBlue} />
      </View>
      <AppText variant="title" color="ink" style={styles.title}>
        App Bloqueada
      </AppText>
      <AppText variant="body" color="mute" style={styles.subtitle}>
        Autentícate para acceder a tus datos de Mi día.
      </AppText>

      <View style={styles.spacer} />

      <PillButton label="Desbloquear" icon="fingerprint" onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
  },
  spacer: {
    height: 32,
  },
});
