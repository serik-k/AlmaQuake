import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import MapContent from '@/src/components/MapContent';
import { useQuakes } from '@/src/hooks/useQuakes';

export default function MapScreen() {
  const { quakes, loading } = useQuakes();

  return (
    <SafeAreaView style={styles.safe}>
      <MapContent quakes={quakes} loading={loading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#050510',
  },
});
