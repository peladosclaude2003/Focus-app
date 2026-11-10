import { StyleSheet, View, ScrollView } from 'react-native';

import { MiniBarChart, StatTile } from '@/shared/ui';

import { BodyWeightSection } from './BodyWeightSection';
import { BodyWeightRow } from '../repository/gym.schema';

interface ProgresoGymTabProps {
  bodyWeights: BodyWeightRow[];
  movingAverageKg: number[];
  weightGoal: number;
  weightDiff: number | null;
  weeklyAttendance: number;
  historicalTotalReps: number;
  historicalMaxWeight: number;
  weeklyRepsData: { dailyReps: number[]; percentageChange: number };
  onLogWeight: (kg: number) => Promise<void>;
}

export function ProgresoGymTab({
  bodyWeights,
  movingAverageKg,
  weightGoal,
  weightDiff,
  weeklyAttendance,
  historicalTotalReps,
  historicalMaxWeight,
  weeklyRepsData,
  onLogWeight,
}: ProgresoGymTabProps) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* StatTiles (Asistencia, Reps totales, Peso Máx) */}
      <View style={styles.tileRow}>
        <StatTile icon="calendar-check-outline" value={`${weeklyAttendance}`} label="días/sem" />
        <StatTile
          icon="cube-outline"
          value={historicalTotalReps > 0 ? `${historicalTotalReps}` : '0'}
          label="reps"
        />
        <StatTile
          icon="trophy-outline"
          value={historicalMaxWeight > 0 ? `${historicalMaxWeight}` : '0'}
          label="max kg"
        />
      </View>

      {/* Gráfica Semanal de Repeticiones */}
      <MiniBarChart
        title="Esta semana"
        subtitle="Reps diarias"
        value={`${weeklyRepsData.dailyReps.reduce((a, b) => a + b, 0)} reps`}
        delta={
          weeklyRepsData.percentageChange !== 0
            ? `${weeklyRepsData.percentageChange > 0 ? '+' : ''}${weeklyRepsData.percentageChange}%`
            : '0%'
        }
        bars={[
          { label: 'L', value: weeklyRepsData.dailyReps[0] ?? 0 },
          { label: 'M', value: weeklyRepsData.dailyReps[1] ?? 0 },
          { label: 'M', value: weeklyRepsData.dailyReps[2] ?? 0 },
          { label: 'J', value: weeklyRepsData.dailyReps[3] ?? 0 },
          { label: 'V', value: weeklyRepsData.dailyReps[4] ?? 0 },
          { label: 'S', value: weeklyRepsData.dailyReps[5] ?? 0 },
          { label: 'D', value: weeklyRepsData.dailyReps[6] ?? 0 },
        ]}
      />

      {/* Sección de Peso Corporal & Media Móvil */}
      <BodyWeightSection
        records={bodyWeights}
        movingAverage={movingAverageKg}
        weightGoal={weightGoal}
        weightDiff={weightDiff}
        onLogWeight={onLogWeight}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tileRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
});
