import { useEffect } from 'react';

import { useRouter } from 'expo-router';

import { db } from '@/db/client';
import { taskCompletions } from '@/features/hoy/repository/tasks.schema';
import { uid } from '@/shared/lib/ids';
import { isExpoGo } from './NotificationService';
import { TaskReminderService } from './TaskReminderService';

export function useNotificationActions() {
  const router = useRouter();

  useEffect(() => {
    if (isExpoGo) return;

    let Notifications: any;
    try {
      Notifications = require('expo-notifications');
    } catch {
      return;
    }

    const subscription = Notifications.addNotificationResponseReceivedListener(
      async (response: any) => {
        const actionId = response.actionIdentifier;
        const data = response.notification.request.content.data;

        if (actionId === 'COMPLETE_TASK' && data?.taskId && data?.targetDate) {
          // Marcar tarea como completada directamente en DB
          await db
            .insert(taskCompletions)
            .values({
              id: uid(),
              taskId: data.taskId as string,
              date: data.targetDate as string,
            })
            .run();
        } else if (actionId === 'SNOOZE_TASK' && data?.taskId && data?.targetDate) {
          // Reprogramar 10 min
          const now = new Date();
          now.setMinutes(now.getMinutes() + 10);

          // Asumiendo que task fue pasada o podemos regenerarlo temporalmente
          await Notifications.scheduleNotificationAsync({
            identifier: `snoozed_${data.taskId}_${Date.now()}`,
            content: {
              title: response.notification.request.content.title,
              body: '¡Hora de tu tarea pospuesta!',
              sound: true,
              data,
              categoryIdentifier: 'TASK_REMINDER',
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: now,
            },
          });
        } else if (actionId === Notifications.DEFAULT_ACTION_IDENTIFIER) {
          // El usuario tocó la notificación para abrir la app
          if (data?.taskId) {
            router.push('/'); // Or open directly to the task if there was a detail screen
          }
        }
      },
    );

    return () => subscription.remove();
  }, [router]);
}
