import {
  calculateStreakStats,
  generate30DaysHeatmap,
  getNextMilestone,
} from '../streakCalculations';
import type { ISODate } from '@/shared/lib/dates';

describe('streakCalculations', () => {
  it('returns zeros when startAt is null', () => {
    const stats = calculateStreakStats(null);
    expect(stats.currentDurationMs).toBe(0);
    expect(stats.bestDurationMs).toBe(0);
    expect(stats.milestone.target).toBe(7);
  });

  it('calculates milestones correctly', () => {
    expect(getNextMilestone(3).target).toBe(7);
    expect(getNextMilestone(3).daysRemaining).toBe(4);
    expect(getNextMilestone(10).target).toBe(14);
    expect(getNextMilestone(30).target).toBe(60);
  });

  it('generates 30 days heatmap with correct states', () => {
    const startDate = new Date('2026-09-24T00:00:00Z').getTime();
    const refDate = '2026-10-04' as ISODate;
    const resets = [new Date('2026-09-20T00:00:00Z').getTime()];

    const heatmap = generate30DaysHeatmap(startDate, resets, refDate);

    expect(heatmap.length).toBe(30);
    expect(heatmap[29]?.state).toBe('today');
  });

  it('handles timezone change and leap years accurately using exact timestamps', () => {
    const startAt = new Date('2024-02-28T23:00:00Z').getTime(); // Leap year, late night
    const nowMs = new Date('2024-03-01T01:00:00Z').getTime(); // Leap year, next day cross month
    const stats = calculateStreakStats(startAt, 0, nowMs);

    // Exactly 26 hours duration
    expect(stats.currentDurationMs).toBe(26 * 60 * 60 * 1000);
    expect(stats.exactDuration.days).toBe(1);
    expect(stats.exactDuration.hours).toBe(2);
  });
});
