import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Linking, Pressable, StyleSheet, View } from 'react-native';

import { t } from '@/shared/i18n';
import { useTheme } from '@/shared/theme';
import { AppText, BottomSheet, PillButton } from '@/shared/ui';

export interface HelpResourcesSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function HelpResourcesSheet({ visible, onClose }: HelpResourcesSheetProps) {
  const { colors } = useTheme();

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber.replace(/\s+/g, '')}`).catch(() => undefined);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <AppText variant="title" style={styles.title}>
        {t.help.title}
      </AppText>
      <AppText variant="body" color="mute" style={styles.description}>
        {t.help.description}
      </AppText>

      <View style={styles.cardsContainer}>
        <Pressable
          onPress={() => handleCall('8009112000')}
          style={[
            styles.resourceCard,
            { backgroundColor: colors.bg, borderColor: colors.cardBorder },
          ]}
        >
          <MaterialCommunityIcons name="phone-in-talk" size={24} color={colors.greenDelta} />
          <View style={styles.textCol}>
            <AppText variant="label">{t.help.linea1Name}</AppText>
            <AppText variant="caption" color="mute">
              {t.help.linea1Number}
            </AppText>
          </View>
        </Pressable>

        <View
          style={[
            styles.resourceCard,
            { backgroundColor: colors.bg, borderColor: colors.cardBorder },
          ]}
        >
          <MaterialCommunityIcons name="account-heart" size={24} color={colors.acc} />
          <View style={styles.textCol}>
            <AppText variant="label">{t.help.linea2Name}</AppText>
            <AppText variant="caption" color="mute">
              {t.help.linea2Number}
            </AppText>
          </View>
        </View>
      </View>

      <PillButton label="Entendido" variant="ghost" onPress={onClose} style={styles.closeBtn} />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
    lineHeight: 20,
  },
  cardsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 14,
  },
  textCol: {
    flex: 1,
  },
  closeBtn: {
    marginTop: 4,
  },
});
