import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { Barbell, CheckCircle, Fire, Gear, House, type IconProps } from 'phosphor-react-native';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useKeyboard } from 'react-native-keyboard-controller';

import { haptics } from '@/shared/lib/haptics';
import { borders, palette, radii, spacing } from '@/shared/theme';
import { useIsTabBarHidden } from './useTabBarStore';

type TabBarProps = Parameters<NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>>[0];

const ICONS: Record<string, React.ComponentType<IconProps>> = {
  index: House,
  hoy: CheckCircle,
  racha: Fire,
  gym: Barbell,
  ajustes: Gear,
};

const TAB_SIZE = 52;
const INNER_PADDING = 6;
const ICON_SIZE = 24;
const BOTTOM_GAP = spacing.s;

export function FloatingTabBar({ state, descriptors, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  
  // Detecta si hay algún BottomSheet abierto (o un entreno activo) pidiendo ocultar la barra
  const isManuallyHidden = useIsTabBarHidden();
  
  // Detecta si el teclado está abierto
  const { height: keyboardHeight } = useKeyboard();
  const isKeyboardOpen = keyboardHeight > 0;

  const isHidden = isManuallyHidden || isKeyboardOpen;

  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (isHidden) {
      translateY.value = withTiming(100, { duration: 250 });
      opacity.value = withTiming(0, { duration: 200 });
    } else {
      translateY.value = withTiming(0, { duration: 300 });
      opacity.value = withTiming(1, { duration: 350 });
    }
  }, [isHidden, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      pointerEvents={isHidden ? 'none' : 'box-none'}
      style={[
        styles.wrapper,
        { bottom: insets.bottom + BOTTOM_GAP },
        animatedStyle,
      ]}
    >
      <BlurView intensity={80} tint="dark" style={styles.pill} accessibilityRole="tablist">
        <View style={styles.content}>
          {state.routes.map((route, index) => {
            const options = descriptors[route.key]?.options;
            const isFocused = state.index === index;
            const Icon = ICONS[route.name] ?? House;

            const onPress = () => {
              haptics.select();
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({ type: 'tabLongPress', target: route.key });
            };

            const accessibilityLabel =
              options?.tabBarAccessibilityLabel ??
              (typeof options?.title === 'string' ? options.title : route.name);

            return (
              <Pressable
                key={route.key}
                accessibilityRole="tab"
                accessibilityState={{ selected: isFocused }}
                accessibilityLabel={accessibilityLabel}
                onPress={onPress}
                onLongPress={onLongPress}
                style={[
                  styles.tab,
                  isFocused ? { backgroundColor: palette.tabBarIndicator } : null,
                ]}
              >
                <Icon
                  weight={isFocused ? 'fill' : 'bold'}
                  size={ICON_SIZE}
                  color={isFocused ? palette.textPrimary : palette.textSecondary}
                />
              </Pressable>
            );
          })}
        </View>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 1000,
    borderRadius: radii.pill,
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
  },
  pill: {
    borderRadius: radii.pill,
    overflow: 'hidden',
    backgroundColor: 'rgba(25, 25, 25, 0.75)', // Fondo oscuro semitransparente para combinar con el blur
    borderWidth: borders.hairline,
    borderColor: palette.tabBarBorder,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: INNER_PADDING,
  },
  tab: {
    width: TAB_SIZE,
    height: TAB_SIZE,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
