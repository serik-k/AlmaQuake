import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TabLayout() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const tabBarHeight = insets.bottom + 54;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4361EE',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.4)',
        tabBarStyle: {
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(5, 5, 16, 0.9)',
          position: 'absolute',
          borderTopColor: 'rgba(255, 255, 255, 0.1)',
          borderTopWidth: 0.5,
          height: tabBarHeight,
          paddingBottom: insets.bottom,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 4,
          textTransform: 'uppercase',
          letterSpacing: 0.2,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="waveform.path.ecg" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: t('tabs.tips'),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="book.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sos"
        options={{
          title: t('tabs.sos'),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="sos" color={color} />
          ),
          tabBarActiveTintColor: '#FF1744',
        }}
      />
    </Tabs>
  );
}
