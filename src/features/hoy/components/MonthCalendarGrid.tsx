import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import {
  getMonthCalendarGrid,
  formatMonthYear,
  type ISODate,
  parseISODate,
  todayISO,
  getNextMonth,
  getPrevMonth,
} from '@/shared/lib/dates';
import { useTheme, radius, spacing } from '@/shared/theme';
import { AppText } from '@/shared/ui';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface MonthCalendarGridProps {
  currentMonth: ISODate; // Cualquier fecha dentro del mes a mostrar
  selectedDate: ISODate;
  stats: Record<ISODate, { total: number; done: number }>;
  onSelectDate: (date: ISODate) => void;
  onChangeMonth: (newMonth: ISODate) => void;
}

export function MonthCalendarGrid({
  currentMonth,
  selectedDate,
  stats,
  onSelectDate,
  onChangeMonth,
}: MonthCalendarGridProps) {
  const { colors } = useTheme();

  const gridDays = useMemo(() => getMonthCalendarGrid(currentMonth, 1), [currentMonth]);
  const currentMonthNum = parseISODate(currentMonth).getMonth();
  const today = todayISO();

  const handlePrev = () => onChangeMonth(getPrevMonth(currentMonth));
  const handleNext = () => onChangeMonth(getNextMonth(currentMonth));

  return (
    <View
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrev} style={styles.navBtn}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={colors.ink} />
        </TouchableOpacity>
        <AppText variant="label" style={styles.monthTitle}>
          {formatMonthYear(currentMonth)}
        </AppText>
        <TouchableOpacity onPress={handleNext} style={styles.navBtn}>
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.ink} />
        </TouchableOpacity>
      </View>

      <View style={styles.weekDays}>
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
          <View key={i} style={styles.dayCell}>
            <AppText variant="caption" color="mute" style={styles.weekDayText}>
              {day}
            </AppText>
          </View>
        ))}
      </View>

      <View style={styles.grid}>
        {gridDays.map((isoDate) => {
          const dateObj = parseISODate(isoDate);
          const isCurrentMonth = dateObj.getMonth() === currentMonthNum;
          const isSelected = isoDate === selectedDate;
          const isToday = isoDate === today;

          const dayStats = stats[isoDate];
          const hasTasks = dayStats && dayStats.total > 0;
          const allDone = hasTasks && dayStats.done >= dayStats.total;

          return (
            <TouchableOpacity
              key={isoDate}
              activeOpacity={0.7}
              onPress={() => onSelectDate(isoDate)}
              style={styles.dayCell}
            >
              <View
                style={[
                  styles.dayCircle,
                  isSelected && { backgroundColor: colors.primaryPill },
                  isToday && !isSelected && { borderColor: colors.primaryPill, borderWidth: 1 },
                ]}
              >
                <AppText
                  style={[
                    styles.dayText,
                    !isCurrentMonth && { color: colors.mute },
                    isSelected && { color: colors.onPrimaryPill, fontWeight: '700' },
                  ]}
                >
                  {dateObj.getDate()}
                </AppText>
              </View>
              <View style={styles.dotContainer}>
                {hasTasks ? (
                  <View
                    style={[
                      styles.dot,
                      allDone
                        ? { backgroundColor: colors.primaryPill, borderColor: colors.primaryPill }
                        : { borderColor: colors.primaryPill, borderWidth: 1.5 },
                    ]}
                  />
                ) : null}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  monthTitle: {
    textTransform: 'capitalize',
  },
  navBtn: {
    padding: spacing.xs,
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    alignItems: 'center',
    paddingVertical: 4,
  },
  weekDayText: {
    fontWeight: '600',
    fontSize: 12,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 14,
  },
  dotContainer: {
    height: 6,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
});
