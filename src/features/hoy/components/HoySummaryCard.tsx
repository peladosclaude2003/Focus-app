import { StyleSheet, View } from 'react-native';

import { formatLongDate, type ISODate } from '@/shared/lib/dates';
import { radius, spacing, useTheme } from '@/shared/theme';
import { AppText, Card } from '@/shared/ui';

export interface HoySummaryCardProps {
  date: ISODate;
  doneCount: number;
  totalCount: number;
  percentage: number;
}

export function HoySummaryCard({ date, doneCount, totalCount, percentage }: HoySummaryCardProps) {
  const { colors } = useTheme();

  return (
    <Card>
      <AppText variant="caption" color="mute" style={styles.dateSubtitle}>
        {formatLongDate(date)}
      </AppText>
      <View style={styles.summaryRow}>
        <AppText variant="title">Plan del día</AppText>
        <AppText variant="label" color="mute">
          {doneCount} de {totalCount} hechas
        </AppText>
      </View>

      <View style={[styles.barBackground, { backgroundColor: colors.line }]}>
        <View
          style={[styles.barFill, { width: `${percentage}%`, backgroundColor: colors.primaryPill }]}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  dateSubtitle: {
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: spacing.md,
  },
  barBackground: {
    height: 8,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: radius.pill,
  },
});
