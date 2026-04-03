import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function MapContent(_props: { quakes?: unknown[]; loading?: boolean }) {
  return (
    <View style={styles.content}>
      <Text style={styles.icon}>🗺️</Text>
      <Text style={styles.message}>Карта доступна только в мобильном приложении</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: '#0B0B18',
  },
  icon: {
    fontSize: 48,
  },
  message: {
    color: '#555770',
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
