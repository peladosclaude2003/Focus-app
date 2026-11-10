import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

import { BottomSheet, AppText } from '@/shared/ui';
import { useTheme, spacing, radius } from '@/shared/theme';
import type { HabitRow } from '../repository/habits.schema';
import { formatLongDate, toISODate } from '@/shared/lib/dates';

interface HabitFormSheetProps {
  visible: boolean;
  onClose: () => void;
  habit?: HabitRow | null; // null for new
  onSave: (name: string, startAt: number, icon: string, color: string) => void;
}

const ICONS = [
  'fire',
  'heart',
  'star',
  'water',
  'smoking-off',
  'glass-wine',
  'controller-classic',
  'food-apple',
  'brain',
  'book',
];
const COLORS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#64748b',
];

export function HabitFormSheet({ visible, onClose, habit, onSave }: HabitFormSheetProps) {
  const { colors } = useTheme();

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('fire');
  const [color, setColor] = useState('#ef4444');
  const [date, setDate] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (visible) {
      if (habit) {
        setName(habit.name);
        setIcon(habit.icon);
        setColor(habit.color);
        setDate(new Date(habit.startAt));
      } else {
        setName('');
        setIcon('fire');
        setColor('#ef4444');
        setDate(new Date());
      }
    }
  }, [visible, habit]);

  const handleSave = () => {
    if (!name.trim()) return;
    if (date > new Date()) return; // No future dates
    onSave(name.trim(), date.getTime(), icon, color);
    onClose();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      // Keep time, change date
      const newD = new Date(date);
      newD.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      setDate(newD);
    }
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      // Keep date, change time
      const newD = new Date(date);
      newD.setHours(selectedDate.getHours(), selectedDate.getMinutes(), selectedDate.getSeconds());
      setDate(newD);
    }
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AppText variant="title" style={styles.title}>
          {habit ? 'Editar hábito' : 'Nuevo hábito'}
        </AppText>

        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.bg, color: colors.ink, borderColor: colors.cardBorder },
          ]}
          placeholder="Nombre (ej. Sin fumar)"
          placeholderTextColor={colors.mute}
          value={name}
          onChangeText={setName}
          maxLength={40}
        />

        <AppText variant="label" style={styles.sectionTitle}>
          Inicio
        </AppText>
        <View style={styles.dateTimeRow}>
          <TouchableOpacity
            style={[styles.dateBtn, { backgroundColor: colors.bg, borderColor: colors.cardBorder }]}
            onPress={() => setShowDatePicker(true)}
          >
            <MaterialCommunityIcons name="calendar" size={20} color={colors.ink} />
            <AppText>{formatLongDate(toISODate(date))}</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.dateBtn, { backgroundColor: colors.bg, borderColor: colors.cardBorder }]}
            onPress={() => setShowTimePicker(true)}
          >
            <MaterialCommunityIcons name="clock-outline" size={20} color={colors.ink} />
            <AppText>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</AppText>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={handleDateChange}
          />
        )}
        {showTimePicker && (
          <DateTimePicker value={date} mode="time" display="default" onChange={handleTimeChange} />
        )}

        <AppText variant="label" style={styles.sectionTitle}>
          Icono
        </AppText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.row}
        >
          {ICONS.map((ic) => (
            <TouchableOpacity
              key={ic}
              onPress={() => setIcon(ic)}
              style={[
                styles.iconBox,
                {
                  borderColor: icon === ic ? colors.electricBlue : colors.cardBorder,
                  backgroundColor: icon === ic ? colors.electricBlue + '20' : colors.bg,
                },
              ]}
            >
              <MaterialCommunityIcons
                name={ic as any}
                size={28}
                color={icon === ic ? colors.electricBlue : colors.mute}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <AppText variant="label" style={styles.sectionTitle}>
          Color
        </AppText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.row}
        >
          {COLORS.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setColor(c)}
              style={[
                styles.colorBox,
                { backgroundColor: c, borderWidth: color === c ? 3 : 0, borderColor: colors.ink },
              ]}
            />
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.saveBtn,
              { backgroundColor: colors.electricBlue },
              (!name.trim() || date > new Date()) && styles.disabledBtn,
            ]}
            onPress={handleSave}
            disabled={!name.trim() || date > new Date()}
          >
            <AppText style={{ color: '#fff', fontWeight: '700', textAlign: 'center' }}>
              Guardar
            </AppText>
          </TouchableOpacity>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  dateBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    padding: spacing.md,
    borderRadius: radius.lg,
  },
  row: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  iconBox: {
    borderWidth: 1,
    borderRadius: radius.md,
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  footer: {
    marginTop: spacing.md,
  },
  saveBtn: {
    backgroundColor: '#000',
    padding: spacing.md,
    borderRadius: 999,
  },
  disabledBtn: {
    opacity: 0.5,
  },
});
