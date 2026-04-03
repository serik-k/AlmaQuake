import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { MinMag, SortKey } from '../hooks/useFilter';

interface Props {
  sort: SortKey;
  minMag: MinMag;
  onSortChange: (s: SortKey) => void;
  onMinMagChange: (m: MinMag) => void;
}

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'time',      label: '🕐 Время' },
  { key: 'magnitude', label: '📊 Магнитуда' },
  { key: 'distance',  label: '📍 Расстояние' },
];

const MAG_FILTERS: { value: MinMag; label: string }[] = [
  { value: 0,   label: 'Все' },
  { value: 2.5, label: '≥2.5' },
  { value: 3.5, label: '≥3.5' },
  { value: 5.0, label: '≥5.0' },
];

export function FilterBar({ sort, minMag, onSortChange, onMinMagChange }: Props) {
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
              onPress={() => onSortChange(s.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, sort === s.key && styles.chipTextActive]}>
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.group}>
          {MAG_FILTERS.map((m) => (
            <TouchableOpacity
              key={String(m.value)}
              style={[styles.chip, minMag === m.value && styles.chipMagActive]}
              onPress={() => onMinMagChange(m.value)}
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
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C35',
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
    alignItems: 'center',
  },
  group: {
    flexDirection: 'row',
    gap: 6,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: '#252550',
    marginHorizontal: 4,
  },
  chip: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#14142A',
    borderWidth: 1,
    borderColor: '#252550',
  },
  chipActive: {
    backgroundColor: '#1C2060',
    borderColor: '#4361EE',
  },
  chipMagActive: {
    backgroundColor: '#3A1500',
    borderColor: '#FF7043',
  },
  chipText: {
    color: '#555770',
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
});
