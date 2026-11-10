import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

import { BottomSheet, AppText, PillHeatmap, StatTile, PillButton } from '@/shared/ui';
import { useTheme, spacing, radius } from '@/shared/theme';
import type { HabitRow, HabitResetRow } from '../repository/habits.schema';
import { calculateStreakStats } from '../lib/streakCalculations';
import { ResetConfirmSheet } from './ResetConfirmSheet';
import { ResetHistorySheet } from './ResetHistorySheet';

interface HabitDetailSheetProps {
  habit: HabitRow | null;
  onClose: () => void;
  nowMs: number;
  resets: HabitResetRow[];
  heatmapDays: any[];
  onUpdateUnit: (unit: string) => Promise<void>;
  onReset: (note?: string) => Promise<void>;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePrivacy: () => Promise<void>;
}

const UNITS = [
  { value: 'seconds', label: 'Segundos' },
  { value: 'minutes', label: 'Minutos' },
  { value: 'hours', label: 'Horas' },
  { value: 'days', label: 'Días' },
  { value: 'weeks', label: 'Semanas' },
  { value: 'months', label: 'Meses' },
  { value: 'years', label: 'Años' },
];

export function HabitDetailSheet({
  habit,
  onClose,
  nowMs,
  resets,
  heatmapDays,
  onUpdateUnit,
  onReset,
  onEdit,
  onDelete,
  onTogglePrivacy,
}: HabitDetailSheetProps) {
  const { colors } = useTheme();

  const [resetSheetOpen, setResetSheetOpen] = useState(false);
  const [historySheetOpen, setHistorySheetOpen] = useState(false);

  if (!habit) return null;

  const stats = calculateStreakStats(habit.startAt, habit.bestMs, nowMs);

  const currentDaysInt = Math.floor(stats.currentDurationMs / 86400000);
  const bestDaysInt = Math.floor(stats.bestDurationMs / 86400000);

  const handleDelete = () => {
    Alert.alert(
      'Eliminar hábito',
      '¿Estás seguro de que quieres eliminar este hábito y todo su historial?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            onClose();
            onDelete();
          },
        },
      ],
    );
  };

  return (
    <>
      <BottomSheet visible={!!habit} onClose={onClose}>
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: habit.color + '20' }]}>
              <MaterialCommunityIcons name={habit.icon as any} size={32} color={habit.color} />
            </View>
            <AppText variant="title" style={styles.name}>
              {habit.privacyHidden ? '***' : habit.name}
            </AppText>

            <View style={styles.actions}>
              <TouchableOpacity onPress={onTogglePrivacy} style={styles.iconBtn}>
                <MaterialCommunityIcons
                  name={habit.privacyHidden ? 'eye-off' : 'eye'}
                  size={24}
                  color={colors.mute}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  onClose();
                  onEdit();
                }}
                style={styles.iconBtn}
              >
                <MaterialCommunityIcons name="pencil" size={24} color={colors.mute} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={styles.iconBtn}>
                <MaterialCommunityIcons name="trash-can" size={24} color={colors.hot} />
              </TouchableOpacity>
            </View>
          </View>

          <AppText variant="label" style={styles.sectionTitle}>
            Unidad de medida
          </AppText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.unitScroll}
          >
            {UNITS.map((u) => (
              <TouchableOpacity
                key={u.value}
                style={[
                  styles.unitChip,
                  {
                    backgroundColor: habit.unit === u.value ? habit.color : colors.bg,
                    borderColor: habit.unit === u.value ? habit.color : colors.cardBorder,
                  },
                ]}
                onPress={() => onUpdateUnit(u.value)}
              >
                <AppText style={{ color: habit.unit === u.value ? '#fff' : colors.ink }}>
                  {u.label}
                </AppText>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.tileRow}>
            <StatTile icon="trophy-outline" value={bestDaysInt} label="Mejor (días)" />
            <StatTile
              icon="flag-outline"
              value={stats.milestone.daysRemaining}
              label={`Para ${stats.milestone.target}d`}
            />
          </View>

          <View style={styles.heatmapWrapper}>
            <PillHeatmap
              title="Últimos 30 días"
              subtitle={`${currentDaysInt} días activos`}
              days={heatmapDays}
              colorOverride={habit.color}
            />
          </View>

          <View style={styles.buttonsRow}>
            <View style={styles.flexBtn}>
              <PillButton label="Historial" onPress={() => setHistorySheetOpen(true)} />
            </View>
            <View style={styles.flexBtn}>
              <PillButton label="Recaída" onPress={() => setResetSheetOpen(true)} />
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>

      <ResetConfirmSheet
        visible={resetSheetOpen}
        onClose={() => setResetSheetOpen(false)}
        onConfirm={async (note) => {
          await onReset(note);
          setResetSheetOpen(false);
        }}
      />

      <ResetHistorySheet
        visible={historySheetOpen}
        onClose={() => setHistorySheetOpen(false)}
        resets={resets}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconBtn: {
    padding: spacing.xs,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  unitScroll: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  unitChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  tileRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  heatmap: {
    marginBottom: spacing.xl,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  historyBtn: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  resetBtn: {
    flex: 1,
  },
  heatmapWrapper: {
    marginBottom: 20,
  },
  flexBtn: {
    flex: 1,
  },
});
