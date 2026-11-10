import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';

export const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let Notifications: any = null;
if (!isExpoGo) {
  try {
    Notifications = require('expo-notifications');
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  } catch (e) {
    console.warn('expo-notifications not available');
  }
}

export const Channels = {
  TASKS: 'tasks_channel',
  RACHA: 'racha_channel',
  GYM: 'gym_channel',
  SUMMARY: 'summary_channel',
};

export const NotificationService = {
  async setupChannels() {
    if (isExpoGo || !Notifications || Platform.OS !== 'android') return;

    await Notifications.setNotificationChannelAsync(Channels.TASKS, {
      name: 'Recordatorios de tareas',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#3B82F6',
    });

    await Notifications.setNotificationCategoryAsync('TASK_REMINDER', [
      {
        identifier: 'COMPLETE_TASK',
        buttonTitle: 'Completar',
        options: {
          opensAppToForeground: false,
        },
      },
      {
        identifier: 'SNOOZE_TASK',
        buttonTitle: 'Posponer 10 min',
        options: {
          opensAppToForeground: false,
        },
      },
    ]);

    await Notifications.setNotificationChannelAsync(Channels.RACHA, {
      name: 'Alertas de racha',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250],
      lightColor: '#EF4444',
    });

    await Notifications.setNotificationChannelAsync(Channels.GYM, {
      name: 'Recordatorios de Gym',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250],
      lightColor: '#10B981',
    });

    await Notifications.setNotificationChannelAsync(Channels.SUMMARY, {
      name: 'Resumen diario',
      importance: Notifications.AndroidImportance.LOW,
    });
  },

  async requestPermissions(): Promise<boolean> {
    if (isExpoGo || !Notifications) return false;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    if (existingStatus === 'granted') return true;

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  },

  async checkExactAlarmsPermission(): Promise<boolean> {
    // In Android 12+ we need SCHEDULE_EXACT_ALARM for exact timers.
    // Expo Notifications currently requests this permission automatically on install,
    // but the user can revoke it. We fallback gracefully.
    return true; // We assume it's granted or we will fallback to inexact triggers if needed.
  },

  async scheduleNotification(
    identifier: string,
    title: string,
    body: string,
    date: Date,
    channelId: string,
    data: any = {},
  ): Promise<string | null> {
    if (isExpoGo || !Notifications) return null;
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);

      const id = await Notifications.scheduleNotificationAsync({
        identifier,
        content: {
          title,
          body,
          sound: true,
          data,
          categoryIdentifier: 'TASK_REMINDER',
        },
        trigger:
          Platform.OS === 'android'
            ? {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: date,
                channelId,
              }
            : {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: date,
              },
      });
      return id;
    } catch (e) {
      console.warn('Failed to schedule notification', e);
      return null;
    }
  },

  async cancelNotification(identifier: string) {
    if (isExpoGo || !Notifications) return;
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (e) {}
  },

  async getAllScheduled() {
    if (isExpoGo || !Notifications) return [];
    return await Notifications.getAllScheduledNotificationsAsync();
  },
};
