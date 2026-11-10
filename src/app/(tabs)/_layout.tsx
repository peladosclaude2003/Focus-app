import { Tabs } from 'expo-router';

import { t } from '@/shared/i18n';
import { FloatingTabBar } from '@/shared/ui/FloatingTabBar';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        // Make the tab bar background transparent so content renders underneath it
        sceneStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.tabs.inicio,
          tabBarAccessibilityLabel: t.tabsA11y.inicio,
        }}
      />
      <Tabs.Screen
        name="hoy"
        options={{
          title: t.tabs.hoy,
          tabBarAccessibilityLabel: t.tabsA11y.hoy,
        }}
      />
      <Tabs.Screen
        name="racha"
        options={{
          title: t.tabs.racha,
          tabBarAccessibilityLabel: t.tabsA11y.racha,
        }}
      />
      <Tabs.Screen
        name="gym"
        options={{
          title: t.tabs.gym,
          tabBarAccessibilityLabel: t.tabsA11y.gym,
        }}
      />
      <Tabs.Screen
        name="ajustes"
        options={{
          title: t.tabs.ajustes,
          tabBarAccessibilityLabel: t.tabsA11y.ajustes,
        }}
      />
    </Tabs>
  );
}
