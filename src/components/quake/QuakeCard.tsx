import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { Quake } from '../../types/quake.types';

interface Props {
  quake: Quake;
  onPress?: (quake: Quake) => void;
}

function getSeverity(mag: number): { color: string; bg: string; key: string } {
  if (mag >= 5.0) return { color: '#FF1744', bg: '#3D0012', key: 'major' };
  if (mag >= 3.5) return { color: '#FF7043', bg: '#3A1500', key: 'strong' };
  if (mag >= 2.5) return { color: '#FFC107', bg: '#2A1E00', key: 'moderate' };
  return { color: '#00E676', bg: '#002A14', key: 'low' };
}

function formatTimeAgo(ms: number, t: (k: string, opts?: any) => string): string {
  const diff = Date.now() - ms;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return t('quake.justNow');
  if (minutes < 60) return t('quake.minutesAgo', { count: minutes });
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t('quake.hoursAgo', { count: hours });
  return t('quake.daysAgo', { count: Math.floor(hours / 24) });
}

export function QuakeCard({ quake, onPress }: Props) {
  const { t } = useTranslation();
  const sev = getSeverity(quake.magnitude);
  const timeAgo = formatTimeAgo(quake.time, t);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.(quake);
  };

  const [magWhole, magDecimal] = quake.magnitude.toFixed(1).split('.');

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.inner}>
        <View style={[styles.magContainer, { backgroundColor: sev.bg }]}>
          <Text style={[styles.mag, { color: sev.color }]}>
            {magWhole}<Text style={styles.magDecimal}>.{magDecimal}</Text>
          </Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.place} numberOfLines={2}>{quake.place}</Text>
          <View style={styles.tags}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>📍 {quake.distanceKm} {t('quake.km')}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>🕐 {timeAgo}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>↓ {quake.depthKm.toFixed(0)} {t('quake.km')}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.chevron}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111118',
    borderRadius: 22,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  inner: {
    flexDirection: 'row',
    padding: 18,
    alignItems: 'center',
  },
  magContainer: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  mag: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  magDecimal: {
    fontSize: 18,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  place: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
    lineHeight: 22,
    letterSpacing: -0.3,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  tagText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    lineHeight: 14,
  },
  chevron: {
    color: 'rgba(255, 255, 255, 0.2)',
    fontSize: 18,
    marginLeft: 10,
    fontWeight: '300',
  },
});
