import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { categories, type CategoryRow, type NewCategoryRow, tasks } from './tasks.schema';

class CategoriesRepository {
  async getAll(): Promise<CategoryRow[]> {
    return await db.select().from(categories).orderBy(categories.orderIndex).all();
  }

  async getById(id: string): Promise<CategoryRow | undefined> {
    const result = await db.select().from(categories).where(eq(categories.id, id)).all();
    return result[0];
  }

  async add(category: NewCategoryRow): Promise<CategoryRow> {
    await db.insert(categories).values(category).run();
    return category as CategoryRow;
  }

  async update(id: string, updates: Partial<CategoryRow>): Promise<void> {
    await db.update(categories).set(updates).where(eq(categories.id, id)).run();
  }

  async delete(id: string, moveToId: string = 'cat-general'): Promise<void> {
    // Primero, mover las tareas a la nueva categoria
    await db.update(tasks).set({ categoryId: moveToId }).where(eq(tasks.categoryId, id)).run();
    // Luego eliminar la categoria
    await db.delete(categories).where(eq(categories.id, id)).run();
  }
}

export const categoriesRepository = new CategoriesRepository();
