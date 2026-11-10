import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme, spacing, radius } from '@/shared/theme';
import { AppText, EmptyState, PillButton, Screen } from '@/shared/ui';
import { NotificationService } from '@/shared/notifications/NotificationService';

export function NotificationsDebugScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);

  const loadNotifications = async () => {
    const list = await NotificationService.getAllScheduled();
    setNotifications(list);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleCancelAll = async () => {
    for (const notif of notifications) {
      await NotificationService.cancelNotification(notif.identifier);
    }
    await loadNotifications();
  };

  const renderItem = ({ item }: { item: any }) => {
    const date = item.trigger?.value ? new Date(item.trigger.value) : null;
    return (
      <View style={[styles.card, { backgroundColor: colors.bg, borderColor: colors.cardBorder }]}>
        <AppText variant="body" style={{ fontWeight: '600' }}>
          {item.content.title}
        </AppText>
        <AppText variant="caption" color="mute" style={styles.bodyText}>
          {item.content.body}
        </AppText>
        <AppText variant="caption" color="mute">
          ID: {item.identifier}
        </AppText>
        {date && (
          <AppText variant="caption" color="electricBlue">
            Disparo: {date.toLocaleString()}
          </AppText>
        )}
      </View>
    );
  };

  return (
    <Screen title="Debug Notificaciones" scrollable={false}>
      <View style={styles.header}>
        <PillButton label="Volver" onPress={() => router.back()} />
        <PillButton label="Cancelar Todas" variant="ghost" onPress={handleCancelAll} />
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.identifier}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="bell-off-outline"
            title="Sin notificaciones"
            description="No hay notificaciones programadas en el sistema."
          />
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  listContent: {
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  card: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  bodyText: {
    marginBottom: spacing.xs,
  },
});
