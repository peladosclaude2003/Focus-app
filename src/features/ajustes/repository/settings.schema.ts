import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * Preferencias clave-valor (tema, notificaciones, etc.).
 * Nota: los archivos de schema usan imports relativos porque drizzle-kit
 * no resuelve el alias `@/`.
 */
export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export type SettingRow = typeof settings.$inferSelect;
export type NewSettingRow = typeof settings.$inferInsert;
