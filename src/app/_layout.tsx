import { Stack } from 'expo-router';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { useAppBootstrap } from '@/shared/hooks/useAppBootstrap';
import { useBiometricLock } from '@/shared/hooks/useBiometricLock';
import { useQuickActions } from '@/shared/hooks/useQuickActions';
import {
  NotificationPermissionSheet,
  NotificationService,
  useNotificationActions,
} from '@/shared/notifications';
import { useTheme } from '@/shared/theme';
import { BiometricScreen, BootStatus } from '@/shared/ui';
import { useEffect } from 'react';

export default function RootLayout() {
  const { ready, error } = useAppBootstrap();
  const { isUnlocked, isBiometricEnabled, retryAuth } = useBiometricLock(ready);

  useQuickActions(ready, isBiometricEnabled ? isUnlocked : true);
  useNotificationActions();

  const { scheme, colors } = useTheme();

  useEffect(() => {
    if (ready) {
      NotificationService.setupChannels();
    }
  }, [ready]);

  return (
    <GestureHandlerRootView style={[styles.root, { backgroundColor: colors.background }]}>
      <KeyboardProvider statusBarTranslucent navigationBarTranslucent>
        <BottomSheetModalProvider>
          <StatusBar style="light" />
          {!ready ? (
            <BootStatus error={error} />
          ) : isBiometricEnabled && !isUnlocked ? (
            <BiometricScreen onRetry={retryAuth} />
          ) : (
            <>
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: colors.background },
                }}
              />
              <NotificationPermissionSheet />
            </>
          )}
        </BottomSheetModalProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
