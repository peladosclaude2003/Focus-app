import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/shared/theme';

import { AppText } from './AppText';
import { Card } from './Card';

export type HeatmapDayState = 'done' | 'pending' | 'rest' | 'today';

export interface HeatmapDay {
  dayNumber: number;
  state: HeatmapDayState;
}

export interface PillHeatmapProps {
  title?: string;
  subtitle?: string;
  days: HeatmapDay[];
  colorOverride?: string;
}

export function PillHeatmap({
  title = 'Last 30 days',
  subtitle = '17 · goal 6/wk',
  days,
  colorOverride,
}: PillHeatmapProps) {
  const { colors } = useTheme();

  return (
    <Card>
      <View style={styles.header}>
        <AppText variant="caption" color="mute">
          {title}
        </AppText>
        <AppText variant="caption" color="mute">
          {subtitle}
        </AppText>
      </View>

      <View style={styles.grid}>
        {days.map((item, idx) => {
          const isDone = item.state === 'done';
          const isToday = item.state === 'today';
          const isRest = item.state === 'rest';

          return (
            <View
              key={idx}
              style={[
                styles.pill,
                isDone && { backgroundColor: colorOverride ?? colors.ink },
                !isDone && !isToday && !isRest && styles.pendingPill,
                isRest && styles.restPill,
                isToday && styles.todayPill,
              ]}
            />
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-start',
  },
  pill: {
    width: 28,
    height: 18,
    borderRadius: 9,
  },
  pendingPill: {
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'transparent',
  },
  restPill: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'transparent',
  },
  todayPill: {
    borderWidth: 2,
    borderColor: '#3B82F6', // Electric blue outline
    backgroundColor: 'transparent',
  },
});
