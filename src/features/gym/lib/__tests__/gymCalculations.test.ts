import {
  calculate7DayMovingAverage,
  calculateMaxWeight,
  calculateSetVolume,
  calculateTotalReps,
  calculateWeightDiff,
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
