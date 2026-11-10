import { StyleSheet, View, ScrollView } from 'react-native';

import { t } from '@/shared/i18n';
import { parseISODate, type ISODate } from '@/shared/lib/dates';
import { AppText, Card, MiniBarChart, StatTile } from '@/shared/ui';

import { BodyWeightSection } from './BodyWeightSection';
import type { SessionProgress } from '../lib/gymCalculations';
import type { BodyWeightRow } from '../repository/gym.schema';

/** 4520 → "4.5k" para que quepa sobre la barra. */
function compactNumber(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(n);
}

/** "2026-11-10" → "10/11" */
function shortDate(iso: ISODate): string {
  const d = parseISODate(iso);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

interface ProgresoGymTabProps {
  bodyWeights: BodyWeightRow[];
  movingAverageKg: number[];
  weightGoal: number;
  weightDiff: number | null;
  weeklyAttendance: number;
  historicalTotalReps: number;
  historicalMaxWeight: number;
  sessionProgress: SessionProgress;
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
  sessionProgress,
  onLogWeight,
}: ProgresoGymTabProps) {
  const { points, percentageChange } = sessionProgress;
  const lastPoint = points[points.length - 1];

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

      {/* Progreso por sesión (volumen de cada entrenamiento terminado) */}
      {points.length > 0 ? (
        <MiniBarChart
          title={t.gym.progressTitle}
          subtitle={t.gym.progressSubtitle}
          value={lastPoint ? `${lastPoint.volume.toLocaleString('es-ES')} kg` : undefined}
          delta={
            percentageChange !== null
              ? `${percentageChange > 0 ? '+' : ''}${percentageChange}%`
              : undefined
          }
          bars={points.map((p) => ({ label: shortDate(p.date), value: p.volume }))}
          formatValue={compactNumber}
        />
      ) : (
        <Card>
          <AppText variant="caption" color="mute">
            {t.gym.progressTitle}
          </AppText>
          <AppText variant="body" color="mute" style={styles.emptyText}>
            {t.gym.progressEmpty}
          </AppText>
        </Card>
      )}

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
  emptyText: {
    marginTop: 6,
  },
  tileRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
});
