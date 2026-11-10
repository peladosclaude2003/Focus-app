import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/shared/theme';
import { AppText, Card, PillButton } from '@/shared/ui';

interface Props {
  routineName: string;
  isCompleted: boolean;
  onPress: () => void;
  onStartWorkout: () => void;
}

export const TodayWorkoutBentoCard: React.FC<Props> = ({
  routineName,
  isCompleted,
  onPress,
  onStartWorkout,
}) => {
  const { colors } = useTheme();

  return (
    <Card style={styles.card}>
      <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.clickableArea}>
        <View style={styles.headerRow}>
          <View style={styles.badge}>
            <Ionicons name="barbell-outline" size={14} color={colors.electricBlue} />
            <AppText variant="caption" color="ink">
              HOY
            </AppText>
          </View>
          {isCompleted && (
            <AppText variant="caption" color="ink">
              ✓ Completado
            </AppText>
          )}
        </View>

        <AppText variant="title" color="ink" style={styles.title}>
          {routineName}
        </AppText>

        <AppText variant="caption" color="mute" style={styles.subtitle}>
          {isCompleted
            ? '¡Excelente sesión de hoy! Toca para ver el desglose.'
            : '4 ejercicios · 12 series objetivo · 60s descanso'}
        </AppText>
      </TouchableOpacity>

      <View style={styles.actionRow}>
        <PillButton
          label={isCompleted ? 'Ver resumen' : 'Empezar'}
          icon={isCompleted ? 'check-circle-outline' : 'play'}
          onPress={onStartWorkout}
          variant="primary"
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    gap: 16,
  },
  clickableArea: {
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  title: {
    marginTop: 4,
  },
  subtitle: {
    lineHeight: 18,
  },
  actionRow: {
    alignSelf: 'flex-start',
  },
});
