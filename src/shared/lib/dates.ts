import { LOCALE } from '@/shared/i18n';

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
} from 'date-fns';

/**
 * Fechas en ISO **local** (nunca UTC) para que "hoy" sea el día del usuario.
 * - ISODate:     YYYY-MM-DD
 * - ISODateTime: YYYY-MM-DDTHH:mm:ss (sin zona)
 * Los tipos "brand" evitan mezclar strings arbitrarios con fechas.
 */
export type ISODate = string & { readonly __brand: 'ISODate' };
export type ISODateTime = string & { readonly __brand: 'ISODateTime' };

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MS_PER_DAY = 86_400_000;

const pad = (n: number): string => String(n).padStart(2, '0');

export function toISODate(date: Date): ISODate {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` as ISODate;
}

export function toISODateTime(date: Date): ISODateTime {
  return `${toISODate(date)}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds(),
  )}` as ISODateTime;
}

export function todayISO(now: Date = new Date()): ISODate {
  return toISODate(now);
}

export function nowISO(now: Date = new Date()): ISODateTime {
  return toISODateTime(now);
}

export function isISODate(value: string): value is ISODate {
  if (!ISO_DATE_RE.test(value)) return false;
  return toISODate(parseISODate(value as ISODate)) === value;
}

/** Medianoche local del día indicado. */
export function parseISODate(iso: ISODate): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y ?? 0, (m ?? 1) - 1, d ?? 1);
}

/** Días calendario de `from` a `to` (redondeado: tolera cambios de horario). */
export function daysBetween(from: ISODate, to: ISODate): number {
  return Math.round((parseISODate(to).getTime() - parseISODate(from).getTime()) / MS_PER_DAY);
}

export function addDays(iso: ISODate, days: number): ISODate {
  const date = parseISODate(iso);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

/** "domingo, 4 de octubre" */
export function formatLongDate(iso: ISODate): string {
  return parseISODate(iso).toLocaleDateString(LOCALE, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

/** "octubre 2026" */
export function formatMonthYear(iso: ISODate): string {
  return parseISODate(iso).toLocaleDateString(LOCALE, {
    month: 'long',
    year: 'numeric',
  });
}

/** Genera la cuadrícula de días para un mes, rellenando con días del mes anterior/siguiente para completar semanas completas. */
export function getMonthCalendarGrid(
  monthDateISO: ISODate,
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 1,
): ISODate[] {
  const date = parseISODate(monthDateISO);
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn });
  const endDate = endOfWeek(monthEnd, { weekStartsOn });

  return eachDayOfInterval({ start: startDate, end: endDate }).map(toISODate);
}

export function getNextMonth(iso: ISODate): ISODate {
  return toISODate(addMonths(parseISODate(iso), 1));
}

export function getPrevMonth(iso: ISODate): ISODate {
  return toISODate(subMonths(parseISODate(iso), 1));
}
