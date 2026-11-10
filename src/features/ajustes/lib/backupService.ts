import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

import { db } from '@/db/client';
import { bodyWeights, exercises, sets, workouts } from '@/features/gym/repository/gym.schema';
import { tasks } from '@/features/hoy/repository/tasks.schema';
import { habitResets, habits } from '@/features/racha/repository/habits.schema';
import { settings } from '../repository/settings.schema';

export const backupService = {
  async exportBackup() {
    try {
      // Leer todo de la base de datos
      const [
        allSettings,
        allTasks,
        allHabits,
        allHabitResets,
        allWorkouts,
        allExercises,
        allSets,
        allWeights,
      ] = await Promise.all([
        db.select().from(settings).all(),
        db.select().from(tasks).all(),
        db.select().from(habits).all(),
        db.select().from(habitResets).all(),
        db.select().from(workouts).all(),
        db.select().from(exercises).all(),
        db.select().from(sets).all(),
        db.select().from(bodyWeights).all(),
      ]);

      const backupData = {
        settings: allSettings,
        tasks: allTasks,
        habits: allHabits,
        habitResets: allHabitResets,
        workouts: allWorkouts,
        exercises: allExercises,
        sets: allSets,
        bodyWeights: allWeights,
        timestamp: new Date().toISOString(),
        version: 1,
      };

      const jsonString = JSON.stringify(backupData, null, 2);
      const fileUri = `${FileSystem.documentDirectory}mi_dia_backup_${new Date().getTime()}.json`;

      await FileSystem.writeAsStringAsync(fileUri, jsonString, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Exportar respaldo de Mi día',
        });
      }
      return true;
    } catch (e) {
      console.error('Error exportando backup:', e);
      return false;
    }
  },

  async importBackup() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return false;
      }

      const file = result.assets[0];
      if (!file) return false;

      const fileContent = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const data = JSON.parse(fileContent);
      if (!data.version || !data.timestamp) {
        throw new Error('Archivo de respaldo inválido');
      }

      await db.transaction(async (tx) => {
        // Borramos primero
        await tx.delete(settings).run();
        await tx.delete(tasks).run();
        await tx.delete(habits).run();
        await tx.delete(habitResets).run();
        await tx.delete(workouts).run();
        await tx.delete(exercises).run();
        await tx.delete(sets).run();
        await tx.delete(bodyWeights).run();

        // Insertamos
        if (data.settings?.length > 0) await tx.insert(settings).values(data.settings).run();
        if (data.tasks?.length > 0) await tx.insert(tasks).values(data.tasks).run();
        if (data.habits?.length > 0) await tx.insert(habits).values(data.habits).run();
        if (data.habitResets?.length > 0)
          await tx.insert(habitResets).values(data.habitResets).run();
        if (data.workouts?.length > 0) await tx.insert(workouts).values(data.workouts).run();
        if (data.exercises?.length > 0) await tx.insert(exercises).values(data.exercises).run();
        if (data.sets?.length > 0) await tx.insert(sets).values(data.sets).run();
        if (data.bodyWeights?.length > 0)
          await tx.insert(bodyWeights).values(data.bodyWeights).run();
      });

      return true;
    } catch (e) {
      console.error('Error importando backup:', e);
      return false;
    }
  },

  async wipeAllData() {
    try {
      await db.transaction(async (tx) => {
        await tx.delete(settings).run();
        await tx.delete(tasks).run();
        await tx.delete(habits).run();
        await tx.delete(habitResets).run();
        await tx.delete(workouts).run();
        await tx.delete(exercises).run();
        await tx.delete(sets).run();
        await tx.delete(bodyWeights).run();
      });
      return true;
    } catch (e) {
      console.error('Error borrando base de datos:', e);
      return false;
    }
  },
};
