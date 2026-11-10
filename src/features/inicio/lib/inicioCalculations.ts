import type { MinimalSet } from '@/features/gym/lib/gymCalculations';
import { calculateSetVolume } from '@/features/gym/lib/gymCalculations';
import { addDays, daysBetween, parseISODate, toISODate, type ISODate } from '@/shared/lib/dates';

export interface DashboardWorkout {
  id: string;
  date: ISODate;
  durationMin: number;
}

export interface DashboardSet extends MinimalSet {
  workoutId: string;
}

export interface DashboardStats {
  totalHours: number;
  totalReps: number;
  maxWeight: number;
}

export interface WeeklyRepsResult {
  dailyReps: number[]; // 7 días (Lunes a Domingo)
  percentageChange: number; // Porcentaje vs semana anterior
}

/** Lunes (ISO local) de la semana que contiene `iso`. Trabaja en días calendario: inmune a DST. */
function mondayOf(iso: ISODate): ISODate {
  const daysSinceMonday = (parseISODate(iso).getDay() + 6) % 7;
  return addDays(iso, -daysSinceMonday);
}

/**
 * Calcula las estadísticas agregadas principales para el dashboard.
 */
export function calculateDashboardStats(
  workouts: DashboardWorkout[],
  setsList: DashboardSet[],
): DashboardStats {
  const totalMinutes = workouts.reduce((acc, w) => acc + Math.max(0, w.durationMin), 0);
  const totalHours = Number((totalMinutes / 60).toFixed(1));

  const totalReps = setsList.reduce((acc, s) => acc + Math.max(0, s.reps), 0);
  const maxWeight = setsList.reduce((max, s) => Math.max(max, s.weight), 0);

  return { totalHours, totalReps, maxWeight };
}

/**
 * Calcula la tendencia de volumen semanal durante las últimas 8 semanas concluidas a la fecha dada.
 */
export function calculate8WeekVolumeTrend(
  workouts: DashboardWorkout[],
  setsList: DashboardSet[],
  refDateStr: ISODate,
): number[] {
  const currentMonday = mondayOf(refDateStr);

  const weeks: number[] = new Array(8).fill(0);

  // Mapear volumen por workoutId
  const workoutVolumeMap = new Map<string, number>();
  for (const s of setsList) {
    const vol = calculateSetVolume(s.weight, s.reps);
    workoutVolumeMap.set(s.workoutId, (workoutVolumeMap.get(s.workoutId) ?? 0) + vol);
  }

  // Asignar cada entrenamiento a la semana correspondiente (0 = hace 7 semanas, 7 = semana actual)
  for (const w of workouts) {
    const diffDays = daysBetween(currentMonday, w.date);
    const weekIndex = 7 + Math.floor(diffDays / 7);

    if (weekIndex >= 0 && weekIndex < 8) {
      const vol = workoutVolumeMap.get(w.id) ?? 0;
      weeks[weekIndex] = (weeks[weekIndex] ?? 0) + vol;
    }
  }

  return weeks.map((v) => Math.round(v));
}

/**
 * Calcula las repeticiones diarias de la semana actual (Lunes-Domingo) y la variación % vs la semana previa.
 */
export function calculateWeeklyDailyReps(
  workouts: DashboardWorkout[],
  setsList: DashboardSet[],
  refDateStr: ISODate,
): WeeklyRepsResult {
  const currentMonday = mondayOf(refDateStr);
  const prevMonday = addDays(currentMonday, -7);

  const dailyReps = new Array(7).fill(0);
  let currentWeekTotalReps = 0;
  let prevWeekTotalReps = 0;

  // Mapa de repeticiones por workoutId
  const workoutRepsMap = new Map<string, number>();
  for (const s of setsList) {
    workoutRepsMap.set(s.workoutId, (workoutRepsMap.get(s.workoutId) ?? 0) + Math.max(0, s.reps));
  }

  for (const w of workouts) {
    const reps = workoutRepsMap.get(w.id) ?? 0;

    // Verificar si cae en semana actual
    const diffCurrent = daysBetween(currentMonday, w.date);
    if (diffCurrent >= 0 && diffCurrent < 7) {
      dailyReps[diffCurrent] += reps;
      currentWeekTotalReps += reps;
    }

    // Verificar si cae en semana anterior
    const diffPrev = daysBetween(prevMonday, w.date);
    if (diffPrev >= 0 && diffPrev < 7) {
      prevWeekTotalReps += reps;
    }
  }

  let percentageChange = 0;
  if (prevWeekTotalReps > 0) {
    percentageChange = Math.round(
      ((currentWeekTotalReps - prevWeekTotalReps) / prevWeekTotalReps) * 100,
    );
  } else if (currentWeekTotalReps > 0) {
    percentageChange = 100;
  }

  return { dailyReps, percentageChange };
}

/**
 * Genera el arreglo de 30 días para el PillHeatmap (true = hubo workout en esa fecha).
 */
export function calculateHeatmapData(workouts: DashboardWorkout[], refDateStr: ISODate): boolean[] {
  const refDate = parseISODate(refDateStr);
  const workoutDatesSet = new Set(workouts.map((w) => w.date));

  const result: boolean[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(refDate);
    d.setDate(refDate.getDate() - i);
    const dateStr = toISODate(d);
    result.push(workoutDatesSet.has(dateStr));
  }

  return result;
}
