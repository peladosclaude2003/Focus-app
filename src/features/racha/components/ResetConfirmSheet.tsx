import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { t } from '@/shared/i18n';
import { useTheme } from '@/shared/theme';
import { AppText, BottomSheet, PillButton } from '@/shared/ui';

export interface ResetConfirmSheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (note?: string) => void;
}

export function ResetConfirmSheet({ visible, onClose, onConfirm }: ResetConfirmSheetProps) {
  const { colors } = useTheme();
  const [note, setNote] = useState('');

  const handleConfirm = () => {
    onConfirm(note.trim() || undefined);
    setNote('');
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <AppText variant="title" style={styles.title}>
        {t.racha.relapseConfirmTitle}
      </AppText>
      <AppText variant="body" color="mute" style={styles.body}>
        {t.racha.relapseConfirmBody}
      </AppText>

      <TextInput
        style={[
          styles.textInput,
          {
            backgroundColor: colors.bg,
            color: colors.ink,
            borderColor: colors.cardBorder,
          },
        ]}
        placeholder={t.racha.notePlaceholder}
        placeholderTextColor={colors.mute}
        value={note}
        onChangeText={setNote}
        multiline
        numberOfLines={3}
      />

      <View style={styles.actions}>
        <PillButton label={t.racha.confirmRelapseAction} variant="warn" onPress={handleConfirm} />
        <PillButton
          label={t.racha.cancel}
          variant="ghost"
          onPress={onClose}
          style={styles.cancelBtn}
        />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 8,
  },
  body: {
    marginBottom: 16,
    lineHeight: 22,
  },
  textInput: {
    minHeight: 80,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 14,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  actions: {
    gap: 10,
  },
  cancelBtn: {
    marginTop: 2,
  },
});
