import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/** Sesión de entrenamiento */
export const workouts = sqliteTable('workouts', {
  id: text('id').primaryKey(),
  routineDayId: text('routine_day_id'), // Opcional, por si fue de rutina
  status: text('status').notNull().default('completed'), // 'active', 'completed', 'discarded'
  startTime: integer('start_time').notNull(), // Epoch ms
  endTime: integer('end_time'), // Epoch ms
  name: text('name').notNull(),
  notes: text('notes'),
});

/** Catálogo de ejercicios */
export const exercises = sqliteTable('exercises', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  muscleGroup: text('muscle_group').notNull(), // 'Pecho' | 'Espalda' | 'Hombros' | 'Bíceps' | 'Tríceps' | 'Piernas' | 'Glúteos' | 'Core' | 'Cardio'
  isCustom: integer('is_custom', { mode: 'boolean' }).notNull().default(false),
});

/** Series ejecutadas */
export const sets = sqliteTable('sets', {
  id: text('id').primaryKey(),
  workoutId: text('workout_id')
    .notNull()
    .references(() => workouts.id, { onDelete: 'cascade' }),
  exerciseId: text('exercise_id')
    .notNull()
    .references(() => exercises.id, { onDelete: 'cascade' }),
  orderIndex: integer('order_index').notNull().default(0),
  // Snapshots de objetivos
  targetWeight: real('target_weight'),
  targetReps: integer('target_reps'),
  // Ejecutado
  weight: real('weight').notNull(), // en kg
  reps: integer('reps').notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  isPr: integer('is_pr', { mode: 'boolean' }).notNull().default(false),
});

/** Rutinas de entrenamiento */
export const routines = sqliteTable('routines', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at').notNull(),
});

/** Días de la rutina */
export const routineDays = sqliteTable('routine_days', {
  id: text('id').primaryKey(),
  routineId: text('routine_id')
    .notNull()
    .references(() => routines.id, { onDelete: 'cascade' }),
  dayOfWeek: integer('day_of_week').notNull(), // 0 (Dom) - 6 (Sab)
  name: text('name'), // e.g. "Día de Pecho y Espalda"
  isRestDay: integer('is_rest_day', { mode: 'boolean' }).notNull().default(false),
});

/** Ejercicios programados en un día de rutina */
export const routineExercises = sqliteTable('routine_exercises', {
  id: text('id').primaryKey(),
  routineDayId: text('routine_day_id')
    .notNull()
    .references(() => routineDays.id, { onDelete: 'cascade' }),
  exerciseId: text('exercise_id')
    .notNull()
    .references(() => exercises.id, { onDelete: 'cascade' }),
  orderIndex: integer('order_index').notNull().default(0),
  targetSets: integer('target_sets').notNull().default(3),
  targetReps: integer('target_reps').notNull().default(10),
  targetWeight: real('target_weight').notNull().default(0),
  restSeconds: integer('rest_seconds').notNull().default(60),
});

/** Registro de peso corporal */
export const bodyWeights = sqliteTable('body_weights', {
  id: text('id').primaryKey(),
  date: text('date').notNull(), // YYYY-MM-DD
  kg: real('kg').notNull(),
});

export type WorkoutRow = typeof workouts.$inferSelect;
export type NewWorkoutRow = typeof workouts.$inferInsert;
export type ExerciseRow = typeof exercises.$inferSelect;
export type NewExerciseRow = typeof exercises.$inferInsert;
export type SetRow = typeof sets.$inferSelect;
export type NewSetRow = typeof sets.$inferInsert;
export type BodyWeightRow = typeof bodyWeights.$inferSelect;
export type NewBodyWeightRow = typeof bodyWeights.$inferInsert;

export type RoutineRow = typeof routines.$inferSelect;
export type NewRoutineRow = typeof routines.$inferInsert;
export type RoutineDayRow = typeof routineDays.$inferSelect;
export type NewRoutineDayRow = typeof routineDays.$inferInsert;
export type RoutineExerciseRow = typeof routineExercises.$inferSelect;
export type NewRoutineExerciseRow = typeof routineExercises.$inferInsert;
