import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme, radius, spacing } from '@/shared/theme';
import { AppText } from '@/shared/ui';
import type { HabitRow } from '../repository/habits.schema';

interface HabitCardProps {
  habit: HabitRow;
  nowMs: number;
  onPress: () => void;
}

export function HabitCard({ habit, nowMs, onPress }: HabitCardProps) {
  const { colors } = useTheme();

  const durationMs = Math.max(0, nowMs - habit.startAt);
  const totalSeconds = Math.floor(durationMs / 1000);

  let value = 0;
  let unitLabel = '';

  switch (habit.unit) {
    case 'seconds':
      value = totalSeconds;
      unitLabel = 'segundos';
      break;
    case 'minutes':
      value = Math.floor(totalSeconds / 60);
      unitLabel = 'minutos';
      break;
    case 'hours':
      value = Math.floor(totalSeconds / 3600);
      unitLabel = 'horas';
      break;
    case 'weeks':
      value = Math.floor(totalSeconds / 86400 / 7);
      unitLabel = 'semanas';
      break;
    case 'months':
      value = Math.floor(totalSeconds / 86400 / 30);
      unitLabel = 'meses';
      break;
    case 'years':
      value = Math.floor(totalSeconds / 86400 / 365);
      unitLabel = 'años';
      break;
    case 'days':
    default:
      value = Math.floor(totalSeconds / 86400);
      unitLabel = 'días';
      break;
  }

  // Si privacyHidden es true, ocultamos el nombre
  const displayName = habit.privacyHidden ? '***' : habit.name;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.headerRow}>
        <View style={[styles.iconContainer, { backgroundColor: habit.color + '20' }]}>
          <MaterialCommunityIcons name={habit.icon as any} size={20} color={habit.color} />
        </View>
        <AppText variant="body" style={styles.name} numberOfLines={1}>
          {displayName}
        </AppText>
      </View>

      <View style={styles.timeRow}>
        <AppText style={[styles.value, { color: habit.color }]}>{value.toLocaleString()}</AppText>
        <AppText variant="caption" color="mute" style={styles.unit}>
          {unitLabel}
        </AppText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    flex: 1,
  },
  timeRow: {
    alignItems: 'flex-start',
  },
  value: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    lineHeight: 34,
  },
  unit: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },
});
