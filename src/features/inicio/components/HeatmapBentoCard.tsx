import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { PillHeatmap, type HeatmapDay } from '@/shared/ui';

interface Props {
  heatmapData: boolean[];
  onPress: () => void;
}

export const HeatmapBentoCard: React.FC<Props> = ({ heatmapData, onPress }) => {
  const activeCount = heatmapData.filter(Boolean).length;

  const days: HeatmapDay[] = heatmapData.map((active, index) => {
    const isToday = index === heatmapData.length - 1;
    if (active) {
      return { dayNumber: index + 1, state: 'done' };
    }
    if (isToday) {
      return { dayNumber: index + 1, state: 'today' };
    }
    return { dayNumber: index + 1, state: 'pending' };
  });

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.touchable}>
      <PillHeatmap
        title="Asistencia 30 días"
        subtitle={`${activeCount} · meta 4/sem`}
        days={days}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    width: '100%',
  },
});
