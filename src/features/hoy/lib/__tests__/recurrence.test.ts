import type { ISODate } from '@/shared/lib/dates';

import { occurrencesInWindow, taskOccursOn, windowDates } from '../recurrence';

const d = (s: string) => s as ISODate;

describe('taskOccursOn', () => {
  it('tarea única solo aparece en su fecha', () => {
    const task = { date: '2026-11-10', repeatRule: 'none' };
    expect(taskOccursOn(task, d('2026-11-10'))).toBe(true);
    expect(taskOccursOn(task, d('2026-11-11'))).toBe(false);
  });

  it('diaria aparece desde su fecha de inicio, nunca antes', () => {
    const task = { date: '2026-11-10', repeatRule: 'daily' };
    expect(taskOccursOn(task, d('2026-11-09'))).toBe(false);
    expect(taskOccursOn(task, d('2026-11-10'))).toBe(true);
    expect(taskOccursOn(task, d('2027-03-01'))).toBe(true);
  });

  it('L-V solo aparece de lunes a viernes', () => {
    const task = { date: '2026-11-09', repeatRule: 'weekdays' }; // lunes
    expect(taskOccursOn(task, d('2026-11-13'))).toBe(true); // viernes
    expect(taskOccursOn(task, d('2026-11-14'))).toBe(false); // sábado
    expect(taskOccursOn(task, d('2026-11-15'))).toBe(false); // domingo
  });

  it('mensual aparece el mismo día de cada mes', () => {
    const task = { date: '2026-11-15', repeatRule: 'monthly' };
    expect(taskOccursOn(task, d('2026-12-15'))).toBe(true);
    expect(taskOccursOn(task, d('2026-12-16'))).toBe(false);
  });

  it('mensual del día 31 cae en el último día de meses cortos', () => {
    const task = { date: '2026-10-31', repeatRule: 'monthly' };
    expect(taskOccursOn(task, d('2026-11-30'))).toBe(true);
    expect(taskOccursOn(task, d('2026-11-29'))).toBe(false);
    expect(taskOccursOn(task, d('2027-02-28'))).toBe(true);
    expect(taskOccursOn(task, d('2026-12-31'))).toBe(true);
    expect(taskOccursOn(task, d('2026-12-30'))).toBe(false);
  });

  it('regla desconocida se comporta como tarea única', () => {
    const task = { date: '2026-11-10', repeatRule: 'custom' };
    expect(taskOccursOn(task, d('2026-11-10'))).toBe(true);
    expect(taskOccursOn(task, d('2026-11-11'))).toBe(false);
  });
});

describe('occurrencesInWindow', () => {
  it('no incluye fechas anteriores al inicio de la tarea', () => {
    const task = { date: '2026-11-12', repeatRule: 'daily' };
    expect(occurrencesInWindow(task, d('2026-11-10'), 4)).toEqual([
      '2026-11-12',
      '2026-11-13',
    ]);
  });
});

describe('windowDates', () => {
  it('genera días consecutivos cruzando de mes', () => {
    expect(windowDates(d('2026-11-29'), 3)).toEqual(['2026-11-29', '2026-11-30', '2026-12-01']);
  });
});
