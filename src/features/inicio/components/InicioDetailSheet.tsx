import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { BentoCardType } from '@/features/inicio/hooks/useInicioData';
import { useTheme } from '@/shared/theme';
import { AppText, BottomSheet, PillButton } from '@/shared/ui';

interface Props {
  selectedCard: BentoCardType | null;
  onClose: () => void;
  routineName: string;
  totalHours: number;
  totalReps: number;
  maxWeight: number;
  heatmapCount: number;
  volumeTrend: number[];
  dailyReps: number[];
  percentageChange: number;
  latestKg: number | null;
  avgKg: number | null;
  diffKg: number | null;
  streakDays: number;
  habitName: string;
  tasksDone: number;
  tasksTotal: number;
  onStartWorkout?: () => void;
}

export const InicioDetailSheet: React.FC<Props> = ({
  selectedCard,
  onClose,
  routineName,
  totalHours,
  totalReps,
  maxWeight,
  heatmapCount,
  volumeTrend,
  dailyReps,
  percentageChange,
  latestKg,
  avgKg,
  diffKg,
  streakDays,
  tasksDone,
  tasksTotal,
  onStartWorkout,
}) => {
  const { colors } = useTheme();
  const visible = selectedCard !== null;

  const renderContent = () => {
    switch (selectedCard) {
      case 'todayWorkout':
        return (
          <View style={styles.section}>
            <View style={styles.headerRow}>
              <Ionicons name="barbell-outline" size={24} color={colors.electricBlue} />
              <AppText variant="title" color="ink">
                {routineName}
              </AppText>
            </View>

            <AppText variant="body" color="mute" style={styles.descriptionText}>
              Plan de entrenamiento enfocado en hipertrofia y fuerza relativa. Serie objetivo: 3-4
              series por ejercicio con 60s a 90s de descanso.
            </AppText>

            <View style={styles.detailBox}>
              <View style={styles.detailItem}>
                <AppText variant="caption" color="mute">
                  Ejercicios
                </AppText>
                <AppText variant="body" color="ink">
                  4 ejercicios
                </AppText>
              </View>
              <View style={styles.detailItem}>
                <AppText variant="caption" color="mute">
                  Series total
                </AppText>
                <AppText variant="body" color="ink">
                  12 series
                </AppText>
              </View>
              <View style={styles.detailItem}>
                <AppText variant="caption" color="mute">
                  Descanso
                </AppText>
                <AppText variant="body" color="ink">
                  60 s
                </AppText>
              </View>
            </View>

            <PillButton
              label="Empezar entrenamiento ahora"
              icon="play"
              variant="primary"
              onPress={() => {
                onClose();
                onStartWorkout?.();
              }}
            />
          </View>
        );

      case 'statTiles':
        return (
          <View style={styles.section}>
            <AppText variant="title" color="ink">
              Métricas consolidadas
            </AppText>
            <AppText variant="body" color="mute">
              Resumen acumulado de rendimiento físico en tus sesiones de gimnasio.
            </AppText>

            <View style={styles.detailBox}>
              <View style={styles.detailItem}>
                <AppText variant="caption" color="mute">
                  Tiempo en gym
                </AppText>
                <AppText variant="title" color="ink">
                  {totalHours} h
                </AppText>
              </View>
              <View style={styles.detailItem}>
                <AppText variant="caption" color="mute">
                  Repeticiones acumuladas
                </AppText>
                <AppText variant="title" color="ink">
                  {totalReps.toLocaleString('es-ES')}
                </AppText>
              </View>
              <View style={styles.detailItem}>
                <AppText variant="caption" color="mute">
                  Peso máx levantado
                </AppText>
                <AppText variant="title" color="ink">
                  {maxWeight} kg
                </AppText>
              </View>
            </View>
          </View>
        );

      case 'heatmap':
        return (
          <View style={styles.section}>
            <AppText variant="title" color="ink">
              Asistencia y constancia (30 días)
            </AppText>
            <AppText variant="body" color="mute">
              Has entrenado {heatmapCount} días en los últimos 30 días. Tu meta establecida es de 4
              días a la semana.
            </AppText>

            <View style={styles.metricCard}>
              <AppText variant="body" color="ink">
                Cumplimiento de meta: {Math.round((heatmapCount / 16) * 100)}%
              </AppText>
              <AppText variant="caption" color="mute">
                Basado en un objetivo mensual de 16 sesiones (4 sesiones / semana).
              </AppText>
            </View>
          </View>
        );

      case 'volumeTrend':
        return (
          <View style={styles.section}>
            <AppText variant="title" color="ink">
              Evolución de volumen (8 semanas)
            </AppText>
            <AppText variant="body" color="mute">
              Carga total levantada (peso × repeticiones) semana por semana.
            </AppText>

            <View style={styles.listContainer}>
              {volumeTrend.map((vol, idx) => (
                <View key={idx} style={styles.listItemRow}>
                  <AppText variant="caption" color="mute">
                    Semana {idx + 1}
                  </AppText>
                  <AppText variant="body" color="ink">
                    {vol.toLocaleString('es-ES')} kg
                  </AppText>
                </View>
              ))}
            </View>
          </View>
        );

      case 'weeklyReps':
        return (
          <View style={styles.section}>
            <AppText variant="title" color="ink">
              Repeticiones esta semana
            </AppText>
            <AppText variant="body" color="mute">
              Variación de{' '}
              {percentageChange >= 0 ? `+${percentageChange}%` : `${percentageChange}%`} respecto a
              la semana anterior.
            </AppText>

            <View style={styles.detailBox}>
              <View style={styles.detailItem}>
                <AppText variant="caption" color="mute">
                  Total semana
                </AppText>
                <AppText variant="title" color="ink">
                  {dailyReps.reduce((a, b) => a + b, 0).toLocaleString('es-ES')}
                </AppText>
              </View>
              <View style={styles.detailItem}>
                <AppText variant="caption" color="mute">
                  Promedio diario
                </AppText>
                <AppText variant="title" color="ink">
                  {Math.round(dailyReps.reduce((a, b) => a + b, 0) / 7)}
                </AppText>
              </View>
            </View>
          </View>
        );

      case 'bodyWeight':
        return (
          <View style={styles.section}>
            <AppText variant="title" color="ink">
              Seguimiento de peso corporal
            </AppText>

            <View style={styles.detailBox}>
              <View style={styles.detailItem}>
                <AppText variant="caption" color="mute">
                  Último peso
                </AppText>
                <AppText variant="title" color="ink">
                  {latestKg !== null ? `${latestKg} kg` : '--'}
                </AppText>
              </View>
              <View style={styles.detailItem}>
                <AppText variant="caption" color="mute">
                  Media 7 días
                </AppText>
                <AppText variant="title" color="ink">
                  {avgKg !== null ? `${avgKg} kg` : '--'}
                </AppText>
              </View>
              <View style={styles.detailItem}>
                <AppText variant="caption" color="mute">
                  Variación
                </AppText>
                <AppText variant="title" color="ink">
                  {diffKg !== null ? `${diffKg > 0 ? '+' : ''}${diffKg} kg` : '--'}
                </AppText>
              </View>
            </View>
          </View>
        );

      case 'streakTasks':
        return (
          <View style={styles.section}>
            <AppText variant="title" color="ink">
              Mi día & Racha
            </AppText>

            <View style={styles.detailBox}>
              <View style={styles.detailItem}>
                <AppText variant="caption" color="mute">
                  Racha actual
                </AppText>
                <AppText variant="title" color="ink">
                  {streakDays} días
                </AppText>
              </View>
              <View style={styles.detailItem}>
                <AppText variant="caption" color="mute">
                  Tareas de hoy
                </AppText>
                <AppText variant="title" color="ink">
                  {tasksDone} / {tasksTotal}
                </AppText>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      {renderContent()}
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingVertical: 12,
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  descriptionText: {
    lineHeight: 20,
  },
  detailBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 6,
  },
  detailItem: {
    alignItems: 'center',
    gap: 4,
  },
  metricCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  listContainer: {
    gap: 8,
    marginTop: 4,
  },
  listItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
});
