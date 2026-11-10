/**
 * Punto único de schema para Drizzle (cliente y drizzle-kit).
 * Cada feature define sus tablas en `features/<feature>/repository/*.schema.ts`
 * y se re-exportan aquí. Usar imports relativos (drizzle-kit no entiende `@/`).
 */
export * from '../features/ajustes/repository/settings.schema';
export * from '../features/hoy/repository/tasks.schema';
export * from '../features/racha/repository/habits.schema';
export * from '../features/gym/repository/gym.schema';
