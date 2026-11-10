import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/shared/theme';
import { AppText } from '@/shared/ui';
import { Ionicons } from '@expo/vector-icons';

interface RoutinePlannerTabProps {
  onDayPress: (dayIndex: number) => void;
}

export function RoutinePlannerTab({ onDayPress }: RoutinePlannerTabProps) {
  const { colors } = useTheme();

  // Mock data for initial render
  const weekDays = [
    { label: 'Lunes', subtitle: 'Pecho y Espalda', isRest: false },
    { label: 'Martes', subtitle: 'Descanso', isRest: true },
    { label: 'Miércoles', subtitle: 'Descanso', isRest: true },
    { label: 'Jueves', subtitle: 'Piernas', isRest: false },
    { label: 'Viernes', subtitle: 'Descanso', isRest: true },
    { label: 'Sábado', subtitle: 'Descanso', isRest: true },
    { label: 'Domingo', subtitle: 'Descanso', isRest: true },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <AppText variant="title" style={[styles.headerTitle, { color: colors.ink }]}>
        Mi Rutina
      </AppText>
      <AppText variant="body" style={[styles.headerSubtitle, { color: colors.inkSecondary }]}>
        Toca un día para editar los ejercicios
      </AppText>

      <View style={styles.daysList}>
        {weekDays.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayCard,
              { backgroundColor: day.isRest ? 'transparent' : colors.card },
              day.isRest && [styles.dayCardRest, { borderColor: colors.line }],
            ]}
            activeOpacity={0.7}
            onPress={() => onDayPress(index)}
          >
            <View style={styles.dayInfo}>
              <AppText variant="label" style={[styles.dayLabel, { color: colors.ink }]}>
                {day.label}
              </AppText>
              <AppText
                variant="caption"
                style={[styles.daySubtitle, { color: day.isRest ? colors.mute : colors.acc }]}
              >
                {day.subtitle}
              </AppText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.mute} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    marginBottom: 4,
  },
  headerSubtitle: {
    marginBottom: 16,
  },
  daysList: {
    gap: 12,
    paddingBottom: 24,
  },
  dayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dayCardRest: {
    borderStyle: 'dashed',
  },
  dayInfo: {
    gap: 4,
  },
  dayLabel: {
    fontWeight: '600',
  },
  daySubtitle: {},
});
