import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { spacing, useTheme } from '@/shared/theme';
import { AppText, Card, PillButton } from '@/shared/ui';

export interface RoutineHeaderCardProps {
  routineName?: string;
  routineType?: string;
  estimatedMin?: number;
  exerciseCount?: number;
  onStartWorkout: () => void;
}

export function RoutineHeaderCard({
  routineName = 'Push',
  routineType = 'Push, Pull, Legs',
  estimatedMin = 81,
  exerciseCount = 6,
  onStartWorkout,
}: RoutineHeaderCardProps) {
  const { colors } = useTheme();

  return (
    <Card style={styles.card}>
      <AppText variant="caption" color="mute" style={styles.todayHeader}>
        Today
      </AppText>

      {/* Title Badge with dashed outline */}
      <View style={[styles.titleBadge, { borderColor: colors.mute }]}>
        <AppText variant="display" style={styles.titleText}>
          {routineName}
        </AppText>
      </View>

      <AppText variant="caption" color="mute" style={styles.routineType}>
        {routineType}
      </AppText>

      {/* Badges row: ~81 min, 6 exercises */}
      <View style={styles.badgesRow}>
        <View style={[styles.metaBadge, { backgroundColor: 'rgba(255, 255, 255, 0.05)' }]}>
          <MaterialCommunityIcons name="clock-outline" size={16} color={colors.mute} />
          <AppText variant="caption" color="mute">
            ~{estimatedMin} min
          </AppText>
        </View>

        <View style={[styles.metaBadge, { backgroundColor: 'rgba(255, 255, 255, 0.05)' }]}>
          <MaterialCommunityIcons name="dumbbell" size={16} color={colors.mute} />
          <AppText variant="caption" color="mute">
            {exerciseCount} exercises
          </AppText>
        </View>
      </View>

      {/* Primary Pill Button: Start Workout */}
      <PillButton
        label="Start Workout"
        icon="play"
        onPress={onStartWorkout}
        style={styles.startBtn}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: spacing.xl,
  },
  todayHeader: {
    marginBottom: spacing.xs,
  },
  titleBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginVertical: 4,
  },
  titleText: {
    fontSize: 32,
    lineHeight: 36,
  },
  routineType: {
    marginTop: 4,
    marginBottom: spacing.md,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: spacing.lg,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  startBtn: {
    marginTop: spacing.xs,
  },
});
