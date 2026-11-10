import { useCallback, useEffect, useState } from 'react';

import { parseISODate, todayISO, toISODate, type ISODate } from '@/shared/lib/dates';
import { haptics } from '@/shared/lib/haptics';
import { uid } from '@/shared/lib/ids';

import {
  calculate7DayMovingAverage,
  calculateMaxWeight,
  calculateTotalReps,
  calculateWeightDiff,
  calculateWorkoutVolume,
  checkIsPersonalRecord,
  type MinimalSet,
} from '../lib/gymCalculations';
import { calculateWeeklyDailyReps } from '../../inicio/lib/inicioCalculations';
import { gymRepository } from '../repository/gym.repository';
import type { BodyWeightRow, ExerciseRow, SetRow, WorkoutRow } from '../repository/gym.schema';

export interface ActiveSet extends SetRow {
  exerciseName: string;
}

export interface UseGymReturn {
  workouts: WorkoutRow[];
  exercises: ExerciseRow[];
  bodyWeights: BodyWeightRow[];
  weightGoal: number;
  movingAverageKg: number[];
  weeklyAttendance: number;
  totalVolume: number;
  totalReps: number;
  maxWeight: number;
  historicalTotalReps: number;
  historicalMaxWeight: number;
  weeklyRepsData: { dailyReps: number[]; percentageChange: number };
  weightDiff: number | null;
  loading: boolean;
  // Sesión en vivo
  isWorkoutActive: boolean;
  activeWorkoutId: string | null;
  activeRoutineName: string;
  workoutDurationSec: number;
  restTimerSec: number;
  activeSets: ActiveSet[];
  // Acciones
  startWorkout: (routineName: string) => Promise<void>;
  finishWorkout: (notes?: string) => Promise<void>;
  completeSet: (setId: string, weight: number, reps: number) => Promise<void>;
  copyPreviousSet: (setId: string, exerciseId: string) => Promise<void>;
  startRestTimer: (seconds?: number) => void;
  logBodyWeight: (kg: number, date?: ISODate) => Promise<void>;
  setWeightGoal: (goal: number) => void;
}

// Función auxiliar
export function calculateWeeklyAttendance(workoutStartTimes: number[], refDate: ISODate): number {
  const refTime = parseISODate(refDate).getTime();
  const sevenDaysMs = 7 * 86_400_000;

  const uniqueDays = new Set<string>();

  workoutStartTimes.forEach((t) => {
    const diff = refTime - t;
    if (diff >= 0 && diff < sevenDaysMs) {
      uniqueDays.add(toISODate(new Date(t)));
    }
  });

  return uniqueDays.size;
}

