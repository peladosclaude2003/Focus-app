import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, typeScale } from '@/shared/theme';
import { AppText } from './AppText';
import { SheetTextInput } from './SheetTextInput';

interface NumericStepperProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  step?: number;
  min?: number;
  max?: number;
  isDecimal?: boolean;
}

export function NumericStepper({
  label,
  value,
  onChange,
  step = 1,
  min = 0,
  max = 999,
  isDecimal = false,
}: NumericStepperProps) {
  const { colors } = useTheme();

  const handleDecrement = () => {
    const next = Math.max(min, value - step);
    onChange(isDecimal ? parseFloat(next.toFixed(2)) : next);
  };

  const handleIncrement = () => {
    const next = Math.min(max, value + step);
    onChange(isDecimal ? parseFloat(next.toFixed(2)) : next);
  };

  const handleChangeText = (text: string) => {
    const parsed = isDecimal ? parseFloat(text.replace(',', '.')) : parseInt(text, 10);
    if (!isNaN(parsed)) {
      onChange(Math.min(max, Math.max(min, parsed)));
    }
  };

  return (
    <View style={styles.container}>
      <AppText variant="body" style={[styles.label, { color: colors.ink }]}>
        {label}
      </AppText>
      <View style={[styles.stepperControl, { backgroundColor: colors.card }]}>
        <TouchableOpacity style={styles.button} onPress={handleDecrement}>
          <Ionicons name="remove" size={20} color={colors.ink} />
        </TouchableOpacity>

        <SheetTextInput
          style={[styles.input, typeScale.label, { color: colors.ink }]}
          value={String(value)}
          onChangeText={handleChangeText}
          keyboardType={isDecimal ? 'decimal-pad' : 'number-pad'}
          returnKeyType="done"
        />

        <TouchableOpacity style={styles.button} onPress={handleIncrement}>
          <Ionicons name="add" size={20} color={colors.ink} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  label: {},
  stepperControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 4,
  },
  button: {
    padding: 8,
  },
  input: {
    textAlign: 'center',
    minWidth: 40,
    fontWeight: '600',
  },
});
