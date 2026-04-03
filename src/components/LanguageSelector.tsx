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
    backgroundColor: '#0D0D1E',
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
    borderColor: '#252550',
    gap: 2,
  },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 7,
  },
  btnActive: {
    backgroundColor: '#4361EE',
  },
  label: {
    color: '#555770',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  labelActive: {
    color: '#FFFFFF',
  },
});
