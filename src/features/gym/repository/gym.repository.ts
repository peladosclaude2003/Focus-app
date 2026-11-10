import { desc, eq, isNull } from 'drizzle-orm';

import { db } from '@/db/client';
import type { ISODate } from '@/shared/lib/dates';
import { uid } from '@/shared/lib/ids';

import {
  bodyWeights,
  exercises,
  sets,
  workouts,
  type BodyWeightRow,
  type ExerciseRow,
  type NewBodyWeightRow,
  type NewExerciseRow,
  type NewSetRow,
  type NewWorkoutRow,
  type SetRow,
  type WorkoutRow,
} from './gym.schema';

export const gymRepository = {
  // --- Weight ---
  async getBodyWeights(): Promise<BodyWeightRow[]> {
    return db.select().from(bodyWeights).orderBy(desc(bodyWeights.date)).all();
  },

  async addBodyWeight(date: ISODate, kg: number): Promise<BodyWeightRow> {
    const newRow: NewBodyWeightRow = { id: uid(), date, kg };
    await db.insert(bodyWeights).values(newRow).run();
    return newRow as BodyWeightRow;
  },

  // --- Workouts ---
  async getWorkouts(): Promise<WorkoutRow[]> {
    return db.select().from(workouts).orderBy(desc(workouts.startTime)).all();
  },

  async addWorkout(newWorkout: NewWorkoutRow): Promise<WorkoutRow> {
    await db.insert(workouts).values(newWorkout).run();
    return newWorkout as WorkoutRow;
  },

  async deleteWorkout(id: string): Promise<void> {
    await db.delete(workouts).where(eq(workouts.id, id)).run();
  },

  async getActiveWorkout(): Promise<WorkoutRow | undefined> {
    const list = db.select().from(workouts).where(isNull(workouts.endTime)).all();
    return list[0];
  },

  async finishWorkout(id: string, endTime: number, notes?: string): Promise<void> {
    const updateData: Partial<WorkoutRow> = { endTime };
    if (notes !== undefined) updateData.notes = notes;
    await db.update(workouts).set(updateData).where(eq(workouts.id, id)).run();
  },

  // --- Exercises & Sets ---
  async getExercises(): Promise<ExerciseRow[]> {
    return db.select().from(exercises).all();
  },

  async addExercise(newEx: NewExerciseRow): Promise<ExerciseRow> {
    await db.insert(exercises).values(newEx).run();
    return newEx as ExerciseRow;
  },

  async getSetsForExercise(exerciseId: string): Promise<SetRow[]> {
    return db.select().from(sets).where(eq(sets.exerciseId, exerciseId)).all();
  },

  async getSetsForWorkout(workoutId: string): Promise<SetRow[]> {
    return db.select().from(sets).where(eq(sets.workoutId, workoutId)).all();
  },

  async addSet(newSet: NewSetRow): Promise<SetRow> {
    await db.insert(sets).values(newSet).run();
    return newSet as SetRow;
  },

  async updateSet(id: string, data: Partial<SetRow>): Promise<void> {
    await db.update(sets).set(data).where(eq(sets.id, id)).run();
  },

  async getAllSets(): Promise<SetRow[]> {
    return db.select().from(sets).all();
  },
};
