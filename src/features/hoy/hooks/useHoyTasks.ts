import { useCallback, useEffect, useState } from 'react';

import { nowISO, todayISO, toISODate, parseISODate, type ISODate } from '@/shared/lib/dates';
import { haptics } from '@/shared/lib/haptics';
import { uid } from '@/shared/lib/ids';
import { startOfMonth, endOfMonth } from 'date-fns';

import { tasksRepository, type TaskWithCategory } from '../repository/tasks.repository';
import type { RepeatRule, TaskRow } from '../repository/tasks.schema';
import { TaskReminderService } from '@/shared/notifications/TaskReminderService';

export interface UseHoyTasksReturn {
  selectedDate: ISODate;
  monthViewDate: ISODate;
  tasksList: TaskWithCategory[];
  monthlyStats: Record<ISODate, { total: number; done: number }>;
  loading: boolean;
  doneCount: number;
  totalCount: number;
  percentage: number;
  selectDate: (date: ISODate) => void;
  setMonthViewDate: (date: ISODate) => void;
  addTask: (
    title: string,
    date: ISODate,
    categoryId: string,
    time?: string,
    repeatRule?: RepeatRule,
    reminderType?: string,
  ) => Promise<void>;
  updateTask: (
    id: string,
    title: string,
    date: ISODate,
    categoryId: string,
    time?: string,
    repeatRule?: RepeatRule,
    reminderType?: string,
  ) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string, currentDone: boolean) => Promise<void>;
}

/**
 * Programa el recordatorio sin dejar que un fallo de notificaciones (p. ej. permiso
 * denegado) interrumpa el guardado: antes, si esto lanzaba, la tarea quedaba en SQLite
 * pero la lista nunca se recargaba y parecía que no se había guardado.
 */
async function safeSchedule(task: TaskRow, date: ISODate): Promise<string | null> {
  try {
    return await TaskReminderService.scheduleForTask(task, date);
  } catch {
    return null;
  }
}

async function safeCancel(task: TaskRow): Promise<void> {
  try {
    await TaskReminderService.cancelForTask(task);
  } catch {
    // el recordatorio pudo no existir; no bloquea la operación
  }
}

export function useHoyTasks(initialDate: ISODate = todayISO()): UseHoyTasksReturn {
  const [selectedDate, setSelectedDate] = useState<ISODate>(initialDate);
  const [monthViewDate, setMonthViewDate] = useState<ISODate>(initialDate);
  const [tasksList, setTasksList] = useState<TaskWithCategory[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<
    Record<ISODate, { total: number; done: number }>
  >({});
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async (date: ISODate, monthDate: ISODate) => {
    setLoading(true);
    try {
      const list = await tasksRepository.getByDate(date);
      setTasksList(list);

      const fromDate = toISODate(startOfMonth(parseISODate(monthDate)));
      const toDate = toISODate(endOfMonth(parseISODate(monthDate)));
      const stats = tasksRepository.getMonthlyStats(fromDate, toDate);
      setMonthlyStats(stats);
    } catch {
      // ignora error de lectura
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTasks(selectedDate, monthViewDate);
  }, [selectedDate, monthViewDate, loadTasks]);

  const selectDate = (date: ISODate) => {
    haptics.select();
    setSelectedDate(date);
    setMonthViewDate(date); // Al seleccionar un día, sincronizamos el mes visible
  };

  const addTask = async (
    title: string,
    date: ISODate,
    categoryId: string,
    time?: string,
    repeatRule: RepeatRule = 'none',
    reminderType: string = 'none',
  ) => {
    if (!title.trim()) return;
    haptics.tap();

    const newTask = {
      id: uid(),
      title: title.trim(),
      date,
      categoryId,
      time: time?.trim() || null,
      done: false,
      repeatRule,
      position: tasksList.length,
      createdAt: nowISO(),
      notificationId: null,
      reminderType: reminderType === 'none' ? null : reminderType,
    };

    try {
      await tasksRepository.add(newTask);
      if (newTask.time && newTask.reminderType) {
        const nid = await safeSchedule(newTask as TaskRow, date);
        if (nid) await tasksRepository.update(newTask.id, { notificationId: nid });
      }
    } finally {
      // Si la tarea se creó para otro día, saltamos a ese día para que se vea.
      if (date !== selectedDate) {
        setSelectedDate(date);
        setMonthViewDate(date);
      } else {
        await loadTasks(selectedDate, monthViewDate);
      }
    }
  };

  const updateTask = async (
    id: string,
    title: string,
    date: ISODate,
    categoryId: string,
    time?: string,
    repeatRule: RepeatRule = 'none',
    reminderType: string = 'none',
  ) => {
    if (!title.trim()) return;
    haptics.tap();

    const task = await tasksRepository.getById(id);
    if (task && task.notificationId) {
      await safeCancel(task);
    }

    const updated = {
      title: title.trim(),
      date,
      categoryId,
      time: time?.trim() || null,
      repeatRule,
      reminderType: reminderType === 'none' ? null : reminderType,
      notificationId: null as string | null,
    };

    if (updated.time && updated.reminderType) {
      const nid = await safeSchedule({ ...(task as TaskRow), ...updated }, date);
      if (nid) updated.notificationId = nid;
    }

    try {
      await tasksRepository.update(id, updated);
    } finally {
      await loadTasks(selectedDate, monthViewDate);
    }
  };

  const deleteTask = async (id: string) => {
    haptics.warning();
    const task = await tasksRepository.getById(id);
    if (task) {
      await safeCancel(task);
    }
    try {
      await tasksRepository.delete(id);
    } finally {
      await loadTasks(selectedDate, monthViewDate);
    }
  };

  const toggleTask = async (id: string, currentDone: boolean) => {
    if (!currentDone) {
      haptics.success();
    } else {
      haptics.tap();
    }
    try {
      await tasksRepository.toggleDone(id, currentDone, selectedDate);
    } finally {
      await loadTasks(selectedDate, monthViewDate);
    }
  };

  const doneCount = tasksList.filter((t) => t.done).length;
  const totalCount = tasksList.length;
  const percentage = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return {
    selectedDate,
    monthViewDate,
    tasksList,
    monthlyStats,
    loading,
    doneCount,
    totalCount,
    percentage,
    selectDate,
    setMonthViewDate,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
  };
}
