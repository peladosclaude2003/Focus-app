export function calculate1RM(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

export function calculateVolume(weight: number, reps: number): number {
  return weight * reps;
}

export type ExerciseEvaluation = 'subir_peso' | 'mantener_bajar' | 'estancamiento' | 'mantener';

/**
 * Evalúa el progreso de un ejercicio basado en las últimas sesiones.
 * @param sessions - Las últimas sesiones ordenadas por fecha ascendente (las más recientes al final)
 * Cada sesión debe contener el target y lo ejecutado.
 */
export function evaluateExercise(
  sessions: {
    dateMs: number;
    targetReps: number;
    reps: number;
    targetWeight: number;
    weight: number;
  }[],
): ExerciseEvaluation {
  if (sessions.length < 2) return 'mantener';

  const lastTwo = sessions.slice(-2);
  const completedTarget = lastTwo.every((s) => s.reps >= s.targetReps);
  const failedTarget = lastTwo.every((s) => s.reps < s.targetReps);

  // Regla 1: si completé todas las repeticiones objetivo en las últimas 2 sesiones, sugerir subir peso
  if (completedTarget) return 'subir_peso';

  // Regla 2: si falle en 2 seguidas, sugerir mantener o bajar
  if (failedTarget) return 'mantener_bajar';

  // Regla 3: si no hay progreso en 4 semanas (28 días), marcar estancamiento
  const fourWeeksMs = 28 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const recentSessions = sessions.filter((s) => now - s.dateMs <= fourWeeksMs);

  if (recentSessions.length >= 2) {
    const weights = recentSessions.map((s) => s.weight);
    const maxWeight = Math.max(...weights);
    const minWeight = Math.min(...weights);
    if (maxWeight === minWeight && !completedTarget) {
      return 'estancamiento';
    }
  }

  return 'mantener';
}
