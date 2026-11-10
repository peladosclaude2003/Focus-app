import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme, spacing } from '@/shared/theme';
import { AppText, BottomSheet, PillButton } from '@/shared/ui';
import { useNotificationsStore } from './useNotificationsStore';
import { NotificationService } from './NotificationService';

export function NotificationPermissionSheet() {
  const { colors } = useTheme();
  const { permissionSheetVisible, closeSheet, resolvePermission } = useNotificationsStore();

  const handleGrant = async () => {
    const granted = await NotificationService.requestPermissions();
    if (!granted) {
      // Si se deniega definitivamente (ej. Android 13+ block), podemos mandar a ajustes
      // pero por ahora resolvemos como falso
      resolvePermission(false);
    } else {
      resolvePermission(true);
    }
  };

  return (
    <BottomSheet visible={permissionSheetVisible} onClose={closeSheet}>
      <View style={styles.content}>
        <View style={[styles.iconCircle, { backgroundColor: colors.electricBlue + '20' }]}>
          <MaterialCommunityIcons name="bell-ring-outline" size={40} color={colors.electricBlue} />
        </View>
        <AppText variant="title" style={styles.title}>
          Activar notificaciones
        </AppText>
        <AppText variant="body" color="mute" style={styles.body}>
          Para enviarte recordatorios de tus tareas, tu racha y tus entrenamientos de gym,
          necesitamos tu permiso para enviar notificaciones.
        </AppText>

        <View style={styles.actions}>
          <PillButton label="Activar" onPress={handleGrant} style={styles.btn} />
          <PillButton label="Ahora no" variant="ghost" onPress={closeSheet} style={styles.btn} />
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  body: {
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  actions: {
    width: '100%',
    gap: spacing.md,
  },
  btn: {
    width: '100%',
  },
});
