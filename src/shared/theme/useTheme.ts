import { palette } from './tokens';

export type SchemeName = 'dark'; // Fijo oscuro por requerimiento

export interface Theme {
  scheme: SchemeName;
  colors: typeof palette;
}

export type ColorTokens = typeof palette;

/**
 * Tema activo fijo en modo oscuro según requerimiento.
 */
export function useTheme(): Theme {
  return { scheme: 'dark', colors: palette };
}
