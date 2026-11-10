import { StyleSheet, View } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

import { t } from '@/shared/i18n';
import { useTheme } from '@/shared/theme';
import { AppText, BottomSheet, PillButton } from '@/shared/ui';

import type { HabitResetRow } from '../repository/habits.schema';

export interface ResetHistorySheetProps {
  visible: boolean;
  resets: HabitResetRow[];
  onClose: () => void;
}

export function ResetHistorySheet({ visible, resets, onClose }: ResetHistorySheetProps) {
  const { colors } = useTheme();

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <BottomSheetScrollView showsVerticalScrollIndicator={false}>
        <AppText variant="title" style={styles.title}>
          {t.racha.historyBtn}
        </AppText>

        {resets.length === 0 ? (
          <AppText color="mute" style={styles.emptyText}>
            No hay recaídas registradas. ¡Sigue así!
          </AppText>
        ) : (
          <View style={styles.list}>
            {resets.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.itemRow,
                  { backgroundColor: colors.bg, borderColor: colors.cardBorder },
                ]}
              >
                <AppText variant="label" style={styles.dateText}>
                  📅 {new Date(item.resetAt).toLocaleString()}
                </AppText>
                {item.note ? (
                  <AppText variant="caption" color="mute" style={styles.noteText}>
                    {`"${item.note}"`}
                  </AppText>
                ) : null}
              </View>
            ))}
          </View>
        )}

        <PillButton label="Cerrar" variant="ghost" onPress={onClose} style={styles.closeBtn} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 16,
  },
  emptyText: {
    marginVertical: 16,
    textAlign: 'center',
  },
  list: {
    gap: 10,
    marginBottom: 16,
    maxHeight: 280,
  },
  itemRow: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  dateText: {
    fontSize: 14,
  },
  noteText: {
    marginTop: 4,
    fontStyle: 'italic',
  },
  closeBtn: {
    marginTop: 8,
  },
});
