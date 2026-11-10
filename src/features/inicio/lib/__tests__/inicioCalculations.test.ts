import type { ISODate } from '@/shared/lib/dates';

import {
  calculate8WeekVolumeTrend,
  calculateDashboardStats,
  calculateHeatmapData,
  calculateWeeklyDailyReps,
  type DashboardSet,
  type DashboardWorkout,
} from '../inicioCalculations';

describe('inicioCalculations', () => {
  const sampleWorkouts: DashboardWorkout[] = [
    { id: 'w1', date: '2026-10-04' as ISODate, durationMin: 60 },
    { id: 'w2', date: '2026-10-02' as ISODate, durationMin: 45 },
    { id: 'w3', date: '2026-09-25' as ISODate, durationMin: 50 }, // semana anterior
  ];

  const sampleSets: DashboardSet[] = [
    { workoutId: 'w1', weight: 100, reps: 10 },
    { workoutId: 'w1', weight: 80, reps: 12 },
    { workoutId: 'w2', weight: 120, reps: 5 },
    { workoutId: 'w3', weight: 90, reps: 8 },
  ];

  it('calculateDashboardStats resume horas, repeticiones y peso máximo', () => {
    const stats = calculateDashboardStats(sampleWorkouts, sampleSets);
    expect(stats.totalHours).toBe(2.6);
    expect(stats.totalReps).toBe(35);
    expect(stats.maxWeight).toBe(120);
  });

  it('calculate8WeekVolumeTrend devuelve 8 semanas con volumen acumulado', () => {
    const trend = calculate8WeekVolumeTrend(sampleWorkouts, sampleSets, '2026-10-04' as ISODate);
    expect(trend).toHaveLength(8);
    expect(trend[7]).toBe(2560);
    expect(trend[6]).toBe(720);
  });

  it('calculateWeeklyDailyReps devuelve 7 días y la variación porcentual vs semana previa', () => {
    const result = calculateWeeklyDailyReps(sampleWorkouts, sampleSets, '2026-10-04' as ISODate);
    expect(result.dailyReps).toHaveLength(7);
    expect(result.dailyReps[6]).toBe(22);
    expect(result.dailyReps[4]).toBe(5);
    expect(result.percentageChange).toBe(238);
  });

  it('calculateHeatmapData genera 30 valores booleanos', () => {
    const heatmap = calculateHeatmapData(sampleWorkouts, '2026-10-04' as ISODate);
    expect(heatmap).toHaveLength(30);
    expect(heatmap[29]).toBe(true);
    expect(heatmap[27]).toBe(true);
  });
});
