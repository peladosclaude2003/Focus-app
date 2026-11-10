import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import {
  calculate7DayMovingAverage,
  calculateWeightDiff,
} from '@/features/gym/lib/gymCalculations';
import { daysBetween, toISODate, todayISO, type ISODate } from '@/shared/lib/dates';

import {
  calculate8WeekVolumeTrend,
  calculateDashboardStats,
  calculateHeatmapData,
  calculateWeeklyDailyReps,
} from '../lib/inicioCalculations';
import { inicioRepository } from '../repository/inicio.repository';

export type BentoCardType =
  | 'todayWorkout'
  | 'statTiles'
  | 'heatmap'
  | 'volumeTrend'
  | 'weeklyReps'
  | 'bodyWeight'
  | 'streakTasks';

export function useInicioData() {
  const [loading, setLoading] = useState(true);
  const [todayDate] = useState<ISODate>(todayISO());

  const [todayWorkoutName, setTodayWorkoutName] = useState<string | null>(null);
  const [hasWorkoutToday, setHasWorkoutToday] = useState(false);

  const [stats, setStats] = useState({ totalHours: 0, totalReps: 0, maxWeight: 0 });
  const [heatmapData, setHeatmapData] = useState<boolean[]>([]);
  const [volumeTrend, setVolumeTrend] = useState<number[]>([]);
  const [weeklyReps, setWeeklyReps] = useState<{ dailyReps: number[]; percentageChange: number }>({
    dailyReps: [0, 0, 0, 0, 0, 0, 0],
    percentageChange: 0,
  });

  const [weightInfo, setWeightInfo] = useState<{
    latestKg: number | null;
    avgKg: number | null;
    diffKg: number | null;
  }>({
    latestKg: null,
    avgKg: null,
    diffKg: null,
  });

  const [streakTasksInfo, setStreakTasksInfo] = useState({
    streakDays: 0,
    habitName: '',
    tasksDone: 0,
    tasksTotal: 0,
  });

  const [selectedCard, setSelectedCard] = useState<BentoCardType | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await inicioRepository.getDashboardRawData(todayDate);

      // 1. Entrenamiento de hoy
      const workoutToday = data.workouts.find((w) => w.date === todayDate);
      if (workoutToday) {
        setTodayWorkoutName(workoutToday.name);
        setHasWorkoutToday(true);
      } else {
        setTodayWorkoutName('Push A (Hipertrofia)');
        setHasWorkoutToday(false);
      }

      // 2. Stat Tiles
      const dashboardStats = calculateDashboardStats(data.workouts, data.sets);
      setStats(dashboardStats);

      // 3. Heatmap
      const heatmap = calculateHeatmapData(data.workouts, todayDate);
      setHeatmapData(heatmap);

      // 4. Volumen 8 semanas
      const trend = calculate8WeekVolumeTrend(data.workouts, data.sets, todayDate);
      setVolumeTrend(trend);

      // 5. Repeticiones esta semana
      const repsResult = calculateWeeklyDailyReps(data.workouts, data.sets, todayDate);
      setWeeklyReps(repsResult);

      // 6. Peso corporal
      const latestWeight = data.bodyWeights[0]?.kg ?? null;
      const averages = calculate7DayMovingAverage(data.bodyWeights);
      const avgKg = averages.length > 0 ? averages[averages.length - 1]! : null;
      const diffKg = calculateWeightDiff(data.bodyWeights);

      setWeightInfo({
        latestKg: latestWeight,
        avgKg: avgKg ?? null,
        diffKg,
      });

      // 7. Racha & Tareas
      const streakDays = data.streak
        ? Math.max(0, daysBetween(toISODate(new Date(data.streak.startAt)) as ISODate, todayDate))
        : 0;
      const habitName = data.streak?.name ?? '';
      const tasksDone = data.tasks.filter((t) => t.done).length;
      const tasksTotal = data.tasks.length;

      setStreakTasksInfo({
        streakDays,
        habitName,
        tasksDone,
        tasksTotal,
      });
    } catch (err) {
      console.error('Error al cargar datos de Inicio:', err);
    } finally {
      setLoading(false);
    }
  }, [todayDate]);

  useFocusEffect(
    useCallback(() => {
      void loadData();
    }, [loadData]),
  );

  return {
    loading,
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
    openCardDetail: (card: BentoCardType) => setSelectedCard(card),
    closeCardDetail: () => setSelectedCard(null),
    refresh: loadData,
  };
}
