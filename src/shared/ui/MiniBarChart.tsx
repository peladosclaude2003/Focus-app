import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/shared/theme';

import { AppText } from './AppText';
import { Card } from './Card';
import { DeltaChip } from './DeltaChip';

export interface BarData {
  label: string;
  value: number;
}

export interface MiniBarChartProps {
  title?: string;
  subtitle?: string;
  value?: string;
  delta?: string;
  bars: BarData[];
  maxHeight?: number;
}

export function MiniBarChart({
  title = 'This week',
  subtitle = 'Daily reps',
  value = '950 reps',
  delta = '+36%',
  bars = [
    { label: 'S', value: 0 },
    { label: 'M', value: 218 },
    { label: 'T', value: 167 },
    { label: 'W', value: 219 },
    { label: 'T', value: 186 },
    { label: 'F', value: 160 },
    { label: 'S', value: 0 },
  ],
  maxHeight = 70,
}: MiniBarChartProps) {
  const { colors } = useTheme();

  const maxVal = Math.max(...bars.map((b) => b.value)) || 1;

  return (
    <Card>
      <View style={styles.topRow}>
        <View>
          <AppText variant="caption" color="mute">
            {title}
          </AppText>
          <AppText variant="caption" color="mute">
            {subtitle}
          </AppText>
        </View>
        {delta ? <DeltaChip value={delta} /> : null}
      </View>

      <AppText variant="title" style={styles.valueText}>
        {value}
      </AppText>

      <View style={styles.chartRow}>
        {bars.map((bar, idx) => {
          const heightPercent = bar.value > 0 ? (bar.value / maxVal) * maxHeight : 0;
          return (
            <View key={idx} style={styles.barColumn}>
              <AppText variant="caption" color="mute" style={styles.barValText}>
                {bar.value > 0 ? bar.value : ''}
              </AppText>
              <View style={[styles.barContainer, { height: maxHeight }]}>
                {bar.value > 0 ? (
                  <View
                    style={[
                      styles.barFill,
                      { height: heightPercent, backgroundColor: colors.line },
                    ]}
                  />
                ) : null}
              </View>
              <AppText variant="caption" color="mute" style={styles.dayText}>
                {bar.label}
              </AppText>
            </View>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  valueText: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 6,
  },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barValText: {
    fontSize: 10,
    marginBottom: 4,
  },
  barContainer: {
    width: 28,
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
  },
  dayText: {
    fontSize: 11,
    marginTop: 6,
  },
});
