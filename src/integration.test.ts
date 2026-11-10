import { describe, it, expect, beforeEach } from '@jest/globals';
import { db } from '@/db/client';
import { tasksRepository, type TaskWithCategory } from '@/features/hoy/repository/tasks.repository';
import { habitsRepository } from '@/features/racha/repository/habits.repository';
import { gymRepository } from '@/features/gym/repository/gym.repository';
import { uid } from '@/shared/lib/ids';
import { toISODate, nowISO } from '@/shared/lib/dates';
import { calculateVolume } from '@/features/gym/lib/progressCalculations';
import type { HabitRow, HabitResetRow } from '@/features/racha/repository/habits.schema';

describe('Integration Tests', () => {
  beforeEach(async () => {
    // We would clear tables here for a real database, but tests usually use in-memory SQLite
    // Since this is just verifying logic, we will rely on creating unique entities
  });

  describe('Tasks & Folders', () => {
    it('creates a task with folder and reminder and retrieves it for month view', async () => {
      const folderId = uid();
      await db.run(
        `INSERT INTO categories (id, name, icon, color, "order_index", is_default) VALUES ('${folderId}', 'Test Folder', 'folder', '#ff0000', 0, 0)`,
      );

      const targetDate = toISODate(new Date());
      const task = await tasksRepository.add({
        id: uid(),
        title: 'Integration Task',
        date: targetDate,
        time: '10:00',
        categoryId: folderId,
        repeatRule: 'none',
        reminderType: 'at_time',
        position: 0,
        createdAt: nowISO(),
      });

      expect(task.title).toBe('Integration Task');
      expect(task.categoryId).toBe(folderId);

      const tasksForDay = await tasksRepository.getByDate(targetDate);
      expect(tasksForDay.some((t: TaskWithCategory) => t.id === task.id)).toBe(true);
    });
  });

  describe('Habits', () => {
    it('creates 5 habits with different start dates and restarts one', async () => {
      const now = Date.now();
      const habitsList: HabitRow[] = [];
      for (let i = 0; i < 5; i++) {
        const startAt = now - i * 86400000; // i days ago
        const h = await habitsRepository.createHabit(`Habit ${i}`, startAt, 'star', '#fff');
        habitsList.push(h);
      }

      const habits = await habitsRepository.getAllHabits();
      expect(habits.length).toBeGreaterThanOrEqual(5);

      // Restart one
      const targetHabit = habitsList[2]; // Started 2 days ago
      if (targetHabit) {
        await habitsRepository.resetHabit(
          targetHabit.id,
          now,
          now,
          now - targetHabit.startAt,
          'Relapsed',
        );

        const restartedHabit = await habitsRepository.getHabitById(targetHabit.id);
        expect(restartedHabit?.startAt).toBe(now);

        const history: HabitResetRow[] = await habitsRepository.getHabitResets(targetHabit.id);
        expect(history.length).toBe(1);
        expect(history[0]?.note).toBe('Relapsed');
      }
    });
  });

  describe('Gym Planner & Progress', () => {
    it('plans a gym day, completes a session and updates progress', async () => {
      // 1. Plan
      const exerciseId = uid();
      await db.run(
        `INSERT INTO exercises (id, name, muscle_group, is_custom) VALUES ('${exerciseId}', 'Squat', 'Piernas', 0)`,
      );

      // 2. Start session
      const workoutId = uid();
      await gymRepository.addWorkout({
        id: workoutId,
        name: 'Leg Day',
        startTime: Date.now(),
        status: 'active',
      });

      // 3. Complete set
      const setId = uid();
      await gymRepository.addSet({
        id: setId,
        workoutId,
        exerciseId,
        orderIndex: 0,
        weight: 100,
        reps: 10,
        completed: true,
      });

      // 4. Finish session
      await gymRepository.finishWorkout(workoutId, Date.now());

      // 5. Verify progress
      const allSets = await gymRepository.getAllSets();
      const volume = allSets.reduce((sum, s) => sum + calculateVolume(s.weight, s.reps), 0);
      expect(volume).toBeGreaterThanOrEqual(1000); // 100 * 10 = 1000
    });
  });
});
