import { daysBetween, toISODate, type ISODate } from '@/shared/lib/dates';

export interface MinimalSet {
  weight: number;
  reps: number;
}

export interface WeightRecord {
  date: string;
  kg: number;
}

/** Volumen de una sola serie (peso × repeticiones). */
export function calculateSetVolume(weight: number, reps: number): number {
  if (weight < 0 || reps < 0) return 0;
  return Number((weight * reps).toFixed(2));
}

/** Volumen total acumulado de una sesión (suma del volumen de cada serie). */
export function calculateWorkoutVolume(setsList: MinimalSet[]): number {
  return Number(
    setsList.reduce((sum, s) => sum + calculateSetVolume(s.weight, s.reps), 0).toFixed(2),
  );
}

/** Suma de todas las repeticiones ejecutadas. */
export function calculateTotalReps(setsList: MinimalSet[]): number {
  return setsList.reduce((sum, s) => sum + Math.max(0, s.reps), 0);
}

/** Peso máximo registrado en un conjunto de series. */
export function calculateMaxWeight(setsList: MinimalSet[]): number {
  if (setsList.length === 0) return 0;
  return Math.max(0, ...setsList.map((s) => s.weight));
}

/**
 * Determina si una nueva serie supera el Récord Personal (PR) histórico
 * para un ejercicio dado. Un PR ocurre si el peso es estrictamente mayor al
 * récord previo, o si iguala el récord en peso pero supera las repeticiones.
 */
export function checkIsPersonalRecord(newSet: MinimalSet, previousSets: MinimalSet[]): boolean {
  if (newSet.weight <= 0 || newSet.reps <= 0) return false;
  if (previousSets.length === 0) return true;

  const maxWeight = Math.max(...previousSets.map((s) => s.weight));
  if (newSet.weight > maxWeight) return true;

  if (newSet.weight === maxWeight) {
    const maxRepsAtMaxWeight = Math.max(
      ...previousSets.filter((s) => s.weight === maxWeight).map((s) => s.reps),
    );
    return newSet.reps > maxRepsAtMaxWeight;
  }

  return false;
}

/**
 * Calcula la variación de peso corporal desde el registro más antiguo hasta el más reciente.
 */
export function calculateWeightDiff(records: WeightRecord[]): number | null {
  if (records.length < 2) return null;

  const sorted = [...records].sort((a, b) => (a.date < b.date ? -1 : 1));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  if (!first || !last) return null;
  return Number((last.kg - first.kg).toFixed(1));
}

/**
 * Calcula la media móvil de 7 días para el peso corporal.
 */
export function calculate7DayMovingAverage(records: WeightRecord[]): number[] {
  if (records.length === 0) return [];
  const sorted = [...records].sort((a, b) => (a.date < b.date ? -1 : 1));

  return sorted.map((_, idx) => {
    const startIdx = Math.max(0, idx - 6);
    const window = sorted.slice(startIdx, idx + 1);
    const sum = window.reduce((acc, item) => acc + item.kg, 0);
    return Number((sum / window.length).toFixed(1));
  });
}

/**
 * Calcula el número de entrenamientos asistidos en los últimos 7 días.
 */
export function calculateWeeklyAttendance(workoutDates: ISODate[], refDate: ISODate): number {
  // Días calendario (no milisegundos): incluye hoy y es inmune a cambios de horario.
  return workoutDates.filter((dateStr) => {
    const diff = daysBetween(dateStr, refDate);
    return diff >= 0 && diff < 7;
  }).length;
}

export interface SessionWorkout {
  id: string;
  startTime: number; // epoch ms
  endTime: number | null;
}

export interface SessionSet extends MinimalSet {
  workoutId: string;
  completed: boolean;
}

export interface SessionProgressPoint {
  workoutId: string;
  date: ISODate;
  volume: number; // kg × reps de la sesión
  reps: number;
}

export interface SessionProgress {
  points: SessionProgressPoint[]; // orden cronológico (la más reciente al final)
  /** Variación % del volumen de la última sesión vs la anterior (null si no hay con qué comparar). */
  percentageChange: number | null;
}

/**
 * Progreso por sesión: volumen y reps de las últimas `limit` sesiones terminadas
 * que tengan al menos una serie completada. Sustituye a la vista por días de la semana,
 * que no reflejaba si el usuario está progresando.
 */
export function calculateSessionProgress(
  workoutsList: SessionWorkout[],
  setsList: SessionSet[],
  limit = 8,
): SessionProgress {
  const byWorkout = new Map<string, MinimalSet[]>();
  for (const s of setsList) {
    if (!s.completed) continue;
    const list = byWorkout.get(s.workoutId) ?? [];
    list.push(s);
    byWorkout.set(s.workoutId, list);
  }

  const points = workoutsList
    .filter((w) => w.endTime !== null && byWorkout.has(w.id))
    .sort((a, b) => a.startTime - b.startTime)
    .slice(-limit)
    .map((w) => {
      const wSets = byWorkout.get(w.id) ?? [];
      return {
        workoutId: w.id,
        date: toISODate(new Date(w.startTime)),
        volume: Math.round(calculateWorkoutVolume(wSets)),
        reps: calculateTotalReps(wSets),
      };
    });

  const last = points[points.length - 1];
  const prev = points[points.length - 2];
  const percentageChange =
    last && prev && prev.volume > 0
      ? Math.round(((last.volume - prev.volume) / prev.volume) * 100)
      : null;

  return { points, percentageChange };
}
