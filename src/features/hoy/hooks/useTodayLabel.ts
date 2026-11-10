import { useMemo } from 'react';

import { formatLongDate, todayISO } from '@/shared/lib/dates';

/** Etiqueta legible del día actual, p. ej. "domingo, 4 de octubre". */
export function useTodayLabel(): string {
  const today = todayISO();
  return useMemo(() => formatLongDate(today), [today]);
}
