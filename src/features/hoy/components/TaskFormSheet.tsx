import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme, spacing, radius } from '@/shared/theme';
import { AppText, BottomSheet, PillButton, SheetTextInput } from '@/shared/ui';
import { parseISODate, toISODate, type ISODate } from '@/shared/lib/dates';

import type { TaskWithCategory } from '../repository/tasks.repository';
import type { RepeatRule } from '../repository/tasks.schema';
import { useCategories } from '../hooks/useCategories';

export interface TaskFormSheetProps {
  visible: boolean;
  initialTask?: TaskWithCategory | null;
  defaultDate: ISODate;
  onClose: () => void;
  onSave: (
    title: string,
    date: ISODate,
    categoryId: string,
    time?: string,
    repeatRule?: RepeatRule,
    reminderType?: string,
  ) => void;
}

/** "HH:mm" → Date de hoy a esa hora local (sin parsear strings ISO híbridos). */
function timeToDate(time: string): Date {
  const date = new Date();
  if (!time) return date;
  const [h, m] = time.split(':').map(Number);
  date.setHours(h ?? 0, m ?? 0, 0, 0);
  return date;
}

export function TaskFormSheet({
  visible,
  initialTask,
  defaultDate,
  onClose,
  onSave,
}: TaskFormSheetProps) {
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<ISODate>(defaultDate);
  const [time, setTime] = useState<string>('');
  const [repeatRule, setRepeatRule] = useState<RepeatRule>('none');
  const [reminderType, setReminderType] = useState<string>('none');
  const [categoryId, setCategoryId] = useState<string>('cat-general');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const { categories } = useCategories();

  useEffect(() => {
    if (visible) {
      if (initialTask) {
        setTitle(initialTask.title);
        setDate(initialTask.date as ISODate);
        setTime(initialTask.time || '');
        setRepeatRule(initialTask.repeatRule);
        setReminderType(initialTask.reminderType || 'none');
        setCategoryId(initialTask.categoryId);
      } else {
        setTitle('');
        setDate(defaultDate);
        setTime('');
        setRepeatRule('none');
        setReminderType('none');
        setCategoryId('cat-general');
      }
    }
  }, [initialTask, visible, defaultDate]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(title, date, categoryId, time, repeatRule, reminderType);

    if (categoryId === 'cat-compras') {
      setTitle('');
      return;
    }
    onClose();
  };

  const handleDateChange = (event: DateTimePickerEvent, selected?: Date) => {
    setShowDatePicker(false);
    if (selected) {
      setDate(toISODate(selected));
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, selected?: Date) => {
    setShowTimePicker(false);
    if (selected) {
      const hh = String(selected.getHours()).padStart(2, '0');
      const mm = String(selected.getMinutes()).padStart(2, '0');
      setTime(`${hh}:${mm}`);
    }
  };

  const repeatOptions: { key: RepeatRule; label: string }[] = [
    { key: 'none', label: 'Ninguna' },
    { key: 'daily', label: 'Diaria' },
    { key: 'weekdays', label: 'L-V' },
    { key: 'monthly', label: 'Mensual' },
  ];

  const reminderOptions: { key: string; label: string }[] = [
    { key: 'none', label: 'No avisar' },
    { key: 'exact', label: 'A la hora' },
    { key: '10m', label: '10 min antes' },
    { key: '1h', label: '1 h antes' },
    { key: '1d', label: '1 d antes' },
  ];

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AppText variant="title" style={styles.sheetTitle}>
          {initialTask ? 'Editar tarea' : 'Nueva tarea'}
        </AppText>

        <AppText variant="caption" color="mute" style={styles.inputLabel}>
          ¿Qué toca hacer?
        </AppText>
        <SheetTextInput
          style={[
            styles.textInput,
            {
              backgroundColor: colors.bg,
              color: colors.ink,
              borderColor: colors.cardBorder,
            },
          ]}
          placeholder="Ej. Entrenar piernas, Leer 20 páginas"
          placeholderTextColor={colors.mute}
          value={title}
          onChangeText={setTitle}
          maxLength={120}
          autoFocus
        />

        <View style={styles.dateRow}>
          <View style={{ flex: 1 }}>
            <AppText variant="caption" color="mute" style={styles.inputLabel}>
              Fecha
            </AppText>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowDatePicker(true)}
              style={[
                styles.pickerButton,
                { backgroundColor: colors.bg, borderColor: colors.cardBorder },
              ]}
            >
              <MaterialCommunityIcons name="calendar" size={20} color={colors.ink} />
              <AppText style={{ color: colors.ink, marginLeft: 8 }}>{date}</AppText>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <AppText variant="caption" color="mute" style={styles.inputLabel}>
              Hora (opcional)
            </AppText>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowTimePicker(true)}
                style={[
                  styles.pickerButton,
                  { backgroundColor: colors.bg, borderColor: colors.cardBorder, flex: 1 },
                ]}
              >
                <MaterialCommunityIcons name="clock-outline" size={20} color={colors.ink} />
                <AppText style={{ color: time ? colors.ink : colors.mute, marginLeft: 8 }}>
                  {time || '--:--'}
                </AppText>
              </TouchableOpacity>
              {time ? (
                <TouchableOpacity onPress={() => setTime('')} style={styles.clearBtn}>
                  <MaterialCommunityIcons name="close" size={20} color={colors.mute} />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={parseISODate(date)}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={timeToDate(time)}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}

        <AppText variant="caption" color="mute" style={styles.inputLabel}>
          Categoría
        </AppText>
        <View style={styles.categoriesScrollWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
            keyboardShouldPersistTaps="handled"
          >
            {categories.map((cat) => {
              const isSelected = categoryId === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  activeOpacity={0.7}
                  onPress={() => setCategoryId(cat.id)}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: isSelected ? cat.color + '20' : colors.bg,
                      borderColor: isSelected ? cat.color : colors.cardBorder,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={cat.icon as any}
                    size={16}
                    color={isSelected ? cat.color : colors.mute}
                  />
                  <AppText
                    variant="caption"
                    style={{
                      color: isSelected ? cat.color : colors.mute,
                      marginLeft: 4,
                      fontWeight: isSelected ? '700' : '400',
                    }}
                  >
                    {cat.name}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <AppText variant="caption" color="mute" style={styles.inputLabel}>
          Repetición
        </AppText>
        <View style={styles.repeatRow}>
          {repeatOptions.map((opt) => {
            const isSelected = repeatRule === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                activeOpacity={0.7}
                onPress={() => setRepeatRule(opt.key)}
                style={[
                  styles.repeatOption,
                  { backgroundColor: colors.bg, borderColor: colors.cardBorder },
                  isSelected && {
                    backgroundColor: colors.primaryPill,
                    borderColor: colors.primaryPill,
                  },
                ]}
              >
                <AppText
                  variant="caption"
                  style={[
                    styles.repeatText,
                    isSelected
                      ? { color: colors.onPrimaryPill, fontWeight: '700' }
                      : { color: colors.mute },
                  ]}
                >
                  {opt.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        {time ? (
          <>
            <AppText variant="caption" color="mute" style={styles.inputLabel}>
              Recordatorio
            </AppText>
            <View style={styles.repeatRow}>
              {reminderOptions.map((opt) => {
                const isSelected = reminderType === opt.key;
                return (
                  <TouchableOpacity
                    key={opt.key}
                    activeOpacity={0.7}
                    onPress={() => setReminderType(opt.key)}
                    style={[
                      styles.repeatOption,
                      { backgroundColor: colors.bg, borderColor: colors.cardBorder },
                      isSelected && {
                        backgroundColor: colors.primaryPill,
                        borderColor: colors.primaryPill,
                      },
                    ]}
                  >
                    <AppText
                      variant="caption"
                      style={[
                        styles.repeatText,
                        isSelected
                          ? { color: colors.onPrimaryPill, fontWeight: '700' }
                          : { color: colors.mute },
                      ]}
                    >
                      {opt.label}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        ) : null}

        <PillButton
          label={initialTask ? 'Guardar cambios' : 'Agregar tarea'}
          onPress={handleSave}
          style={styles.saveBtn}
        />
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetTitle: {
    marginBottom: 16,
  },
  inputLabel: {
    marginTop: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 11,
  },
  textInput: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
  },
  clearBtn: {
    padding: 8,
    marginLeft: 4,
  },
  repeatRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  repeatOption: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  repeatText: {
    fontSize: 12,
  },
  saveBtn: {
    marginTop: 8,
  },
  categoriesScrollWrapper: {
    marginBottom: 16,
    marginHorizontal: -16,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
});
