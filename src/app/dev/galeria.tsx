import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';

import { useTheme, radii, spacing, typography, borders } from '@/shared/theme';
import { AppText } from '@/shared/ui';

export default function DevGaleriaScreen() {
  const { colors } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Design System Gallery', headerShown: true }} />
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { backgroundColor: colors.background }]}
      >
        <AppText variant="title" style={styles.sectionTitle}>
          Palette
        </AppText>

        {Object.entries(colors).map(([name, hex]) => (
          <View key={name} style={styles.colorRow}>
            <View style={[styles.colorSwatch, { backgroundColor: hex }]} />
            <View>
              <AppText variant="headline">{name}</AppText>
              <AppText variant="caption">{String(hex)}</AppText>
            </View>
          </View>
        ))}

        <AppText variant="title" style={[styles.sectionTitle, { marginTop: spacing.xxl }]}>
          Typography
        </AppText>

        {Object.keys(typography).map((variant) => (
          <View key={variant} style={styles.typeRow}>
            <AppText variant={variant as any}>{variant} - 123,456.78</AppText>
            <AppText variant="caption" color="textSecondary">
              {variant}
            </AppText>
          </View>
        ))}

        <AppText variant="title" style={[styles.sectionTitle, { marginTop: spacing.xxl }]}>
          Outline States
        </AppText>

        <View style={styles.outlineContainer}>
          <View
            style={[
              styles.outlineBox,
              {
                borderColor: colors.border,
                borderWidth: borders.hairline,
                borderRadius: radii.cardBig,
              },
            ]}
          >
            <AppText variant="body">Solid Hairline</AppText>
          </View>

          <View
            style={[
              styles.outlineBox,
              {
                borderColor: colors.textSecondary,
                borderWidth: 1,
                borderStyle: 'dashed', // React Native only supports dashed natively, for strokeDasharray we need SVG, but dashed is close for normal Views
                borderRadius: radii.tile,
              },
            ]}
          >
            <AppText variant="body">Dashed Outline</AppText>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.l,
  },
  sectionTitle: {
    marginBottom: spacing.l,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  colorSwatch: {
    width: 48,
    height: 48,
    borderRadius: radii.pill,
    marginRight: spacing.m,
  },
  typeRow: {
    marginBottom: spacing.l,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: spacing.xs,
  },
  outlineContainer: {
    gap: spacing.m,
  },
  outlineBox: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
