import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  active: boolean;
  onPress: () => void;
}

const SIZE = 170;

export function SOSButton({ active, onPress }: Props) {
  const scale1 = useRef(new Animated.Value(1)).current;
  const scale2 = useRef(new Animated.Value(1)).current;
  const opacity1 = useRef(new Animated.Value(0)).current;
  const opacity2 = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!active) {
      if (timer.current) clearTimeout(timer.current);
      [scale1, scale2].forEach(s => { s.stopAnimation(); s.setValue(1); });
      [opacity1, opacity2].forEach(o => { o.stopAnimation(); o.setValue(0); });
      return;
    }

    const pulse = (s: Animated.Value, o: Animated.Value) =>
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(s, { toValue: 1.7, duration: 1100, useNativeDriver: true }),
            Animated.timing(o, { toValue: 0, duration: 1100, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(s, { toValue: 1, duration: 0, useNativeDriver: true }),
            Animated.timing(o, { toValue: 0.35, duration: 0, useNativeDriver: true }),
          ]),
        ])
      );

    opacity1.setValue(0.35);
    pulse(scale1, opacity1).start();
    timer.current = setTimeout(() => {
      opacity2.setValue(0.35);
      pulse(scale2, opacity2).start();
    }, 450);

    return () => {
      if (timer.current) clearTimeout(timer.current);
      [scale1, scale2, opacity1, opacity2].forEach((a) => a.stopAnimation());
    };
  }, [active, scale1, scale2, opacity1, opacity2]);

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[
          styles.ring,
          { opacity: opacity1, transform: [{ scale: scale1 }] },
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          { opacity: opacity2, transform: [{ scale: scale2 }] },
        ]}
      />
      <TouchableOpacity
        style={[styles.button, active && styles.buttonActive]}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <Text style={styles.label}>SOS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: SIZE * 1.9,
    height: SIZE * 1.9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: '#FF1744',
  },
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: '#7B0018',
    borderWidth: 3,
    borderColor: '#FF1744',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF1744',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 14,
  },
  buttonActive: {
    backgroundColor: '#C62828',
    shadowOpacity: 1,
    shadowRadius: 28,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 50,
    fontWeight: '900',
    letterSpacing: 4,
  },
});
