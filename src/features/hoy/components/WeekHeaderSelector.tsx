import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { addDays, parseISODate, toISODate, todayISO, type ISODate } from '@/shared/lib/dates';
import { radius, spacing, useTheme } from '@/shared/theme';
import { AppText } from '@/shared/ui';

export interface WeekHeaderSelectorProps {
  selectedDate: ISODate;
  onSelectDate: (date: ISODate) => void;
}

export function WeekHeaderSelector({ selectedDate, onSelectDate }: WeekHeaderSelectorProps) {
  const { colors } = useTheme();

  const daysList = useMemo(() => {
    const center = parseISODate(selectedDate);
    const dayOfWeek = center.getDay(); // 0 is Sun, 1 is Mon
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = parseISODate(addDays(selectedDate, mondayOffset));

    return Array.from({ length: 7 }, (_, i) => {
      const dateObj = new Date(monday);
      dateObj.setDate(monday.getDate() + i);
      const iso = toISODate(dateObj);
      const dayName = dateObj.toLocaleDateString('es', { weekday: 'short' }).slice(0, 3);
      const dayNum = dateObj.getDate();
      const isToday = iso === todayISO();
      return { iso, dayName, dayNum, isToday };
    });
  }, [selectedDate]);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {daysList.map((item) => {
          const isSelected = item.iso === selectedDate;
          return (
            <Pressable
              key={item.iso}
              onPress={() => onSelectDate(item.iso)}
              style={[
                styles.dayPill,
                { backgroundColor: colors.card, borderColor: colors.cardBorder },
                isSelected && styles.selectedPill,
                item.isToday && !isSelected && styles.todayPill,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`${item.dayName} ${item.dayNum}`}
            >
              <AppText
                variant="caption"
                style={[
                  styles.dayName,
                  isSelected ? { color: '#000000', fontWeight: '700' } : { color: colors.mute },
                ]}
              >
                {item.dayName}
              </AppText>
              <AppText
                variant="label"
                style={[
                  styles.dayNum,
                  isSelected ? { color: '#000000', fontWeight: '700' } : { color: colors.ink },
                ]}
              >
                {item.dayNum}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  scroll: {
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  dayPill: {
    width: 48,
    height: 64,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedPill: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  todayPill: {
    borderWidth: 2,
    borderColor: '#3B82F6', // Electric blue ring for TODAY
  },
  dayName: {
    textTransform: 'uppercase',
    fontSize: 11,
  },
  dayNum: {
    fontSize: 16,
    marginTop: 2,
  },
});
