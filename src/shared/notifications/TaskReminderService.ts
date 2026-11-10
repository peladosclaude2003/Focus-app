import { parseISODate, toISODate, type ISODate } from '../lib/dates';
import { NotificationService, Channels } from './NotificationService';
import type { TaskRow } from '@/features/hoy/repository/tasks.schema';

export const TaskReminderService = {
  // Calculates the fire date for a specific target day
  calculateFireDate(taskDate: ISODate, time: string, reminderType: string): Date | null {
    if (!time) return null;
    const parts = time.split(':');
    const hours = Number(parts[0]);
    const mins = Number(parts[1] || 0);
    const dateObj = parseISODate(taskDate);
    dateObj.setHours(hours, mins, 0, 0);

    if (reminderType === '10m') {
      dateObj.setMinutes(dateObj.getMinutes() - 10);
    } else if (reminderType === '1h') {
      dateObj.setHours(dateObj.getHours() - 1);
    } else if (reminderType === '1d') {
      dateObj.setDate(dateObj.getDate() - 1);
    } else if (reminderType !== 'exact') {
      return null;
    }

    return dateObj;
  },

  async scheduleForTask(task: TaskRow, targetDateStr: ISODate): Promise<string | null> {
    if (!task.time || !task.reminderType) return null;

    const fireDate = this.calculateFireDate(targetDateStr, task.time, task.reminderType);
    if (!fireDate) return null;

    // Only schedule if it's in the future
    if (fireDate.getTime() <= Date.now()) return null;

    // We make the identifier unique per task AND per date (for recurring)
    const identifier = `task_${task.id}_${targetDateStr}`;

    const id = await NotificationService.scheduleNotification(
      identifier,
      task.title,
      `Tienes esta tarea programada para las ${task.time}`,
      fireDate,
      Channels.TASKS,
      { taskId: task.id, targetDate: targetDateStr },
    );
    return id;
  },

  async cancelForTask(task: TaskRow) {
    if (task.notificationId) {
      await NotificationService.cancelNotification(task.notificationId);
    }
  },

  async cancelRecurringWindow(taskId: string, targetDates: ISODate[]) {
    for (const date of targetDates) {
      await NotificationService.cancelNotification(`task_${taskId}_${date}`);
    }
  },

  async scheduleRollingWindow(tasks: TaskRow[]) {
    // Para tareas recurrentes, programamos los próximos 14 días.
    const today = new Date();

    for (const task of tasks) {
      if (!task.time || !task.reminderType) continue;

      // Determinamos fechas aplicables en los próximos 14 días
      for (let i = 0; i < 14; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        const isoDate = toISODate(d) as ISODate;

        let matches = false;
        if (task.repeatRule === 'daily') {
          matches = true;
        } else if (task.repeatRule === 'weekdays') {
          const day = d.getDay();
          matches = day >= 1 && day <= 5;
        } else if (task.repeatRule === 'monthly') {
          const start = parseISODate(task.date as ISODate);
          matches = d.getDate() === start.getDate();
        } else if (task.repeatRule === 'none' && task.date === isoDate) {
          matches = true;
        }

        if (matches) {
          await this.scheduleForTask(task, isoDate);
        }
      }
    }
  },
};
