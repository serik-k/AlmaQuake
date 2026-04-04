import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MapView, { Circle, Marker, UrlTile } from 'react-native-maps';
import { useTranslation } from 'react-i18next';
import * as Location from 'expo-location';
import { QuakeDetailSheet } from '@/src/components/QuakeDetailSheet';
import type { Quake } from '@/src/api/quakes.api';

interface Props {
  quakes: Quake[];
  loading: boolean;
}

const ALMATY = { latitude: 43.2565, longitude: 76.9286 };

function getMarkerColor(mag: number): string {
  if (mag >= 5.0) return '#FF1744';
  if (mag >= 3.5) return '#FF7043';
  if (mag >= 2.5) return '#FFC107';
  return '#00E676';
}

export default function MapContent({ quakes, loading }: Props) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<Quake | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        await Location.requestForegroundPermissionsAsync();
      } catch (e) {
        console.warn('[MapContent] Failed to request location permission', e);
      }
    })();
  }, []);

  return (
    <>
      <MapView
        style={styles.map}
        initialRegion={{
          ...ALMATY,
          latitudeDelta: 2.2,
          longitudeDelta: 2.2,
        }}
        mapType="none"
        showsUserLocation
        showsCompass={false}
        showsScale={false}
      >
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
          tileSize={256}
        />
        <Circle
          center={ALMATY}
          radius={100_000}
          strokeColor="#4361EE44"
          fillColor="#4361EE0A"
          strokeWidth={1.5}
        />

        <Marker coordinate={ALMATY} title="Алматы" anchor={{ x: 0.5, y: 0.5 }}>
          <View style={styles.almatyDot}>
            <View style={styles.almatyInner} />
          </View>
        </Marker>

        {quakes.map((q) => (
          <Marker
            key={q.id}
            coordinate={{ latitude: q.lat, longitude: q.lng }}
            onPress={() => setSelected(q)}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View
              style={[
                styles.quakeMarker,
                {
                  backgroundColor: getMarkerColor(q.magnitude),
                  width: Math.max(16, (q.magnitude ?? 0) * 8),
                  height: Math.max(16, (q.magnitude ?? 0) * 8),
                  borderRadius: Math.max(8, (q.magnitude ?? 0) * 4),
                },
              ]}
            >
              <Text style={styles.markerText}>{q.magnitude.toFixed(1)}</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      <View style={styles.legend}>
        {[
          { color: '#00E676', label: '<2.5' },
          { color: '#FFC107', label: '2.5–3.5' },
          { color: '#FF7043', label: '3.5–5.0' },
          { color: '#FF1744', label: '≥5.0' },
        ].map((item) => (
          <View key={item.label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.label}</Text>
          </View>
        ))}
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#4361EE" />
        </View>
      )}

      <QuakeDetailSheet quake={selected} onClose={() => setSelected(null)} />
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  almatyDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4361EE55',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#4361EE',
  },
  almatyInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4361EE',
  },
  quakeMarker: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  markerText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 10,
    backgroundColor: '#0B0B18',
    borderTopWidth: 1,
    borderTopColor: '#1C1C35',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    color: '#8892B0',
    fontSize: 11,
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 12,
    right: 16,
    zIndex: 10,
  },
});
