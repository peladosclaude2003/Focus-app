import type { ISODate } from '@/shared/lib/dates';

import { calculateSessionProgress, calculateWeeklyAttendance } from '../gymCalculations';

const at = (y: number, m: number, d: number, h = 10) => new Date(y, m - 1, d, h).getTime();

describe('calculateSessionProgress', () => {
  const workouts = [
    { id: 'w2', startTime: at(2026, 11, 5), endTime: at(2026, 11, 5, 11) },
    { id: 'w1', startTime: at(2026, 11, 3), endTime: at(2026, 11, 3, 11) },
    { id: 'active', startTime: at(2026, 11, 10), endTime: null },
    { id: 'empty', startTime: at(2026, 11, 7), endTime: at(2026, 11, 7, 11) },
  ];
  const sets = [
    { workoutId: 'w1', weight: 50, reps: 10, completed: true },
    { workoutId: 'w1', weight: 50, reps: 10, completed: false },
    { workoutId: 'w2', weight: 60, reps: 10, completed: true },
    { workoutId: 'active', weight: 80, reps: 10, completed: true },
  ];

  it('ordena cronológicamente e ignora sesiones activas o sin series completadas', () => {
    const { points } = calculateSessionProgress(workouts, sets);
    expect(points.map((p) => p.workoutId)).toEqual(['w1', 'w2']);
    expect(points[0]).toMatchObject({ date: '2026-11-03', volume: 500, reps: 10 });
    expect(points[1]).toMatchObject({ date: '2026-11-05', volume: 600, reps: 10 });
  });

  it('calcula la variación de la última sesión vs la anterior', () => {
    expect(calculateSessionProgress(workouts, sets).percentageChange).toBe(20);
  });

  it('respeta el límite y devuelve null sin sesión previa', () => {
    const res = calculateSessionProgress(workouts, sets, 1);
    expect(res.points.map((p) => p.workoutId)).toEqual(['w2']);
    expect(res.percentageChange).toBeNull();
  });
});

describe('calculateWeeklyAttendance', () => {
  it('incluye el día de hoy y excluye el de hace 7 días', () => {
    const days = ['2026-11-10', '2026-11-04', '2026-11-03'] as ISODate[];
    expect(calculateWeeklyAttendance(days, '2026-11-10' as ISODate)).toBe(2);
  });
});
