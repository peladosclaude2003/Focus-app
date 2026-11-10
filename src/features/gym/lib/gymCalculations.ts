import { parseISODate, type ISODate } from '@/shared/lib/dates';

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
  const refTime = parseISODate(refDate).getTime();
  const sevenDaysMs = 7 * 86_400_000;

  return workoutDates.filter((dateStr) => {
    const t = parseISODate(dateStr).getTime();
    const diff = refTime - t;
    return diff >= 0 && diff < sevenDaysMs;
  }).length;
}
