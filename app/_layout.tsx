import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'expo-dev-client';

import i18n from '@/src/i18n';
import '@/src/i18n';
import { setupNotifications } from '@/src/notifications/setup';
import { ToastProvider } from '@/src/context/ToastContext';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function prepare() {
      try {
        const [savedLang, onboardingDone] = await Promise.all([
          AsyncStorage.getItem('lang'),
          AsyncStorage.getItem('onboarding_done'),
        ]);
        if (savedLang && ['ru', 'kk', 'en'].includes(savedLang)) {
          await i18n.changeLanguage(savedLang);
        }
        setupNotifications();
        if (!onboardingDone) {
          setReady(true);
          SplashScreen.hideAsync();
          router.replace('/onboarding');
          return;
        }
      } finally {
        setReady(true);
        SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  if (!ready) return null;

  return (
    <ToastProvider>
      <ThemeProvider value={DarkTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false, animation: 'fade' }} />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </ToastProvider>
  );
}
