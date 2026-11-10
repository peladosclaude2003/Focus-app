import { desc, eq } from 'drizzle-orm';

import { db } from '@/db/client';
import { bodyWeights, sets, workouts } from '@/features/gym/repository/gym.schema';
import { tasks } from '@/features/hoy/repository/tasks.schema';
import { habits } from '@/features/racha/repository/habits.schema';
import type { ISODate } from '@/shared/lib/dates';

import { toISODate } from '@/shared/lib/dates';

export const inicioRepository = {
  async getDashboardRawData(todayDate: ISODate) {
    const [allWorkouts, allSets, latestWeights, activeStreak, todayTasks] = await Promise.all([
      db.select().from(workouts).orderBy(desc(workouts.startTime)).all(),
      db.select().from(sets).all(),
      db.select().from(bodyWeights).orderBy(desc(bodyWeights.date)).limit(10).all(),
      db.select().from(habits).limit(1).all(),
      db.select().from(tasks).where(eq(tasks.date, todayDate)).all(),
    ]);

    return {
      workouts: allWorkouts.map((w) => ({
        id: w.id,
        date: toISODate(new Date(w.startTime)) as ISODate,
        durationMin: w.endTime ? Math.max(1, Math.round((w.endTime - w.startTime) / 60000)) : 1,
        name: w.name,
      })),
      sets: allSets.map((s) => ({
        workoutId: s.workoutId,
        weight: s.weight,
        reps: s.reps,
      })),
      bodyWeights: latestWeights.map((b) => ({
        date: b.date,
        kg: b.kg,
      })),
      streak: activeStreak[0] ?? null,
      tasks: todayTasks,
    };
  },
};
