import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { AreaSparkline } from '@/shared/ui';

interface Props {
  volumeTrend: number[];
  onPress: () => void;
}

export const VolumeTrendBentoCard: React.FC<Props> = ({ volumeTrend, onPress }) => {
  const latestVol = volumeTrend.length > 0 ? volumeTrend[volumeTrend.length - 1] : 0;
  const formattedVal = `${(latestVol ?? 0).toLocaleString('es-ES')} kg`;

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.touchable}>
      <AreaSparkline
        title="Tendencia de volumen"
        subtitle="Últimas 8 semanas"
        value={formattedVal}
        data={volumeTrend.length > 0 ? volumeTrend : [0, 0, 0, 0, 0, 0, 0, 0]}
        height={90}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    width: '100%',
  },
});
