import { and, asc, eq, lte, isNotNull } from 'drizzle-orm';

import { db, sqlite } from '@/db/client';
import { parseISODate, type ISODate } from '@/shared/lib/dates';
import { uid } from '@/shared/lib/ids';

import {
  tasks,
  taskCompletions,
  categories,
  type NewTaskRow,
  type TaskRow,
  type CategoryRow,
} from './tasks.schema';

export interface TaskWithCategory extends TaskRow {
  category: CategoryRow | null;
}

export const tasksRepository = {
  async getByDate(targetDate: ISODate): Promise<TaskWithCategory[]> {
    const allCandidates = await db
      .select({
        task: tasks,
        category: categories,
      })
      .from(tasks)
      .leftJoin(categories, eq(tasks.categoryId, categories.id))
      .where(lte(tasks.date, targetDate))
      .orderBy(asc(tasks.position), asc(tasks.createdAt))
      .all();

    const completions = await db
      .select()
      .from(taskCompletions)
      .where(eq(taskCompletions.date, targetDate))
      .all();

    const completedSet = new Set(completions.map((c) => c.taskId));
    const targetDateObj = parseISODate(targetDate);
    const dayOfWeek = targetDateObj.getDay();
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;

    const result: TaskWithCategory[] = [];

    for (const row of allCandidates) {
      const t = row.task;
      const cat = row.category;
      let matches = false;
      if (t.repeatRule === 'none') {
        matches = t.date === targetDate;
      } else if (t.repeatRule === 'daily') {
        matches = true;
      } else if (t.repeatRule === 'weekdays') {
        matches = isWeekday;
      } else if (t.repeatRule === 'monthly') {
        matches = parseISODate(t.date as ISODate).getDate() === targetDateObj.getDate();
      }

      if (matches) {
        result.push({
          ...t,
          done: completedSet.has(t.id),
          category: cat,
        });
      }
    }
    result.sort((a, b) => {
      if (!a.time && b.time) return -1;
      if (a.time && !b.time) return 1;
      if (a.time && b.time) {
        if (a.time < b.time) return -1;
        if (a.time > b.time) return 1;
      }
      return a.position - b.position;
    });

    return result;
  },

  async getAllTasksWithReminders(): Promise<TaskRow[]> {
    return db
      .select()
      .from(tasks)
      .where(and(isNotNull(tasks.reminderType)))
      .all();
  },

  async getByCategory(categoryId: string, targetDate: ISODate): Promise<TaskWithCategory[]> {
    const allCandidates = await db
      .select({
        task: tasks,
        category: categories,
      })
      .from(tasks)
      .leftJoin(categories, eq(tasks.categoryId, categories.id))
      .where(eq(tasks.categoryId, categoryId))
      .orderBy(asc(tasks.position), asc(tasks.createdAt))
      .all();

    const completions = await db
      .select()
      .from(taskCompletions)
      .where(eq(taskCompletions.date, targetDate))
      .all();
    const completedSet = new Set(completions.map((c) => c.taskId));

    const result: TaskWithCategory[] = [];
    for (const row of allCandidates) {
      const t = row.task;
      const cat = row.category;
      result.push({
        ...t,
        done: completedSet.has(t.id),
        category: cat,
      });
    }

    result.sort((a, b) => {
      if (!a.time && b.time) return -1;
      if (a.time && !b.time) return 1;
      if (a.time && b.time) {
        if (a.time < b.time) return -1;
        if (a.time > b.time) return 1;
      }
      return a.position - b.position;
    });

    return result;
  },

  getMonthlyStats(
    startIso: ISODate,
    endIso: ISODate,
  ): Record<ISODate, { total: number; done: number }> {
    const query = `
      WITH RECURSIVE
        dates(d) AS (
          SELECT ?
          UNION ALL
          SELECT date(d, '+1 day') FROM dates WHERE d < ?
        ),
        daily_tasks AS (
          SELECT 
            d.d as date,
            t.id as task_id
          FROM dates d
          JOIN tasks t ON t.date <= d.d
          WHERE 
            t.repeat_rule = 'daily'
            OR (t.repeat_rule = 'none' AND t.date = d.d)
            OR (t.repeat_rule = 'weekdays' AND cast(strftime('%w', d.d) as integer) BETWEEN 1 AND 5)
            OR (t.repeat_rule = 'monthly' AND cast(strftime('%d', d.d) as integer) = cast(strftime('%d', t.date) as integer))
        )
      SELECT 
        dt.date,
        COUNT(dt.task_id) as total,
        COUNT(c.id) as done
      FROM daily_tasks dt
      LEFT JOIN task_completions c ON c.task_id = dt.task_id AND c.date = dt.date
      GROUP BY dt.date
    `;

    const rows = sqlite.getAllSync<{ date: string; total: number; done: number }>(query, [
      startIso,
      endIso,
    ]);
    const map: Record<string, { total: number; done: number }> = {};
    for (const r of rows) {
      map[r.date] = { total: r.total, done: r.done };
    }
    return map;
  },

  async add(newTask: NewTaskRow): Promise<TaskRow> {
    await db.insert(tasks).values(newTask).run();
    return newTask as TaskRow;
  },

  async getById(id: string): Promise<TaskRow | undefined> {
    return db.select().from(tasks).where(eq(tasks.id, id)).get();
  },

  async update(id: string, updates: Partial<NewTaskRow>): Promise<void> {
    await db.update(tasks).set(updates).where(eq(tasks.id, id)).run();
  },

  async toggleDone(id: string, currentDone: boolean, date: ISODate): Promise<void> {
    if (currentDone) {
      await db
        .delete(taskCompletions)
        .where(and(eq(taskCompletions.taskId, id), eq(taskCompletions.date, date)))
        .run();
    } else {
      const existing = await db
        .select()
        .from(taskCompletions)
        .where(and(eq(taskCompletions.taskId, id), eq(taskCompletions.date, date)))
        .all();

      if (existing.length === 0) {
        await db
          .insert(taskCompletions)
          .values({
            id: uid(),
            taskId: id,
            date,
          })
          .run();
      }
    }
  },

  async delete(id: string): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id)).run();
  },

  async reorder(orderedIds: string[]): Promise<void> {
    await db.transaction(async (tx) => {
      for (let i = 0; i < orderedIds.length; i++) {
        const id = orderedIds[i];
        if (id) {
          await tx.update(tasks).set({ position: i }).where(eq(tasks.id, id)).run();
        }
      }
    });
  },
};
