import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { MiniBarChart, type BarData } from '@/shared/ui';

interface Props {
  dailyReps: number[];
  percentageChange: number;
  onPress: () => void;
}

const DAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export const WeeklyRepsBentoCard: React.FC<Props> = ({ dailyReps, percentageChange, onPress }) => {
  const totalRepsWeek = dailyReps.reduce((acc, r) => acc + r, 0);

  const bars: BarData[] = DAY_LABELS.map((label, idx) => ({
    label,
    value: dailyReps[idx] ?? 0,
  }));

  const deltaStr = percentageChange >= 0 ? `+${percentageChange}%` : `${percentageChange}%`;

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.touchable}>
      <MiniBarChart
        title="Esta semana"
        subtitle="Repeticiones diarias"
        value={`${totalRepsWeek.toLocaleString('es-ES')} reps`}
        delta={deltaStr}
        bars={bars}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    width: '100%',
  },
});
