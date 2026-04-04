import React from 'react';
import {
  Alert,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';
import { SOSButton } from '@/src/components/SOSButton';
import { useSOS } from '@/src/hooks/useSOS';

export default function SOSScreen() {
  const { t } = useTranslation();
  const { active, toggle, stop } = useSOS();

  const callEmergency = () => {
    const url = Platform.OS === 'ios' ? 'telprompt://112' : 'tel:112';
    Linking.openURL(url).catch(() => {
      Alert.alert(t('sos.callConfirmTitle'), 'tel:112');
    });
  };

  const handleSOS = () => {
    if (!active) {
      toggle();
      Alert.alert(
        t('sos.callConfirmTitle'),
        t('sos.callConfirmMessage'),
        [
          { text: t('sos.callConfirmNo'), style: 'cancel' },
          { text: t('sos.callConfirmYes'), style: 'destructive', onPress: callEmergency },
        ]
      );
    } else {
      stop();
    }
  };

  return (
    <View style={styles.safe}>
      <View style={[styles.body, { paddingTop: 120 }]}>
        <View style={[styles.statusCard, active && styles.statusCardActive]}>
          <View style={[styles.statusDot, active && styles.statusDotActive]} />
          <Text style={[styles.statusText, active && styles.statusTextActive]}>
            {active ? t('sos.vibrating') : t('sos.info')}
          </Text>
        </View>

        <SOSButton active={active} onPress={handleSOS} />

        <View style={styles.actions}>
          {active && (
            <TouchableOpacity style={styles.stopBtn} onPress={stop} activeOpacity={0.8}>
              <Text style={styles.stopBtnText}>{t('sos.stopVibration')}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.callBtn} onPress={callEmergency} activeOpacity={0.8}>
            <Text style={styles.callBtnText}>📞  {t('sos.callEmergency')}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.emergencyBg}>112</Text>
      </View>

      <View style={styles.headerWrapper}>
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <Text 
              style={styles.title}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {t('sos.title')}
            </Text>
            <Text style={styles.subtitle}>{t('sos.subtitle')}</Text>
          </View>
        </SafeAreaView>
      </View>
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
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 32,
    paddingBottom: 60,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    maxWidth: 320,
    width: '100%',
    gap: 12,
  },
  statusCardActive: {
    borderColor: '#FF1744',
    backgroundColor: '#2A0008',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#555770',
    flexShrink: 0,
  },
  statusDotActive: {
    backgroundColor: '#FF1744',
  },
  statusText: {
    flex: 1,
    color: '#6B7094',
    fontSize: 12,
    lineHeight: 17,
  },
  statusTextActive: {
    color: '#FF8A80',
  },
  actions: {
    width: '100%',
    gap: 12,
    alignItems: 'center',
  },
  stopBtn: {
    width: '100%',
    backgroundColor: '#1C1C35',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#252550',
  },
  stopBtnText: {
    color: '#E0E0F0',
    fontSize: 16,
    fontWeight: '600',
  },
  callBtn: {
    width: '100%',
    backgroundColor: '#0A3D1A',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1A6B35',
  },
  callBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  emergencyBg: {
    position: 'absolute',
    bottom: -10,
    color: '#FFFFFF',
    fontSize: 96,
    fontWeight: '900',
    letterSpacing: 12,
    opacity: 0.03,
    zIndex: -1,
  },
});
