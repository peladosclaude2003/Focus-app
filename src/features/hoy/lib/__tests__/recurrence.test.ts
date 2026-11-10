import type { ISODate } from '@/shared/lib/dates';

import { taskOccursOn } from '../recurrence';

const d = (s: string) => s as ISODate;

describe('taskOccursOn', () => {
  it('tarea única solo aparece en su fecha', () => {
    const task = { date: '2026-11-10', repeatRule: 'none' as const };
    expect(taskOccursOn(task, d('2026-11-10'))).toBe(true);
    expect(taskOccursOn(task, d('2026-11-11'))).toBe(false);
  });

  it('tarea diaria aparece desde su inicio en adelante, nunca antes', () => {
    const task = { date: '2026-11-10', repeatRule: 'daily' as const };
    expect(taskOccursOn(task, d('2026-11-09'))).toBe(false);
    expect(taskOccursOn(task, d('2026-11-10'))).toBe(true);
    expect(taskOccursOn(task, d('2027-01-03'))).toBe(true);
  });

  it('tarea L-V no aparece en fin de semana', () => {
    const task = { date: '2026-11-09', repeatRule: 'weekdays' as const }; // lunes
    expect(taskOccursOn(task, d('2026-11-13'))).toBe(true); // viernes
    expect(taskOccursOn(task, d('2026-11-14'))).toBe(false); // sábado
    expect(taskOccursOn(task, d('2026-11-15'))).toBe(false); // domingo
  });

  it('tarea mensual del 31 cae en el último día de meses cortos', () => {
    const task = { date: '2026-10-31', repeatRule: 'monthly' as const };
    expect(taskOccursOn(task, d('2026-11-30'))).toBe(true);
    expect(taskOccursOn(task, d('2026-11-29'))).toBe(false);
    expect(taskOccursOn(task, d('2026-12-31'))).toBe(true);
    expect(taskOccursOn(task, d('2027-02-28'))).toBe(true);
  });
});
