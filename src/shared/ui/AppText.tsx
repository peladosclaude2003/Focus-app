import { Text, type TextProps } from 'react-native';

import {
  maxFontScale,
  typeScale,
  useTheme,
  type ColorTokens,
  type TypeVariant,
} from '@/shared/theme';

export interface AppTextProps extends TextProps {
  variant?: TypeVariant;
  color?: keyof ColorTokens;
}

/**
 * Texto base de la app: aplica tipografía, color del tema y un tope de
 * escalado por variante para respetar Dynamic Type sin romper el layout.
 */
export function AppText({
  variant = 'body',
  color = 'ink',
  style,
  maxFontSizeMultiplier,
  ...rest
}: AppTextProps) {
  const { colors } = useTheme();
  return (
    <Text
      allowFontScaling
      maxFontSizeMultiplier={maxFontSizeMultiplier ?? maxFontScale[variant]}
      style={[typeScale[variant], { color: colors[color] }, style]}
      {...rest}
    />
  );
}
