import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

import { useMotion } from '@/shared/hooks/useMotion';
import { t } from '@/shared/i18n';
import { radius, spacing, useTheme } from '@/shared/theme';
import { AppText, Card } from '@/shared/ui';

import type { MilestoneProgress } from '../lib/streakCalculations';

export interface StreakMilestoneCardProps {
  milestone: MilestoneProgress;
}

export function StreakMilestoneCard({ milestone }: StreakMilestoneCardProps) {
  const { colors } = useTheme();
  const motion = useMotion();
  const scale = useSharedValue(1);

  useEffect(() => {
    if (milestone.isMilestoneReached && !motion.reduced) {
      scale.value = withSequence(
        withSpring(1.08, { damping: 10 }),
        withSpring(1.0, { damping: 12 }),
      );
    }
  }, [milestone.isMilestoneReached, motion.reduced, scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <Card>
        {milestone.isMilestoneReached ? (
          <AppText variant="caption" style={[styles.bannerText, { color: colors.greenDelta }]}>
            {t.racha.milestoneBanner(milestone.target)}
          </AppText>
        ) : null}

        <View style={styles.row}>
          <AppText variant="caption" color="mute">
            Próximo hito: <AppText variant="label">{milestone.target} días</AppText>
          </AppText>
          <AppText variant="caption" color="mute">
            Faltan {milestone.daysRemaining} días
          </AppText>
        </View>

        <View style={[styles.barBackground, { backgroundColor: colors.line }]}>
          <View
            style={[
              styles.barFill,
              { width: `${milestone.progressPercent}%`, backgroundColor: colors.acc },
            ]}
          />
        </View>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bannerText: {
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: spacing.sm,
  },
  barBackground: {
    height: 8,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: radius.pill,
  },
});
