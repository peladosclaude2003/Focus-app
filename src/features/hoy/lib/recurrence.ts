import { addDays, parseISODate, type ISODate } from '@/shared/lib/dates';

import type { RepeatRule } from '../repository/tasks.schema';

/** Días hacia adelante para los que se programan recordatorios de tareas recurrentes. */
export const REMINDER_WINDOW_DAYS = 14;

export interface RecurringTaskLike {
  date: string; // YYYY-MM-DD: fecha de inicio (o fecha única si no se repite)
  repeatRule: RepeatRule | string;
}

/**
 * Regla única de recurrencia: ¿la tarea aparece en `target`?
 * - Nunca aparece antes de su fecha de inicio.
 * - 'monthly' en día 29–31 cae en el último día de los meses más cortos.
 * - Reglas desconocidas ('custom' aún no tiene UI) se tratan como tarea única.
 */
export function taskOccursOn(task: RecurringTaskLike, target: ISODate): boolean {
  if (target < task.date) return false;

  switch (task.repeatRule) {
    case 'daily':
      return true;
    case 'weekdays': {
      const day = parseISODate(target).getDay();
      return day >= 1 && day <= 5;
    }
    case 'monthly': {
      const startDay = parseISODate(task.date as ISODate).getDate();
      const targetDate = parseISODate(target);
      const targetDay = targetDate.getDate();
      if (targetDay === startDay) return true;
      const lastDayOfMonth = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth() + 1,
        0,
      ).getDate();
      return startDay > lastDayOfMonth && targetDay === lastDayOfMonth;
    }
    default:
      return task.date === target;
  }
}

/** Fechas en las que ocurre la tarea dentro de `[from, from + days)`. */
export function occurrencesInWindow(
  task: RecurringTaskLike,
  from: ISODate,
  days: number = REMINDER_WINDOW_DAYS,
): ISODate[] {
  const result: ISODate[] = [];
  for (let i = 0; i < days; i++) {
    const d = addDays(from, i);
    if (taskOccursOn(task, d)) result.push(d);
  }
  return result;
}

/** Fechas de `[from, from + days)`, útil para cancelar recordatorios de una tarea. */
export function windowDates(from: ISODate, days: number = REMINDER_WINDOW_DAYS): ISODate[] {
  return Array.from({ length: days }, (_, i) => addDays(from, i));
}
