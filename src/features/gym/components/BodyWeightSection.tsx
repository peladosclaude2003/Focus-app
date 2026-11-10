import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { useTheme } from '@/shared/theme';
import { AppText, AreaSparkline, Card, PillButton } from '@/shared/ui';

import type { BodyWeightRow } from '../repository/gym.schema';

export interface BodyWeightSectionProps {
  records: BodyWeightRow[];
  movingAverage: number[];
  weightGoal: number;
  weightDiff: number | null;
  onLogWeight: (kg: number) => Promise<void>;
}

export function BodyWeightSection({
  records,
  movingAverage,
  weightGoal,
  weightDiff,
  onLogWeight,
}: BodyWeightSectionProps) {
  const { colors } = useTheme();
  const [kgInput, setKgInput] = useState('');

  const lastRecord = records.length > 0 ? records[0] : null;
  const currentKg = lastRecord ? lastRecord.kg : 75.0;

  const handleLog = async () => {
    const val = parseFloat(kgInput);
    if (isNaN(val) || val <= 0) return;
    await onLogWeight(val);
    setKgInput('');
  };

  const sparklineData = movingAverage.length >= 2 ? movingAverage : [75, 75.2, 74.8, 75.1, 74.9];
  const diffLabel = weightDiff !== null ? `${weightDiff > 0 ? '+' : ''}${weightDiff} kg` : '—';

  return (
    <View style={styles.container}>
      <Card>
        <View style={styles.topRow}>
          <View>
            <AppText variant="caption" color="mute">
              Body weight
            </AppText>
            <AppText variant="display" style={styles.kgText}>
              {currentKg}{' '}
              <AppText variant="caption" color="mute">
                lbs / kg
              </AppText>
            </AppText>
          </View>
          <View style={styles.goalCol}>
            <AppText variant="caption" color="mute">
              Meta: {weightGoal} kg
            </AppText>
            <AppText variant="caption" color="mute">
              Cambio: {diffLabel}
            </AppText>
          </View>
        </View>

        {/* Quick Log Row */}
        <View style={styles.logRow}>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.bg, color: colors.ink, borderColor: colors.cardBorder },
            ]}
            placeholder="Nuevo peso kg"
            placeholderTextColor={colors.mute}
            value={kgInput}
            onChangeText={setKgInput}
            keyboardType="decimal-pad"
          />
          <PillButton label="Registrar" onPress={handleLog} style={styles.logBtn} />
        </View>
      </Card>

      {/* Sparkline Trend (7-day moving average) */}
      <AreaSparkline
        title="Peso Corporal"
        subtitle="Media móvil de 7 días"
        value={`${currentKg} kg`}
        data={sparklineData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  kgText: {
    fontSize: 32,
    lineHeight: 36,
    marginTop: 2,
  },
  goalCol: {
    alignItems: 'flex-end',
  },
  logRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  input: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  logBtn: {
    height: 48,
    paddingHorizontal: 18,
  },
});
