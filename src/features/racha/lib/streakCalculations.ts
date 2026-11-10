import { intervalToDuration, type Duration } from 'date-fns';

import { parseISODate, toISODate, todayISO, type ISODate } from '@/shared/lib/dates';
import type { HeatmapDay } from '@/shared/ui';

export const STREAK_MILESTONES = [7, 14, 30, 60, 90, 180, 365] as const;

export interface MilestoneProgress {
  target: number;
  daysRemaining: number;
  progressPercent: number;
  isMilestoneReached: boolean;
}

export interface StreakStats {
  currentDurationMs: number;
  bestDurationMs: number;
  milestone: MilestoneProgress;
  exactDuration: Duration;
}

/**
 * Retorna la información del hito más cercano a alcanzar.
 */
export function getNextMilestone(currentDays: number): MilestoneProgress {
  let target = STREAK_MILESTONES[STREAK_MILESTONES.length - 1] ?? 365;

  for (const m of STREAK_MILESTONES) {
    if (currentDays < m) {
      target = m;
      break;
    }
  }

  const daysRemaining = Math.max(0, target - currentDays);
  const progressPercent = Math.min(100, Math.round((currentDays / target) * 100));
  const isMilestoneReached = currentDays > 0 && STREAK_MILESTONES.includes(currentDays as any);

  return {
    target,
    daysRemaining,
    progressPercent,
    isMilestoneReached,
  };
}

/**
 * Genera la cuadrícula de los últimos 30 días para el PillHeatmap.
 */
export function generate30DaysHeatmap(
  startDateEpoch: number | null,
  resetDatesEpoch: number[] = [],
  refDate: ISODate = todayISO(),
): HeatmapDay[] {
  const resetSet = new Set(resetDatesEpoch.map((t) => toISODate(new Date(t))));

  return Array.from({ length: 30 }, (_, i) => {
    const daysAgo = 29 - i;
    const dateObj = parseISODate(refDate);
    dateObj.setDate(dateObj.getDate() - daysAgo);
    const iso = toISODate(dateObj);

    if (iso === refDate) {
      return { dayNumber: i + 1, state: 'today' };
    }

    if (resetSet.has(iso)) {
      return { dayNumber: i + 1, state: 'rest' };
    }

    if (startDateEpoch) {
      const startIso = toISODate(new Date(startDateEpoch));
      if (iso >= startIso && iso < refDate) {
        return { dayNumber: i + 1, state: 'done' };
      }
    }

    return { dayNumber: i + 1, state: 'pending' };
  });
}

/**
 * Calcula métricas puras de racha basadas en timestamp exacto.
 */
export function calculateStreakStats(
  startAt: number | null,
  bestDurationMsSoFar = 0,
  nowMs: number = Date.now(),
): StreakStats {
  if (!startAt) {
    return {
      currentDurationMs: 0,
      bestDurationMs: bestDurationMsSoFar,
      exactDuration: {},
      milestone: {
        target: 7,
        daysRemaining: 7,
        progressPercent: 0,
        isMilestoneReached: false,
      },
    };
  }

  const currentDurationMs = Math.max(0, nowMs - startAt);
  const bestDurationMs = Math.max(bestDurationMsSoFar, currentDurationMs);

  const currentDaysFractions = currentDurationMs / (1000 * 60 * 60 * 24);
  const exactDuration = intervalToDuration({ start: startAt, end: nowMs });

  const milestone = getNextMilestone(Math.floor(currentDaysFractions));

  return {
    currentDurationMs,
    bestDurationMs,
    exactDuration,
    milestone,
  };
}
