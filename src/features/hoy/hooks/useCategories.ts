import { useCallback, useEffect, useState } from 'react';
import { categoriesRepository } from '../repository/categories.repository';
import type { CategoryRow, NewCategoryRow } from '../repository/tasks.schema';
import { haptics } from '@/shared/lib/haptics';
import { uid } from '@/shared/lib/ids';

export function useCategories() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const list = await categoriesRepository.getAll();
      setCategories(list);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const addCategory = async (name: string, icon: string, color: string) => {
    if (!name.trim()) return;
    haptics.success();
    const newCat = {
      id: uid(),
      name: name.trim(),
      icon,
      color,
      orderIndex: categories.length,
      isDefault: false,
    };
    await categoriesRepository.add(newCat);
    await loadCategories();
  };

  const updateCategory = async (id: string, updates: Partial<NewCategoryRow>) => {
    haptics.tap();
    await categoriesRepository.update(id, updates);
    await loadCategories();
  };

  const deleteCategory = async (id: string) => {
    haptics.warning();
    // Movemos por default a 'cat-general' en el repo
    await categoriesRepository.delete(id, 'cat-general');
    await loadCategories();
  };

  const reorderCategories = async (newOrder: string[]) => {
    // Optimistic update
    const sorted = [...categories].sort((a, b) => newOrder.indexOf(a.id) - newOrder.indexOf(b.id));
    setCategories(sorted);

    // Save in DB
    for (let i = 0; i < newOrder.length; i++) {
      const id = newOrder[i];
      if (id) await categoriesRepository.update(id, { orderIndex: i });
    }
    await loadCategories();
  };

  return {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    refresh: loadCategories,
  };
}
