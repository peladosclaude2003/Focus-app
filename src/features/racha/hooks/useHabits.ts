import { useCallback, useEffect, useState, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { useFocusEffect } from 'expo-router';

import { haptics } from '@/shared/lib/haptics';

import { generate30DaysHeatmap } from '../lib/streakCalculations';
import { habitsRepository } from '../repository/habits.repository';
import type { HabitRow, HabitResetRow } from '../repository/habits.schema';

export interface UseHabitsReturn {
  habits: HabitRow[];
  nowMs: number;
  loading: boolean;
  createHabit: (name: string, startAt: number, icon?: string, color?: string) => Promise<void>;
  updateHabit: (id: string, partial: Partial<Omit<HabitRow, 'id'>>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  resetHabit: (
    habit: HabitRow,
    resetDateEpoch: number,
    newStartDateEpoch: number,
    note?: string,
  ) => Promise<void>;
  getHabitResets: (id: string) => Promise<HabitResetRow[]>;
  generateHeatmap: (
    startAt: number,
    resets: HabitResetRow[],
  ) => ReturnType<typeof generate30DaysHeatmap>;
}

export function useHabits(): UseHabitsReturn {
  const [habits, setHabits] = useState<HabitRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isFocusedRef = useRef(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const all = await habitsRepository.getAllHabits();
      setHabits(all);
    } catch {
      // ignora error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && isFocusedRef.current) {
        setNowMs(Date.now());
      }
    };
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  useFocusEffect(
    useCallback(() => {
      isFocusedRef.current = true;
      setNowMs(Date.now());

      timerRef.current = setInterval(() => {
        setNowMs(Date.now());
      }, 1000);

      return () => {
        isFocusedRef.current = false;
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }, []),
  );

  const createHabit = async (name: string, startAt: number, icon = 'fire', color = '#ef4444') => {
    if (!name.trim()) return;
    haptics.success();
    await habitsRepository.createHabit(name.trim(), startAt, icon, color);
    await loadData();
  };

  const updateHabit = async (id: string, partial: Partial<Omit<HabitRow, 'id'>>) => {
    await habitsRepository.updateHabit(id, partial);
    await loadData();
  };

  const deleteHabit = async (id: string) => {
    await habitsRepository.deleteHabit(id);
    await loadData();
  };

  const resetHabit = async (
    habit: HabitRow,
    resetDateEpoch: number,
    newStartDateEpoch: number,
    note?: string,
  ) => {
    haptics.warning();
    const currentMs = Date.now();
    const durationMs = currentMs - habit.startAt;

    await habitsRepository.resetHabit(
      habit.id,
      resetDateEpoch,
      newStartDateEpoch,
      durationMs,
      note,
    );
    await loadData();
  };

  const getHabitResets = async (id: string) => {
    return await habitsRepository.getHabitResets(id);
  };

  const generateHeatmap = (startAt: number, resets: HabitResetRow[]) => {
    const resetDateStrings = resets.map((r) => r.resetAt);
    return generate30DaysHeatmap(startAt, resetDateStrings);
  };

  return {
    habits,
    nowMs,
    loading,
    createHabit,
    updateHabit,
    deleteHabit,
    resetHabit,
    getHabitResets,
    generateHeatmap,
  };
}
