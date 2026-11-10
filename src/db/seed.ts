import { db } from './client';
import {
  bodyWeights,
  exercises,
  sets,
  habits,
  tasks,
  workouts,
  categories,
  routines,
  routineDays,
  routineExercises,
} from './schema';
import { addDays, nowISO, parseISODate, todayISO, type ISODate } from '@/shared/lib/dates';

/** Epoch ms de `iso` a la hora local indicada. */
const atLocalHour = (iso: ISODate, hour: number): number => {
  const d = parseISODate(iso);
  d.setHours(hour, 0, 0, 0);
  return d.getTime();
};
import { uid } from '@/shared/lib/ids';

/**
 * Inserta datos semilla de demostración ÚNICAMENTE si estamos en modo desarrollo (__DEV__)
 * y la base de datos está completamente vacía.
 */
export async function seedDevData(): Promise<void> {
  if (!__DEV__) return;

  try {
    const existingTasks = await db.select().from(tasks).limit(1).all();
    if (existingTasks.length > 0) {
      return; // Ya hay datos, no re-sembrar.
    }

    const today = todayISO();
    const yesterday = addDays(today, -1);
    const twoDaysAgo = addDays(today, -2);
    const tenDaysAgo = addDays(today, -10);
    const createdAt = nowISO();

    // 1. Tareas de hoy
    await db
      .insert(tasks)
      .values([
        { id: uid(), title: 'Beber 2L de agua', date: today, time: '08:00', done: true, createdAt },
        {
          id: uid(),
          title: 'Revisar pendientes del día',
          date: today,
          time: '09:00',
          done: true,
          createdAt,
        },
        {
          id: uid(),
          title: 'Entrenamiento de fuerza (Gym)',
          date: today,
          time: '18:00',
          done: false,
          createdAt,
        },
        {
          id: uid(),
          title: 'Leer 20 páginas de un libro',
          date: today,
          time: '21:30',
          done: false,
          createdAt,
        },
      ])
      .run();

    // 2. Hábito inicial
    await db
      .insert(habits)
      .values({
        id: uid(),
        name: 'Comida chatarra',
        startAt: atLocalHour(tenDaysAgo, 0),
        bestMs: 14 * 24 * 60 * 60 * 1000,
        icon: 'food-apple',
        color: '#ef4444',
      })
      .run();

    // 3. Ejercicios
    const exBenchId = uid();
    const exSquatId = uid();
    await db
      .insert(exercises)
      .values([
        { id: exBenchId, name: 'Press de Banca Plano', muscleGroup: 'Pecho', isCustom: false },
        { id: exSquatId, name: 'Sentadilla con Barra', muscleGroup: 'Piernas', isCustom: false },
      ])
      .run();

    // 4. Sesión de Gym
    const workoutId = uid();
    await db
      .insert(workouts)
      .values({
        id: workoutId,
        startTime: atLocalHour(yesterday, 10),
        endTime: atLocalHour(yesterday, 11),
        name: 'Pecho y Piernas',
        notes: 'Buena intensidad y excelente técnica.',
        status: 'completed',
      })
      .run();

    // 5. Series (Sets)
    await db
      .insert(sets)
      .values([
        {
          id: uid(),
          workoutId,
          exerciseId: exBenchId,
          weight: 70,
          reps: 10,
          isPr: false,
          completed: true,
          orderIndex: 0,
        },
        {
          id: uid(),
          workoutId,
          exerciseId: exBenchId,
          weight: 80,
          reps: 8,
          isPr: true,
          completed: true,
          orderIndex: 1,
        },
        {
          id: uid(),
          workoutId,
          exerciseId: exSquatId,
          weight: 100,
          reps: 6,
          isPr: true,
          completed: true,
          orderIndex: 2,
        },
      ])
      .run();

    // 6. Pesos corporales
    await db
      .insert(bodyWeights)
      .values([
        { id: uid(), date: twoDaysAgo, kg: 75.5 },
        { id: uid(), date: yesterday, kg: 75.2 },
        { id: uid(), date: today, kg: 75.0 },
      ])
      .run();

    // 7. Rutina
    const routineId = uid();
    await db
      .insert(routines)
      .values({
        id: routineId,
        name: 'Fuerza e Hipertrofia',
        isActive: true,
        createdAt: Date.now(),
      })
      .run();

    const rdMonday = uid();
    const rdThursday = uid();
    await db
      .insert(routineDays)
      .values([
        { id: rdMonday, routineId, dayOfWeek: 1, name: 'Pecho y Espalda', isRestDay: false },
        { id: uid(), routineId, dayOfWeek: 2, name: 'Descanso', isRestDay: true },
        { id: uid(), routineId, dayOfWeek: 3, name: 'Descanso', isRestDay: true },
        { id: rdThursday, routineId, dayOfWeek: 4, name: 'Piernas', isRestDay: false },
        { id: uid(), routineId, dayOfWeek: 5, name: 'Descanso', isRestDay: true },
        { id: uid(), routineId, dayOfWeek: 6, name: 'Descanso', isRestDay: true },
        { id: uid(), routineId, dayOfWeek: 0, name: 'Descanso', isRestDay: true },
      ])
      .run();

    await db
      .insert(routineExercises)
      .values([
        {
          id: uid(),
          routineDayId: rdMonday,
          exerciseId: exBenchId,
          orderIndex: 0,
          targetSets: 4,
          targetReps: 10,
          targetWeight: 80,
          restSeconds: 90,
        },
        {
          id: uid(),
          routineDayId: rdThursday,
          exerciseId: exSquatId,
          orderIndex: 0,
          targetSets: 3,
          targetReps: 12,
          targetWeight: 100,
          restSeconds: 120,
        },
      ])
      .run();
  } catch {
    // ignora errores de seeder en dev
  }
}

export async function seedCategories(): Promise<void> {
  try {
    const existing = await db.select().from(categories).limit(1).all();
    if (existing.length > 0) return;

    await db
      .insert(categories)
      .values([
        {
          id: 'cat-general',
          name: 'General',
          icon: 'folder-outline',
          color: '#64748b',
          orderIndex: 0,
          isDefault: true,
        },
        {
          id: 'cat-uni',
          name: 'Universidad',
          icon: 'school-outline',
          color: '#3b82f6',
          orderIndex: 1,
          isDefault: false,
        },
        {
          id: 'cat-trabajo',
          name: 'Trabajo',
          icon: 'briefcase-outline',
          color: '#f59e0b',
          orderIndex: 2,
          isDefault: false,
        },
        {
          id: 'cat-compras',
          name: 'Compras',
          icon: 'cart-outline',
          color: '#10b981',
          orderIndex: 3,
          isDefault: false,
        },
        {
          id: 'cat-casa',
          name: 'Casa',
          icon: 'home-outline',
          color: '#8b5cf6',
          orderIndex: 4,
          isDefault: false,
        },
        {
          id: 'cat-personal',
          name: 'Personal',
          icon: 'account-outline',
          color: '#ec4899',
          orderIndex: 5,
          isDefault: false,
        },
      ])
      .run();
  } catch (e) {
    console.error('Error seeding categories', e);
  }
}
