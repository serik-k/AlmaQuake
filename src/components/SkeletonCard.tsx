import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

function SkeletonBlock({
  width,
  height,
  borderRadius = 6,
  anim,
}: {
  width: number | string;
  height: number;
  borderRadius?: number;
  anim: Animated.Value;
}) {
  const bg = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#1A1A35', '#2A2A5A'],
  });
  return (
    <Animated.View
      style={{ width: width as number, height, borderRadius, backgroundColor: bg }}
    />
  );
}

export function SkeletonCard() {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 1000, useNativeDriver: false }),
        Animated.timing(anim, { toValue: 0, duration: 1000, useNativeDriver: false }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [anim]);

  return (
    <View style={styles.card}>
      <View style={styles.inner}>
        <View style={styles.magPlaceholder}>
          <SkeletonBlock width={1} height={1} anim={anim} />
        </View>
        <View style={styles.info}>
          <SkeletonBlock width="80%" height={16} borderRadius={8} anim={anim} />
          <View style={{ height: 12 }} />
          <View style={styles.tags}>
            <SkeletonBlock width={60} height={20} borderRadius={6} anim={anim} />
            <SkeletonBlock width={80} height={20} borderRadius={6} anim={anim} />
            <SkeletonBlock width={50} height={20} borderRadius={6} anim={anim} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111118',
    borderRadius: 22,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  inner: {
    flexDirection: 'row',
    padding: 18,
    alignItems: 'center',
  },
  magPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginRight: 16,
    overflow: 'hidden',
  },
  info: {
    flex: 1,
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
  },
});
