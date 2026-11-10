import { useReducedMotion } from 'react-native-reanimated';

export interface Motion {
  /** true si el usuario activó "Quitar animaciones" en Android. */
  reduced: boolean;
  /** Duración a usar: 0 si hay que reducir movimiento. */
  duration: (ms: number) => number;
}

/** Toda animación de la app debe pasar por aquí para respetar "reducir movimiento". */
export function useMotion(): Motion {
  const reduced = useReducedMotion();
  return {
    reduced,
    duration: (ms) => (reduced ? 0 : ms),
  };
}
