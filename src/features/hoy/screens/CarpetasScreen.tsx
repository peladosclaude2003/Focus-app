import React, { useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useTheme, spacing, radius } from '@/shared/theme';
import { AppText, BottomSheet, PillButton, Screen } from '@/shared/ui';
import { t } from '@/shared/i18n';
import { useCategories } from '../hooks/useCategories';
import type { CategoryRow } from '../repository/tasks.schema';

export function CarpetasScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();

  const [formVisible, setFormVisible] = useState(false);
  const [editingCat, setEditingCat] = useState<CategoryRow | null>(null);
  const [catName, setCatName] = useState('');
  const [catColor, setCatColor] = useState('#3b82f6');
  const [catIcon, setCatIcon] = useState('folder-outline');

  const colorOptions = [
    '#64748b',
    '#ef4444',
    '#f59e0b',
    '#10b981',
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
  ];
  const iconOptions = [
    'folder-outline',
    'briefcase-outline',
    'cart-outline',
    'home-outline',
    'school-outline',
    'account-outline',
    'star-outline',
    'heart-outline',
  ];

  const handleOpenAdd = () => {
    setEditingCat(null);
    setCatName('');
    setCatColor(colorOptions[4] || '#3b82f6');
    setCatIcon(iconOptions[0] || 'folder-outline');
    setFormVisible(true);
  };

  const handleOpenEdit = (cat: CategoryRow) => {
    setEditingCat(cat);
    setCatName(cat.name || '');
    setCatColor(cat.color || '#3b82f6');
    setCatIcon(cat.icon || 'folder-outline');
    setFormVisible(true);
  };

  const handleSave = async () => {
    if (!catName.trim()) return;
    if (editingCat) {
      await updateCategory(editingCat.id, { name: catName, color: catColor, icon: catIcon });
    } else {
      await addCategory(catName, catIcon, catColor);
    }
    setFormVisible(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert(t.carpetas.deleteConfirmTitle, t.carpetas.deleteConfirmBody, [
      { text: t.carpetas.cancel, style: 'cancel' },
      {
        text: t.carpetas.deleteConfirmBtn,
        style: 'destructive',
        onPress: () => deleteCategory(id),
      },
    ]);
  };

  const renderItem = ({ item }: { item: CategoryRow }) => (
    <Pressable
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
      onPress={() => router.push(`/carpeta/${item.id}` as any)}
    >
      <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
        <MaterialCommunityIcons name={item.icon as any} size={28} color={item.color} />
      </View>
      <View style={styles.cardContent}>
        <AppText variant="body" style={{ fontWeight: '600' }}>
          {item.name}
        </AppText>
      </View>
      <View style={styles.cardActions}>
        {!item.isDefault && (
          <>
            <Pressable onPress={() => handleOpenEdit(item)} style={styles.actionBtn}>
              <MaterialCommunityIcons name="pencil" size={20} color={colors.ink} />
            </Pressable>
            <Pressable onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
              <MaterialCommunityIcons name="trash-can-outline" size={20} color={colors.hot} />
            </Pressable>
          </>
        )}
      </View>
    </Pressable>
  );

  return (
    <Screen title={t.carpetas.title} scrollable={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.ink} />
        </Pressable>
        <PillButton label={t.carpetas.add} icon="plus" onPress={handleOpenAdd} />
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapperStyle}
        contentContainerStyle={styles.listContent}
      />

      <BottomSheet visible={formVisible} onClose={() => setFormVisible(false)}>
        <View style={styles.sheetContent}>
          <AppText variant="title" style={styles.sheetTitle}>
            {editingCat ? t.carpetas.rename : t.carpetas.add}
          </AppText>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.bg, color: colors.ink, borderColor: colors.cardBorder },
            ]}
            value={catName}
            onChangeText={setCatName}
            placeholder="Nombre de la carpeta"
            placeholderTextColor={colors.mute}
            autoFocus
          />

          <AppText variant="caption" color="mute" style={styles.label}>
            Color
          </AppText>
          <View style={styles.optionsRow}>
            {colorOptions.map((c) => (
              <Pressable
                key={c}
                onPress={() => setCatColor(c)}
                style={[
                  styles.colorDot,
                  { backgroundColor: c },
                  catColor === c && styles.selectedRing,
                ]}
              />
            ))}
          </View>

          <AppText variant="caption" color="mute" style={styles.label}>
            Icono
          </AppText>
          <View style={styles.optionsRow}>
            {iconOptions.map((ic) => (
              <Pressable
                key={ic}
                onPress={() => setCatIcon(ic)}
                style={[
                  styles.iconDot,
                  {
                    backgroundColor: colors.bg,
                    borderColor: catIcon === ic ? colors.electricBlue : colors.cardBorder,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name={ic as any}
                  size={24}
                  color={catIcon === ic ? colors.electricBlue : colors.mute}
                />
              </Pressable>
            ))}
          </View>

          <PillButton label="Guardar" onPress={handleSave} style={styles.saveBtn} />
        </View>
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  backBtn: {
    padding: 8,
    marginLeft: -8,
  },
  columnWrapperStyle: {
    gap: spacing.md,
  },
  listContent: {
    paddingBottom: 40,
    gap: spacing.md,
  },
  card: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  cardContent: {
    flex: 1,
    marginBottom: spacing.sm,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 4,
  },
  actionBtn: {
    padding: spacing.sm,
  },
  sheetContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  sheetTitle: {
    marginBottom: spacing.lg,
  },
  input: {
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    marginBottom: spacing.lg,
  },
  label: {
    marginBottom: spacing.sm,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  selectedRing: {
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  iconDot: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtn: {
    marginTop: spacing.md,
  },
});
