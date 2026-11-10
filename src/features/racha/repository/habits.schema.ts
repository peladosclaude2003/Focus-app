import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const habits = sqliteTable('habits', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  icon: text('icon').notNull().default('fire'),
  color: text('color').notNull().default('#ef4444'),
  startAt: integer('start_at').notNull(), // Epoch ms
  bestMs: integer('best_ms').notNull().default(0),
  archived: integer('archived', { mode: 'boolean' }).notNull().default(false),
  order: integer('order_index').notNull().default(0),
  privacyHidden: integer('privacy_hidden', { mode: 'boolean' }).notNull().default(false),
  unit: text('unit').notNull().default('days'),
});

/** Historial de recaídas / reinicios */
export const habitResets = sqliteTable('habit_resets', {
  id: text('id').primaryKey(),
  habitId: text('habit_id')
    .notNull()
    .references(() => habits.id, { onDelete: 'cascade' }),
  resetAt: integer('reset_at').notNull(), // Epoch ms
  durationMs: integer('duration_ms').notNull().default(0), // Duración exacta de esa racha antes de recaer
  note: text('note'),
});

export type HabitRow = typeof habits.$inferSelect;
export type NewHabitRow = typeof habits.$inferInsert;
export type HabitResetRow = typeof habitResets.$inferSelect;
export type NewHabitResetRow = typeof habitResets.$inferInsert;
