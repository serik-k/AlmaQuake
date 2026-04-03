import React, { useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { QuakeCard } from '@/src/components/QuakeCard';
import { SkeletonCard } from '@/src/components/SkeletonCard';
import { QuakeDetailSheet } from '@/src/components/QuakeDetailSheet';
import { FilterBar } from '@/src/components/FilterBar';
import { SeismographAnimation } from '@/src/components/SeismographAnimation';
import { LanguageSelector } from '@/src/components/LanguageSelector';
import { useQuakes } from '@/src/hooks/useQuakes';
import { useFilter } from '@/src/hooks/useFilter';
import type { Quake } from '@/src/api/quakes.api';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { quakes, loading, error, lastUpdate, refresh } = useQuakes();
  const { filtered, sort, setSort, minMag, setMinMag } = useFilter(quakes);
  const [selected, setSelected] = useState<Quake | null>(null);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const ListHeader = () =>
    lastUpdate ? (
      <View style={styles.updateRow}>
        <View style={styles.liveDot} />
        <Text style={styles.updateText}>
          {t('home.lastUpdate')} {formatTime(lastUpdate)}
        </Text>
      </View>
    ) : null;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>{t('home.title')}</Text>
          <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
        </View>
        <LanguageSelector />
      </View>

      <FilterBar
        sort={sort}
        minMag={minMag}
        onSortChange={setSort}
        onMinMagChange={setMinMag}
      />

      {loading && quakes.length === 0 ? (
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
        <FlatList<Quake>
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <QuakeCard quake={item} onPress={setSelected} />
          )}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={
            quakes.length === 0 ? styles.emptyContainer : styles.list
          }
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refresh}
              tintColor="#4361EE"
              colors={['#4361EE']}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <SeismographAnimation color="#4361EE" />
              <Text style={styles.emptyText}>{t('home.empty')}</Text>
              <Text style={styles.hint}>{t('home.emptyHint')}</Text>
            </View>
          }
        />
      )}

      <QuakeDetailSheet quake={selected} onClose={() => setSelected(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0B0B18',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C35',
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: '#555770',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  updateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00E676',
  },
  updateText: {
    color: '#555770',
    fontSize: 11,
    fontWeight: '500',
  },
  list: {
    paddingBottom: 24,
  },
  emptyContainer: {
    flexGrow: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 10,
  },
  bigIcon: {
    fontSize: 52,
    marginBottom: 4,
  },
  errorIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#2A0A00',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  errorIconText: {
    fontSize: 32,
  },
  emptyText: {
    color: '#E0E0F0',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorText: {
    color: '#FF5252',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  hint: {
    color: '#555770',
    fontSize: 12,
    textAlign: 'center',
  },
});
