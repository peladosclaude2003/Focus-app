import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { t } from '@/shared/i18n';
import { Screen } from '@/shared/ui';
import { useHideTabBar } from '@/shared/ui/useTabBarStore';

import { ActiveWorkoutSheet } from '../components/ActiveWorkoutSheet';
import { GymTabs } from '../components/GymTabs';
import { HoyGymTab } from '../components/HoyGymTab';
import { ProgresoGymTab } from '../components/ProgresoGymTab';
import { RoutinePlannerSheet } from '../components/RoutinePlannerSheet';
import { RoutinePlannerTab } from '../components/RoutinePlannerTab';
import { useGym } from '../hooks/useGym';

type TabId = 'hoy' | 'planificar' | 'progreso';

export function GymScreen() {
  const {
    bodyWeights,
    weightGoal,
    movingAverageKg,
    weeklyAttendance,
    historicalTotalReps,
    historicalMaxWeight,
    weeklyRepsData,
    volumeTrend,
    exerciseProgress,
    weightDiff,
    isWorkoutActive,
    activeRoutineName,
    workoutDurationSec,
    restTimerSec,
    activeSets,
    startWorkout,
    finishWorkout,
    completeSet,
    copyPreviousSet,
    logBodyWeight,
  } = useGym();

  const [activeTab, setActiveTab] = useState<TabId>('hoy');
  const [activeSheetVisible, setActiveSheetVisible] = useState(false);
  const [plannerDayIndex, setPlannerDayIndex] = useState<number | null>(null);

  // Durante un entrenamiento activo la tab bar flotante se oculta.
  useHideTabBar(isWorkoutActive, 'gym-workout');

  const handleStart = async () => {
    await startWorkout('Push');
    setActiveSheetVisible(true);
  };

  const handleFinish = async (notes?: string) => {
    await finishWorkout(notes);
    setActiveSheetVisible(false);
  };

  const handleDayPress = (dayIndex: number) => {
    setPlannerDayIndex(dayIndex);
  };

  return (
    <Screen title={t.gym.title}>
      <GymTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'hoy' && <HoyGymTab onStartWorkout={handleStart} />}

      {activeTab === 'planificar' && <RoutinePlannerTab onDayPress={handleDayPress} />}

      {activeTab === 'progreso' && (
        <ProgresoGymTab
          bodyWeights={bodyWeights}
          movingAverageKg={movingAverageKg}
          weightGoal={weightGoal}
          weightDiff={weightDiff}
          weeklyAttendance={weeklyAttendance}
          historicalTotalReps={historicalTotalReps}
          historicalMaxWeight={historicalMaxWeight}
          weeklyRepsData={weeklyRepsData}
          volumeTrend={volumeTrend}
          exerciseProgress={exerciseProgress}
          onLogWeight={logBodyWeight}
        />
      )}

      {/* Modal de Entrenamiento en Vivo */}
      <ActiveWorkoutSheet
        visible={activeSheetVisible || isWorkoutActive}
        routineName={activeRoutineName}
        durationSec={workoutDurationSec}
        restTimerSec={restTimerSec}
        activeSets={activeSets}
        onClose={() => setActiveSheetVisible(false)}
        onCompleteSet={completeSet}
        onCopyPreviousSet={copyPreviousSet}
        onFinishWorkout={handleFinish}
      />

      {/* Sheet para Planificador Semanal */}
      <RoutinePlannerSheet
        dayIndex={plannerDayIndex}
        visible={plannerDayIndex !== null}
        onClose={() => setPlannerDayIndex(null)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({});
