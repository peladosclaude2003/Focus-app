import { eq, asc, desc } from 'drizzle-orm';

import { db } from '@/db/client';
import { uid } from '@/shared/lib/ids';

import {
  habitResets,
  habits,
  type NewHabitResetRow,
  type NewHabitRow,
  type HabitResetRow,
  type HabitRow,
} from './habits.schema';

export const habitsRepository = {
  async getAllHabits(): Promise<HabitRow[]> {
    return await db.select().from(habits).orderBy(asc(habits.order)).all();
  },

  async getHabitById(id: string): Promise<HabitRow | null> {
    const habit = await db.select().from(habits).where(eq(habits.id, id)).get();
    return habit ?? null;
  },

  async createHabit(
    name: string,
    startAtEpoch: number,
    icon: string = 'fire',
    color: string = '#ef4444',
  ): Promise<HabitRow> {
    const list = await this.getAllHabits();
    const last = list[list.length - 1];
    const newOrder = last ? last.order + 1 : 0;

    const newHabit: NewHabitRow = {
      id: uid(),
      name,
      startAt: startAtEpoch,
      icon,
      color,
      bestMs: 0,
      archived: false,
      order: newOrder,
      privacyHidden: false,
    };
    await db.insert(habits).values(newHabit).run();
    return newHabit as HabitRow;
  },

  async updateHabit(id: string, partial: Partial<Omit<HabitRow, 'id'>>): Promise<void> {
    await db.update(habits).set(partial).where(eq(habits.id, id)).run();
  },

  async deleteHabit(id: string): Promise<void> {
    await db.delete(habits).where(eq(habits.id, id)).run();
  },

  async resetHabit(
    habitId: string,
    resetDateEpoch: number,
    newStartDateEpoch: number,
    durationMs: number,
    note?: string,
  ): Promise<void> {
    const habit = await this.getHabitById(habitId);
    if (!habit) return;

    const newBest = Math.max(habit.bestMs, durationMs);

    await db.transaction(async (tx) => {
      await tx
        .update(habits)
        .set({ startAt: newStartDateEpoch, bestMs: newBest })
        .where(eq(habits.id, habitId))
        .run();

      const newReset: NewHabitResetRow = {
        id: uid(),
        habitId,
        resetAt: resetDateEpoch,
        durationMs,
        note,
      };
      await tx.insert(habitResets).values(newReset).run();
    });
  },

  async getHabitResets(habitId: string): Promise<HabitResetRow[]> {
    return await db
      .select()
      .from(habitResets)
      .where(eq(habitResets.habitId, habitId))
      .orderBy(desc(habitResets.resetAt))
      .all();
  },
};
