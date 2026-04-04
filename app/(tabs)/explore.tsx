import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

type Section = 'before' | 'during' | 'after' | 'bag';

const SECTIONS: { key: Section; icon: string; color: string }[] = [
  { key: 'before', icon: '📋', color: '#4361EE' },
  { key: 'during', icon: '🏃', color: '#FF7043' },
  { key: 'after', icon: '🔍', color: '#00BFA5' },
  { key: 'bag', icon: '🎒', color: '#AB47BC' },
];

export default function TipsScreen() {
  const { t } = useTranslation();
  const [open, setOpen] = useState<Section>('before');

  const toggle = (key: Section) => setOpen((prev) => (prev === key ? 'before' : key));

  return (
    <View style={styles.safe}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: 140 }]}
        showsVerticalScrollIndicator={false}
      >
        {SECTIONS.map(({ key, icon, color }) => {
          const isOpen = open === key;
          const items = t(`tips.${key}`, { returnObjects: true }) as string[];
          return (
            <View
              key={key}
              style={[styles.section, isOpen && { borderColor: color + '55' }]}
            >
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => toggle(key)}
                activeOpacity={0.75}
              >
                <View style={[styles.iconBadge, { backgroundColor: color + '22' }]}>
                  <Text style={styles.sectionIcon}>{icon}</Text>
                </View>
                <Text style={styles.sectionTitle}>{t(`tips.sections.${key}`)}</Text>
                <View style={[styles.chevronBadge, isOpen && { backgroundColor: color + '22' }]}>
                  <Text style={[styles.chevron, isOpen && { color }]}>
                    {isOpen ? '▲' : '▼'}
                  </Text>
                </View>
              </TouchableOpacity>

              {isOpen && (
                <View style={styles.itemsContainer}>
                  {items.map((item, idx) => (
                    <View key={`${key}-${idx}`} style={styles.item}>
                      <View style={[styles.numBadge, { backgroundColor: color + '22' }]}>
                        <Text style={[styles.numText, { color }]}>{idx + 1}</Text>
                      </View>
                      <Text style={styles.itemText}>{item}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.headerWrapper}>
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <Text 
              style={styles.title}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {t('tips.title')}
            </Text>
            <Text style={styles.subtitle}>{t('tips.subtitle')}</Text>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 48,
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
  scroll: {
    padding: 16,
    gap: 12,
    paddingBottom: 200,
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
  section: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sectionIcon: {
    fontSize: 18,
  },
  sectionTitle: {
    flex: 1,
    color: '#E8E8F0',
    fontSize: 15,
    fontWeight: '600',
  },
  chevronBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1C1C35',
  },
  chevron: {
    color: '#555770',
    fontSize: 10,
    fontWeight: '700',
  },
  itemsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#1C1C35',
    padding: 14,
    gap: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  numBadge: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  numText: {
    fontSize: 11,
    fontWeight: '800',
  },
  itemText: {
    flex: 1,
    color: '#8892B0',
    fontSize: 13,
    lineHeight: 19,
  },
});
