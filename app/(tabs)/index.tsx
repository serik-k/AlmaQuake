import React, { useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { QuakeCard } from '@/src/components/QuakeCard';
import { SkeletonCard } from '@/src/components/SkeletonCard';
import { QuakeDetailSheet } from '@/src/components/QuakeDetailSheet';
import { FilterBar } from '@/src/components/FilterBar';
import { SeismographAnimation } from '@/src/components/SeismographAnimation';
import { LanguageSelector } from '@/src/components/LanguageSelector';
import { useQuakes } from '@/src/hooks/useQuakes';
import { useFilter } from '@/src/hooks/useFilter';
import { BlurView } from 'expo-blur';
import type { Quake } from '@/src/api/quakes.api';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { selectedId } = useLocalSearchParams<{ selectedId?: string }>();
  const { quakes, loading, error, lastUpdate, refresh } = useQuakes();
  const { filtered, sort, setSort, minMag, setMinMag } = useFilter(quakes);
  const [selected, setSelected] = React.useState<Quake | null>(null);

  // When selectedId changes (from notification), find and open it
  React.useEffect(() => {
    if (selectedId && quakes.length > 0) {
      const found = quakes.find((q) => q.id === selectedId);
      if (found) {
        setSelected(found);
      }
    }
  }, [selectedId, quakes]);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={styles.safe}>
      <FlatList<Quake>
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <QuakeCard quake={item} onPress={setSelected} />
        )}
        contentContainerStyle={
          quakes.length === 0 ? styles.emptyContainer : styles.list
        }
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            tintColor="#4361EE"
            colors={['#4361EE']}
            progressViewOffset={160}
          />
        }
        ListEmptyComponent={
          loading && quakes.length === 0 ? (
            <>
              {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
            </>
          ) : error && quakes.length === 0 ? (
            <View style={styles.center}>
              <View style={styles.errorIconWrap}>
                <Text style={styles.errorIconText}>⚠️</Text>
              </View>
              <Text style={styles.errorText}>{t('home.error')}</Text>
            </View>
          ) : (
            <View style={styles.center}>
              <SeismographAnimation color="#4361EE" />
              <Text style={styles.emptyText}>{t('home.empty')}</Text>
              <Text style={styles.hint}>{t('home.emptyHint')}</Text>
            </View>
          )
        }
      />

      <View style={styles.headerWrapper}>
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.headerLeft}>
                <Text 
                  style={styles.title} 
                  numberOfLines={1} 
                  adjustsFontSizeToFit
                >
                  {t('home.title')}
                </Text>
                <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
              </View>
              <LanguageSelector />
            </View>
            {lastUpdate && (
              <View style={styles.updateRow}>
                <View style={styles.liveDot} />
                <Text style={styles.updateText}>
                  {t('home.lastUpdate')} {formatTime(lastUpdate)}
                </Text>
              </View>
            )}
            <FilterBar
              sort={sort}
              minMag={minMag}
              onSortChange={setSort}
              onMinMagChange={setMinMag}
            />
          </View>
        </SafeAreaView>
      </View>

      <QuakeDetailSheet quake={selected} onClose={() => setSelected(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#000000',
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
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  headerLeft: {
    flex: 1,
    marginRight: 16,
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
  updateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00E676',
    shadowColor: '#00E676',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  updateText: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  list: {
    paddingTop: 160,
    paddingBottom: 140,
  },
  emptyContainer: {
    flexGrow: 1,
    paddingTop: 160,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 20,
  },
  hint: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  errorIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 82, 82, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  errorIconText: {
    fontSize: 32,
  },
  errorText: {
    color: '#FF5252',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '700',
  },
});
