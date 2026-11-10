import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { useTheme, radius } from '@/shared/theme';
import { AppText } from './AppText';

export interface SegmentedControlProps<T extends string> {
  options: { label: string; value: T }[];
  selectedValue: T;
  onValueChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  options,
  selectedValue,
  onValueChange,
}: SegmentedControlProps<T>) {
  const { colors } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
    >
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            activeOpacity={0.8}
            onPress={() => onValueChange(option.value)}
            style={[styles.segment, isSelected && { backgroundColor: colors.bg }]}
          >
            <AppText
              variant="caption"
              style={[
                styles.label,
                isSelected ? { color: colors.ink, fontWeight: '700' } : { color: colors.mute },
              ]}
            >
              {option.label}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 36,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: 2,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm - 2,
  },
  label: {
    fontSize: 13,
  },
});
