import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/shared/theme';

import { AppText } from './AppText';

export interface DeltaChipProps {
  value: string;
  isPositive?: boolean;
}

export function DeltaChip({ value, isPositive = true }: DeltaChipProps) {
  const { colors } = useTheme();

  const textColor = isPositive ? colors.greenDelta : colors.hot;
  const bgColor = isPositive ? colors.greenDeltaBg : 'rgba(255, 91, 31, 0.15)';

  return (
    <View style={[styles.chip, { backgroundColor: bgColor }]}>
      <AppText style={[styles.text, { color: textColor }]}>{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 14,
  },
});
