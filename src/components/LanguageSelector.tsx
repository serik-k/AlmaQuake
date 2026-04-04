import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const LANGS = ['ru', 'kk', 'en'] as const;

export function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const current = i18n.language;

  const handleChange = (lang: string) => {
    i18n.changeLanguage(lang);
    AsyncStorage.setItem('lang', lang);
  };

  return (
    <View style={styles.container}>
      {LANGS.map((lang) => (
        <TouchableOpacity
          key={lang}
          onPress={() => handleChange(lang)}
          style={[styles.btn, current === lang && styles.btnActive]}
          activeOpacity={0.7}
        >
          <Text style={[styles.label, current === lang && styles.labelActive]}>
            {t(`language.${lang}`)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 3,
  },
  btn: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 10,
    width: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnActive: {
    backgroundColor: '#4361EE',
    shadowColor: '#4361EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  labelActive: {
    color: '#FFFFFF',
  },
});
