import { parseISODate, todayISO, type ISODate } from '../lib/dates';
import { NotificationService, Channels } from './NotificationService';
import { occurrencesInWindow, windowDates } from '@/features/hoy/lib/recurrence';
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

  /** Cancela cualquier recordatorio pendiente de la tarea (único y de la ventana recurrente). */
  async cancelAllForTask(task: TaskRow) {
    await this.cancelForTask(task);
    await this.cancelRecurringWindow(task.id, windowDates(todayISO()));
  },

  async scheduleRollingWindow(tasks: TaskRow[]) {
    // Programa los recordatorios de los próximos días según la regla de recurrencia.
    const today = todayISO();
    for (const task of tasks) {
      if (!task.time || !task.reminderType) continue;
      for (const isoDate of occurrencesInWindow(task, today)) {
        await this.scheduleForTask(task, isoDate);
      }
    }
  },
};
