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
    outputRange: ['#1C1C35', '#252550'],
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
        Animated.timing(anim, { toValue: 1, duration: 900, useNativeDriver: false }),
        Animated.timing(anim, { toValue: 0, duration: 900, useNativeDriver: false }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [anim]);

  return (
    <View style={styles.card}>
      <View style={styles.stripe} />
      <View style={styles.badge}>
        <SkeletonBlock width={40} height={30} borderRadius={6} anim={anim} />
        <SkeletonBlock width={32} height={8} borderRadius={4} anim={anim} />
      </View>
      <View style={styles.info}>
        <SkeletonBlock width="90%" height={13} anim={anim} />
        <View style={{ height: 4 }} />
        <SkeletonBlock width="60%" height={13} anim={anim} />
        <View style={{ height: 8 }} />
        <View style={styles.tags}>
          <SkeletonBlock width={70} height={22} borderRadius={6} anim={anim} />
          <SkeletonBlock width={70} height={22} borderRadius={6} anim={anim} />
          <SkeletonBlock width={60} height={22} borderRadius={6} anim={anim} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#14142A',
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1C1C35',
  },
  stripe: {
    width: 4,
    backgroundColor: '#1C1C35',
  },
  badge: {
    width: 74,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 6,
  },
  info: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 12,
    paddingLeft: 10,
    justifyContent: 'center',
  },
  tags: {
    flexDirection: 'row',
    gap: 5,
  },
});
