import { Anton_400Regular } from '@expo-google-fonts/anton';
import { Archivo_400Regular, Archivo_600SemiBold } from '@expo-google-fonts/archivo';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

import { useDatabaseReady } from '@/db/useDatabaseReady';
import { useSettingsStore } from '@/features/ajustes/store/useSettingsStore';
import { tasksRepository } from '@/features/hoy/repository/tasks.repository';
import { TaskReminderService } from '@/shared/notifications/TaskReminderService';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export interface BootstrapState {
  ready: boolean;
  error: Error | null;
}

/** Carga fuentes y aplica migraciones; oculta el splash cuando termina (o falla). */
export function useAppBootstrap(): BootstrapState {
  const [fontsLoaded, fontError] = useFonts({
    Anton_400Regular,
    Archivo_400Regular,
    Archivo_600SemiBold,
  });
  const db = useDatabaseReady();
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    if (db.ready) {
      const runInit = async () => {
        await useSettingsStore.getState().loadSettings();

        // Schedule rolling window for reminders
        try {
          const tasksWithReminders = await tasksRepository.getAllTasksWithReminders();
          await TaskReminderService.scheduleRollingWindow(tasksWithReminders);
        } catch (e) {
          console.warn('Error scheduling tasks rolling window:', e);
        }

        setSettingsLoaded(true);
      };
      runInit();
    }
  }, [db.ready]);

  const error = db.error ?? fontError ?? null;
  const ready = fontsLoaded && db.ready && settingsLoaded;

  useEffect(() => {
    if (ready || error) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [ready, error]);

  return { ready, error };
}
