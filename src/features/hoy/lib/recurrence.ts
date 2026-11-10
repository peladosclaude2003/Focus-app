import { parseISODate, type ISODate } from '@/shared/lib/dates';

import type { RepeatRule } from '../repository/tasks.schema';

export interface RecurringTask {
  date: string; // YYYY-MM-DD (primer día de la tarea)
  repeatRule: RepeatRule;
}

/**
 * ¿La tarea aparece en `targetDate`?
 * Las recurrentes solo aparecen a partir de su fecha de inicio (nunca antes).
 * Fuente única de verdad: la usan el repositorio y los recordatorios.
 */
export function taskOccursOn(task: RecurringTask, targetDate: ISODate): boolean {
  if (task.date > targetDate) return false;

  switch (task.repeatRule) {
    case 'none':
      return task.date === targetDate;
    case 'daily':
      return true;
    case 'weekdays': {
      const day = parseISODate(targetDate).getDay();
      return day >= 1 && day <= 5;
    }
    case 'monthly': {
      const startDay = parseISODate(task.date as ISODate).getDate();
      const target = parseISODate(targetDate);
      const lastDayOfMonth = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
      // Una tarea del día 31 aparece el último día de los meses más cortos.
      return target.getDate() === Math.min(startDay, lastDayOfMonth);
    }
    default:
      // 'custom' aún no tiene UI: se trata como tarea única para que nunca "desaparezca".
      return task.date === targetDate;
  }
}
