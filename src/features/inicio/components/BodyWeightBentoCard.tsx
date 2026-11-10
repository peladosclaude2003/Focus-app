import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppText, Card, DeltaChip } from '@/shared/ui';

interface Props {
  latestKg: number | null;
  avgKg: number | null;
  diffKg: number | null;
  onPress: () => void;
}

export const BodyWeightBentoCard: React.FC<Props> = ({ latestKg, avgKg, diffKg, onPress }) => {
  const deltaStr = diffKg !== null ? (diffKg > 0 ? `+${diffKg} kg` : `${diffKg} kg`) : undefined;

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.touchable}>
      <Card style={styles.card}>
        <View style={styles.topRow}>
          <View>
            <AppText variant="caption" color="mute">
              Peso corporal
            </AppText>
            <AppText variant="caption" color="mute" style={styles.subtitle}>
              {avgKg !== null ? `Promed. 7d: ${avgKg} kg` : 'Sin datos recientes'}
            </AppText>
          </View>
          {deltaStr ? <DeltaChip value={deltaStr} /> : null}
        </View>

        <AppText variant="display" color="ink" style={styles.valueText}>
          {latestKg !== null ? `${latestKg} kg` : '74.5 kg'}
        </AppText>
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
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  subtitle: {
    marginTop: 2,
  },
  valueText: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '600',
    marginTop: 10,
  },
});
