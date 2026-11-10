import { ScrollView, StyleSheet, View } from 'react-native';

import { t } from '@/shared/i18n';
import { AreaSparkline, MiniBarChart, StatTile } from '@/shared/ui';

import { BodyWeightSection } from './BodyWeightSection';
import { ExerciseProgressCard } from './ExerciseProgressCard';
import type { ExerciseProgress } from '../lib/gymCalculations';
import type { BodyWeightRow } from '../repository/gym.schema';

interface ProgresoGymTabProps {
  bodyWeights: BodyWeightRow[];
  movingAverageKg: number[];
  weightGoal: number;
  weightDiff: number | null;
  weeklyAttendance: number;
  historicalTotalReps: number;
  historicalMaxWeight: number;
  weeklyRepsData: { dailyReps: number[]; percentageChange: number };
  volumeTrend: number[];
  exerciseProgress: ExerciseProgress[];
  onLogWeight: (kg: number) => Promise<void>;
}

const DAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export function ProgresoGymTab({
  bodyWeights,
  movingAverageKg,
  weightGoal,
  weightDiff,
  weeklyAttendance,
  historicalTotalReps,
  historicalMaxWeight,
  weeklyRepsData,
  volumeTrend,
  exerciseProgress,
  onLogWeight,
}: ProgresoGymTabProps) {
  const s = t.gym.progress;
  const weekReps = weeklyRepsData.dailyReps.reduce((a, b) => a + b, 0);
  const pct = weeklyRepsData.percentageChange;
  const currentVolume = volumeTrend[volumeTrend.length - 1] ?? 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Asistencia, reps totales y peso máximo históricos */}
      <View style={styles.tileRow}>
        <StatTile icon="calendar-check-outline" value={`${weeklyAttendance}`} label={s.attendance} />
        <StatTile icon="cube-outline" value={`${historicalTotalReps}`} label={s.reps} />
        <StatTile icon="trophy-outline" value={`${historicalMaxWeight}`} label={s.maxKg} />
      </View>

      {/* Progreso real: peso tope por ejercicio a lo largo de las sesiones */}
      <ExerciseProgressCard items={exerciseProgress} />

      {/* Tendencia de volumen semanal */}
      <AreaSparkline
        title={s.volumeTitle}
        subtitle={s.volumeSub}
        value={s.volumeValue(currentVolume)}
        data={volumeTrend}
        height={90}
      />

      {/* Repeticiones por día de la semana actual */}
      <MiniBarChart
        title={s.thisWeek}
        subtitle={s.dailyReps}
        value={s.repsValue(weekReps)}
        delta={pct !== 0 ? `${pct > 0 ? '+' : ''}${pct}%` : undefined}
        bars={DAY_LABELS.map((label, i) => ({
          label,
          value: weeklyRepsData.dailyReps[i] ?? 0,
        }))}
      />

      {/* Peso corporal y media móvil */}
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
