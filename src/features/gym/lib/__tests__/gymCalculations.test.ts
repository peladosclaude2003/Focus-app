import {
  calculate7DayMovingAverage,
  calculateMaxWeight,
  calculateSetVolume,
  calculateTotalReps,
  calculateWeightDiff,
  calculateExerciseProgress,
  calculateWorkoutVolume,
  checkIsPersonalRecord,
} from '../gymCalculations';

describe('gymCalculations', () => {
  describe('calculateSetVolume', () => {
    it('calculates set volume correctly', () => {
      expect(calculateSetVolume(80, 10)).toBe(800);
      expect(calculateSetVolume(62.5, 8)).toBe(500);
    });

    it('returns 0 for negative values', () => {
      expect(calculateSetVolume(-10, 5)).toBe(0);
      expect(calculateSetVolume(80, -2)).toBe(0);
    });
  });

  describe('calculateWorkoutVolume', () => {
    it('sums volume across all sets in a workout', () => {
      const sets = [
        { weight: 60, reps: 10 }, // 600
        { weight: 80, reps: 8 }, // 640
        { weight: 100, reps: 5 }, // 500
      ];
      expect(calculateWorkoutVolume(sets)).toBe(1740);
    });
  });

  describe('calculateTotalReps & calculateMaxWeight', () => {
    it('calculates total reps correctly', () => {
      const sets = [
        { weight: 60, reps: 10 },
        { weight: 80, reps: 8 },
        { weight: 100, reps: 5 },
      ];
      expect(calculateTotalReps(sets)).toBe(23);
    });

    it('calculates max weight correctly', () => {
      const sets = [
        { weight: 60, reps: 10 },
        { weight: 100, reps: 5 },
        { weight: 80, reps: 8 },
      ];
      expect(calculateMaxWeight(sets)).toBe(100);
    });
  });

  describe('checkIsPersonalRecord', () => {
    it('is a PR if there are no previous sets', () => {
      expect(checkIsPersonalRecord({ weight: 60, reps: 10 }, [])).toBe(true);
    });

    it('is a PR if weight is strictly higher than previous max weight', () => {
      const previous = [
        { weight: 80, reps: 10 },
        { weight: 85, reps: 5 },
      ];
      expect(checkIsPersonalRecord({ weight: 87.5, reps: 1 }, previous)).toBe(true);
      expect(checkIsPersonalRecord({ weight: 80, reps: 12 }, previous)).toBe(false);
    });

    it('is a PR if weight equals max weight but reps exceed previous max reps at that weight', () => {
      const previous = [
        { weight: 85, reps: 5 },
        { weight: 85, reps: 6 },
      ];
      expect(checkIsPersonalRecord({ weight: 85, reps: 7 }, previous)).toBe(true);
      expect(checkIsPersonalRecord({ weight: 85, reps: 6 }, previous)).toBe(false);
    });
  });

  describe('calculateWeightDiff', () => {
    it('calculates weight diff between earliest and latest record', () => {
      const records = [
        { date: '2026-10-04', kg: 74.5 },
        { date: '2026-09-01', kg: 78.0 },
        { date: '2026-09-15', kg: 76.2 },
      ];
      expect(calculateWeightDiff(records)).toBe(-3.5);
    });
  });

  describe('calculate7DayMovingAverage', () => {
    it('calculates 7-day moving average accurately', () => {
      const records = [
        { date: '2026-10-01', kg: 70 },
        { date: '2026-10-02', kg: 72 },
        { date: '2026-10-03', kg: 74 },
      ];
      const avg = calculate7DayMovingAverage(records);
      expect(avg).toEqual([70, 71, 72]); // (70)/1=70, (70+72)/2=71, (70+72+74)/3=72
    });
  });
});

describe('calculateExerciseProgress', () => {
  const workouts = [
    { id: 'w1', startTime: 1_000 },
    { id: 'w2', startTime: 2_000 },
    { id: 'w3', startTime: 3_000 },
  ];
  const names = { bench: 'Press banca', ohp: 'Press militar' };

  it('calcula mejor peso, peso tope de la última sesión y la variación', () => {
    const sets = [
      { workoutId: 'w1', exerciseId: 'bench', weight: 60, reps: 10, completed: true },
      { workoutId: 'w1', exerciseId: 'bench', weight: 65, reps: 8, completed: true },
      { workoutId: 'w2', exerciseId: 'bench', weight: 70, reps: 6, completed: true },
      { workoutId: 'w3', exerciseId: 'bench', weight: 67.5, reps: 8, completed: true },
    ];
    const [bench] = calculateExerciseProgress(workouts, sets, names);
    expect(bench).toMatchObject({
      name: 'Press banca',
      bestWeight: 70,
      lastTopWeight: 67.5,
      deltaKg: -2.5,
      history: [65, 70, 67.5],
      sessions: 3,
    });
  });

  it('ignora series no completadas o sin repeticiones', () => {
    const sets = [
      { workoutId: 'w1', exerciseId: 'ohp', weight: 40, reps: 8, completed: true },
      { workoutId: 'w2', exerciseId: 'ohp', weight: 100, reps: 0, completed: true },
      { workoutId: 'w2', exerciseId: 'ohp', weight: 90, reps: 5, completed: false },
    ];
    const [ohp] = calculateExerciseProgress(workouts, sets, names);
    expect(ohp).toMatchObject({ bestWeight: 40, lastTopWeight: 40, deltaKg: null, sessions: 1 });
  });

  it('ordena por el ejercicio entrenado más recientemente', () => {
    const sets = [
      { workoutId: 'w1', exerciseId: 'bench', weight: 60, reps: 10, completed: true },
      { workoutId: 'w3', exerciseId: 'ohp', weight: 40, reps: 8, completed: true },
    ];
    const list = calculateExerciseProgress(workouts, sets, names);
    expect(list.map((e) => e.exerciseId)).toEqual(['ohp', 'bench']);
  });

  it('devuelve lista vacía sin datos', () => {
    expect(calculateExerciseProgress([], [], {})).toEqual([]);
  });
});
