import React, { useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { t } from '@/shared/i18n';
import { useTheme, spacing } from '@/shared/theme';
import { AppText, Screen } from '@/shared/ui';

import { HabitCard } from '../components/HabitCard';
import { HabitFormSheet } from '../components/HabitFormSheet';
import { HabitDetailSheet } from '../components/HabitDetailSheet';
import { useHabits } from '../hooks/useHabits';
import type { HabitRow, HabitResetRow } from '../repository/habits.schema';

export function RachaScreen() {
  const { colors } = useTheme();

  const {
    habits,
    nowMs,
    createHabit,
    updateHabit,
    deleteHabit,
    resetHabit,
    getHabitResets,
    generateHeatmap,
  } = useHabits();

  const [formVisible, setFormVisible] = useState(false);
  const [editingHabit, setEditingHabit] = useState<HabitRow | null>(null);

  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<HabitRow | null>(null);

  const [selectedResets, setSelectedResets] = useState<HabitResetRow[]>([]);
  const [selectedHeatmap, setSelectedHeatmap] = useState<any[]>([]);

  const openForm = (habit?: HabitRow) => {
    setEditingHabit(habit || null);
    setFormVisible(true);
  };

  const openDetail = async (habit: HabitRow) => {
    setSelectedHabit(habit);
    const resets = await getHabitResets(habit.id);
    setSelectedResets(resets);
    setSelectedHeatmap(generateHeatmap(habit.startAt, resets));
    setDetailVisible(true);
  };

  const handleSaveForm = async (name: string, startAt: number, icon: string, color: string) => {
    if (editingHabit) {
      await updateHabit(editingHabit.id, { name, startAt, icon, color });
      if (selectedHabit?.id === editingHabit.id) {
        setSelectedHabit({ ...selectedHabit, name, startAt, icon, color });
      }
    } else {
      await createHabit(name, startAt, icon, color);
    }
  };

  const handleReset = async (note?: string) => {
    if (selectedHabit) {
      const currentMs = Date.now();
      await resetHabit(selectedHabit, currentMs, currentMs, note);

      // Update local state for details view
      const updated = { ...selectedHabit, startAt: currentMs };
      setSelectedHabit(updated);

      const resets = await getHabitResets(selectedHabit.id);
      setSelectedResets(resets);
      setSelectedHeatmap(generateHeatmap(updated.startAt, resets));
    }
  };

  return (
    <Screen title="Rachas" scrollable={false}>
      {habits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <AppText variant="body" color="mute" style={styles.emptyText}>
            No tienes hábitos registrados aún.
          </AppText>
        </View>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <HabitCard habit={item} nowMs={nowMs} onPress={() => openDetail(item)} />
          )}
        />
      )}

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.electricBlue }]}
        onPress={() => openForm()}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="plus" size={28} color="#fff" />
      </TouchableOpacity>

      <HabitFormSheet
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        habit={editingHabit}
        onSave={handleSaveForm}
      />

      <HabitDetailSheet
        habit={selectedHabit}
        nowMs={nowMs}
        resets={selectedResets}
        heatmapDays={selectedHeatmap}
        onClose={() => {
          setDetailVisible(false);
          setSelectedHabit(null);
        }}
        onUpdateUnit={async (unit) => {
          if (selectedHabit) {
            await updateHabit(selectedHabit.id, { unit });
            setSelectedHabit({ ...selectedHabit, unit });
          }
        }}
        onReset={handleReset}
        onEdit={() => {
          setDetailVisible(false);
          setTimeout(() => openForm(selectedHabit!), 300);
        }}
        onDelete={() => {
          if (selectedHabit) {
            deleteHabit(selectedHabit.id);
          }
        }}
        onTogglePrivacy={async () => {
          if (selectedHabit) {
            const hidden = !selectedHabit.privacyHidden;
            await updateHabit(selectedHabit.id, { privacyHidden: hidden });
            setSelectedHabit({ ...selectedHabit, privacyHidden: hidden });
          }
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 100, // space for FAB
  },
  row: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
