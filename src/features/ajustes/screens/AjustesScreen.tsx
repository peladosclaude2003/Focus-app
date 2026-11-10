import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { backupService } from '@/features/ajustes/lib/backupService';
import { useSettingsStore } from '@/features/ajustes/store/useSettingsStore';
import { t } from '@/shared/i18n';
import { useTheme } from '@/shared/theme';
import { AppText, BottomSheet, Card, PillButton, Screen } from '@/shared/ui';

export function AjustesScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { settings, updateSetting, isReady } = useSettingsStore();
  const [showWipeConfirm, setShowWipeConfirm] = useState(false);

  if (!isReady) return null;

  const handleExport = async () => {
    const success = await backupService.exportBackup();
    if (success) Alert.alert('Éxito', t.ajustes.backupSuccess);
  };

  const handleImport = async () => {
    const success = await backupService.importBackup();
    if (success) {
      Alert.alert('Éxito', t.ajustes.importSuccess);
    } else {
      Alert.alert('Error', t.ajustes.importError);
    }
  };

  const handleWipe = async () => {
    setShowWipeConfirm(false);
    const success = await backupService.wipeAllData();
    if (success) {
      Alert.alert('Éxito', 'Todos los datos han sido borrados. Reinicia la app.');
    }
  };

  return (
    <Screen title={t.ajustes.title}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <AppText variant="title" color="ink" style={styles.sectionTitle}>
          {t.ajustes.sectionGeneral}
        </AppText>
        <Card style={styles.card}>
          <SettingItem
            title={t.ajustes.weightUnit}
            subtitle={t.ajustes.weightUnitDesc}
            value={settings.weightUnit}
            onToggle={() =>
              updateSetting('weightUnit', settings.weightUnit === 'kg' ? 'lbs' : 'kg')
            }
          />
          <Divider />
          <SettingItem
            title={t.ajustes.firstDayOfWeek}
            subtitle={t.ajustes.firstDayDesc}
            value={settings.firstDayOfWeek}
            onToggle={() =>
              updateSetting(
                'firstDayOfWeek',
                settings.firstDayOfWeek === 'Lunes' ? 'Domingo' : 'Lunes',
              )
            }
          />
          <Divider />
          <SettingItem
            title={t.ajustes.weeklyGymGoal}
            subtitle={t.ajustes.weeklyGymGoalDesc}
            value={`${settings.weeklyGymGoal} días`}
            onToggle={() => {
              const next = settings.weeklyGymGoal >= 7 ? 1 : settings.weeklyGymGoal + 1;
              void updateSetting('weeklyGymGoal', next);
            }}
          />
        </Card>

        <AppText variant="title" color="ink" style={styles.sectionTitle}>
          {t.ajustes.sectionNotifications}
        </AppText>
        <AppText variant="caption" color="mute" style={styles.sectionDesc}>
          {t.ajustes.remindersDesc}
        </AppText>
        <Card style={styles.card}>
          <SettingSwitch
            title={t.ajustes.reminderTasks}
            subtitle={t.ajustes.reminderTasksDesc}
            value={settings.notifTasksEnabled}
            onValueChange={(val) => updateSetting('notifTasksEnabled', val)}
            activeColor={colors.electricBlue}
          />
          <Divider />
          <SettingSwitch
            title={t.ajustes.reminderGym}
            subtitle={t.ajustes.reminderGymDesc}
            value={settings.notifGymEnabled}
            onValueChange={(val) => updateSetting('notifGymEnabled', val)}
            activeColor={colors.electricBlue}
          />
          <Divider />
          <SettingSwitch
            title={t.ajustes.reminderStreak}
            subtitle={t.ajustes.reminderStreakDesc}
            value={settings.notifStreakEnabled}
            onValueChange={(val) => updateSetting('notifStreakEnabled', val)}
            activeColor={colors.electricBlue}
          />
        </Card>

        <AppText variant="title" color="ink" style={styles.sectionTitle}>
          {t.ajustes.sectionSecurity}
        </AppText>
        <Card style={styles.card}>
          <SettingSwitch
            title={t.ajustes.biometricLock}
            subtitle={t.ajustes.biometricDesc}
            value={settings.biometricLock}
            onValueChange={(val) => updateSetting('biometricLock', val)}
            activeColor={colors.electricBlue}
          />
        </Card>

        <AppText variant="title" color="ink" style={styles.sectionTitle}>
          {t.ajustes.sectionData}
        </AppText>
        <Card style={styles.card}>
          <TouchableOpacity style={styles.actionRow} onPress={handleExport}>
            <Ionicons name="share-outline" size={20} color={colors.ink} />
            <AppText variant="body" color="ink">
              {t.ajustes.exportBackup}
            </AppText>
          </TouchableOpacity>
          <Divider />
          <TouchableOpacity style={styles.actionRow} onPress={handleImport}>
            <Ionicons name="download-outline" size={20} color={colors.ink} />
            <AppText variant="body" color="ink">
              {t.ajustes.importBackup}
            </AppText>
          </TouchableOpacity>
          <Divider />
          <TouchableOpacity style={styles.actionRow} onPress={() => setShowWipeConfirm(true)}>
            <Ionicons name="trash-outline" size={20} color={colors.hot} />
            <AppText variant="body" color="hot">
              {t.ajustes.wipeData}
            </AppText>
          </TouchableOpacity>
        </Card>

        <AppText variant="title" color="ink" style={styles.sectionTitle}>
          Desarrollador
        </AppText>
        <Card style={styles.card}>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => router.push('/debug-notifications')}
          >
            <Ionicons name="bug-outline" size={20} color={colors.ink} />
            <AppText variant="body" color="ink">
              Depurar Notificaciones
            </AppText>
          </TouchableOpacity>
        </Card>
      </ScrollView>

      <BottomSheet visible={showWipeConfirm} onClose={() => setShowWipeConfirm(false)}>
        <View style={styles.sheetContent}>
          <View style={styles.dangerIconBadge}>
            <Ionicons name="warning" size={32} color={colors.hot} />
          </View>
          <AppText variant="title" color="ink" style={{ textAlign: 'center' }}>
            {t.ajustes.wipeDangerTitle}
          </AppText>
          <AppText variant="body" color="mute" style={{ textAlign: 'center', lineHeight: 22 }}>
            {t.ajustes.wipeDangerBody}
          </AppText>

          <View style={styles.sheetActions}>
            <PillButton label={t.ajustes.wipeConfirmBtn} variant="warn" onPress={handleWipe} />
            <PillButton
              label={t.racha.cancel}
              variant="ghost"
              onPress={() => setShowWipeConfirm(false)}
            />
          </View>
        </View>
      </BottomSheet>
    </Screen>
  );
}

