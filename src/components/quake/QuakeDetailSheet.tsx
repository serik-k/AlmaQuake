import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Linking,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import type { Quake } from '../../types/quake.types';

interface Props {
  quake: Quake | null;
  onClose: () => void;
}

function getSeverityColor(mag: number): string {
  if (mag >= 5.0) return '#FF1744';
  if (mag >= 3.5) return '#FF7043';
  if (mag >= 2.5) return '#FFC107';
  return '#00E676';
}

export function QuakeDetailSheet({ quake, onClose }: Props) {
  const { t, i18n } = useTranslation();
  const translateY = useRef(new Animated.Value(500)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const formatDate = (ms: number) => {
    const locale = i18n.language === 'kk' ? 'kk-KZ' : i18n.language === 'en' ? 'en-US' : 'ru-RU';
    return new Date(ms).toLocaleString(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    if (quake) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 20,
          stiffness: 200,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 500, duration: 250, useNativeDriver: true }),
        Animated.timing(backdropOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [backdropOpacity, quake, translateY]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 500, duration: 220, useNativeDriver: true }),
      Animated.timing(backdropOpacity, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(onClose);
  };

  const openUSGS = () => {
    if (!quake) return;
    Linking.openURL(`https://earthquake.usgs.gov/earthquakes/eventpage/${quake.id}`);
  };

  if (!quake) return null;

  const color = getSeverityColor(quake.magnitude);

  const Row = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );

  return (
    <Modal transparent visible={!!quake} onRequestClose={handleClose} statusBarTranslucent>
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
        <View style={styles.handle} />

        <View style={styles.magRow}>
          <View style={[styles.magBadge, { borderColor: color }]}>
            <Text style={[styles.magNum, { color }]}>{quake.magnitude.toFixed(1)}</Text>
          </View>
          <View style={styles.magInfo}>
            <Text style={styles.place} numberOfLines={2}>{quake.place}</Text>
            <Text style={styles.date}>{formatDate(quake.time)}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.details}>
          <Row
            label={t('quake.distance')}
            value={`${quake.distanceKm} ${t('quake.km')}`}
          />
          <Row
            label={t('quake.depth')}
            value={`${quake.depthKm.toFixed(1)} ${t('quake.km')}`}
          />
          <Row
            label={t('quake.coordinates')}
            value={`${quake.lat.toFixed(3)}, ${quake.lng.toFixed(3)}`}
          />
          <Row label="ID" value={quake.id} />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.usgsBtn} onPress={openUSGS} activeOpacity={0.8}>
            <Text style={styles.usgsBtnText}>{t('quake.openUSGS')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeBtn} onPress={handleClose} activeOpacity={0.8}>
            <Text style={styles.closeBtnText}>{t('quake.close')}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#111118',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: Platform.OS === 'ios' ? 44 : 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 20,
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  magRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 18,
    marginBottom: 24,
  },
  magBadge: {
    width: 68,
    height: 68,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  magNum: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  magInfo: {
    flex: 1,
  },
  place: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
    marginBottom: 4,
    letterSpacing: -0.4,
  },
  date: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  divider: {
    height: 0.5,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginHorizontal: 24,
    marginBottom: 24,
  },
  details: {
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 14,
    borderRadius: 14,
  },
  rowLabel: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rowValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  actions: {
    paddingHorizontal: 24,
    gap: 12,
  },
  usgsBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  usgsBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  closeBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    opacity: 0.8,
  },
});
