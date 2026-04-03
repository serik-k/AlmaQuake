import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import MapContent from '@/src/components/MapContent';

export default function MapScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <MapContent />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0B0B18',
  },
});
