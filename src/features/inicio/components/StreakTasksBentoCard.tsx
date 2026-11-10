import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/shared/theme';
import { AppText, Card } from '@/shared/ui';

interface Props {
  streakDays: number;
  habitName: string;
  tasksDone: number;
  tasksTotal: number;
  onPress: () => void;
}

export const StreakTasksBentoCard: React.FC<Props> = ({
  streakDays,
  habitName,
  tasksDone,
  tasksTotal,
  onPress,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.touchable}>
      <Card style={styles.card}>
        <AppText variant="caption" color="mute">
          Mi día & Racha
        </AppText>

        <View style={styles.contentRow}>
          <View style={styles.itemBox}>
            <View style={styles.iconBadge}>
              <Ionicons name="flame" size={16} color="#F59E0B" />
            </View>
            <View>
              <AppText variant="body" color="ink">
                {streakDays} días
              </AppText>
              <AppText variant="caption" color="mute">
                {habitName ? `Sin ${habitName}` : 'Sin el hábito'}
              </AppText>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.itemBox}>
            <View style={[styles.iconBadge, styles.taskBadge]}>
              <Ionicons name="checkbox-outline" size={16} color={colors.electricBlue} />
            </View>
            <View>
              <AppText variant="body" color="ink">
                {tasksDone} / {tasksTotal}
              </AppText>
              <AppText variant="caption" color="mute">
                Tareas listas hoy
              </AppText>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    width: '100%',
  },
  card: {
    padding: 18,
    gap: 12,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginHorizontal: 8,
  },
});
