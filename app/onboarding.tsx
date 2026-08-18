import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SeismographAnimation } from '@/src/components/quake/SeismographAnimation';
import { LanguageSelector } from '@/src/components/common/LanguageSelector';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const flatRef = useRef<FlatList>(null);
  
  const SLIDES = [
    {
      key: 'welcome',
      icon: '🌏',
      title: t('onboarding.step1.title'),
      subtitle: t('onboarding.step1.subtitle'),
      color: '#4361EE',
    },
    {
      key: 'monitor',
      icon: null,
      title: t('onboarding.step2.title'),
      subtitle: t('onboarding.step2.subtitle'),
      color: '#00BFA5',
    },
    {
      key: 'sos',
      icon: '🆘',
      title: t('onboarding.step3.title'),
      subtitle: t('onboarding.step3.subtitle'),
      color: '#FF1744',
    },
  ];

  const dotAnims = useRef(SLIDES.map((_, i) => new Animated.Value(i === 0 ? 1 : 0))).current;

  const goTo = (i: number) => {
    flatRef.current?.scrollToIndex({ index: i, animated: true });
    dotAnims.forEach((a, idx) => {
      Animated.spring(a, {
        toValue: idx === i ? 1 : 0,
        useNativeDriver: false,
        damping: 15,
      }).start();
    });
    setIndex(i);
  };

  const finish = async () => {
    await AsyncStorage.setItem('onboarding_done', '1');
    router.replace('/(tabs)');
  };

  const isLast = index === SLIDES.length - 1;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <LanguageSelector />
      </View>

      <FlatList
        ref={flatRef}
        data={SLIDES}
        keyExtractor={(s) => s.key}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={[styles.iconWrap, { backgroundColor: item.color + '18' }]}>
              {item.icon ? (
                <Text style={styles.icon}>{item.icon}</Text>
              ) : (
                <SeismographAnimation color="#00BFA5" />
              )}
            </View>
            <Text style={[styles.title, { color: item.color }]}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => {
            const w = dotAnims[i].interpolate({ inputRange: [0, 1], outputRange: [6, 20] });
            const bg = dotAnims[i].interpolate({
              inputRange: [0, 1],
              outputRange: ['#252550', SLIDES[index].color],
            });
            return (
              <Animated.View key={i} style={[styles.dot, { width: w, backgroundColor: bg }]} />
            );
          })}
        </View>

        <View style={styles.buttons}>
          {!isLast && (
            <TouchableOpacity style={styles.skipBtn} onPress={finish} activeOpacity={0.7}>
              <Text style={styles.skipText}>{t('onboarding.skip')}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.nextBtn, { backgroundColor: SLIDES[index].color }]}
            onPress={() => (isLast ? finish() : goTo(index + 1))}
            activeOpacity={0.85}
          >
            <Text style={styles.nextText}>
              {isLast ? t('onboarding.start') : t('onboarding.next')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0B0B18',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    alignItems: 'flex-end',
    height: 50,
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 24,
  },
  iconWrap: {
    width: 140,
    height: 140,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: '#8892B0',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 24,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  buttons: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    alignItems: 'center',
  },
  skipBtn: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#14142A',
    borderWidth: 1,
    borderColor: '#252550',
  },
  skipText: {
    color: '#555770',
    fontSize: 15,
    fontWeight: '600',
  },
  nextBtn: {
    flex: 2,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 14,
  },
  nextText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
