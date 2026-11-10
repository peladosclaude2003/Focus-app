import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useInicioData } from '@/features/inicio/hooks/useInicioData';
import { formatLongDate } from '@/shared/lib/dates';
import { AppText, Screen } from '@/shared/ui';

import { BodyWeightBentoCard } from '../components/BodyWeightBentoCard';
import { HeatmapBentoCard } from '../components/HeatmapBentoCard';
import { InicioDetailSheet } from '../components/InicioDetailSheet';
import { StatTilesRow } from '../components/StatTilesRow';
import { StreakTasksBentoCard } from '../components/StreakTasksBentoCard';
import { TodayWorkoutBentoCard } from '../components/TodayWorkoutBentoCard';
import { VolumeTrendBentoCard } from '../components/VolumeTrendBentoCard';
import { WeeklyRepsBentoCard } from '../components/WeeklyRepsBentoCard';

export function InicioScreen() {
  const router = useRouter();
  const {
    todayDate,
    todayWorkoutName,
    hasWorkoutToday,
    stats,
    heatmapData,
    volumeTrend,
    weeklyReps,
    weightInfo,
    streakTasksInfo,
    selectedCard,
    openCardDetail,
    closeCardDetail,
  } = useInicioData();

  const handleStartWorkout = () => {
    router.push('/(tabs)/gym');
  };

  const formattedDate = formatLongDate(todayDate);
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <Screen title="Inicio">
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <AppText variant="caption" color="mute" style={styles.dateHeader}>
          {capitalizedDate}
        </AppText>

        <View style={styles.bentoGrid}>
          {/* 1. Tarjeta Hoy / Entrenamiento */}
          <TodayWorkoutBentoCard
            routineName={todayWorkoutName ?? 'Push A (Hipertrofia)'}
            isCompleted={hasWorkoutToday}
            onPress={() => openCardDetail('todayWorkout')}
            onStartWorkout={handleStartWorkout}
          />

          {/* 2. Tres StatTiles (Horas, Reps, Máx Peso) */}
          <StatTilesRow
            totalHours={stats.totalHours}
            totalReps={stats.totalReps}
            maxWeight={stats.maxWeight}
            onPress={() => openCardDetail('statTiles')}
          />

          {/* 3. PillHeatmap de 30 días */}
          <HeatmapBentoCard heatmapData={heatmapData} onPress={() => openCardDetail('heatmap')} />

          {/* 4. Tendencia de Volumen 8 Semanas (AreaSparkline) */}
          <VolumeTrendBentoCard
            volumeTrend={volumeTrend}
            onPress={() => openCardDetail('volumeTrend')}
          />

          {/* 5. Repeticiones Esta Semana (MiniBarChart + DeltaChip) */}
          <WeeklyRepsBentoCard
            dailyReps={weeklyReps.dailyReps}
            percentageChange={weeklyReps.percentageChange}
            onPress={() => openCardDetail('weeklyReps')}
          />

          {/* 6. Peso Corporal */}
          <BodyWeightBentoCard
            latestKg={weightInfo.latestKg}
            avgKg={weightInfo.avgKg}
            diffKg={weightInfo.diffKg}
            onPress={() => openCardDetail('bodyWeight')}
          />

          {/* 7. Tarjeta Compacta Racha & Tareas */}
          <StreakTasksBentoCard
            streakDays={streakTasksInfo.streakDays}
            habitName={streakTasksInfo.habitName}
            tasksDone={streakTasksInfo.tasksDone}
            tasksTotal={streakTasksInfo.tasksTotal}
            onPress={() => openCardDetail('streakTasks')}
          />
        </View>
      </ScrollView>

      {/* Sheet de detalle ampliado */}
      <InicioDetailSheet
        selectedCard={selectedCard}
        onClose={closeCardDetail}
        routineName={todayWorkoutName ?? 'Push A (Hipertrofia)'}
        totalHours={stats.totalHours}
        totalReps={stats.totalReps}
        maxWeight={stats.maxWeight}
        heatmapCount={heatmapData.filter(Boolean).length}
        volumeTrend={volumeTrend}
        dailyReps={weeklyReps.dailyReps}
        percentageChange={weeklyReps.percentageChange}
        latestKg={weightInfo.latestKg}
        avgKg={weightInfo.avgKg}
        diffKg={weightInfo.diffKg}
        streakDays={streakTasksInfo.streakDays}
        habitName={streakTasksInfo.habitName}
        tasksDone={streakTasksInfo.tasksDone}
        tasksTotal={streakTasksInfo.tasksTotal}
        onStartWorkout={handleStartWorkout}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 110,
    gap: 16,
  },
  dateHeader: {
    marginTop: -4,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  bentoGrid: {
    gap: 16,
  },
});
