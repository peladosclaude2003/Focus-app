import { TaskReminderService } from './TaskReminderService';
import type { ISODate } from '../lib/dates';

describe('TaskReminderService.calculateFireDate', () => {
  it('should return exact time when reminderType is exact', () => {
    const date = TaskReminderService.calculateFireDate('2023-10-15' as ISODate, '14:30', 'exact');
    expect(date?.getFullYear()).toBe(2023);
    expect(date?.getMonth()).toBe(9); // Oct is 9
    expect(date?.getDate()).toBe(15);
    expect(date?.getHours()).toBe(14);
    expect(date?.getMinutes()).toBe(30);
  });

  it('should subtract 10 minutes when reminderType is 10m', () => {
    const date = TaskReminderService.calculateFireDate('2023-10-15' as ISODate, '14:05', '10m');
    expect(date?.getHours()).toBe(13);
    expect(date?.getMinutes()).toBe(55);
  });

  it('should subtract 1 hour when reminderType is 1h', () => {
    const date = TaskReminderService.calculateFireDate('2023-10-15' as ISODate, '14:30', '1h');
    expect(date?.getHours()).toBe(13);
    expect(date?.getMinutes()).toBe(30);
  });

  it('should subtract 1 day when reminderType is 1d', () => {
    const date = TaskReminderService.calculateFireDate('2023-10-15' as ISODate, '14:30', '1d');
    expect(date?.getDate()).toBe(14);
    expect(date?.getHours()).toBe(14);
    expect(date?.getMinutes()).toBe(30);
  });

  it('should handle month boundaries when subtracting 1 day', () => {
    const date = TaskReminderService.calculateFireDate('2023-10-01' as ISODate, '08:00', '1d');
    expect(date?.getMonth()).toBe(8); // September
    expect(date?.getDate()).toBe(30);
  });

  it('should return null if time is not provided', () => {
    const date = TaskReminderService.calculateFireDate('2023-10-15' as ISODate, '', 'exact');
    expect(date).toBeNull();
  });

  it('should return null if reminderType is unknown', () => {
    const date = TaskReminderService.calculateFireDate('2023-10-15' as ISODate, '14:30', 'unknown');
    expect(date).toBeNull();
  });
});
