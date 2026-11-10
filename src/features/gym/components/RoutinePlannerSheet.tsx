import { StyleSheet, View } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useState } from 'react';
import { AppText, BottomSheet, NumericStepper } from '@/shared/ui';
import { useTheme } from '@/shared/theme';

interface RoutinePlannerSheetProps {
  dayIndex: number | null; // 0-6
  visible: boolean;
  onClose: () => void;
}

export function RoutinePlannerSheet({ dayIndex, visible, onClose }: RoutinePlannerSheetProps) {
  const { colors } = useTheme();

  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(60);
  const [rest, setRest] = useState(90);

  return (
    <BottomSheet visible={visible && dayIndex !== null} onClose={onClose}>
      <BottomSheetScrollView contentContainerStyle={styles.content}>
        <AppText variant="title" style={[styles.title, { color: colors.ink }]}>
          Editar Día {dayIndex}
        </AppText>
        <AppText variant="body" style={[styles.subtitle, { color: colors.inkSecondary }]}>
          Agrega ejercicios a este día de la rutina.
        </AppText>

        {/* Placeholder para la UI del Planificador */}
        <View style={[styles.exerciseCard, { backgroundColor: colors.card }]}>
          <AppText variant="label" style={[styles.exerciseName, { color: colors.ink }]}>
            Press de Banca Plano
          </AppText>
          <AppText variant="caption" style={[styles.exerciseMuscle, { color: colors.acc }]}>
            Pecho
          </AppText>

          <View style={styles.steppersContainer}>
            <NumericStepper label="Series" value={sets} onChange={setSets} min={1} max={10} />
            <NumericStepper label="Reps." value={reps} onChange={setReps} min={1} max={50} />
            <NumericStepper
              label="Peso (kg)"
              value={weight}
              onChange={setWeight}
              step={2.5}
              min={0}
              max={500}
              isDecimal
            />
            <NumericStepper
              label="Descanso (s)"
              value={rest}
              onChange={setRest}
              step={15}
              min={0}
              max={600}
            />
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 24,
  },
  exerciseCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  exerciseName: {
    fontWeight: '700',
  },
  exerciseMuscle: {
    marginBottom: 16,
  },
  steppersContainer: {
    gap: 8,
  },
});
