import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';
import MapContent from '@/src/components/MapContent';
import { useQuakes } from '@/src/hooks/useQuakes';

export default function MapScreen() {
  const { t } = useTranslation();
  const { quakes, loading } = useQuakes();

  return (
    <View style={styles.safe}>
      <MapContent quakes={quakes} loading={loading} />

      <View style={styles.headerWrapper}>
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <Text 
              style={styles.title}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {t('tabs.map')}
            </Text>
            <Text style={styles.subtitle}>{t('map.subtitle', { count: quakes.length })}</Text>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#050510',
  },
  headerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
    marginTop: 4,
    fontWeight: '600',
  },
});

