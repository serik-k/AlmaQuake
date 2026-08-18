import { SOSButton } from '@/src/components/common/SOSButton';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Linking,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export default function SOSScreen() {
  const { t } = useTranslation();
  const tabBarHeight = useBottomTabBarHeight();

  const callEmergency = () => {
    const url = Platform.OS === 'ios' ? 'telprompt://112' : 'tel:112';
    Linking.openURL(url).catch(() => {
      Alert.alert(t('sos.callConfirmTitle'), 'tel:112');
    });
  };

  const handlePress = () => {
    Alert.alert(
      t('sos.callConfirmTitle'),
      t('sos.callConfirmMessage'),
      [
        { text: t('sos.callConfirmNo'), style: 'cancel' },
        { text: t('sos.callConfirmYes'), style: 'destructive', onPress: callEmergency },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#05050A', '#0A0A1F', '#05050A']}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.body, { paddingTop: 120, paddingBottom: tabBarHeight }]}>
        <View style={styles.content}>
          <SOSButton onPress={handlePress} />

          <View style={styles.infoWrapper}>
            <Text style={styles.infoText}>{t('sos.info')}</Text>
          </View>
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
  container: {
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
  },
  content: {
    alignItems: 'center',
    gap: 40,
    width: '100%',
  },
  infoWrapper: {
    paddingHorizontal: 32,
  },
  infoText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '500',
  },
  emergencyBg: {
    position: 'absolute',
    bottom: 100,
    color: '#FFFFFF',
    fontSize: 100,
    fontWeight: '900',
    letterSpacing: 10,
    opacity: 0.03,
    zIndex: -1,
  },
});
