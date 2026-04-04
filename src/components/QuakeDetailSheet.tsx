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
import type { Quake } from '../api/quakes.api';

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

function formatDate(ms: number): string {
  return new Date(ms).toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
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
  }, [quake]);

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
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#14142A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 36,
    borderWidth: 1,
    borderColor: '#252550',
    borderBottomWidth: 0,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#252550',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  magRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 14,
    marginBottom: 20,
  },
  magBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  magNum: {
    fontSize: 24,
    fontWeight: '800',
  },
  magInfo: {
    flex: 1,
  },
  place: {
    color: '#E8E8F0',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 4,
  },
  date: {
    color: '#555770',
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#1C1C35',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  details: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    color: '#555770',
    fontSize: 13,
  },
  rowValue: {
    color: '#E8E8F0',
    fontSize: 13,
    fontWeight: '600',
  },
  actions: {
    paddingHorizontal: 20,
    gap: 10,
  },
  usgsBtn: {
    backgroundColor: '#1C2060',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4361EE',
  },
  usgsBtnText: {
    color: '#7B9EFF',
    fontSize: 14,
    fontWeight: '700',
  },
  closeBtn: {
    backgroundColor: '#1C1C35',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#8892B0',
    fontSize: 14,
    fontWeight: '600',
  },
});
