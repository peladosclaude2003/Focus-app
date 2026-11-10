import { useEffect, useId } from 'react';
import { create } from 'zustand';

/**
 * Visibilidad global de la tab bar flotante.
 * Cada origen (sheet, entrenamiento activo…) registra su propio motivo con una clave;
 * la barra se oculta mientras exista al menos un motivo activo. Así un sheet cerrado
 * no puede volver a mostrar la barra mientras otro sigue abierto.
 */
interface TabBarState {
  reasons: Record<string, true>;
  setHidden: (key: string, hidden: boolean) => void;
  resetHidden: () => void;
}

export const useTabBarStore = create<TabBarState>((set) => ({
  reasons: {},
  setHidden: (key, hidden) =>
    set((state) => {
      const has = key in state.reasons;
      if (hidden === has) return state;
      const reasons = { ...state.reasons };
      if (hidden) reasons[key] = true;
      else delete reasons[key];
      return { reasons };
    }),
  resetHidden: () => set({ reasons: {} }),
}));

export const useIsTabBarHidden = () => useTabBarStore((s) => Object.keys(s.reasons).length > 0);

/** Oculta la tab bar mientras `hidden` sea verdadero; limpia al desmontar o cambiar a false. */
export function useHideTabBar(hidden: boolean, name = 'auto') {
  const id = useId();
  const key = `${name}:${id}`;
  const setHidden = useTabBarStore((s) => s.setHidden);

  useEffect(() => {
    if (hidden) {
      setHidden(key, true);
    } else {
      setHidden(key, false);
    }
    return () => {
      setHidden(key, false);
    };
  }, [key, hidden, setHidden]);
}
