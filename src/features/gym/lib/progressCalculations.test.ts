import {
  calculate1RM,
  calculateVolume,
  evaluateExercise,
  ExerciseEvaluation,
} from './progressCalculations';

describe('progressCalculations', () => {
  describe('calculate1RM', () => {
    it('returns the weight if reps is 1', () => {
      expect(calculate1RM(100, 1)).toBe(100);
    });

    it('calculates 1RM correctly using Epley formula for reps > 1', () => {
      // 100 * (1 + 10 / 30) = 100 * (1 + 1/3) = 133.33
      expect(calculate1RM(100, 10)).toBeCloseTo(133.33, 1);
    });
  });

  describe('calculateVolume', () => {
    it('calculates volume as weight * reps', () => {
      expect(calculateVolume(80, 5)).toBe(400);
    });
  });

  describe('evaluateExercise', () => {
    it('returns mantener si hay menos de 2 sesiones', () => {
      expect(
        evaluateExercise([{ dateMs: 1, targetReps: 10, reps: 10, targetWeight: 50, weight: 50 }]),
      ).toBe('mantener');
      expect(evaluateExercise([])).toBe('mantener');
    });

    it('sugiere subir_peso si se cumplen las reps objetivo en las ultimas 2 sesiones', () => {
      const sessions = [
        { dateMs: 1, targetReps: 10, reps: 10, targetWeight: 50, weight: 50 },
        { dateMs: 2, targetReps: 10, reps: 12, targetWeight: 50, weight: 50 }, // superó reps
      ];
      expect(evaluateExercise(sessions)).toBe('subir_peso');
    });

    it('sugiere mantener_bajar si falla las reps objetivo en 2 seguidas', () => {
      const sessions = [
        { dateMs: 1, targetReps: 10, reps: 8, targetWeight: 50, weight: 50 },
        { dateMs: 2, targetReps: 10, reps: 9, targetWeight: 50, weight: 50 },
      ];
      expect(evaluateExercise(sessions)).toBe('mantener_bajar');
    });

    it('marca estancamiento si no hay progreso de peso en 4 semanas', () => {
      const now = Date.now();
      const twoWeeksAgo = now - 14 * 24 * 60 * 60 * 1000;
      const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

      const sessions = [
        { dateMs: twoWeeksAgo, targetReps: 10, reps: 10, targetWeight: 60, weight: 60 },
        { dateMs: oneWeekAgo, targetReps: 10, reps: 9, targetWeight: 60, weight: 60 }, // failed 2nd so not 'subir_peso'
      ];
      expect(evaluateExercise(sessions)).toBe('estancamiento');
    });

    it('no marca estancamiento si el peso si ha subido', () => {
      const now = Date.now();
      const twoWeeksAgo = now - 14 * 24 * 60 * 60 * 1000;
      const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

      const sessions = [
        { dateMs: twoWeeksAgo, targetReps: 10, reps: 10, targetWeight: 60, weight: 60 },
        { dateMs: oneWeekAgo, targetReps: 10, reps: 9, targetWeight: 60, weight: 65 }, // subió a 65
      ];
      expect(evaluateExercise(sessions)).toBe('mantener'); // No es subir (falló reps), pero tampoco estancamiento porque el peso subió
    });
  });
});
