import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

import * as schema from './schema';

export const DB_NAME = 'mi-dia.db';

/** `enableChangeListener` habilita `useLiveQuery` para UI reactiva. */
export const sqlite = openDatabaseSync(DB_NAME, { enableChangeListener: true });

export const db = drizzle(sqlite, { schema });
export type Database = typeof db;
