import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View, ScrollView } from 'react-native';

import { t } from '@/shared/i18n';
import { spacing, useTheme } from '@/shared/theme';
import { type Duration } from 'date-fns';
import { AppText, Card } from '@/shared/ui';
import type { AppSettings } from '../../ajustes/store/appSettings';

export interface StreakHeroCardProps {
  label: string;
  startDate: string;
  currentDurationMs: number;
  exactDuration: Duration;
  isPrivate: boolean;
  onTogglePrivacy: () => void;
  selectedUnit: AppSettings['streakUnit'];
  onChangeUnit: (unit: AppSettings['streakUnit']) => void;
}

const UNITS: { value: AppSettings['streakUnit']; label: string }[] = [
  { value: 'secs', label: 'Segundos' },
  { value: 'mins', label: 'Minutos' },
  { value: 'hours', label: 'Horas' },
  { value: 'days', label: 'Días' },
  { value: 'weeks', label: 'Semanas' },
  { value: 'months', label: 'Meses' },
  { value: 'years', label: 'Años' },
];

function formatValue(unit: AppSettings['streakUnit'], ms: number, exactDuration: Duration) {
  const secs = ms / 1000;
  switch (unit) {
    case 'secs':
      return { val: Math.floor(secs).toString(), label: 'segundos' };
    case 'mins':
      return { val: Math.floor(secs / 60).toString(), label: 'minutos' };
    case 'hours':
      return { val: Math.floor(secs / 3600).toString(), label: 'horas' };
    case 'days':
      return { val: Math.floor(secs / 86400).toString(), label: 'días' };
    case 'weeks':
      return { val: (secs / 86400 / 7).toFixed(1), label: 'semanas' };
    case 'months': {
      const totalMonths = (exactDuration.years || 0) * 12 + (exactDuration.months || 0);
      return { val: totalMonths.toString(), label: 'meses' };
    }
    case 'years':
      return { val: (exactDuration.years || 0).toString(), label: 'años' };
    default:
      return { val: '0', label: '' };
  }
}

function formatExactLive(dur: Duration): string {
  const parts = [];
  if (dur.years) parts.push(`${dur.years}a`);
  if (dur.months) parts.push(`${dur.months}m`);
  if (dur.days) parts.push(`${dur.days}d`);
  if (dur.hours) parts.push(`${dur.hours}h`);
  if (dur.minutes) parts.push(`${dur.minutes}m`);
  if (dur.seconds || parts.length === 0) parts.push(`${dur.seconds || 0}s`);
  return parts.join(' ');
}

export function StreakHeroCard({
  label,
  startDate,
  currentDurationMs,
  exactDuration,
  isPrivate,
  onTogglePrivacy,
  selectedUnit,
  onChangeUnit,
}: StreakHeroCardProps) {
  const { colors } = useTheme();

  const displayLabel = isPrivate ? t.racha.hiddenLabel : label;
  const { val, label: unitLabel } = formatValue(selectedUnit, currentDurationMs, exactDuration);
  const liveString = formatExactLive(exactDuration);

  // Auto-ajustar fuente si el número es muy grande
  const numFontSize = val.length > 5 ? 60 : val.length > 3 ? 80 : 100;

  return (
    <Card style={styles.card}>
      <View style={styles.topRow}>
        <AppText variant="caption" color="mute">
          Sin {displayLabel} desde el {startDate}
        </AppText>
        <Pressable
          onPress={onTogglePrivacy}
          style={styles.eyeBtn}
          accessibilityRole="button"
          accessibilityLabel="Ocultar nombre de hábito"
        >
          <MaterialCommunityIcons
            name={isPrivate ? 'eye-off-outline' : 'eye-outline'}
            size={18}
            color={colors.mute}
          />
        </Pressable>
      </View>

      <AppText variant="hero" style={[styles.numText, { fontSize: numFontSize }]}>
        {val}
      </AppText>

      <AppText variant="label" color="mute" style={styles.daysUnit}>
        {unitLabel} continuos
      </AppText>

      <AppText variant="caption" style={styles.liveTimer}>
        {liveString}
      </AppText>

      <View style={[styles.segmentedWrapper, { backgroundColor: colors.cardBorder }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.segmentedScroll}
        >
          {UNITS.map((u) => {
            const isSelected = u.value === selectedUnit;
            return (
              <Pressable
                key={u.value}
                onPress={() => onChangeUnit(u.value)}
                style={[
                  styles.segmentBtn,
                  isSelected && {
                    backgroundColor: colors.card,
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2,
                  },
                ]}
              >
                <AppText
                  variant="caption"
                  color={isSelected ? 'ink' : 'mute'}
                  style={isSelected ? { fontWeight: 'bold' } : {}}
                >
                  {u.label}
                </AppText>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  topRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  eyeBtn: {
    padding: 4,
  },
  numText: {
    marginVertical: spacing.xs,
    lineHeight: 104,
  },
  daysUnit: {
    fontSize: 16,
    textTransform: 'lowercase',
  },
  liveTimer: {
    marginTop: spacing.xs,
    fontVariant: ['tabular-nums'],
  },
  segmentedWrapper: {
    marginTop: spacing.lg,
    borderRadius: 12,
    padding: 4,
    width: '100%',
  },
  segmentedScroll: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  segmentBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
});
