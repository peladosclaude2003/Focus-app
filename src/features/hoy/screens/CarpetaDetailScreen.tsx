import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme, spacing } from '@/shared/theme';
import { AppText, EmptyState, PillButton, Screen, SegmentedControl } from '@/shared/ui';
import { todayISO } from '@/shared/lib/dates';
import { tasksRepository, type TaskWithCategory } from '../repository/tasks.repository';
import { categoriesRepository } from '../repository/categories.repository';
import type { CategoryRow } from '../repository/tasks.schema';
import { TaskSwipeableItem } from '../components/TaskSwipeableItem';
import { useHoyTasks } from '../hooks/useHoyTasks';

export function CarpetaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();

  const { toggleTask, deleteTask } = useHoyTasks();

  const [category, setCategory] = useState<CategoryRow | null>(null);
  const [tasksList, setTasksList] = useState<TaskWithCategory[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all');

  const loadData = useCallback(async () => {
    if (!id) return;
    const cat = await categoriesRepository.getById(id);
    if (cat) setCategory(cat);
    const list = await tasksRepository.getByCategory(id, todayISO());
    setTasksList(list);
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggle = async (taskId: string, done: boolean) => {
    await toggleTask(taskId, done);
    await loadData();
  };

  const handleDelete = async (taskId: string) => {
    await deleteTask(taskId);
    await loadData();
  };

  const filteredTasks = tasksList.filter((t) => {
    if (filter === 'pending') return !t.done;
    if (filter === 'done') return t.done;
    return true;
  });

  const renderItem = useCallback(
    ({ item }: { item: TaskWithCategory }) => (
      <TaskSwipeableItem
        task={item}
        onToggle={handleToggle}
        onEdit={() => {}} // No editar desde aqui por simplicidad, o implementar form
        onDelete={handleDelete}
      />
    ),
    [handleToggle, handleDelete],
  );

  return (
    <Screen title={category?.name || 'Carpeta'} scrollable={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.ink} />
        </Pressable>
        {category ? (
          <View style={styles.catTitle}>
            <MaterialCommunityIcons
              name={category.icon as any}
              size={24}
              color={category.color}
              style={{ marginRight: 8 }}
            />
            <AppText variant="title">{category.name}</AppText>
          </View>
        ) : null}
      </View>

      <View style={styles.filterRow}>
        <SegmentedControl
          options={[
            { label: 'Todas', value: 'all' },
            { label: 'Pendientes', value: 'pending' },
            { label: 'Hechas', value: 'done' },
          ]}
          selectedValue={filter}
          onValueChange={setFilter as any}
        />
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(t) => t.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="checkbox-blank-circle-outline"
            title="Sin tareas"
            description="No hay tareas en esta categoría con el filtro seleccionado."
          />
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  backBtn: {
    padding: 8,
    marginLeft: -8,
    marginRight: 8,
  },
  catTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterRow: {
    marginBottom: spacing.md,
  },
  listContent: {
    paddingBottom: 40,
  },
});
