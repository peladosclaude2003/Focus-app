import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { StatTile } from '@/shared/ui';

interface Props {
  totalHours: number;
  totalReps: number;
  maxWeight: number;
  onPress: () => void;
}

export const StatTilesRow: React.FC<Props> = ({ totalHours, totalReps, maxWeight, onPress }) => {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.container}>
      <View style={styles.tileWrapper}>
        <StatTile
          icon="clock-outline"
          value={totalHours > 0 ? `${totalHours}` : '0'}
          unit="h"
          label="Horas"
        />
      </View>
      <View style={styles.tileWrapper}>
        <StatTile
          icon="repeat"
          value={totalReps > 0 ? totalReps.toLocaleString('es-ES') : '0'}
          label="Reps"
        />
      </View>
      <View style={styles.tileWrapper}>
        <StatTile
          icon="weight-kilogram"
          value={maxWeight > 0 ? `${maxWeight}` : '0'}
          unit="kg"
          label="Máx peso"
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
  },
  tileWrapper: {
    flex: 1,
  },
});