export function useGym(): UseGymReturn {
  const [workouts, setWorkouts] = useState<WorkoutRow[]>([]);
  const [exercises, setExercises] = useState<ExerciseRow[]>([]);
  const [bodyWeights, setBodyWeights] = useState<BodyWeightRow[]>([]);
  const [allSets, setAllSets] = useState<SetRow[]>([]);
  const [weightGoal, setWeightGoal] = useState<number>(75.0);
  const [loading, setLoading] = useState(true);

  // Estado de Sesión activa
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(null);
  const [activeRoutineName, setActiveRoutineName] = useState('Push');
  const [workoutDurationSec, setWorkoutDurationSec] = useState(0);
  const [restTimerSec, setRestTimerSec] = useState(0);
  const [activeSets, setActiveSets] = useState<ActiveSet[]>([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [wList, eList, bwList, sList, activeW] = await Promise.all([
        gymRepository.getWorkouts(),
        gymRepository.getExercises(),
        gymRepository.getBodyWeights(),
        gymRepository.getAllSets(),
        gymRepository.getActiveWorkout(),
      ]);

      let currentExercises = eList;
      if (eList.length === 0) {
        // Crear ejercicios por defecto si está vacío
        const defaults = [
          { id: uid(), name: 'Bench Press', muscleGroup: 'chest' },
          { id: uid(), name: 'Incline DB Press', muscleGroup: 'chest' },
          { id: uid(), name: 'Overhead Press', muscleGroup: 'shoulders' },
          { id: uid(), name: 'Lateral Raises', muscleGroup: 'shoulders' },
          { id: uid(), name: 'Triceps Pushdown', muscleGroup: 'arms' },
        ];
        for (const ex of defaults) {
          await gymRepository.addExercise(ex);
        }
        currentExercises = await gymRepository.getExercises();
      }

      setWorkouts(wList);
      setExercises(currentExercises);
      setBodyWeights(bwList);
      setAllSets(sList);

      if (activeW) {
        setIsWorkoutActive(true);
        setActiveWorkoutId(activeW.id);
        setActiveRoutineName(activeW.name);

        const duration = Math.floor((Date.now() - activeW.startTime) / 1000);
        setWorkoutDurationSec(duration);

        const workoutSets = await gymRepository.getSetsForWorkout(activeW.id);
        const mappedSets = workoutSets
          .map((s) => {
            const ex = currentExercises.find((e) => e.id === s.exerciseId);
            return {
              ...s,
              exerciseName: ex ? ex.name : 'Unknown',
            };
          })
          .sort((a, b) => a.orderIndex - b.orderIndex);

        setActiveSets(mappedSets);
      } else {
        setIsWorkoutActive(false);
        setActiveWorkoutId(null);
        setActiveSets([]);
        setWorkoutDurationSec(0);
      }
    } catch {
      // ignora error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    loadData();
  }, [loadData]);

  // Timer de duración de workout
  useEffect(() => {
    let interval: any;
    if (isWorkoutActive && activeWorkoutId) {
      interval = setInterval(() => {
        setWorkoutDurationSec((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive, activeWorkoutId]);

  // Timer de descanso
  useEffect(() => {
    let interval: any;
    if (restTimerSec > 0) {
      interval = setInterval(() => {
        setRestTimerSec((prev) => {
          if (prev <= 1) {
            haptics.success();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [restTimerSec]);

  const startWorkout = async (routineName: string) => {
    haptics.tap();
    const newWorkoutId = uid();
    await gymRepository.addWorkout({
      id: newWorkoutId,
      startTime: Date.now(),
      name: routineName,
    });

    let currentEx = exercises;
    if (currentEx.length === 0) {
      currentEx = await gymRepository.getExercises();
    }
    if (currentEx.length === 0) {
      const defaults = [
        { id: uid(), name: 'Bench Press', muscleGroup: 'chest' },
        { id: uid(), name: 'Incline DB Press', muscleGroup: 'chest' },
        { id: uid(), name: 'Overhead Press', muscleGroup: 'shoulders' },
      ];
      for (const ex of defaults) {
        await gymRepository.addExercise(ex);
      }
      currentEx = await gymRepository.getExercises();
    }

    let order = 0;
    for (const ex of currentEx.slice(0, 3)) {
      for (let i = 0; i < 4; i++) {
        await gymRepository.addSet({
          id: uid(),
          workoutId: newWorkoutId,
          exerciseId: ex.id,
          orderIndex: order++,
          weight: 0,
          reps: 0,
          completed: false,
          isPr: false,
        });
      }
    }

    setRestTimerSec(0);
    await loadData();
  };

  const finishWorkout = async (notes?: string) => {
    if (!activeWorkoutId) return;
    haptics.success();
    await gymRepository.finishWorkout(activeWorkoutId, Date.now(), notes);
    setRestTimerSec(0);
    await loadData();
  };

  const completeSet = async (setId: string, weight: number, reps: number) => {
    haptics.tap();
    const targetSet = activeSets.find((s) => s.id === setId);
    if (!targetSet) return;

    const previousSetsRaw = await gymRepository.getSetsForExercise(targetSet.exerciseId);
    // Filtrar solo los completados que no sean de esta sesión activa o los previos
    const previousMinimal: MinimalSet[] = previousSetsRaw
      .filter((s) => s.completed && s.id !== setId)
      .map((s) => ({
        weight: s.weight,
        reps: s.reps,
      }));

    const isPr = checkIsPersonalRecord({ weight, reps }, previousMinimal);
    if (isPr) haptics.success();

    await gymRepository.updateSet(setId, { weight, reps, completed: true, isPr });
    startRestTimer(90);
    await loadData();
  };

  const copyPreviousSet = async (setId: string, exerciseId: string) => {
    const previousSetsRaw = await gymRepository.getSetsForExercise(exerciseId);
    const completed = previousSetsRaw
      .filter((s) => s.completed)
      .sort((a, b) => {
        // asumimos orden inserción, idealmente usaríamos fecha pero están mezclados
        return a.id.localeCompare(b.id);
      });

    if (completed.length === 0) {
      await completeSet(setId, 50, 10);
      return;
    }

    const last = completed[completed.length - 1];
    if (last) {
      await completeSet(setId, last.weight, last.reps);
    }
  };

  const startRestTimer = (seconds = 90) => {
    setRestTimerSec(seconds);
  };

  const logBodyWeight = async (kg: number, date: ISODate = todayISO()) => {
    haptics.tap();
    await gymRepository.addBodyWeight(date, kg);
    await loadData();
  };

  // Métricas derivadas
  const movingAverageKg = calculate7DayMovingAverage(bodyWeights);
  const workoutStartTimes = workouts.map((w) => w.startTime);
  const weeklyAttendance = calculateWeeklyAttendance(workoutStartTimes, todayISO());

  const completedActive = activeSets
    .filter((s) => s.completed)
    .map((s) => ({ weight: s.weight, reps: s.reps }));
  const totalVolume = calculateWorkoutVolume(completedActive);
  const totalReps = calculateTotalReps(completedActive);
  const maxWeight = calculateMaxWeight(completedActive);
  const weightDiff = calculateWeightDiff(bodyWeights);

  const completedHistorical = allSets.filter((s) => s.completed);
  const historicalTotalReps = calculateTotalReps(completedHistorical);
  const historicalMaxWeight = calculateMaxWeight(completedHistorical);

  // Formatear workouts simulados para calculateWeeklyDailyReps (espera un date ISO)
  const mappedWorkouts = workouts.map((w) => ({
    ...w,
    date: toISODate(new Date(w.startTime)) as ISODate,
    durationMin: w.endTime ? Math.floor((w.endTime - w.startTime) / 60000) : 0,
  }));
  const weeklyRepsData = calculateWeeklyDailyReps(mappedWorkouts, completedHistorical, todayISO());

  return {
    workouts,
    exercises,
    bodyWeights,
    weightGoal,
    movingAverageKg,
    weeklyAttendance,
    totalVolume,
    totalReps,
    maxWeight,
    historicalTotalReps,
    historicalMaxWeight,
    weeklyRepsData,
    weightDiff,
    loading,
    isWorkoutActive,
    activeWorkoutId,
    activeRoutineName,
    workoutDurationSec,
    restTimerSec,
    activeSets,
    startWorkout,
    finishWorkout,
    completeSet,
    copyPreviousSet,
    startRestTimer,
    logBodyWeight,
    setWeightGoal,
  };
}
