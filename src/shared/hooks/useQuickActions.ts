import * as QuickActions from 'expo-quick-actions';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export function useQuickActions(isReady: boolean, isUnlocked: boolean) {
  const router = useRouter();

  useEffect(() => {
    if (!isReady || !isUnlocked) return;

    // Registrar atajos
    QuickActions.setItems([
      {
        id: 'new_task',
        title: 'Nueva tarea',
        subtitle: 'Añadir tarea a Hoy',
        icon: 'compose', // iOS name (SF Symbol)
        params: { href: '/(tabs)/hoy' },
      },
      {
        id: 'start_workout',
        title: 'Empezar Gym',
        subtitle: 'Registrar un entrenamiento',
        icon: 'play',
        params: { href: '/(tabs)/gym' },
      },
      {
        id: 'streak_relapse',
        title: 'Registrar recaída',
        subtitle: 'Reiniciar la racha',
        icon: 'warning',
        params: { href: '/(tabs)/racha' },
      },
    ]);
  }, [isReady, isUnlocked]);

  useEffect(() => {
    // Escuchar atajos al iniciar o volver del background
    const sub = QuickActions.addListener((action) => {
      const href = action.params?.href;
      if (href && typeof href === 'string') {
        // Redirigir a la pestaña correspondiente
        router.push(href as any);
      }
    });

    return () => sub.remove();
  }, [router]);
}
