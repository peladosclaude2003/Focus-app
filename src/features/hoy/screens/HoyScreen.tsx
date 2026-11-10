import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { t } from '@/shared/i18n';
import {
  EmptyState,
  PillButton,
  Screen,
  SegmentedControl,
  BottomSheet,
  AppText,
} from '@/shared/ui';
import { formatLongDate, todayISO, type ISODate } from '@/shared/lib/dates';

import { HoySummaryCard } from '../components/HoySummaryCard';
import { TaskFormSheet } from '../components/TaskFormSheet';
import { TaskSwipeableItem } from '../components/TaskSwipeableItem';
import { WeekHeaderSelector } from '../components/WeekHeaderSelector';
import { MonthCalendarGrid } from '../components/MonthCalendarGrid';
import { useHoyTasks } from '../hooks/useHoyTasks';
import { useCategories } from '../hooks/useCategories';
import type { TaskWithCategory } from '../repository/tasks.repository';

export function HoyScreen() {
  const {
    selectedDate,
    monthViewDate,
    tasksList,
    monthlyStats,
    doneCount,
    totalCount,
    percentage,
    selectDate,
    setMonthViewDate,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
  } = useHoyTasks();

  const [viewType, setViewType] = useState<'day' | 'week' | 'month'>('week');
  const [formVisible, setFormVisible] = useState(false);
  const [monthTasksVisible, setMonthTasksVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithCategory | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const { categories } = useCategories();
  const router = useRouter();

  const handleOpenAdd = useCallback(() => {
    setEditingTask(null);
    setFormVisible(true);
  }, []);

  const handleOpenEdit = useCallback((task: TaskWithCategory) => {
    setEditingTask(task);
    setFormVisible(true);
  }, []);

  const handleSave = async (
    title: string,
    date: ISODate,
    categoryId: string,
    time?: string,
    repeatRule?: any,
    reminderType?: string,
  ) => {
    if (editingTask) {
      await updateTask(editingTask.id, title, date, categoryId, time, repeatRule, reminderType);
    } else {
      await addTask(title, date, categoryId, time, repeatRule, reminderType);
    }
  };

  const filteredTasks = tasksList.filter((t) =>
    selectedCategoryId ? t.categoryId === selectedCategoryId : true,
  );

  const renderItem = useCallback(
    ({ item }: { item: TaskWithCategory }) => (
      <TaskSwipeableItem
        task={item}
        onToggle={toggleTask}
        onEdit={handleOpenEdit}
        onDelete={deleteTask}
      />
    ),
    [toggleTask, handleOpenEdit, deleteTask],
  );

  const listHeader = (
    <View style={styles.headerContainer}>
      <View style={styles.viewToggles}>
        <SegmentedControl
          options={[
            { label: 'Día', value: 'day' },
            { label: 'Semana', value: 'week' },
            { label: 'Mes', value: 'month' },
          ]}
          selectedValue={viewType}
          onValueChange={setViewType}
        />
        <PillButton
          label="Hoy"
          variant="ghost"
          style={styles.todayBtn}
          onPress={() => selectDate(todayISO())}
        />
        <PillButton
          label=""
          icon="folder-outline"
          variant="ghost"
          style={styles.folderBtn}
          onPress={() => router.push('/carpetas')}
        />
      </View>

      {viewType === 'day' ? (
        <View style={styles.dayViewHeader}>
          <AppText variant="title" style={{ textTransform: 'capitalize' }}>
            {formatLongDate(selectedDate)}
          </AppText>
        </View>
      ) : null}

      {viewType === 'week' ? (
        <WeekHeaderSelector selectedDate={selectedDate} onSelectDate={selectDate} />
      ) : null}

      {viewType === 'month' ? (
        <MonthCalendarGrid
          currentMonth={monthViewDate}
          selectedDate={selectedDate}
          stats={monthlyStats}
          onSelectDate={(d) => {
            selectDate(d);
            setMonthTasksVisible(true);
          }}
          onChangeMonth={setMonthViewDate}
        />
      ) : null}

      {viewType !== 'month' ? (
        <HoySummaryCard
          date={selectedDate}
          doneCount={doneCount}
          totalCount={totalCount}
          percentage={percentage}
        />
      ) : null}

      {viewType !== 'month' && categories.length > 0 ? (
        <View style={styles.categoryFilterContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={[{ id: null, name: 'Todas' }, ...categories]}
            keyExtractor={(c) => c.id || 'all'}
            contentContainerStyle={styles.categoryFilterScroll}
            renderItem={({ item }) => {
              const isSelected = selectedCategoryId === item.id;
              return (
                <PillButton
                  label={item.name}
                  variant={isSelected ? 'primary' : 'ghost'}
                  onPress={() => setSelectedCategoryId(item.id)}
                />
              );
            }}
          />
        </View>
      ) : null}
    </View>
  );

  const listFooter = (
    <PillButton
      label="Agregar otra tarea"
      icon="plus"
      variant="ghost"
      onPress={handleOpenAdd}
      style={styles.addBtn}
    />
  );

  return (
    <Screen title={t.hoy.title} scrollable={false}>
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={listHeader}
        ListFooterComponent={filteredTasks.length > 0 ? listFooter : null}
        ListEmptyComponent={
          viewType !== 'month' ? (
            <EmptyState
              icon="checkbox-marked-circle-outline"
              title="Sin tareas para este día"
              description="Agrega tu primera tarea o compromiso para mantenerte enfocado."
              actionLabel="Agregar tarea"
              onAction={handleOpenAdd}
            />
          ) : null
        }
        contentContainerStyle={styles.flatListContent}
        style={viewType === 'month' ? { display: 'none' } : undefined}
      />

      <BottomSheet visible={monthTasksVisible} onClose={() => setMonthTasksVisible(false)}>
        <View style={styles.monthTasksSheet}>
          <AppText variant="label" style={{ textTransform: 'capitalize', marginBottom: 16 }}>
            {formatLongDate(selectedDate)}
          </AppText>
          <HoySummaryCard
            date={selectedDate}
            doneCount={doneCount}
            totalCount={totalCount}
            percentage={percentage}
          />
          {filteredTasks.map((item) => (
            <TaskSwipeableItem
              key={item.id}
              task={item}
              onToggle={toggleTask}
              onEdit={(t) => {
                setMonthTasksVisible(false);
                handleOpenEdit(t);
              }}
              onDelete={deleteTask}
            />
          ))}
          {filteredTasks.length === 0 && (
            <AppText
              variant="caption"
              color="mute"
              style={{ textAlign: 'center', marginVertical: 20 }}
            >
              No hay tareas en esta fecha.
            </AppText>
          )}
          <PillButton
            label="Agregar tarea"
            onPress={() => {
              setMonthTasksVisible(false);
              handleOpenAdd();
            }}
            style={{ marginTop: 8 }}
          />
        </View>
      </BottomSheet>

      <TaskFormSheet
        visible={formVisible}
        initialTask={editingTask}
        defaultDate={selectedDate}
        onClose={() => setFormVisible(false)}
        onSave={handleSave}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 8,
  },
  viewToggles: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  todayBtn: {
    height: 36,
    paddingHorizontal: 12,
  },
  folderBtn: {
    height: 36,
    paddingHorizontal: 8,
  },
  dayViewHeader: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  flatListContent: {
    paddingBottom: 24,
  },
  addBtn: {
    marginTop: 12,
  },
  monthTasksSheet: {
    paddingTop: 8,
  },
  categoryFilterContainer: {
    marginTop: 16,
    marginHorizontal: -16,
  },
  categoryFilterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
});
