import { eq } from 'drizzle-orm';

import { db } from '@/db/client';
import { nowISO } from '@/shared/lib/dates';

import { settings } from './settings.schema';

export const settingsRepository = {
  async get(key: string): Promise<string | null> {
    const row = await db.select().from(settings).where(eq(settings.key, key)).get();
    return row?.value ?? null;
  },

  async set(key: string, value: string): Promise<void> {
    const updatedAt = nowISO();
    await db
      .insert(settings)
      .values({ key, value, updatedAt })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value, updatedAt },
      })
      .run();
  },
};
