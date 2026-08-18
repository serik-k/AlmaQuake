import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const BAR_WIDTH = 3;
const BAR_GAP = 3;

// Heights for a seismograph-like wave shape
const HEIGHTS = [
  4, 6, 4, 8, 5, 20, 40, 20, 8, 5, 4, 6,
  4, 6, 4, 8, 5, 28, 52, 28, 8, 5, 4, 6,
];

export function SeismographAnimation({ color = '#4361EE' }: { color?: string }) {
  const anims = useRef(HEIGHTS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const createWave = () => {
      const animations = anims.map((anim, i) =>
        Animated.sequence([
          Animated.delay(i * 40),
          Animated.loop(
            Animated.sequence([
              Animated.timing(anim, {
                toValue: 1,
                duration: 600 + i * 20,
                useNativeDriver: false,
              }),
              Animated.timing(anim, {
                toValue: 0,
                duration: 600 + i * 20,
                useNativeDriver: false,
              }),
            ])
          ),
        ])
      );
      const p = Animated.parallel(animations);
      p.start();
      return p;
    };

    const parallel = createWave();
    return () => {
      parallel.stop();
      anims.forEach((a) => a.stopAnimation());
    };
  }, [anims]);

  return (
    <View style={styles.container}>
      {anims.map((anim, i) => {
        const maxH = HEIGHTS[i];
        const height = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [Math.max(3, maxH * 0.3), maxH],
        });
        return (
          <Animated.View
            key={i}
            style={[
              styles.bar,
              {
                height,
                backgroundColor: color,
                opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.9] }),
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BAR_GAP,
    height: 60,
  },
  bar: {
    width: BAR_WIDTH,
    borderRadius: 2,
  },
});
