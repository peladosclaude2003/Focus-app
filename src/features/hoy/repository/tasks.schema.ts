import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export type RepeatRule = 'none' | 'daily' | 'weekdays' | 'monthly' | 'custom';

/** Categorías (Carpetas) */
export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  icon: text('icon').notNull(),
  color: text('color').notNull(),
  orderIndex: integer('order_index').notNull().default(0),
  isDefault: integer('is_default', { mode: 'boolean' }).notNull().default(false),
});

/** Tareas diarias */
export const tasks = sqliteTable('tasks', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  date: text('date').notNull(), // YYYY-MM-DD
  time: text('time'), // HH:mm opcional
  done: integer('done', { mode: 'boolean' }).notNull().default(false), // Legacy o tareas unicas
  repeatRule: text('repeat_rule').$type<RepeatRule>().notNull().default('none'),
  position: integer('position').notNull().default(0),
  categoryId: text('category_id')
    .notNull()
    .default('cat-general')
    .references(() => categories.id, { onDelete: 'cascade' }),
  createdAt: text('created_at').notNull(), // YYYY-MM-DDTHH:mm:ss
  notificationId: text('notification_id'),
  reminderType: text('reminder_type'), // 'exact', '10m', '1h', '1d'
});

export const taskCompletions = sqliteTable('task_completions', {
  id: text('id').primaryKey(),
  taskId: text('task_id')
    .notNull()
    .references(() => tasks.id, { onDelete: 'cascade' }),
  date: text('date').notNull(), // YYYY-MM-DD
});

export type TaskRow = typeof tasks.$inferSelect;
export type NewTaskRow = typeof tasks.$inferInsert;
export type TaskCompletionRow = typeof taskCompletions.$inferSelect;
export type CategoryRow = typeof categories.$inferSelect;
export type NewCategoryRow = typeof categories.$inferInsert;
