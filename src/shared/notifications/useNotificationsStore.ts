import { create } from 'zustand';

interface NotificationsState {
  permissionSheetVisible: boolean;
  onPermissionGranted: (() => void) | null;
  onPermissionDenied: (() => void) | null;
  requestPermission: () => Promise<boolean>;
  closeSheet: () => void;
  resolvePermission: (granted: boolean) => void;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  permissionSheetVisible: false,
  onPermissionGranted: null,
  onPermissionDenied: null,
  requestPermission: () => {
    return new Promise<boolean>((resolve) => {
      set({
        permissionSheetVisible: true,
        onPermissionGranted: () => resolve(true),
        onPermissionDenied: () => resolve(false),
      });
    });
  },
  closeSheet: () => {
    const { onPermissionDenied } = get();
    if (onPermissionDenied) onPermissionDenied();
    set({ permissionSheetVisible: false, onPermissionGranted: null, onPermissionDenied: null });
  },
  resolvePermission: (granted: boolean) => {
    const { onPermissionGranted, onPermissionDenied } = get();
    if (granted && onPermissionGranted) onPermissionGranted();
    if (!granted && onPermissionDenied) onPermissionDenied();
    set({ permissionSheetVisible: false, onPermissionGranted: null, onPermissionDenied: null });
  },
}));
