import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useEffect, useState } from 'react';

import { db, sqlite } from './client';
import migrations from './migrations/migrations';
import { seedDevData, seedCategories } from './seed';

/** Aplica las migraciones pendientes e inserta datos iniciales en desarrollo. */
export function useDatabaseReady(): { ready: boolean; error: Error | null } {
  const { success, error } = useMigrations(db, migrations);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    if (success && !seeded) {
      // Aplicar parches manuales por si la base de datos ya existía pero no se regeneró bien la migración
      sqlite
        .execAsync(
          `
        ALTER TABLE tasks ADD COLUMN repeat_rule text DEFAULT 'none' NOT NULL;
      `,
        )
        .catch(() => {});

      sqlite
        .execAsync(
          `
        CREATE TABLE IF NOT EXISTS task_completions (
          id text PRIMARY KEY NOT NULL,
          task_id text NOT NULL,
          date text NOT NULL,
          FOREIGN KEY (task_id) REFERENCES tasks(id) ON UPDATE no action ON DELETE cascade
        );
      `,
        )
        .catch(() => {});

      seedCategories()
        .then(() => seedDevData())
        .finally(() => setSeeded(true));
    }
  }, [success, seeded]);

  return { ready: success && seeded, error: error ?? null };
}
