import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { Quake } from '../api/quakes.api';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.75}>
      <View style={[styles.stripe, { backgroundColor: sev.color }]} />

      <View style={[styles.badge, { backgroundColor: sev.bg }]}>
        <Text style={[styles.mag, { color: sev.color }]}>
          {quake.magnitude.toFixed(1)}
        </Text>
        <Text style={[styles.sevLabel, { color: sev.color }]}>
          {t(`quake.severity.${sev.key}`)}
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
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#14142A',
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#252550',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  stripe: {
    width: 4,
    alignSelf: 'stretch',
  },
  badge: {
    width: 74,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  mag: {
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 30,
  },
  sevLabel: {
    fontSize: 8,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 3,
    textAlign: 'center',
  },
  info: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 12,
    paddingLeft: 10,
    justifyContent: 'center',
  },
  place: {
    color: '#E8E8F0',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 18,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  tag: {
    backgroundColor: '#1C1C38',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#252550',
  },
  tagText: {
    color: '#6B7094',
    fontSize: 11,
    fontWeight: '500',
  },
});
