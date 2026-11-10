import { create } from 'zustand';

import { settingsRepository } from '../repository/settings.repository';
import {
  cancelNotification,
  NotificationIds,
  requestNotificationPermissions,
  scheduleDailyReminder,
} from '@/shared/lib/notifications';
import { t } from '@/shared/i18n';
import { AppSettings, defaultSettings } from './appSettings';

export type { AppSettings };
export { defaultSettings };

interface SettingsStore {
  settings: AppSettings;
  isReady: boolean;
  loadSettings: () => Promise<void>;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => Promise<boolean>;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: defaultSettings,
  isReady: false,

  loadSettings: async () => {
    try {
      const keys = Object.keys(defaultSettings) as (keyof AppSettings)[];
      const loadedSettings = { ...defaultSettings };

      for (const key of keys) {
        const val = await settingsRepository.get(key);
        if (val !== null) {
          if (key === 'weeklyGymGoal' || key === 'gymInactivityAlertDays') {
            loadedSettings[key] = parseInt(val, 10) as never;
          } else if (
            key === 'biometricLock' ||
            key === 'notificationsEnabled' ||
            key === 'quietHoursEnabled' ||
            key === 'notifTasksEnabled' ||
            key === 'notifTasksVibration' ||
            key === 'notifStreakEnabled' ||
            key === 'notifStreakVibration' ||
            key === 'streakMilestoneAlerts' ||
            key === 'notifGymEnabled' ||
            key === 'notifGymVibration' ||
            key === 'notifSummaryEnabled' ||
            key === 'notifSummaryVibration'
          ) {
            loadedSettings[key] = (val === 'true') as never;
          } else {
            (loadedSettings as any)[key] = val;
          }
        }
      }

      set({ settings: loadedSettings, isReady: true });
    } catch (e) {
      console.error('Error loading settings', e);
      set({ isReady: true }); // Fallback to defaults
    }
  },

  updateSetting: async <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    // Si estamos activando notificaciones, solicitar permisos
    if (
      (key === 'notificationsEnabled' ||
        key === 'notifTasksEnabled' ||
        key === 'notifGymEnabled' ||
        key === 'notifStreakEnabled' ||
        key === 'notifSummaryEnabled') &&
      value === true
    ) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        alert(t.ajustes.permissionsRequired);
        return false;
      }
    }

    try {
      await settingsRepository.set(key, String(value));
      set((state) => ({
        settings: {
          ...state.settings,
          [key]: value,
        },
      }));

      // TODO: Centralized notification reprogramming based on the changed setting
      if (key === 'notifSummaryEnabled' || key === 'dailySummaryTime') {
        const currentSettings = get().settings;
        if (currentSettings.notifSummaryEnabled) {
          // schedule daily summary
        } else {
          // cancel daily summary
        }
      }

      return true;
    } catch (e) {
      console.error(`Error saving setting ${key}`, e);
      return false;
    }
  },
}));
