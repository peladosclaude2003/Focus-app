import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppText } from '@/shared/ui';
import { useTheme } from '@/shared/theme';

type TabId = 'hoy' | 'planificar' | 'progreso';

interface GymTabsProps {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
}

export function GymTabs({ activeTab, onChange }: GymTabsProps) {
  const { colors } = useTheme();

  const tabs: { id: TabId; label: string }[] = [
    { id: 'hoy', label: 'Hoy' },
    { id: 'planificar', label: 'Planificar' },
    { id: 'progreso', label: 'Progreso' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, isActive && { backgroundColor: colors.acc }]}
            onPress={() => onChange(tab.id)}
            activeOpacity={0.7}
          >
            <AppText variant="label" style={{ color: isActive ? colors.onAcc : colors.mute }}>
              {tab.label}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
});
