import * as LocalAuthentication from 'expo-local-authentication';
import { useEffect, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { settingsRepository } from '@/features/ajustes/repository/settings.repository';

export function useBiometricLock(isDbReady: boolean) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    if (!isDbReady) return;

    const checkSettings = async () => {
      const val = await settingsRepository.get('biometricLock');
      const enabled = val === 'true';
      setIsBiometricEnabled(enabled);
      if (!enabled) {
        setIsUnlocked(true);
      }
    };

    void checkSettings();
  }, [isDbReady]);

  const authenticate = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        setIsUnlocked(true); // Fallback si no hay hardware
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Desbloquear Mi día',
        cancelLabel: 'Cancelar',
        fallbackLabel: 'Usar código',
      });

      if (result.success) {
        setIsUnlocked(true);
      }
    } catch (e) {
      console.error('Biometric Auth error', e);
    }
  };

  useEffect(() => {
    if (isBiometricEnabled && !isUnlocked && isDbReady) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void authenticate();
    }
  }, [isBiometricEnabled, isUnlocked, isDbReady]);

  // Manejar el background -> foreground para volver a bloquear si está habilitado
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        if (isBiometricEnabled) {
          setIsUnlocked(false);
        }
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState, isBiometricEnabled]);

  return {
    isUnlocked,
    isBiometricEnabled,
    retryAuth: authenticate,
  };
}
