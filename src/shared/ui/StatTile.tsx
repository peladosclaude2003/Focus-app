import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '@/shared/theme';

import { AppText } from './AppText';
import { Card } from './Card';
import { DeltaChip } from './DeltaChip';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export interface StatTileProps {
  icon?: IconName;
  value: string | number;
  label: string;
  delta?: string;
  unit?: string;
}

export function StatTile({ icon, value, label, delta, unit }: StatTileProps) {
  return (
    <Card style={styles.container}>
      <View style={styles.topRow}>
        {icon ? <MaterialCommunityIcons name={icon} size={20} color="#71717A" /> : <View />}
        {delta ? <DeltaChip value={delta} /> : null}
      </View>

      <View style={styles.valueRow}>
        <AppText variant="display" color="ink" style={styles.valueText}>
          {value}
        </AppText>
        {unit ? (
          <AppText variant="caption" color="mute" style={styles.unitText}>
            {unit}
          </AppText>
        ) : null}
      </View>

      <AppText variant="caption" color="mute" style={styles.label}>
        {label}
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    marginBottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
    minHeight: 20,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginVertical: 2,
  },
  valueText: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '600',
  },
  unitText: {
    fontSize: 13,
  },
  label: {
    textAlign: 'center',
    marginTop: 2,
  },
});
