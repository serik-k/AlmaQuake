import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import type { MinMag, SortKey } from '../../hooks/useFilter';

interface Props {
  sort: SortKey;
  minMag: MinMag;
  onSortChange: (s: SortKey) => void;
  onMinMagChange: (m: MinMag) => void;
}

export function FilterBar({ sort, minMag, onSortChange, onMinMagChange }: Props) {
  const { t } = useTranslation();

  const SORTS: { key: SortKey; label: string; icon: string }[] = [
    { key: 'time', label: t('filter.time'), icon: '🕐' },
    { key: 'magnitude', label: t('filter.magnitude'), icon: '📊' },
    { key: 'distance', label: t('filter.distance'), icon: '📍' },
  ];

  const MAG_FILTERS: { value: MinMag; label: string }[] = [
    { value: 1.0, label: t('filter.all') },
    { value: 2.5, label: '≥2.5' },
    { value: 3.5, label: '≥3.5' },
    { value: 5.0, label: '≥5.0' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        <View style={styles.group}>
          {SORTS.map((s) => (
            <TouchableOpacity
              key={s.key}
              style={[styles.chip, sort === s.key && styles.chipActive]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onSortChange(s.key);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, sort === s.key && styles.chipTextActive]}>
                {s.icon} {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.group}>
          {MAG_FILTERS.map((m) => (
            <TouchableOpacity
              key={String(m.value)}
              style={[styles.chip, minMag === m.value && styles.chipMagActive]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onMinMagChange(m.value);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, minMag === m.value && styles.chipTextActive]}>
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  row: {
    paddingHorizontal: 20,
    gap: 8,
    alignItems: 'center',
  },
  group: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    padding: 3,
    gap: 2,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  chipActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  chipMagActive: {
    backgroundColor: '#FF7043',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  chipText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  chipTextActive: {
    color: '#000000',
  },
});
