import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

import { useTheme } from '@/shared/theme';
import { AppText, BottomSheet, DeltaChip, PillButton, SheetTextInput } from '@/shared/ui';

import type { ActiveSet } from '../hooks/useGym';

export interface ActiveWorkoutSheetProps {
  visible: boolean;
  routineName: string;
  durationSec: number;
  restTimerSec: number;
  activeSets: ActiveSet[];
  onClose: () => void;
  onCompleteSet: (setId: string, weight: number, reps: number) => Promise<void>;
  onCopyPreviousSet: (setId: string, exerciseId: string) => Promise<void>;
  onFinishWorkout: (notes?: string) => Promise<void>;
}

export function ActiveWorkoutSheet({
  visible,
  routineName,
  durationSec,
  restTimerSec,
  activeSets,
  onClose,
  onCompleteSet,
  onCopyPreviousSet,
  onFinishWorkout,
}: ActiveWorkoutSheetProps) {
  const { colors } = useTheme();
  const [weightInput, setWeightInput] = useState('0');
  const [repsInput, setRepsInput] = useState('0');
  const [notesInput, setNotesInput] = useState('');

  const formatSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const currentSetIndex = activeSets.findIndex((s) => !s.completed);
  const currentSet = currentSetIndex !== -1 ? activeSets[currentSetIndex] : null;

  // Encontrar cuántas series son de este ejercicio
  let currentSeriesNum = 0;
  let totalSeriesForExercise = 0;

  if (currentSet) {
    const exSets = activeSets.filter((s) => s.exerciseId === currentSet.exerciseId);
    totalSeriesForExercise = exSets.length;
    currentSeriesNum = exSets.findIndex((s) => s.id === currentSet.id) + 1;
  }

  const handleCompleteSet = async () => {
    if (!currentSet) return;
    const w = parseFloat(weightInput);
    const r = parseInt(repsInput, 10);
    if (isNaN(w) || isNaN(r) || w <= 0 || r <= 0) return;
    await onCompleteSet(currentSet.id, w, r);
    setWeightInput('');
    setRepsInput('');
  };

  const handleCopyPrevious = async () => {
    if (!currentSet) return;
    await onCopyPreviousSet(currentSet.id, currentSet.exerciseId);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerRow}>
          <View>
            <AppText variant="title">{routineName}</AppText>
            <AppText variant="caption" color="mute">
              Duración: <AppText variant="label">{formatSec(durationSec)}</AppText>
            </AppText>
          </View>

          {restTimerSec > 0 ? (
            <View style={[styles.restBadge, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
              <AppText variant="caption" style={{ color: colors.electricBlue, fontWeight: '700' }}>
                ⏱️ Descanso: {formatSec(restTimerSec)}
              </AppText>
            </View>
          ) : null}
        </View>

        {/* Form de serie actual */}
        {currentSet ? (
          <View
            style={[styles.formBox, { backgroundColor: colors.bg, borderColor: colors.cardBorder }]}
          >
            <AppText variant="caption" color="mute" style={styles.inputLabel}>
              Serie {currentSeriesNum} de {totalSeriesForExercise}
            </AppText>
            <AppText variant="body" style={{ marginBottom: 12, fontWeight: '600' }}>
              {currentSet.exerciseName}
            </AppText>

            <View style={styles.rowTwo}>
              <View style={styles.flex1}>
                <AppText variant="caption" color="mute" style={styles.inputLabel}>
                  Peso (kg)
                </AppText>
                <SheetTextInput
                  style={[styles.input, { color: colors.ink, borderColor: colors.cardBorder }]}
                  value={weightInput}
                  onChangeText={setWeightInput}
                  keyboardType="decimal-pad"
                  placeholder="0"
                />
              </View>
              <View style={styles.flex1}>
                <AppText variant="caption" color="mute" style={styles.inputLabel}>
                  Reps
                </AppText>
                <SheetTextInput
                  style={[styles.input, { color: colors.ink, borderColor: colors.cardBorder }]}
                  value={repsInput}
                  onChangeText={setRepsInput}
                  keyboardType="number-pad"
                  placeholder="0"
                />
              </View>
            </View>

            <View style={styles.btnRow}>
              <PillButton
                label="Completar serie"
                onPress={handleCompleteSet}
                style={styles.flex1}
              />
              <Pressable
                onPress={handleCopyPrevious}
                style={[styles.copyBtn, { borderColor: colors.line }]}
                accessibilityLabel="Copiar serie anterior"
              >
                <AppText variant="caption" color="mute">
                  📋 Copiar anterior
                </AppText>
              </Pressable>
            </View>
          </View>
        ) : (
          <View
            style={[
              styles.formBox,
              { backgroundColor: colors.bg, borderColor: colors.cardBorder, alignItems: 'center' },
            ]}
          >
            <AppText variant="body" style={{ fontWeight: '600', marginBottom: 6 }}>
              ¡Entrenamiento completado!
            </AppText>
            <AppText variant="caption" color="mute">
              Todas las series planificadas han sido completadas.
            </AppText>
          </View>
        )}

        {/* Lista de series registradas en esta sesión */}
        <AppText variant="caption" color="mute" style={styles.sectionTitle}>
          Series registradas ({activeSets.length})
        </AppText>

        <View style={styles.setsScroll}>
          {activeSets
            .filter((s) => s.completed)
            .map((setItem, idx) => {
              const exCompleted = activeSets.filter(
                (s) => s.completed && s.exerciseId === setItem.exerciseId,
              );
              const seriesNum = exCompleted.findIndex((s) => s.id === setItem.id) + 1;
              const exTotal = activeSets.filter((s) => s.exerciseId === setItem.exerciseId).length;

              return (
                <View
                  key={setItem.id}
                  style={[
                    styles.setRow,
                    { backgroundColor: colors.bg, borderColor: colors.cardBorder },
                  ]}
                >
                  <AppText variant="label">
                    Serie {seriesNum} de {exTotal}:{' '}
                    <AppText variant="body">{setItem.exerciseName}</AppText>
                  </AppText>
                  <View style={styles.setValRow}>
                    <AppText variant="label">
                      {setItem.weight} kg × {setItem.reps} reps
                    </AppText>
                    {setItem.isPr ? <DeltaChip value="PR! 🏆" /> : null}
                  </View>
                </View>
              );
            })}
        </View>

        {/* Finalizar Workout */}
        <SheetTextInput
          style={[
            styles.input,
            styles.notesInput,
            { color: colors.ink, borderColor: colors.cardBorder },
          ]}
          placeholder="Notas finales (opcional)"
          placeholderTextColor={colors.mute}
          value={notesInput}
          onChangeText={setNotesInput}
        />

        <PillButton
          label="Finalizar entrenamiento"
          variant="warn"
          onPress={() => onFinishWorkout(notesInput)}
          style={styles.finishBtn}
        />
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  restBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  formBox: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  input: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 14,
    marginBottom: 10,
  },
  rowTwo: {
    flexDirection: 'row',
    gap: 10,
  },
  flex1: {
    flex: 1,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  copyBtn: {
    height: 52,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    textTransform: 'uppercase',
    fontSize: 11,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  setsScroll: {
    maxHeight: 140,
    marginBottom: 12,
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  setValRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notesInput: {
    marginBottom: 12,
  },
  finishBtn: {
    marginTop: 4,
  },
});
