import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';

import { spacing, useTheme, radius } from '@/shared/theme';
import { useHideTabBar } from './useTabBarStore';

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapPoints?: (string | number)[];
}

const DEFAULT_SNAP_POINTS = ['85%'];

export const BottomSheetComponent = ({
  visible,
  onClose,
  children,
  snapPoints,
}: BottomSheetProps) => {
  const { colors } = useTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);

  // La tab bar flotante se desliza hacia abajo mientras este sheet esté abierto.
  useHideTabBar(visible, 'sheet');

  const finalSnapPoints = React.useMemo(() => snapPoints || DEFAULT_SNAP_POINTS, [snapPoints]);

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose],
  );

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.75}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={finalSnapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      enableDynamicSizing={false}
      enablePanDownToClose={true}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      handleIndicatorStyle={{ backgroundColor: colors.mute, width: 36, height: 4 }}
      backgroundStyle={{
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        borderTopLeftRadius: radius.lg,
        borderTopRightRadius: radius.lg,
      }}
      style={styles.sheet}
    >
      {children}
    </BottomSheet>
  );
};

// Exportar con el nombre original para no romper dependencias
export { BottomSheetComponent as BottomSheet };

const styles = StyleSheet.create({
  sheet: {
    paddingHorizontal: spacing.lg,
  },
});
