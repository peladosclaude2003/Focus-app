import { StyleSheet, View } from 'react-native';

import { t } from '@/shared/i18n';
import { useTheme } from '@/shared/theme';
import { AppText, Card, DeltaChip } from '@/shared/ui';

import type { ExerciseProgress } from '../lib/gymCalculations';

interface ExerciseProgressCardProps {
  items: ExerciseProgress[];
}

const BAR_MAX_HEIGHT = 28;

/** Lista de ejercicios con su peso tope reciente, PR y mini-historial por sesión. */
export function ExerciseProgressCard({ items }: ExerciseProgressCardProps) {
  const { colors } = useTheme();
  const s = t.gym.progress;

  return (
    <Card>
      <AppText variant="caption" color="mute">
        {s.exercisesTitle}
      </AppText>
      <AppText variant="caption" color="mute">
        {s.exercisesSub}
      </AppText>

      {items.length === 0 ? (
        <AppText variant="body" color="mute" style={styles.empty}>
          {s.exercisesEmpty}
        </AppText>
      ) : (
        items.map((item, idx) => {
          const maxInHistory = Math.max(...item.history) || 1;
          const delta = item.deltaKg;
          return (
            <View
              key={item.exerciseId}
              style={[styles.row, idx > 0 && { borderTopColor: colors.line, borderTopWidth: 1 }]}
              accessible
              accessibilityLabel={[
                item.name,
                `${item.lastTopWeight} kilos`,
                delta !== null ? s.deltaA11y(delta) : null,
                s.best(item.bestWeight),
                s.sessions(item.sessions),
              ]
                .filter(Boolean)
                .join(', ')}
            >
              <View style={styles.info}>
                <AppText variant="label" numberOfLines={1}>
                  {item.name}
                </AppText>
                <AppText variant="caption" color="mute">
                  {s.best(item.bestWeight)} · {s.sessions(item.sessions)}
                </AppText>
              </View>

              <View style={styles.spark} importantForAccessibility="no-hide-descendants">
                {item.history.map((w, i) => (
                  <View
                    key={i}
                    style={[
                      styles.sparkBar,
                      {
                        height: Math.max(3, (w / maxInHistory) * BAR_MAX_HEIGHT),
                        backgroundColor: i === item.history.length - 1 ? colors.acc : colors.subtle,
                      },
                    ]}
                  />
                ))}
              </View>

              <View style={styles.value}>
                <AppText variant="headline">{item.lastTopWeight} kg</AppText>
                {delta !== null && delta !== 0 ? (
                  <DeltaChip value={`${delta > 0 ? '+' : ''}${delta} kg`} isPositive={delta > 0} />
                ) : null}
              </View>
            </View>
          );
        })
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  empty: {
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  spark: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: BAR_MAX_HEIGHT,
    gap: 3,
  },
  sparkBar: {
    width: 5,
    borderRadius: 2,
  },
  value: {
    alignItems: 'flex-end',
    gap: 4,
    minWidth: 72,
  },
});