// --- Componentes auxiliares locales ---

function SettingItem({
  title,
  subtitle,
  value,
  onToggle,
}: {
  title: string;
  subtitle: string;
  value: string;
  onToggle: () => void;
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onToggle} activeOpacity={0.7}>
      <View style={styles.rowText}>
        <AppText variant="body" color="ink">
          {title}
        </AppText>
        <AppText variant="caption" color="mute">
          {subtitle}
        </AppText>
      </View>
      <View style={styles.valuePill}>
        <AppText variant="label" color="electricBlue">
          {value}
        </AppText>
      </View>
    </TouchableOpacity>
  );
}

function SettingSwitch({
  title,
  subtitle,
  value,
  onValueChange,
  activeColor,
}: {
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  activeColor: string;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <AppText variant="body" color="ink">
          {title}
        </AppText>
        <AppText variant="caption" color="mute">
          {subtitle}
        </AppText>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#27272A', true: activeColor }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 110,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionDesc: {
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  rowText: {
    flex: 1,
    paddingRight: 16,
    gap: 2,
  },
  valuePill: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  sheetContent: {
    paddingVertical: 10,
    gap: 16,
    alignItems: 'center',
  },
  dangerIconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 91, 31, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  sheetActions: {
    width: '100%',
    gap: 12,
    marginTop: 16,
  },
});
