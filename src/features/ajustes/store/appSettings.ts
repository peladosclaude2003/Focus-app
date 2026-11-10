export type NotificationType = 'banner' | 'silent' | 'alarm';

export interface AppSettings {
  // Generales
  weightUnit: 'kg' | 'lbs';
  firstDayOfWeek: 'Lunes' | 'Domingo';
  timeFormat: '12h' | '24h';
  theme: 'light' | 'dark' | 'system';
  biometricLock: boolean;
  streakUnit: 'secs' | 'mins' | 'hours' | 'days' | 'weeks' | 'months' | 'years';

  // Notificaciones (Global)
  notificationsEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // HH:mm
  quietHoursEnd: string; // HH:mm

  // Notificaciones: Tareas
  notifTasksEnabled: boolean;
  notifTasksSound: string;
  notifTasksVibration: boolean;
  notifTasksType: NotificationType;
  defaultTaskReminder: 'at_time' | '10m' | '1h' | '1d' | 'none';
  defaultTaskTime: string; // HH:mm

  // Notificaciones: Racha
  notifStreakEnabled: boolean;
  notifStreakSound: string;
  notifStreakVibration: boolean;
  notifStreakType: NotificationType;
  streakMilestoneAlerts: boolean; // Avisar de hitos (7, 14, 30...)

  // Notificaciones: Gym
  notifGymEnabled: boolean;
  notifGymSound: string;
  notifGymVibration: boolean;
  notifGymType: NotificationType;
  gymReminderDays: string; // JSON array string e.g. "[1,3,5]"
  gymReminderTime: string; // HH:mm
  gymInactivityAlertDays: number; // e.g. 3
  weeklyGymGoal: number; // 1 to 7

  // Notificaciones: Resumen Diario
  notifSummaryEnabled: boolean;
  notifSummarySound: string;
  notifSummaryVibration: boolean;
  notifSummaryType: NotificationType;
  dailySummaryTime: string; // HH:mm
  dailySummaryIncludes: string; // JSON array: ["tasks", "gym", "streak"]
}

export const defaultSettings: AppSettings = {
  weightUnit: 'kg',
  firstDayOfWeek: 'Lunes',
  timeFormat: '24h',
  theme: 'system',
  biometricLock: false,
  streakUnit: 'days',

  notificationsEnabled: true,
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',

  notifTasksEnabled: true,
  notifTasksSound: 'default',
  notifTasksVibration: true,
  notifTasksType: 'banner',
  defaultTaskReminder: '10m',
  defaultTaskTime: '09:00',

  notifStreakEnabled: true,
  notifStreakSound: 'default',
  notifStreakVibration: true,
  notifStreakType: 'banner',
  streakMilestoneAlerts: true,

  notifGymEnabled: true,
  notifGymSound: 'default',
  notifGymVibration: true,
  notifGymType: 'banner',
  gymReminderDays: '[1,3,5]', // Lunes, Miércoles, Viernes
  gymReminderTime: '18:00',
  gymInactivityAlertDays: 3,
  weeklyGymGoal: 4,

  notifSummaryEnabled: true,
  notifSummarySound: 'default',
  notifSummaryVibration: true,
  notifSummaryType: 'banner',
  dailySummaryTime: '20:00',
  dailySummaryIncludes: '["tasks","gym","streak"]',
};
