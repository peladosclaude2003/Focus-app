import * as Haptics from 'expo-haptics';

/**
 * Envoltorio de expo-haptics: la vibración es un extra, nunca debe romper un flujo.
 */
const safe = (fn: () => Promise<void>) => {
  fn().catch(() => undefined);
};

export const haptics = {
  tap: () => safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  select: () => safe(() => Haptics.selectionAsync()),
  success: () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  warning: () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
};
