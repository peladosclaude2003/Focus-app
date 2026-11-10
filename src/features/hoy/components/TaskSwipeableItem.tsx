import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

import { useTheme } from '@/shared/theme';
import { AppText } from '@/shared/ui';

import type { TaskWithCategory } from '../repository/tasks.repository';
import type { RepeatRule } from '../repository/tasks.schema';

export interface TaskSwipeableItemProps {
  task: TaskWithCategory;
  onToggle: (taskId: string, done: boolean) => void;
  onEdit: (task: TaskWithCategory) => void;
  onDelete: (taskId: string) => void;
}

export const TaskSwipeableItem = memo(function TaskSwipeableItem({
  task,
  onToggle,
  onEdit,
  onDelete,
}: TaskSwipeableItemProps) {
  const { colors } = useTheme();

  const renderRightActions = () => {
    return (
      <View style={styles.actionsContainer}>
        <Pressable
          onPress={() => onEdit(task)}
          style={[styles.actionBtn, { backgroundColor: colors.cardBorder }]}
          accessibilityLabel="Editar tarea"
        >
          <MaterialCommunityIcons name="pencil" size={20} color={colors.ink} />
        </Pressable>
        <Pressable
          onPress={() => onDelete(task.id)}
          style={[styles.actionBtn, { backgroundColor: colors.hot }]}
          accessibilityLabel="Borrar tarea"
        >
          <MaterialCommunityIcons name="trash-can-outline" size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    );
  };

  const getRepeatLabel = (rule: RepeatRule) => {
    if (rule === 'daily') return 'Diaria';
    if (rule === 'weekdays') return 'L-V';
    if (rule === 'custom') return 'Recurrente';
    return null;
  };

  const repeatLabel = getRepeatLabel(task.repeatRule);

  return (
    <ReanimatedSwipeable renderRightActions={renderRightActions} friction={2} rightThreshold={40}>
      <View
        style={[styles.cardItem, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
      >
        <Pressable
          onPress={() => onToggle(task.id, task.done)}
          style={styles.contentRow}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: task.done }}
          accessibilityLabel={task.title}
        >
          <View
            style={[
              styles.checkbox,
              { borderColor: task.done ? colors.primaryPill : colors.mute },
              task.done && { backgroundColor: colors.primaryPill },
            ]}
          >
            {task.done ? (
              <MaterialCommunityIcons name="check" size={16} color={colors.onPrimaryPill} />
            ) : null}
          </View>

          <View style={styles.textColumn}>
            <AppText
              variant="body"
              style={[
                styles.taskTitle,
                task.done && { textDecorationLine: 'line-through', color: colors.mute },
              ]}
            >
              {task.title}
            </AppText>
            {task.time || repeatLabel || task.category ? (
              <View style={styles.metaRow}>
                {task.time ? (
                  <AppText variant="caption" color="mute" style={styles.metaText}>
                    🕒 {task.time}
                  </AppText>
                ) : null}
                {task.category ? (
                  <View
                    style={[
                      styles.tag,
                      {
                        backgroundColor: task.category.color + '20',
                        borderWidth: 1,
                        borderColor: task.category.color,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={task.category.icon as any}
                      size={10}
                      color={task.category.color}
                      style={{ marginRight: 2 }}
                    />
                    <AppText variant="caption" style={{ color: task.category.color, fontSize: 10 }}>
                      {task.category.name}
                    </AppText>
                  </View>
                ) : null}
                {repeatLabel ? (
                  <View style={[styles.tag, { backgroundColor: 'rgba(255, 255, 255, 0.08)' }]}>
                    <AppText variant="caption" color="mute">
                      🔄 {repeatLabel}
                    </AppText>
                  </View>
                ) : null}
              </View>
            ) : null}
          </View>
        </Pressable>
      </View>
    </ReanimatedSwipeable>
  );
});

const styles = StyleSheet.create({
  cardItem: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textColumn: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  metaText: {
    fontSize: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingLeft: 8,
    marginBottom: 10,
  },
  actionBtn: {
    width: 48,
    height: '100%',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
